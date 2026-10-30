"""Shared offer copy: what you get from a person, the promise, and the three-way comparison."""

ICONS = {
    'read': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 4h14l6 6v18H6z"/><path d="M20 4v6h6M10 15h12M10 20h8"/><path d="M19 23l3 3 5-6"/></svg>',
    'vp': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 7h16v11H11l-5 4v-4H4z"/><path d="M22 12h6v10h-2v4l-4-4h-7v-2"/></svg>',
    'loop': '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M26 12a10 10 0 0 0-18-3M6 20a10 10 0 0 0 18 3"/><path d="M26 5v7h-7M6 27v-7h7"/></svg>',
    'peers': '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="4"/><circle cx="22" cy="11" r="4"/><path d="M3 26c0-5 4-8 8-8s8 3 8 8M17 20c1.5-1.3 3-2 5-2 4 0 7 3 7 8"/></svg>',
}

CARDS = [
    ('read', 'I read your work the way a panel would.', 'Personal written feedback on every weekly assignment: what a panel would conclude, and the line that changes it.'),
    ('vp', 'I play the sceptical VP.', 'A private 60-minute session with me. We rehearse your readiness conversation before you have it for real.'),
    ('loop', 'You report back every week.', 'Bring what you actually sent at work. We look at what happened, and what to try next.'),
    ('peers', 'You practice with people at your level.', 'Up to 20 managers facing the same jump, across companies and functions.'),
]


def cards(prefix):
    return ''.join(f'<article class="{prefix}-card"><div class="{prefix}-ico">{ICONS[k]}</div><h3>{t}</h3><p>{d}</p></article>' for k, t, d in CARDS)


def cohort_human_block():
    return f'''<section class="section wrap oc-human" id="what-you-get"><div class="oc-head"><span class="eyebrow">What you get from me, not a chatbot</span><h2>The lessons are the easy part.<br>The practice is why you’re here.</h2><p>Any tool can explain “be more strategic”. It can’t read your work the way a review panel does, or tell you what to change before your next review.</p></div>
<div class="oc-grid">{cards('oc')}</div>
<p class="oc-note">Stuck on something else this week? Bring any leadership challenge to the live session, your weekly assignment or your 1:1.</p>
<div class="oc-promise"><article><span>What I don’t promise</span><p>A promotion. That depends on the roles your company has open, and on decisions I don’t make.</p></article><article class="is-do"><span>What I do promise</span><p>Personal feedback every week, a 60-minute rehearsal with me, and your one-page Readiness Note. If your manager’s rating of your work hasn’t gone up 90 days after the cohort, you get your fee back.</p></article><article><span>What we’re aiming for</span><p>That the leaders around you start to see you differently. I can’t control how they judge you. I can make sure they have something new to judge.</p></article></div></section>
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
    return f'''<section class="d-section hv-help" id="how-i-help"><div class="d-wrap"><div class="d-section-head"><div><span class="d-kicker">How I help</span><h2>What you get from a person,<br><em>not a chatbot.</em></h2></div><p>Any tool can explain what “be more strategic” means. These four things need someone who has sat on the panel.</p></div>
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
        ('A weekly check on what you tried', no, tick, tick),
        ('People at your level to practice with', no, 'Up to 20', tick),
        ('Guarantee', 'Refund after Module 1', '90-day manager rating', '90-day manager rating'),
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
            f'<th scope="col"{cls("cohort")}>{badge["cohort"]}<b>Workshop Cohort</b><span>₹17,499 early-bird · 6 live Saturdays</span></th>'
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
            f'<article><span>What we’re aiming for</span><p>{aim}</p></article></div>')


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
            f'<p>Everything you need to learn what the panel looks for and practice it on your own. What it doesn’t include is me reading your work. That’s the Workshop Cohort.</p></div>'
            f'<div class="oc-grid">{grid}</div>'
            + promise(NO_PROMOTION, 'Go through Module 1. If you don’t see the value, I refund 100% of your fee. Just email me from your purchase address.', AIM)
            + '</section>')


def coaching_get_block():
    items = [
        ('read', 'Your situation, not a curriculum.', 'Each session starts with what is in front of you: the role, the decision, the person who is hard to work with.'),
        ('vp', 'Rehearsal before it counts.', 'We run the hard conversation first, with me as the sceptical VP, until you’re ready for the real one.'),
        ('loop', 'You try it, then we look back.', 'Between sessions you act on one thing. Next time we look at what happened and adjust.'),
        ('peers', 'Plus the full Workshop Cohort.', 'The lessons, the six live Saturdays and the people at your level are included.'),
    ]
    grid = ''.join(f'<article class="oc-card"><div class="oc-ico">{ICONS[k]}</div><h3>{t}</h3><p>{d}</p></article>' for k, t, d in items)
    return (f'<section class="d-wrap d-section oc-human" id="what-you-get"><div class="oc-head"><span class="d-kicker">What you get from me</span><h2>The most of my time<br>and judgment.</h2>'
            f'<p>Six private 60-minute sessions, built around your real situations. We agree the scope on the free call, before you pay anything.</p></div>'
            f'<div class="oc-grid">{grid}</div>'
            + promise(NO_PROMOTION, 'Six private sessions on your real situations, preparation for every high-stakes conversation, and everything in the Workshop Cohort. The cohort’s 90-day guarantee applies.', AIM)
            + '</section>')


OBJECTIONS = {
    'cohort': [
        ('I barely have time.', 'About three hours a week, for six weeks. The assignments use work you are already doing: the update, the meeting, the decision.'),
        ('Why pay if I might leave anyway?', 'Leaving is when these skills are tested hardest. Interviews for the next level look for exactly this. And the cohort helps you decide whether to leave at all.'),
        ('I don’t want anyone at work to know.', 'Use your personal email. Nothing is shared with your employer, and nobody is tagged anywhere. What you bring stays in the room.'),
        ('At my level, I shouldn’t need this.', 'The higher you go, the less honest feedback you get. People stop telling you the truth just when it matters most.'),
        ('It’s politics. Training can’t fix that.', 'Some of it is. A lot of it is being readable to people who can’t check your work. That part is a skill, and it can be practised.'),
    ],
    'coaching': [
        ('How is this different from the cohort?', 'The cohort works on the common skills, with me reading your work every week. Coaching works on your specific situation, every session, and includes the cohort.'),
        ('Can I bring something sensitive?', 'Yes. Anonymise names and company details, and we agree boundaries before we start. Nothing reaches your employer.'),
        ('Is this only about promotion?', 'No. People bring a bigger role, a hard decision, a difficult boss, or whether to stay at all. If it is a leadership decision, it belongs here.'),
    ],
}


def objections(kind, wrap='section wrap'):
    qa = ''.join(f'<details><summary>“{q}”</summary><p>{a}</p></details>' for q, a in OBJECTIONS[kind])
    return (f'<section class="{wrap} ox-objections"><div class="oc-head"><span class="eyebrow d-kicker">What people ask before joining</span>'
            f'<h2>Fair questions,<br>straight answers.</h2></div><div class="ox-qa">{qa}</div></section>')
