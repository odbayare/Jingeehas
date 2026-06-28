const assert = require("assert");
const fs = require("fs");

const source = fs.readFileSync("app.js", "utf8");

function functionBody(name) {
  const match = source.match(new RegExp(`function ${name}[^]*?\\n}`));
  assert(match, `missing function ${name}`);
  return match[0];
}

function run() {
  const renderInput = functionBody("renderInput");
  const renderDiaryInput = functionBody("renderDiaryInput");
  const setAnswerDraft = functionBody("setAnswerDraft");
  const setDiaryDraftValue = functionBody("setDiaryDraftValue");
  const setStageSummaryText = functionBody("setStageSummaryText");
  const setDailySummaryText = functionBody("setDailySummaryText");

  assert(renderInput.includes("oninput=\"setAnswerDraft"), "stage text/number inputs should use draft-only input handler");
  assert(!renderInput.includes("type=\"number\" value=\"${escapeAttr(value)}\" oninput=\"${setterName}"), "numeric input should not call full setter on each keystroke");
  assert(!renderInput.includes("<textarea oninput=\"${setterName}"), "stage textarea should not call full setter on each keystroke");

  assert(renderDiaryInput.includes("oninput=\"setDiaryDraftValue"), "diary text inputs should use draft-only input handler");
  assert(!renderDiaryInput.includes("textarea oninput=\"setDiaryValue"), "diary textarea should not call render-triggering setter on each keystroke");

  assert(!setAnswerDraft.includes("render();"), "stage draft input handler must not render");
  assert(!setDiaryDraftValue.includes("render();"), "diary draft input handler must not render");
  assert(!setStageSummaryText.includes("render();"), "stage summary typing must not render");
  assert(!setDailySummaryText.includes("render();"), "daily summary typing must not render");

  assert(renderInput.includes("id=\"input-${question.id}\""), "stage inputs should have stable ids");
  assert(renderDiaryInput.includes("id=\"input-${question.id}\""), "diary text inputs should have stable ids");
}

run();
console.log("input-focus tests passed");
