"""Book sales states are rendered at build time, including without JavaScript."""
from html import escape
from urllib.parse import urlsplit


def validate_order(config):
    if not isinstance(config.get('preorders_open'), bool):
        raise ValueError('preorders_open must be true or false')
    if not config['preorders_open']:
        return
    for field in ('checkout_url', 'price_label', 'format_label', 'dispatch_note', 'shipping_note', 'cancellation_note'):
        if not isinstance(config.get(field), str) or not config[field].strip():
            raise ValueError(f'Book preorders require {field}')
    url = urlsplit(config['checkout_url'])
    if url.scheme != 'https' or not url.hostname or url.username or url.password:
        raise ValueError('Book checkout must be a public HTTPS URL without credentials')
    if url.hostname in ('localhost', 'example.com', 'example.org') or url.hostname.endswith('.example'):
        raise ValueError('Replace the example book checkout with a real payment link')
    if config['checkout_url'].rstrip('/') in ('https://tagmango.app/68942f6867', 'https://rzp.io/rzp/TSUTSLDec2026'):
        raise ValueError('Use a book-specific checkout, not the course or cohort checkout')


def render_book(template, config):
    validate_order(config)
    if config['preorders_open']:
        safe = {key: escape(str(value), quote=True) for key, value in config.items()}
        label = 'Pre-order the book'
        status = 'Preorders are open'
        note = f"{safe['format_label']} · {safe['price_label']}"
        order = f'''<div class="book-order-card" id="order-details">
<span class="eyebrow">Pre-order your copy</span><h3>{safe['format_label']}</h3>
<p class="book-price">{safe['price_label']}</p>
<dl class="book-order-details"><dt>Expected dispatch</dt><dd>{safe['dispatch_note']}</dd><dt>Delivery</dt><dd>{safe['shipping_note']}</dd><dt>Cancellations and refunds</dt><dd>{safe['cancellation_note']}</dd></dl>
<a class="btn book-btn" data-book-checkout href="{safe['checkout_url']}">Continue to secure checkout <span aria-hidden="true">↗</span></a>
<p class="fine">Review the total and delivery details before paying. Your payment provider will confirm your purchase. For order support, email <a href="mailto:hello@sayantannandi.com">hello@sayantannandi.com</a>.</p></div>'''
        answer = 'Yes. The price, expected dispatch and delivery details are listed above. Continue to the secure checkout to place your preorder.'
        heading = 'Choose your next chapter.'
        intro = 'Review the preorder details, then continue to checkout to order your copy.'
    else:
        label = 'Tell me when preorders open'
        status = 'Preorders opening soon'
        note = 'Get the price and release details when preorders open.'
        heading = 'Be first to hear about the book.'
        intro = 'Leave your name and email for the preorder announcement. You will get the price and delivery details before deciding whether to buy.'
        answer = 'Paid preorders are not open yet. Leave your email for the announcement. This does not place an order, reserve stock or take a payment.'
        order = '''<div class="book-order-card"><span class="eyebrow">The book announcement</span><h3>Let me know when it is ready.</h3>
<form name="sn-book-interest" method="POST" action="/book/updates-received" data-netlify="true" netlify-honeypot="bot-field" data-book-notify>
<input type="hidden" name="form-name" value="sn-book-interest"><input type="hidden" name="consent-version" value="sn-book-2026-10-12"><input type="hidden" name="consent" value="book-announcement-only">
<p hidden><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<label class="field" for="book-name">First name<input id="book-name" name="name" required autocomplete="given-name" maxlength="100"></label>
<label class="field" for="book-email">Email address<input id="book-email" name="email" type="email" required autocomplete="email" maxlength="254" placeholder="you@example.com"></label>
<button class="btn book-btn" type="submit">Tell me when preorders open <span aria-hidden="true">→</span></button>
<p class="fine book-consent">By submitting, you ask for the book’s preorder announcement. This does not subscribe you to the newsletter or place an order. <a href="/privacy#book-updates">Privacy details</a>.</p>
<p class="form-status" role="status" aria-live="polite"></p>
</form></div>'''
    values = dict(CTA=label, STATUS=status, ORDER_NOTE=note, ORDER=order,
                  ORDER_HEADING=heading, ORDER_INTRO=intro, ORDER_ANSWER=answer)
    for key, value in values.items():
        template = template.replace('{{' + key + '}}', value)
    return template
