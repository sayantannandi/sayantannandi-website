"""Learner quotes. Real words only: an entry needs a permission note or it is not published."""
from pathlib import Path
from html import escape
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/content/learner-quotes.json'
PAGES={'index.html':'home','course.html':'course','classroom.html':'classroom','coaching.html':'coaching','workshops.html':'workshops'}
HEADINGS={'home':'What changed for them.','course':'What changed for them.','classroom':'What changed for them.','coaching':'What changed for them.','workshops':'What changed for their teams.'}
SLOT='<!--learner-quotes-->'
def quotes_for(page):
    data=json.loads(SOURCE.read_text(encoding='utf-8'))
    keep=[]
    for q in data.get('quotes',[]):
        if page not in q.get('show_on',[]):continue
        if not all(str(q.get(k,'')).strip() for k in ['quote','name','role','permission']):continue
        keep.append(q)
    return keep[:3]
def learner_quotes(template):
    page=PAGES.get(template)
    items=quotes_for(page) if page else []
    if not items:return ''
    cards=''.join('<figure class="learner-quote"><blockquote>'+escape(q['quote'].strip())+'</blockquote><figcaption><strong>'+escape(q['name'].strip())+'</strong><span>'+escape(q['role'].strip())+'</span></figcaption></figure>' for q in items)
    return '<section class="section wrap learner-quotes" aria-labelledby="learner-quotes-title"><p class="eyebrow">In their words</p><h2 id="learner-quotes-title">'+HEADINGS[page]+'</h2><div class="learner-quote-grid">'+cards+'</div><p class="meta">Shared with permission. Results depend on your role, your organization and your practice.</p></section>'
