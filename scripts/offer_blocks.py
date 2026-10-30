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
    tick = '<span class="hv-yes" aria-label="Included">✓</span>'
    no = '<span class="hv-no" aria-label="Not included">–</span>'
    rows = [
        ('The 12 lessons and 3 workbooks', tick, tick, tick),
        ('My feedback on your real work', no, 'Every week', 'Every session'),
        ('Rehearsal with me as the sceptical VP', no, 'One 60-minute 1:1', 'Every session'),
        ('A weekly check on what you tried', no, tick, tick),
        ('People at your level to practice with', no, 'Up to 20', tick),
    ]
    body = ''.join(f'<tr><th scope="row">{r[0]}</th><td>{r[1]}</td><td class="is-pick">{r[2]}</td><td>{r[3]}</td></tr>' for r in rows)
    return f'''<section class="d-section hv-help" id="how-i-help"><div class="d-wrap"><div class="d-section-head"><div><span class="d-kicker">How I help</span><h2>What you get from a person,<br><em>not a chatbot.</em></h2></div><p>Any tool can explain what “be more strategic” means. These four things need someone who has sat on the panel.</p></div>
<div class="hv-help-grid">{cards('hv-help')}</div>
<div class="hv-table-wrap"><table class="hv-compare"><thead><tr><th scope="col"><span class="d-kicker">Three ways to work with me</span></th><th scope="col"><b>The course</b><span>₹8,999 · the lessons, at your own pace</span></th><th scope="col" class="is-pick"><em>Most people start here</em><b>Workshop Cohort</b><span>₹17,499 early-bird · 6 live Saturdays</span></th><th scope="col"><b>Personal coaching</b><span>₹49,999 · six 1:1 sessions</span></th></tr></thead>
<tbody>{body}<tr class="hv-cta-row"><th scope="row"></th><td><a class="d-text-link" href="/step-up">See the course ↗</a></td><td class="is-pick"><a class="d-btn" href="/step-up/cohort">Book your seat ↗</a></td><td><a class="d-text-link" href="/get-coached">Find out if we’re a fit ↗</a></td></tr></tbody></table></div></div></section>
'''
