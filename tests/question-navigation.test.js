const assert = require("assert");
const path = require("path");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function loadAppWithBrowserMocks() {
  const store = {};
  const appElement = { innerHTML: "" };
  const scrollCalls = [];

  global.window = {
    location: { search: "", pathname: "/" },
    requestAnimationFrame(callback) {
      callback();
      return 1;
    },
    scrollTo(options) {
      scrollCalls.push(options);
    }
  };
  global.document = {
    getElementById(id) {
      if (id === "app") return appElement;
      return null;
    }
  };
  global.localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };

  const appPath = path.resolve(__dirname, "../app.js");
  delete require.cache[appPath];
  const app = require(appPath);
  scrollCalls.length = 0;
  return { app, appElement, scrollCalls };
}

function stageIndexFor(app, id) {
  return app.stageOneQuestions.findIndex(question => question.id === id);
}

function run() {
  const { app, appElement, scrollCalls } = loadAppWithBrowserMocks();
  const { _internal } = app;

  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageIndex: stageIndexFor(app, "S1-C02"),
    stageAnswers: {},
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    removedEntries: []
  });

  let html = _internal.renderStageOne();
  assert(html.includes("question-top-actions"), "top-left Back container should render after the first question");
  assert(html.indexOf("question-top-actions") < html.indexOf("question-text"), "Back should appear above question title");

  _internal.updateQuestionValue("S1-C02", "Эмэгтэй");
  assert.strictEqual(_internal.getTestState().stageIndex, stageIndexFor(app, "S1-C02"), "single choice should not auto-advance");
  assert.deepStrictEqual(scrollCalls, [], "answer selection should not scroll the page");

  _internal.nextStageQuestion();
  assert.strictEqual(_internal.getTestState().stageIndex, stageIndexFor(app, "S1-C03"), "Continue should advance after single choice");
  assert(scrollCalls.some(call => call && call.top === 0 && call.left === 0 && call.behavior === "auto"), "Continue should scroll to top");

  scrollCalls.length = 0;
  _internal.previousStageQuestion();
  assert.strictEqual(_internal.getTestState().stageIndex, stageIndexFor(app, "S1-C02"), "Back should return to previous question");
  assert.strictEqual(_internal.getTestState().stageAnswers["S1-C02"], "Эмэгтэй", "Back should preserve selected answer");
  assert(scrollCalls.some(call => call && call.top === 0), "Back should scroll to top");

  _internal.updateQuestionValue("S1-C02", "Эрэгтэй");
  assert.strictEqual(_internal.getTestState().stageAnswers["S1-C02"], "Эрэгтэй", "previous answer should be editable");
  _internal.nextStageQuestion();
  assert.strictEqual(_internal.getTestState().stageAnswers["S1-C02"], "Эрэгтэй", "edited answer should persist after Continue");

  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageIndex: stageIndexFor(app, "S1-W02"),
    stageAnswers: {},
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    removedEntries: []
  });
  scrollCalls.length = 0;
  _internal.toggleMulti("S1-W02", "Нойр муудсан", 99);
  assert.strictEqual(_internal.getTestState().stageIndex, stageIndexFor(app, "S1-W02"), "multiple choice should not auto-advance");
  assert.deepStrictEqual(scrollCalls, [], "multiple choice should not scroll without Continue");

  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageIndex: stageIndexFor(app, "S1-W05"),
    stageAnswers: {},
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    removedEntries: []
  });
  _internal.setAnswerDraft("S1-W05", "Ажил ихсээд үргэлжлүүлэхэд хэцүү болсон.");
  assert.strictEqual(_internal.getTestState().stageIndex, stageIndexFor(app, "S1-W05"), "text input should not auto-advance");
  html = _internal.renderStageOne();
  const text = normalize(html);
  assert(text.includes("Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно."));
  assert(!text.includes("Reflection"));
  assert(!text.includes("context"));

  scrollCalls.length = 0;
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    stageAnswers: {
      "S1-C01": "33",
      "S1-S02": "Үгүй",
      "S1-S04": "Үгүй"
    },
    internalFeedbackForm: { fitRating: "8" }
  });
  _internal.submitInternalFeedback();
  assert.strictEqual(_internal.getTestState().view, "feedbackThanks", "feedback submit should change view");
  assert(scrollCalls.some(call => call && call.top === 0), "feedback thank-you transition should scroll to top");
  assert(appElement.innerHTML.includes("Санал өгсөнд баярлалаа"), "feedback thank-you screen should render");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    stageAnswers: {
      "S1-C01": "33",
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    safetyFlags: ["S1-S04:urgent"]
  });
  const urgentReport = normalize(_internal.renderReport());
  assert(urgentReport.includes("Яаралтай аюулгүй байдлын зөвлөмж"), "Mode 4 urgent report should remain visible");
  assert(!urgentReport.includes("9,900₮ төлөөд"), "Mode 4 should not show commercial CTA");
  assert(!urgentReport.includes("14 хоногийн туршилт"), "Mode 4 should suppress ordinary experiment");
}

run();
console.log("question-navigation tests passed");
