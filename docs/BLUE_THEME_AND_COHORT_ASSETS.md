# Blue theme and cohort asset library

The shared blue theme is loaded last by `scripts/build_site.py` on every generated page. It changes site colors, including the book accents, and keeps the existing layout, forms, prices, purchase links and customer access flows.

## Files

- `assets/lib/blue-theme.css`: site-wide palette and surface overrides. Existing `--green` references are compatibility aliases for cobalt blue. Update this file to adjust the shared palette.
- `assets/lib/cohort-blue.css` and `assets/lib/cohort-blue.js`: the separately scoped cohort redesign assets.
- `assets/lib/asset-manifest.json`: asset paths and sizes.
- `assets/images/cohort/`: compressed workshop, instructor, logos and workbook assets.
- `scripts/content/cohort-blue-preview.html`: review page source, generated to `review/cohort-blue.html`. This page is marked noindex and is not in navigation or the sitemap.
- `assets/lib/course-blue.css`, `assets/lib/course-blue.js` and `scripts/content/course-blue-preview.html`: matching self-paced course demo, generated to `review/course-blue.html`. The existing `/step-up` course sales page is not replaced.

The course demo keeps the ₹8,999 self-paced offer, links to the existing TagMango course and uses the existing seven-day refund policy, conditional on completing no more than the first two lessons. The hero has a four-screen auto slider: an illustrative video lesson, a before-and-after pair, an update formula and a cohort discussion. The fourth screen identifies live discussion as a cohort benefit. The slider supports pause, arrows, dots, keyboard navigation and reduced-motion preferences. Generated scenes are still-image previews, not playable recordings. It does not promise the cohort's personal feedback, private coaching or 90-day guarantee with the self-paced course.

The latest workshop illustration is `assets/images/cohort/live-online-workshop-v7.webp`. It shows the instructor's hands resting on the table and a before-and-after update exercise. Earlier image versions are retained for stable historical references.

## Build

```sh
python3 scripts/build_site.py
python3 scripts/prepare_publish.py
```

Netlify runs these commands automatically on the main branch. Do not upload `node_modules`, scripts or temporary output as public assets.

## Cohort review changes

- Gray-suit instructor illustration with ordinary participant rooms and varied webcam quality. The image is labeled as illustrative, not evidence of an actual cohort.
- Peer wording: “Network with peers across roles and industries.”
- Red wax-seal-style 90-day guarantee badge, rendered in CSS.
- Cobalt, navy and white palette; centered cohort offer gets the dark-blue Best value treatment.
- Responsive 16:9 workbook artwork and aligned pricing-card actions.

## Commercial details to resolve before replacing the live cohort page

The current live checkout still uses the earlier fee. The review page proposes ₹17,499 until 28 November 2026, then ₹19,999, with the same price transition across its hero, comparison and pricing card. Match the payment provider before promoting this offer.

The review page proposes a ratings-based guarantee; the current live cohort refund policy has not been replaced by this theme rollout. The 90-day rating and claim deadline both fall on 14 May 2027. Finalize the claim window, rating evidence, changed reviewer cases and refund processing time before launch.

The ₹49,999 invitation-only coaching package and six private sessions are proposals. The existing production purchase and coaching flows are unchanged. The TagMango preview link uses the existing course URL; free first-module access after login is based on the owner's confirmation.

## Logo sources

- ISB: official website asset at `https://indian-school-of-business.aueast01.umbraco.io/media/sdddpvbt/logo_blue.svg`
- Schneider Electric: `https://commons.wikimedia.org/wiki/File:Schneider_Electric_2007.svg`
- Novartis: `https://commons.wikimedia.org/wiki/File:Novartis-Logo.svg`

The logos identify the instructor's professional experience and education. They are not presented as program sponsors.

## Course review revision 2

The course hero uses the requested senior-leadership headline and a single purchase action with the free-module link underneath. The fact strip is removed. Workplace feedback is the focal copy, the instructor and logos use aligned cards, the course offer is light blue, and the course-use section appears last. The red wax seal reads “100% refund guarantee”; the seven-day period and two-lesson progress limit remain visible. Production course and refund pages are unchanged.

The new speaking illustration is `assets/images/cohort/sayantan-video-lesson-v2.webp`. Built-in image generation used the existing headshot as an identity reference, with the prompt: “Photorealistic 16:9 still of Sayantan teaching to camera in a gray suit, in a natural home office, preserving his identity; no text or player UI.”
