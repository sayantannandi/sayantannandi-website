"""Publish the approved November site layouts while preserving live acquisition contracts."""
from pathlib import Path
from html import escape
import re, json
ROOT=Path(__file__).resolve().parents[1]
TEMPLATES=ROOT/'scripts/content/full-site'
# Keep the existing public portrait until the new image is approved for the public repository.
ABOUT_PORTRAIT='/assets/images/cohort/sayantan-portrait.webp'
ROUTES={'index.html':'index.html','course.html':'step-up.html','classroom.html':'step-up/cohort.html','coaching.html':'get-coached.html','workshops.html':'b2b-queries.html','resources.html':'worksheets.html','philosophy.html':'philosophy.html','about.html':'about.html','newsletter.html':'newsletter.html','workshop-overview.html':'workshop-overview.html'}
URLS={'/course.html':'/step-up','/classroom.html':'/step-up/cohort','/coaching.html':'/get-coached','/workshops.html':'/b2b-queries','/resources.html':'/worksheets','/philosophy.html':'/philosophy','/about.html':'/about','/newsletter.html':'/newsletter','/workshop-overview.html':'/workshop-overview'}
ASSETS={'sayantan.webp':'cohort/sayantan-portrait.webp','workshop.webp':'b2b/workshop-hero.webp','schneider.svg':'cohort/schneider-electric.svg','novartis.svg':'cohort/novartis.svg','flipkart.png':'cohort/flipkart.png','isb.svg':'cohort/isb.svg','book-front-demo.webp':'book-front-demo.webp'}
for n in ['sayantan-video-lesson-v2','live-online-workshop-v7','practice-workbook-page-v6','sayantan-coaching-call-v5','promotion-example-page-v6','workshop-qa-gallery-v7']:ASSETS[n+'.webp']='cohort/'+n+'.webp'
DESCRIPTIONS={
'index.html':'Leadership coaching, courses and in-person workshops with Sayantan Nandi. Practical help for experienced managers preparing for wider responsibility.',
'course.html':'Twelve practical leadership lessons, study guides and three workbooks. Learn at your own pace with The Step Up to Senior Leadership.',
'classroom.html':'Six live Saturdays with personal feedback on your work. The Live Leadership Classroom begins January 9, 2027 on Google Meet.',
'coaching.html':'Six private leadership coaching sessions around your specific decisions, conversations and next role. Start with a free fit call.',
'workshops.html':'STAMP leadership workshops for managers and experienced professionals. One-day and two-day in-person formats for organizations.',
'resources.html':'Free leadership checks and six illustrated printable guides for better decisions, clearer updates, career conversations and room to choose.',
'philosophy.html':'Earning Power × Exit Power = Optionality. Explore the philosophy and request the free sample chapter and worksheets.',
'about.html':'Meet Sayantan Nandi, leadership coach, former IT Director and ISB MBA. Fifteen years in technology leadership, including teams of over 200.',
'newsletter.html':'The Optional Career, a weekly letter from Sayantan Nandi on leadership, money and the choices they make possible.',
'workshop-overview.html':'A printable overview of STAMP, an in-person leadership workshop with Sayantan Nandi for managers and experienced professionals.'}

def form_from(path):return re.search(r'<form\b.*?</form>',(ROOT/path).read_text(),re.S).group()
def prepared_form(markup,kind):
    markup=re.sub(r'\sdata-demo-form="[^"]*"','',markup)
    markup=re.sub(r'\sclass="[^"]*"','',markup,count=1) if re.match(r'<form\s+class=',markup) else markup
    markup=markup.replace('<form ','<form class="refresh-form" '+('data-capture data-success="Your newsletter signup has been received." ' if kind=='newsletter' else f'data-refresh-form="{kind}" '),1)
    markup=markup.replace('class="d-form-row"','class="form-row"').replace('class="bw-fields"','class="form-row"')
    markup=markup.replace('class="d-btn d-full"','class="button"').replace('class="bw-action"','class="button"')
    markup=markup.replace('class="d-form-status"','class="form-status"')
    if kind=='newsletter':return markup
    if kind=='book':
        # A resource request unlocks the sample only after accepted capture.
        success='<div class="refresh-success" data-request-success hidden tabindex="-1"><h3>Your request is saved.</h3><div data-book-download><p>Read the Prologue and Chapter One now.</p><a class="button" data-sample-download download>Download the sample ↓</a></div><div data-book-email hidden><p>Your email-copy request is saved. You can also return and choose the immediate download option.</p></div><p class="meta">Your preorder interest is recorded. No payment has been taken.</p></div>'
    else:
        success='<div class="refresh-success" data-request-success hidden tabindex="-1"><h3>Your '+('coaching brief' if kind=='coaching' else 'workshop inquiry')+' is saved.</h3><p>Thank you for sharing the situation. You can book a free 20-minute call to talk it through.</p><a class="button" href="https://calendar.app.google/ugLskU4qWjfCKry19">Choose a time for your free call ↗</a></div>'
    return '<div class="request-card">'+markup+success+'</div>'

def build_full_site_refresh(write):
    forms={k:prepared_form(form_from(p),k) for k,p in [('coaching','get-coached.html'),('workshop','b2b-queries.html'),('newsletter','newsletter.html'),('book','philosophy.html')]}
    guides=json.loads((ROOT/'scripts/content/free-guides.json').read_text())
    mapping={g['title']:g for g in guides}
    original_about=(ROOT/'about.html').read_text()
    for template,path in ROUTES.items():
        s=(TEMPLATES/template).read_text()
        s=re.sub(r'<div class="demo-bar">.*?</div></div>','',s,count=1,flags=re.S)
        s=re.sub(r'<div class="pagebar">.*?</div></div>','',s,count=1,flags=re.S)
        s=re.sub(r'<p class="design-note">.*?</p>','',s,flags=re.S)
        s=re.sub(r'<meta name="robots"[^>]*>','',s)
        s=s.replace(' | Sayantan Nandi Preview',' | Sayantan Nandi').replace('Sayantan Nandi | Website Preview','Sayantan Nandi | Leadership Coaching & Workshops')
        s=s.replace('<link rel="stylesheet" href="/style.css">','<link rel="stylesheet" href="/assets/lib/refresh-base.css?v=1">').replace('<link rel="stylesheet" href="/pages.css">','<link rel="stylesheet" href="/assets/lib/refresh-pages.css?v=1">')
        s=s.replace('/app.js','/assets/lib/refresh-home.js?v=1').replace('/pages.js','/assets/lib/refresh-pages.js?v=1')
        for old,new in URLS.items():s=s.replace(old,new)
        for old,new in ASSETS.items():s=s.replace('/assets/'+old,'/assets/images/'+new)
        s=s.replace('https://sayantannandi.com/','/')
        s=re.sub(r'<span>Preview only · Forms do not send</span>|<span>Website concept · Not the live website</span>','',s)
        s=s.replace('<a class="button small" href="/get-coached#fit">','<a class="button small" href="/conversation">')
        s=s.replace('<a href="/get-coached#fit">Book a call','<a href="/conversation">Book a call')
        s=s.replace('<a class="current" href="#main">Start here</a>','<a class="current" href="/" aria-current="page">Start here</a>')
        s=s.replace('<a href="/">Start here</a>','<a href="/"'+(' aria-current="page"' if path=='index.html' else '')+'>Start here</a>')
        # Keep the old comparison deep link usable after the homepage refresh.
        if template=='index.html':
            s=s.replace('id="your-options" aria-labelledby="options-title">','id="your-options" aria-labelledby="options-title"><span id="how-i-help" aria-hidden="true"></span>',1)
            s=re.sub(r'<button class="route-secondary" data-open-inquiry>.*?</button>','<a class="route-secondary" href="/b2b-queries#brief">Or share a short workshop brief ↗</a>',s,flags=re.S)
            s=re.sub(r'<dialog id="inquiry-dialog".*?</dialog>','',s,flags=re.S)
            # Keep the homepage free check route and all five free tools discoverable.
            s=s.replace('</main>','<section class="section wrap" id="ladder"><p class="eyebrow">Find your starting point</p><h2>Choose a free check.</h2><div class="free-check-links"><a href="/tests/senior-level-judgment">Senior-Level Judgment Check ↗</a><a href="/tests/leadership-visibility">Leadership Visibility Check ↗</a><a href="/tests/business-leadership">Business Leadership Check ↗</a><a href="/tests/exit-power">Exit Power Check ↗</a><a href="/check">Starting Point Check ↗</a></div></section></main>')
        if template in ['coaching.html','workshops.html','newsletter.html']:
            kind={'coaching.html':'coaching','workshops.html':'workshop','newsletter.html':'newsletter'}[template]
            s=re.sub(r'<form class="preview-form".*?</form>',lambda _:forms[kind],s,count=1,flags=re.S)
            if kind=='newsletter':s=s.replace('</head>','<script type="module" src="/assets/step-up.js?v=5"></script></head>')
        if template=='resources.html':
            # A real cover for every guide; the original gated landing pages own capture and delivery.
            cards=re.findall(r'<article data-category="[^"]+">.*?</article>',s,re.S)
            for card,g in zip(cards,guides):
                cover=f'<a class="guide-cover-photo" href="/free-guides/{g["slug"]}" tabindex="-1" aria-hidden="true"><img src="/assets/images/guides/{g["slug"]}.webp" alt="" width="596" height="842" loading="lazy"></a>'
                updated=re.sub(r'<div class="guide-cover">.*?</div>',cover+'<h3><a href="/free-guides/'+g['slug']+'">'+escape(g['title'])+'</a></h3>',card,flags=re.S).replace('<article data-category=','<article class="g-card" data-category=')
                updated=re.sub(r'<button class="text-link" data-resource="[^"]+">.*?</button>',f'<a class="text-link" href="/free-guides/{g["slug"]}">Get the free guide ↗</a>',updated,flags=re.S)
                s=s.replace(card,updated)
            art='<figure class="resources-art"><div class="resources-photo"><img src="/assets/images/stories/day3-v2.webp" alt="Illustrative manager preparing a clear business update" width="1280" height="720" fetchpriority="high"></div><div class="resources-miniatures">'+''.join(f'<a href="/free-guides/{g["slug"]}"><img src="/assets/images/guides/{g["slug"]}.webp" alt="{escape(g["title"],quote=True)} guide cover" width="596" height="842" loading="eager"></a>' for g in [guides[0],guides[1],guides[2]])+'</div><figcaption>Practical tools for the situation in front of you. Illustrative workplace scene.</figcaption></figure>'
            s=re.sub(r'<div class="resource-hero-card">.*?</div>',art,s,count=1,flags=re.S)
            s=s.replace('Guides are free by email','Free guides after email capture').replace('Choose a guide to preview its email delivery flow.','Choose a guide, share your email and unlock the printable PDF.').replace('Guides are free by email','Free printable guides')
            s=s.replace('A short check to understand your starting point. A practical guide to help with the next conversation. Choose what’s useful this week.','A short check to understand your starting point. A practical guide to help with the next conversation. Choose what’s useful this week.')
            s=s.replace('</main>','<section class="section wrap"><div class="close-grid"><div><p class="eyebrow">Working through the book?</p><h2>Your book worksheets<br>are here, too.</h2><p>Request the printable exercises for Earning Power × Exit Power = Optionality.</p></div><a class="button" href="/worksheets/book">Get the book worksheets ↗</a></div></section></main>')
        if template=='philosophy.html':
            s=s.replace('<button class="button white" data-resource="Book sample chapter">Email me the sample chapter ↗</button>','<a class="button white" href="#preorder">Get the sample chapter ↗</a>')
            s=s.replace('<button class="light-link" data-resource="Book worksheets">Get the worksheets ↗</button>','<a class="light-link" href="/worksheets/book">Get the worksheets ↗</a>')
            s=s.replace('<button class="light-link" data-resource="Book preorder updates">Let me know about the book ↗</button>','<a class="light-link" href="#preorder">Let me know about the book ↗</a>')
            s=s.replace('The chapter and worksheets are delivered after email capture. Newsletter subscription is optional.','Email before download. Newsletter subscription is optional.')
            s=s.replace('</main>','<section class="section wrap" id="preorder"><div class="intake-grid"><div><p class="eyebrow">The book · Free sample & preorder updates</p><h2>Read before<br>you decide.</h2><p>Register your interest and get the Prologue and Chapter One. Choose an immediate download or request an email copy. No payment is taken.</p></div>'+forms['book']+'</div></section></main>')
        if template=='about.html':
            s=s.replace('/assets/images/cohort/sayantan-portrait.webp',ABOUT_PORTRAIT)
            s=s.replace('<figure class="feature-image">','<figure class="feature-image about-portrait">',1)
            # Carry the existing genuine public social profiles into the new about page.
            socials=[]
            for url in re.findall(r'href="(https://[^"]+)"',original_about):
                if any(host in url for host in ['linkedin.com','youtube.com','instagram.com']) and url not in socials:socials.append(url)
            if socials:s=s.replace('</main>','<section class="section wrap"><p class="eyebrow">Follow the thinking</p><div class="actions">'+''.join('<a class="button outline" href="'+escape(url,quote=True)+'">'+('LinkedIn' if 'linkedin' in url else 'YouTube' if 'youtube' in url else 'Instagram')+' ↗</a>' for url in socials)+'</div></section></main>')
        if template=='course.html':
            # Preserve the published curriculum anchors used by existing campaigns.
            for i in range(1,7):
                needle='<details open>' if i==1 else '<details>'
                start=s.index('<div class="curriculum">');at=s.find(needle,start)
                # Process the i-th entry based on its visible week number.
                s=re.sub(r'(<details)([^>]*)(><summary><span class="week">0'+str(i)+r'</span>)',r'\1 id="week-'+str(i)+r'"\2\3',s,count=1)
                s=s.replace('<span class="week">0'+str(i)+'</span>',f'<span id="lesson-{2*i-1}" aria-hidden="true"></span><span id="lesson-{2*i}" aria-hidden="true"></span><span class="week">0{i}</span>',1)
            s=s.replace('Try the first module free on TagMango.','Try the first module free on TagMango.')
        if template=='classroom.html':
            s=s.replace('href="/step-up/cohort">Book Your Seat','href="https://rzp.io/rzp/Jan27TSUTSL" data-classroom-checkout>Book Your Seat')
            s=s.replace('Continue to the live enrollment page.','Secure checkout on Razorpay.').replace('Saturday live session','Saturday live session')
        if template=='workshop-overview.html':
            s=re.sub(r'<p class="demo-notice no-print">.*?</p>','',s,flags=re.S)
        s=s.replace('₹17,499<span>','<span data-live-price>₹17,499</span><span data-early-price>')
        s=s.replace('<strong>₹17,499 early-bird</strong>','<strong data-live-price>₹17,499 early-bird</strong>')
        # Every primary page links to policy and support pages, with the same footer.
        s=s.replace('<a href="/refunds">Refunds</a>','<a href="/refunds">Refunds</a><a href="/help">Help & contact</a><a href="/essays">Essays</a><a href="/earning-power">Earning Power</a><a href="/exit-power">Exit Power</a>')
        s=s.replace('<h2>Experience from the other<br>side','<h2>Experience from the other <br>side')
        route='/' if path=='index.html' else '/'+path.removesuffix('.html')
        s=re.sub(r'<meta name="description"[^>]*>','',s)
        meta=f'<meta name="description" content="{escape(DESCRIPTIONS[template],quote=True)}"><link rel="canonical" href="https://sayantannandi.com{route}"><meta property="og:type" content="website"><meta property="og:url" content="https://sayantannandi.com{route}"><meta property="og:image" content="https://sayantannandi.com{ABOUT_PORTRAIT}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico">'
        s=s.replace('</head>',meta+'</head>')
        write(path,s)
    # Compatibility aliases for the accepted preview's clean routes, plus a descriptive resources alias.
    redirects=(ROOT/'_redirects').read_text()
    for source,target in [('/course','/step-up'),('/classroom','/step-up/cohort'),('/coaching','/get-coached'),('/workshops','/b2b-queries'),('/resources','/worksheets')]:
        for alias in [source,source+'.html']:
            redirects+=f'{alias} {target} 301!\n'
    write('_redirects',redirects)
    sitemap=(ROOT/'sitemap.xml').read_text()
    sitemap=re.sub(r'<lastmod>[^<]*</lastmod>','<lastmod>2026-11-08</lastmod>',sitemap)
    if '<loc>https://sayantannandi.com/workshop-overview</loc>' not in sitemap:sitemap=sitemap.replace('</urlset>','<url><loc>https://sayantannandi.com/workshop-overview</loc><lastmod>2026-11-08</lastmod></url></urlset>')
    write('sitemap.xml',sitemap)
