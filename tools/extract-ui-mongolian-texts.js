const fs = require("fs");
const app = require("../app.js");

const { _internal, allQuestionObjects } = app;

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\n\s*\n+/g, "\n")
    .split(/\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function cleanLine(value) {
  return String(value || "").replace(/[\r\n|]+/g, " ").replace(/\s+/g, " ").trim();
}

function section(title, lines) {
  return [
    `## ${title}`,
    "",
    ...unique(lines).map(line => `- ${cleanLine(line)}`),
    ""
  ].join("\n");
}

function setState(nextState) {
  _internal.setTestState(nextState);
}

const rendered = [];
function addRendered(name, renderFn) {
  try {
    rendered.push(`### ${name}`, "", ...stripHtml(renderFn()).map(line => `- ${cleanLine(line)}`), "");
  } catch (error) {
    rendered.push(`### ${name}`, "", `- ERROR: ${error.message}`, "");
  }
}

addRendered("Landing", _internal.renderLanding);
addRendered("About", _internal.renderAbout);
addRendered("Choice", _internal.renderChoice);

setState({
  packageType: "seven-day",
  view: "sevenDayStart",
  sevenDayPaid: false,
  upgradePaid: false,
  preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
  stageAnswers: {},
  diaryEntries: []
});
addRendered("7-Day Paywall", _internal.renderSevenDayStart);

setState({
  packageType: "seven-day",
  view: "sevenDayStart",
  sevenDayPaid: true,
  upgradePaid: false,
  preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
  stageAnswers: {},
  diaryEntries: []
});
addRendered("7-Day Start Unlocked", _internal.renderSevenDayStart);

setState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: false,
  stageAnswers: {
    "S1-L01": "Бараг өдөр бүр",
    "S1-L02": ["Хоол захиалах", "Ойр байсан snack"],
    "S1-L03": ["Цаг", "Ядаргаа"]
  },
  preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
  diaryEntries: []
});
addRendered("One-Time Paywall", _internal.renderReport);

_internal.startLeadCapture("one-time");
addRendered("Lead Capture", _internal.renderLeadCapture);
_internal.updateLeadField("contact", "test@example.com");
_internal.submitLeadCapture();
addRendered("Lead Thank You", _internal.renderLeadThankYou);
addRendered("Validation Summary", _internal.renderValidationSummary);

setState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: true,
  stageAnswers: {
    "S1-L01": "Бараг өдөр бүр",
    "S1-L02": ["Хоол захиалах", "Ойр байсан snack"],
    "S1-L03": ["Цаг", "Ядаргаа"]
  },
  preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
  diaryEntries: []
});
addRendered("One-Time Full Report", _internal.renderReport);

setState({
  packageType: "seven-day",
  view: "report",
  sevenDayPaid: true,
  diaryEntries: [],
  preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
  stageAnswers: {}
});
addRendered("7-Day Insufficient Report", _internal.renderReport);

setState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: false,
  stageAnswers: { "S1-B03": "Тийм" },
  diaryEntries: []
});
addRendered("Mode 3 Professional", _internal.renderReport);

setState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: false,
  stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
  diaryEntries: []
});
addRendered("Mode 4 Urgent", _internal.renderReport);

const stageQuestions = [];
const dailyQuestions = [];
const probeQuestions = [];
for (const question of allQuestionObjects()) {
  const block = [`**${question.id}** ${question.text}`];
  if (question.options?.length) {
    block.push(...question.options.map(option => `  - ${option}`));
  }
  const text = block.join("\n");
  if (question.id.startsWith("S1-")) stageQuestions.push(text);
  else if (question.id.startsWith("D-P")) probeQuestions.push(text);
  else dailyQuestions.push(text);
}

const source = fs.readFileSync("app.js", "utf8");
const sourceStrings = [...source.matchAll(/(["'`])((?:\\.|(?!\1)[\s\S])*?[\u0400-\u04FF][\s\S]*?)\1/g)]
  .map(match => match[2])
  .map(value => value
    .replace(/\$\{[^}]+}/g, "${...}")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim())
  .filter(value => value.length > 1 && !value.includes("function") && !value.includes("=>"));

const markdown = [
  "# UI дээр гарах Монгол текстүүд",
  "",
  `Generated from \`app.js\` on ${new Date().toISOString().slice(0, 10)}.`,
  "",
  "> Тайлбар: Энэ файл нь UI-д харагдах Монгол copy-г screen render, question bank, option list, report/paywall/safety/lead capture copy, мөн `app.js` доторх Монгол string literal-уудаас нэгтгэсэн inventory юм.",
  "",
  "## Rendered Screen Text",
  "",
  ...rendered,
  section("One-Time / Stage Questions And Options", stageQuestions),
  section("Daily Diary Questions And Options", dailyQuestions),
  section("Pattern Probe Questions And Options", probeQuestions),
  section("All Mongolian String Literals From app.js", unique(sourceStrings).sort((a, b) => a.localeCompare(b, "mn")))
].join("\n");

fs.writeFileSync("UI_MONGOLIAN_TEXTS.md", markdown);
console.log(`Wrote UI_MONGOLIAN_TEXTS.md (${markdown.split(/\n/).length} lines)`);
