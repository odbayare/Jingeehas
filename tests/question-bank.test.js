"use strict";
const assert = require("node:assert/strict");
const questions = require("../questions.js");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");

assert.equal(questions.questionById("Q-FOOD-FEELING").section, "Хооллосны дараах мэдрэмж ба цадалт");
assert.equal(questions.questionById("S1-S03").text, "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?");
assert.equal(questions.validateAnswer(questions.questionById("Q-AGE"), 17), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-HEIGHT"), "abc"), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-WEIGHT"), 0), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-MEAL-RHYTHM"), ""), "Энэ асуултад хариулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-TARGET"), ""), "");
assert(questions.QUESTIONS.filter(question => question.sensitive && question.id !== "Q-SEX").every(question => question.options.includes("Хариулахгүй")));
assert(questions.questionById("Q-SEX").options.includes("Хариулахгүй байхыг хүсэж байна"));
assert.notEqual(questions.questionById("Q-SLEEP-DURATION").id, questions.questionById("Q-SLEEP-QUALITY").id);
assert.notEqual(questions.questionById("Q-GLUCOSE").id, questions.questionById("Q-BLOOD-PRESSURE").id);
assert.notEqual(questions.questionById("Q-TRAVEL").id, questions.questionById("Q-MOVEMENT").id);

app._test.setComingSoon(false);
const landing = app.renderForPath("/");
assert(landing.includes("Жин хасахад саад болж буй шалтгаанаа тань"));
assert(landing.includes("Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?"));
for (const question of ["Илүүдэл жин тань таны санааг байнга зовоодог уу?", "Янз бүрийн дасгал хөдөлгөөн туршсан ч өөрчлөлт бага байна уу?", "Тураах бэлдмэл, хоолны дэглэм хэрэглэсэн ч үр дүн нь хангалтгүй эсвэл удаан тогтдоггүй юу?"]) assert(landing.includes(question), question);
assert(landing.includes("Жин хасахад зөвхөн хоол, дасгал биш — таны сэтгэлзүйн хэв маяг, далд зуршил хүчтэй нөлөөлдөг."));
assert(landing.includes("Өөрт тань саад болж буй сэтгэлзүйн шалтгааныг эхлээд ойлгож чадвал жин хасах арга барилаа илүү бодитой, өөртөө тохирсон, тогтвортой сонгоход хялбар болно."));
assert(landing.includes("Сэтгэлзүйн хэв маягаа тодорхойлох"));
assert(landing.includes('href="/assessment/start"'));
assert(landing.includes("Эмнэлгийн онош тавихгүй. Таны жин хасахад нөлөөлж буй давтагддаг хэв маяг, далд зуршлыг таньж ойлгоход тусална."));
assert.equal((landing.match(/class="hero-question"/g) || []).length, 3);
assert(!/<section class="hero"[^>]*>[\s\S]*?<h1[^>]*>Илүүдэл жингээс салах тест үнэлгээ<\/h1>/.test(landing));
assert(!landing.includes("Үнэ: 9,900₮"));
assert(!/<section class="hero"[\s\S]*?9,900₮[\s\S]*?<\/section>/.test(landing));
assert.equal(app.PRODUCT.amount, 9900);
const appSource = require("node:fs").readFileSync(require.resolve("../app.js"), "utf8");
assert(appSource.includes('if (route === "landing") trackEvent("landing_viewed"'), "landing analytics event remains wired");
assert(!landing.includes("Үе 1"));
assert(!app.renderForPath("/assessment/questions").includes("эхний хэв маяг"));
assert(app.renderForPath("/assessment/questions").includes("Таны хариултын зураглал тест дууссаны дараа гарна."));
app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment" });
const completion = app.renderForPath("/assessment/completed");
assert(completion.includes("Таны хариултуудыг цуглуулж дууслаа"));
assert(completion.includes("Дэлгэрэнгүй тайлангаа авах"));
assert(completion.includes("Бүрэн тайлангийн үнэ: 9,900₮"));
assert(!completion.includes("QPay нэхэмжлэл үүсгэх"));
assert(!completion.includes("Төлбөр ба тайлан сэргээх мэдээлэл"));
assert(!completion.includes("test-assessment"));
app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment", busy: true });
const transitioningCompletion = app.renderForPath("/assessment/completed");
assert(transitioningCompletion.includes("Үргэлжлүүлж байна..."));
assert(transitioningCompletion.includes("disabled"));
app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment" });
const paymentPage = app.renderForPath("/assessment/payment");
assert(paymentPage.includes("Бүрэн тайлангаа нээх"));
assert(paymentPage.includes("Үнэ: 9,900₮"));
assert(paymentPage.includes("9,900₮-ийн QPay нэхэмжлэл үүсгэх"));
assert(!paymentPage.includes("тайлан сэргээх"));
app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment", payment: {
  status: "paid", qrImage: "dynamic-qr-image", expiresAt: "2026-07-19T15:52:45.000+08:00"
} });
const paidPaymentPage = app.renderForPath("/assessment/payment");
assert(paidPaymentPage.includes("Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."));
assert(paidPaymentPage.includes("Бүрэн тайлан харах"));
assert(!paidPaymentPage.includes("QPay QR код"));
assert(!paidPaymentPage.includes("dynamic-qr-image"));
assert(!paidPaymentPage.includes("Нэхэмжлэлийн хугацаа"));
assert(!paidPaymentPage.includes("Төлбөр шалгах"));
const multiFactorReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-EMOTION", value: "Нэлээд нэмэгддэг" },
  { questionId: "Q-METHOD-BARRIERS", value: ["Стресс ба сэтгэл хөдлөл", "Ядаргаа эсвэл нойр"] },
  { questionId: "Q-SLEEP-DURATION", value: "4–6 цаг" },
  { questionId: "Q-SLEEP-QUALITY", value: "Өглөө ядарсан хэвээр байдаг" }
])));
app._test.setState({ ownerPreview: true, report: { fullReport: multiFactorReport } });
const renderedReport = app.renderForPath("/report");
assert(renderedReport.includes("Жин хасалтад нөлөөлж буй гол хэв маяг"));
assert(!renderedReport.includes("Жин хасалтад нөлөөлж буй гол хэв маягууд"));
assert(renderedReport.includes("Гол хэв маяг өдөр тутмын нөхцөлтэй хэрхэн холбогдож байна вэ?"));
assert(renderedReport.includes("Сэтгэл хөдлөл ихсэх үед хоол руу татагдах хэв маяг"));
assert(renderedReport.includes("Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл"));
assert(renderedReport.includes("Танд илүү тохирох өөрчлөлтийн чиглэл"));
assert(!/Q-[A-Z]|S1-|MC-/.test(renderedReport));
for (const phrase of ["арга тасрах", "арга тасарсан", "арга тасарсны", "төлөвлөгөө тасрах", "дэглэм тасрах", "шилжилтийн саад", "үр дүнгээ хадгалах шилжилт", "залгамж хувилбар", "Зангуу", "Доод хувилбар", "Зардлын зааг", "Биеийн дурдсан нөхцөл", "аюулгүй хувилбар"]) assert(!renderedReport.includes(phrase), `forbidden report copy: ${phrase}`);

const pluralReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-EMOTION", value: "Нэлээд нэмэгддэг" },
  { questionId: "Q-METHOD-BARRIERS", value: ["Стресс ба сэтгэл хөдлөл", "Өлсөх эсвэл цадах мэдрэмж"] },
  { questionId: "Q-MEAL-RHYTHM", value: "5 цагаас урт" },
  { questionId: "Q-HUNGER", value: "Хэт өлссөний дараа анзаардаг" }
])));
app._test.setState({ ownerPreview: true, report: { fullReport: pluralReport } });
const renderedPluralReport = app.renderForPath("/report");
assert(renderedPluralReport.includes("Жин хасалтад нөлөөлж буй гол хэв маягууд"));
const neutralReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-EMOTION", value: "Хариулахгүй" },
  { questionId: "Q-SATIETY", value: "Хариулахгүй" },
  { questionId: "Q-CUE", value: ["Хариулахгүй"] }
])));
app._test.setState({ ownerPreview: true, report: { fullReport: neutralReport } });
const renderedNeutralReport = app.renderForPath("/report");
assert(renderedNeutralReport.includes("Ямар нийтлэг саад хүчтэй илрээгүй вэ?"));
assert(renderedNeutralReport.includes("Дараагийн хугацаанд юу ажиглаж болох вэ?"));
assert(renderedNeutralReport.includes("нэг давтагддаг хооллох мөчийг өөрчлөлтгүйгээр ажиглах"));
assert(renderedNeutralReport.includes("Энэ асуумжаар юуг дүгнэж болохгүй вэ?"));
assert(!renderedNeutralReport.includes("Тайланг хэрхэн ашиглах вэ?"), "redundant generic neutral report-use section remains");

function assertSequentialSections(report, name) {
  const sections = app._test.buildReportSections(report).filter(section => section.visible);
  assert(sections.every(section => Array.isArray(section.paragraphs)), `${name}: section contract must expose paragraphs arrays`);
  app._test.setState({ ownerPreview: true, report: { fullReport: report } });
  const html = app.renderForPath("/report");
  const numbers = [...html.matchAll(/<h2>(\d+)\./g)].map(match => Number(match[1]));
  assert.deepEqual(numbers, sections.map((_, index) => index + 1), `${name}: visible sections must be numbered 1..N`);
  assert(!numbers.some((number, index) => number !== index + 1), `${name}: skipped report number`);
}
const ownerNumberingReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-TRAVEL", value: "Машинаар" }, { questionId: "Q-MOVEMENT", value: "Бага" },
  { questionId: "Q-METHOD-PAST", value: ["Дасгал хөдөлгөөн"] }, { questionId: "Q-METHOD-DURATION", value: "1 жилээс урт" },
  { questionId: "Q-METHOD-RESULT", value: "Жин буурсан" }, { questionId: "Q-METHOD-REGAIN", value: "Хэсэгчлэн нэмэгдсэн" },
  { questionId: "Q-METHOD-BARRIERS", value: ["Цагийн хуваарь", "Зардал"] }
])));
const limitedReport = publicReport(buildFullReport(buildEvidence([{ questionId: "Q-MOVEMENT", value: "Бага" }])));
for (const [report, name] of [[ownerNumberingReport, "owner"], [multiFactorReport, "emotional"], [neutralReport, "neutral"], [pluralReport, "multi"], [limitedReport, "limited"]]) assertSequentialSections(report, name);
assert(!/heading:\s*["'`]\d+\./.test(require("node:fs").readFileSync(require.resolve("../app.js"), "utf8")), "stored section headings must not contain public numbers");
assert.equal(app.routeName("/choice"), "notFound");
app._test.resetComingSoon();

const visibleCopy = questions.QUESTIONS.flatMap(question => [question.section, question.text, ...(question.options || [])]).join("\n");
for (const exactQuestion of ["Тэр оролдлого яагаад зогссон бэ?", "Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", "Аргаа тогтвортой үргэлжлүүлэхэд юу хамгийн их саад болдог вэ?", "Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?"]) assert(visibleCopy.includes(exactQuestion), `neutral production question changed: ${exactQuestion}`);
assert(!/арга тасрах|арга тасарсан|арга тасарсны|төлөвлөгөө тасрах|дэглэм тасрах/i.test(visibleCopy), "active questions must preserve neutral stop/continue wording");
for (const phrase of ["Энгийн өдөр", "бодитоор өлссөн", "идэхээ барих", "хоол холдох", "хэмжээ барих", "бодит өдөр", "Delivery", "Snack", "challenge", "PCOS"]) {
  assert(!visibleCopy.includes(phrase), `forbidden question phrase: ${phrase}`);
}
console.log("question bank and navigation tests passed");
