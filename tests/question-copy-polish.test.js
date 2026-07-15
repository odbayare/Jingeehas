const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function visibleQuestionFlowText() {
  return app.allQuestionObjects()
    .flatMap(question => [question.text, ...(question.options || [])])
    .join("\n");
}

function assertAbsent(text, phrases) {
  const lower = String(text || "").toLowerCase();
  phrases.forEach(phrase => {
    assert(!lower.includes(phrase.toLowerCase()), `public question flow should not include: ${phrase}`);
  });
}

function assertPresent(text, phrases) {
  phrases.forEach(phrase => {
    assert(text.includes(phrase), `public question flow should include: ${phrase}`);
  });
}

function run() {
  const text = visibleQuestionFlowText();
  const bannedPhrases = [
    "reflection",
    "context",
    "default",
    "reward",
    "trigger",
    "pattern",
    "diary",
    "craving",
    "reset",
    "failure",
    "feedback",
    "Plan",
    "Perfectionism",
    "guilt",
    "shame",
    "snack",
    "delivery",
    "тасарсан",
    "тасардаг",
    "тасалдах",
    "тасалдвал",
    "Хоол удахад",
    "Хоол удах үед",
    "Өнөөдөр хоол удахад",
    "Reflection-д бүтэцтэй context"
  ];

  assertAbsent(text, bannedPhrases);

  assertPresent(text, [
    "Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?",
    "хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан",
    "Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?",
    "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?",
    "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?",
    "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?",
    "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?",
    "Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?",
    "Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?",
    "Идсэнээ “нөхөх” гэж бөөлжүүлэх"
  ]);

  app.stageOneQuestions.forEach((_, stageIndex) => {
    mockBackend.resetMockBackend();
    _internal.setTestState({
      packageType: "one-time",
      view: "stage1",
      internalTest: false,
      stageIndex,
      stageAnswers: {},
      stageVoiceSummaries: {},
      stageSummaryUi: {},
      removedEntries: []
    });
    assertAbsent(normalize(_internal.renderStageOne()), bannedPhrases);
  });

}

run();
console.log("question-copy-polish tests passed");
