"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalPath = path.join(__dirname, "question-bank.test.js");
let source = fs.readFileSync(originalPath, "utf8");

const requireAnchor = 'const questions = require("../questions.js");';
const v4Materialized = `${requireAnchor}\nconst v4Questions = questions.QUESTIONS\n  .map(question => questions.questionById(question.id, questions.QUESTIONNAIRE_VERSION))\n  .filter(Boolean);`;
if (!source.includes(requireAnchor)) throw new Error("question-bank module anchor missing");
source = source.replace(requireAnchor, v4Materialized);
source = source.replaceAll("questions.QUESTIONS", "v4Questions");
// Restore the initialization expression itself after the global replacement.
source = source.replace("const v4Questions = v4Questions", "const v4Questions = questions.QUESTIONS");

const oldAssertion = 'assert.equal(questions.questionById("S1-S03").text, "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?");';
const versionedAssertions = `assert.equal(
  questions.questionById("S1-S03", questions.QUESTIONNAIRE_VERSION).text,
  "Сүүлийн 28 хоногт идсэнээ нөхөх эсвэл жин нэмэхээс сэргийлэх зорилгоор зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол байсан уу?"
);
assert.equal(
  questions.questionById("S1-S03", questions.PREVIOUS_QUESTIONNAIRE_VERSION).text,
  "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?"
);
assert.equal(
  questions.questionById("S1-S04", questions.QUESTIONNAIRE_VERSION).text,
  "Сүүлийн 2 долоо хоногт өөртөө хор хүргэх эсвэл амьдрахгүй байсан нь дээр мэт бодол төрсөн үү?"
);
assert.equal(
  questions.questionById("S1-S04", questions.PREVIOUS_QUESTIONNAIRE_VERSION).text,
  "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?"
);`;
if (!source.includes(oldAssertion)) throw new Error("question-bank safety-copy migration anchor missing");
source = source.replace(oldAssertion, versionedAssertions);

const oldVisibleCopyAssertion = 'for (const exactQuestion of ["Тэр оролдлого яагаад зогссон бэ?", "Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", "Аргаа тогтвортой үргэлжлүүлэхэд юу хамгийн их саад болдог вэ?", "Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?"]) assert(visibleCopy.includes(exactQuestion), `neutral production question changed: ${exactQuestion}`);';
const v4VisibleCopyAssertion = 'for (const exactQuestion of ["Тэр оролдлого яагаад зогссон бэ?", "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?", "Аргаа тогтвортой үргэлжлүүлэхэд юу хамгийн их саад болдог вэ?", "Өмнөх оролдлогоосоо та юу ойлгож авсан бэ?"]) assert(visibleCopy.includes(exactQuestion), `V4 production question changed: ${exactQuestion}`);';
if (!source.includes(oldVisibleCopyAssertion)) throw new Error("question-bank visible-copy migration anchor missing");
source = source.replace(oldVisibleCopyAssertion, v4VisibleCopyAssertion);

const testModule = new Module(originalPath, module);
testModule.filename = originalPath;
testModule.paths = Module._nodeModulePaths(path.dirname(originalPath));
testModule._compile(source, originalPath);
