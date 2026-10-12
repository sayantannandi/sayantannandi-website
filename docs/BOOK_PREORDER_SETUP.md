# Book preorder page

Public route: `/book`. The former forced `/book` to `/essays` redirect is removed. A shared navigation link, footer link and homepage book feature lead to the new page. The uploaded front cover is preserved at `assets/images/book-front.png`.

## Current state

The page says **Preorders opening soon**. It collects book-announcement requests through the separate Netlify form `sn-book-interest`. This is not an order, reservation or newsletter signup. No price, date, delivery promise or checkout URL has been invented.

The existing Netlify submission event handler ignores this form because it is not in the course/newsletter form map. Requests remain in Netlify Forms. No MailerLite group, email automation, payment webhook or notification setting has been changed. Before promising an announcement, arrange to monitor/export this form and send the requested announcement when the book is ready. There is no automatic confirmation email.

## Open paid preorders

Edit `scripts/content/book-order.json` with the author's confirmed commercial details:

- `checkout_url`: a dedicated HTTPS book checkout, not a course or cohort payment link. The checkout must handle the book payment and any necessary shipping address.
- `price_label`: the display price, including the currency and whether taxes are included.
- `format_label`: the actual edition/format for sale.
- `dispatch_note`: the expected dispatch date or window. Distinguish dispatch from delivery.
- `shipping_note`: the delivery regions and shipping charges, or whether shipping is included.
- `cancellation_note`: the book-specific cancellation/refund terms.
- Set `preorders_open` to `true` only after these details and the checkout are ready.

Build-time validation rejects missing fields, insecure checkout URLs, credentials in URLs, common example hosts and the two existing course/cohort payment links. Enabling sales replaces the announcement form with a normal hosted-checkout link and all supplied order details, even without JavaScript.

Use the payment provider's own payment-confirmation and fulfillment records. The public `/book/updates-received` page is only an announcement-form receipt and must not be used as proof of payment. Book fulfillment is not connected to the existing digital-course webhook.

## Validate and release

1. Run `python3 scripts/build_site.py` and `python3 scripts/validate_site.py`.
2. Run `python3 scripts/test_book.py` and `npm test`.
3. Run `python3 scripts/prepare_publish.py`.
4. Review `/book` on a deploy preview at mobile and desktop sizes. Confirm the image, navigation, page text and active purchase state.
5. After deploying, verify `sn-book-interest` is detected in Netlify Forms if announcements are enabled. Submit a test only with an owner-approved email; verify the saved request before relying on the form. Local tests simulate HTTP success/failure and do not prove hosted form delivery.
6. Before enabling paid orders, test the book checkout in the provider's test mode, including address collection, shipping, payment confirmation and fulfillment handoff. No real payment was made during development.

The page has no ISBN, publisher, price, publication date or review-rating structured data until those facts are available. The cover is artwork, not a shipping-format commitment.
