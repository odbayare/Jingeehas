# WP77 Controlled Deploy and Smoke QA Report

Date: 2026-07-07

## 1. Executive summary

WP77 completed a controlled production deploy for the standalone Weight Loss Test project after fixing the public `WP64` internal label leak in runtime copy.

Result: PASS for controlled deploy and smoke QA.

Important launch boundary: `jingeehas.fit` is still not DNS-live. Netlify aliases exist, but Namecheap DNS still points `jingeehas.fit` and `www.jingeehas.fit` to parking records. No DNS, Namecheap, or Netlify domain settings were changed.

## 2. WP64 blocker and fix

The previous deploy preflight found `WP64` visible in public coming-soon copy in `app.js`.

Fix commit:

- `14ca43be531f2335f8ea7716371f6799ec4144c9`
- `14ca43b Remove internal WP64 launch copy`

Runtime copy changed from an internal work-pack label to public-safe wording:

- `Дотоод чанарын шалгалтаар тайлангийн чанар, асуултын ойлгомж, зарим нөхцөлд таарах байдал дээр засах зүйлс илэрсэн тул олон нийтэд төлбөртэй хувилбарыг түр хаалаа.`

Validation:

- `node --check app.js`: PASS
- `node tests/wp71-selected-copy-implementation.test.js`: PASS
- `node tests/wp73-report-voice-copy-cleanup.test.js`: PASS
- `node tests/wp75-safety-copy-polish.test.js`: PASS
- `npm test`: PASS
- `rg -n "WP64" app.js`: no matches

## 3. Git push result

Pushed only the WP64 copy-fix commit before deploy:

- Branch: `main`
- Remote: `git@github.com:odbayare/Jingeehas.git`
- Remote head after push: `14ca43be531f2335f8ea7716371f6799ec4144c9 refs/heads/main`

No force push, merge, rebase, or reset was run.

## 4. Deployed source

Deployed source commit:

- `14ca43be531f2335f8ea7716371f6799ec4144c9`

Deploy was prepared from a detached clean worktree:

- `/private/tmp/jingeehas-final-deploy-20260707-200545`

Clean worktree checks:

- `git status --short`: clean
- `git log -1 --oneline`: `14ca43b Remove internal WP64 launch copy`
- `git rev-parse HEAD`: `14ca43be531f2335f8ea7716371f6799ec4144c9`
- `node --check app.js`: PASS
- `rg -n "WP64" app.js`: no matches

## 5. Sanitized publish package

Publish directory:

- `/private/tmp/jingeehas-final-publish-20260707-200559`

Included files only:

- `_redirects`
- `app.js`
- `index.html`
- `mockBackend.js`
- `styles.css`

Excluded:

- `audits/`
- `tests/`
- `.git/`
- `node_modules/`
- markdown reports
- editor handoff artifacts
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

Package checks:

- `node --check /private/tmp/jingeehas-final-publish-20260707-200559/app.js`: PASS
- `rg -n "WP64|WP67|WP76_DEPLOY_DOMAIN_READINESS_AUDIT|WP70_EDITOR|sprint-36-paid-depth-prototype|node_modules|\\.git|tests/|audits/" /private/tmp/jingeehas-final-publish-20260707-200559`: no matches

## 6. Netlify deploy result

Netlify site:

- Site id: `fb4def02-8e5d-4f00-8996-8cae09ed836f`
- Site name: `weight-loss-deep-pattern-9900`
- Current custom domain: `weight.[CROSS_PROJECT_NAME_REMOVED]`
- Existing domain aliases: `jingeehas.fit`, `www.jingeehas.fit`
- Build settings visible through CLI API: `{}`

Deploy command:

- `netlify deploy --prod --site fb4def02-8e5d-4f00-8996-8cae09ed836f --dir /private/tmp/jingeehas-final-publish-20260707-200559`

Deploy result:

- Deploy id: `6a4cebbd67df666f8ad53cbd`
- Production URL: `https://weight.[CROSS_PROJECT_NAME_REMOVED]`
- Unique deploy URL: `https://6a4cebbd67df666f8ad53cbd--weight-loss-deep-pattern-9900.netlify.app`
- Default Netlify URL checked: `https://weight-loss-deep-pattern-9900.netlify.app`
- Published deploy state: `ready`
- Published at: `2026-07-07T12:06:25.821Z`
- Deploy source metadata: `commit_ref: null`, `commit_url: null`, `build_id: null`

No Netlify site settings, domain settings, link settings, or aliases were changed.

## 7. Smoke QA

HTTP checks:

- `https://weight.[CROSS_PROJECT_NAME_REMOVED]`: `200`
- `https://weight-loss-deep-pattern-9900.netlify.app`: `200`
- `https://6a4cebbd67df666f8ad53cbd--weight-loss-deep-pattern-9900.netlify.app`: `200`
- `https://weight.[CROSS_PROJECT_NAME_REMOVED]/app.js`: `200`
- `https://6a4cebbd67df666f8ad53cbd--weight-loss-deep-pattern-9900.netlify.app/app.js`: `200`

Runtime copy and guard checks on live `app.js`:

- `WEIGHT_TEST_COMING_SOON_MODE = true`: present
- `9,900₮`: present
- `WEIGHT_TEST_ONE_TIME`: present
- QPay create endpoint string: present
- QPay check endpoint string: present
- `WP64`: no matches
- `гүнээ гэмшиж`: no matches
- Public-safe coming-soon copy: present
- WP75 safety helper copy: present
- Broad `амттай зүйл` wording remains present

Initial live HTML check:

- No `WP64`
- No WP67/internal audit labels
- No WP76 audit filename
- No WP70 editor handoff label
- No sprint-36 path
- No raw QPay/auth error strings

## 8. Internal path exposure checks

These public URLs returned `404`:

- `https://weight.[CROSS_PROJECT_NAME_REMOVED]/audits/WP76_DEPLOY_DOMAIN_READINESS_AUDIT.md`
- `https://weight.[CROSS_PROJECT_NAME_REMOVED]/audits/WP70_EDITOR_HANDOFF.zip`
- `https://weight.[CROSS_PROJECT_NAME_REMOVED]/tests/wp75-safety-copy-polish.test.js`

Conclusion: audit reports, handoff zips, and tests were not deployed in the sanitized production package.

## 9. DNS status

Read-only DNS checks:

- `dig jingeehas.fit A +short`: `162.255.119.211`
- `dig www.jingeehas.fit CNAME +short`: `parkingpage.namecheap.com.`
- `dig www.jingeehas.fit A +short`: `parkingpage.namecheap.com.`, `72.251.11.93`, `72.251.11.125`
- `dig weight.[CROSS_PROJECT_NAME_REMOVED] CNAME +short`: `weight-loss-deep-pattern-9900.netlify.app.`
- `dig weight.[CROSS_PROJECT_NAME_REMOVED] A +short`: `weight-loss-deep-pattern-9900.netlify.app.`, `13.215.239.219`, `52.74.6.109`

Conclusion: `jingeehas.fit` and `www.jingeehas.fit` still point to Namecheap parking. `weight.[CROSS_PROJECT_NAME_REMOVED]` still points to Netlify.

No DNS or Namecheap changes were made.

## 10. Remaining DNS action

Before public launch on `jingeehas.fit`, update Namecheap DNS only after owner approval and after confirming the exact expected records in Netlify Domain settings.

Expected action category:

- Replace the apex `jingeehas.fit` parking A record with the Netlify-required apex record shown in Netlify Domain settings.
- Replace the `www.jingeehas.fit` parking CNAME with the Netlify-required `www` record shown in Netlify Domain settings, likely pointing to the Netlify site hostname.
- Do not remove or alter `weight.[CROSS_PROJECT_NAME_REMOVED]` unless separately approved.
- Do not make `jingeehas.fit` primary unless separately approved.

This report does not apply DNS changes.

## 11. Do-not-change guard confirmation

Confirmed unchanged:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `9,900₮`
- `WEIGHT_TEST_ONE_TIME`
- QPay create endpoint string
- QPay check endpoint string

Not changed:

- payment flow
- QPay logic
- scoring
- branching
- report gating
- safety routing
- price/product guards
- Netlify site settings
- Netlify domain settings
- DNS/Namecheap
- `.netlify/state.json`
- TIAS/[CROSS_PROJECT_NAME_REMOVED]-tias
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

## 12. Recommendation

The controlled production deploy is technically healthy on the existing Netlify production URL and unique deploy URL.

Recommendation: keep `jingeehas.fit` DNS parked until the owner approves a final DNS cutover. The next work pack should be a DNS cutover checklist that confirms exact Netlify Domain settings records, applies Namecheap changes, waits for propagation, and then runs HTTPS/domain smoke QA on `jingeehas.fit` and `www.jingeehas.fit`.
