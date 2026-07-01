# Copy Polish Safety Regression Checks

Scope: WP12 validation and regression scan record.

## Required validation commands

Run from repo root:

```bash
node tests/driver-stack/copyDecisionRenderer.test.js
node tests/driver-stack/exportCopyDecisionRenderings.mjs
npm test
git diff --check
```

WP12A result:

- `node tests/driver-stack/copyDecisionRenderer.test.js`: PASS, `copyDecisionRenderer tests passed`
- `node tests/driver-stack/exportCopyDecisionRenderings.mjs`: PASS, emitted two renderings
- `npm test`: PASS, `All tests passed`
- `git diff --check`: PASS, no whitespace errors

## Required artifact generation command

```bash
node tests/driver-stack/exportCopyDecisionRenderings.mjs > audits/mvp-diagnostic-migration/work-pack-12/copy-polish-results.json
```

## Regression phrase scan

The renderer test rejects these WP11 risk phrases from the generated user-facing text:

- `аюулгүй хооллох дохио`
- `Нэг уурагтай`
- `нэг нүүрс устай`
- `оройн дайралт`
- `барих нэг жижиг бариул`
- `даавар, цусан дахь сахар`
- `цусан дахь сахар`
- `гэдэс цадах`
- `төлбөртэй тайлангаар хаахгүй`

Additional WP12A artifact scan:

```bash
node -e 'const fs=require("fs"); const artifact=JSON.parse(fs.readFileSync("audits/mvp-diagnostic-migration/work-pack-12/copy-polish-results.json","utf8")); const bad=["аюулгүй хооллох дохио","Нэг уурагтай","нэг нүүрс устай","оройн дайралт","барих нэг жижиг бариул","даавар, цусан дахь сахар","цусан дахь сахар","гэдэс цадах","төлбөртэй тайлангаар хаахгүй"]; const text=artifact.results.map(r=>r.fullUserFacingText).join("\n"); const hits=bad.filter(s=>text.includes(s)); if (hits.length) { console.error(hits.join("\n")); process.exit(1); } if (artifact.fixtureCount!==2) process.exit(2); if (!artifact.results.every(r=>r.rendererMode==="test_only" && r.decisionStatus==="owner_recommended" && r.runtimeGate.canRenderInRuntime===false && r.pass===true && r.sections.length===5)) process.exit(3); console.log("copy-polish artifact contract and risk-phrase scan passed");'
```

Result: PASS, `copy-polish artifact contract and risk-phrase scan passed`

## Contract checks covered by `copyDecisionRenderer.test.js`

- Rendering object top-level keys unchanged.
- Section shape unchanged: `{ title, body }`.
- `qualityChecks` exact 8-key shape unchanged.
- `rendererMode === "test_only"`.
- `decisionStatus === "owner_recommended"`.
- `runtimeGate.canRenderInRuntime === false`.
- `pass === true`.
- Two fixture renderings only.
- Non-decision fixtures remain omitted/null.
- Professional-first fixture remains omitted/null.
- Internal keys remain absent from user-facing copy.

## Boundary checks

Forbidden runtime/product files were not modified for WP12:

- `app.js`
- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`

WP12A forbidden-file diff check:

```bash
git diff --name-only -- app.js index.html styles.css mockBackend.js package.json _redirects tests/run-all.js
```

Result: PASS, no files returned.

No production report rendering, PDF, backend, payment, QPay, pricing, entitlement, deploy, fixture scoring, WP3 fixture, WP4 report-object, WP9 metadata, or WP10 renderer-object contract changes are part of this pack.
