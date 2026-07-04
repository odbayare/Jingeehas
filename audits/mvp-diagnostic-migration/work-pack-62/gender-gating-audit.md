# WP62 Gender / Demographic Gating Audit

## Scope

Audited the runtime question bank, stage branching, diary branching, and answer options for gender-specific weight-loss content.

Protected folder `audits/sprint-36-paid-depth-prototype/` was not touched.

## Gender-Specific Questions And Options Found

| ID / Surface | Current text or option found | Current gating before WP62 | Fixed gating after WP62 |
|---|---|---|---|
| `S1-C06` option | `Төрсний дараа биеэ сэргээх` | Shown to all users in the basic context question. | Removed for male and unknown gender paths; available only after `S1-C02 = Эмэгтэй`. |
| `S1-W02` option | `Жирэмсэн эсвэл төрсний дараах үе` | Shown to all users in weight-change context. | Removed for male and unknown gender paths; available only after `S1-C02 = Эмэгтэй`. |
| `S1-F01` option | `Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог` | Shown to all users in hidden-function context. | Removed for male and unknown gender paths; available only after `S1-C02 = Эмэгтэй`. |
| `S1-R02` option | `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд` | Shown to all users in craving timing. | Removed for male and unknown gender paths; available only after `S1-C02 = Эмэгтэй`. |
| `S1-B05` | `Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?` | Shown to all users in body/medical module. | Hidden unless `S1-C02 = Эмэгтэй`. |
| `MC-GATE` | `Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?` | Always visible, including male and unknown gender paths. | Hidden unless `S1-C02 = Эмэгтэй`. |
| `MC-INTRO` | Menstrual-cycle intro copy. | Visible after `MC-GATE = Тийм, хамаарна`, even if stale answers existed. | Hidden unless `S1-C02 = Эмэгтэй` and `MC-GATE = Тийм, хамаарна`. |
| `MC-01` | `Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?` | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-02` | `Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?` | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-03` | `Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?` | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-04` | `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?` | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-05` | `Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?` | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-06` | Hormonal contraception, PCOS, postpartum/breastfeeding, perimenopause options. | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `MC-07` | Cycle disruption with restriction/exercise. | Visible after menstrual gate yes. | Hidden unless female and menstrual gate yes. |
| `D-C05` option | `Сарын тэмдэгтэй холбоотой мэт санагдсан` | Shown in daily diary core question to all 7-day users. | Removed for male and unknown gender paths; available only after `S1-C02 = Эмэгтэй`. |
| `D-MC-01` | `Өнөөдөр мөчлөгийнхөө аль үедээ байгаа гэж бодож байна?` | Visible when menstrual context was active. | Hidden unless female and menstrual gate yes. |
| `D-MC-02` | `Өнөөдрийн идэх хүсэл мөчлөгтэй холбоотой юм шиг санагдсан уу?` | Visible when menstrual context was active. | Hidden unless female and menstrual gate yes. |
| `D-MC-03` | Cycle body-effect follow-up. | Visible after daily cycle-linked answer. | Hidden unless female, menstrual gate yes, and daily cycle-linked answer exists. |

## Runtime Fix

WP62 adds one shared gender-gating layer:

- `selectedGender()`
- `isFemaleUser()`
- `isMaleUser()`
- `isFemaleSpecificStageQuestion()`
- `isFemaleSpecificOption()`
- `genderSafeQuestion()`

`stageQuestions()` and `getDiaryQuestions()` now return gender-safe question objects. Female-specific questions are hidden for male and unknown users. Female-specific answer options are stripped from otherwise general questions unless the selected gender is female.

## Test Coverage

Added `tests/gender-gating.test.js` and registered it in `tests/run-all.js`.

Assertions cover:

- male path never includes menstrual/cycle/pregnancy/postpartum/breastfeeding questions or options
- female path may include relevant female-specific questions
- detailed cycle questions require female gender plus menstrual relevance opt-in
- unknown gender path does not show menstrual questions by default
- stale cycle answers cannot force male or unknown diary cycle questions
- old unsafe generic `MC-GATE` visibility is absent

## Conclusion

Male users cannot receive menstrual/cycle questions after WP62.
