# Email delivery repair, 31 October 2026

## Implemented behavior

- Current quiz names are recognized by the server. Answers are validated and reports are recomputed with the same engines as the browser.
- Netlify retains the submitted form. MailerLite gets a single profile per email plus each requested source group. Newsletter consent is independent.
- Download-only guide requests now enter their own fulfillment group. They do not enter `SN | letter` unless the checkbox was explicitly selected.
- The book worksheets unlock after successful name/email capture. The older Starting Point Check reveals results only after successful capture, including network-error retry behavior.
- Coaching/call details remain in Netlify. Sensitive problem descriptions are not copied into MailerLite.
- Intake alone never assigns the customer or paid product groups. Verified purchases remain a separate path.
- Suppressed subscribers are not resubscribed. Failed API jobs stay queued. Group membership prevents repeated enrollment.

## Sending review state

New production workflows remain inactive until the author approves the email copy in `review.html` and reception tests. Existing newsletter and Judgment/Visibility report workflows remain active.

`netlify/functions/_shared/delivery-config.mjs` lists public group IDs and sets `DELIVERY_RELEASED=false`. New requests still save their profile and source memberships. Their queue jobs remain staged, and retry skips staged jobs until release. On release, the worker rejoins each staged delivery group once; a per-email/source dispatch marker prevents repeat rejoin from later queued attempts. The Review Room Kit purchase path is staged too.

Guide follow-ups must check newsletter membership immediately before each delayed email. Non-opted-in contacts receive only the specifically requested PDF. The newsletter welcome/essay path remains unchanged.

## Release after wording approval

1. Review dry-run warnings, email content, sender authentication and test reception.
2. Set each new production automation to non-repeatable, then activate it. Do not activate the QA workflow for general subscribers.
3. Change `DELIVERY_RELEASED` to true and deploy. Queue processing releases staged requests and records completion.
4. Check one report-only request, one guide without newsletter consent, and one explicit newsletter opt-in.
5. Reconcile API-imported historical source memberships separately: rejoin their delivery group once after release, honoring suppression and original request scope. Never rejoin the newsletter just to resend its welcome.

## Purchase verification boundaries

January onboarding still requires verified Razorpay mapping and `SN_JANUARY_FUNNEL_READY=true`. No payment was fabricated or customer membership inferred from intake. Private Meet/course/workbook access must be supplied through the existing fulfillment process. The legacy onboarding copy should be date-neutral; the new January workflow contains the confirmed January dates.

## Validation

- `npm test`
- `node scripts/test_starting_point.mjs`
- `node scripts/test_starting_ui.mjs`
- `node --test scripts/test_capture_gates.mjs`
- `node scripts/test_production.mjs`
- `node scripts/test_free_guides.mjs`

The author checks inbox/spam placement. API acceptance and sent statistics do not prove inbox delivery.
