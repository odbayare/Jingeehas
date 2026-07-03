# WP28 Post-Deploy Smoke Results

## HTTP Checks

| URL | Result |
| --- | --- |
| `https://clever-souffle-1e5f74.netlify.app` | PASS; `HTTP/2 200` |
| `https://6a47773c43a1b7fed95d0b25--clever-souffle-1e5f74.netlify.app` | PASS; `HTTP/2 200` |

## Live Bundle Checks

| Check | Result |
| --- | --- |
| `const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;` | PASS |
| `const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;` | PASS |
| `Эхний товч зураглал` present in live `app.js` | PASS |
| `Аюулгүй байдлын сануулга` present in live `app.js` | PASS |

## Smoke Verdict

PASS - deployed bundle contains the WP28 public visible surface enable change.
