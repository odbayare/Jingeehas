# Work Pack 11 Safety and Claims Audit

Scope: docs-only owner QA of the WP10 test-only rendered Mongolian copy snapshots.

This audit checks whether the two sensitive rendered copies preserve the WP6/WP8 safety rules before any future test-only copy refinement. It does not approve runtime integration, production rendering, PDF generation, scoring changes, fixture changes, payment changes, QPay changes, backend changes, or deploy work.

## Overall status

Safety audit status: `WATCH`

No rendered section currently makes a direct diagnosis, treatment claim, medical-cause claim, or explicit blame statement. The main remaining risks are softer copy risks:

- all-or-nothing copy includes one meal-composition line that can feel diet-instructional
- PCOS/body uncertainty copy includes broad medical examples that can feel health-anxiety activating
- both fixture diaries need to stay observation-based rather than becoming compliance tracking
- payment/safety boundary language should be translated into user-facing safety copy before runtime use

Runtime integration remains blocked.

Production rendering remains blocked.

## Safety and claims table

| Fixture | Risk | Status | Evidence | Required guardrail |
| --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | Shame language | PASS | `Энэ нь зангийн алдаа биш` and `өөрийгөө шүүхэд биш` actively reduce shame. | Keep direct shame-interruption language; avoid "weak", "failed", "discipline", or "willpower" framing. |
| `all_or_nothing_restriction_rebound` | Blame language | PASS | Copy frames rebound as body protection and restart pressure, not personal failure. | Keep cause language layered and non-accusatory; never say the user caused the problem by being irresponsible. |
| `all_or_nothing_restriction_rebound` | Diet-command language | WATCH | `Нэг уурагтай, нэг нүүрс устай...` may sound like a meal rule. | Replace macro-like wording with a gentler next-meal reset; avoid meal formulas, strict portions, and nutrition prescriptions. |
| `all_or_nothing_restriction_rebound` | Calorie/prescription feel | WATCH | No calories appear, but the protein/carbohydrate line has prescription feel. | Do not introduce calories, portion targets, macro targets, fasting windows, or strict food categories. |
| `all_or_nothing_restriction_rebound` | Diagnosis claim | PASS | No diagnosis or disease explanation appears. | Keep ordinary behavior language; do not attach medical labels to restriction/rebound. |
| `all_or_nothing_restriction_rebound` | Treatment advice | PASS | The 14-day frame says `Энэ бол тушаал биш` and positions the change as a small experiment. | Keep experiments framed as optional observation, not treatment or therapy. |
| `all_or_nothing_restriction_rebound` | Medical-cause implication | PASS | No hormone, medication, glucose, or medical cause is implied. | Do not add medical explanations for this fixture unless a future safety route requires it. |
| `all_or_nothing_restriction_rebound` | Professional-first boundary | PASS | This fixture is ordinary mode and does not trigger professional-first copy. | Keep professional-first separate; do not overload ordinary rebound copy with medical routing. |
| `all_or_nothing_restriction_rebound` | Payment-blocking safety risk | PASS | No safety warning is hidden or monetized in the rendered copy. | If safety language is ever needed, it must stay unblocked and outside paid-report gating. |
| `all_or_nothing_restriction_rebound` | Diary-as-judgment risk | WATCH | `Тэмдэглэл нь өөрийгөө шүүхэд биш...` is clear, but `тэмдэглэ` is still direct. | Keep diary as pattern observation; avoid scoring, compliance, success/failure, or weight-loss judgment. |
| `all_or_nothing_restriction_rebound` | Experiment-as-command risk | PASS | `Энэ бол тушаал биш... жижиг туршилт` directly prevents command framing. | Preserve test language; avoid "must", "have to", or strict challenge framing. |
| `pcos_body_uncertainty_control` | Shame language | PASS | `биеэ буруутгах шалтгаан биш` and `биеийг шүүхгүйгээр` protect against shame. | Keep body-neutral reassurance; avoid body-blame, control-failure, or moral language. |
| `pcos_body_uncertainty_control` | Blame language | PASS | Copy frames control-seeking as a response to uncertainty, not user failure. | Preserve uncertainty framing; do not imply the user is overreacting or causing the issue. |
| `pcos_body_uncertainty_control` | Diet-command language | WATCH | The copy discourages tightening food rules, but repeated tracking items may feel behaviorally heavy. | Keep food-rule softening; avoid telling the user to restrict, cut, compensate, or prove control through eating. |
| `pcos_body_uncertainty_control` | Calorie/prescription feel | PASS | No calories, macros, portions, or food prescriptions appear. | Maintain non-diet framing; do not add calorie, macro, supplement, or meal-plan instructions. |
| `pcos_body_uncertainty_control` | Diagnosis claim | PASS | `Энэ нь онош биш.` is explicit. | Keep the exact non-diagnostic boundary or an equally clear equivalent in future copy. |
| `pcos_body_uncertainty_control` | Treatment advice | PASS | The copy recommends observation and professional clarification, not treatment. | Do not describe the 14-day experiment as medical treatment, therapy, medication guidance, or disease management. |
| `pcos_body_uncertainty_control` | Medical-cause implication | WATCH | `мөчлөг, эм, даавар, цусан дахь сахар` is not a cause claim, but the list could suggest causes by proximity. | Reframe as "if these are already concerns" and avoid implying PCOS, hormones, medication, or glucose caused weight difficulty. |
| `pcos_body_uncertainty_control` | Professional-first boundary | PASS | `мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй` keeps a calm bridge without forcing mode3. | Keep professional clarification calm, optional, and unblocked; do not make ordinary mode sound like emergency routing. |
| `pcos_body_uncertainty_control` | Payment-blocking safety risk | WATCH | `төлбөртэй тайлангаар хаахгүй` protects safety but exposes product/payment mechanics. | Preserve the principle but rewrite as user-facing safety: professional clarification should be available regardless of report/payment state. |
| `pcos_body_uncertainty_control` | Diary-as-judgment risk | WATCH | `дүгнэлтгүй тэмдэглэ` and `өөрөө оношлохын оронд` are strong, but the tracked list is long. | Reduce tracking burden; keep diary as gentle pattern observation, not self-surveillance or compliance. |
| `pcos_body_uncertainty_control` | Experiment-as-command risk | PASS | `шалгана` and `ажиглалт` frame the experiment as observation rather than a command. | Keep experiment language optional and observational; avoid treatment or medical-correction tone. |

## Claims audit notes

### Diagnosis claims

No WP10 rendered section states or implies a diagnosis as fact. The PCOS/body uncertainty bridge explicitly says `Энэ нь онош биш.`

Future copy must keep this boundary visible and early in the section.

### Treatment advice

No WP10 rendered section tells the user to treat a condition, change medication, manage hormones, manage glucose, or follow a medical protocol.

Future copy must preserve the difference between:

- a gentle observation experiment
- a professional clarification prompt
- actual medical advice, which this product must not provide

### Medical-cause implications

The PCOS/body uncertainty bridge is directionally safe, but the phrase `мөчлөг, эм, даавар, цусан дахь сахар` is close enough to medical-cause territory that it needs polish before runtime planning.

The safest direction is to frame these as concerns the user may already have, not as causes the product detected.

### Diet-command risk

The strongest diet-command risk is in the all-or-nothing first gentle change:

> Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод...

This should not move toward production without rewrite. The future version should focus on a non-punitive next meal, not meal composition.

### Diary and experiment framing

Both fixture copies mostly preserve observation framing. The all-or-nothing fixture explicitly says the experiment is not a command. The PCOS/body uncertainty fixture says the diary should be written without conclusion or self-diagnosis.

Future polish should reduce item density so the diary does not become self-surveillance.

## Guardrails before runtime planning

- Keep runtime integration blocked.
- Keep production rendering blocked.
- Rewrite any macro-like or meal-plan-like language.
- Rewrite payment-boundary language into user-facing safety language.
- Keep `Энэ нь онош биш.` or an equally clear non-diagnostic statement.
- Keep medical examples as user concerns, not product-detected causes.
- Keep all experiments as tests/observations, not commands.
- Keep all diaries as pattern observation, not judgment.
