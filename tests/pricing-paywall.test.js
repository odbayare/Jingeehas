const assert = require("assert");
const app = require("../app.js");
const { _internal } = app;

_internal.setTestState({ packageType: "one-time", view: "choice", oneTimePaid: false, stageAnswers: {} });
const choice = _internal.renderChoice();
assert(choice.includes("9,900₮"), "one-time price must remain visible");
assert(choice.includes("Нэг удаагийн"), "one-time product must remain selectable");
assert(!choice.includes("[REMOVED_FEATURE_PRICE]"));
assert(!choice.includes("[REMOVED_FEATURE_ANCHOR]"));
assert(!choice.includes("[REMOVED_FEATURE_UPGRADE]"));

_internal.setTestState({ packageType: "one-time", view: "report", oneTimePaid: false, stageAnswers: {} });
assert(_internal.renderReport().includes("9,900₮"), "unpaid report must retain one-time paywall");
_internal.demoCompletePayment("one-time");
assert.strictEqual(_internal.getTestState().oneTimePaid, true);
assert(!_internal.renderReport().includes("Бүрэн тайлан нээх 9,900₮"));
console.log("pricing and paywall tests passed");
