# Website-to-MailerLite connection contract
This is an implementation specification, not a deployed integration. Email scheduling and delivery remain in MailerLite.

## Newsletter form
Input: name, email, explicit newsletter consent, consent wording version.
Write the consent timestamp and version. Set su2_first_route to newsletter only when no first marketing route exists. Associate su2-optin only after the fields are written. A native MailerLite embedded newsletter form may instead leave the route blank; the dispatcher treats blank as newsletter.

Never accept a browser-supplied claim that an address is already subscribed. Let MailerLite retain the actual subscriber status. Never send an API status=active update for an existing unsubscribed or suppressed contact.

## Test submission
The existing test submission includes test-id, test-version, answers and newsletter-consent. Server code must validate the option IDs against that version and recalculate the feedback. Do not trust a submitted score or HTML report.

Create a private report snapshot with an unguessable identifier. Keep report access separate from the marketing page, with no public listing and no email address in the URL. The report page is not included in this package.

For judgment, populate:
- su2_j_report_url
- su2_j_focus
- su2_j_version
- su2_j_submission_id

Use separate su2_v_* fields for visibility. Store a readable focus explanation, including all tied areas. Preserve the all-strongest-answer result without inventing a weakness.

Upsert the subscriber fields first. Only after success, add the relevant request group. Keep the first emailed report immutable while its automation may still be queued. Later attempts should retain their own on-screen/downloadable result without changing the first email snapshot.

If newsletter-consent is true, record the consent and set the first marketing route only if it is not already set. Add su2-optin last. A second test must not rewrite the first marketing route or restart entry.

Deduplicate form submissions by the submission ID. Serialize updates for a given subscriber, or use a durable idempotency/first-entry record, so simultaneous tests cannot race to create two introductory states.

## Example normalized event
{
  "submission_id": "unique-server-record-id",
  "email": "subscriber@example.com",
  "name": "Example",
  "test_id": "senior-level-judgment",
  "test_version": "actual-version-from-question-data",
  "report_email_requested": true,
  "newsletter_consent": false,
  "newsletter_consent_version": null
}

This example is not a production payload. Populate actual group IDs and actual field keys from the account.

## Purchases
Verify the provider notification on the server. Validate the product identity and successful payment state. Save the event ID to prevent duplicate processing.

Write the correct access URL and payment ID before adding the product's buyer group. Use a separate cohort code, dec2026, for the dated cohort onboarding. If a provider supplies a different contact email, define the reconciliation process explicitly before overwriting a subscriber.

Refunds and cancellations need a documented access/support process. Do not automatically remove buyer suppression and restart an acquisition sequence merely because a refund event arrives.

The browser thank-you page is a navigation destination. It must not assign buyer groups. A payment link click also must not assign buyer groups.

## Launch fallback
If verified provider automation is not yet available, use a manual daily reconciliation of confirmed purchases. Before any sales campaign, reconcile again and inspect the recipient exclusions. This creates a manual operating dependency; it does not provide immediate purchase suppression.

If the report service is not built yet, retain on-screen results and do not advertise emailed reports as live. HTML templates alone do not make that connection operational.
