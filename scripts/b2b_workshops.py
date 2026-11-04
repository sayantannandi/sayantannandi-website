"""Build the approved corporate workshop page with shared production navigation."""
from pathlib import Path
import re
from site_demo import shell
from publish_approved import routes, SITE_CSS, SITE_JS
ROOT=Path(__file__).resolve().parents[1]
def build_b2b_workshops(write):
    body=(ROOT/'scripts/content/b2b-workshops.html').read_text()
    s=routes(shell('B2B Workshops',body,extra='<link rel="stylesheet" href="/assets/lib/b2b-workshops.css?v=1"><script src="/assets/lib/b2b-workshops.js?v=1" defer></script>'))
    s=re.sub(r'<div class="demo-banner">.*?</div>','',s,flags=re.S)
    s=re.sub(r'<meta name="robots"[^>]*>','',s)
    s=s.replace('site-demo.css?v=2',SITE_CSS).replace('site-demo.js?v=2',SITE_JS)
    s=s.replace('Explore leadership, earning power and the freedom to choose with Sayantan Nandi.','In-person leadership workshops for managers and experienced professionals. Build practical skills in speaking, thinking, ownership, managing up and persuasion with Sayantan Nandi.')
    s=s.replace('</head>','<link rel="canonical" href="https://sayantannandi.com/b2b-queries"></head>')
    write('b2b-queries.html',s)
    p=ROOT/'sitemap.xml';s=p.read_text()
    if '<loc>https://sayantannandi.com/b2b-queries</loc>' not in s:
        write('sitemap.xml',s.replace('</urlset>','<url><loc>https://sayantannandi.com/b2b-queries</loc><lastmod>2026-11-04</lastmod></url>\n</urlset>'))
