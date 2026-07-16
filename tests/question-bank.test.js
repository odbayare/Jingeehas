"use strict";
const assert = require("node:assert/strict");
const questions = require("../questions.js");
const app = require("../app.js");

assert.equal(questions.questionById("Q-FOOD-FEELING").section, "Хооллосны дараах мэдрэмж ба цадалт");
assert.equal(questions.questionById("S1-S03").text, "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?");
assert.equal(questions.validateAnswer(questions.questionById("Q-AGE"), 17), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-HEIGHT"), "abc"), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-WEIGHT"), 0), "Зөв тоон утга оруулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-MEAL-RHYTHM"), ""), "Энэ асуултад хариулна уу.");
assert.equal(questions.validateAnswer(questions.questionById("Q-TARGET"), ""), "");
assert(questions.QUESTIONS.filter(question => question.sensitive).every(question => question.options.includes("Хариулахгүй")));
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
assert.equal(app.routeName("/choice"), "notFound");
app._test.resetComingSoon();

const visibleCopy = questions.QUESTIONS.flatMap(question => [question.section, question.text, ...(question.options || [])]).join("\n");
for (const phrase of ["Энгийн өдөр", "бодитоор өлссөн", "идэхээ барих", "хоол холдох", "хэмжээ барих", "бодит өдөр", "Delivery", "Snack", "challenge", "PCOS"]) {
  assert(!visibleCopy.includes(phrase), `forbidden question phrase: ${phrase}`);
}
console.log("question bank and navigation tests passed");
