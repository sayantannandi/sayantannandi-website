"""Shared offer copy: what you get from a person, the promise, and the three-way comparison."""

ICONS = {
    'read': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 4h14l6 6v18H6z"/><path d="M20 4v6h6M10 15h12M10 20h8"/><path d="M19 23l3 3 5-6"/></svg>',
    'vp': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7h16v11H11l-5 4v-4H4z"/><path d="M22 12h6v10h-2v4l-4-4h-7v-2"/></svg>',
    'loop': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M26 12a10 10 0 0 0-18-3M6 20a10 10 0 0 0 18 3"/><path d="M26 5v7h-7M6 27v-7h7"/></svg>',
    'peers': '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="4"/><circle cx="22" cy="11" r="4"/><path d="M3 26c0-5 4-8 8-8s8 3 8 8M17 20c1.5-1.3 3-2 5-2 4 0 7 3 7 8"/></svg>',
}

CARDS = [
    ('read', 'I read your work the way a panel would.', 'Personal written feedback on every weekly assignment: what a panel would conclude, and the line that changes it.'),
    ('vp', 'I play the sceptical VP.', 'A private 60-minute session with me. We rehearse your readiness conversation before you take it to your manager.'),
    ('loop', 'Support before the big moments.', 'Personal help for the executive meeting or talent review coming up: what to say, what to bring, what they will ask.'),
    ('peers', 'Connections beyond the program.', 'Practice with up to 20 managers facing the same jump, and build a network of like-minded, successful peers that lasts.'),
]


def cards(prefix):
    return ''.join(f'<article class="{prefix}-card"><div class="{prefix}-ico">{ICONS[k]}</div><h3>{t}</h3><p>{d}</p></article>' for k, t, d in CARDS)


def cohort_human_block():
    return f'''<section class="section wrap oc-human" id="what-you-get"><div class="oc-head"><span class="eyebrow">What you get from me</span><h2>What a chatbot or a generic leadership program won’t get you.</h2><p>The difference is in the work we do together: I read your actual submission, explain what a senior decision maker may conclude, and help you improve it before the conversation that matters.</p></div>
<div class="oc-grid">{cards('oc')}</div>
<p class="oc-note">Stuck on something else this week? Bring any leadership challenge to the live session, your weekly assignment or your 1:1.</p>
<div class="oc-promise"><article><span>What I don’t promise</span><p>A promotion. That depends on the roles your company has open, and on decisions I don’t make.</p></article><article class="is-do"><span>What I do promise</span><p>Personal feedback every week, a 60-minute rehearsal with me, and your one-page Readiness Note. Full refund if requested before the second live session.</p></article><article><span>What we’re aiming for</span><p>That the leaders around you start to see you differently. I can’t control how they judge you. I can make sure they have something new to judge.</p></article></div><p class="oc-confidential"><b>Keep sensitive work private.</b> Use anonymized examples rather than confidential company documents. Private coaching and group sessions have different boundaries; the FAQ explains recordings, privacy and what to share.</p></section>
'''


def feedback_example():
    return '''<section class="section oc-example" id="feedback-example"><div class="wrap"><div class="oc-head"><span class="eyebrow">What my feedback looks like</span><h2>One weekly update,<br>read the way a panel reads it.</h2><p>A made-up example, written to show the kind of feedback you get on every assignment.</p></div>
<div class="oc-doc"><div class="oc-col"><span class="oc-tag">What you sent</span><blockquote>“This sprint the team <mark>completed the data lake migration for 3 more business units<sup>1</sup></mark> (9 of 14 done). We also onboarded 2 engineers and <mark>resolved 27 tickets<sup>2</sup></mark>. <mark>Next sprint we will continue the remaining migrations.<sup>3</sup></mark>”</blockquote>
<p class="oc-verdict"><b>How a panel reads it:</b> a busy, reliable team. Nothing here needs a leader.</p></div>
<ol class="oc-notes"><li><b>What changed for those units?</b> Faster month-end, cheaper reports, fewer manual fixes? Pick the one your VP cares about.</li><li><b>Activity, not outcome.</b> Cut it, or say what those tickets were costing.</li><li><b>This is where you lead.</b> What decision do you need, and from whom?</li></ol>
<div class="oc-col oc-after"><span class="oc-tag">Your rewrite</span><blockquote>“Finance and supply chain now get daily reports instead of weekly ones, from 9 of 14 business units. The last 5 depend on one vendor. I recommend we extend that contract by 3 months for ₹18 lakh, rather than rebuild in-house for ₹45 lakh over 6 months. I need your call by Friday.”</blockquote>
<p class="oc-verdict"><b>How a panel reads it now:</b> someone who owns an outcome and makes a call.</p></div></div></div></section>
'''


def home_help_block():
    return f'''<section class="d-section hv-help" id="how-i-help"><div class="d-wrap"><div class="d-section-head"><div><span class="d-kicker">How I help</span><h2>What a chatbot or a generic<br><em>leadership program won’t get you.</em></h2></div><p>Personal feedback on your actual work, rehearsal before the important conversation, and practice with experienced peers. Choose the level of support that fits your situation.</p></div>
<div class="hv-help-grid">{cards('hv-help')}</div>
{compare_table()}</div></section>
'''


# ---------- Shared across all offer pages ----------
COURSE_BUY = 'https://tagmango.app/68942f6867'


def compare_table(current=None, cohort_href='/step-up/cohort'):
    """One comparison, used on the homepage and every offer page. `current` highlights that column."""
    tick = '<span class="ox-yes" aria-label="Included">✓</span>'
    no = '<span class="ox-no" aria-label="Not included">–</span>'
    rows = [
        ('The 12 lessons and 3 workbooks', tick, tick, tick),
        ('My feedback on your real work', no, 'Every week', 'Every session'),
        ('Rehearsal with me as the sceptical VP', no, 'One 60-minute 1:1', 'Every session'),
        ('Support before executive meetings and talent reviews', no, tick, tick),
        ('People at your level to practice with', no, 'Up to 20', tick),
        ('Refund policy', 'Refund after Module 1', 'Full refund before the second live session', 'Full refund before the second live session'),
    ]
    cols = ['course', 'cohort', 'coaching']
    pick = current or 'cohort'
    cls = lambda c: ' class="is-pick"' if c == pick else ''
    body = ''.join('<tr><th scope="row">' + r[0] + '</th>' + ''.join(f'<td{cls(c)}>{v}</td>' for c, v in zip(cols, r[1:])) + '</tr>' for r in rows)
    here = '<em>You are here</em>'
    badge = {c: (here if current == c else ('<em>Most people start here</em>' if c == 'cohort' and current is None else '')) for c in cols}
    cta = {
        'course': f'<a class="{"d-btn" if current == "course" else "d-text-link"}" href="{COURSE_BUY if current == "course" else "/step-up"}"{" target=_blank rel=noopener" if current == "course" else ""}>{"Get the course" if current == "course" else "See the course"} ↗</a>',
        'cohort': f'<a class="{"d-btn" if current in (None, "cohort") else "d-text-link"}" href="{cohort_href}">{"Book your seat" if current in (None, "cohort") else "See the cohort"} ↗</a>',
        'coaching': f'<a class="{"d-btn" if current == "coaching" else "d-text-link"}" href="{"#fit" if current == "coaching" else "/get-coached"}">Find out if we’re a fit ↗</a>',
    }
    head = (f'<th scope="col"{cls("course")}>{badge["course"]}<b>The course</b><span>₹8,999 · the lessons, at your own pace</span></th>'
            f'<th scope="col"{cls("cohort")}>{badge["cohort"]}<b>Live Leadership Classroom</b><span>₹17,499 early-bird · 6 live Saturdays</span></th>'
            f'<th scope="col"{cls("coaching")}>{badge["coaching"]}<b>Personal coaching</b><span>₹49,999 · six 1:1 sessions, plus the cohort</span></th>')
    foot = '<tr class="ox-cta-row"><th scope="row"></th>' + ''.join(f'<td{cls(c)}>{cta[c]}</td>' for c in cols) + '</tr>'
    return (f'<div class="ox-table-wrap"><table class="ox-compare"><thead><tr><th scope="col"><span class="ox-kicker">Three ways to work with me</span></th>{head}</tr></thead>'
            f'<tbody>{body}{foot}</tbody></table></div>')


def compare_section(current, cohort_href='/step-up/cohort', wrap='section wrap'):
    return (f'<section class="{wrap} ox-compare-section" id="compare"><div class="oc-head"><span class="eyebrow d-kicker">Choose how you want to work</span>'
            f'<h2>The same leadership work.<br>Three levels of me.</h2><p>Every option includes the lessons. What changes is how much of my time and judgment you get on your own work.</p></div>'
            f'{compare_table(current, cohort_href)}</section>')


def promise(dont, do, aim):
    return (f'<div class="oc-promise"><article><span>What I don’t promise</span><p>{dont}</p></article>'
            f'<article class="is-do"><span>What I do promise</span><p>{do}</p></article>'
            f'<article><span>What we’re aiming for</span><p>{aim}</p></article></div>'
            f'<p class="oc-confidential"><b>Keep sensitive work private.</b> Use anonymized examples rather than confidential company documents. Private coaching and group sessions have different boundaries; the FAQ explains recordings, privacy and what to share.</p>')


NO_PROMOTION = 'A promotion. That depends on the roles your company has open, and on decisions I don’t make.'
AIM = 'That the leaders around you start to see you differently. I can’t control how they judge you. I can make sure they have something new to judge.'


def course_get_block():
    items = [
        ('read', '12 short lessons', 'Each with a video, a study guide and practice scenarios. About three hours a week, at your own pace.'),
        ('loop', 'Worked answers', 'Practice on realistic situations, then compare your reasoning with mine.'),
        ('peers', '3 printable workbooks', 'The Promotion Case Builder, the Review Room Kit and the Executive Hour. Yours to keep.'),
        ('vp', 'Your one-page Readiness Note', 'Built in the last lesson, for the conversation about your next role.'),
    ]
    grid = ''.join(f'<article class="oc-card"><div class="oc-ico">{ICONS[k]}</div><h3>{t}</h3><p>{d}</p></article>' for k, t, d in items)
    return (f'<section class="section wrap oc-human" id="what-you-get"><div class="oc-head"><span class="eyebrow">What you get</span><h2>The lessons, done properly.<br>At your own pace.</h2>'
            f'<p>Everything you need to learn what the panel looks for and practice it on your own. What it doesn’t include is me reading your work. That’s the Live Leadership Classroom.</p></div>'
            f'<div class="oc-grid">{grid}</div>'
            + promise(NO_PROMOTION, 'Go through Module 1. If you don’t see the value, I refund 100% of your fee. Just email me from your purchase address.', AIM)
            + '</section>')


def coaching_get_block():
    items = [
        ('read', 'Your situation, not a curriculum.', 'Each session starts with what is in front of you: the role, the decision, the person who is hard to work with.'),
        ('vp', 'Rehearsal before it counts.', 'We run the hard conversation first, with me as the sceptical VP, until you’re ready for the real one.'),
        ('loop', 'You try it, then we look back.', 'Between sessions you act on one thing. Next time we look at what happened and adjust.'),
        ('peers', 'Plus the full Live Leadership Classroom.', 'The lessons, the six live Saturdays and the people at your level are included.'),
    ]
    grid = ''.join(f'<article class="oc-card"><div class="oc-ico">{ICONS[k]}</div><h3>{t}</h3><p>{d}</p></article>' for k, t, d in items)
    return (f'<section class="d-wrap d-section oc-human" id="what-you-get"><div class="oc-head"><span class="d-kicker">What you get from me</span><h2>The most of my time<br>and judgment.</h2>'
            f'<p>Six private 60-minute sessions, built around your real situations. We agree the scope on the free call, before you pay anything.</p></div>'
            f'<div class="oc-grid">{grid}</div>'
            + promise(NO_PROMOTION, 'Six private sessions on your real situations, rehearsal for the conversations we select together, and everything in the Live Leadership Classroom. Full refund if requested before the second live session.', AIM)
            + '</section>')


OBJECTIONS = {
    'cohort': [
        ('I barely have time.', 'About three hours a week, for six weeks. The assignments use work you are already doing: the update, the meeting, the decision.'),
        ('Why pay if I might leave anyway?', 'Leaving is when these skills are tested hardest. Interviews for the next level look for exactly this. And the cohort helps you decide whether to leave at all.'),
        ('I don’t want anyone at work to know.', 'Use your personal email. I do not contact your employer or tag you publicly without your permission. Group sessions are recorded for members, so bring anonymized examples. The FAQ explains the group privacy boundaries.'),
        ('At my level, I shouldn’t need this.', 'The higher you go, the less honest feedback you get. People stop telling you the truth just when it matters most.'),
        ('It’s politics. Training can’t fix that.', 'Some of it is. A lot of it is being readable to people who can’t check your work. That part is a skill, and it can be practised.'),
    ],
    'coaching': [
        ('How is this different from the cohort?', 'The cohort works on the common skills, with me reading your work every week. Coaching works on your specific situation, every session, and includes the cohort.'),
        ('Can I bring something sensitive?', 'Yes. Use anonymized names and company details. I do not contact your employer or publish your story without your permission. Private sessions and recorded group sessions have different boundaries, explained in the FAQ.'),
        ('Is this only about promotion?', 'No. People bring a bigger role, a hard decision, a difficult boss, or whether to stay at all. If it is a leadership decision, it belongs here.'),
    ],
}


def objections(kind, wrap='section wrap'):
    qa = ''.join(f'<details><summary>“{q}”</summary><p>{a}</p></details>' for q, a in OBJECTIONS[kind])
    return (f'<section class="{wrap} ox-objections"><div class="oc-head"><span class="eyebrow d-kicker">What people ask before joining</span>'
            f'<h2>Fair questions,<br>straight answers.</h2></div><div class="ox-qa">{qa}</div></section>')


def social_links():
    brands = [
        ('YouTube','https://www.youtube.com/@sayantannandi','<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6Z"/>'),
        ('LinkedIn','https://www.linkedin.com/in/sayantannandi/','<path d="M20.45 0H3.55A3.55 3.55 0 0 0 0 3.55v16.9A3.55 3.55 0 0 0 3.55 24h16.9A3.55 3.55 0 0 0 24 20.45V3.55A3.55 3.55 0 0 0 20.45 0ZM7.1 20H3.7V9h3.4ZM5.4 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM20.3 20h-3.4v-5.35c0-1.27-.03-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V20H9.7V9h3.25v1.5H13a3.56 3.56 0 0 1 3.2-1.76c3.43 0 4.07 2.26 4.07 5.2Z"/>'),
        ('Instagram','https://www.instagram.com/sayantannandi_','<rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1.2"/>')]
    return '<nav class="sn-social" aria-label="Sayantan on social media">'+''.join(f'<a href="{url}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{path}</svg><span>{name}</span></a>' for name,url,path in brands)+'</nav>'


def coaching_plan():
    return '''<section class="d-section d-tint"><div class="d-wrap"><div class="d-section-head"><div><span class="d-kicker">Your six-session plan</span><h2>One real challenge.<br>A plan you can use.</h2></div><p>We choose the focus together. The sessions follow what happens when you put the work into practice.</p></div><div class="d-process"><article><span>01 · Understand</span><h3>Make the problem clear.</h3><p>Use the first session to separate facts from assumptions, define a useful outcome and agree what evidence would show progress.</p></article><article><span>02 · Prepare & practice</span><h3>Work on the next decision.</h3><p>Use the middle sessions to examine options, review your drafts and rehearse the conversations you select. Try one agreed action between sessions.</p></article><article><span>03 · Review & continue</span><h3>Leave with your next moves.</h3><p>Review what changed, the evidence you have built and what still needs work. Finish with a plan for your next review or leadership challenge.</p></article></div><div class="sn-coaching-scope"><h3>Agree the boundaries before you pay.</h3><p>Your written coaching plan specifies the six session dates and completion window, rescheduling arrangements, any draft reviews between sessions, the contact channel and response time. Preparation happens within that agreed scope. This is scheduled coaching, rather than unlimited on-call access.</p><p>The ₹49,999 package includes six private 60-minute sessions in total, plus the Live Leadership Classroom. The cohort’s single private session is included within those six. We confirm the included cohort dates before payment. You can use private sessions to prepare for a live situation while waiting for the group program to start.</p></div></div></section>'''
