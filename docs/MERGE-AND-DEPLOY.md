# Publish the reviewed website

The changes are on `codex/step-up-funnel-rebuild`, in pull request 2. Main remains unchanged until you merge it.

## Review
1. Open https://github.com/sayantannandi/sayantannandi-website/pull/2.
2. Wait for the GitHub validation check and Netlify preview to succeed for the latest commit.
3. Open https://deploy-preview-2--sayantannandi.netlify.app/. Check /terms, /refunds and /newsletter. Complete both free tests and inspect the two report buttons.
4. The fixed old prices have been removed from the policies. Checkout supplies the current price. Existing refund commitments were retained, including the course-to-cohort credit promise. Confirm that these commercial terms match what you intend to honour before publication.

## Check Netlify before merging
1. Open https://app.netlify.com/projects/sayantannandi.
2. Under Project configuration > Build & deploy > Continuous deployment, confirm that the connected repository is sayantannandi/sayantannandi-website and the production branch is main. Interface labels may vary slightly.
3. The committed netlify.toml specifies publish directory `.` and an empty build command. Generated HTML is committed to Git. Keep those settings; this site does not publish a dist directory.
4. Check that production publishing is enabled and the project is not locked to an older deploy. With automatic publishing enabled, merging into main can publish immediately.

## Merge on GitHub
1. Return to pull request 2. Confirm base: main and compare: codex/step-up-funnel-rebuild.
2. Click Ready for review if the pull request is still a draft.
3. Wait for required checks. Inspect Files changed before proceeding.
4. Choose Merge pull request, or Create a merge commit from the merge dropdown, then Confirm merge. If repository rules require another method, use the permitted method.
5. Keep the branch until you have checked the live website. There is no need to copy individual files into main.

## Publish and verify on Netlify
1. Open the project's Deploys page. The merge should trigger a production deploy when Git integration and automatic publishing are enabled.
2. Open that deployment and verify it belongs to main and includes the merge commit. Wait for Published.
3. If no deploy starts, check the Git connection and build settings, then use Trigger deploy > Deploy project/site for main. Do not promote an older preview by mistake.
4. If it finishes as Ready but remains unpublished, inspect the publish lock or disabled automatic publishing. Publish that verified production deploy if manual publishing is intentional.
5. Open https://sayantannandi.com in a private browser window. Check newsletter submission, both test choices, the legal pages and both checkout links.
6. In Netlify Forms, confirm that the new submissions preserve consent-version and the separate newsletter-consent value. Email delivery is still a later MailerLite setup step, as stated on the site.

## If a production problem appears
Use the previous successful production deploy in Netlify to restore the prior version. Then fix the branch and merge the correction. A Netlify rollback alone does not reverse the Git commit; a future main deploy will include that code until Git is corrected.

References:
- GitHub merge instructions: https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request
- Netlify deployment skill and the repository's netlify.toml supply the deploy workflow and settings.
- DPDP Act section 6 describes clear affirmative consent, without mandating a checkbox control: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf
- MailerLite permission requirements: https://www.mailerlite.com/legal/anti-spam-policy

The UI uses explicit button choices and a nearby privacy notice. This is an implementation choice, not a legal compliance certification. The DPDP framework has phased commencement; this change does not assert that every provision is already in force.
