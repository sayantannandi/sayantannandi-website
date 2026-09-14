# Step Up preview and release

## Included in this update

- Six-week, twelve-lesson course curriculum and six-week December 2026 cohort.
- Homepage and sales copy updated from interest lists to enrolment.
- The owner-supplied TagMango and Razorpay payment links.
- Separate course and cohort thank-you pages with access instructions.
- Updated cohort customer instructions and related course links across the site.
- Updated sitemap dates; customer and thank-you pages remain noindex.
- Reproducible HTML templates and a GitHub validation workflow.

## Preview review

- [ ] Review mobile and desktop layouts on the existing Netlify PR preview.
- [ ] Review the six-week dates: Saturdays, 5 December 2026 through 9 January 2027, 11 AM IST.
- [ ] Complete the image transfer when the execution workspace is available. Correct “Eight modules” in the course artwork to the new structure.
- [ ] Inspect each payment destination and confirm its displayed offer matches the six-week edition. The supplied URLs were added exactly, but their page contents could not be inspected in this session.
- [ ] Check course and cohort access from the provider confirmation instructions.
- [ ] Obtain the owner's approval before merging to main.

## Provider success URLs

After production includes the new pages, configure:

- TagMango: https://sayantannandi.com/step-up/course-thank-you
- Razorpay: https://sayantannandi.com/step-up/cohort-thank-you

The corresponding paths already exist in the branch for preview. Provider configuration has not been changed by this code update. Thank-you pages are instructions, not payment verification.

## Existing services

Newsletter consent and Netlify capture remain in place. Email automation work is separate; monitor Netlify submissions until the newsletter is mapped. Existing purchase commitments and server functions remain unchanged. No payment or live form submission is required to review this preview.
