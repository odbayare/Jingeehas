import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const app = require(path.join(root, "app.js"));
const I = app._internal;
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const roles = new Set(["PUBLIC_USER", "PAID_USER", "SEVEN_DAY_USER", "ADVISOR", "ADMIN", "INTERNAL_TESTER"]);

const baseState = {
  packageType: "one-time", view: "landing", oneTimePaid: false, sevenDayPaid: false,
  upgradePaid: false, stageAnswers: {}, preliminary: [], diaryEntries: [], stageVoiceSummaries: {},
  contactCapture: { name: "", phone: "", email: "", saved: false, message: "", copyStatus: "" },
  lead: { name: "", phone: "", email: "", message: "" }
};
const normalAnswers = { "S1-C02": "Эрэгтэй", "S1-L01": "Бараг өдөр бүр", "S1-L03": ["Цаг"], "S1-S04": "Үгүй" };
const urgentAnswers = { "S1-C02": "Эмэгтэй", "S1-S04": "Одоо идэвхтэй бодогдож байна" };
const professionalAnswers = { "S1-C02": "Эмэгтэй", "S1-B03": "Тийм", "S1-S04": "Үгүй" };
const diaryEntry = day => ({ day_number: day, meal_rhythm: "Тогтвортой, хоол алгасаагүй", unplanned_eating_count: "Үгүй", stress_score: 3, energy_score: 6, sleep: ["6-8 цаг"], movement: "Бага зэрэг алхсан", body_signals: ["Аль нь ч үгүй"], pattern_probes: {} });

const scenarios = [];
function scenario(id, surface, role, renderSource, state, render, coverage = "YES", notes = "") {
  scenarios.push({ id, surface, role, render_source: renderSource, state, render, coverage, notes });
}
scenario("coming-soon", "COMING_SOON", "PUBLIC_USER", "renderComingSoon", baseState, () => I.renderComingSoon());
scenario("landing", "LANDING", "PUBLIC_USER", "renderLanding", baseState, () => I.renderLanding());
scenario("about", "ABOUT", "PUBLIC_USER", "renderAbout", baseState, () => I.renderAbout());
scenario("choice", "CHOICE", "PUBLIC_USER", "renderChoice", baseState, () => I.renderChoice());
scenario("one-time-start", "ONE_TIME_START", "PUBLIC_USER", "renderOneTimeStart", baseState, () => I.renderOneTimeStart());
scenario("one-time-unpaid", "ONE_TIME_PAYWALL", "PUBLIC_USER", "renderReport", { ...baseState, stageAnswers: normalAnswers }, () => I.renderReport());
scenario("one-time-paid", "ONE_TIME_REPORT", "PAID_USER", "renderReport", { ...baseState, oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderReport());
scenario("seven-day-paywall", "SEVEN_DAY_PAYWALL", "PUBLIC_USER", "renderSevenDayPaywall", { ...baseState, packageType: "seven-day" }, () => I.renderSevenDayPaywall());
scenario("seven-day-start", "SEVEN_DAY_START", "SEVEN_DAY_USER", "renderSevenDayStart", { ...baseState, packageType: "seven-day", sevenDayPaid: true }, () => I.renderSevenDayStart());
scenario("diary-zero", "DIARY_HOME", "SEVEN_DAY_USER", "renderDiary", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [] }, () => I.renderDiary());
scenario("diary-partial", "DIARY_HOME", "SEVEN_DAY_USER", "renderDiary", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [diaryEntry(1), diaryEntry(2)] }, () => I.renderDiary());
scenario("diary-single", "DIARY_QUESTION", "SEVEN_DAY_USER", "renderDiary", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryIndex: 0, diaryDraft: {} }, () => I.renderDiary());
scenario("diary-multi", "DIARY_QUESTION", "SEVEN_DAY_USER", "dailyCore -> renderDiary", baseState, () => questionHtml(app.dailyCore.filter(q => q.type === "multi")), "YES");
scenario("diary-scale", "DIARY_QUESTION", "SEVEN_DAY_USER", "dailyCore -> renderDiary", baseState, () => questionHtml(app.dailyCore.filter(q => q.type === "scale")), "YES");
scenario("diary-text", "DIARY_QUESTION", "SEVEN_DAY_USER", "dailyCore -> renderDiary", baseState, () => questionHtml(app.dailyCore.filter(q => q.type === "text")), "YES");
scenario("diary-confirmation", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "renderDiary", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryIndex: Math.max(0, app.dailyCore.length - 1), diaryDraft: {} }, () => I.renderDiary(), "PARTIAL", "Confirmation depends on interactive completion; static render path captured.");
scenario("insufficient-report", "INSUFFICIENT_REPORT", "SEVEN_DAY_USER", "renderReport", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [diaryEntry(1)] }, () => I.renderReport());
scenario("limited-report", "LIMITED_REPORT", "SEVEN_DAY_USER", "renderReport", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3].map(diaryEntry) }, () => I.renderReport());
scenario("usable-limited-report", "LIMITED_REPORT", "SEVEN_DAY_USER", "renderReport", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3,4].map(diaryEntry) }, () => I.renderReport());
scenario("full-seven-day-report", "FULL_SEVEN_DAY_REPORT", "SEVEN_DAY_USER", "renderReport", { ...baseState, packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3,4,5].map(diaryEntry) }, () => I.renderReport());
scenario("upgrade-offer", "UPGRADE_OFFER", "PAID_USER", "renderReport", { ...baseState, oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderReport(), "PARTIAL", "Offer is conditional; paid report scenario captured.");
scenario("upgrade-paywall", "UPGRADE_PAYWALL", "PAID_USER", "renderUpgradePaywall", { ...baseState, oneTimePaid: true }, () => I.renderUpgradePaywall());
scenario("lead-capture", "LEAD_CAPTURE", "PUBLIC_USER", "renderLeadCapture", baseState, () => I.renderLeadCapture());
scenario("lead-thank-you", "LEAD_THANK_YOU", "PUBLIC_USER", "renderLeadThankYou", { ...baseState, lead: { name: "Test", phone: "00000000", email: "", message: "" } }, () => I.renderLeadThankYou());
scenario("general-safety", "GENERAL_SAFETY", "PUBLIC_USER", "renderOneTimeStart", baseState, () => I.renderOneTimeStart());
scenario("professional-safety", "PROFESSIONAL_SAFETY", "PAID_USER", "renderReport", { ...baseState, oneTimePaid: true, stageAnswers: professionalAnswers }, () => I.renderReport());
scenario("urgent-mode-4", "URGENT_SAFETY", "PUBLIC_USER", "renderReport", { ...baseState, stageAnswers: urgentAnswers }, () => I.renderReport());
scenario("advisor-login", "ADVISOR_PORTAL", "ADVISOR", "renderCoachLogin", baseState, () => I.renderCoachLogin());
scenario("advisor-dashboard", "ADVISOR_PORTAL", "ADVISOR", "renderCoachDashboard", baseState, () => I.renderCoachDashboard(), "PARTIAL", "Dashboard state is available; populated remote clients are not created.");
scenario("admin-portal", "ADMIN_PORTAL", "ADMIN", "renderAdminCoach", baseState, () => I.renderAdminCoach());
scenario("internal-tester-feedback", "OTHER_PROVEN_RENDERED", "INTERNAL_TESTER", "renderInternalTesterFeedbackSurvey", { ...baseState, oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderInternalTesterFeedbackSurvey(), "PARTIAL", "Renderer is gated by browser-only internal-test mode and returns no content in the Node extraction runtime.");
scenario("payment-contact", "PAYMENT", "PUBLIC_USER", "renderContactCaptureForm", baseState, () => I.renderContactCaptureForm());
scenario("qpay-invoice", "QPAY", "PUBLIC_USER", "renderOneTimeStart", baseState, () => I.renderOneTimeStart(), "PARTIAL", "No production invoice call; pre-invoice payment surface only.");
scenario("qpay-pending", "QPAY", "PUBLIC_USER", "renderOneTimeStart", { ...baseState, paymentStatus: "pending" }, () => I.renderOneTimeStart(), "PARTIAL", "Mock state does not expose a standalone pending renderer.");
scenario("qpay-paid", "QPAY", "PAID_USER", "renderReport", { ...baseState, oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderReport(), "PARTIAL", "Paid entitlement is mocked; no real invoice created.");
scenario("payment-error", "VISIBLE_ERROR", "PUBLIC_USER", "renderOneTimeStart", { ...baseState, paymentError: "" }, () => I.renderOneTimeStart(), "PARTIAL", "No new visible error text injected; static error container path only.");
scenario("sample-report", "SAMPLE_REPORT", "PUBLIC_USER", "renderChoice", baseState, () => I.renderChoice(), "PARTIAL", "Choice surface contains sample preview entry point; internal preview renderer is not exported.");
scenario("question-bank", "QUESTION_BANK", "PUBLIC_USER", "stageOneQuestions -> renderStageOne", baseState, () => questionHtml(app.stageOneQuestions));
scenario("answer-options", "ANSWER_OPTIONS", "PUBLIC_USER", "stageOneQuestions/dailyCore -> renderInput", baseState, () => optionHtml([...app.stageOneQuestions, ...app.dailyCore, ...app.dailyMenstrual]));
scenario("accessibility", "ACCESSIBILITY", "PUBLIC_USER", "rendered aria-label/placeholder extraction", baseState, () => [I.renderLanding(), I.renderOneTimeStart(), I.renderContactCaptureForm()].join("\n"), "PARTIAL", "Covers exported static renderers; browser-only post-interaction DOM is unavailable.");

function questionHtml(questions) { return questions.map(q => `<h3>${escapeText(q.text || "")}</h3>`).join("\n"); }
function optionHtml(questions) { return questions.flatMap(q => q.options || []).map(x => `<span>${escapeText(x)}</span>`).join("\n"); }
function escapeText(x) { return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function decode(x) { return x.replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'"); }
function extractHtml(html) {
  const out = [];
  const source = String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  for (const m of source.matchAll(/(?:placeholder|aria-label|alt|title)\s*=\s*(["'])(.*?)\1/gi)) {
    const text = decode(m[2]).trim(); if (text && !/^(https?:|data:)/i.test(text)) out.push(text);
  }
  for (const part of source.split(/<[^>]+>/g)) {
    const text = decode(part).replace(/\s+/g," ").trim();
    if (text && !/^https?:\/\//i.test(text) && !/^\$\{/.test(text)) out.push(text);
  }
  return out;
}

const renderedEntries = [];
const scenarioResults = [];
for (const s of scenarios) {
  if (!roles.has(s.role)) throw new Error(`invalid role ${s.role}`);
  try {
    I.setTestState(s.state);
    const texts = extractHtml(s.render());
    scenarioResults.push({ id: s.id, surface: s.surface, role: s.role, render_source: s.render_source, coverage: s.coverage, notes: s.notes, extracted_entry_count: texts.length });
    texts.forEach(text => renderedEntries.push({ text, surface: s.surface, role: s.role, scenario: s.id, render_source: s.render_source, source_locations: [], source_mapping_status: "NOT_MAPPED_NO_GUESS", dynamic: /\$\{/.test(text) }));
  } catch (error) {
    scenarioResults.push({ id: s.id, surface: s.surface, role: s.role, render_source: s.render_source, coverage: "NO_NOT_IMPLEMENTED", notes: String(error.message), extracted_entry_count: 0 });
  }
}

const uniqueRendered = new Map();
for (const e of renderedEntries) {
  const key = `${e.text}\u0000${e.surface}\u0000${e.role}`;
  const existing = uniqueRendered.get(key);
  if (existing) { existing.scenarios = [...new Set([...existing.scenarios, e.scenario])]; existing.occurrences++; }
  else uniqueRendered.set(key, { ...e, scenarios: [e.scenario], occurrences: 1 });
}
const entries = [...uniqueRendered.values()];
const textCounts = new Map();
for (const e of renderedEntries) textCounts.set(e.text, (textCounts.get(e.text) || 0) + 1);
const duplicateTexts = [...textCounts].filter(([,count]) => count > 1).sort((a,b) => a[0].localeCompare(b[0]));
const dupIds = new Map(duplicateTexts.map(([text],i) => [text, `DUP-${String(i+1).padStart(4,"0")}`]));

function category(e) {
  if (e.surface === "URGENT_SAFETY" || e.surface === "PROFESSIONAL_SAFETY" || e.surface === "GENERAL_SAFETY") return "SAFETY_CRITICAL";
  if (["PAYMENT","QPAY","ONE_TIME_PAYWALL","SEVEN_DAY_PAYWALL","UPGRADE_PAYWALL"].includes(e.surface)) return "PAYMENT_CRITICAL";
  if (e.surface === "QUESTION_BANK" || e.surface === "ANSWER_OPTIONS" || e.surface === "DIARY_QUESTION") return "QUESTION_WORDING";
  if (e.surface === "ACCESSIBILITY") return "ACCESSIBILITY_COPY";
  if (e.role === "ADMIN" || e.role === "ADVISOR") return "ADMIN_OR_ADVISOR_TERM";
  if (/\b[A-Za-z][A-Za-z-]*\b/.test(e.text) && !/^(QPay|PDF)$/.test(e.text)) return "MIXED_LANGUAGE";
  if (e.surface.includes("REPORT")) return "REPORT_WORDING";
  return "NO_LANGUAGE_ISSUE_OBSERVED";
}
function md(x) { return String(x).replace(/\|/g,"\\|").replace(/\r?\n/g," "); }
let catalog = "# Mongolian Copy Review Catalog\n\nRender-backed, role-facing strings only. No wording is approved or proposed here. Source locations remain empty where exact static mapping is unavailable; render proof is never guessed.\n\n| ID | Exact current text | Source file | Source line | Source function/object | Rendered surface | Role | Render proof | Dynamic variables | Duplicate group | Review category |\n| -- | ------------------ | ----------- | ----------: | ---------------------- | ---------------- | ---- | ------------ | ----------------- | --------------- | --------------- |\n";
entries.forEach((e,i) => catalog += `| COPY-${String(i+1).padStart(4,"0")} | ${md(e.text)} | app.js |  | ${md(e.render_source)} | ${e.surface} | ${e.role} | ${md(e.render_source)} via ${md(e.scenarios.join(", "))} | None observed in rendered output | ${dupIds.get(e.text) || ""} | ${category(e)} |\n`);
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_REVIEW_CATALOG.md"), catalog);

let dup = "# Mongolian Copy Duplicate Index\n\nExact-text duplicates only; no semantic merging.\n\n| Duplicate group | Exact text | Occurrence count | Surfaces | Source locations |\n| --------------- | ---------- | ---------------: | -------- | ---------------- |\n";
duplicateTexts.forEach(([text,count]) => { const es=renderedEntries.filter(e=>e.text===text); dup += `| ${dupIds.get(text)} | ${md(text)} | ${count} | ${[...new Set(es.map(e=>e.surface))].join(", ")} | source mapping unavailable |\n`; });
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_DUPLICATE_INDEX.md"), dup);

const literals = [...source.matchAll(/(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g)].map(m => ({ text:m[2].replace(/\\n/g," ").replace(/\s+/g," ").trim(), line:source.slice(0,m.index).split("\n").length }));
function rawClass(x) {
  if (/^https?:\/\//.test(x)) return "API_OR_URL";
  if (/^(\.\.?\/|node:|[\w/-]+\.(js|json|html|css))/.test(x)) return "CODE_OR_MODULE_REFERENCE";
  if (/^(WEIGHT_|QPAY_|S1-|D-|COPY-|[a-z][a-z0-9_]+)$/.test(x)) return "INTERNAL_IDENTIFIER";
  if (/localStorage|weight_test_|storage/i.test(x)) return "DATABASE_OR_STORAGE";
  if (/event|funnel|analytics|view_|click_/i.test(x) && !/[А-Яа-яӨөҮү]/.test(x)) return "ANALYTICS_OR_EVENT";
  if (/\$\{/.test(x)) return "DYNAMIC_TEMPLATE_FRAGMENT";
  if (app.stageOneQuestions.some(q=>q.text===x || (q.options||[]).includes(x)) || app.dailyCore.some(q=>q.text===x || (q.options||[]).includes(x))) return "QUESTION_OR_OPTION";
  if (renderedEntries.some(e=>e.text===x)) return "RENDERED_USER_VISIBLE";
  return "UNKNOWN_REQUIRES_TRACE";
}
const rawRows=literals.filter(x=>x.text).map(x=>({...x,classification:rawClass(x.text)}));
let raw="# Mongolian Copy Raw Literal Inventory\n\nThis is a raw source-literal inventory. It is not a user-visible copy catalog and must not be used directly for language approval.\n\n| ID | Exact source literal | Source | Classification |\n| -- | -------------------- | ------ | -------------- |\n";
rawRows.forEach((r,i)=>raw+=`| RAW-${String(i+1).padStart(4,"0")} | ${md(r.text)} | app.js:${r.line} | ${r.classification} |\n`);
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md"),raw);

const excludedClasses=new Set(["API_OR_URL","ANALYTICS_OR_EVENT","DATABASE_OR_STORAGE","INTERNAL_IDENTIFIER","CODE_OR_MODULE_REFERENCE","UNKNOWN_REQUIRES_TRACE"]);
const excluded=rawRows.filter(r=>excludedClasses.has(r.classification));
const groups=[
  ["API and URLs","API_OR_URL"],["analytics events","ANALYTICS_OR_EVENT"],["internal keys","INTERNAL_IDENTIFIER"],
  ["storage keys","DATABASE_OR_STORAGE"],["source paths and module imports","CODE_OR_MODULE_REFERENCE"],
  ["test fixtures","TEST_ONLY"],["documentation","DOCUMENTATION_ONLY"],["untraced internal candidates","UNKNOWN_REQUIRES_TRACE"]
];
let excludedMd="# Mongolian Copy Excluded Internal Strings\n\nThese raw literals are excluded from the review catalog because render visibility was not proven. Unknown items remain auditable rather than being mislabeled as user-visible copy.\n";
for(const [label,cls] of groups){const xs=rawRows.filter(r=>r.classification===cls);excludedMd+=`\n## ${label}\n\n- Count: ${xs.length}\n- Reason excluded: ${cls === "UNKNOWN_REQUIRES_TRACE" ? "No render path was proven." : `Classified as ${cls}, not application-owned rendered copy.`}\n- Representative examples: ${xs.slice(0,8).map(x=>`\`${x.text.replace(/`/g,"'")}\``).join(", ") || "None found in app.js raw extraction."}\n`;}
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md"),excludedMd);

let coverage="# Mongolian Copy Surface Coverage\n\nAny PARTIAL or NO status means total render coverage is not complete.\n\n| Surface | Render function or source | Scenario implemented | Extracted entry count | Covered | Notes |\n| ------- | ------------------------- | -------------------- | --------------------: | ------- | ----- |\n";
scenarioResults.forEach(s=>coverage+=`| ${s.surface} | ${md(s.render_source)} | ${s.id} | ${s.extracted_entry_count} | ${s.coverage} | ${md(s.notes)} |\n`);
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_SURFACE_COVERAGE.md"),coverage);

fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/mongolian-rendered-copy.json"),JSON.stringify({generated_from_commit:commit,scenarios:scenarioResults,entries},null,2)+"\n");
const stats={raw_literal_count:rawRows.length,review_entry_count:entries.length,excluded_internal_count:excluded.length,duplicate_occurrence_count:[...textCounts.values()].reduce((n,c)=>n+Math.max(0,c-1),0),duplicate_group_count:duplicateTexts.length,partial_or_missing:scenarioResults.filter(s=>s.coverage!=="YES").map(s=>s.id),question_count:app.stageOneQuestions.length+app.dailyCore.length+app.dailyMenstrual.length,answer_option_count:[...app.stageOneQuestions,...app.dailyCore,...app.dailyMenstrual].reduce((n,q)=>n+(q.options||[]).length,0)};
fs.writeFileSync(path.join(root,"artifacts/mongolian-copy-stats.json"),JSON.stringify(stats,null,2)+"\n");
console.log(JSON.stringify(stats,null,2));
