# sayantannandi.com

Static Netlify website for The Step Up to Senior Leadership. The course has twelve lessons arranged into six weeks. The December 2026 cohort follows the same sequence with six weekly live sessions.

## Editing and running

- Generated HTML is checked in. Netlify publishes the repository root without a build step.
- Edit the homepage, sales pages and payment thank-you bodies in `scripts/content/`.
- Edit the shared shell and remaining page content in `scripts/build_site.py`.
- Run `python3 scripts/build_site.py`, then `python3 scripts/validate_site.py`. Commit source and generated output together.
- Interactive cases live in `assets/skills-data.js`; behavior lives in `assets/skills-check.js`. The eight-case check samples course topics and links to the corresponding lessons.
- Run `node scripts/build_downloads.mjs` only when changing the cases.
- Shared styling and navigation/form/sample behavior live in `assets/step-up.css` and `assets/step-up.js`.
- `scripts/legacy-content/` retains policy and delivery inputs for deterministic regeneration. The December 2026 instructions now reflect the six-week schedule. `/scripts/*` remains blocked.
- The GitHub validation workflow checks regeneration, routes, checkout links, customer pages and JavaScript syntax. Interaction tests use the existing QA-only dependency: `npm install --no-save --package-lock=false linkedom@0.18.12`, then `node scripts/test_interactions.mjs`.

## Offers and checkout destinations

Both offers are open for enrolment, as directed by the course owner.

| Offer | Sales route | Checkout |
| --- | --- | --- |
| Independent course | /step-up | https://tagmango.app/68942f6867 |
| December 2026 cohort | /step-up/cohort | https://rzp.io/rzp/TSUTSLDec2026 |

The cohort has six Saturday sessions at 11 AM IST, from 5 December 2026 to 9 January 2027. Existing session length remains 90 minutes. Current fees and purchase details are left to the supplied checkouts; no price, discount or seat count is invented.

## Post-payment pages

| Provider | Success destination after the production merge |
| --- | --- |
| TagMango course | https://sayantannandi.com/step-up/course-thank-you |
| Razorpay cohort | https://sayantannandi.com/step-up/cohort-thank-you |

These are public, noindex instruction pages, excluded from the sitemap. They do not verify payment or grant paid access. Configure the success/redirect URL in each provider separately; HTML links cannot change a provider setting. During review, inspect the same paths on the Netlify deploy preview. Do not point live checkout to production paths before those pages have been released.

## Public routes and migration

The homepage, course, cohort, free check, worked sample, newsletter, essays, about, help and privacy routes remain canonical. The sitemap contains public pages and updated modification dates. Policies, intake, purchase instructions and thank-you pages remain accessible with noindex and outside the sitemap.

Existing forced redirects are retained. Do not combine forced HTML redirects with clean-to-HTML rewrites, which can create a Netlify Pretty URL loop. Unknown routes use `404.html`.

## Forms and access

Course and cohort interest forms have been replaced with direct checkout links. The newsletter form remains independent, with explicit consent and a honeypot. The existing submission function does not map this form into MailerLite; until separately configured, monitor submissions in Netlify. Form acceptance does not prove email delivery.

No subscribers, email automations, provider settings, webhook behavior or environment variables are changed. Existing purchase commitments remain in place. The free check is a teaching resource, not a validated assessment or promotion predictor. Answers and sample notes stay in the browser tab.

## Preview and pending artwork

Review the existing draft PR and Netlify deploy preview before approving a merge. Main and production are outside this update.

Requested Library artwork was located: `The Step Up to Senior Leadership(2).png` (course) and `The step up to senior leadership(3).png` (cohort). Image transfer into the repository is blocked by the unavailable execution workspace. The course image also contains “Eight modules”; correct that artwork before publishing it. No authenticated Library image URLs or broken image paths have been added to the public pages.

See `QA_RESULTS.md` and `DEPLOYMENT_CHECKLIST.md`.

## Start-here funnel update

The primary acquisition routes are now /start-here and /newsletter. Two six-situation tests collect first name and email at the end, then show a downloadable report after Netlify accepts the request. Newsletter consent on test forms is separate and optional. Automated email delivery remains for the next phase.

Question content: assets/lead-magnet-data.mjs. Editorial scoring and report text: assets/lead-magnet-engine.mjs. Interactive flow: assets/lead-magnets.js. Page templates: scripts/content/. After editing, regenerate HTML and run static validation plus scripts/test_lead_magnets.mjs and scripts/test_interactions.mjs with the existing QA-only linkedom dependency.

The header includes Start here and Philosophy, with a green letter button. Promotion Kit pages and /exit-power are restored as public pages. See LEAD_MAGNETS.md for form fields and the MailerLite handoff. No provider or automation changes are included in this update.
