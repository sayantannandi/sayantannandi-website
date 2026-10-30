import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
const pages=['index.html','philosophy.html','get-coached.html','conversation.html','newsletter.html','step-up.html','step-up/cohort.html','tests/senior-level-judgment.html','tests/leadership-visibility.html','tests/exit-power.html','tests/business-leadership.html'];
for(const path of pages){
 const {document:d}=parseHTML(fs.readFileSync(path,'utf8'));
 assert.equal(d.querySelector('.demo-banner'),null,path);
 assert.equal(d.querySelector('a[href^="/review/"]'),null,path);
 assert.equal(d.querySelector('meta[name=robots]'),null,path);
 assert.ok(d.querySelector('link[rel=canonical]'),path);
 assert.equal(d.querySelectorAll('.d-nav').length,1,path);
 for(const el of d.querySelectorAll('[src^="/assets/"]'))assert.ok(fs.existsSync(el.getAttribute('src').split('?')[0].slice(1)),el.getAttribute('src'));
}
const {document:book}=parseHTML(fs.readFileSync('philosophy.html','utf8'));
assert.ok(book.querySelector('[name=name][required]'));assert.ok(book.querySelector('[name=email][required]'));
assert.equal(book.querySelector('a[href*=".pdf"]'),null);
assert.equal(book.querySelector('[name=newsletter-consent]').hasAttribute('checked'),false);
assert.equal(book.querySelectorAll('[name=sample-delivery] option').length,2);
const cohortJs=fs.readFileSync('assets/lib/cohort-live.js','utf8');
assert.ok(cohortJs.includes("if(Date.now()<CLOSE)location.href='https://rzp.io/rzp/Jan27TSUTSL'"));
const {document:letter}=parseHTML(fs.readFileSync('newsletter.html','utf8'));
assert.ok(letter.querySelector('form[name=sn-letter] [name=consent][value=yes]'));
assert.ok(fs.readFileSync('_redirects','utf8').includes('/book/first-chapter /philosophy#preorder 301!'));
console.log('Production routes, assets, book gate, newsletter routing and checkout verified.');
