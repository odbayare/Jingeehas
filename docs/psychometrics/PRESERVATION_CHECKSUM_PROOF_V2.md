# Jingeehas V2 preservation checksum proof

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Provenance

The ten authorized source files were copied individually into the isolated worktree. SHA-256 was calculated immediately after copying, before any edits. Every copied hash matched its source hash byte-for-byte.

No absolute local source path is stored in this document. The source and destination are identified by repository role:

- source: stale `main` workspace, uncommitted `docs/psychometrics/`;
- destination base: commit `f6b07c92598c2a6d57e39dcd71d4c3a5a7cbb668`, branch `agent/psychometric-v2-blueprint-20260728`.

## Initial byte-equality proof

| File | Source SHA-256 | Initial copied SHA-256 | Result |
|---|---|---|---|
| CURRENT_INSTRUMENT_FORENSIC_AUDIT.md | `cd45513ce0c291b296607960b2bb13b08204815aa6752b811ba13cb7a92c965f` | `cd45513ce0c291b296607960b2bb13b08204815aa6752b811ba13cb7a92c965f` | MATCH |
| CONSTRUCT_FRAMEWORK_V2.md | `3af008dc246b829f834d9155d014fee82e4b3273fcff934469c41853fbae8d0e` | `3af008dc246b829f834d9155d014fee82e4b3273fcff934469c41853fbae8d0e` | MATCH |
| ITEM_SPECIFICATION_BANK_V2.csv | `2db9f87ef62b8353dc56e0cc56fc3c0fd5ee00814cd9848f4d1067e2a7703bcf` | `2db9f87ef62b8353dc56e0cc56fc3c0fd5ee00814cd9848f4d1067e2a7703bcf` | MATCH |
| SCORING_SPECIFICATION_V2.md | `456835f839afa2ac8cd1c2ff55cce5724b53b9d31a3a4b320167df6cc7f8e9b5` | `456835f839afa2ac8cd1c2ff55cce5724b53b9d31a3a4b320167df6cc7f8e9b5` | MATCH |
| INTERACTION_HYPOTHESES_V2.csv | `035fae691348e539b3276ff947e0065e505c59b62c93302dd1638fba614a4714` | `035fae691348e539b3276ff947e0065e505c59b62c93302dd1638fba614a4714` | MATCH |
| REPORT_SCHEMA_V4.md | `e5a399931ef3f06fe846736c0dd1e62299515a293f8f99796f6701db11cea735` | `e5a399931ef3f06fe846736c0dd1e62299515a293f8f99796f6701db11cea735` | MATCH |
| VALIDATION_PROTOCOL_V2.md | `e19f46da8a0558df490373dd0f1770e8656cc4add4884e9f99089955cdeb8f89` | `e19f46da8a0558df490373dd0f1770e8656cc4add4884e9f99089955cdeb8f89` | MATCH |
| INSTRUMENT_LICENSING_REGISTER.md | `83ec73cbbd88b1e594db5cf7e5cc43bc9adddd534373ed664beb2cca42c6f006` | `83ec73cbbd88b1e594db5cf7e5cc43bc9adddd534373ed664beb2cca42c6f006` | MATCH |
| PSYCHOMETRIC_DATA_MODEL_V2.md | `a7a3151b960f34b620f57578a93fc9983ede5769effd74ab45f3bfcc183621b3` | `a7a3151b960f34b620f57578a93fc9983ede5769effd74ab45f3bfcc183621b3` | MATCH |
| PRODUCT_TRANSITION_PLAN_V2.md | `c9bb89022534d77d1b4481b08e3fcac4d9605902faf607a55a73abf528e1fed1` | `c9bb89022534d77d1b4481b08e3fcac4d9605902faf607a55a73abf528e1fed1` | MATCH |

## Intentional post-preservation changes

After equality was proven, the exact four-line prevalidation status label required by the review brief was added to the eight Markdown source documents and inherited trailing whitespace was normalized so `git diff --check` passes. The two source CSVs were not modified.

| File | Final SHA-256 | Final state relative to preserved source |
|---|---|---|
| CURRENT_INSTRUMENT_FORENSIC_AUDIT.md | `78b6d86600754429a97c5c3ba8a5a3fd970202563841cc69ae1fe37674897f81` | Status label added; trailing whitespace normalized |
| CONSTRUCT_FRAMEWORK_V2.md | `c76407609b7c995eccb777baceab6c81e4e360b986d63c5886f555449b31a8a5` | Status label added; trailing whitespace normalized |
| ITEM_SPECIFICATION_BANK_V2.csv | `2db9f87ef62b8353dc56e0cc56fc3c0fd5ee00814cd9848f4d1067e2a7703bcf` | Unchanged |
| SCORING_SPECIFICATION_V2.md | `0b6b2bd2f43f2c730e1f4c64ae000fb1bb553c74acb8a1e4a3349a6f86871d1d` | Status label added; trailing whitespace normalized |
| INTERACTION_HYPOTHESES_V2.csv | `035fae691348e539b3276ff947e0065e505c59b62c93302dd1638fba614a4714` | Unchanged |
| REPORT_SCHEMA_V4.md | `f467bc4a51c8562f9fd7a9d7a81df358a7e02c5c6e5879e7cf988d4a4825d86a` | Status label added; trailing whitespace normalized |
| VALIDATION_PROTOCOL_V2.md | `0e43a1f124827fc35ae39735dbaeacfd6fb4b42eaa0495fdc2a0be2dd60c8cb5` | Status label added; trailing whitespace normalized |
| INSTRUMENT_LICENSING_REGISTER.md | `98efbba50c60467d2f7d05a6d17f5aefc48844f7f6a1d8d902f8488d1311b0cb` | Status label added; trailing whitespace normalized |
| PSYCHOMETRIC_DATA_MODEL_V2.md | `0d4d5cff881743cef762be505c532793b24484b05a9e6bdfba3bff035b3d1cc3` | Status label added; trailing whitespace normalized |
| PRODUCT_TRANSITION_PLAN_V2.md | `da90d4f24fa1d368747923cce22a59e658abf880d45a804d2ea788b6aeda7b40` | Status label added; trailing whitespace normalized |

No candidate item, interaction row, scoring rule, or production behavior was changed during preservation.
