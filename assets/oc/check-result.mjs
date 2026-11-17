// Scores to result, shared by the email function. Same cut-offs as the check page.
export const LEVEL_CUT = 22, EXIT_CUT = 13, EXIT_CUT_NO_RUNWAY = 10;
export const runwayPoints = m => m < 3 ? 0 : m < 6 ? 1 : m < 12 ? 2 : m < 24 ? 4 : 6;
export const BOXES = {
  te: {name: 'Trapped Earner', note: 'You are good at your job and paid well. But each raise turned into a bigger EMI or a better holiday, so you could last only a few months without the salary. You say yes in meetings because a no feels too costly.', first: 'keep the pay, and move part of every raise out on salary day.'},
  oc: {name: 'Optional Career', note: 'Your work is worth a lot, and you have saved enough months to match. You can push for the bigger role, turn down a bad one, or slow down for a year. Each choice is one you can afford.', first: 'protect it. New commitments quietly eat the months.'},
  ex: {name: 'Exposed on both sides', note: 'Your pay has stopped growing and little is saved. A reorg or a new boss hits hard here, because there is no cushion at home and no clear next step at work.', first: 'start at work. One habit from the level below is usually what holds you back.'},
  sf: {name: 'Safe, and standing still', note: 'You have saved well, but your value at work has stopped rising. You can afford to wait, so it is easy to keep waiting. Money is not the problem here. The next level is.', first: 'use the cushion to take the stretch role you would not have risked before.'}
};
const fmt = m => m > 600 ? '600+' : m >= 12 ? String(Math.floor(m)) : String(Math.floor(m * 10) / 10);
export function ocResult(ep, habits, months) {
  const has = months !== null;
  const exit = habits + (has ? runwayPoints(months) : 0);
  const hi = ep >= LEVEL_CUT, long = exit >= (has ? EXIT_CUT : EXIT_CUT_NO_RUNWAY);
  const key = hi ? (long ? 'oc' : 'te') : (long ? 'sf' : 'ex');
  return {key, box: BOXES[key].name, note: BOXES[key].note, first: BOXES[key].first,
    ep: ep + ' of 36', xp: exit + ' of ' + (has ? 24 : 18),
    runway: has ? 'Runway: about ' + fmt(months) + ' months.' : 'Runway not entered.'};
}
