# Human Demo QA

## Purpose

Automated tests and virtual user QA have passed. Human demo QA checks a different layer: whether a real person understands the product, trusts the framing, feels emotionally safe, recognizes themselves in the report, and would consider paying for it.

This is not a scoring or logic test. It is a comprehension, trust, emotional response, and willingness-to-pay test.

## Manual Demo Paths

### Path 1 — One-Time Reward-Seeking

1. Open the app.
2. Choose `Нэг удаагийн гүн зураглал`.
3. Answer with:
   - low hunger before unplanned eating
   - boredom
   - “нэг гоё юм” desire
   - food cue or delivery/food image cue
   - reward desire after a long day
4. Expected report:
   - primary or strong secondary: `Reward-Seeking / Stimulation Compensation`
   - possible support: `Reward Deficit Compensation`
   - hidden function should mention reward or stimulation
   - avoid list should discourage banning all tasty foods
5. Check that the 7-day refinement CTA is visible and does not feel overly pushy.

### Path 2 — One-Time Hunger-Safety

1. Open the app.
2. Choose `Нэг удаагийн гүн зураглал`.
3. Answer with:
   - skipped meals
   - 5+ hour meal gaps
   - fear of future hunger
   - diet-before overeating
   - high hunger before unplanned eating
4. Expected report:
   - primary: `Hunger-Safety / Scarcity Protection`
   - hidden function should mention protection from future hunger
   - avoid list should include fasting or meal skipping
   - first leverage point should mention anchor meals or planned evening option

### Path 3 — 7-Day Executive Load / Decision-Default

1. Open the app.
2. Choose `[REMOVED_FEATURE_PRODUCT] зураглал`.
3. Setup answers:
   - knows what to do
   - no energy to decide or prepare food
   - delivery/snack/default choices are easiest
4. Diary answers for 5+ entries:
   - low evening energy
   - delivery/default
   - no prep
   - tired but not necessarily emotionally distressed
5. Expected report:
   - primary or secondary: `Executive Load Failure`
   - primary or secondary: `Decision-Default Mismatch`
   - report includes `Trigger Map`
   - report includes `14-Day Experiment`
   - first leverage point should mention default dinner system or environment/default redesign

## Blind Demo Instructions

Give the tester only this instruction:

> Ороод өөрөө ойлгосноороо нэг үнэлгээ хийж үз. Дууссаны дараа доорх асуултад хариул.

Do not explain the product beforehand. Do not explain which path to choose unless you are intentionally running one of the manual paths above.

## Feedback Questions

1. Энэ бүтээгдэхүүн яг юу хийдэг гэж ойлгосон бэ?
2. Нэг удаагийн тест ба 7 хоногийн тестийн ялгаа ойлгомжтой байсан уу?
3. Аль сонголтыг авах байсан бэ? Яагаад?
4. Асуултууд generic санагдсан уу, эсвэл өөрийг чинь таньж байгаа юм шиг байсан уу?
5. Аль асуулт эвгүй, хэт хувийн, эсвэл ойлгомжгүй санагдсан бэ?
6. Report уншаад “яг намайг хэлсэн байна” гэсэн хэсэг байсан уу?
7. Report хэт урт байсан уу, эсвэл уншихад боломжийн байсан уу?
8. Report-д буруутгасан, айлгасан, эсвэл онош тавьж байгаа мэт хэсэг байсан уу?
9. 7 хоногийн нарийвчилсан үнэлгээний CTA шахалттай санагдсан уу?
10. Та мөнгө төлөх байсан уу? Хэрвээ тийм бол аль хувилбарт?
11. Ямар үнэ боломжийн санагдаж байна?
12. Юу хамгийн их ойлгомжгүй байсан бэ?
13. Юуг нэмбэл илүү итгэл төрөх вэ?

## Feedback Log Template

| Tester | Date | Device | Path tested | Completed? | Main confusion | Strongest “this is me” moment | Negative reaction | Willingness to pay | Suggested price | Priority fixes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |

## Demo Readiness Checklist

- `npm test` pass
- Desktop render ok
- Mobile 390/430 ok
- No console errors
- One-time flow works
- 7-day flow works
- Mode 3/4 safety visible only when triggered
- Report has no numeric confidence
- Report has no shame language
- 7-day CTA visible in one-time report
