# Step Up: two free tests and the acquisition funnel

## The recommended pair

| Test | Reader's immediate concern | Course connection |
| --- | --- | --- |
| Senior-Level Judgment Check | “I keep being told to be more strategic.” | Recommend Under Ambiguity, Deliberate Elimination, Delegate to People; cross-team responsibility appears in the cases. |
| Leadership Visibility Check | “My work is stronger than the way it is understood.” | Outcome Translation, Legibility, Reduce Your Boss's Uncertainty; the final case connects to the readiness conversation. |

Each uses six original workplace situations with four plausible responses. Allow approximately 5–7 minutes; this is an editorial estimate, not an observed completion-time statistic. Question order is fixed and strongest-answer positions vary.

Scenarios were chosen to make the reasoning visible. The general format is informed by [OPM's explanation of situational judgment tests](https://www.opm.gov/policy-data-oversight/assessment-and-selection/other-assessment-methods/situational-judgment-tests/). These particular tests have not been validated and do not estimate promotion probability, compare visitors with a population, or assign personality types.

## Visitor paths

1. Content → /newsletter → required first name and email, with explicit newsletter consent.
2. Content → /start-here or a specific test → six situations → required first name and email → report.

Test paths:
- /tests/senior-level-judgment
- /tests/leadership-visibility

The report request uses required consent to process the report data. An unchecked optional box offers The Optional Career and occasional course/cohort invitations. Completing a test without that box must not enrol the visitor into marketing nurture.

Before starting, visitors are told that name and email are requested at the end. In the preview, an accepted Netlify submission reveals the report on the page. Email delivery is explicitly marked as not enabled. Do not change that promise until the email connection is tested.

## What the report delivers

Each response has its own explanation. The report identifies the area with the lowest total under the editorial rubric, shows all tied areas, and provides a four-step working exercise for each focus. Visitors who choose every strongest response receive an application exercise rather than a fabricated weakness. Full explanations and course-lesson links appear in the downloadable text report and printable page.

Scores are internal: 0 misses a central requirement, 1 partly addresses the decision, 2 is strongest for the stated facts. Two questions per area give an internal range of 0–4. These numbers are not displayed as an overall leadership score. The report does not infer workplace behaviour from hypothetical choices.

## Forms and future MailerLite connection

| Form name | Purpose |
| --- | --- |
| step-up-judgment-results | Judgment report request |
| step-up-visibility-results | Visibility report request |
| step-up-newsletter | Direct newsletter signup |

New test form fields:
- name, email, form-name, bot-field
- consent, newsletter-consent, consent-version
- test-id, test-version
- answers, dimension-scores, practice-focus, report-text

The form includes the full report text so an accepted request can be matched to its result. Answers are option IDs in question order. Dimension scores are JSON keyed by the stable dimension IDs. All tied focus IDs are stored, comma-separated. The all-strong result uses apply-to-your-work.

The existing submission function ignores the two new form names. No MailerLite groups or automations were changed. Netlify is the capture location pending the next phase.

During the email phase:
- Recalculate from the versioned answer IDs on the server instead of trusting client-supplied scores.
- Send the requested report without requiring newsletter opt-in.
- Route nurture only when newsletter-consent is yes, or there is a separately established valid subscription. Do not reactivate an unsubscribed contact automatically.
- Retain separate result details if one email completes both tests.
- Verify failure handling and duplicate delivery before enabling the emailed-results promise.
- Use the practice focus to choose relevant teaching emails. A score must not determine who is allowed to buy a course or join the cohort.

## Content invitations

Judgment: “Being told to be more strategic leaves a lot unexplained. Try six workplace decisions in the free Senior-Level Judgment Check.”

Visibility: “Your work can be valuable and still be hard for someone else to explain. Try the free Leadership Visibility Check.”

Both tests lead naturally to the same six-week curriculum. The course offers independent study; the cohort adds scheduled discussion and feedback. A visitor's format choice should reflect the support they want.

## Website structure

Header: Start here, The course, Cohort, Philosophy, Essays, About, The letter. The letter has a solid green treatment.

The footer includes the Promotion Kit bundle and its three individual product pages, plus Exit Power. Restored kit pages use their existing main-branch checkout destinations, without republishing price claims. Old diagnostic URLs go directly to Start here. The earlier eight-situation Skills Check remains an unpromoted practice resource for existing users.

All code remains on codex/step-up-funnel-rebuild pending approval.
