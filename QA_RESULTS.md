# Validation: Start here and two lead magnets

## Prepared-file checks

- 34 HTML pages and 1,073 local links/assets/anchors checked against repository paths.
- Every checked page has one H1 and one canonical URL, with no duplicate IDs.
- All 8,192 possible answer combinations evaluated across the two tests; scores remain in range and tied focus areas are preserved.
- New JavaScript syntax parsed successfully.
- Sitemap and restored routes checked for missing pages and inappropriate redirects.
- The newsletter button uses white text on the existing dark green (#235f4c).

## Automated checks included in GitHub CI

The workflow regenerates the site and checks for source/output drift, then runs the Python route/form validator. The new DOM tests exercise both complete test flows, including unanswered questions, edited answers, the end-of-test gate, failed submissions, timeout/retry, duplicate protection, optional newsletter consent and report downloads. Existing practice-resource and newsletter tests also run.

No live forms or payments are submitted by these tests. Network responses in interaction tests are mocked.

## Remaining review

The execution workspace is unavailable locally, so the new layouts have not been visually checked in a browser in this session. Review the Netlify preview at mobile and desktop widths. Read the GitHub workflow result for executed CI checks.

New forms intentionally do not connect to MailerLite yet. In the preview, results appear on the page after Netlify accepts a form submission. Email delivery is not promised as active. Newsletter nurture requires its own opt-in on the result form.

Main and the production branch remain outside this update. The earlier course/cohort artwork transfer and payment-provider success URL configuration remain separate outstanding items.
