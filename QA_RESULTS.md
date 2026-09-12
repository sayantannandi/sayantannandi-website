# Rebuild verification

Checked 12 September 2026 against the Netlify deploy preview for PR #2.

## Passed

- 23 HTML pages (22 public/customer pages plus the noindex review tool), 544 internal links/assets/anchors and 91 routing rules validated.
- Browser completion of all eight Skills Check situations with mixed responses, changed first answer, individual explanations and an independently chosen practice priority.
- Native unanswered-question validation in the browser; focus moves to the required response.
- Automated DOM tests of all eight situations, unanswered guard, answer changes, back/next state, profile, selected practice, text generation and restart.
- Automated DOM tests of all three forms: rejected HTTP response, timeout, retained input, retry, accepted response and duplicate prevention. Requests were mocked; no live signup was submitted.
- Brief text generation retains entered text and all eight prompts, without network requests.
- Desktop homepage visually inspected. Homepage mobile layout and menu open/Escape close inspected at a 390px frame. Sample inspected at tablet width. `/review` provides 390px, 768px and 1160px frames for review.
- Netlify detected all three new form names, their consent fields and honeypots. No test subscribers were created.
- Hosted course, Skills Check, sample, cohort and review routes return 200.
- Old course, old HTML diagnostic URL (including its UTM query) and old cohort slash URL redirect once to the corresponding new page and return 200.
- Existing kit thank-you and December cohort customer instructions return 200.
- Unknown paths and `/scripts/*` return 404.
- Netlify redirect and header checks passed. A real redirect loop caused by explicit canonical rules conflicting with Pretty URLs was found and corrected; new paths now use Netlify's existing URL handling.

## Limits and rollout dependencies

- The browser ran the download handler and the automated tests verified the generated Blob text. The cloud browser did not expose a completed download event, so capture of a saved file was not verified there. Pages retain the full answers/entered notes and describe a started download rather than claiming a saved file.
- The browser checks use desktop Chrome and fixed-width same-origin frames, not physical mobile devices.
- Form acceptance, real email delivery and payment fulfilment were not tested with live submissions. Phase 3 must map the new Netlify form names to new MailerLite groups and install the consent-specific email journeys, or new leads must be processed from Netlify manually.
- New-edition checkout is closed. Recorded lessons and final new cohort registration details remain prerequisites to opening payment. Existing purchase obligations continue to apply.
- Main and the production domain have not been changed by this PR.
