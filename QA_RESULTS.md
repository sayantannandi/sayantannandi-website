# Validation: six-week launch update

## Checks performed on 14 September 2026

The execution workspace failed to connect. Repository reads and changes were prepared through the GitHub connector. Python regeneration and browser interaction tests could not be run locally.

Static checks on the prepared files passed:
- 25 HTML pages with one H1, a canonical URL and no duplicate IDs.
- 581 internal links and linked assets checked against repository paths; fragment links resolve.
- Sitemap routes exist and exclude noindex customer pages.
- Course and cohort checkout links use the exact owner-supplied destinations.
- New course and cohort thank-you pages are noindex and explicitly do not verify payment.
- The course lists all twelve lessons across six weeks. The cohort uses six live sessions.
- The six Saturday dates run from 5 December 2026 through 9 January 2027.
- Revised Skills Check JavaScript parses after removing its import for the syntax check.

The Python validator now checks launch links and the new customer pages. Interaction tests were updated for the remaining newsletter form; the eight-case check and sample download tests remain. A GitHub workflow regenerates the site, checks for source/output drift and runs static validation after push.

## Limits and outstanding review

- No live payment, intake or newsletter submission was made.
- The supplied payment URLs were not inspectable through the available browser tool, so checkout content, price and success-redirect settings are unverified.
- Provider success URLs must be configured separately after the new production routes are released.
- The requested Library artwork was found, but its pixels were unavailable through Library read and the disconnected workspace prevented image transfer to GitHub. The course image's extracted text says “Eight modules”; it needs correction before publication.
- The updated page layouts still need mobile and desktop review on the Netlify preview. Earlier branch QA is not treated as a visual test of this update.
- Main must remain unchanged until the owner approves the preview.
