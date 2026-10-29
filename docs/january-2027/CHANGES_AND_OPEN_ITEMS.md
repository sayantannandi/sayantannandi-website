# Website release: 29 October 2026

## Published offer

- January checkout: https://rzp.io/rzp/Jan27TSUTSL, verified at ₹17,999. The checkout description explicitly says inclusive of 18% GST.
- Six Saturdays: 9, 16, 23 and 30 January; 6 and 13 February 2027. 11 AM to 12:30 PM IST, on Google Meet. Capacity: 20, with no unverified “seats left” counter.
- Registration deadline follows the brief: 6 January at 11:59 PM IST. Razorpay currently expires 8 January, so its expiry needs changing separately.
- First-session refund guarantee matches the checkout's “before the second live session”: full refund requests accepted before 11 AM IST on 16 January. Both recording viewers and live attendees qualify, as do cancellations before the start. Earlier purchases retain their agreed terms.

## Editorial and operational adjustments

- “Practice the work of your next role” replaces an assured six-week transformation. Weekly cards describe practice objectives. Both people growing into a role and people passed over are included.
- Kept site navigation, header call button and footer call link, as requested previously. The cohort page adds repeated enrolment buttons and a mobile sticky bar. Free lesson, call and legal links remain deliberate secondary actions.
- Before/after example now states all fictional facts before the rewrite. No testimonial placeholders or invented evidence are shown.
- Recording access is set to **90 days after the final session**. Course-material access follows the existing course-hosting terms.
- Weekly submission deadline is **Tuesday 11:59 PM IST**, one focused submission with **one written feedback response within three working days**, including the final week. Late submissions depend on capacity. No unlimited editing or private coaching is promised.
- Post-payment fulfilment uses a new January Netlify intake, with manual payment verification and access instructions **within two working days of intake and verification**. A downloadable calendar has six events; private Meet joining details are sent to registered participants. No unverified purchase is granted automatic access.
- Confidentiality copy explains peer and recording responsibilities, asks for anonymized examples, and avoids an absolute guarantee.
- Employer reimbursement email has a copy button and verified price/tax text; it asks about invoice details before payment.
- Standalone workbook checkout links and prices are removed. The workbooks are included for course and cohort members. Existing buyers retain access and can request help without repurchasing.
- December promotions are removed from public acquisition pages. December customer instructions and original customer terms are retained deliberately.

## Free tools and printable resources

- `/check` implements all twelve questions and both paths. `/free-check` and its aliases redirect to it; the original Judgment and Visibility practice checks remain available.
- Scores follow the supplied 11/18 and 7/12 thresholds. The grid explicitly describes next-level work rather than salary. Thresholds and categories are labeled provisional reflection, not validated assessment or verified financial safety. Paths are not presented as comparable scores.
- Q4's highest response now includes a supported business outcome and a decision **where needed**, rather than rewarding any update that ends in a decision request.
- Lowest-score ties use the first question, as supplied. Path B Q2 first asks for a specific gap and evidence rather than suggesting that an employer's vague feedback proves the participant makes their boss uncertain.
- “Not sure” runway produces an explicitly provisional result. Unknown or under-three-month runway points to free worksheets before a paid cohort, even if other answers make the Exit score higher.
- The full result can be read/downloaded without email. The optional email request is after the result, with a separate optional newsletter checkbox. This deliberately avoids making visitors submit before seeing their self-reflection result.
- `/runway` and the calculator on `/exit-power` use usable reserves divided by monthly costs less continuing take-home income. Zero reserves are allowed, zero/negative costs and negative/nonfinite inputs rejected. Income covering costs shows “No current drawdown,” never infinity.
- Nonoverlapping runway bands are under 3, 3 to under 6, 6 to under 12, 12 to under 50, 50 to 200 inclusive, and over 200. Display is rounded down to one decimal; bands use unrounded values.
- Runway band text describes coverage under assumptions. Removed claims about how fast senior searches take, how many mistakes a reserve funds, and when employment becomes optional. No unverified chapter attribution is attached to the adapted wording.
- Reserve/cost/income inputs stay in memory in the current browser tab. They are never posted, put in URLs, saved in browser storage, or sent to analytics.
- `/book/first-chapter` and `/worksheets` offer printable PDFs, with immediate ungated downloads and optional email-copy requests. This keeps the resource usable while the separately authorized next email step remains pending.
- Replacement chapter has 20 pages and does not duplicate the worksheet PDF. The five-page worksheet PDF still contained ACKNOWLEDGMENTS running headers on pages 3 and 5; those were corrected to THE WORKSHEETS in the hosted copy. Source Library originals were not edited. No interactive fields were added.
- Footer education disclaimer, privacy wording, refund policy, book link, homepage check route and course/workbook inclusion copy were updated consistently.

## Email work deliberately not activated in this release

- New captured requests are queued with validated answers and explicit consent; they do not enter older newsletter/test/cohort workflows accidentally. Existing email routes continue unchanged.
- New sources: `free_chapter`, `worksheets`, `starting_point`, `next_cohort`. Gate: `SN_RESOURCE_FUNNELS_READY=true`, to be set only once groups, fields, automations and delivery tests are complete.
- January purchases are a distinct `cohort_jan2027` product, gated by `SN_JANUARY_FUNNEL_READY=true` and requiring its own `SN_COHORT_JAN2027_ACCESS_URL`. The observed checkout identifier `pl_TtOf7C8Q0AvKDh` routes separately when present in a signed supported webhook. Orders lacking a supported page/link identifier still require manual verification; the new intake provides the reliable fallback.
- The January payment page must have the webhook and post-payment redirect configured in Razorpay. This website release cannot alter the provider's account settings.
- Draft follow-up copy and timing are in EMAIL_PLAN.md. MailerLite changes and sending remain the next step.

## Provider corrections still needed

1. Razorpay: replace “Every Sat at 11AM for 8 weeks” with “Six Saturdays at 11 AM IST,” retaining 9 January to 13 February 2027.
2. Razorpay: change checkout expiry from 8 January to 6 January 2027, 11:59 PM IST; configure actual inventory for 20 paid places if desired. The website does not claim a live inventory counter.
3. Razorpay: set the post-payment redirect to https://sayantannandi.com/step-up/cohort-thank-you and verify signed webhook delivery.
4. Google Meet: verify the account supports recording, schedule the actual calls, and email private joining details to verified participants. The public calendar deliberately has no fabricated Meet URL.
5. Configure and test MailerLite resource and January fulfilment workflows before activating the new email gates.
