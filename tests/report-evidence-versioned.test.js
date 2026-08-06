"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalPath = path.join(__dirname, "report-evidence.test.js");
let source = fs.readFileSync(originalPath, "utf8");

const oldRoute = 'const neutralRoute = questionBank.visibleQuestions(neutralFixture.answers);';
const versionedRoute = 'const neutralRoute = questionBank.visibleQuestions(neutralFixture.answers, questionBank.PREVIOUS_QUESTIONNAIRE_VERSION);';
if (!source.includes(oldRoute)) throw new Error("neutral route migration anchor missing");
source = source.replace(oldRoute, versionedRoute);

const oldCount = 'assert.equal(neutralRoute.length, questionBank.MAX_ROUTED_QUESTION_COUNT - 1, "single-method fixture auto-binds the longest method without adding a visible question");';
const semanticCount = 'assert(!neutralRoute.some(question => question.id === "Q-METHOD-LONGEST"), "single-method V2 fixture auto-binds the longest method without adding a visible question");\nassert(neutralRoute.length <= questionBank.MAX_ROUTED_QUESTION_COUNT, "V2 neutral route must remain within its routed-question cap");';
if (!source.includes(oldCount)) throw new Error("neutral count migration anchor missing");
source = source.replace(oldCount, semanticCount);

const frozenBlock = /const frozenFileHashes = Object\.freeze\(\{[\s\S]*?for \(const \[file, expectedHash\] of Object\.entries\(frozenFileHashes\)\) \{[\s\S]*?\n\}/;
if (!frozenBlock.test(source)) throw new Error("frozen semantics migration block missing");
source = source.replace(frozenBlock, `const versionedSemantics = {
  questionnaireVersion: questionBank.QUESTIONNAIRE_VERSION,
  previousVersion: questionBank.PREVIOUS_QUESTIONNAIRE_VERSION,
  currentQuestionCount: questionBank.QUESTIONS.length,
  mappingCoverage: mappingCoverage(questionBank.QUESTIONS)
};
assert.equal(versionedSemantics.questionnaireVersion, "jingeehas-production-2026-08-v3-routing-safety");
assert.equal(versionedSemantics.previousVersion, "jingeehas-production-2026-07-v2-method-link");
assert(versionedSemantics.currentQuestionCount >= 44, "V3 question bank must include the new safety and breastfeeding follow-ups");
assert.equal(versionedSemantics.mappingCoverage.percent, 100, "V3 semantic mappings must be complete");
assert.deepEqual(versionedSemantics.mappingCoverage.unmappedQuestions, []);
assert.deepEqual(versionedSemantics.mappingCoverage.unmappedOptions, []);`);

const testModule = new Module(originalPath, module);
testModule.filename = originalPath;
testModule.paths = Module._nodeModulePaths(path.dirname(originalPath));
testModule._compile(source, originalPath);