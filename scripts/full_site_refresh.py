"""Publish the approved November site layouts while preserving live acquisition contracts."""
from pathlib import Path
from html import escape
import re, json
from learner_quotes import learner_quotes, SLOT
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

def _icon(paths):return '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths+'</svg>'
ICONS={'judgment':'<path d="M7 30h12V16h13V5M19 16 8 5M19 16l12 14"/><circle cx="7" cy="30" r="3"/><circle cx="32" cy="5" r="3"/><circle cx="32" cy="31" r="3"/>',
'visibility':'<path d="M4 20s7-11 16-11 16 11 16 11-7 11-16 11S4 20 4 20Z"/><circle cx="20" cy="20" r="5"/>',
'business':'<path d="M5 33h30M8 27V17h7v10m5 0V10h7v17m-20-16 8-6 8 1 9-4"/>',
'exit':'<path d="M8 34V6h20v28M14 34h22M23 20h12m-4-4 4 4-4 4"/><path d="M13 9v25"/>',
'start':'<path d="M20 35V20m0 0L7 7m13 13L33 7M4 15V4h11M25 4h11v11"/>'}
CHECK_ROWS=[('judgment','Earning Power','“I keep getting told to be more strategic.”','Senior-Level Judgment Check','When everyone wants an update, can you bring a decision?','/tests/senior-level-judgment'),
('visibility','Earning Power','“My work is good. It just doesn’t get seen.”','Leadership Visibility Check','Does the impact of your work come through in the room?','/tests/leadership-visibility'),
('business','Earning Power','“I deliver the work. I’m not asked about the business.”','Business Leadership Check','Do you own the outcome, or only the work?','/tests/business-leadership'),
('exit','Exit Power','“I can’t afford to take a risk right now.”','Exit Power Check','If your plans changed, how much room would you have?','/tests/exit-power')]
CHECKS='<div class="section-head"><div><p class="eyebrow">Find your starting point</p><h2>Which one sounds like you?</h2></div><p>Pick the sentence closest to your week. Each check has six questions, takes 5 to 7 minutes and ends with one thing to practise.</p></div><div class="say-grid">'+''.join(f'<a class="say-card" href="{url}"><span class="say-icon">{_icon(ICONS[key])}</span><span class="say-body"><span class="eyebrow">{power}</span><span class="say-quote">{quote}</span><span class="say-name">{name}</span><span class="say-line">{line}</span><span class="say-meta">6 questions · 5 to 7 minutes</span><span class="text-link">Take the check ↗</span></span></a>' for key,power,quote,name,line,url in CHECK_ROWS)+'</div><a class="say-strip" href="/check"><span class="say-icon">'+_icon(ICONS['start'])+'</span><span><strong>Not sure which one?</strong> The Starting Point Check looks at both sides: how your work reads at the next level and how much room you have to move. Twelve questions, about 6 minutes.</span><span class="text-link">Start there ↗</span></a></section>'
WORKBOOK_ROWS=[('The Promotion Case Builder','10-page workbook + 3-sheet Excel','Turn the evidence from your year into a promotion case your manager can explain.','/promotion-case-builder'),
('The Review Room Kit','8-page workbook + one-page Word template','Explain your contribution clearly before your appraisal is summarised by someone else.','/review-room-kit'),
('The Executive Hour','6-page workbook + scripts and templates','Use an executive conversation to demonstrate your judgment.','/executive-hour')]
WORKBOOKS='<section class="section pale" id="workbooks"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Included with the course and the Classroom</p><h2>Three workbooks for the conversations that decide things.</h2></div><p>These come with the self-paced course and the Live Leadership Classroom. Open one to see what is inside.</p></div><div class="kit-grid">'+''.join(f'<a class="kit-card" href="{url}"><span class="eyebrow">{meta}</span><h3>{name}</h3><p>{line}</p><span class="text-link">See what’s inside ↗</span></a>' for name,meta,line,url in WORKBOOK_ROWS)+'</div><p class="meta"><a href="/promotion-kit">Compare all three workbooks ↗</a></p></div></section>'

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
        s=s.replace('</head>','<link rel="stylesheet" href="/assets/lib/flow-fixes.css?v=1"></head>',1)
        s=s.replace(SLOT,learner_quotes(template))
        s=s.replace('<small>THE OPTIONAL CAREER</small>','<small>CAREERS · MONEY · CHOICES</small>')
        s=s.replace('<a href="/philosophy.html">Philosophy</a><a class="button small"','<a href="/philosophy.html">Philosophy</a><a href="/newsletter.html"'+(' class="current" aria-current="page"' if template=='newsletter.html' else '')+'>Newsletter</a><a class="button small"')
        s=s.replace('/app.js','/assets/lib/refresh-home.js?v=1').replace('/pages.js','/assets/lib/refresh-pages.js?v=2')
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
            s=s.replace('</main>','<section class="section wrap" id="ladder"><p class="eyebrow">Find your starting point</p><h2>Start with one free check.</h2><div class="lead-check"><div class="lead-check-card"><p class="eyebrow">Six work situations · 5 to 7 minutes</p><h3>Senior-Level Judgment Check</h3><p>When everyone wants an update, can you bring a decision? Choose your response in six situations and get a short report with one thing to practise.</p><a class="button" href="/tests/senior-level-judgment">Start the free check ↗</a></div><div class="more-checks"><h3>Or pick a narrower one</h3><a href="/tests/leadership-visibility">Leadership Visibility Check ↗</a><a href="/tests/business-leadership">Business Leadership Check ↗</a><a href="/tests/exit-power">Exit Power Check ↗</a><a href="/check">Starting Point Check ↗</a></div></div></section></main>')
            # The newsletter can be joined on the homepage itself.
            s=s.replace('<!--home-newsletter-form-->',forms['newsletter']).replace('</head>','<script type="module" src="/assets/step-up.js?v=5"></script></head>')
        if template in ['coaching.html','workshops.html','newsletter.html']:
            kind={'coaching.html':'coaching','workshops.html':'workshop','newsletter.html':'newsletter'}[template]
            s=re.sub(r'<form class="preview-form".*?</form>',lambda _:forms[kind],s,count=1,flags=re.S)
            if kind=='newsletter':s=s.replace('</head>','<script type="module" src="/assets/step-up.js?v=5"></script></head>')
        if template=='resources.html':
            s=re.sub(r'<div class="section-head"><div><p class="eyebrow">Find your starting point</p>.*?<div class="check-grid">.*?</div></section>',lambda _:CHECKS,s,count=1,flags=re.S)
            s=s.replace('</main>',WORKBOOKS+'</main>')
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
        # Every primary page links to policy and support pages, with the same footer.
        s=s.replace('<a href="/refunds">Refunds</a>','<a href="/refunds">Refunds</a><a href="/help">Help & contact</a><a href="/essays">Essays</a><a href="/earning-power">Earning Power</a><a href="/exit-power">Exit Power</a><a href="/runway">Runway calculator</a><a href="/step-up/sample">Free sample lesson</a><a href="/promotion-kit">Workbooks</a>')
        s=s.replace('<h2>Experience from the other<br>side','<h2>Experience from the other <br>side')
        # Some line breaks are hidden on small screens; keep a space so the words do not run together.
        s=re.sub(r'(?<=[^\s>])<br>',' <br>',s)
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
