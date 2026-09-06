// netlify/functions/submission-created.js
//
// ONE function, TWO ways in:
//   1. As a Netlify "event function". Because the file is named submission-created,
//      Netlify runs it automatically after every verified Netlify Forms submission.
//      Zero changes to the Part 1 and Part 2 pages. Netlify Forms keeps a backup log.
//   2. As a plain HTTP endpoint at /.netlify/functions/submission-created, if you
//      later change a page's fetch() target to post here directly (no Netlify Forms
//      quota). The same code handles both.
//
// What it does: reads the form name and fields, maps them to MailerLite custom
// fields, works out the routing field "track" (developing / advanced), and upserts
// the subscriber into the right lm-* group. The "joins a group" trigger in
// MailerLite then fires the results automation.
//
// Environment variables to set in Netlify (Site configuration > Environment variables):
//   ML_API_KEY            MailerLite API token (Integrations > API)
//   ML_GROUP_READINESS    group id of lm-readiness
//   ML_GROUP_CALIBRATION  group id of lm-calibration
//   ML_GROUP_INVMONTH     group id of lm-invisible-month
//   ML_GROUP_INVWORK      group id of lm-invisible-work
//   ML_GROUP_SCORECARD    group id of lm-scorecard
//   ML_GROUP_TRANSLATION  group id of lm-translation   (only if you route Part 3 through here)
//   ML_GROUP_DEPENDENCY   group id of lm-dependency    (only if you route Part 3 through here)
//   ML_GROUP_SIXTYFIVE    group id of lm-sixtyfive     (only if you route Part 3 through here)
//
// Group ids: MailerLite > Subscribers > Groups > open the group, the id is the number in the URL.

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace('%', ''));
  return Number.isFinite(n) ? n : null;
};

// form-name  ->  how to map it
const MAGNETS = {
  // ---------- Part 1 ----------
  'readiness-score': {
    group: process.env.ML_GROUP_READINESS,
    magnet: 'readiness',
    fields: (d) => {
      const weak = String(d.weakest_two || '').split(/\s*[&;,]\s*/);
      return {
        score: d.total,
        band: d.band,
        weak1: weak[0] || '',
        weak2: weak[1] || '',
        skill_scores: d.skill_scores,
      };
    },
    track: (d) => (num(d.total) !== null && num(d.total) >= 16 ? 'advanced' : 'developing'),
  },
  'calibration-test': {
    group: process.env.ML_GROUP_CALIBRATION,
    magnet: 'calibration',
    fields: (d) => ({ score: d.score, verdict: d.verdict, answers: d.answers }),
    track: (d) => (num(d.score) !== null && num(d.score) >= 5 ? 'advanced' : 'developing'),
  },
  'invisible-month': {
    group: process.env.ML_GROUP_INVMONTH,
    magnet: 'invisible-month',
    fields: (d) => ({ invpct: d.invisible_pct, items: d.items, visible: d.visible_items, checks: d.checks }),
    track: (d) => (num(d.invisible_pct) !== null && num(d.invisible_pct) > 50 ? 'developing' : 'advanced'),
  },
  // ---------- Part 2 ----------
  'invisible-work': {
    group: process.env.ML_GROUP_INVWORK,
    magnet: 'invisible-work',
    fields: (d) => ({ invisible_pct: d.invisible_pct, items: d.items, visible: d.visible, defensible: d.defensible }),
    track: (d) => (num(d.invisible_pct) !== null && num(d.invisible_pct) >= 35 ? 'developing' : 'advanced'),
  },
  'scorecard': {
    group: process.env.ML_GROUP_SCORECARD,
    magnet: 'scorecard',
    fields: (d) => ({ total: d.total, band: d.band, answers: d.answers }),
    track: (d) => (num(d.total) !== null && num(d.total) >= 15 ? 'advanced' : 'developing'),
  },
  // ---------- Part 3 (optional: only if you repoint those pages here) ----------
  'translation-test': {
    group: process.env.ML_GROUP_TRANSLATION,
    magnet: 'translation',
    fields: (d) => ({ tt_score: d.tt_score, tt_band: d.tt_band }),
    track: (d) => (d.tt_band === 'strong' ? 'advanced' : 'developing'),
  },
  'dependency-test': {
    group: process.env.ML_GROUP_DEPENDENCY,
    magnet: 'dependency',
    fields: (d) => ({ dt_score: d.dt_score, dt_band: d.dt_band, dt_missed: d.dt_missed }),
    track: (d) => (d.dt_band === 'strong' ? 'advanced' : 'developing'),
  },
  'sixty-five-percent-test': {
    group: process.env.ML_GROUP_SIXTYFIVE,
    magnet: 'sixtyfive',
    fields: (d) => ({ sf_score: d.sf_score, sf_band: d.sf_band, sf_answers: d.sf_answers }),
    track: (d) => (d.sf_band === 'strong' ? 'advanced' : 'developing'),
  },
};

function parseBody(event) {
  // Shape 1: Netlify Forms event. JSON with payload.data and payload.form_name.
  try {
    const j = JSON.parse(event.body);
    if (j && j.payload && j.payload.data) {
      return { formName: j.payload.form_name, data: j.payload.data };
    }
  } catch (_) { /* not JSON, fall through */ }
  // Shape 2: direct post from a page, application/x-www-form-urlencoded.
  const p = new URLSearchParams(event.body || '');
  const data = Object.fromEntries(p.entries());
  return { formName: data['form-name'], data };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };

  const { formName, data } = parseBody(event);
  const cfg = MAGNETS[formName];
  if (!cfg) return { statusCode: 200, body: `ignored form: ${formName}` };
  if (data['bot-field']) return { statusCode: 200, body: 'honeypot' };

  const email = String(data.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) return { statusCode: 400, body: 'no email' };
  if (!cfg.group) return { statusCode: 500, body: `no group id configured for ${formName}` };

  const fields = { name: data.name || '', ...cfg.fields(data), magnet: cfg.magnet, track: cfg.track(data) };
  // MailerLite rejects unknown field keys, so create every key above in Subscribers > Fields first.
  // Drop empty values so we never overwrite a good value with a blank.
  for (const k of Object.keys(fields)) if (fields[k] === undefined || fields[k] === null || fields[k] === '') delete fields[k];

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.ML_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // POST to /subscribers creates OR updates (upsert) by email. Existing subscribers keep
    // their other fields and groups; only what we send here changes.
    body: JSON.stringify({ email, fields, groups: [String(cfg.group)], status: 'active' }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('MailerLite error', res.status, text);
    return { statusCode: 502, body: text };
  }
  return { statusCode: 200, body: 'ok' };
};
