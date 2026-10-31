// Public MailerLite resource IDs, not credentials. Existing environment mappings take precedence.
export const GROUP_IDS = {
  "cohort": "198739501348030306",
  "course": "198739501335447381",
  "customer": "198739501322864448",
  "judgment": "198739501299795747",
  "kit_bundle": "198739501395216282",
  "kit_eh": "198739501384730502",
  "kit_pcb": "198739501359564653",
  "kit_rrk": "198739501372147577",
  "letter": "198739501235832554",
  "live": "198739501281969937",
  "nurture": "198739501258901242",
  "pitch": "198739501271484168",
  "qa": "198739501406750632",
  "visibility": "198739501311330104",
  "weekly": "198739501247366897",
  "exit": "202806821893703094",
  "leadership": "202806830571718533",
  "starting_point": "202806839291675768",
  "book_interest": "202806848857835334",
  "free_chapter": "202806858662020431",
  "worksheets": "202806867429164787",
  "coaching": "202806876455306844",
  "call": "202806885177361455",
  "cohort_intake": "202806893849085388",
  "next_cohort": "202806902996862787",
  "cohort_jan2027": "202806912527369620",
  "guide_the-update-your-vp-can-act-on": "202806921478014940",
  "guide_be-more-strategic": "202806930505204893",
  "guide_months-of-choice": "202806937455166552",
  "guide_passed-over-what-to-ask": "202806946700461218",
  "guide_say-no-without-losing-trust": "202806956687099623",
  "guide_capture-your-review-evidence": "202806965875770724",
  "qa_delivery_20261031": "202806974751966642"
};
// New copy is staged for the author's review. Existing approved newsletter and report flows stay live.
export const DELIVERY_RELEASED = false;
export const STAGED_SOURCES = new Set(['exit','leadership','starting_point','book_interest','free_chapter','worksheets','coaching','call','cohort_intake','next_cohort','free_guide']);
export const requestGroup = job => job.source === 'free_guide' ? 'guide_'+job.guide : job.source;
