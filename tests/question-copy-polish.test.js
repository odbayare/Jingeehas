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
    "2 долоо хоногоос дээш үргэлжлэхэд хамгийн хэцүү байсан",
    "Хоол холдоход дараах шинжээс илэрдэг үү?",
    "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?",
    "Төлөвлөгөө жаахан зөрөхөд таны толгойд ихэвчлэн юу орж ирдэг вэ?",
    "Төлөвлөөгүй идэхийн яг өмнө танд юу хамгийн ойр санагддаг вэ?",
    "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?",
    "Хоолоо хасаж эхлэх үед таны биед хамгийн түрүүнд юу мэдрэгддэг вэ?",
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
      diaryEntries: []
    });
    assertAbsent(normalize(_internal.renderStageOne()), bannedPhrases);
  });

  const renderedDiaryQuestionCount = 18;
  Array.from({ length: renderedDiaryQuestionCount }).forEach((_, diaryQuestionIndex) => {
    mockBackend.resetMockBackend();
    _internal.setTestState({
      packageType: "seven-day",
      view: "diary",
      internalTest: false,
      sevenDayPaid: true,
      diaryDay: 1,
      diaryQuestionIndex,
      diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" },
      preliminary: [{ key: "reward" }, { key: "hungerSafety" }, { key: "regulation" }],
      diaryEntries: []
    });
    assertAbsent(normalize(_internal.renderDiary()), bannedPhrases);
  });
}

run();
console.log("question-copy-polish tests passed");
