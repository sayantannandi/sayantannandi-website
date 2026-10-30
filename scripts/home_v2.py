"""Proposed homepage (review only). Served at /review/home-v2; the live homepage is unchanged."""
import math
from destination_art import climb, build, slow_down

RUNGS = [
    ('Expertise', 'You know the domain better than most people around you.', 'Is this person good at the work?'),
    ('Execution', 'You deliver, reliably and on time.', 'Can we trust them with delivery?'),
    ('Management', 'You get work done through a team.', 'Can they run a team without drama?'),
    ('Strategy', 'You decide what the team should and should not do, and why.', 'Can they make a call when the facts are incomplete?'),
    ('Influence', 'People outside your team change their plans because of you.', 'Do other leaders follow their lead?'),
    ('Leadership', 'You own business outcomes, and the consequences.', 'Would we trust them with a business?'),
]

NODES = [
    ('time', 'Time', 'Where everyone starts: time, energy and the ability to learn. At first you trade it for money.'),
    ('skills', 'Skills', 'Expertise, judgment and influence. Each step up the ladder changes what an hour of yours is worth.'),
    ('income', 'Income', 'What the market pays for who you are today. This is your Earning Power, made visible.'),
    ('capital', 'Capital', 'The part of your income you keep and put to work. Savings, investments and runway.'),
    ('options', 'Options', 'Capital buys months of runway and real alternatives. This is your Exit Power.'),
]


def ladder():
    steps = ''
    for i, (name, does, asks) in enumerate(RUNGS):
        if i == 3:
            steps += '<div class="hv-stall" aria-hidden="true"><span>Where most strong careers stall</span></div>'
        steps += (f'<button class="hv-rung{" is-above" if i >= 3 else ""}" data-rung="{i}" aria-pressed="{"true" if i == 3 else "false"}" '
                  f'style="--h:{70 + i * 42}px" data-does="{does}" data-asks="{asks}"><span>{i + 1}</span><b>{name}</b></button>')
    return f'''<div class="hv-ladder"><div class="hv-rungs" role="group" aria-label="The Leadership Value Ladder">{steps}</div>
<div class="hv-rung-card" aria-live="polite"><span class="d-kicker" id="hv-rung-kicker">Rung 4 · Strategy</span><p id="hv-rung-does">{RUNGS[3][1]}</p><p class="hv-asks">What the review panel asks: <b id="hv-rung-asks">{RUNGS[3][2]}</b></p><a class="d-btn" id="hv-rung-link" href="/tests/senior-level-judgment">Take the Rung 4 check ↗</a></div></div>'''


def circle():
    cx, cy, r = 260, 260, 180
    pts = []
    for i in range(5):
        a = math.radians(-90 + i * 72)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    arcs = ''
    halves = ['earn', 'earn', 'exit', 'exit', 'exit']
    for i in range(5):
        a1 = math.radians(-90 + i * 72 + 17)
        a2 = math.radians(-90 + (i + 1) * 72 - 17)
        x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
        x2, y2 = cx + r * math.cos(a2), cy + r * math.sin(a2)
        arcs += f'<path class="hv-arc" data-half="{halves[i]}" d="M{x1:.1f} {y1:.1f} A{r} {r} 0 0 1 {x2:.1f} {y2:.1f}" marker-end="url(#hv-arrow)"/>'
    nodes = ''
    for (key, label, _), (x, y) in zip(NODES, pts):
        half = 'earn' if key in ('skills',) else 'exit' if key in ('capital', 'options') else 'both'
        nodes += (f'<g class="hv-node" data-node="{key}" data-half="{half}" tabindex="0" role="button" aria-label="{label}">'
                  f'<circle cx="{x:.1f}" cy="{y:.1f}" r="48"/><text x="{x:.1f}" y="{y + 7:.1f}" text-anchor="middle">{label}</text></g>')
    return f'''<figure class="hv-circle" data-mode="all"><svg viewBox="0 0 520 520" role="img" aria-labelledby="hv-circle-title"><title id="hv-circle-title">The Time Equation: Time, Skills, Income, Capital, Options, back to Time</title>
<defs><marker id="hv-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L8 5L1 9" fill="none" stroke="context-stroke" stroke-width="1.8" stroke-linecap="round"/></marker></defs>
{arcs}{nodes}
<text class="hv-center-title" x="260" y="250" text-anchor="middle">The Time</text><text class="hv-center-title" x="260" y="284" text-anchor="middle">Equation</text>
<text class="hv-half-label" data-half="earn" x="470" y="120" text-anchor="middle">makes your</text><text class="hv-half-label" data-half="earn" x="470" y="142" text-anchor="middle">time valuable</text>
<text class="hv-half-label" data-half="exit" x="60" y="420" text-anchor="middle">makes it</text><text class="hv-half-label" data-half="exit" x="60" y="442" text-anchor="middle">yours</text>
</svg><figcaption class="hv-node-card" aria-live="polite"><span class="d-kicker" id="hv-node-kicker">Tap any circle</span><p id="hv-node-text">Each step feeds the next. The first half makes your time valuable. The second half makes it yours again.</p></figcaption></figure>'''


def home_v2():
    node_data = ''.join(f'<span hidden data-node-info="{k}" data-label="{l}">{t}</span>' for k, l, t in NODES)
    return f'''<section class="d-wrap hv-hero"><div class="hv-hero-inner"><span class="d-kicker">For managers 12 to 22 years into their career</span>
<h1>Good at your work.<br><em>Still waiting for the next level.</em></h1>
<ul class="hv-signs"><li>Told to “be more strategic”, with no idea what that means on a Tuesday.</li><li>Passed over when the next level opened up.</li><li>Ready for a global role nobody is offering you.</li><li>Doing the work. Nobody above you seems to see it.</li></ul>
<p class="d-lede">The rules of a career <b>change without announcing themselves</b>. What got you here is not what the next level looks for.</p>
<a class="d-btn" href="#ladder">See where you are on the ladder <span>↓</span></a></div></section>

<section class="d-section d-tint" id="ladder"><div class="d-wrap"><div class="d-section-head"><div><span class="d-kicker">The Leadership Value Ladder</span><h2>Six rungs.<br>The rules change halfway up.</h2></div><p>Below the line, the panel judges your work. Above it, they judge your thinking. Tap a rung to see what changes.</p></div>
{ladder()}
<div class="hv-verdicts" aria-roledescription="carousel" aria-label="What the review panel said"><span class="hv-quote-mark" aria-hidden="true">“</span><div class="hv-verdict-top"><span class="d-kicker">Heard in the review room</span></div><blockquote class="hv-quote is-on" data-quote="0"><p>“Hard worker with strong domain knowledge, but not ready to face senior leadership.”</p></blockquote><blockquote class="hv-quote" data-quote="1" hidden><p>“Good talent, but not leadership potential.”</p></blockquote><blockquote class="hv-quote" data-quote="2" hidden><p>“Extremely valuable and extremely experienced, but not able to lead or deliver a business outcome.”</p></blockquote><div class="hv-verdict-foot"><p>Each one was said about someone good at their job, and stuck below the line.</p><div class="hv-dots"><span class="hv-count" aria-live="polite"><b id="hv-quote-n">1</b> of 3</span><button class="hv-dot" data-go="0" aria-label="Sentence 1" aria-pressed="true"></button><button class="hv-dot" data-go="1" aria-label="Sentence 2" aria-pressed="false"></button><button class="hv-dot" data-go="2" aria-label="Sentence 3" aria-pressed="false"></button><button class="hv-arrow" data-next aria-label="Next sentence">→</button></div></div></div>
<div class="hv-checks" id="checks"><a class="hv-check" href="/tests/senior-level-judgment"><span>Rung 4 · Strategy</span><h3>Senior-Level Judgment Check</h3><p>Can you bring a decision when everyone wants an update? 6 questions, 5 to 7 minutes.</p><b>Take the check ↗</b></a><a class="hv-check" href="/tests/leadership-visibility"><span>Rung 5 · Influence</span><h3>Leadership Visibility Check</h3><p>Does your impact reach the people who decide? 6 questions, 5 to 7 minutes.</p><b>Take the check ↗</b></a><a class="hv-check" href="/tests/business-leadership"><span>Rung 6 · Leadership</span><h3>Business Leadership Check</h3><p>Do you own the business outcome, or just the work? 6 questions, 5 to 7 minutes.</p><b>Take the check ↗</b></a></div></div></section>

<section class="d-wrap d-section hv-powers"><div class="hv-powers-text">
<article class="hv-panel" data-mode="earn" id="earning-power"><span class="d-kicker">Part one of the Time Equation</span><h2>Earning Power:<br><em>make your time valuable.</em></h2>
<p class="hv-def">What the market will pay you for who you are today.</p>
<p>Time is the one asset you start with. Earning Power decides what each hour of it is worth. Every rung you climb on the ladder raises it.</p>
<ol class="hv-how"><li><b>Move from doing to deciding.</b> Spend less time on how the work gets done, more on which work matters.</li><li><b>Make your thinking visible.</b> Speak in business outcomes, not activity.</li><li><b>Let AI take the execution.</b> It makes routine work cheaper. Judgment, context and trust stay scarce.</li></ol>
<div class="hv-proof"><span class="d-kicker">The market pays for what is scarce</span><div class="hv-stats"><article><strong>8–12% <small>vs</small> 30%</strong><p>A typical yearly raise in India in 2026, against up to 30% for people with leadership skills when they change jobs.</p><a href="https://www.newsdrum.in/business/general-annual-increments-across-industries-likely-at-8-12-pc-michael-page-india-11079279" target="_blank" rel="noopener">Michael Page India Salary Guide 2026 ↗</a></article><article><strong>97× <small>and</small> 330×</strong><p>At TCS in 2024–25, the CFO earned about 97 times the median employee’s pay, and the CEO about 330 times. Each step up the ladder multiplies what the role pays.</p><a href="https://www.outlookbusiness.com/corporate/tcs-pays-ceo-k-krithivasan-rs-265-crore-in-fy25-over-300-times-the-median-employee" target="_blank" rel="noopener">TCS Annual Report FY25, via Outlook Business ↗</a></article></div></div>
<div class="hv-links"><a class="d-btn" href="/step-up/cohort">Learn how to increase your Earning Power ↗</a><a class="d-text-link" href="/step-up">Or learn at your own pace ↗</a></div></article>

<article class="hv-panel" data-mode="exit" id="exit-power"><span class="d-kicker">Part two of the Time Equation</span><h2>Exit Power:<br><em>make your time yours.</em></h2>
<p class="hv-def">How long you could say no to income and still be yourself, and how many acceptable options you would have.</p>
<p>High pay with a big EMI is a quiet trap. You can’t say no to the wrong project, push back in the meeting that matters, or take the better role at lower pay. Low Exit Power holds your Earning Power back. I call this the <b>Trapped Earner</b>.</p>
<div class="hv-room"><article><strong>5 months</strong><p>of runway. You agree too fast and accept the first offer.</p></article><article><strong>5 years</strong><p>of runway. You look at the downside calmly, then decide.</p></article></div>
<ol class="hv-how"><li><b>Count runway in months, not rupees.</b> It is the number that changes how you behave at work.</li><li><b>Don’t tie everything to one employer.</b> Salary, RSUs, network and skills spread wider.</li><li><b>Keep fixed costs below your income, not at it.</b> Every EMI is a vote for staying.</li></ol>
<div class="hv-links"><a class="d-btn" href="/tests/exit-power">Take the Exit Power Check ↗</a><a class="d-text-link" href="/runway">Count your runway in months ↗</a></div></article>
</div><div class="hv-sticky">{circle()}{node_data}</div></section>

<section class="d-section d-navy" id="optionality"><div class="d-wrap"><div class="hv-opt-head"><span class="d-kicker">Put them together</span><h2>Earning Power × Exit Power<br><em>= Optionality.</em></h2><p>It is multiplication, not addition. A high income with no room to move still leaves you few real choices.</p></div>
<div class="hv-lab"><div class="hv-sliders"><label>Earning Power <output id="hv-earn-out">Developing</output><input type="range" id="hv-earn" min="0" max="2" value="1" aria-valuetext="Developing"></label><label>Exit Power <output id="hv-exit-out">Limited room</output><input type="range" id="hv-exit" min="0" max="2" value="0" aria-valuetext="Limited room"></label></div>
<div class="hv-result"><div class="hv-meter" aria-hidden="true"><span id="hv-meter-fill"></span></div><h3 id="hv-result-title"></h3><p id="hv-result-copy"></p></div></div>
<div class="hv-destinations"><article><div class="hv-scene">{climb()}</div><h3>Climb</h3><p>Grow faster at work, because you can say no to the wrong things.</p></article><article><div class="hv-scene">{build()}</div><h3>Build</h3><p>Start something, with room to carry the downside.</p></article><article><div class="hv-scene">{slow_down()}</div><h3>Slow down</h3><p>Take a break, or stop needing the next salary sooner.</p></article></div>
<div class="hv-final-check"><div><h3>Where are you today?</h3><p>The Starting Point Check scores both powers in 12 questions and gives you one thing to work on first.</p></div><a class="d-btn d-btn-white" href="/check">Take the Starting Point Check ↗</a></div></div></section>

<section class="d-wrap d-section hv-next"><div class="hv-next-grid"><a href="/philosophy" class="hv-has-pic"><img class="hv-book" src="/assets/images/book-front-demo.webp" width="700" height="1080" alt="Cover of Earning Power × Exit Power = Optionality" loading="lazy"><div><span class="d-kicker">The book</span><h3>Read the philosophy</h3><p>The full idea behind Earning Power and Exit Power. Download the first chapter and the free worksheets.</p><b>Explore the philosophy ↗</b></div></a><a href="/newsletter" class="hv-has-pic"><img class="hv-letter" src="/assets/images/newsletter-issue-preview.webp" width="900" height="620" alt="A sample issue of The Optional Career in an email inbox" loading="lazy"><div><span class="d-kicker">The Optional Career</span><h3>One real case, every week</h3><p>A real career-and-money decision, worked through with the numbers. Free, weekly, easy to leave.</p><b>Join the newsletter ↗</b></div></a></div></section>'''
