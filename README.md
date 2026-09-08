# sayantannandi.com

Static site on Netlify. No build step. Publish directory is the repo root.

## Structure

- `assets/site.css` is the only stylesheet. Every page loads it. Bricolage Grotesque for headings, navigation, figures and buttons; Literata for text. Both load from Google Fonts.
- `assets/site.js` is only used by `tools/exit-power-score.html` (score tally and mobile nav).
- Pages built from scratch in the shared shell: index, diagnostics-index, decisions, writing, essays/two-numbers, philosophy, book, about, newsletter, contact, privacy, thanks, the four `thanks-*` payment pages, tools/index, tools/earning-power-audit, tools/exit-power-score.
- Pages that keep their own inline layout and got the shared header, footer, fonts and palette on top: the seven diagnostics, the four kit pages, the course page, the two cohort pages, invisible-month-calculator. Their forms, field names and submit code are unchanged.

## Redesign, September 2026

Navigation on every page: Start here, The course, Decisions, Essays, Philosophy, About, and The letter.

New page: `/decisions`. Moved: `/tools` and `/tools/` now 301 to `/diagnostics`; `/tools/earning-power-audit` 301s to `/scorecard`. `/tools/exit-power-score` stays, reachable from the footer.

Nothing that MailerLite depends on changed. Form names, hidden fields and the `submission-created` function are as they were. Three forms that were never mapped to MailerLite were dropped (`essay-signup`, `worksheets`, `earning-power-audit`).

The four `thanks-*` pages no longer contain placeholder links. They tell the buyer the download link is in the Razorpay confirmation email.

## Deploying

Push to a branch first and check the deploy preview. Merge to main once. Each production deploy costs 15 Netlify credits; branch deploys cost none.

Form submissions on a deploy preview run the real function with the real environment variables. Test with a throwaway address, or scope the `ML_*` variables to the production context while the preview exists.
