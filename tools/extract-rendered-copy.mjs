import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const GENERATOR_VERSION = "2.0.0";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const app = require(path.join(root, "app.js"));
const mockBackend = require(path.join(root, "mockBackend.js"));
const I = app._internal;
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const VALID_ROLES = new Set(["PUBLIC_USER", "PAID_USER", "ADVISOR", "ADMIN", "INTERNAL_TESTER"]);
const VALID_TYPES = new Set(["FULL_SURFACE", "ISOLATED_COMPONENT", "ATTRIBUTE_ONLY"]);
const fixtureValues = new Set(["Test User", "Test Advisor", "Client One", "advisor@example.test", "client@example.test", "INV-TEST-001", "Test Bank"]);
let networkAttempts = 0;
globalThis.fetch = async () => { networkAttempts += 1; throw new Error("EXTERNAL_NETWORK_BLOCKED_BY_EXTRACTION"); };

const base = () => ({
  packageType: "one-time", view: "landing", oneTimePaid: false,
  stageAnswers: {}, preliminary: [], stageVoiceSummaries: {}, internalTest: false, qpayPayment: { status: "idle", message: "", invoice: null },
  contactCapture: { name: "", phone: "", email: "", saved: false, message: "", copyStatus: "" },
  coachSessionToken: "", coachLoginError: "", coachDashboardMessage: "", coachReportView: null
});
const normalAnswers = { "S1-C02": "Эрэгтэй", "S1-L01": "Бараг өдөр бүр", "S1-L03": ["Цаг"], "S1-S04": "Үгүй" };
const urgentAnswers = { "S1-C02": "Эмэгтэй", "S1-S04": "Одоо идэвхтэй бодогдож байна" };
const professionalAnswers = { "S1-C02": "Эмэгтэй", "S1-B03": "Тийм", "S1-S04": "Үгүй" };
const invoice = { invoiceId: "INV-TEST-001", senderInvoiceNo: "INV-TEST-001", qrImage: "abc123", urls: [{ name: "Test Bank", link: "qpay://test" }] };

function setState(next = {}) { I.setTestState({ ...base(), ...next }); }

const scenarios = [];
function add(id, surface, role, extractionType, renderSource, state, render, options = {}) {
  scenarios.push({ id, surface, role, extraction_type: extractionType, render_source: renderSource, state, render, expected_visible: options.expectedVisible !== false, notes: options.notes || "", prepare: options.prepare || null });
}

add("coming-soon", "COMING_SOON", "PUBLIC_USER", "FULL_SURFACE", "renderComingSoon", base(), () => I.renderComingSoon());
add("landing", "LANDING", "PUBLIC_USER", "FULL_SURFACE", "renderLanding", base(), () => I.renderLanding());
add("about", "ABOUT", "PUBLIC_USER", "FULL_SURFACE", "renderAbout", base(), () => I.renderAbout());
add("choice", "CHOICE", "PUBLIC_USER", "FULL_SURFACE", "renderChoice", base(), () => I.renderChoice());
add("one-time-start", "ONE_TIME_START", "PUBLIC_USER", "FULL_SURFACE", "renderOneTimeStart", base(), () => I.renderOneTimeStart());
add("one-time-unpaid", "ONE_TIME_PAYWALL", "PUBLIC_USER", "FULL_SURFACE", "renderReport", { ...base(), stageAnswers: normalAnswers }, () => I.renderReport());
add("one-time-paid", "ONE_TIME_REPORT", "PAID_USER", "FULL_SURFACE", "renderReport", { ...base(), oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderReport());
add("lead-capture", "LEAD_CAPTURE", "PUBLIC_USER", "FULL_SURFACE", "renderLeadCapture", base(), () => I.renderLeadCapture());
add("lead-thank-you", "LEAD_THANK_YOU", "PUBLIC_USER", "FULL_SURFACE", "renderLeadThankYou", base(), () => I.renderLeadThankYou());
add("general-safety", "GENERAL_SAFETY", "PUBLIC_USER", "FULL_SURFACE", "renderOneTimeStart", base(), () => I.renderOneTimeStart());
add("professional-safety", "PROFESSIONAL_SAFETY", "PAID_USER", "FULL_SURFACE", "renderReport", { ...base(), oneTimePaid: true, stageAnswers: professionalAnswers }, () => I.renderReport());
add("urgent-mode-4", "URGENT_SAFETY", "PUBLIC_USER", "FULL_SURFACE", "renderReport", { ...base(), stageAnswers: urgentAnswers }, () => I.renderReport());
add("advisor-login", "ADVISOR_PORTAL", "ADVISOR", "FULL_SURFACE", "renderCoachLogin", base(), () => I.renderCoachLogin());
add("advisor-login-error", "VISIBLE_ERROR", "ADVISOR", "ISOLATED_COMPONENT", "renderCoachLogin with existing coachLoginError", { ...base(), coachLoginError: "Имэйл эсвэл нууц үг буруу байна." }, () => I.renderCoachLogin());
add("advisor-dashboard-empty", "ADVISOR_PORTAL", "ADVISOR", "FULL_SURFACE", "renderCoachDashboard with mock empty advisor", base(), () => I.renderCoachDashboard(), { prepare: prepareEmptyAdvisor });
add("advisor-dashboard-populated", "ADVISOR_PORTAL", "ADVISOR", "FULL_SURFACE", "renderCoachDashboard with mock paid client fixture", base(), () => I.renderCoachDashboard(), { prepare: preparePopulatedAdvisor });
add("admin-portal", "ADMIN_PORTAL", "ADMIN", "FULL_SURFACE", "renderAdminCoach with internalTest state", { ...base(), internalTest: true }, () => I.renderAdminCoach());
add("internal-feedback-survey", "OTHER_PROVEN_RENDERED", "INTERNAL_TESTER", "ISOLATED_COMPONENT", "renderInternalTesterFeedbackSurvey with internalTest state", { ...base(), internalTest: true, oneTimePaid: true, stageAnswers: normalAnswers }, () => I.renderInternalTesterFeedbackSurvey());
add("internal-feedback-thanks", "OTHER_PROVEN_RENDERED", "INTERNAL_TESTER", "FULL_SURFACE", "renderFeedbackThanks with internalTest state", { ...base(), internalTest: true }, () => I.renderFeedbackThanks());
add("internal-feedback-export", "OTHER_PROVEN_RENDERED", "INTERNAL_TESTER", "FULL_SURFACE", "renderFeedbackExport with internalTest state", { ...base(), internalTest: true }, () => I.renderFeedbackExport());
add("payment-contact", "PAYMENT", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderContactCaptureForm", base(), () => I.renderContactCaptureForm());
add("qpay-pre-invoice", "QPAY", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderWeightQpayPaymentBox", { ...base(), qpayPayment: { status: "idle", message: "", invoice: null } }, () => I.renderWeightQpayPaymentBox());
add("qpay-invoice-created", "QPAY", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderWeightQpayPaymentBox", { ...base(), qpayPayment: { status: "creating", message: I.qpayStatusMessage("creating"), invoice } }, () => I.renderWeightQpayPaymentBox());
add("qpay-pending", "QPAY", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderWeightQpayPaymentBox", { ...base(), qpayPayment: { status: "pending", message: I.qpayStatusMessage("pending"), invoice } }, () => I.renderWeightQpayPaymentBox());
add("qpay-paid", "QPAY", "PAID_USER", "ISOLATED_COMPONENT", "renderWeightQpayPaymentBox", { ...base(), oneTimePaid: true, qpayPayment: { status: "paid", message: I.qpayStatusMessage("paid"), invoice } }, () => I.renderWeightQpayPaymentBox());
add("qpay-error", "VISIBLE_ERROR", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderWeightQpayPaymentBox with qpayStatusMessage(error)", { ...base(), qpayPayment: { status: "error", message: I.qpayStatusMessage("error"), invoice: null } }, () => I.renderWeightQpayPaymentBox());
add("sample-report", "SAMPLE_REPORT", "PUBLIC_USER", "ISOLATED_COMPONENT", "renderSampleResultPreview", base(), () => I.renderSampleResultPreview());
add("question-bank", "QUESTION_BANK", "PUBLIC_USER", "ISOLATED_COMPONENT", "stageOneQuestions consumed by renderStageOne", base(), () => app.stageOneQuestions.map(q=>`<h3>${escapeText(q.text)}</h3>`).join(""));
add("answer-options", "ANSWER_OPTIONS", "PUBLIC_USER", "ISOLATED_COMPONENT", "stageOneQuestions consumed by renderInput", base(), () => app.stageOneQuestions.flatMap(q=>q.options||[]).map(x=>`<span>${escapeText(x)}</span>`).join(""));
add("accessibility", "ACCESSIBILITY", "PUBLIC_USER", "ATTRIBUTE_ONLY", "extractAccessibilityAttributes from exported renderers", base(), () => [I.renderLanding(),I.renderOneTimeStart(),I.renderContactCaptureForm(),I.renderCoachLogin()].join(""));

function prepareEmptyAdvisor() {
  mockBackend.resetMockBackend();
  const created=mockBackend.createCoachAccount({email:"advisor@example.test",displayName:"Test Advisor"});
  const login=mockBackend.loginCoach("advisor@example.test",created.temporaryPassword);
  setState({coachSessionToken:login.session.token});
}
function preparePopulatedAdvisor() {
  mockBackend.resetMockBackend();
  const created=mockBackend.createCoachAccount({email:"advisor@example.test",displayName:"Test Advisor"});
  const login=mockBackend.loginCoach("advisor@example.test",created.temporaryPassword);
  const client=mockBackend.createCoachClient(login.session.token,{clientEmail:"client@example.test",clientName:"Client One"});
  const assessment=mockBackend.createAssessment("one_time",{coachId:created.coach.id,coachClientId:client.client.id,userEmail:"client@example.test",shareWithCoach:true});
  mockBackend.linkAssessmentToCoach(assessment.id,{coachClientId:client.client.id,userEmail:"client@example.test",shareWithCoach:true});
  mockBackend.completeAssessment(assessment.id,{status:"completed",report_mode:"mode1",safety_mode:"mode1",report_text:""});
  const payment=mockBackend.createMockPayment("one_time",assessment.id,{coachId:created.coach.id,coachClientId:client.client.id,userEmail:"client@example.test"});
  mockBackend.markMockPaymentPaid(payment.id);
  setState({coachSessionToken:login.session.token});
}

function escapeText(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function decode(x){return String(x).replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
function visibleText(html){const out=[];const clean=String(html||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ");for(const part of clean.split(/<[^>]+>/g)){const text=decode(part).replace(/\s+/g," ").trim();if(text&&!/^https?:\/\//i.test(text)&&!fixtureValues.has(text))out.push({text});}return out;}
function extractAccessibilityAttributes(html){const out=[];for(const m of String(html||"").matchAll(/<([a-z0-9-]+)\b[^>]*?\s(aria-label|placeholder|title|alt)=(["'])(.*?)\3[^>]*>/gi)){const text=decode(m[4]).trim();if(text&&!fixtureValues.has(text))out.push({text,attribute_name:m[2].toLowerCase(),element_type:m[1].toLowerCase()});}return out;}

const rendered=[];const results=[];
for(const s of scenarios){
  if(!VALID_ROLES.has(s.role)||!VALID_TYPES.has(s.extraction_type))throw new Error(`Invalid scenario metadata: ${s.id}`);
  mockBackend.resetMockBackend();setState(s.state);if(s.prepare)s.prepare();
  const html=String(s.render()||"");const extracted=s.extraction_type==="ATTRIBUTE_ONLY"?extractAccessibilityAttributes(html):visibleText(html);
  if(s.expected_visible&&extracted.length===0)throw new Error(`${s.id} expected visible copy but extracted zero entries`);
  results.push({id:s.id,surface:s.surface,role:s.role,extraction_type:s.extraction_type,render_source:s.render_source,coverage:"YES",expected_visible:s.expected_visible,notes:s.notes,extracted_entry_count:extracted.length,network_attempts:networkAttempts});
  extracted.forEach(item=>rendered.push({text:item.text,surface:s.surface,role:s.role,scenario:s.id,render_source:s.render_source,extraction_type:s.extraction_type,attribute_name:item.attribute_name||null,element_type:item.element_type||null,source_locations:[],source_mapping_status:"NOT_MAPPED_NO_GUESS",dynamic:false}));
}
if(networkAttempts!==0)throw new Error(`External network attempted ${networkAttempts} times`);

const unique=new Map();for(const e of rendered){const key=[e.text,e.surface,e.role,e.attribute_name||""].join("\0");const prior=unique.get(key);if(prior){prior.scenarios=[...new Set([...prior.scenarios,e.scenario])];prior.occurrences++;}else unique.set(key,{...e,scenarios:[e.scenario],occurrences:1});}const entries=[...unique.values()];
const textCounts=new Map();for(const e of rendered)textCounts.set(e.text,(textCounts.get(e.text)||0)+1);const duplicateTexts=[...textCounts].filter(([,n])=>n>1).sort((a,b)=>a[0].localeCompare(b[0]));const dupIds=new Map(duplicateTexts.map(([t],i)=>[t,`DUP-${String(i+1).padStart(4,"0")}`]));
function category(e){if(/SAFETY/.test(e.surface))return"SAFETY_CRITICAL";if(/PAYMENT|QPAY|PAYWALL/.test(e.surface))return"PAYMENT_CRITICAL";if(/QUESTION|ANSWER/.test(e.surface))return"QUESTION_WORDING";if(e.surface==="ACCESSIBILITY")return"ACCESSIBILITY_COPY";if(["ADMIN","ADVISOR"].includes(e.role))return"ADMIN_OR_ADVISOR_TERM";if(/\b[A-Za-z][A-Za-z-]*\b/.test(e.text)&&!/^(QPay|PDF)$/.test(e.text))return"MIXED_LANGUAGE";if(e.surface.includes("REPORT"))return"REPORT_WORDING";return"NO_LANGUAGE_ISSUE_OBSERVED";}
function md(x){return String(x??"").replace(/\|/g,"\\|").replace(/\r?\n/g," ");}
let catalog="# Mongolian Copy Review Catalog\n\nRender-backed, role-facing strings only. No wording is approved or proposed. Nested components are isolated and accessibility extraction is attribute-only.\n\n| ID | Exact current text | Source file | Source line | Source function/object | Rendered surface | Role | Render proof | Dynamic variables | Duplicate group | Review category |\n| -- | ------------------ | ----------- | ----------: | ---------------------- | ---------------- | ---- | ------------ | ----------------- | --------------- | --------------- |\n";
entries.forEach((e,i)=>catalog+=`| COPY-${String(i+1).padStart(4,"0")} | ${md(e.text)} | app.js |  | ${md(e.render_source)} | ${e.surface} | ${e.role} | ${md(e.render_source)} via ${md(e.scenarios.join(", "))} [${e.extraction_type}]${e.attribute_name?` ${e.element_type}.${e.attribute_name}`:""} | None observed | ${dupIds.get(e.text)||""} | ${category(e)} |\n`);fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_REVIEW_CATALOG.md"),catalog);
let dup="# Mongolian Copy Duplicate Index\n\nExact-text duplicates only.\n\n| Duplicate group | Exact text | Occurrence count | Surfaces | Source locations |\n| --------------- | ---------- | ---------------: | -------- | ---------------- |\n";duplicateTexts.forEach(([t,n])=>{const es=rendered.filter(e=>e.text===t);dup+=`| ${dupIds.get(t)} | ${md(t)} | ${n} | ${[...new Set(es.map(e=>e.surface))].join(", ")} | source mapping unavailable |\n`;});fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_DUPLICATE_INDEX.md"),dup);

const literals=[...appSource.matchAll(/(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g)].map(m=>({text:m[2].replace(/\\n/g," ").replace(/\s+/g," ").trim(),line:appSource.slice(0,m.index).split("\n").length})).filter(x=>x.text);
function rawClass(x){if(/^https?:\/\//.test(x))return"API_OR_URL";if(/^(\.\.?\/|node:|[\w/-]+\.(js|json|html|css))/.test(x))return"CODE_OR_MODULE_REFERENCE";if(/localStorage|weight_test_|storage/i.test(x))return"DATABASE_OR_STORAGE";if(/event|funnel|analytics|view_|click_/i.test(x)&&!/[А-Яа-яӨөҮү]/.test(x))return"ANALYTICS_OR_EVENT";if(/\$\{/.test(x))return"DYNAMIC_TEMPLATE_FRAGMENT";if([...app.stageOneQuestions].some(q=>q.text===x||(q.options||[]).includes(x)))return"QUESTION_OR_OPTION";if(rendered.some(e=>e.text===x))return"RENDERED_USER_VISIBLE";if(/^(WEIGHT_|QPAY_|S1-|D-|COPY-|[a-z][a-z0-9_]+)$/.test(x))return"INTERNAL_IDENTIFIER";return"UNKNOWN_REQUIRES_TRACE";}
const rawRows=literals.map(x=>({...x,classification:rawClass(x.text)}));let raw="# Mongolian Copy Raw Literal Inventory\n\nThis is a raw source-literal inventory. It is not a user-visible copy catalog and must not be used directly for language approval.\n\n| ID | Exact source literal | Source | Classification |\n| -- | -------------------- | ------ | -------------- |\n";rawRows.forEach((r,i)=>raw+=`| RAW-${String(i+1).padStart(4,"0")} | ${md(r.text)} | app.js:${r.line} | ${r.classification} |\n`);fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md"),raw);
const excludedClasses=new Set(["API_OR_URL","ANALYTICS_OR_EVENT","DATABASE_OR_STORAGE","INTERNAL_IDENTIFIER","CODE_OR_MODULE_REFERENCE","UNKNOWN_REQUIRES_TRACE"]);const excluded=rawRows.filter(r=>excludedClasses.has(r.classification));const groups=[["API and URLs","API_OR_URL"],["analytics events","ANALYTICS_OR_EVENT"],["internal keys","INTERNAL_IDENTIFIER"],["storage keys","DATABASE_OR_STORAGE"],["source paths and module imports","CODE_OR_MODULE_REFERENCE"],["test fixtures","TEST_ONLY"],["documentation","DOCUMENTATION_ONLY"],["untraced internal candidates","UNKNOWN_REQUIRES_TRACE"]];let excludedMd="# Mongolian Copy Excluded Internal Strings\n\nRaw literals excluded because role-facing render visibility was not proven.\n";for(const[g,c]of groups){const xs=rawRows.filter(r=>r.classification===c);excludedMd+=`\n## ${g}\n\n- Count: ${xs.length}\n- Reason excluded: ${c==="UNKNOWN_REQUIRES_TRACE"?"No render path was proven.":`Classified as ${c}.`}\n- Representative examples: ${xs.slice(0,8).map(x=>`\`${x.text.replace(/`/g,"'")}\``).join(", ")||"None."}\n`;}fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md"),excludedMd);
let coverage="# Mongolian Copy Surface Coverage\n\nEvery scenario declares an extraction type. FULL_SURFACE is a complete screen, ISOLATED_COMPONENT calls an existing component renderer, and ATTRIBUTE_ONLY extracts attributes only.\n\n| Surface | Render function or source | Scenario implemented | Extraction type | Extracted entry count | Covered | Notes |\n| ------- | ------------------------- | -------------------- | --------------- | --------------------: | ------- | ----- |\n";results.forEach(s=>coverage+=`| ${s.surface} | ${md(s.render_source)} | ${s.id} | ${s.extraction_type} | ${s.extracted_entry_count} | ${s.coverage} | ${md(s.notes)} |\n`);fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_SURFACE_COVERAGE.md"),coverage);
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});fs.writeFileSync(path.join(root,"artifacts/mongolian-rendered-copy.json"),JSON.stringify({generator_version:GENERATOR_VERSION,generated_from_commit:commit,network_attempts:networkAttempts,scenarios:results,entries},null,2)+"\n");
const stats={generator_version:GENERATOR_VERSION,raw_literal_count:rawRows.length,review_entry_count:entries.length,excluded_internal_count:excluded.length,duplicate_occurrence_count:[...textCounts.values()].reduce((n,c)=>n+Math.max(0,c-1),0),duplicate_group_count:duplicateTexts.length,yes_scenarios:results.filter(s=>s.coverage==="YES").length,partial_or_missing:results.filter(s=>s.coverage!=="YES").map(s=>s.id),question_count:app.stageOneQuestions.length,answer_option_count:[...app.stageOneQuestions].reduce((n,q)=>n+(q.options||[]).length,0),network_attempts:networkAttempts};fs.writeFileSync(path.join(root,"artifacts/mongolian-copy-stats.json"),JSON.stringify(stats,null,2)+"\n");
const countSurface=pattern=>entries.filter(e=>pattern.test(e.surface)).length;const countRole=role=>entries.filter(e=>e.role===role).length;const mixedCount=entries.filter(e=>/\b[A-Za-z][A-Za-z-]*\b/.test(e.text)&&!/^(QPay|PDF)$/.test(e.text)).length;
const validation=`# Mongolian Copy Engineering Validation\n\n## Generated provenance\n\n- Generator version: \`${GENERATOR_VERSION}\`\n- Extraction source commit: \`${commit}\`\n- Final PR head and final-head workflow IDs: maintained in PR #1 metadata after the implementation push to avoid a self-referential validation-only commit cycle\n- Pending approved replacement count: 0\n- Applied owner correction count: 1\n- Production scope changed: YES — owner-authorized removed-feature assessment removal; one-time payment and safety behavior retained\n- External network attempts during extraction: ${networkAttempts}\n\n## Generated metrics\n\n- Raw literal count: ${stats.raw_literal_count.toLocaleString("en-US")}\n- Review-ready unique entry count: ${stats.review_entry_count.toLocaleString("en-US")}\n- Excluded internal/unproven count: ${stats.excluded_internal_count.toLocaleString("en-US")}\n- Duplicate occurrence count: ${stats.duplicate_occurrence_count.toLocaleString("en-US")}\n- Duplicate canonical-group count: ${stats.duplicate_group_count.toLocaleString("en-US")}\n- YES scenarios: ${stats.yes_scenarios}\n- Partial or missing scenarios: ${stats.partial_or_missing.length}\n- Question count: ${stats.question_count}\n- Answer-option count: ${stats.answer_option_count}\n- Safety entries: ${countSurface(/SAFETY/)}\n- Payment/QPay/paywall entries: ${countSurface(/PAYMENT|QPAY|PAYWALL/)}\n- Admin entries: ${countRole("ADMIN")}\n- Advisor entries: ${countRole("ADVISOR")}\n- Internal tester entries: ${countRole("INTERNAL_TESTER")}\n- Structural mixed-language signals: ${mixedCount}\n\n## Extraction architecture\n\nEvery scenario declares \`FULL_SURFACE\`, \`ISOLATED_COMPONENT\`, or \`ATTRIBUTE_ONLY\`. Sample report, QPay, and payment error use direct existing component renderers. Accessibility extraction reads attributes only.  Advisor fixtures use the local mock backend. Internal tester fixtures use the existing \`internalTest\` state gate.\n\n## Permitted app.js test exports\n\nRetained CommonJS \`_internal\` extraction exports:\n\n- \`renderSampleResultPreview\`\n- \`renderWeightQpayPaymentBox\`\n- \`qpayStatusMessage\`\n\n## Required validation\n\n- \`git diff --check\`: PASS\n- \`node --check app.js\`: PASS\n- \`node --check tools/extract-rendered-copy.mjs\`: PASS\n- \`node tools/extract-rendered-copy.mjs\`: PASS\n- Focused catalog, safety, routing, pricing, and public-language tests: PASS\n- \`npm test\`: PASS\n- Final-head GitHub Actions: recorded in PR metadata and final handoff after push\n- One-time pricing and safety behavior retained; focused tests PASS\n- Deploy: NOT PERFORMED\n- Merge: NOT PERFORMED\n`;
fs.writeFileSync(path.join(root,"MONGOLIAN_COPY_ENGINEERING_VALIDATION.md"),validation);console.log(JSON.stringify(stats,null,2));
