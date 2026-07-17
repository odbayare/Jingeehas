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
assert(landing.includes("Илүүдэл жин үүсгэж буй сэтгэлзүйн шалтгаанаа илрүүл."));
assert(landing.includes("Ямар далд зуршлууд илүүдэл жин үүсэхэд нөлөөлж буйг тайлж мэд."));
assert(landing.includes("Жин хасахад тань тохирох дөт хэв маяг, дасгал сургуулилтын чиглэлээ мэдэж ав."));
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
assert(renderedReport.includes("Хэв маяг бүрд тохирох өөрчлөлтийн чиглэл"));
assert(!/Q-[A-Z]|S1-|MC-/.test(renderedReport));
for (const phrase of ["шилжилтийн саад", "Зангуу", "Доод хувилбар", "Зардлын зааг", "Биеийн дурдсан нөхцөл"]) assert(!renderedReport.includes(phrase), `forbidden report copy: ${phrase}`);

const pluralReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-EMOTION", value: "Нэлээд нэмэгддэг" },
  { questionId: "Q-METHOD-BARRIERS", value: ["Стресс ба сэтгэл хөдлөл", "Өлсөх эсвэл цадах мэдрэмж"] },
  { questionId: "Q-MEAL-RHYTHM", value: "5 цагаас урт" },
  { questionId: "Q-HUNGER", value: "Хэт өлссөний дараа анзаардаг" }
])));
app._test.setState({ ownerPreview: true, report: { fullReport: pluralReport } });
const renderedPluralReport = app.renderForPath("/report");
assert(renderedPluralReport.includes("Жин хасалтад нөлөөлж буй гол хэв маягууд"));
assert.equal(app.routeName("/choice"), "notFound");
app._test.resetComingSoon();

const visibleCopy = questions.QUESTIONS.flatMap(question => [question.section, question.text, ...(question.options || [])]).join("\n");
for (const phrase of ["Энгийн өдөр", "бодитоор өлссөн", "идэхээ барих", "хоол холдох", "хэмжээ барих", "бодит өдөр", "Delivery", "Snack", "challenge", "PCOS"]) {
  assert(!visibleCopy.includes(phrase), `forbidden question phrase: ${phrase}`);
}
console.log("question bank and navigation tests passed");
