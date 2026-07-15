# WP76 Deploy and Domain Readiness Audit

## 1. Executive summary

The current GitHub repo state is ready for a controlled staging or manual Netlify deploy later, but it is not ready for public launch yet.

Key findings:

- Local repo is on `main` at `3cfbae443819705e62bd96ff8b2614add8db6da8` (`3cfbae4 Polish safety copy before launch`).
- Local validation passed, including `npm test`.
- Product launch guards are still intentionally active: coming-soon mode is `true`, QPay is blocked publicly by coming-soon mode, and price/product strings remain unchanged.
- Netlify site `weight-loss-deep-pattern-9900` exists at site id `fb4def02-8e5d-4f00-8996-8cae09ed836f`.
- Netlify appears CLI-only, not GitHub-linked: site `build_settings` is `{}`, deploys have `deploy_source: "cli"`, `commit_ref: null`, and `netlify sites:list` shows no repo for this site.
- Current published/latest deploy is `6a4a57aa2421329b1a842072`, published on 2026-07-05, source `cli`.
- `jingeehas.fit` and `www.jingeehas.fit` are already listed as Netlify aliases, but DNS still points to Namecheap parking.
- `weight.[CROSS_PROJECT_NAME_REMOVED]` is still the primary/custom domain and still points to this Netlify site.

Recommendation: do not launch yet. Next safe step is a controlled staging or draft/preview deploy from a clean worktree, followed by smoke QA. DNS should only be changed after owner approval and after the intended production deploy is verified.

## 2. Local repo state

- Working directory: `/Users/odbayare/Documents/Weight Loss Test`
- Branch: `main`
- HEAD: `3cfbae443819705e62bd96ff8b2614add8db6da8`
- Latest commit: `3cfbae4 Polish safety copy before launch`
- Git remote: `git@github.com:odbayare/Jingeehas.git`
- Netlify local state: `.netlify/state.json` points to `fb4def02-8e5d-4f00-8996-8cae09ed836f`
- No `netlify.toml` exists.
- Expected untracked artifacts remain untracked:
  - `audits/WP70_EDITOR_HANDOFF.zip`
  - `audits/WP70_EDITOR_HANDOFF/`
  - `audits/WP70_EDITOR_HANDOFF_V2.zip`
  - `audits/WP70_EDITOR_HANDOFF_V2/`
  - `audits/WP70_EDITOR_STYLE_GUIDE.md`
  - `audits/mvp-diagnostic-migration/work-pack-64/`
  - `audits/mvp-diagnostic-migration/work-pack-67/`
  - `audits/sprint-36-paid-depth-prototype/`

## 3. Validation results

Commands run:

- `node --check app.js`: PASS
- `node tests/wp71-selected-copy-implementation.test.js`: PASS
- `node tests/wp73-report-voice-copy-cleanup.test.js`: PASS
- `node tests/wp75-safety-copy-polish.test.js`: PASS
- `npm test`: PASS
- `git diff --check`: PASS

Note: `npm test` rewrote known generated audit outputs under `audits/virtual-users-10/` and `audits/mvp-diagnostic-migration/work-pack-21/`; those generated tracked files were restored exactly and are not part of WP76.

## 4. Launch guard status

Confirmed in `app.js`:

- `const WEIGHT_TEST_COMING_SOON_MODE = true;`
- `oneTime: "9,900₮"`
- `oneTimeAnchor: "9,900₮"`
- `coachOneTime: "9,900₮"`
- `const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";`
- QPay create endpoint: `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`
- QPay check endpoint: `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`

Coming-soon mode remains active and must remain active until explicit launch approval.

## 5. Netlify site findings

Read-only Netlify commands used:

- `command -v netlify`
- `netlify status`
- `netlify sites:list`
- `netlify api getSite --data '{"site_id":"fb4def02-8e5d-4f00-8996-8cae09ed836f"}'`
- `netlify api listSiteDeploys --data '{"site_id":"fb4def02-8e5d-4f00-8996-8cae09ed836f"}'`

Site:

- Site name: `weight-loss-deep-pattern-9900`
- Site id: `fb4def02-8e5d-4f00-8996-8cae09ed836f`
- Default Netlify URL: `weight-loss-deep-pattern-9900.netlify.app`
- Current project URL: `https://weight.[CROSS_PROJECT_NAME_REMOVED]`
- Admin URL: `https://app.netlify.com/projects/weight-loss-deep-pattern-9900`
- Current custom domain: `weight.[CROSS_PROJECT_NAME_REMOVED]`
- Current aliases:
  - `jingeehas.fit`
  - `www.jingeehas.fit`
- Site state: `current`
- Site SSL: `true`
- Force SSL: `true`
- Site-level `ssl_status`: `null`
- `build_settings`: `{}`
- `deploy_origin`: `{}`
- `quick_setup_in_progress`: `true`

Separation check:

- `netlify sites:list` shows `weight-loss-deep-pattern-9900` without a repo line.
- `tias-beta` separately shows repo `https://github.com/odbayare/[CROSS_PROJECT_NAME_REMOVED]-tias`.
- No evidence found that this Weight Loss Test site is linked to `[CROSS_PROJECT_NAME_REMOVED]-tias`.

## 6. Current deploy model: CLI-only or Git-linked

Current evidence supports CLI-only deploys:

- Current published deploy has `deploy_source: "cli"`.
- Deploys have `commit_ref: null`.
- Deploys have `commit_url: null`.
- Site `build_settings` is empty.
- `netlify sites:list` does not show a GitHub repo for this site.
- Site metadata does not expose a linked Git repository.

Conclusion: Netlify is not currently Git-linked to `odbayare/Jingeehas` in the visible CLI/API metadata. A push to GitHub should not be assumed to deploy this Netlify site.

## 7. Current published deploy status

Current published/latest deploy:

- Deploy id: `6a4a57aa2421329b1a842072`
- State: `ready`
- Context: `production`
- Deploy source: `cli`
- Branch: `main`
- Commit ref: `null`
- Commit URL: `null`
- Deploy URL: `http://6a4a57aa2421329b1a842072--weight-loss-deep-pattern-9900.netlify.app`
- Deploy SSL URL: `https://6a4a57aa2421329b1a842072--weight-loss-deep-pattern-9900.netlify.app`
- Alias URL: `https://weight.[CROSS_PROJECT_NAME_REMOVED]`
- Published at: `2026-07-05T13:10:10.440Z`

The latest deploy listed by `listSiteDeploys` is the same deploy id.

## 8. Current domains and SSL status

Netlify metadata:

- Primary/custom domain: `weight.[CROSS_PROJECT_NAME_REMOVED]`
- Aliases:
  - `jingeehas.fit`
  - `www.jingeehas.fit`
- Site SSL: enabled
- Force SSL: enabled

Interpretation:

- Netlify knows about `jingeehas.fit` and `www.jingeehas.fit`.
- DNS is not pointed yet, so public traffic to `jingeehas.fit` is not reaching Netlify.
- Domain-specific certificate validation for the new aliases should be verified in Netlify after DNS is changed.

## 9. DNS read-only findings

Commands run:

- `dig jingeehas.fit A +short`
- `dig www.jingeehas.fit CNAME +short`
- `dig www.jingeehas.fit A +short`
- `dig weight.[CROSS_PROJECT_NAME_REMOVED] CNAME +short`
- `dig weight.[CROSS_PROJECT_NAME_REMOVED] A +short`

Results:

- `jingeehas.fit A`: `162.255.119.211`
- `www.jingeehas.fit CNAME`: `parkingpage.namecheap.com.`
- `www.jingeehas.fit A`: `parkingpage.namecheap.com.`, `72.251.11.125`, `72.251.11.93`
- `weight.[CROSS_PROJECT_NAME_REMOVED] CNAME`: `weight-loss-deep-pattern-9900.netlify.app.`
- `weight.[CROSS_PROJECT_NAME_REMOVED] A`: resolves through Netlify to `13.215.239.219`, `52.74.6.109`

Conclusion:

- `jingeehas.fit` still points to Namecheap parking.
- `www.jingeehas.fit` still points to Namecheap parking.
- `weight.[CROSS_PROJECT_NAME_REMOVED]` still points to the existing Netlify site.

## 10. Required DNS records later

Likely DNS records for external DNS at Namecheap, to be confirmed in Netlify Domain settings before changing DNS:

- Apex/root `jingeehas.fit`: point to Netlify load balancer using Netlify's current recommended apex record.
- `www.jingeehas.fit`: create a CNAME to `weight-loss-deep-pattern-9900.netlify.app`.

Important caution:

- Do not change DNS until the intended production deploy is live and smoke-tested.
- Before editing Namecheap, confirm the exact apex target in Netlify Domain settings because provider recommendations can change.
- After DNS change, verify both HTTP and HTTPS for `jingeehas.fit` and `www.jingeehas.fit`, then confirm SSL certificate coverage in Netlify.

## 11. Build/publish settings recommendation

Repo files:

- `index.html`
- `app.js`
- `styles.css`
- `mockBackend.js`
- `_redirects`

Package scripts:

- `test`: `node tests/run-all.js`
- No `build` script exists.

App model:

- Static browser app.
- No Node server required for the frontend bundle.
- No generated build directory required.

Recommended Netlify settings for a Git-linked setup later:

- Build command: blank / none
- Publish directory: repo root (`.`)
- Production branch: `main`

Manual deploy model:

- Deploy from a clean worktree containing the root static files.
- Include `index.html`, `app.js`, `styles.css`, `mockBackend.js`, and `_redirects`.
- Do not deploy until owner explicitly approves launch/staging action.

## 12. Recommended launch sequence

1. Keep coming-soon mode enabled.
2. Prepare a clean staging/preview deploy from the current repo state, ideally using a draft/preview deploy first.
3. Smoke QA staging/preview:
   - coming-soon page visible publicly
   - no public QPay QR creation
   - no public assessment start while coming-soon mode is active
   - mobile 375/390/430 layout
   - `jingeehas.fit` branding/domain references if applicable
   - report rendering in internal/test mode only
4. Production deploy only after owner approval.
5. Verify production deploy by deploy id and URL before DNS changes.
6. Change DNS at Namecheap:
   - apex/root `jingeehas.fit`
   - `www.jingeehas.fit`
7. Wait for propagation and verify:
   - `dig jingeehas.fit A`
   - `dig www.jingeehas.fit CNAME`
   - HTTPS loads for both domains
   - Netlify certificate covers both names
8. Only after the new domain is stable, plan a separate cleanup for `weight.[CROSS_PROJECT_NAME_REMOVED]`:
   - either keep temporarily as a fallback
   - or redirect/remove later in a separate approved WP

## 13. Blockers before public launch

Launch blockers:

- Coming-soon mode is still enabled by design.
- Public payment/QPay flow is intentionally blocked while coming-soon mode is enabled.
- `jingeehas.fit` and `www.jingeehas.fit` still resolve to Namecheap parking.
- Netlify aliases exist, but DNS and certificate coverage for the new public domain still need post-DNS verification.
- Current Netlify deployment model appears CLI-only; decide whether to keep manual deploys or configure GitHub-linked deploys later.
- `weight.[CROSS_PROJECT_NAME_REMOVED]` remains the primary/custom domain and should not be repointed/removed without a separate approved migration plan.

## 14. Non-blocking cleanup

- Consider adding `netlify.toml` later to document publish settings, but only in a separate approved change.
- Consider choosing a final deployment model:
  - manual CLI deploy from clean worktree, or
  - GitHub-linked Netlify deploy from `odbayare/Jingeehas`.
- Consider moving primary domain from `weight.[CROSS_PROJECT_NAME_REMOVED]` to `jingeehas.fit` only after DNS/SSL validation and owner approval.
- Consider a post-launch redirect strategy for `weight.[CROSS_PROJECT_NAME_REMOVED]`.

## 15. Recommendation

Do not launch yet.

Ready for next staging step:

- The repo and tests are ready for a controlled staging or preview deploy later.
- DNS should remain unchanged until the staged/production deploy is verified.
- Coming-soon/payment guards should remain unchanged until the owner explicitly approves public launch.

Recommended next WP: create a controlled staging/preview deploy plan and smoke checklist, or run an owner-approved Netlify draft deploy without DNS changes.

## 16. Guard confirmations

Confirmed:

- No deploy command was run.
- No `netlify deploy` command was run.
- No DNS was changed.
- No Namecheap settings were changed.
- No Netlify settings were changed.
- Netlify was inspected read-only.
- DNS was inspected read-only.
- No source files were changed.
- No tests were changed.
- No files were staged.
- No commit was created.
- No push was run.
- Payment flow was not touched.
- QPay was not touched.
- Coming-soon mode was not changed.
- Price/product guards were not changed.
- TIAS/[CROSS_PROJECT_NAME_REMOVED]-tias was not touched.
- WP64/WP67 PDF packs were not touched.
- `audits/sprint-36-paid-depth-prototype/` was not touched.
- Editor handoff artifacts were not touched.
