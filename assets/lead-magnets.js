import {tests} from './lead-magnet-data.mjs?v=1';
import {evaluate, reportText} from './lead-magnet-engine.mjs?v=1';
import {downloadText} from './step-up.js?v=2';
const root = document.querySelector('[data-lead-test]');
if (root) {
  const test = tests[root.dataset.leadTest];
  const intro = root.querySelector('[data-test-intro]');
  const panel = root.querySelector('[data-questions]');
  const capture = root.querySelector('[data-result-capture]');
  const report = root.querySelector('[data-report]');
  const leadForm = capture.querySelector('form');
  const status = leadForm.querySelector('.form-status');
  const submit = leadForm.querySelector('[type=submit]');
  const answers = Array(test.questions.length).fill(null);
  let index = 0, sending = false, submitted = false, result;
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function focus(el) { el.focus(); el.scrollIntoView({block:'start',behavior:'auto'}); }
  function renderQuestion() {
    const q = test.questions[index];
    panel.hidden = false; capture.hidden = true; report.hidden = true;
    panel.innerHTML = '<p class="progress-meta">Situation ' + (index+1) + ' of ' + test.questions.length + '</p>' +
      '<progress max="' + test.questions.length + '" value="' + index + '" aria-label="Completed situations"></progress>' +
      '<div class="quiz-card"><h2 tabindex="-1">' + esc(q.title) + '</h2><p>' + esc(q.situation) + '</p>' +
      '<form id="test-question"><fieldset><legend>' + esc(q.question) + '</legend>' +
      q.options.map(o => '<label class="quiz-option"><input type="radio" name="answer" value="' + o.id + '" required' +
        (answers[index] === o.id ? ' checked' : '') + '><span>' + esc(o.text) + '</span></label>').join('') +
      '</fieldset><p id="test-error" class="form-status error" role="alert"></p><div class="actions">' +
      '<button type="button" class="text-link" id="test-back"' + (index===0?' disabled':'') + '>Back</button>' +
      '<button type="submit" class="btn">' + (index===test.questions.length-1?'Continue to my report':'Next situation') +
      '</button></div></form></div>';
    panel.querySelectorAll('[name=answer]').forEach(input => input.addEventListener('change', () => {answers[index] = input.value;}));
    panel.querySelector('#test-back').addEventListener('click', () => { if(index>0){index--;renderQuestion();} });
    panel.querySelector('#test-question').addEventListener('submit', event => {
      event.preventDefault();
      const selected = panel.querySelector('[name=answer]:checked');
      if (!selected) {panel.querySelector('#test-error').textContent='Choose a response to continue.';return;}
      answers[index] = selected.value;
      if(index < test.questions.length-1){index++;renderQuestion();}
      else {
        result = evaluate(test, answers);
        panel.hidden = true; capture.hidden = false;
        focus(capture.querySelector('h2'));
      }
    });
    focus(panel.querySelector('h2'));
  }
  function renderReport() {
    capture.hidden = true; report.hidden = false;
    const heading = result.allStrong ? 'Your choices were well supported.' : 'Your practice focus: ' + result.focus.map(d => d.title.toLowerCase()).join(' / ') + '.';
    report.innerHTML = '<span class="eyebrow">Your practice report</span><h2 tabindex="-1">' + esc(heading) + '</h2>' +
      '<p>' + (result.allStrong ? 'You chose the strongest response for each of these six situations. Applying the same reasoning to your own work is a separate challenge.' :
        'This focus comes from the choices you made in these situations. ' + (result.focus.length>1?'Several areas tied, so each is shown below.':'It gives you a concrete place to practise.')) + '</p>' +
      '<p class="fine">This is a teaching exercise, not a validated assessment or a prediction of promotion. Email delivery is not enabled in this preview; your report is available here.</p>' +
      '<div class="actions"><button type="button" class="btn" id="save-test-report">Download my report</button><button type="button" class="text-link" id="print-test-report">Print report</button></div>' +
      '<p class="fine" id="report-download-status" role="status"></p><div class="grid-2 test-dimensions">' +
      result.dimensions.map(d => '<article class="card"><h3>' + esc(d.title) + '</h3><p>' + esc(d.summary) + '</p><p class="fine">' +
        (d.points===d.maximum?'Both choices used the strongest approach for the stated facts.':d.points===0?'Both choices missed a central requirement in these situations.':'At least one choice left something useful unresolved.') +
        '</p><a href="/step-up#lesson-' + d.lesson + '">Related lesson →</a></article>').join('') +
      '</div><h2>Your working exercise.</h2>' + (result.allStrong?result.dimensions:result.focus).map(d =>
        '<article class="example-block"><h3>' + esc(d.title) + '</h3><ol>' + d.exercise.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol></article>').join('') +
      '<h2>Your choices, explained.</h2>' + result.responses.map((r,i)=>'<article class="result-item"><span class="number">SITUATION ' + (i+1) +
        '</span><h3>' + esc(r.question.title) + '</h3><p>' + esc(r.question.situation) + '</p><p><strong>Your choice:</strong> ' +
        esc(r.selected.text) + '</p><p>' + esc(r.selected.feedback) + '</p>' + (r.selected.points===2?'':'<p><strong>A stronger response for these facts:</strong> ' +
        esc(r.strongest.text) + '</p><p>' + esc(r.strongest.feedback) + '</p>') + '</article>').join('') +
      '<div class="callout"><h3>Build the skills behind your next role.</h3><p>Use this report as a starting point for growing into leadership and strengthening your earning power. The course develops the skills and working habits behind broader responsibility. The six-week live cohort adds discussion and feedback as you apply them.</p><div class="actions"><a class="btn" href="/step-up">Explore the course</a><a class="text-link" href="/step-up/cohort">See the live cohort</a></div></div>' +
      '<p class="fine">Contact: <a href="mailto:hello@sayantannandi.com">hello@sayantannandi.com</a>.</p>';
    report.querySelector('#save-test-report').addEventListener('click', () => {
      downloadText(test.slug + '-report.txt', reportText(test,result));
      report.querySelector('#report-download-status').textContent='Your download has started. You can also print or copy the report from this page.';
    });
    report.querySelector('#print-test-report').addEventListener('click', () => window.print());
    focus(report.querySelector('h2'));
  }
  root.querySelector('[data-test-start]').addEventListener('click', () => {intro.hidden=true;renderQuestion();});
  capture.querySelector('[data-review-answers]').addEventListener('click', () => {if(!sending&&!submitted){index=0;renderQuestion();}});
  leadForm.addEventListener('submit', async event => {
    event.preventDefault();
    if(sending||submitted||!leadForm.reportValidity())return;
    const name = leadForm.querySelector('[name=name]');
    if(!name.value.trim()){name.setCustomValidity('Enter your first name.');name.reportValidity();name.setCustomValidity('');return;}
    result = evaluate(test,answers);
    const fields = {
      'test-id':test.id,'test-version':test.version,'answers':JSON.stringify(answers),
      'dimension-scores':JSON.stringify(Object.fromEntries(result.dimensions.map(d=>[d.id,d.points]))),
      'practice-focus':result.allStrong?'apply-to-your-work':result.focus.map(d=>d.id).join(','),
      'report-text':reportText(test,result)
    };
    for(const [key,value] of Object.entries(fields))leadForm.querySelector('[name="' + key + '"]').value=value;
    sending=true;submit.disabled=true;submit.textContent='Saving…';status.textContent='';
    capture.querySelector('[data-review-answers]').disabled=true;
    try {
      const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams(new FormData(leadForm)).toString(),signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error('Not accepted');
      submitted=true;renderReport();
      leadForm.reset();
    } catch(error) {
      status.textContent='We could not save your request. Your answers and details are still here. Please try again.';
      submit.disabled=false;submit.textContent='Show my report';
      capture.querySelector('[data-review-answers]').disabled=false;
    } finally {sending=false;}
  });
}
