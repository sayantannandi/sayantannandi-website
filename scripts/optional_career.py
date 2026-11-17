"""The Optional Career site layer, November 2026.

Writes the home page, the check, the course page, the about page and the Learn section.
Runs last in build_site.py, so it replaces earlier versions of those routes.
Forms keep the existing sn-letter contract. Every other page is left as it was.
"""
from pathlib import Path
from html import escape
import re
from optional_career_essays import ESSAYS
import json

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'scripts' / 'content' / 'optional-career'
SITE = 'https://sayantannandi.com'
NAV = [('/course', 'Course'), ('/book', 'Book'), ('/learn', 'Learn'), ('/about', 'About')]
SEBI = 'I am not a SEBI registered investment adviser, and I do not give investment advice on any particular asset. Everything here is education.'
GUIDES = json.loads((ROOT / 'scripts' / 'content' / 'free-guides.json').read_text(encoding='utf-8'))
SHELVES = [('Earn more', 'The skills that take you past the ceiling.'), ('Depend less', 'Turn raises into runway.'), ('Choose', 'What the two numbers are for.')]


def shell(route, title, desc, body, image='/assets/oc/portrait.webp'):
    nav = ''.join(f'<a href="{u}"' + (' aria-current="page"' if route == u or route.startswith(u + '/') else '') + f'>{l}</a>' for u, l in NAV)
    cur = ' aria-current="page"' if route == '/' else ''
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} | Sayantan Nandi</title><meta name="description" content="{escape(desc, quote=True)}"><link rel="canonical" href="{SITE + route}"><meta name="theme-color" content="#102c50"><meta property="og:type" content="website"><meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(desc, quote=True)}"><meta property="og:url" content="{SITE + route}"><meta property="og:image" content="{SITE + image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/oc/site.css?v=3"></head>
<body><a href="#main" class="skip">Skip to content</a>
<div id="site">
  <header class="sitehead"><div class="in"><a class="brand" href="/"{cur}>Sayantan Nandi</a><nav class="nav" aria-label="Main navigation">{nav}<a class="cta" href="/optional-career-check">Take the check</a></nav></div></header>
  <main id="main">{body}</main>
  <footer class="foot"><div class="in">
    <span><b style="color:var(--navy)">The Optional Career</b>: one short letter every Thursday on what the market pays you, and how many months you could last without it. <a href="/newsletter">Subscribe</a></span>
    <span style="flex-basis:100%">{SEBI}</span>
    <span>More: <a href="/earning-power">Earning Power</a> · <a href="/exit-power">Exit Power</a> · <a href="/philosophy">Philosophy</a> · <a href="/tests/senior-level-judgment">Senior-Level Judgment Check</a> · <a href="/worksheets">Free worksheets</a></span>
    <span><a href="/conversation">Talk</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a></span>
  </div></footer>
</div></body></html>'''


def card(e):
    return (f'<a class="ecard" href="/learn/{e["slug"]}"><img src="/assets/oc/essays/{e["id"]}.svg" alt="" width="1200" height="675" loading="lazy">'
            f'<span class="tag">{e["shelf"]}</span><h3>{e["title"]}</h3><p class="muted">{e["dek"]}</p><span class="small muted">2 minute read</span></a>')


def guide_card(g):
    slug = escape(g['slug'], quote=True)
    return (f'<article class="gcard" data-guide="{slug}"><div class="gimg"><img src="/assets/images/guides/{slug}.webp" alt="First page of {escape(g["title"], quote=True)}" width="596" height="842" loading="lazy"></div>'
            f'<div class="gbody"><span class="tag">Free guide &middot; {g.get("minutes") or 20} minutes</span><h3>{escape(g["title"])}</h3><p>{escape(g["promise"])}</p>'
            f'<button type="button" class="gpick">Get this guide</button></div></article>')


def guide_unlock():
    first = escape(GUIDES[0]['slug'], quote=True)
    return f'''<div class="gunlock" id="get-guides" data-gunlock><div class="stack"><div class="eyebrow">One form, all six guides</div><h3>Tell me where to send them</h3><p>Leave your name and email once. Every guide on this page unlocks, and you can download as many as you like.</p><p class="picked-note small"></p></div>
<div><div data-gform><form class="gform" name="sn-guide-{first}" method="POST" action="/registration-received" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="sn-guide-{first}"><input type="hidden" name="sn-form" value="sn-guide-{first}"><input type="hidden" name="guide-id" value="{first}"><input type="hidden" name="consent-version" value="free-guides-2026-10-30"><p hidden><label>Leave empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p><div class="frow"><label>First name<input name="name" autocomplete="given-name" maxlength="100" required placeholder="Your first name"></label><label>Email address<input type="email" name="email" autocomplete="email" maxlength="254" required placeholder="you@example.com"></label></div><label class="d-check"><input type="checkbox" name="newsletter-consent" value="yes"><span>Yes, also send me <b>The Optional Career</b>, the weekly letter. I can unsubscribe anytime.</span></label><button class="btn" type="submit">Unlock all six guides</button><p class="small muted">The letter is optional. <a href="/privacy">Privacy</a></p><p class="status" role="status" aria-live="polite"></p><noscript><p>Please turn on JavaScript to unlock the downloads.</p></noscript></form></div>
<div class="gdone" data-gdone hidden><h3 tabindex="-1">All six guides are unlocked.</h3><p>Use the download button on any guide above. They stay unlocked on this browser.</p><p class="gsub small muted"></p></div></div></div>'''


def learn_hub():
    out = '<div class="page wide"><section class="hero"><div class="eyebrow">Learn</div><h1>Short essays, one path</h1><p class="lead">Everything here is free. Read the essays in order, or start with the half you are thinking about today. The guides are printable worksheets for one real situation at work.</p></section>'
    for name, line in SHELVES:
        cards = ''.join(card(e) for e in ESSAYS if e['shelf'] == name)
        out += f'<section class="stack-lg"><div class="shead"><h2>{name}</h2><p>{line}</p></div><div class="egrid">{cards}</div></section>'
    guides = ''.join(guide_card(g) for g in GUIDES)
    out += f'<section class="stack-lg" id="guides"><div class="shead"><div><div class="eyebrow">Free guides</div><h2>Printable guides for one real situation</h2></div><p>Each one is a short PDF with a worked example and a worksheet. Pick any guide, leave your name and email once, and all six unlock. You choose whether you also want the weekly letter.</p></div><div class="ggrid">{guides}</div>' + guide_unlock() + '</section>'
    return out + '</div><script type="module" src="/assets/oc/guides.js?v=1"></script>'


def essay_page(i, e):
    nxt = ESSAYS[i + 1] if i + 1 < len(ESSAYS) else None
    after = f'<a href="/learn/{nxt["slug"]}">Next: {nxt["title"]}</a>' if nxt else '<a href="/course">See the course</a>'
    body = e['body'].replace('src="assets/', 'src="/assets/oc/')
    return (f'<div class="page"><article class="essay"><a class="small" href="/learn">&larr; All essays</a>'
            f'<span class="tag">{e["shelf"]} &middot; essay {i + 1} of {len(ESSAYS)}</span><h1>{e["title"]}</h1><p class="lead">{e["dek"]}</p>'
            f'<img src="/assets/oc/essays/{e["id"]}.svg" alt="" width="1200" height="675">{body}'
            f'<div class="turn"><b>Your turn</b><p>{e["turn"]}</p></div>'
            f'<div class="row"><a class="btn" href="/optional-career-check">Find your two scores</a>{after}</div></article></div>')


def fix_redirects(write):
    """Let /course and /book open the new pages. Older first-chapter links still go to the live sample form."""
    drop = {'/course', '/course.html', '/book', '/book/', '/book.html'}
    lines = []
    for line in (ROOT / '_redirects').read_text(encoding='utf-8').splitlines():
        parts = line.split()
        if parts and parts[0] in drop:
            continue
        lines.append(line)
    write('_redirects', '\n'.join(lines) + '\n')


def build_optional_career(write):
    read = lambda n: (CONTENT / n).read_text(encoding='utf-8')
    write('index.html', shell('/', 'Earn more. Depend less. Choose what comes next', 'For managers who are good at their job and stuck at one level, with every raise already spent. The skills that take you past the ceiling, and the arithmetic that makes work a choice.', read('home.html')))
    write('course.html', shell('/course', 'The Optional Career: the course', 'One path in eight steps. The first four, on the skills that help you earn more, are open now as The Step Up.', read('course.html')))
    write('about.html', shell('/about', 'About Sayantan Nandi', 'Former IT Director at Schneider Electric. Sat in promotion reviews for more than 100 leaders. Took his own runway from 8 months to more than 250.', read('about.html')))
    write('optional-career-check.html', read('check.html'))
    write('book.html', shell('/book', 'Earning Power × Exit Power = Optionality: the book', 'First make your time valuable, then make it yours. The book on the two numbers that decide how many choices you have at work. Read the prologue and first chapter free.', read('book.html'), image='/assets/oc/book-cover.webp') + '')
    fix_redirects(write)
    write('learn.html', shell('/learn', 'Learn: short essays on earning more and depending less', 'Free essays on getting past the middle-management ceiling, turning raises into runway, and choosing what comes next.', learn_hub()))
    routes = ['/course', '/learn', '/optional-career-check', '/book']
    for i, e in enumerate(ESSAYS):
        write(f'learn/{e["slug"]}.html', shell(f'/learn/{e["slug"]}', e['title'], e['dek'], essay_page(i, e), image=f'/assets/oc/essays/{e["id"]}.svg'))
        routes.append(f'/learn/{e["slug"]}')
    # Add the new routes to the sitemap written earlier in the build.
    sm = ROOT / 'sitemap.xml'
    xml = sm.read_text(encoding='utf-8')
    extra = ''.join(f'  <url><loc>{SITE + r}</loc><lastmod>2026-11-17</lastmod></url>\n' for r in routes if SITE + r + '<' not in xml)
    sm.write_text(xml.replace('</urlset>', extra + '</urlset>'), encoding='utf-8')
    print(f'Optional Career layer: home, check, course, about and {len(ESSAYS)} essays.')
