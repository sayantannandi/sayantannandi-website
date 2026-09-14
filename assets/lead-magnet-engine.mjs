// Teaching feedback only. No percentile, personality label or promotion prediction.
export function evaluate(test, answers) {
  if (!Array.isArray(answers) || answers.length !== test.questions.length) throw new Error('Complete every situation.');
  const responses = test.questions.map((q, i) => {
    const selected = q.options.find(o => o.id === answers[i]);
    if (!selected) throw new Error('Complete every situation.');
    return {question: q, selected, strongest: q.options.find(o => o.points === 2)};
  });
  const dimensions = test.dimensions.map(d => {
    const subset = responses.filter(r => r.question.dimension === d.id);
    return {...d, points: subset.reduce((n,r) => n + r.selected.points, 0), maximum: subset.length * 2};
  });
  const minimum = Math.min(...dimensions.map(d => d.points));
  const focus = dimensions.filter(d => d.points === minimum);
  return {responses, dimensions, focus, allStrong: responses.every(r => r.selected.points === 2),
    strongestCount: responses.filter(r => r.selected.points === 2).length};
}
export function reportText(test, result) {
  const focus = result.allStrong ? 'All six choices used the strongest approach for the stated facts.' :
    'Practice focus: ' + result.focus.map(d => d.title).join(' / ') + '.';
  return [
    test.title, 'The Step Up to Senior Leadership | Sayantan Nandi', '',
    'A practice report based on fictional situations. This is not a validated assessment or a prediction of promotion.',
    focus, '',
    ...result.responses.flatMap((r,i) => [
      (i+1) + '. ' + r.question.title, r.question.situation, r.question.question,
      'Your choice: ' + r.selected.text, 'Feedback: ' + r.selected.feedback,
      'Strongest approach for these facts: ' + r.strongest.text, 'Why: ' + r.strongest.feedback, ''
    ]),
    'Your working exercise', ...(result.allStrong ? result.dimensions : result.focus).flatMap(d => [
      d.title, ...d.exercise.map((s,i) => (i+1) + '. ' + s),
      'Related course lesson: https://sayantannandi.com/step-up#lesson-' + d.lesson, ''
    ]), 'Independent course: https://sayantannandi.com/step-up',
    'Live cohort: https://sayantannandi.com/step-up/cohort',
    'Contact: hello@sayantannandi.com'
  ].join('\n');
}
