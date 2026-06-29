const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

function visibleText(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function beforeInternalNotes(markdown) {
  return String(markdown).split("## Дотоод тэмдэглэл")[0];
}

function assertNoTechnicalWords(label, text) {
  const banned = [
    "mock",
    "prototype",
    "workflow",
    "entitlement",
    "ledger",
    "debug",
    "fake payment",
    "test data"
  ];
  banned.forEach(word => {
    assert(!new RegExp(`\\b${word}\\b`, "i").test(text), `${label} should not expose technical word: ${word}`);
  });
}

function run() {
  mockBackend.resetMockBackend();
  const coach = mockBackend.createCoachAccount({ email: "language-coach@example.com", displayName: "Language Coach" });
  const login = mockBackend.loginCoach("language-coach@example.com", coach.temporaryPassword);
  const client = mockBackend.createCoachClient(login.session.token, { clientEmail: "language-client@example.com" });

  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    coachInviteToken: client.inviteToken,
    coachDiscountConsent: false,
    stageAnswers: {},
    diaryEntries: []
  });
  const discountCopy = visibleText(_internal.renderOneTimeStart());
  assert(discountCopy.includes("Coach-ийн хөнгөлөлттэй үнэ: 9,900₮"));
  assert(discountCopy.includes("гарсан дүгнэлтээ Language Coach-д харагдахыг зөвшөөрч байна"));
  assertNoTechnicalWords("client discount copy", discountCopy);

  _internal.setTestState({
    coachSessionToken: login.session.token,
    coachClientForm: { email: "", name: "", note: "" },
    coachReportView: null
  });
  const dashboardCopy = visibleText(_internal.renderCoachDashboard());
  [
    "Coach цэс",
    "Үйлчлүүлэгч нэмэх",
    "Дүгнэлт",
    "Таны авах орлого",
    "Нээлтээс өмнөх туршилтын хувилбар",
    "Энэ хувилбар дээр бодит төлбөр авахгүй"
  ].forEach(phrase => assert(dashboardCopy.includes(phrase), `coach UI should include: ${phrase}`));
  assertNoTechnicalWords("coach dashboard", dashboardCopy);

  _internal.setTestState({
    internalTest: true,
    adminCoachForm: { email: "", name: "", phone: "", commissionMnt: "4000" },
    adminCoachResult: { temporaryPassword: "TEMP-1234" }
  });
  const adminCopy = visibleText(_internal.renderAdminCoach());
  [
    "Coach / Дэд админ",
    "Coach-ийн нэр",
    "Coach-ийн имэйл",
    "Утас",
    "Coach-ийн авах дүн",
    "Түр нууц үг"
  ].forEach(phrase => assert(adminCopy.includes(phrase), `admin coach UI should include: ${phrase}`));

  const guide = fs.readFileSync(path.join(__dirname, "..", "COACH_INTERNAL_DEMO_GUIDE.md"), "utf8");
  assert(guide.includes("# Coach цэс турших богино заавар"));
  assert(guide.includes("Энэ бол нээлтээс өмнөх туршилтын хувилбар."));
  assert(guide.includes("Энэ хувилбар дээр бодит төлбөр авахгүй."));
  assertNoTechnicalWords("coach demo guide before internal notes", beforeInternalNotes(guide));

  const inviteMessage = fs.readFileSync(path.join(__dirname, "..", "COACH_DEMO_INVITE_MESSAGE.md"), "utf8");
  assert(inviteMessage.includes("Coach цэс"));
  assert(inviteMessage.includes("9,900₮"));
  assert(inviteMessage.includes("4,000₮"));
  assert(inviteMessage.includes("Бодит төлбөр авахгүй"));
  assertNoTechnicalWords("coach invite message", inviteMessage);
}

run();
console.log("coach-language-polish tests passed");
