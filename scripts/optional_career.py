"""The Optional Career site layer, November 2026.

Writes the home page, the check, the course page, the about page and the Learn section.
Runs last in build_site.py, so it replaces earlier versions of those routes.
Forms keep the existing sn-letter contract. Every other page is left as it was.
"""
from pathlib import Path
from html import escape
import re
from optional_career_essays import ESSAYS

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'scripts' / 'content' / 'optional-career'
SITE = 'https://sayantannandi.com'
NAV = [('/course', 'Course'), ('/book', 'Book'), ('/learn', 'Learn'), ('/about', 'About')]
SEBI = 'I am not a SEBI registered investment adviser, and I do not give investment advice on any particular asset. Everything here is education.'
SHELVES = [('Earn more', 'The skills that take you past the ceiling.'), ('Depend less', 'Turn raises into runway.'), ('Choose', 'What the two numbers are for.')]


def shell(route, title, desc, body, image='/assets/oc/portrait.webp'):
    nav = ''.join(f'<a href="{u}"' + (' aria-current="page"' if route == u or route.startswith(u + '/') else '') + f'>{l}</a>' for u, l in NAV)
    cur = ' aria-current="page"' if route == '/' else ''
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} | Sayantan Nandi</title><meta name="description" content="{escape(desc, quote=True)}"><link rel="canonical" href="{SITE + route}"><meta name="theme-color" content="#102c50"><meta property="og:type" content="website"><meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(desc, quote=True)}"><meta property="og:url" content="{SITE + route}"><meta property="og:image" content="{SITE + image}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/oc/site.css?v=1"></head>
<body><a href="#main" class="skip">Skip to content</a>
<div id="site">
  <header class="sitehead"><div class="in"><a class="brand" href="/"{cur}>Sayantan Nandi</a><nav class="nav" aria-label="Site">{nav}<a class="cta" href="/check">Take the check</a></nav></div></header>
  <main id="main">{body}</main>
  <footer class="foot"><div class="in">
    <span><b style="color:var(--navy)">The Optional Career</b>, the weekly letter on careers, money and the decisions that create more choices. <a href="/newsletter">Subscribe</a></span>
    <span style="flex-basis:100%">{SEBI}</span>
    <span>More: <a href="/earning-power">Earning Power</a> · <a href="/exit-power">Exit Power</a> · <a href="/philosophy">Philosophy</a> · <a href="/tests/senior-level-judgment">Senior-Level Judgment Check</a> · <a href="/worksheets">Free worksheets</a></span>
    <span><a href="/b2b-queries">For companies</a> · <a href="/conversation">Talk</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/refunds">Refunds</a></span>
  </div></footer>
</div></body></html>'''


def card(e):
    return (f'<a class="ecard" href="/learn/{e["slug"]}"><img src="/assets/oc/essays/{e["id"]}.svg" alt="" width="1200" height="675" loading="lazy">'
            f'<span class="tag">{e["shelf"]}</span><h3>{e["title"]}</h3><p class="muted">{e["dek"]}</p><span class="small muted">2 minute read</span></a>')


def learn_hub():
    out = '<div class="page"><section class="hero"><div class="eyebrow">Learn</div><h1>Short essays, one path</h1><p class="lead">Everything here is free. Read them in order, or start with the half you are thinking about today.</p></section>'
    for name, line in SHELVES:
        cards = ''.join(card(e) for e in ESSAYS if e['shelf'] == name)
        out += f'<section class="stack-lg"><div class="stack"><h2>{name}</h2><p>{line}</p></div><div class="egrid">{cards}</div></section>'
    return out + '</div>'


def essay_page(i, e):
    nxt = ESSAYS[i + 1] if i + 1 < len(ESSAYS) else None
    after = f'<a href="/learn/{nxt["slug"]}">Next: {nxt["title"]}</a>' if nxt else '<a href="/course">See the course</a>'
    body = e['body'].replace('src="assets/', 'src="/assets/oc/')
    return (f'<div class="page"><article class="essay"><a class="small" href="/learn">&larr; All essays</a>'
            f'<span class="tag">{e["shelf"]} &middot; essay {i + 1} of {len(ESSAYS)}</span><h1>{e["title"]}</h1><p class="lead">{e["dek"]}</p>'
            f'<img src="/assets/oc/essays/{e["id"]}.svg" alt="" width="1200" height="675">{body}'
            f'<div class="turn"><b>Your turn</b><p>{e["turn"]}</p></div>'
            f'<div class="row"><a class="btn" href="/check">Find your two scores</a>{after}</div></article></div>')


def build_optional_career(write):
    read = lambda n: (CONTENT / n).read_text(encoding='utf-8')
    write('index.html', shell('/', 'Earn more. Depend less. Choose what comes next', 'For managers who are good at their job and stuck at one level, with every raise already spent. The skills that take you past the ceiling, and the arithmetic that makes work a choice.', read('home.html')))
    write('course.html', shell('/course', 'The Optional Career: the course', 'One path in eight steps. The first four, on the skills that help you earn more, are open now as The Step Up.', read('course.html')))
    write('about.html', shell('/about', 'About Sayantan Nandi', 'Former IT Director at Schneider Electric. Sat in promotion reviews for more than 100 leaders. Took his own runway from 8 months to more than 250.', read('about.html')))
    write('check.html', read('check.html'))
    write('learn.html', shell('/learn', 'Learn: short essays on earning more and depending less', 'Free essays on getting past the middle-management ceiling, turning raises into runway, and choosing what comes next.', learn_hub()))
    routes = ['/course', '/learn']
    for i, e in enumerate(ESSAYS):
        write(f'learn/{e["slug"]}.html', shell(f'/learn/{e["slug"]}', e['title'], e['dek'], essay_page(i, e), image=f'/assets/oc/essays/{e["id"]}.svg'))
        routes.append(f'/learn/{e["slug"]}')
    # Add the new routes to the sitemap written earlier in the build.
    sm = ROOT / 'sitemap.xml'
    xml = sm.read_text(encoding='utf-8')
    extra = ''.join(f'  <url><loc>{SITE + r}</loc><lastmod>2026-11-17</lastmod></url>\n' for r in routes if SITE + r + '<' not in xml)
    sm.write_text(xml.replace('</urlset>', extra + '</urlset>'), encoding='utf-8')
    print(f'Optional Career layer: home, check, course, about and {len(ESSAYS)} essays.')
