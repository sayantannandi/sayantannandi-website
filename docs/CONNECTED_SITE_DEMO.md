# Connected blue-site demo

Entry: `/review/start-here-blue`. All new pages are review-only, excluded from the sitemap and marked noindex.

## Navigation

Four top links: Start here, Learn (Course / Workshop Cohort), Get coached, Philosophy. A separate Book a call button leads to the booking explanation page and the existing Google Calendar appointment link. Footer contains the newsletter, learning offers, philosophy, essays, about, printables, support and legal links.

The two approved sales demos now receive the same navigation and footer during the build. Their source content and prices remain intact. Production page navigation remains available while this design is being reviewed. The existing shared blue palette already applies to production pages; the complete review experience uses matching cobalt, navy, pale blue and white.

## New pages and interactions

- `/review/start-here-blue`: three-way interactive guide, recommended test highlighting, three test cards, a sample scenario with instant feedback, and next-step links.
- `/review/tests/senior-level-judgment`: six existing fictional leadership cases and editorial scoring.
- `/review/tests/leadership-visibility`: six existing fictional visibility cases and editorial scoring.
- `/review/tests/exit-power`: six new self-reflection prompts about financial visibility, commitments and credible alternatives. No balances or account information are requested. It is not a financial or retirement assessment.
- `/review/get-coached-blue`: challenge selectors, personalized coaching process, short fit brief and booking next step. Personal coaching scope and fee are agreed after a fit call; no fixed package is invented.
- `/review/philosophy-blue`: existing book cover, preorder interest, three concept diagrams and an interactive two-slider explanation.
- `/review/book-a-call-blue`: existing Google Calendar booking destination with preparation guidance.
- `/review/newsletter-blue`: newsletter introduction and signup request.

## Form handling

Netlify Forms stores review submissions separately. Forms use these names:

- `sn-review-quiz-judgment`
- `sn-review-quiz-visibility`
- `sn-review-quiz-exit`
- `sn-review-coaching`
- `sn-review-book-interest`
- `sn-review-newsletter`

The existing server-side funnel ignores unrecognized form names. Review forms therefore save records without enrolling anyone in live MailerLite automations. Every review form explicitly describes this behavior. Newsletter choices are optional, unchecked and saved as `yes` or `no`. The dedicated newsletter form records an explicit signup request. No result is shown until the quiz's required name and email form receives a successful response; failed requests retain the visitor's answers and details.

Answers are held in memory until submission, then stored with the request and practice focus. The browser does not persist contact details or test answers in local storage. Results can be downloaded as text or printed.

## Before replacing production pages

- Approve the new Exit Power prompts and report language.
- Supply the book preorder checkout URL, price, format and publication/delivery terms. Current production configuration has preorders closed and no checkout URL, so the demo accurately collects interest only.
- Connect approved form names and explicit newsletter consent to the desired MailerLite groups and messages. Do not enroll report-only requests into the newsletter.
- Align live course/cohort policies and checkout with their approved review copy before promoting those sales pages.

Implementation: `scripts/site_demo.py`, `assets/lib/site-demo.css`, `assets/lib/site-demo.js`, `assets/lib/site-demo-quiz.mjs`. Run the normal site build and publish preparation. Book cover is an optimized version of the existing supplied cover.

## Manuscript visual revision, 30 October 2026
- Replaced Start Here's orbit graphic with the author's blue Time Equation; retained quiz recommendation chips and sample interaction.
- Philosophy uses manuscript definitions, the full loop and three destinations. Removed slider scenarios and scattered supporting microcopy.
- Preorder interest requires name/email. Sample delivery choice is stored as download/email; download URL is added only after successful capture. The full manuscript is never published.
- Email-copy requests are captured for fulfillment. MailerLite returned UNAUTHORIZED during verification, so automatic email delivery remains pending reauthentication. UI states this explicitly.
