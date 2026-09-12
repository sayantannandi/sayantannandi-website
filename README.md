# sayantannandi.com

Static Netlify website for **The Step Up to Senior Leadership**. Eight modules, one free Skills Check, one worked sample, two learning formats. The Optional Career remains the newsletter; earning power × exit power = optionality remains the wider philosophy.

## Editing and running

- Generated HTML is checked in; Netlify publishes the repository root with no build dependencies.
- Edit page content and the shared shell in `scripts/build_site.py`, then run `python3 scripts/build_site.py`.
- Interactive cases and all answer-specific feedback live in `assets/skills-data.js`. Interaction lives in `assets/skills-check.js`.
- Shared styling and navigation/form/sample behavior live in `assets/step-up.css` and `assets/step-up.js`.
- Run `node scripts/build_downloads.mjs` after changing the cases.
- `scripts/legacy-content/` retains the source of existing purchase policies and delivery instructions for deterministic regeneration. `/scripts/*` is blocked by an explicit 404 rule.
- Shared shell changes require regenerating all pages. Check in both source and generated output.

## Public routes

`/`, `/step-up`, `/step-up/check`, `/step-up/sample`, `/step-up/cohort`, `/newsletter`, `/essays`, three essays, `/about`, `/help`, `/privacy`. Existing purchase terms, refunds, cohort intake and kit delivery instructions remain accessible but are excluded from the sitemap and marked noindex.

`_redirects` maps retired clean, `.html` and trailing-slash acquisition URLs directly to their closest replacement. Forced 301s prevent old files shadowing redirects. New clean URLs use Netlify’s existing pretty-URL handling; do not add explicit trailing-slash redirects or forced HTML redirects together with clean-to-HTML rewrites, which creates a redirect loop. Unknown routes get `404.html`.

## Current launch state

The new course and cohort are in **interest-list mode**. There are no new-edition payment links. Workbooks and reference material exist; completed recorded video lessons were not supplied. The new cohort date, fee and final operational terms must be agreed before opening registration. Existing paid customer commitments continue to apply.

The Skills Check is an educational reflection tool, not a validated assessment or promotion predictor. No aggregate score, percentiles or product recommendation based on a score. Visitors choose a practice priority. Answers and sample notes stay in tab memory; no local/session storage or answer analytics. Results and templates download without signup.

## Forms and email boundary

Three statically detectable Netlify forms collect separate explicit consent:

| Form | Purpose | Fields beyond email/name |
| --- | --- | --- |
| `step-up-course-interest` | New course availability and enrolment updates | `consent`, `consent-version` |
| `step-up-cohort-interest` | Cohort dates, format and registration | `practice-goal` (optional), `consent`, `consent-version` |
| `step-up-newsletter` | The Optional Career and occasional offers | `consent`, `consent-version` |

Netlify form detection must be enabled (confirmed enabled in the connected project during implementation). Form success means HTTP acceptance, not email delivery. Failed or timed-out submissions retain the input and permit retry. Successful submissions stay disabled to avoid duplicates. Native no-JavaScript submissions go to `/request-received`.

**Phase 3 must connect these new forms to separate MailerLite groups and install the new email journeys.** The existing `submission-created.js` intentionally does not route these names into the old diagnostic automations. Until that connection is made, submissions remain in Netlify Forms and need export/processing there. Do not advertise an immediate welcome or emailed Skills Check result. No subscriber records, campaigns or automation state were changed by this branch.

Existing Netlify functions, Razorpay webhook, environment variable names and legacy kit delivery remain unchanged. Do not reuse the old TagMango/Razorpay sales links for the new edition until checkout copy, materials and terms agree.

## Preview and release

`/review` is a noindex layout-review tool with 390px, 768px and 1160px same-origin frames. It is not linked from the public navigation.

Use a pull request deploy preview; do not push straight to main. See `DEPLOYMENT_CHECKLIST.md` and `scripts/validate_site.py`. Production forms use real services; QA must avoid live submissions or use explicit, controlled authorization. Nothing in this branch changes the production domain configuration.
