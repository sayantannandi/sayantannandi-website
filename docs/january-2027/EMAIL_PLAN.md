# Draft email plan, not sent or activated

Sender: Sayantan Nandi <hello@sayantannandi.com>. Reply to the same address. Apply standard unsubscribe/footer controls. Newsletter is a separate optional group. Never reactivate suppressed contacts. Use PDF download links, not attachments. Replace the greeting with the platform's tested first-name merge tag and a safe fallback.

## Free chapter: immediate, day 3, day 7

### Email 1: Your first chapter

Hi {name},

Your printable Prologue and Chapter One are ready.

The Prologue starts in a government house in the 1990s and ends with one number. Eight. Months, not years. It changed how I thought about my own career.

If you do one thing after reading, try the division at the end of the Prologue for your own household.

[Download the printable chapter](https://sayantannandi.com/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf)

Sayantan

P.S. If you’d like to tell me what the calculation made you notice, reply. I read every reply. You do not need to share a financial amount.

### Email 2, three days later: What does your number need to cover?

Hi {name},

Eight months sounds different depending on what you need it to buy. A short search, a longer break and a change of industry put different demands on the same reserve.

Start with the money you could actually use for the decision, after tax and selling costs. Leave out the home, locked retirement funds and money already committed elsewhere. Then compare that reserve with the household’s monthly shortfall if your salary stopped.

The calculator does that division. Its inputs stay in your browser. The result describes your assumptions; it cannot decide whether a particular move is affordable.

[Find your runway](https://sayantannandi.com/runway)

Sayantan

### Email 3, four days after Email 2: The rest of the book

Hi {name},

The Prologue ends on a question the rest of the book tries to answer. How does a good income turn into real choices?

One part examines how your work gets valued at the next level, including what “be more strategic” means in practice. Another examines runway, concentration and Enough. Then the two meet in decisions about a pay cut, unvested shares and a bigger home.

The career and the household rarely make those decisions separately. The book keeps them in the same conversation.

[See the book](https://sayantannandi.com/book)

Sayantan

## Worksheets: immediate, day 3, day 8

### Email 1: Your four worksheets

Hi {name},

Your four printable worksheets are ready. Download them and write on the pages.

Start with the Runway. It asks what you could actually use for a decision and what the household would need each month.

Then try the Ladder Audit on last month’s visible output. Look at what left your desk, rather than the meetings you attended.

[Download the printable worksheets](https://sayantannandi.com/assets/downloads/Earning_Power_Exit_Power_Worksheets.pdf)

Sayantan

### Email 2, three days later: What left your desk last month?

Hi {name},

The Ladder Audit asks how much of last month’s output was doing, and how much was deciding. Both matter. The question is whether your work gives anyone evidence that you can carry the responsibility you want next.

Take one update you sent. Does it describe the activity, or explain what changed and which decision follows? That is one place to start practicing.

The Step Up to Senior Leadership works on these situations using your own anonymized examples, with live discussion and written feedback.

[See the live cohort](https://sayantannandi.com/step-up/cohort)

Sayantan

Date handling: use this evergreen version by default. Do not hard-code January availability into the automation. The landing page carries current dates. Suppress this promotional email for customers; retain requested resource delivery.

### Email 3, five days after Email 2: The decisions behind the worksheets

Hi {name},

The four worksheets come from Earning Power × Exit Power = Optionality.

Each makes a different part of a decision visible: the reserve you can use, the work you are known for, the risks that might move together, and what Enough means for your household.

The numbers are a starting point. The book explores what they change about the decisions you face at work and at home.

[See the book](https://sayantannandi.com/book)

Sayantan

## Starting Point Check: immediate report

Use server-generated result fields, not a client-supplied score. Custom fields prepared by the website:
- `sn_starting_point_url`: private full report, expires 180 days after latest update.
- `sn_starting_point_box`, `sn_starting_point_skill`, `sn_starting_point_runway`, `sn_starting_point_decision`, `sn_starting_point_cta`.

Subject: Your Starting Point Check

Hi {name},

Your Starting Point Check report is ready. It brings together the reflection suggested by your answers, one skill to practice this week, your reported runway range and the decision you chose to examine.

This is a self-reflection exercise, not a validated assessment or a prediction of promotion. A reported range is not a verified financial plan.

[Read your private report]({sn_starting_point_url})

Sayantan

The report itself contains the result-specific next step and optional free-call link. This keeps the email to one main button and avoids the impression of an individual financial recommendation.

## Build and test before activating

1. Resolve/create exact groups and custom fields. Make a dedicated January buyer group rather than reusing December onboarding.
2. Confirm current sender authentication and safe merge-tag fallback.
3. Create inactive automations; immediate resource delivery, then delays of 3 and 4 days for the chapter, 3 and 5 for worksheets. Suppress sales follow-ups for customers and unsubscribed contacts.
4. Dry-run with a test profile, then send authorized tests only to the account’s verified address. Confirm downloads, private report, optional newsletter separation and unsubscribe behavior.
5. Enable only after verification, then turn on the corresponding website gate. Queued requests can then be processed without fabricating a prior delivery.
