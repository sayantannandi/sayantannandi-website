# Step Up rebuild: rollout checklist

## Included in this branch

- New homepage, eight-module course, Skills Check, sample/brief, live cohort, newsletter, three essays, about, customer help and privacy.
- Cohort and course interest lists; newsletter consent separate from both.
- Immediate answer-specific explanations, chosen practice priority and local text downloads; no email gate.
- Legacy clean, HTML and trailing-slash redirects; updated canonical URLs, sitemap, social metadata and a real 404.
- Existing purchase terms, kit delivery, December 2026 customer instructions and both server functions preserved.

## Before merging the website

- [ ] Review the Netlify deploy preview on mobile and desktop.
- [ ] Confirm the new-edition interest-list mode is the intended current availability.
- [x] Confirmed Netlify detected the three new forms with their fields and honeypots. Live submissions and email delivery remain untested.
- [ ] Decide whether to connect the new MailerLite groups in phase 3 before launch, or monitor/export the new Netlify forms manually until then.
- [ ] Keep old buyer access and emails available; communicate any learning-platform transition directly to affected customers.
- [ ] Merge once after review. This branch does not authorize or perform a production merge.

## Before opening payment for the new edition

- [ ] Upload the final customer-facing material and recorded lessons; verify actual access.
- [ ] Confirm new-edition fees, cohort dates, capacity, time commitment, access duration, refunds and course-buyer credit.
- [ ] Confirm weekly submission deadline, feedback turnaround, one-response scope and revision treatment.
- [ ] Align checkout, purchase terms and delivery emails to the eight-module product.
- [ ] Add only the verified new-edition checkout URLs; do not send new buyers through old-offer payment links.

## Email implementation boundary (phase 3)

Netlify captures the three new form names. The existing submission function deliberately ignores them, so no new lead is dropped into the retired diagnostic automations. Create the new MailerLite groups, map the forms, configure the consent-specific welcome/nurture journeys, and verify opt-out and purchase suppression before promising automated delivery. Skills Check results remain available without email throughout.
