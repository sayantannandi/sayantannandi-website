"""Promote the approved blue experience at build time; keep review pages intact."""
from pathlib import Path
import re
from html import escape
from site_demo import header, footer
ROOT=Path(__file__).resolve().parents[1]
ROUTES={
'/review/start-here-blue':'/', '/review/philosophy-blue':'/philosophy',
'/review/get-coached-blue':'/get-coached','/review/book-a-call-blue':'/conversation',
'/review/newsletter-blue':'/newsletter','/review/course-blue':'/step-up',
'/review/cohort-blue':'/step-up/cohort','/review/received-blue':'/registration-received',
'/review/tests/senior-level-judgment':'/tests/senior-level-judgment',
'/review/tests/leadership-visibility':'/tests/leadership-visibility',
'/review/tests/exit-power':'/tests/exit-power',
'/review/tests/business-leadership':'/tests/business-leadership',
# The new homepage is written last, so it replaces the old start page at /.
'/review/home-v2':'/'}
def routes(text):
    for old,new in sorted(ROUTES.items(),key=lambda x:-len(x[0])):text=text.replace(old,new)
    return text

def publish_approved(write):
    for old,new in ROUTES.items():
        s=(ROOT/(old.lstrip('/')+'.html')).read_text()
        s=routes(s)
        s=re.sub(r'<div class="demo-banner">.*?</div>','',s,flags=re.S)
        s=re.sub(r'<meta name="robots"[^>]*>','',s)
        s=re.sub(r'<link rel="canonical"[^>]*>','',s)
        s=s.replace('</head>',f'<link rel="canonical" href="https://sayantannandi.com{new}"></head>')
        s=s.replace('site-demo.css?v=2','site-demo.css?v=10').replace('site-demo.js?v=2','site-live.js?v=2')
        s=re.sub(r'<dialog id="(?:review|review-notes|course-review)".*?</dialog>','',s,flags=re.S)
        s=re.sub(r'<dialog id="action".*?</dialog>','',s,flags=re.S)
        s=re.sub(r'<title>.*?</title>',f'<title>{escape({"/":"Start Here","/philosophy":"The Book & Philosophy","/step-up":"The Step Up to Senior Leadership","/step-up/cohort":"January Live Classroom","/get-coached":"Personal Leadership Coaching","/conversation":"Book a Free 20-Minute Call","/newsletter":"The Optional Career"}.get(new,"Your next step"))} | Sayantan Nandi</title>',s,count=1)
        s=re.sub(r'<p[^>]*>Preview only\. This demo does not take payments\.</p>', '', s)
        s=s.replace('Review demo: no confirmation email has been sent.','No confirmation email has been sent.')
        s=s.replace('Demo mode: entries and newsletter preferences are saved for review. No automated emails are sent.','Your request and newsletter preference will be saved. No automated email is sent from this form yet.')
        s=s.replace('Your newsletter preference is recorded for review. This demo does not send automated emails.','Your newsletter preference is recorded. Email delivery is awaiting activation.')
        s=s.replace('This is a review demo. No automated email has been sent.','No automated email has been sent.')
        s=s.replace('By invitation · Proposed package','By invitation')
        s=s.replace('₹49,999 <span class="proposed">Proposed</span>','₹49,999')
        s=s.replace('Read the draft refund policy','Read the refund policy')
        s=s.replace('Draft /refunds · January 2027 Live Classroom','January 2027 Live Classroom')
        s=s.replace('Draft for review. This proposed policy applies to new January Live Classroom purchases after adoption. Existing purchases retain their original terms. Other products keep their existing refund policies.','Applies to new purchases from 30 October 2026. Existing purchases retain their original terms.')
        if new=='/step-up/cohort':
            s=s.replace('cohort-blue.js?v=9','cohort-live.js?v=3')
        if new=='/registration-received':s=s.replace('</head>','<meta name="robots" content="noindex,follow"></head>')
        if new=='/newsletter':
            s=s.replace('sn-review-newsletter','sn-letter').replace('<input type="hidden" name="newsletter-consent" value="yes">','<input type="hidden" name="newsletter-consent" value="yes"><input type="hidden" name="consent" value="yes">')
            s=s.replace('Your newsletter preference is recorded. Email delivery is awaiting activation.','Your newsletter signup has been received.')
            s=s.replace('<p class="d-review-note">Your request and newsletter preference will be saved. No automated email is sent from this form yet.</p>','')
        path='index.html' if new=='/' else new.lstrip('/')+'.html'
        write(path,s)
    # Runtime links resolve to public pages, while review interactions stay unchanged.
    js=routes((ROOT/'assets/lib/site-demo.js').read_text())
    write('assets/lib/site-live.js',js)
    cohort=(ROOT/'assets/lib/cohort-blue.js').read_text()
    cohort=re.sub(r"function enroll\(\)\{.*?\}","function enroll(){if(Date.now()<CLOSE)location.href='https://rzp.io/rzp/Jan27TSUTSL'}",cohort)
    write('assets/lib/cohort-live.js',cohort)
    # Carry the approved navigation through the existing supporting pages.
    live_header=routes(re.sub(r'<div class="demo-banner">.*?</div>','',header(),flags=re.S))
    live_footer=routes(footer())
    promoted={'index.html',*[x.lstrip('/')+'.html' for x in ROUTES.values() if x!='/']}
    for p in ROOT.rglob('*.html'):
        rel=str(p.relative_to(ROOT))
        if rel in promoted or rel.startswith(('review/','scripts/','public/','node_modules/','.')):continue
        s=p.read_text()
        if '<header class="site-header">' not in s:continue
        s=re.sub(r'<header class="site-header">.*?</header>',live_header,s,count=1,flags=re.S)
        s=re.sub(r'<footer class="site-footer">.*?</footer>',live_footer,s,count=1,flags=re.S)
        s=s.replace('</head>','<link rel="stylesheet" href="/assets/lib/site-demo.css?v=10"><script type="module" src="/assets/lib/site-live.js?v=2"></script></head>')
        write(rel,s)
    # Keep existing acquisition links pointing to the single approved book gate.
    extra=[]
    for old in ['/book','/book/first-chapter','/book/first-chapter/received']:
        for alias in [old,old+'/',old+'.html']:extra.append(f'{alias} /philosophy#preorder 301!')
    write('_redirects','\n'.join(extra)+'\n'+(ROOT/'_redirects').read_text())
    # Include newly public coaching and quiz routes in search discovery.
    p=ROOT/'sitemap.xml';s=p.read_text()
    for route in ROUTES.values():
        if route=='/registration-received' or f'<loc>https://sayantannandi.com{route}</loc>' in s:continue
        s=s.replace('</urlset>',f'<url><loc>https://sayantannandi.com{route}</loc><lastmod>2026-10-30</lastmod></url>\n</urlset>')
    write('sitemap.xml',s)
