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
    ...extras
  });
  return _internal.stageQuestions()
    .flatMap(question => [question.id, question.text, question.intro, ...(question.options || [])])
    .filter(Boolean)
    .join(" | ");
}

function run() {
  const maleStage = visibleQuestionText({ "S1-C02": "Эрэгтэй" });
  assert(!genderSpecificPattern.test(maleStage), "male path must not include menstrual/cycle/pregnancy/postpartum/breastfeeding questions or options");

  const femaleStageDefault = visibleQuestionText({ "S1-C02": "Эмэгтэй" });
  assert(femaleStageDefault.includes("MC-GATE"), "female path may include the menstrual relevance gate");
  assert(femaleStageDefault.includes("Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?"), "female path may include relevant pregnancy/postpartum/breastfeeding safety question");
  assert(!femaleStageDefault.includes("MC-01"), "female path should not include detailed cycle questions until the gate is yes");

  const femaleStageCycle = visibleQuestionText({ "S1-C02": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна" });
  assert(femaleStageCycle.includes("Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?"), "female path may include relevant cycle questions after opt-in");

  const unknownStage = visibleQuestionText({});
  assert(!genderSpecificPattern.test(unknownStage), "unknown gender path must not show menstrual questions or female-specific options by default");

  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert(!source.includes('if (question.id === "MC-GATE") return true;'), "old unsafe generic MC-GATE visibility must not remain");
}

run();
console.log("gender-gating tests passed");
