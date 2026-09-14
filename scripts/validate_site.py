"""Validate routes, anchors, local assets, forms and migration without external requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
class Document(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.ids=[];self.h1=0;self.forms=[];self.canon=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag in ['a','link'] and a.get('href'):self.links.append(a['href'])
  if tag in ['script','img','source'] and a.get('src'):self.links.append(a['src'])
  if tag=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
  if tag=='form':self.forms.append(a)
rules={}
for l in (ROOT/'_redirects').read_text().splitlines():
 if not l or l.startswith('#'):continue
 source,dest,status=l.split()[:3]
 assert source not in rules,('Duplicate redirect',source)
 rules[source]=(dest,int(status.rstrip('!')))
def resolve(url):
 path=urlsplit(url).path
 seen=set()
 while path in rules:
  assert path not in seen,('Redirect cycle',url,seen)
  seen.add(path);path,status=rules[path]
  if status==200:return ROOT/path.lstrip('/')
 target=ROOT/('index.html' if path=='/' else path.lstrip('/'))
 if not target.is_file() and target.with_suffix('.html').is_file():target=target.with_suffix('.html')
 return target
files=[p for p in ROOT.rglob('*.html') if 'scripts' not in p.parts]
docs={p:Document(p.read_text()) for p in files}
checked=0
for p,d in docs.items():
 assert d.h1==1,(p,'h1 count',d.h1)
 assert len(d.ids)==len(set(d.ids)),(p,'duplicate IDs')
 assert len(d.canon)==1,(p,'canonical')
 for url in d.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  if not u.path:target=p
  elif u.path.startswith('/'):target=resolve(url)
  else:target=(p.parent/u.path).resolve()
  assert target.exists(),(p.relative_to(ROOT),url,'missing target')
  if u.fragment and target.suffix=='.html':
   assert unquote(u.fragment) in docs[target].ids,(p.name,url,'missing anchor')
  checked+=1
 for f in d.forms:
  if 'data-capture' in f or 'data-lead-capture' in f:
   assert f.get('data-netlify')=='true' and f.get('method')=='POST' and f.get('netlify-honeypot')=='bot-field',f
   text=p.read_text()
   assert f'name="form-name" value="{f["name"]}"' in text
   assert 'type="hidden" name="consent" value="yes"' in text
   assert 'type="checkbox"' not in text
   assert 'name="consent-version"' in text
# All original public acquisition files have a direct migration or remain accessible.
legacy=ROOT/'scripts'/'legacy-content'
assert all(resolve('/'+p.stem).exists() for p in legacy.glob('*.html'))
for source,(dest,status) in rules.items():
 if status==301:
  assert rules.get(dest,('',0))[1]!=301,(source,'redirect chain',dest)
  assert resolve(source).exists(),(source,'bad redirect')
for el in ET.parse(ROOT/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
 url=el.text;target=resolve(url)
 assert target.exists(),url
 assert 'noindex' not in target.read_text(),url
for p in ['index.html','step-up.html','step-up/check.html','step-up/sample.html','step-up/cohort.html','newsletter.html']:
 t=(ROOT/p).read_text()
 assert 'Operating One Level Higher' not in t,p

# Sales pages use the approved checkout for each format, with no interest form.
expected_checkouts={
 'step-up.html':'https://tagmango.app/68942f6867',
 'step-up/cohort.html':'https://rzp.io/rzp/TSUTSLDec2026'}
for filename,url in expected_checkouts.items():
 t=(ROOT/filename).read_text()
 assert f'href="{url}"' in t,(filename,'missing checkout')
 assert '<form ' not in t,filename
 assert not re.search(r'eight[- ](?:module|week|session)|videos are next|register interest',t,re.I),filename
for lesson in range(1,13):
 assert f'id="lesson-{lesson}"' in (ROOT/'step-up.html').read_text(),lesson
for week in range(1,7):
 assert f'id="week-{week}"' in (ROOT/'step-up.html').read_text(),week
for name in ['course-thank-you','cohort-thank-you']:
 t=(ROOT/f'step-up/{name}.html').read_text()
 assert 'noindex, follow' in t,name
 assert f'/step-up/{name}</loc>' not in (ROOT/'sitemap.xml').read_text(),name
 assert 'does not verify payment' in t,name
assert 'six live sessions' in (ROOT/'step-up/cohort.html').read_text()
assert 'localStorage' not in (ROOT/'assets/skills-check.js').read_text()
print(f'PASS: {len(files)} pages, {checked} local links/assets/anchors, {len(rules)} routes, form definitions, sitemap and legacy access.')

# Two end-of-test report forms, separate from optional newsletter consent.
for slug,form in [('senior-level-judgment','step-up-judgment-results'),('leadership-visibility','step-up-visibility-results')]:
 t=(ROOT/f'tests/{slug}.html').read_text()
 assert f'name="{form}"' in t
 assert 'name="name" required' in t and 'name="email" type="email" required' in t
 for field in ['test-id','test-version','answers','dimension-scores','practice-focus','report-text','consent-version']:
  assert f'name="{field}"' in t,(slug,field)
 assert 'name="newsletter-consent" value="no"' in t
 assert 'data-newsletter-choice="yes"' in t and 'data-newsletter-choice="no"' in t
 assert 'name="newsletter-consent" value="yes" required' not in t
 assert 'data-result-capture hidden' in t
for route in ['/promotion-kit','/promotion-case-builder','/review-room-kit','/executive-hour','/philosophy','/exit-power','/start-here']:
 assert route not in rules,('New page must not redirect away',route)
 assert resolve(route).exists(),route
nav=docs[ROOT/'index.html']
assert '/start-here' in nav.links and '/philosophy' in nav.links and '/exit-power' in nav.links
print('PASS: two report forms, optional newsletter consent, restored routes and funnel navigation.')

# Public policies reflect current naming and duration without obsolete price anchors.
for filename in ['terms.html','refunds.html']:
 t=(ROOT/filename).read_text()
 assert 'The Step Up to Senior Leadership' in t
 assert not re.search(r'Operating One Level Higher|8,999|19,999|eight live sessions',t)
 assert 'noindex' not in t
assert 'six live sessions across six weeks' in (ROOT/'terms.html').read_text()
