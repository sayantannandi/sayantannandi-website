import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
const guides=JSON.parse(fs.readFileSync('scripts/content/free-guides.json'));
const {document:hub}=parseHTML(fs.readFileSync('worksheets.html','utf8'));
assert.equal(hub.querySelectorAll('.g-card').length,6);
assert.equal(hub.querySelectorAll('.d-nav a[href^="/free-guides"]').length,0);
for(const g of guides){
 const path='free-guides/'+g.slug+'.html';
 const {document:d}=parseHTML(fs.readFileSync(path,'utf8'));
 const form=d.querySelector('form');
 assert.equal(form.getAttribute('name'),'sn-guide-'+g.slug);
 assert.equal(form.getAttribute('data-netlify'),'true');
 assert(form.querySelector('[name=name][required]'));assert(form.querySelector('[name=email][required]'));
 assert(!form.querySelector('[name=newsletter-consent]').hasAttribute('checked'));
 assert.equal(d.querySelector('a[href$=".pdf"]'),null);
 assert.equal(d.querySelector('[data-guide-download]').hasAttribute('href'),false);
 assert(d.querySelector('[data-guide-success][hidden]'));
 assert.equal(d.querySelector('link[rel=canonical]').getAttribute('href'),'https://sayantannandi.com/free-guides/'+g.slug);
 assert(!d.querySelector('.demo-banner'));assert(!d.querySelector('meta[name=robots]'));
 assert(!d.querySelector('a[href^="/review/"]'));
 for(const el of d.querySelectorAll('[src^="/assets/"]'))assert(fs.existsSync(el.getAttribute('src').split('?')[0].slice(1)));
 assert(fs.readFileSync('assets/downloads/guides/'+g.slug+'.pdf').subarray(0,5).equals(Buffer.from('%PDF-')));
 assert(hub.querySelector(`a[href="/free-guides/${g.slug}"]`));
}
console.log('Six guide pages: required capture, optional consent, hidden downloads, routes and PDFs verified.');
