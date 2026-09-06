// netlify/functions/razorpay-webhook.js
//
// Razorpay -> MailerLite. When a kit is paid for on a Razorpay payment page, this
// function adds the buyer to the right MailerLite group (kit-pcb, kit-rrk, kit-eh,
// kit-bundle). The "joins a group" trigger in MailerLite then sends the delivery
// email (K0) and the rest of the kit-buyer sequence.
//
// Razorpay setup (Dashboard > Account & Settings > Webhooks > Add new webhook):
//   URL:     https://<your-site>/.netlify/functions/razorpay-webhook
//   Secret:  any long random string; put the same value in RZP_WEBHOOK_SECRET below
//   Events:  payment.captured
//
// Netlify environment variables:
//   RZP_WEBHOOK_SECRET   the secret you typed into the Razorpay webhook form
//   ML_API_KEY           MailerLite API token (same one the diagnostics function uses)
//   ML_GROUP_KIT_PCB     group id of kit-pcb
//   ML_GROUP_KIT_RRK     group id of kit-rrk
//   ML_GROUP_KIT_EH      group id of kit-eh
//   ML_GROUP_KIT_BUNDLE  group id of kit-bundle
//
// How a payment is matched to a kit: first by words in the payment description and
// notes (the payment page title travels there), then by amount as a fallback.
// Anything unmatched is logged and ignored, so a stray payment never triggers a
// wrong delivery email.

const crypto = require('crypto');

const KITS = [
  { key: 'BUNDLE', words: ['bundle', 'promotion kit'], amount: 199900, group: process.env.ML_GROUP_KIT_BUNDLE },
  { key: 'PCB',    words: ['case builder'],             amount: 99900,  group: process.env.ML_GROUP_KIT_PCB },
  { key: 'RRK',    words: ['review room'],              amount: 99900,  group: process.env.ML_GROUP_KIT_RRK },
  { key: 'EH',     words: ['executive hour'],           amount: 99900,  group: process.env.ML_GROUP_KIT_EH },
];

function matchKit(entity) {
  const text = [entity.description || '', ...Object.values(entity.notes || {})].join(' ').toLowerCase();
  for (const k of KITS) if (k.words.some((w) => text.includes(w))) return k;
  // amount fallback: only unambiguous for the bundle (the three single kits share a price)
  if (entity.amount === 199900) return KITS[0];
  return null;
}

function findEmail(entity) {
  if (entity.email) return entity.email;
  for (const v of Object.values(entity.notes || {})) if (typeof v === 'string' && v.includes('@')) return v;
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };

  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body || '';
  const sig = event.headers['x-razorpay-signature'] || event.headers['X-Razorpay-Signature'];
  const expected = crypto.createHmac('sha256', process.env.RZP_WEBHOOK_SECRET || '').update(raw).digest('hex');
  if (!sig || sig !== expected) return { statusCode: 401, body: 'bad signature' };

  let body;
  try { body = JSON.parse(raw); } catch { return { statusCode: 400, body: 'bad json' }; }
  if (body.event !== 'payment.captured') return { statusCode: 200, body: `ignored ${body.event}` };

  const entity = body.payload && body.payload.payment && body.payload.payment.entity;
  if (!entity) return { statusCode: 200, body: 'no payment entity' };

  const kit = matchKit(entity);
  const email = findEmail(entity);
  if (!kit || !kit.group || !email) {
    console.log('unmatched payment', entity.id, entity.amount, entity.description, entity.notes);
    return { statusCode: 200, body: 'unmatched, logged' };
  }

  const name = (entity.notes && (entity.notes.name || entity.notes['Full name'] || entity.notes['Name'])) || '';
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ML_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email: String(email).trim().toLowerCase(),
      fields: { ...(name ? { name } : {}), last_kit: kit.key.toLowerCase(), last_payment_id: entity.id },
      groups: [String(kit.group)],
      status: 'active',
    }),
  });
  const text = await res.text();
  if (!res.ok) { console.error('MailerLite error', res.status, text); return { statusCode: 502, body: text }; }
  return { statusCode: 200, body: `ok ${kit.key}` };
};
