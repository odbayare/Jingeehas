const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function baseAssessmentState(overrides = {}) {
  mockBackend.resetMockBackend();
  const assessment = mockBackend.createAssessment("one_time");
  _internal.setTestState({
    packageType: "one-time",
    currentAssessmentId: assessment.id,
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: { status: "idle", message: "", invoice: null },
    contactCapture: {
      name: "Internal QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    internalTest: false,
    preliminary: [{ key: "collapse", score: 5, label: "хүчтэй нийцэж байна" }],
    stageAnswers: {
      "S1-W03": "Бараг бүх оролдлогоос хойш",
      "S1-W04": ["Калори тоолох", "Мацаг"],
      "S1-W06": "Одоо бүх юм дууссан",
      "S1-X01": "Хэсэг сайн яваад дараа нь нурдаг",
      "S1-X03": "Маш хүчтэй",
      "S1-F02": "Одоо бүх юм дууссан",
      "S1-S04": "Үгүй"
    },
    diaryEntries: [],
    ...overrides
  });
  return assessment;
}

function run() {
  const appSource = require("fs").readFileSync(require("path").join(__dirname, "..", "app.js"), "utf8");
  assert(appSource.includes('params.get("internalTest") === "1"'), "internal mode should activate from ?internalTest=1");

  baseAssessmentState();
  const publicReport = normalize(_internal.renderReport());
  assert(publicReport.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"), "public one-time report should still require payment");
  assert(!publicReport.includes("Туршилтын санал асуулга"), "feedback survey should not appear before internal report access");

  baseAssessmentState({ internalTest: true });
  assert.strictEqual(_internal.isInternalTestMode(), true);
  const internalReportHtml = _internal.renderReport();
  const internalReport = normalize(internalReportHtml);
  assert(internalReport.includes("3. Таны хамгийн магадлалтай гол хэв маяг"), "internal mode should show full report without QPay");
  assert(internalReport.includes("Дотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй."));
  assert(internalReport.includes("Туршилтын санал асуулга"));
  assert(!internalReport.includes("QPay QR"));
  assert(!internalReport.includes("Банкны апп-аар төлбөрөө"));

  const questions = [
    "Тест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?",
    "Асуултууд ойлгомжтой байсан уу?",
    "Тайлан таны нөхцөлтэй хэр нийцсэн бэ?",
    "Тайлангийн эхний “Гол гацалт” хэсэг ойлгомжтой байсан уу?",
    "Тайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?",
    "Тайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?",
    "Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?",
    "Тайлангийн хэл найруулга ямар санагдсан бэ?",
    "Энэ тайланг 9,900 төгрөгөөр авахад үнэ цэнтэй санагдах уу?",
    "Хамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?",
    "Хамгийн засмаар санагдсан хэсэг юу байсан бэ?"
  ];
  questions.forEach(question => assert(internalReport.includes(question), `missing feedback question: ${question}`));
  assert(!internalReport.includes("9,900 төлж"));
  assert(!internalReport.includes("9,900₮ төлж"));
  assert(!internalReport.includes("9,900-өөр"));
  assert(!internalReport.includes("9,900₮-өөр"));

  _internal.updateInternalFeedbackField("fitRating", "9");
  _internal.updateInternalFeedbackField("simpleResultClarity", "Тийм, шууд ойлгосон");
  _internal.updateInternalFeedbackField("simpleResultClarityDetail", "Эхний хэсэг ойлгомжтой");
  _internal.updateInternalFeedbackField("mostUsefulPart", "Давтагддаг тойрог");
  _internal.updateInternalFeedbackField("mostNeedsFix", "Зарим өгүүлбэр богино байвал сайн");
  _internal.submitInternalFeedback();

  const records = mockBackend.getTesterFeedbackRecords();
  assert.strictEqual(records.length, 1);
  assert.strictEqual(records[0].internalTest, true);
  assert.strictEqual(records[0].assessmentType, "weight-test");
  assert.strictEqual(records[0].reportMode, "deep");
  assert(records[0].primaryMechanism, "feedback record should include primary mechanism");
  assert(Array.isArray(records[0].secondaryMechanisms), "feedback record should include secondary mechanisms");
  assert.strictEqual(records[0].safetyMode, "deep");
  assert.strictEqual(records[0].feedback.fitRating, "9");
  assert.strictEqual(records[0].feedback.simpleResultClarity, "Тийм, шууд ойлгосон");

  const thanks = normalize(_internal.renderFeedbackThanks());
  assert(thanks.includes("Санал өгсөнд баярлалаа"));
  assert(thanks.includes("Дахин эхлэх"));

  const exportText = normalize(_internal.renderFeedbackExport());
  assert(exportText.includes("Саналын экспорт"));
  assert(exportText.includes("Давтагддаг тойрог"));

  baseAssessmentState({ internalTest: false });
  assert(!normalize(_internal.renderFeedbackExport()).includes("Саналын экспорт"), "feedback export should be internal-only");

  _internal.setTestState({
    packageType: "seven-day",
    internalTest: true,
    diaryEntries: [{
      day_number: 1,
      meal_rhythm: "Тогтвортой",
      unplanned_eating_count: "Үгүй",
      stress_score: 3,
      energy_score: 5,
      sleep: ["6-8 цаг"],
      movement: "Бага зэрэг",
      body_signals: ["Аль нь ч үгүй"],
      pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] }
    }]
  });
  const urgent = normalize(_internal.renderReport());
  assert(urgent.includes("Одоо жин хасах тухай биш"));
  assert(!urgent.includes("Туршилтын санал асуулга"));
  assert(!urgent.includes("Дотоод туршилтын хувилбар"));
}

run();
console.log("internal-tester-feedback tests passed");
