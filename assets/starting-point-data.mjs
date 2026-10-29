// Owner-supplied reflection questions, with contextual wording clarified for the website.
export const VERSION = '2026-10-29-v1';
const q = (title, options) => ({title, options:options.map((text,score)=>({id:String(score),text,score}))});
export const paths = {
 A:[q('Does your manager know which role you want next?', ['No', "I’ve hinted at it", "I’ve said it once", "We’ve talked about what evidence it needs"]),q('If your name came up in a review tomorrow, could your manager say in one sentence what changed because of you?', ["I’m not sure", "They’d list my tasks", 'Mostly', "Yes, I’ve heard them say it"])],
 B:[q('When you heard “not yet,” what were you told?', ['No reason', 'Something vague, like “be more strategic”', 'A general area to work on', 'A specific gap, with examples']),q('Since then, what has changed in how you work?', ['Nothing yet', "I’m working harder", "I’ve taken on more scope", "I’ve changed the specific things the gap pointed to"])]
};
export const common = [
 q('Your last update to a senior leader mostly…', ['listed what the team did', 'reported status against the plan', 'explained what changed for the business', 'explained the business outcome and evidence, with a clear decision or next step where needed']),
 q('A new priority lands mid-quarter. You usually…', ['take it on and work longer', 'take it on and let something slip quietly', 'ask your boss what to drop', 'propose what moves out, and what that costs']),
 q('You disagree with a peer’s plan. You usually…', ['stay quiet', 'raise it with your boss', 'say it in the meeting', 'talk to the peer first, with an alternative']),
 q('If you took two weeks off, decisions in your area would…', ['wait for you', 'reach you on your phone', 'get made, but you’d redo some', 'get made well without you']),
 {title:'If your salary stopped tomorrow, how many months could your household cover its costs from money you could actually use?', note:'Exclude your home, locked retirement funds, unvested shares, likely tax and selling costs, and money already committed to other goals. Rough answers are fine.',options:[
  {id:'under3',text:'Under 3 months',score:0},{id:'3to6',text:'3 to under 6 months',score:1},{id:'6to12',text:'6 to under 12 months',score:2},{id:'12to50',text:'12 to under 50 months',score:3},{id:'50to200',text:'50 to 200 months',score:3},{id:'over200',text:'More than 200 months',score:3},{id:'unknown',text:'Not sure',score:0}]},
 q('How much of your monthly spending could you cut within 90 days without breaking anything?', ['Almost none', 'About a tenth', 'About a quarter', 'A third or more']),
 q('How many of these depend on your current employer: your salary, most of your savings including company shares, most of your network, and skills only your company pays well for?', ['All four', 'Three', 'Two', 'One or none']),
 q('If your job ended, how many acceptable options could you realistically have within six months?', ['None I can name', 'One', 'Two or three', 'More than three'])
];
export const decisionOptions = ['Push for the next role','Move to another company','Stay and steady things','Take a break, or build something','Not sure yet'];
export function questions(path='A') {
 return [{title:'Which sounds more like you right now?',note:'Both may apply. Choose the situation you want to explore today.',options:[{id:'A',text:'I’m reaching for the next role'},{id:'B',text:'I feel stuck, or I’ve been passed over'}]},...paths[path],...common,{title:'Which decision is closest to you right now?',options:decisionOptions.map((text,i)=>({id:String(i),text}))}];
}
export const skills = [
 {title:'The Readiness Conversation',week:6,line:'Ask for the next role with a specific scope and evidence.',exercise:'Write the role and scope you want, then ask your manager which two examples would demonstrate readiness.'},
 {title:'Legibility',week:3,line:'Make what changed because of you easy to see and repeat.',exercise:'Rewrite one recent update as three lines: what changed, who benefited, and the evidence behind it.'},
 {title:'Outcome Translation and Speak Business',week:1,line:'Turn an update into what changed for the business.',exercise:'Take one completed task. Explain its effect on a customer, cost, risk or capacity, using only evidence you have.'},
 {title:'Deliberate Elimination',week:2,line:'Say what moves out when something new comes in.',exercise:'For one new request, propose what to defer, the consequence, and why that trade-off is preferable.'},
 {title:'Disagree Without Damage',week:4,line:'Discuss the disagreement directly, with an alternative.',exercise:'Prepare a conversation with a peer: their constraint, your concern, and one workable alternative. Urgent safety or misconduct concerns may need formal escalation.'},
 {title:'Delegate to People',week:5,line:'Hand over real decisions, with boundaries and checks.',exercise:'Choose one recurring decision. Name its owner, decision boundaries, and the point at which to involve you.'}
];
export const pathBSkill = {title:'Clarify the gap and reduce uncertainty',week:3,line:'Ask for a concrete gap before deciding what to change.',exercise:'Ask your manager for one example of the missing evidence, what a stronger attempt would look like, and when you can review it together. An unavailable role or missing sponsorship needs a separate conversation.'};
