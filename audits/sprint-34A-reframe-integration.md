# Sprint 34A — Surface-vs-Hidden Reframe Integration

Date: 2026-06-30

## Owner review finding

Sprint 34-ийн `Ил харагдаж байгаа зүйл` / `Цаана нь ажиллаж байгаа зүйл` санаа зөв байсан ч тусдаа блок хэлбэрээр нэмэгдсэнээс зарим тайлангийн үлдсэн хэсэг хуучин primary mechanism voice дээрээ үлдэж, report дотор contradiction үүсэж байсан.

## Product decision

Surface factor нь зөвхөн context. Хэрвээ surface-hidden reframe харагдаж байвал hidden function нь дараах бүх report voice-ийг удирдана:

- `Товч хариу`
- `Гол зураг`
- `Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?`
- `Давтагддаг тойрог`
- `Гол буруу ойлголт`
- `Одоохондоо хэт яарахгүй зүйлс`
- `Эхний жижиг өөрчлөлт`
- `14 хоногийн туршилт`
- `7 хоногийн тэмдэглэл юуг тодруулах вэ?`

## Contradictions fixed

| Case | Before | After |
| --- | --- | --- |
| User 01 — night-shift nurse | Surface block mentioned night shift, but detailed report stayed generic sleep/energy. | Full report is now `shiftWork`: шөнийн ээлж, ээлжийн дараах ядаргаа, цайны газар/ойр дэлгүүр/бэлэн хоол, нөөц сонголт. |
| User 02 — remote-worker cue | Cue case could be mislabeled as `толь, зураг, бусдад харагдах орчин`. | Cue report keeps cue/environment voice and, when surface block appears, uses `гэрээс ажиллах үед зууш, хоол, апп, зураг нүдэнд ойр байдаг`. |
| User 03 — postpartum/new mother | Surface mentioned child/sleep, but detailed report stayed generic self-neglect. | Full report is now `postpartumContext`: хүүхэд, тасалдсан нойр, өөрийн хоол хойшлох, хүүхэд унтах богино цонх. |
| User 05 — social/weekend/alcohol | Surface mentioned social/alcohol, but main report could stay cue/environment. | Full report is now `socialWeekend`: хүмүүсийн дунд татгалзах эвгүй, belonging, Даваагийн гэмшил/чангаруулах бодол, богино татгалзах өгүүлбэр. |
| User 07 — gym restriction | Hunger-safety needed training/restriction identity. | Full report is now `gymRestriction`: `Өлсөх тусам зөв явж байна`, сахилга бат identity, оройн өлсөлт, уураг/нүүрс ус багтсан тулгуур хоол. |
| Medication/BP and PCOS | Could stop at surface/professional-check feeling. | Full report is now `bodyTrustMedical`: body trust disruption, control-seeking, self-blame, overly strict response, professional-check note without diagnosis. |
| Perimenopause | Could become generic stress/cycle note. | Full report is now `perimenopauseContext`: бие өөрчлөгдөх, хяналтаа алдаж байна, confidence-lowering and non-diagnostic copy. |

## Implementation notes

- Added surface-context voice routing without changing scoring or safety routing.
- Kept `collapse` from being overridden by gym surface when the primary hidden function is all-or-nothing collapse.
- Narrowed postpartum detection so `хүүхэд` alone does not steal ordinary reward-deficit reports.
- Narrowed medication detection so exact `Эм` answer is supported without matching unrelated words like `тэмдэг`.
- Removed public-facing English terms introduced during the patch (`fallback`, `script`, `restriction`, `comfort`, `weekend`) from new report voice copy.

## Tests added or updated

- `tests/surface-hidden-function-reframe.test.js`
  - remote-worker cue must not show body visibility surface
  - social/weekend report must contain `татгалзах эвгүй`, `хүмүүсийн дунд`, and not cue simple answer
  - shift worker report must contain `шөнийн ээлж`, `ээлжийн дараа`, and `ойр дэлгүүр` / `цайны газар` / `бэлэн хоол`
  - postpartum report must contain `хүүхэд`, `тасалдсан нойр`, `өөрийн хоол`
  - perimenopause report must contain body-change/control language
  - gym restriction report must contain discipline/hunger-safety language
  - deterministic medical copy remains banned
  - professional/urgent safety routes still suppress ordinary surface-hidden report

## Sprint 33 regeneration

- Output folder: `audits/sprint-33-second-virtual-cohort/`
- PDF: `audits/sprint-33-second-virtual-cohort/WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf`
- Result: 10 PASS / 0 PARTIAL / 0 FAIL
- P0/P1/P2: 0/0/1
- P2 note: user-08 detailed report remains long and may need later polish, but no blocker.

## Validation

- `node --check app.js` — passed
- `node --check scripts/run-virtual-user-audit.mjs` — passed
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` — passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` — passed, 10 PASS, readiness 96
- `npm test` — passed
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` — passed, 10 PASS, P0/P1/P2 = 0/0/1
- `git diff --check` — passed

## Remaining concerns

- Human testing remains HOLD by owner decision.
- User-08 PCOS/body-trust report is longer than ideal. This is P2 polish, not a blocker for owner review.

## Recommendation

READY FOR OWNER REVIEW — HUMAN TESTING STILL HOLD
