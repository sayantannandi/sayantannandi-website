# The Optional Career: MailerLite build guide
Prepared for Sayantan Nandi. Version 2, 14 September 2026.

## What is in this pack
Twelve original newsletter essays, each over 1,000 words before the course section. Each has a prospect HTML version and a customer HTML version. Twelve shorter HTML emails cover entry, requested reports, sales and onboarding. Twelve editable SVG illustrations accompany matching visuals built directly into the email HTML.

The twelve-week newsletter sequence is separate from the six-week course and six-week live cohort. All email sending in this design uses MailerLite automations or campaigns. No MailerSend, Zapier or Make account is required.

These files and instructions do not activate a workflow. Previous campaigns and workflows have not been modified. Existing subscribers are not enrolled automatically by this package.

Open START-HERE.html after downloading and extracting the ZIP. It links to every file, shows subjects and previews, and lets you read the essays. The email files themselves contain no JavaScript. Companion illustrations use a 16:9 canvas. The email-native comparison panels work without externally hosted images. Optional SVG-to-PNG export is available in the pack's illustration gallery; SVGs should not be inserted directly into production emails.

## 1. Set up the sender and editor
In MailerLite Account settings, confirm the sender domain is authenticated. Use Sayantan Nandi as the sender name and hello@sayantannandi.com as the sender and reply address, provided that address is verified on the account.

Every HTML file contains a visible [REPLACE_WITH_YOUR_MAILING_ADDRESS] marker. Replace it with your mailing address, or replace that footer section with the account's standard MailerLite footer. Preserve the visible unsubscribe link. The files include the supported {$unsubscribe} variable. Newsletter emails also include {$url} for the web version.

Create the fields below before importing emails that use them. Copy the actual tags shown in Subscribers > Fields if MailerLite generates a tag different from the proposed name. Do not type a plausible substitute and assume it will work.

To paste HTML into an automation email: add a Send email step, enter the subject and sender, choose Design email, then Custom HTML editor and Code from scratch. Paste the complete HTML file, preview it and finish editing. For a campaign: Campaigns > Create > Regular campaign > Start from scratch > Custom HTML editor > Code from scratch. [MailerLite editor instructions](https://www.mailerlite.com/help/how-to-use-the-custom-html-editor).

Use the subject and preview from email-manifest.csv. The HTML has a hidden preheader too; avoid adding a different one in the editor. Leave emails as drafts while building.

## 2. Create new groups
Go to Subscribers > Groups and create the following. Fresh names keep the replacement separate from stopped legacy workflows. Do not delete old groups or remove their consent history.

| Group | Purpose |
|---|---|
| su2-optin | Explicit consent to The Optional Career and course/cohort marketing |
| su2-intro-active | Subscriber is in the entry sequence |
| su2-letter-start | Starts the ordered newsletter workflow once |
| su2-letter-active | Currently progressing through the twelve essays |
| su2-letter-complete | Finished the foundation series |
| su2-warm | Has reached the second essay; eligible for relevant dated campaigns |
| su2-judgment-request | Explicit request for the judgment report |
| su2-visibility-request | Explicit request for the visibility report |
| su2-report-hold | Report request missing a valid report URL; investigate before sending |
| su2-course-buyer | Verified course purchase |
| su2-cohort-buyer | Verified cohort purchase |
| su2-course-onboarding | Course onboarding currently running |
| su2-cohort-onboarding | Cohort onboarding currently running |
| su2-cohort-interest | Explicit request for cohort information |
| su2-access-hold | Verified buyer whose access field is missing |
| su2-qa | Only addresses controlled by Sayantan for functional testing |

Use Copy to groups when adding a subscriber to another stage. Move to groups can remove other memberships, which could lose a buyer or consent marker.

## 3. Create fields
Go to Subscribers > Fields. Create text fields with these names. Dates below are stored as ISO text for audit, not for automation date comparisons.

| Field | Example or rule |
|---|---|
| su2_first_route | newsletter, judgment or visibility; first marketing entry only |
| su2_consent_at | Timestamp of the explicit newsletter consent |
| su2_consent_version | Exact wording version, such as optional-career-v2 |
| su2_j_report_url | Private HTTPS URL for the first judgment report being emailed |
| su2_j_focus | Readable practice focus; include all ties |
| su2_j_version | Version of the questions and scoring |
| su2_j_submission_id | Stable identifier for that report request |
| su2_v_report_url | Separate private HTTPS URL for the visibility report |
| su2_v_focus | Readable visibility practice focus |
| su2_v_version | Version of the questions and scoring |
| su2_v_submission_id | Stable identifier for the visibility report |
| su2_course_access_url | Verified course login/access location, never the checkout |
| su2_cohort_access_url | Verified cohort access/information location |
| su2_course_payment_id | Provider payment/order reference used for deduplication |
| su2_cohort_payment_id | Separate cohort payment/order reference |
| su2_cohort_code | dec2026 for this cohort |

The existing name and email fields capture the first name and email address. The newsletters deliberately avoid a greeting merge tag, so a missing first name never creates an awkward salutation.

## 4. Connect the website inputs
MailerLite sends the emails and controls their timing. It does not calculate the existing website tests or verify a Razorpay payment by itself. A small server-side website connection must pass those events into MailerLite.

Website consent layout updated 14 September 2026: explicit button choices replace the earlier checkboxes. This is the one part that cannot be completed just by pasting email HTML. The current website already accepts the forms, but its new form names need mapping. The connection should use a MailerLite API token stored in the server environment, never in browser JavaScript. No new website integration has been deployed in this package.

For the newsletter form, a MailerLite embedded form is the simplest alternative to a custom API connection. Associate it with su2-optin and use explicit consent wording. Leave su2_first_route blank for this route; the dispatcher treats a blank value as newsletter. An existing test subscriber's first route must not be overwritten by a later form submission.

For the existing test forms, use the server connection because the report data must be prepared first. The event contract is in website-connection-contract.md.

| Existing website form | Required sequence |
|---|---|
| step-up-newsletter | Verify newsletter consent; upsert name/email without forcing subscriber status; record consent; add su2-optin last. |
| step-up-judgment-results | Validate answers against the versioned test; save a private report; write judgment fields; add su2-judgment-request last. If newsletter consent is separately true, record it and add su2-optin too. |
| step-up-visibility-results | Follow the same sequence using visibility fields and su2-visibility-request. |

The forms now use buttons instead of checkboxes. On the newsletter page, the Subscribe button and its adjacent notice record newsletter consent. The tests offer “Show my report and join the letter” (newsletter-consent=yes) and “Show my report only” (newsletter-consent=no). Both submit consent=yes for providing the requested report. Neither path silently subscribes someone who requested only their report.

The report request grants permission for the requested report, not entry into the essays. An active MailerLite subscriber who has requested a report can receive that narrowly scoped automation. A person already unsubscribed or suppressed cannot be made deliverable by adding a group. Do not force their status to active. Keep the report available on the website and use MailerLite's explicit resubscription process if they choose to subscribe again. MailerLite remains a permission-based email platform: [anti-spam policy](https://www.mailerlite.com/legal/anti-spam-policy).

For a first test request, write the report fields successfully before the request group is added. Freeze that report snapshot so a quick retake cannot alter an email already queued. This initial design emails the first completed report for each test once. Retakes still show their current report on the website. Repeated report delivery requires an additional queue/version design; it is intentionally not simulated by rapidly removing and re-adding groups.

## 5. Build W01: entry dispatcher
Create an automation named SU2 | 01 | Entry. Trigger: subscriber joins su2-optin. Turn re-entry OFF. Each subscriber enters once even if they later take the other test.

Build the default newsletter route first:
1. Copy to su2-intro-active.
2. Add a condition: su2_first_route equals judgment OR visibility.
3. On NO, send A01-newsletter-welcome.html immediately.
4. Delay 3 days.
5. Remove from su2-intro-active.
6. Copy to su2-letter-start. End.

On the condition's YES path:
1. Delay 2 days.
2. Condition: su2_first_route equals judgment.
3. YES sends A02-judgment-introduction.html. NO sends A03-visibility-introduction.html.
4. After either email, delay 3 days.
5. Remove from su2-intro-active.
6. Copy to su2-letter-start. End.

Each branch can have its own final group actions. The shared group starts only one newsletter workflow. The website connection must preserve the first marketing route; it must not rewrite it when someone takes a second test.

The report emails are separate workflows. They do not depend on entry into W01.

## 6. Build W02J and W02V: requested reports
W02J name: SU2 | 02J | Judgment report. Trigger: joins su2-judgment-request. Re-entry OFF.

Add a condition that su2_j_report_url is set. YES sends R01-judgment-results.html immediately, then ends. NO copies to su2-report-hold and ends without a broken-link email. The backend is responsible for checking that the URL is a valid private HTTPS report location before writing it.

Build W02V the same way with su2-visibility-request, su2_v_report_url and R02-visibility-results.html.

Neither workflow adds su2-optin, su2-letter-start or su2-warm. Report-only contacts must be excluded from every marketing campaign through the absence of su2-optin.

Check the hold group during launch. Correct the underlying report field, then deliberately re-add the failed/canceled subscriber at the appropriate point through automation Activity, or deliver the corrected report manually with consent. Do not enable repeat entry globally as a repair.

## 7. Build W03: twelve weekly essays
Name: SU2 | 03 | Weekly essays. Trigger: joins su2-letter-start. Re-entry OFF. First action: Copy to su2-letter-active.

Every issue uses this same block:
1. Condition: subscriber belongs to su2-optin. NO ends after removing su2-letter-active.
2. Condition: belongs to su2-course-onboarding OR su2-cohort-onboarding. YES delays 7 days, then uses Move to step to return to this condition. NO continues.
3. Condition: belongs to su2-course-buyer OR su2-cohort-buyer.
4. YES sends this issue's customer HTML. NO sends this issue's prospect HTML.
5. Join both paths to the next shared step using Move to step. A shared step must be created first before it can be selected as the target.
6. After Issue 02, Copy to su2-warm.
7. Delay 7 days, then repeat the block for the next issue.

The final issue is followed by Remove from su2-letter-active and Copy to su2-letter-complete. Do not add a final seven-day delay unless you want it for a subsequent campaign.

For the first block, create the NO/prospect path and its next shared step first. Then add the YES/customer email and use Move to step to point to that shared step. This avoids building two separate twelve-email series. Keep each buyer check directly before the relevant email, so a purchase made during the preceding delay changes the next version.

Customer files have the same essay, with the course sales section replaced by a practice reference. They contain no invitation to purchase again.

Timing without onboarding pauses: newsletter route sends Issue 01 on day 3 and Issue 12 on day 80. Test route sends Issue 01 on day 5 and Issue 12 on day 82. All delays are relative to signup. A delay measured in days avoids the extra complexity of forcing everyone onto the same weekday.

The condition/action pattern is supported by [MailerLite automation steps](https://www.mailerlite.com/help/how-to-use-automation-steps). Re-entry is an explicit trigger setting; see [automation triggers](https://www.mailerlite.com/help/how-to-set-up-automation-triggers).

## 8. Connect purchases before using sales campaigns
Course checkout: https://tagmango.app/68942f6867
Cohort checkout: https://rzp.io/rzp/TSUTSLDec2026

A sales-page click is interest. A thank-you-page visit is not proof of payment.

For Razorpay, use a verified successful payment event on the website server. Check its signature and the product/payment-link identity, then deduplicate the provider event. Use the relevant payer email, write the cohort fields and access URL, then add su2-cohort-buyer.

For TagMango, first confirm which verified purchase event/export is available in the account. Do not assume that a native MailerLite connection exists. Map the course purchaser using that verified record, write the course access field, then add su2-course-buyer.

A workable manual launch method is to review successful payments in each provider dashboard and assign the matching MailerLite buyer group before sending any campaign. That method has a delay, so pause prospect sends while reconciling purchases. It is not equivalent to instant automated suppression.

Adding a buyer group must not add newsletter consent or reactivate an unsubscribed address. Payment-provider receipts and the paid platform's access process remain the access fallback for people who cannot receive MailerLite emails.

## 9. Build W04 and W05: buyer onboarding
W04: SU2 | 04 | Course onboarding. Trigger joins su2-course-buyer. Re-entry OFF.
- If also a cohort buyer, end without course onboarding.
- If su2_course_access_url is missing, copy to su2-access-hold and end. Correct the access mapping before a deliberate retry.
- Otherwise copy to su2-course-onboarding, then send B01-course-onboarding.html.
- Delay 2 days. Check again whether they became a cohort buyer. If not, send B03-course-first-week.html.
- Both branches remove su2-course-onboarding and end.

W05: SU2 | 05 | Cohort onboarding. Trigger joins su2-cohort-buyer. Re-entry OFF.
- Condition: su2_cohort_code equals dec2026 AND su2_cohort_access_url is set.
- NO goes to su2-access-hold without sending the December email.
- YES copies to su2-cohort-onboarding, sends B02-cohort-onboarding.html, delays 3 days, removes su2-cohort-onboarding and ends.

These onboarding messages are for confirmed purchases and contain access information. MailerLite still respects unsubscribe/suppression status. Do not assume onboarding bypasses it.

The cohort is six Saturdays from 5 December 2026 through 9 January 2027, 11 AM IST, 90 minutes. Confirm that these operational details match the paid cohort page before the dated emails are used.

## 10. Use campaigns for dated offers
Keep the first twelve essays in W03, rather than scheduling them as twelve broadcasts. Every new reader should start at Issue 01. Campaigns are for a particular calendar moment and, later, fresh issues for su2-letter-complete.

Create an eligible prospect segment: active subscribers in su2-optin AND su2-warm; exclude both buyer groups, su2-intro-active, both onboarding groups and su2-qa.

| Campaign | File | Proposed date | Recipients |
|---|---|---|---|
| December cohort announcement | C02 | 7 November 2026 | Eligible prospects |
| December format comparison | C03 | 21 November 2026 | Eligible prospects, refreshed before sending |
| Course-owner cohort information | C04 | 21 November 2026 | Opted-in course buyers who explicitly joined su2-cohort-interest; exclude cohort buyers and onboarding groups |
| Course invitation after the foundation series | C01 | One chosen campaign date | Opted-in su2-letter-complete prospects; exclude both buyer groups |

C04 replaces C03 for its audience. Never send both to the same person.

Do not schedule a false deadline or a last-seats message. Check whether enrolment is still open before each dated campaign. Cancel any December offer remaining after the cohort begins. Future cohorts need new dates and a new cohort code.

The ordinary cadence is one essay weekly. A cohort campaign adds one shorter email in its week. Intro and onboarding exclusions avoid stacking a launch offer onto those entry emails. This is an audience/cadence rule, not a claim that MailerLite automatically enforces a global frequency cap.

Course and cohort links appear in the prospect newsletter footer throughout. The first long essay establishes the problem; the footer supplies the relevant practice without interrupting the essay with a sales pitch.

## 11. Test before activating public entry
Create test subscribers using only addresses you control. Use su2-qa and cloned inactive workflows first. A preview checks appearance; a controlled actual workflow test is needed for merge tags and routing. [MailerLite variable testing](https://www.mailerlite.com/help/how-to-use-variables-in-mailerlite).

Test these cases:
- Newsletter only: welcome immediately, Issue 01 after three days.
- Judgment with newsletter consent: report immediately, judgment introduction after two days, Issue 01 three days later.
- Visibility with consent: same timings with the correct report and introduction.
- Report only: exactly the requested report, no introduction or essay.
- Both tests: two distinct reports, one entry sequence.
- Existing newsletter reader takes a test: report arrives; the newsletter position remains unchanged.
- Repeat same test: no repeated initial report email; current results remain available on the website.
- Purchase during a weekly delay: next essay uses the customer file.
- Course buyer later buys cohort: cohort onboarding runs, course acquisition messages remain suppressed.
- Missing report URL or access URL: hold group, no broken-link message.
- Unsubscribed address submits again: no forced reactivation.
- December campaigns: exclude cohort buyers and verify the dates.
- Images blocked: the built-in comparison remains readable.
- Mobile inbox: text fits the screen and the two comparison panels stack.
- All links: correct production destination, valid access link, working unsubscribe.

Reset the delays from minutes used in a QA clone to the specified production days. Do not reuse QA contacts as real prospects.

## 12. Switch over
Verify that all old workflows and scheduled campaigns are stopped. Preserve their history.

Build and test W03 first, then the onboarding and report workflows, then W01. Activate the receiving workflows before connecting public forms to their trigger groups. Decide explicitly whether the existing consenting subscriber should start at Issue 01; do not import every historical contact into su2-optin.

Publish or verify the intended website sales routes before sending any email that links to them. This pack leaves main unchanged and does not publish the website.

Record the real group IDs and actual merge tags in your implementation notes. Confirm provider payment mapping and the report service before enabling public test-report sends.

## Editorial notes
All named workplace examples are explicitly illustrative. First-person reflections express an editorial view, not an invented personal promotion or layoff story. No claim of a specific income gain or guaranteed promotion appears.

The essays were checked for the banned opening and phrase patterns. Each has a single-sentence paragraph and at least one paragraph over sixty words. No essay ends on advice or an uplift line; its course section ends with a factual description of the format. Personal anecdotes can be added later only where the event is accurate.

The HTML files have inline styles, a mobile layout and no external font dependency. No inbox screenshot rendering was available in this session. MailerLite preview and controlled inbox checks remain part of setup.
