import {questions,skills,pathBSkill,VERSION} from './starting-point-data.mjs';
export const bands = [
 {id:'under3',label:'Under 3 months',line:'At the stated spending and income, the reserve covers less than three months of shortfall.'},
 {id:'3to6',label:'3 to under 6 months',line:'The reserve covers at least three but less than six months of the stated shortfall.'},
 {id:'6to12',label:'6 to under 12 months',line:'The reserve covers at least six but less than twelve months of the stated shortfall.'},
 {id:'12to50',label:'12 to under 50 months',line:'The reserve covers at least a year but less than fifty months of the stated shortfall. Test how changing costs or income would affect it.'},
 {id:'50to200',label:'50 to 200 months',line:'The reserve covers fifty to two hundred months at these fixed assumptions. Inflation, tax and unexpected costs can materially shorten that period.'},
 {id:'over200',label:'More than 200 months',line:'The reserve covers more than two hundred months at these fixed assumptions. This does not establish that work is optional indefinitely.'},
 {id:'unknown',label:'Not counted yet',line:'You have not estimated your runway yet. The free printable worksheets walk through the calculation.'}
];
export function runwayBand(months) {
 if(!Number.isFinite(months)||months<0) throw new Error('invalid_runway');
 return bands[months<3?0:months<6?1:months<12?2:months<50?3:months<=200?4:5];
}
export function calculateRunway(reserve,costs,income=0) {
 if(![reserve,costs,income].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0)||costs===0) throw new Error('Enter a nonnegative reserve and income, and monthly costs above zero.');
 const shortfall=costs-income;
 if(shortfall<=0)return {covered:true,shortfall,months:null,band:null};
 const months=reserve/shortfall;
 if(!Number.isFinite(months))throw new Error('The inputs are too large to calculate.');
 return {covered:false,shortfall,months,band:runwayBand(months)};
}
const boxes = [
 {label:'Build earning first',line:'Your answers suggest starting with evidence of your leadership contribution, while examining your financial room alongside it.'},
 {label:'Safe, not growing',line:'Your answers suggest more room to move than evidence of next-level work. Explore how to make that contribution visible; this label does not establish financial safety.'},
 {label:'Trapped Earner',line:'Your answers suggest stronger evidence of next-level work than room to change direction. Check your commitments before choosing a move.'},
 {label:'Real options',line:'Your answers suggest both next-level work habits and room to move. Verify those assumptions against real opportunities and household commitments.'}
];
export function evaluateStarting(answers) {
 if(!Array.isArray(answers)||answers.length!==12||!['A','B'].includes(answers[0]))throw new Error('Complete all twelve questions.');
 const qs=questions(answers[0]);
 const selected=qs.map((q,i)=>{const o=q.options.find(o=>o.id===answers[i]);if(!o)throw new Error('Invalid answer.');return o;});
 const earning=selected.slice(1,7).reduce((n,o)=>n+o.score,0),exit=selected.slice(7,11).reduce((n,o)=>n+o.score,0);
 const min=Math.min(...selected.slice(1,7).map(o=>o.score));
 const first=selected.slice(1,7).findIndex(o=>o.score===min);
 const skill=first===0&&answers[0]==='B'?pathBSkill:skills[first];
 const band=bands.find(b=>b.id===answers[7]);
 return {version:VERSION,earning,exit,box:boxes[(earning>=11?2:0)+(exit>=7?1:0)],skill,band,unknown:band.id==='unknown',
   provisional:band.id==='unknown',decision:selected[11].text,
   decisionLine:[ 'Name the scope you want and the evidence it requires.', 'Separate what you want to leave from what you need the next role to offer.', 'Identify what needs to become more stable, and what would tell you it has.', 'Put a cost, time limit and review date around the attempt.', 'Write the decision you are postponing before choosing a solution.' ][Number(answers[11])],
   action:exit<7&&earning>=11||['under3','unknown'].includes(band.id)?{url:'/worksheets',label:'Get the free worksheets'}:{url:'/step-up/cohort',label:'Explore the January cohort'}};
}
export function startingReport(result) {
 return ['STARTING POINT CHECK','Sayantan Nandi','',result.box.label+(result.provisional?' (provisional: runway unknown)':''),result.box.line,
 'Earning Power reflection: '+result.earning+'/18','Exit Power context: '+result.exit+'/12',
 'This is a teaching tool, and it is not validated. It can’t predict a promotion or tell you if you’re financially safe. It only reflects the answers you gave.',
 '', 'Practice first: '+result.skill.title+' (cohort week '+result.skill.week+')',result.skill.line,result.skill.exercise,
 '', 'Reported runway: '+result.band.label,result.band.line,'The range is your estimate, not a calculated or verified balance.',
 '', 'Your current decision: '+result.decision,result.decisionLine,
 '',result.action.label+': https://sayantannandi.com'+result.action.url,
 'Book a free 20-minute call: https://sayantannandi.com/conversation','Not investment advice. For education and discussion only.'].join('\n');
}
