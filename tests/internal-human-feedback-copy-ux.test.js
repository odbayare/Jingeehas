const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal, allQuestionObjects } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function assertAbsent(text, phrases, label) {
  phrases.forEach(phrase => {
    assert(!text.toLowerCase().includes(phrase.toLowerCase()), `${label} should not include: ${phrase}`);
  });
}

function stageIndexFor(id) {
  return app.stageOneQuestions.findIndex(question => question.id === id);
}

function setStage(index, answers = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageIndex: index,
    stageAnswers: answers,
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    diaryEntries: []
  });
}

function run() {
  const questionFlowCopy = allQuestionObjects()
    .flatMap(question => [question.text, ...(question.options || [])])
    .join("\n");

  assertAbsent(questionFlowCopy, [
    "Богино reflection",
    "Reflection-д бүтэцтэй context хараахан бага байна",
    "тасарсан бэ",
    "тасардаг",
    "тасалдах",
    "Хоол удахад дараахаас гардаг уу"
  ], "question flow copy");

  [
    "2 долоо хоногоос дээш хугацаанд тогтвортой үргэлжлэхэд хамгийн хэцүү байсан",
    "Хоол холдоход дараах шинжээс илэрдэг үү?",
    "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?",
    "Хоолны төлөвлөгөө тань бага зэрэг зөрчихөд танд ихэвчлэн ямар бодол төрдөг вэ?",
    "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?",
    "Идсэнээ “нөхөх” гэж бөөлжүүлэх"
  ].forEach(phrase => {
    assert(questionFlowCopy.includes(phrase), `new question copy should appear: ${phrase}`);
  });

  setStage(stageIndexFor("S1-W05"));
  assert(normalize(_internal.renderStageOne()).includes("Богино тайлбар"), "free-text label should use Mongolian copy");

  const blockedTerms = [
    "reflection",
    "context",
    "Plan",
    "feedback",
    "default",
    "reward",
    "trigger",
    "pattern",
    "diary",
    "craving",
    "reset",
    "failure",
    "Perfectionism",
    "guilt",
    "shame"
  ];

  setStage(stageIndexFor("S1-C00"));
  const firstQuestion = normalize(_internal.renderStageOne());
  assert(!firstQuestion.includes("Буцах"), "first intro question should not show disabled Back button");

  setStage(stageIndexFor("S1-C02"), { "S1-C01": "45" });
  const secondQuestion = normalize(_internal.renderStageOne());
  assert(secondQuestion.includes("Буцах"), "question screens after the first should show Back");
  _internal.previousStageQuestion();
  let previousQuestion = _internal.renderStageOne();
  assert(previousQuestion.includes('value="45"'), "Back should preserve the previous answer");
  _internal.updateQuestionValue("S1-C01", "46");
  assert.strictEqual(_internal.getTestState().stageAnswers["S1-C01"], "46", "previous answer should be revisable");

  setStage(stageIndexFor("S1-W05"), {});
  const emptyTextQuestion = normalize(_internal.renderStageOne());
  assert(emptyTextQuestion.includes("Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно."));
  assert(!emptyTextQuestion.includes("Бид таны хариултыг ингэж ойлголоо"));
  assertAbsent(emptyTextQuestion, blockedTerms, "empty free-text question");

  setStage(stageIndexFor("S1-W05"), {
    "S1-W05": "Усанд сэлдэг байсан ч ажил ихсээд үргэлжлэхээ больсон."
  });
  const savedTextQuestion = normalize(_internal.renderStageOne());
  assert(savedTextQuestion.includes("Тайлбар хадгалагдлаа"));
  assert(savedTextQuestion.includes("Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно."));
  assertAbsent(savedTextQuestion, blockedTerms, "saved free-text question");

  _internal.setTestState({
    packageType: "seven-day",
    view: "diary",
    internalTest: true,
    sevenDayPaid: true,
    diaryQuestionIndex: 1,
    diaryDraft: { meal_rhythm: "Тогтуун, хоол алгасаагүй" },
    diaryEntries: []
  });
  const diarySecondQuestion = normalize(_internal.renderDiary());
  assert(diarySecondQuestion.includes("Буцах"), "diary question screens after the first should show Back");
  _internal.previousDiaryQuestion();
  assert.strictEqual(_internal.getTestState().diaryDraft.meal_rhythm, "Тогтуун, хоол алгасаагүй", "diary Back should preserve prior answer");

  const publicAndInternalText = normalize([
    _internal.renderLanding(),
    _internal.renderOneTimeStart(),
    _internal.renderStageOne(),
    _internal.renderInternalTesterFeedbackSurvey(),
    _internal.renderFeedbackExport()
  ].join("\n"));
  assertAbsent(publicAndInternalText, [
    "Reflection-д бүтэцтэй context хараахан бага байна",
    "Богино reflection",
    "Feedback export"
  ], "visible UI");
}

run();
console.log("internal-human-feedback-copy-ux tests passed");
