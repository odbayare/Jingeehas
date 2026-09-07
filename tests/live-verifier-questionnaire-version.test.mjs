import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { questionnaireVersionIsCurrent, resolveCurrentQuestionnaireVersion } from "../tools/questionnaire-version.mjs";

const legacy = `const QUESTIONNAIRE_VERSION = "jingeehas-production-2026-08-v4-household-context";`;
assert.equal(resolveCurrentQuestionnaireVersion(legacy), "jingeehas-production-2026-08-v4-household-context");

const aliased = `
const HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION = "jingeehas-production-2026-08-v4-household-context";
const BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION = "jingeehas-production-2026-09-v5-body-functional-context";
const CURRENT_QUESTIONNAIRE_VERSION = BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;
const QUESTIONNAIRE_VERSION = HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION;
`;
assert.equal(resolveCurrentQuestionnaireVersion(aliased), "jingeehas-production-2026-09-v5-body-functional-context");
assert(questionnaireVersionIsCurrent(aliased, "jingeehas-production-2026-09-v5-body-functional-context"));
assert(!questionnaireVersionIsCurrent(aliased, "jingeehas-production-2026-08-v4-household-context"));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const currentQuestions = fs.readFileSync(path.join(root, "questions.js"), "utf8");
assert.equal(resolveCurrentQuestionnaireVersion(currentQuestions), "jingeehas-production-2026-09-v5-body-functional-context");

console.log("live-verifier-questionnaire-version.test.mjs PASS");
