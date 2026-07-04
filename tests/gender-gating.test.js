const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const { _internal } = app;

const genderSpecificPattern = /сарын тэмдэг|мөчлөг|жирэмсэн|жирэмслэлт|төрсний дараа|төрсний дараах|хөхүүл|дааврын жирэмслэлтээс хамгаалах|перименопауз|цэвэршилт|PMS/i;

function visibleQuestionText(stageAnswers = {}, extras = {}) {
  _internal.setTestState({
    packageType: "one-time",
    stageAnswers,
    diaryDraft: {},
    diaryEntries: [],
    ...extras
  });
  return _internal.stageQuestions()
    .flatMap(question => [question.id, question.text, question.intro, ...(question.options || [])])
    .filter(Boolean)
    .join(" | ");
}

function visibleDiaryText(stageAnswers = {}, diaryDraft = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    stageAnswers,
    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа", ...diaryDraft },
    preliminary: [{ key: "reward" }],
    diaryEntries: []
  });
  return _internal.getDiaryQuestions()
    .flatMap(question => [question.id, question.text, ...(question.options || [])])
    .filter(Boolean)
    .join(" | ");
}

function run() {
  const maleStage = visibleQuestionText({ "S1-C02": "Эрэгтэй" });
  assert(!genderSpecificPattern.test(maleStage), "male path must not include menstrual/cycle/pregnancy/postpartum/breastfeeding questions or options");
  const maleDiary = visibleDiaryText({ "S1-C02": "Эрэгтэй", "MC-GATE": "Тийм, хамаарна" });
  assert(!genderSpecificPattern.test(maleDiary), "male diary path must not include cycle questions or options even with stale cycle answers");

  const femaleStageDefault = visibleQuestionText({ "S1-C02": "Эмэгтэй" });
  assert(femaleStageDefault.includes("MC-GATE"), "female path may include the menstrual relevance gate");
  assert(femaleStageDefault.includes("Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?"), "female path may include relevant pregnancy/postpartum/breastfeeding safety question");
  assert(!femaleStageDefault.includes("MC-01"), "female path should not include detailed cycle questions until the gate is yes");

  const femaleStageCycle = visibleQuestionText({ "S1-C02": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна" });
  assert(femaleStageCycle.includes("Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?"), "female path may include relevant cycle questions after opt-in");
  const femaleDiary = visibleDiaryText({ "S1-C02": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна" });
  assert(femaleDiary.includes("Өнөөдөр мөчлөгийнхөө аль үедээ байгаа гэж бодож байна?"), "female diary path may include cycle follow-ups after opt-in");

  const unknownStage = visibleQuestionText({});
  assert(!genderSpecificPattern.test(unknownStage), "unknown gender path must not show menstrual questions or female-specific options by default");
  const unknownDiary = visibleDiaryText({ "MC-GATE": "Тийм, хамаарна" });
  assert(!genderSpecificPattern.test(unknownDiary), "unknown gender diary path must not show menstrual questions by default");

  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert(!source.includes('if (question.id === "MC-GATE") return true;'), "old unsafe generic MC-GATE visibility must not remain");
}

run();
console.log("gender-gating tests passed");
