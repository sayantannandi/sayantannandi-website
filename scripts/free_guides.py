"""Production landing pages for the six printable guides."""
import json,re
from pathlib import Path
from html import escape as e
from site_demo import shell, identity, optin, author
from publish_approved import routes
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'scripts/content/free-guides.json').read_text())
def page(title,description,body,path):
    s=routes(shell(title,body,extra='<link rel="stylesheet" href="/assets/lib/free-guides.css?v=1"><script type="module" src="/assets/lib/free-guides.js?v=2"></script>',cls='guides-page'))
    s=re.sub(r'<div class="demo-banner">.*?</div>','',s,flags=re.S)
    s=re.sub(r'<meta name="robots"[^>]*>','',s)
    s=re.sub(r'<meta name="description"[^>]*>',f'<meta name="description" content="{e(description,quote=True)}">',s)
    s=s.replace('site-demo.css?v=2','site-demo.css?v=3').replace('site-demo.js?v=2','site-live.js?v=3')
    return s.replace('</head>',f'<link rel="canonical" href="https://sayantannandi.com{path}"></head>')
def card(g,i):
    return f'''<article class="g-card g-{g['accent']}" data-guide-category="{'exit' if g['category']=='Exit Power' else 'leadership'}"><a class="g-card-art" href="/free-guides/{g['slug']}" tabindex="-1" aria-hidden="true"><span class="g-card-number">0{i}</span><img src="/assets/images/guides/{g['slug']}.webp" alt="" width="596" height="842" loading="lazy"></a><div class="g-card-copy"><span class="g-category">{e(g['category'])}</span><h2><a href="/free-guides/{g['slug']}">{e(g['title'])}</a></h2><p>{e(g['promise'])}</p><a class="d-text-link" href="/free-guides/{g['slug']}">Get the free guide <span aria-hidden="true">↗</span></a></div></article>'''
def build_free_guides(write):
    intro='''<section class="d-wrap g-index-hero"><span class="d-kicker">Free printables</span><h1>A clearer next move.<br><em>One page of practice at a time.</em></h1><p>For the update, meeting or career conversation in front of you. Pick a guide, share your email and download your printable PDF.</p><div class="g-filters" role="group" aria-label="Filter free guides"><button data-guide-filter="all" aria-pressed="true">All guides</button><button data-guide-filter="leadership" aria-pressed="false">Leadership & career</button><button data-guide-filter="exit" aria-pressed="false">Exit Power</button></div><p class="g-filter-status" role="status" aria-live="polite">6 guides to explore</p></section>'''
    body=intro+'<section class="d-wrap g-grid" aria-label="Free guides">'+''.join(card(g,i) for i,g in enumerate(DATA,1))+'</section>'
    body+='''<section class="d-wrap d-section g-bottom"><h2>Prefer to find your starting point?</h2><p>Try a free check on judgment, visibility or Exit Power.</p><a class="d-btn" href="/">Explore the three checks ↗</a></section>'''
    write('worksheets/book.html',(ROOT/'worksheets.html').read_text().replace('https://sayantannandi.com/worksheets"','https://sayantannandi.com/worksheets/book"'))
    body+='''<section class="d-wrap d-section g-bottom"><h2>Working through the book?</h2><p>The original Earning Power × Exit Power worksheets are here too.</p><a class="d-text-link" href="/worksheets/book">Get the book worksheets ↗</a></section>'''
    write('worksheets.html',page('Free printables: leadership and career guides','Six free printable guides for leadership, career conversations and Exit Power. Share your name and email to download.',body,'/worksheets'))
    for i,g in enumerate(DATA,1):
        slug=g['slug'];formname='sn-guide-'+slug
        form=f'''<form name="{formname}" method="POST" action="/registration-received" data-netlify="true" netlify-honeypot="bot-field" data-guide-form="{slug}"><input type="hidden" name="form-name" value="{formname}"><input type="hidden" name="sn-form" value="{formname}"><input type="hidden" name="guide-id" value="{slug}"><input type="hidden" name="consent-version" value="free-guides-2026-10-30"><p hidden><label>Leave empty<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>{identity()}{optin()}<button class="d-btn d-full" type="submit">Get my free PDF <span aria-hidden="true">↓</span></button><p class="g-privacy">Your download unlocks after you submit. We’ll also email your guide. Newsletter signup is optional. <a href="/privacy">Privacy</a></p><p class="d-form-status" role="status" aria-live="polite"></p><noscript><p>Please enable JavaScript to unlock your download on this page after submitting.</p></noscript></form>'''
        body=f'''<section class="d-wrap g-hero g-{g['accent']}"><div class="g-intro"><a class="d-text-link" href="/worksheets">← All free guides</a><span class="d-kicker">{e(g['category'])} · Free printable guide</span><h1>{e(g['title'])}</h1><p class="d-lede">{e(g['promise'])}</p><div class="g-facts"><span>5 pages</span><span>{g['minutes']} minutes to begin</span><span>Print & use</span></div></div><div class="d-form-card g-capture"><div data-guide-content><span class="d-kicker">Yours, at no charge</span><h2>Make it useful<br>this week.</h2>{form}</div><div class="d-success" data-guide-success hidden tabindex="-1"><span class="d-success-icon">✓</span><h2>Your guide is ready.</h2><p>Download it now. Print the worksheet on page 4 and start with one real situation.</p><a class="d-btn d-full" data-guide-download download>Download my PDF ↓</a><p class="g-subscription-status"></p><a class="d-text-link" href="/worksheets">Explore another guide ↗</a></div></div></section>
<section class="d-section g-inside"><div class="d-wrap g-inside-grid"><figure class="g-sheet-preview"><img src="/assets/images/guides/{slug}.webp" alt="First page of {e(g['title'],quote=True)}" width="596" height="842" loading="lazy"></figure><div><span class="d-kicker">Inside your guide</span><h2>{e(g['short'])}</h2><ul class="g-includes">{''.join('<li>'+e(x)+'</li>' for x in g['inside'])}</ul><p>{e(g['intro'])}</p><a class="d-text-link" href="#guide-form">Get the free PDF ↑</a></div></div></section>
<section class="d-wrap d-section g-taste"><div><span class="d-kicker">Start with this</span><h2>{e(g['hook'])}</h2></div><div><p>{e(g['quick'])}</p><div class="g-step-list">{''.join('<span><b>0'+str(j)+'</b>'+e(s)+'</span>' for j,s in enumerate(g['steps'],1))}</div></div></section>
<section class="d-wrap g-author-section">{author()}<div><p>Practical ideas for doing work people value, building room to choose and making your next move with more clarity.</p><a class="d-text-link" href="/philosophy">Explore the philosophy ↗</a></div></section>'''
        body=body.replace('class="d-form-card g-capture"','class="d-form-card g-capture" id="guide-form"')
        write('free-guides/'+slug+'.html',page(g['title'],g['promise']+' Download the free five-page printable guide.',body,'/free-guides/'+slug))
    p=ROOT/'sitemap.xml';s=p.read_text()
    for path in ['/worksheets','/worksheets/book']+['/free-guides/'+g['slug'] for g in DATA]:
        if f'<loc>https://sayantannandi.com{path}</loc>' not in s:s=s.replace('</urlset>',f'<url><loc>https://sayantannandi.com{path}</loc><lastmod>2026-10-30</lastmod></url>\n</urlset>')
    write('sitemap.xml',s)
    p=ROOT/'_redirects';write('_redirects',p.read_text()+'\n/free-guides /worksheets 301!\n/free-guides/ /worksheets 301!\n/free-guides.html /worksheets 301!\n')
