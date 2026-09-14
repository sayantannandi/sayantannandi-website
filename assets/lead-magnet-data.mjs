// Original fictional teaching cases. Editorial scoring is not a validated assessment.
export const tests = {
  "judgment": {
    "id": "judgment",
    "slug": "senior-level-judgment",
    "title": "Senior-Level Judgment Check",
    "hook": "Move from reporting the problem to making a call.",
    "minutes": "5–7",
    "form": "step-up-judgment-results",
    "version": "2026-09-v1",
    "dimensions": [
      {
        "id": "recommendation",
        "title": "Making a recommendation",
        "lesson": 3,
        "summary": "Make the proposed action clear while keeping uncertainty visible.",
        "exercise": [
          "Choose one decision that needs an answer this week.",
          "Write the action you recommend and the evidence supporting it.",
          "Name one assumption and the evidence that would change your view.",
          "Set a review date or a limit that keeps the downside manageable."
        ]
      },
      {
        "id": "priorities",
        "title": "Making room for a priority",
        "lesson": 4,
        "summary": "Explain what a new commitment displaces before accepting it.",
        "exercise": [
          "List the work already committed for the week.",
          "Estimate the capacity a new request needs.",
          "Name the item you propose to stop or move, and who is affected.",
          "Ask the person who owns the priorities to agree the change."
        ]
      },
      {
        "id": "ownership",
        "title": "Giving responsibility clear boundaries",
        "lesson": 9,
        "summary": "Make the owner’s authority and review conditions explicit.",
        "exercise": [
          "Select one outcome that another person can own.",
          "Write what they can decide without your approval.",
          "Name a boundary that requires them to check with you.",
          "Agree when you will review the result and which evidence to bring."
        ]
      }
    ],
    "questions": [
      {
        "id": "j1",
        "dimension": "recommendation",
        "title": "The supplier decision",
        "situation": "A supplier may miss Friday’s delivery. A backup can cover the essential order for ₹80,000 extra, but needs approval today. You cannot yet confirm whether the original supplier will recover.",
        "question": "What would you recommend?",
        "options": [
          {
            "id": "a",
            "text": "Keep checking with the original supplier until its delivery date is certain.",
            "points": 0,
            "feedback": "Waiting uses up the backup option. Uncertainty is part of the decision, not a reason to leave it unmade."
          },
          {
            "id": "b",
            "text": "Approve the essential backup order today, state the extra cost, and cancel any unneeded quantity if the terms allow.",
            "points": 2,
            "feedback": "This preserves essential delivery while naming the cost and a possible way to limit waste. Check the cancellation terms before relying on them."
          },
          {
            "id": "c",
            "text": "Send both suppliers’ details to the director and ask which option they prefer.",
            "points": 1,
            "feedback": "You expose the options, but leave the director to do the recommendation work you can already do."
          },
          {
            "id": "d",
            "text": "Switch the entire order to the backup so there is only one supplier to manage.",
            "points": 1,
            "feedback": "The backup helps with the essential quantity. Moving everything may add cost beyond what the stated risk requires."
          }
        ]
      },
      {
        "id": "j2",
        "dimension": "recommendation",
        "title": "A promising pilot",
        "situation": "A two-week trial reduced average resolution time by 15% in one team. The sample was small and customer satisfaction has not yet been checked. Your sponsor asks whether to roll it out to 20 teams.",
        "question": "What is the most defensible next step?",
        "options": [
          {
            "id": "a",
            "text": "Roll it out to all 20 teams because the first result is positive.",
            "points": 0,
            "feedback": "The trial is encouraging, but it does not establish the same result across 20 teams or rule out a customer-service cost."
          },
          {
            "id": "b",
            "text": "Stop until you have six months of data from the current team.",
            "points": 1,
            "feedback": "More evidence would help, but the facts do not establish that a six-month delay is necessary."
          },
          {
            "id": "c",
            "text": "Recommend a wider rollout and mention the small sample in the appendix.",
            "points": 1,
            "feedback": "You acknowledge uncertainty, but the rollout remains much larger than the evidence supports."
          },
          {
            "id": "d",
            "text": "Extend the trial to two different teams, track satisfaction as well as speed, and agree a review before expanding.",
            "points": 2,
            "feedback": "A bounded next test can show whether the benefit transfers without committing all 20 teams at once."
          }
        ]
      },
      {
        "id": "j3",
        "dimension": "priorities",
        "title": "The urgent request",
        "situation": "Your team has 40 hours available this week, already allocated to agreed work. A director requests a new analysis needing about 12 hours. None of the existing work can be completed faster without cutting scope.",
        "question": "How would you respond?",
        "options": [
          {
            "id": "a",
            "text": "Describe the 12-hour requirement, propose which agreed work should move, and ask the director to confirm the change.",
            "points": 2,
            "feedback": "This makes the cost of the request visible and puts the priority decision with the person who can authorise it."
          },
          {
            "id": "b",
            "text": "Accept the analysis and ask everyone to find a few extra hours.",
            "points": 0,
            "feedback": "That creates an unagreed capacity commitment and leaves the effect on existing work hidden."
          },
          {
            "id": "c",
            "text": "Decline because the team’s plan is already full.",
            "points": 1,
            "feedback": "You protect capacity, but do not help the director choose between the old and new commitments."
          },
          {
            "id": "d",
            "text": "Start the analysis and flag any missed deadline at the end of the week.",
            "points": 1,
            "feedback": "You begin useful work, but the trade-off is disclosed after the chance to choose has passed."
          }
        ]
      },
      {
        "id": "j4",
        "dimension": "priorities",
        "title": "The new dashboard",
        "situation": "A monthly dashboard takes eight hours to prepare. The two people who receive it say they have not used it for a decision in three months. A new reporting request would take those same eight hours.",
        "question": "What would you propose?",
        "options": [
          {
            "id": "a",
            "text": "Keep both reports until someone explicitly complains about the workload.",
            "points": 0,
            "feedback": "The unused report continues to consume the capacity needed for the new request."
          },
          {
            "id": "b",
            "text": "Stop the old dashboard permanently without telling its recipients.",
            "points": 1,
            "feedback": "You release capacity, but remove a commitment without agreement or a check for uses you may have missed."
          },
          {
            "id": "c",
            "text": "Agree a one-month pause with the recipients, redirect the eight hours, and review whether anything important was lost.",
            "points": 2,
            "feedback": "The pause tests whether the report is still needed while making the capacity choice explicit."
          },
          {
            "id": "d",
            "text": "Ask the recipients to use the old dashboard more often.",
            "points": 1,
            "feedback": "That asks people to change their behaviour without establishing a decision the dashboard would support."
          }
        ]
      },
      {
        "id": "j5",
        "dimension": "ownership",
        "title": "A capable colleague",
        "situation": "A colleague can run a familiar project. You want them to own it, but changes to the customer promise still require your approval.",
        "question": "What would you agree at the handover?",
        "options": [
          {
            "id": "a",
            "text": "Ask them to copy you on every message so you can intervene quickly.",
            "points": 1,
            "feedback": "Visibility may help, but copying every message does not define their decision authority."
          },
          {
            "id": "b",
            "text": "Agree the outcome and decisions they own, require approval for customer-promise changes, and set a review point.",
            "points": 2,
            "feedback": "They can act within a clear boundary, and you retain the approval responsibility that the situation requires."
          },
          {
            "id": "c",
            "text": "Say they have full ownership and ask them to use their judgment about everything.",
            "points": 0,
            "feedback": "Full ownership does not remove the stated approval boundary. The handover leaves that conflict unresolved."
          },
          {
            "id": "d",
            "text": "Give them a detailed task list and approve each completed task.",
            "points": 1,
            "feedback": "The task list helps execution, but it leaves most judgment with you rather than transferring ownership."
          }
        ]
      },
      {
        "id": "j6",
        "dimension": "ownership",
        "title": "Two teams, one launch",
        "situation": "Sales needs an exception to the standard onboarding process for a launch. Operations will carry the extra work and risk. You manage neither team, and no one has agreed who can stop the exception.",
        "question": "What would you do first?",
        "options": [
          {
            "id": "a",
            "text": "Ask Sales to start and settle responsibility after the launch.",
            "points": 0,
            "feedback": "The teams would begin without agreement on who carries the risk or can stop the exception."
          },
          {
            "id": "b",
            "text": "Escalate directly to the CEO and ask for a permanent exception.",
            "points": 1,
            "feedback": "Escalation may become necessary, but a permanent exception is broader than the stated launch need."
          },
          {
            "id": "c",
            "text": "Offer to monitor the situation yourself so neither team has to worry.",
            "points": 1,
            "feedback": "Monitoring adds attention without agreeing the authority or workload of either team."
          },
          {
            "id": "d",
            "text": "Bring both teams together to agree a limited exception, a responsible owner and a stop condition before launch.",
            "points": 2,
            "feedback": "This creates an agreement the two teams can act on, including who owns the exception and when it ends."
          }
        ]
      }
    ]
  },
  "visibility": {
    "id": "visibility",
    "slug": "leadership-visibility",
    "title": "Leadership Visibility Check",
    "hook": "Make your contribution easier to understand and use.",
    "minutes": "5–7",
    "form": "step-up-visibility-results",
    "version": "2026-09-v1",
    "dimensions": [
      {
        "id": "outcomes",
        "title": "Showing what changed",
        "lesson": 1,
        "summary": "Describe a supported result and your contribution to it.",
        "exercise": [
          "Choose one claim from your latest update or appraisal.",
          "Write what changed and for whom, using a number you can support.",
          "Separate your contribution from the contributions of other people.",
          "State what the evidence does not yet prove."
        ]
      },
      {
        "id": "clarity",
        "title": "Making the main point clear",
        "lesson": 5,
        "summary": "Lead with the decision or result that the reader needs.",
        "exercise": [
          "Select an update that currently starts with a history of the work.",
          "Write its main point in one sentence.",
          "Add the evidence the reader needs to check that sentence.",
          "Put the requested decision and date where the reader can find them."
        ]
      },
      {
        "id": "trust",
        "title": "Reducing uncertainty",
        "lesson": 6,
        "summary": "Make unresolved questions and the next useful check visible.",
        "exercise": [
          "Ask your manager which unresolved question matters most this week.",
          "Write what is known and what remains uncertain.",
          "Name who will find the missing information and by when.",
          "Send the next update when promised, even if the answer is still incomplete."
        ]
      }
    ],
    "questions": [
      {
        "id": "v1",
        "dimension": "outcomes",
        "title": "The faster monthly close",
        "situation": "Your team reduced reconciliation time from 40 to 28 staff-hours in one monthly close. Headcount and payroll are unchanged. You have not yet checked whether the improvement will persist.",
        "question": "Which claim can you support?",
        "options": [
          {
            "id": "a",
            "text": "The process delivered a permanent 30% cost saving.",
            "points": 0,
            "feedback": "Time fell by 30% in this close. Neither a payroll reduction nor a permanent saving has been established."
          },
          {
            "id": "b",
            "text": "The team worked hard to streamline the reconciliation process.",
            "points": 1,
            "feedback": "This describes effort but leaves out the observed change."
          },
          {
            "id": "c",
            "text": "This close used 12 fewer staff-hours, releasing capacity without a payroll saving yet; we will check the next close.",
            "points": 2,
            "feedback": "The claim uses the measured result and states its limits, including the difference between capacity and cash."
          },
          {
            "id": "d",
            "text": "Reconciliation is now more efficient across the whole department.",
            "points": 1,
            "feedback": "The local result suggests an improvement, but the facts do not establish a department-wide effect."
          }
        ]
      },
      {
        "id": "v2",
        "dimension": "outcomes",
        "title": "A joint result",
        "situation": "A customer renewal followed work by your service team and the account team. Your contribution was resolving three recurring service failures. The account team also negotiated new commercial terms.",
        "question": "How would you describe your contribution?",
        "options": [
          {
            "id": "a",
            "text": "I resolved three recurring service failures that supported the renewal; the account team negotiated the commercial terms.",
            "points": 2,
            "feedback": "You identify your contribution without claiming sole responsibility for a joint result."
          },
          {
            "id": "b",
            "text": "I secured the renewal and protected the entire contract value.",
            "points": 0,
            "feedback": "The facts do not support sole credit or show that the whole contract value depended on your work."
          },
          {
            "id": "c",
            "text": "The renewal went well thanks to teamwork.",
            "points": 1,
            "feedback": "The credit is shared, but the reader cannot see which part you owned."
          },
          {
            "id": "d",
            "text": "I attended the renewal meetings and coordinated several internal discussions.",
            "points": 1,
            "feedback": "The activity may be accurate, but it does not explain the service failures you resolved."
          }
        ]
      },
      {
        "id": "v3",
        "dimension": "clarity",
        "title": "The director’s two minutes",
        "situation": "Your director has two minutes to read an update. A launch can proceed if they approve a reduced first release today. The full release would miss the customer’s date by two weeks.",
        "question": "How would you open?",
        "options": [
          {
            "id": "a",
            "text": "List the work completed since the last steering meeting.",
            "points": 0,
            "feedback": "The reader must search for the decision that is urgent today."
          },
          {
            "id": "b",
            "text": "Say the launch has a few challenges and you would welcome guidance.",
            "points": 1,
            "feedback": "You signal an issue without specifying the decision or recommendation."
          },
          {
            "id": "c",
            "text": "Describe the full release in detail, then put the approval request at the end.",
            "points": 1,
            "feedback": "The detail may support the choice, but the time-sensitive request is easy to miss."
          },
          {
            "id": "d",
            "text": "Ask for approval today for the reduced first release, explain what it excludes, and state the two-week alternative.",
            "points": 2,
            "feedback": "The director can see the choice and its consequences before deciding whether to examine the supporting detail."
          }
        ]
      },
      {
        "id": "v4",
        "dimension": "clarity",
        "title": "The forwarded update",
        "situation": "Your manager will forward your project update to a finance director who does not know the internal acronyms. The update needs approval for a limited trial, not a full rollout.",
        "question": "What would you change before it goes?",
        "options": [
          {
            "id": "a",
            "text": "Keep the acronyms because a senior reader can ask someone to explain them.",
            "points": 0,
            "feedback": "The forwarded update would depend on a conversation the reader may never have."
          },
          {
            "id": "b",
            "text": "State the trial decision and its cost in plain English, define the essential terms, and keep the detail below.",
            "points": 2,
            "feedback": "The update can be understood and acted on without losing the boundary between a trial and a rollout."
          },
          {
            "id": "c",
            "text": "Remove the costs and constraints to make the update shorter.",
            "points": 1,
            "feedback": "The result is shorter, but it removes information needed to approve the trial."
          },
          {
            "id": "d",
            "text": "Add a glossary while leaving the request buried in the final paragraph.",
            "points": 1,
            "feedback": "The glossary helps with terminology, but the decision still takes unnecessary work to find."
          }
        ]
      },
      {
        "id": "v5",
        "dimension": "trust",
        "title": "The uncertain deadline",
        "situation": "A dependency may put Friday’s release at risk. You will have a reliable answer from the supplier by Wednesday noon. Your manager is due to discuss the release on Wednesday afternoon.",
        "question": "What would you send now?",
        "options": [
          {
            "id": "a",
            "text": "Say the release is on track so you do not create concern before the facts are clear.",
            "points": 0,
            "feedback": "That hides a relevant uncertainty your manager will need for the Wednesday discussion."
          },
          {
            "id": "b",
            "text": "Forward the entire supplier email chain without a summary.",
            "points": 1,
            "feedback": "The evidence is available, but your manager must work out what it means and when an answer is due."
          },
          {
            "id": "c",
            "text": "Name the uncertain dependency, explain the release risk, and commit to an update by Wednesday noon.",
            "points": 2,
            "feedback": "Your manager knows what is unresolved and when they can expect information before their own discussion."
          },
          {
            "id": "d",
            "text": "Report that the release is at risk, but wait to name a follow-up until the supplier confirms.",
            "points": 1,
            "feedback": "You disclose the risk but leave your manager uncertain about when it will be resolved."
          }
        ]
      },
      {
        "id": "v6",
        "dimension": "trust",
        "title": "The next-role conversation",
        "situation": "Your manager says you need to show broader responsibility. You have examples of cross-team decisions, but neither of you has agreed what evidence would demonstrate readiness for the next role.",
        "question": "What would you ask for?",
        "options": [
          {
            "id": "a",
            "text": "Compare two recent examples with the next role’s expectations and agree what further evidence to review, with a date.",
            "points": 2,
            "feedback": "This turns a broad comment into an evidence-based discussion without treating a promotion as already promised."
          },
          {
            "id": "b",
            "text": "Ask them to confirm a promotion date before discussing evidence.",
            "points": 1,
            "feedback": "A timeline matters, but the evidence requirement remains unresolved."
          },
          {
            "id": "c",
            "text": "Wait until appraisal season and work longer hours in the meantime.",
            "points": 0,
            "feedback": "Extra hours do not establish which responsibility or evidence is missing."
          },
          {
            "id": "d",
            "text": "Send a long list of completed tasks and ask whether it is enough.",
            "points": 1,
            "feedback": "The list offers material to review, but does not connect it to the expectations of the next role."
          }
        ]
      }
    ]
  }
};
