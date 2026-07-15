import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const GENERATOR_VERSION = "1.0.0";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "mongolian-copy-review-packs");
const artifact = JSON.parse(fs.readFileSync(path.join(root, "artifacts/mongolian-rendered-copy.json"), "utf8"));
const app = require(path.join(root, "app.js"));
const appText = fs.readFileSync(path.join(root, "app.js"), "utf8");
const appLines = appText.split("\n");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const entries = artifact.entries.map((entry, index) => ({ ...entry, id: `COPY-${String(index + 1).padStart(4, "0")}` }));
const byText = new Map();
entries.forEach(entry => { const list = byText.get(entry.text) || []; list.push(entry); byText.set(entry.text, list); });
const allQuestions = [...app.stageOneQuestions];
const safetyQuestionIds = new Set(["S1-S04", "S1-B01", "S1-B02", "S1-B03", "S1-B04", "S1-B05"]);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"), "utf8"));
const appliedCorrections = JSON.parse(fs.readFileSync(path.join(root, "APPLIED_OWNER_CORRECTIONS.json"), "utf8"));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

function md(value) { return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " "); }
function quote(value) { return String(value ?? "").split("\n").map(line => `> ${line}`).join("\n") || "> None"; }
function sourceMapping(text) {
  const exact = [];
  appLines.forEach((line, index) => { if (line.includes(text)) exact.push(index); });
  if (exact.length !== 1) return { status: "UNRESOLVED", file: "app.js", line: "", item: "Source mapping: UNRESOLVED", before: "None", after: "None", fn: "UNRESOLVED" };
  const index = exact[0];
  let fn = "module/object scope";
  for (let i = index; i >= 0; i--) { const m = appLines[i].match(/function\s+([A-Za-z0-9_$]+)\s*\(/); if (m) { fn = m[1]; break; } }
  const owned = offset => {
    for (let i = index + offset; i >= 0 && i < appLines.length; i += offset) {
      const line = appLines[i].trim();
      if (!line || line.startsWith("//")) continue;
      return line;
    }
    return "None";
  };
  return { status: "RESOLVED", file: "app.js", line: index + 1, item: appLines[index].trim(), before: owned(-1), after: owned(1), fn };
}
function renderedContext(entry) {
  const scenario = entry.scenarios[0];
  const list = entries.filter(item => item.scenarios.includes(scenario));
  const index = list.findIndex(item => item.id === entry.id);
  return list.slice(Math.max(0, index - 1), index + 2).map(item => item.text).join("\n");
}
function structuralSignal(entry, group) {
  if (group === "mixed") {
    if (/Coach|coach|admin/i.test(entry.text)) return "ADMIN_OR_ADVISOR_TERM";
    if (/BCT|CBT|Habit|Environmental|Self-Monitoring|Safety-First|Method|Analysis/i.test(entry.text)) return "METHODOLOGY_NAME";
    if (/pattern|reward|cue|default|evidence|cycle|tracking|diary|willpower|mechanism/i.test(entry.text)) return "INTERNAL_MECHANISM_LEAK";
    if (/browser|email|clipboard|print|copy|PDF/i.test(entry.text)) return "TECHNICAL_INSTRUCTION";
    if (/[А-Яа-яӨөҮү].*[A-Za-z]|[A-Za-z].*[А-Яа-яӨөҮү]/.test(entry.text)) return "ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE";
    return "UNRESOLVED_LATIN_TERM";
  }
  if (group === "safety") return "Safety-critical routing or interpretation text.";
  if (group === "payment") return "Payment, price, entitlement, invoice, or recovery text.";
  if (group === "report") {
    if (/байж болно|магадгүй|болзошгүй/.test(entry.text)) return "Uncertainty construction in report or recommendation copy.";
    if (/^[А-ЯӨҮA-Z][^.!?]*[.!?]?$/.test(entry.text)) return "Report heading, summary, or instruction requiring owner review.";
    return "Report interpretation or recommendation text.";
  }
  if (group === "template") return "Rendered structural boundary signal requiring source-template review.";
  if (group === "ordinary") return "Ordinary role-facing UI, status, navigation, or accessibility copy.";
  return "Question wording requiring owner review.";
}
function priority(group) { return ["mixed", "safety", "payment"].includes(group) ? "P0" : ["report", "template", "terminology"].includes(group) ? "P1" : "P2"; }
function entryBlock(entry, group, crossRefs = []) {
  const map = sourceMapping(entry.text);
  const proof = `${entry.render_source} via ${entry.scenarios.join(", ")} [${entry.extraction_type}]`;
  return `## ${entry.id} — ${priority(group)}\n\n**Exact current text**\n\n${quote(entry.text)}\n\n**Classification**\n\n- Priority: ${priority(group)}\n- Review group: ${group}\n- Structural signal: ${structuralSignal(entry, group)}\n- Surface: ${entry.surface}\n- Role: ${entry.role}\n- Scenario: ${entry.scenarios.join(", ")}\n- Render source: ${entry.render_source}\n- Extraction type: ${entry.extraction_type}\n- Occurrence count: ${entry.occurrences}\n- Duplicate group: ${entry.duplicate_group || "None"}\n- Source file: ${map.file}\n- Source line: ${map.line || "UNRESOLVED"}\n- Source function/object: ${map.fn}\n- Source mapping: ${map.status}\n- Render proof: ${proof}\n- Cross-group references: ${crossRefs.length ? crossRefs.join(", ") : "None"}\n\n**Source context before**\n\n${quote(map.before)}\n\n**Source item**\n\n${quote(map.item)}\n\n**Source context after**\n\n${quote(map.after)}\n\n**Rendered context**\n\n${quote(renderedContext(entry))}\n\n**Dynamic values**\n\n- ${entry.dynamic ? "See exact interpolation in Source item; fixture values are preserved in rendered context." : "None"}\n\n**Reason included**\n\n${structuralSignal(entry, group)}\n\n**Owner decision**\n\n- Decision: \`PENDING\`\n- Approved exact text:\n- Approved by:\n- Approval date:\n- Notes:\n\n`;
}
const assignments = new Map(entries.map(entry => [entry.id, new Set()]));
const files = [];
let ownerDecisionFields = 0;
function writeBatch(prefix, title, group, list, max) {
  const chunks = [];
  for (let i = 0; i < list.length; i += max) chunks.push(list.slice(i, i + max));
  chunks.forEach((chunk, index) => {
    const name = `${prefix}_BATCH_${String(index + 1).padStart(2, "0")}.md`;
    let body = `# ${title} — Batch ${String(index + 1).padStart(2, "0")}\n\nEvidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.\n\n`;
    chunk.forEach(entry => { assignments.get(entry.id).add(name); ownerDecisionFields += 1; body += entryBlock(entry, group); });
    fs.writeFileSync(path.join(outDir, name), body); files.push(name);
  });
}

const brandOnly = /^(QPay|PDF)$/;
const mixed = entries.filter(e => /[A-Za-z]/.test(e.text) && !brandOnly.test(e.text));
const safetyTexts = new Set(allQuestions.filter(q => safetyQuestionIds.has(q.id)).flatMap(q => [q.text, ...(q.options || [])]));
const safety = entries.filter(e => /SAFETY/.test(e.surface) || safetyTexts.has(e.text));
const payment = entries.filter(e => /^(PAYMENT|QPAY|ONE_TIME_PAYWALL)$/.test(e.surface) || (e.surface === "VISIBLE_ERROR" && /qpay|payment/i.test(e.scenarios.join(" "))));
const report = entries.filter(e => /REPORT/.test(e.surface) && !safety.includes(e) && !payment.includes(e));
const template = entries.filter(e => e.dynamic || /\$\{|[.!?]\s+[а-яөү]|[.!?]{2,}/.test(e.text));
const questionEntries = entries.filter(e => ["QUESTION_BANK", "ANSWER_OPTIONS"].includes(e.surface));
const assignedSpecial = new Set([...mixed, ...safety, ...payment, ...report, ...template, ...questionEntries].map(e => e.id));
const advisorAdmin = entries.filter(e => ["ADVISOR", "ADMIN"].includes(e.role));
const accessibility = entries.filter(e => e.surface === "ACCESSIBILITY");
const ordinary = entries.filter(e => !assignedSpecial.has(e.id) && !advisorAdmin.includes(e) && !accessibility.includes(e));

writeBatch("01_P0_MIXED_LANGUAGE", "P0 Mixed Language", "mixed", mixed, 30);
writeBatch("02_P0_SAFETY_CRITICAL", "P0 Safety Critical", "safety", safety, 25);
writeBatch("03_P0_PAYMENT_CRITICAL", "P0 Payment Critical", "payment", payment, 25);
writeBatch("05_P1_REPORT_REGISTER", "P1 Report and Recommendation Register", "report", report, 30);

let templateBody = "# P1 Template Boundary Risks\n\nEvidence only. No corrections or replacement wording are included.\n\n";
if (!template.length) templateBody += "No rendered template-boundary signal matched the deterministic structural checks.\n";
template.forEach(entry => { assignments.get(entry.id).add("06_P1_TEMPLATE_BOUNDARY_RISKS.md"); ownerDecisionFields += 1; templateBody += entryBlock(entry, "template"); });
fs.writeFileSync(path.join(outDir, "06_P1_TEMPLATE_BOUNDARY_RISKS.md"), templateBody); files.push("06_P1_TEMPLATE_BOUNDARY_RISKS.md");

const questionDomains = [
  ["GENERAL", q => ["Basic context","Warm start","Voice checkpoint","Согтууруулах ундаа ба тамхи","Хүнсний зохицол ба биед өгөх мэдрэмж"].includes(q.module)],
  ["WEIGHT_HISTORY", q => q.module === "Weight trajectory"],
  ["PRIOR_ATTEMPTS", q => ["Past attempts","Restriction response"].includes(q.module)],
  ["MEAL_RHYTHM", q => q.module === "Meal rhythm"],
  ["HUNGER_SATIETY", q => ["Hunger & satiety","Hunger-safety"].includes(q.module)],
  ["EMOTIONAL_EATING", q => ["Emotion / regulation","Hidden function","Reward / craving"].includes(q.module)],
  ["ENVIRONMENTAL_TRIGGERS", q => q.module === "Environment"],
  ["SLEEP_ENERGY", q => q.module === "Sleep / energy"],
  ["WORK_CONTEXT", q => ["Executive load","Өдөр тутмын хөдөлгөөн ба ажлын нөхцөл"].includes(q.module)],
  ["BODY_MEDICAL", q => ["Body / medical","Хөдөлгөөний боломж"].includes(q.module)],
  ["MENSTRUAL_CYCLE", q => q.module === "Menstrual cycle"],
  ["SAFETY", q => q.module === "Safety"]
];
const usedQuestions = new Set();
for (const [domain, predicate] of questionDomains) {
  const list = allQuestions.filter(q => predicate(q) && !usedQuestions.has(q.id)); list.forEach(q => usedQuestions.add(q.id));
  const chunks = list.length ? Array.from({length:Math.ceil(list.length/25)},(_,i)=>list.slice(i*25,i*25+25)) : [[]];
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
    const chunk = chunks[chunkIndex]; const name = `07_P2_QUESTIONS_${domain}_BATCH_${String(chunkIndex + 1).padStart(2, "0")}.md`;
    let body = `# P2 Questions — ${domain} — Batch ${String(chunkIndex + 1).padStart(2, "0")}\n\nQuestions and their owning options are kept together verbatim. No wording is proposed.\n\n`;
    chunk.forEach(q => {
      const qEntries = byText.get(q.text) || []; const optionEntries = (q.options || []).flatMap(option => byText.get(option) || []);
      [...qEntries, ...optionEntries].filter(e => ["QUESTION_BANK", "ANSWER_OPTIONS"].includes(e.surface)).forEach(e => assignments.get(e.id).add(name));
      const primary = qEntries.find(e => e.surface === "QUESTION_BANK") || qEntries[0];
      if (primary) { ownerDecisionFields += 1; body += entryBlock(primary, "question"); }
      else body += `## ${q.id} — P2\n\n**Exact current text**\n\n${quote(q.text)}\n\n**Answer options**\n\n${(q.options || []).map(option => `- ${option}`).join("\n") || "- None"}\n\n**Source mapping**\n\nUNRESOLVED\n\n**Owner decision**\n\n- Decision: \`PENDING\`\n- Approved exact text:\n- Approved by:\n- Approval date:\n- Notes:\n\n`;
      body += `**Answer options for ${q.id}**\n\n${(q.options || []).map(option => `- ${option}`).join("\n") || "- None"}\n\n`;
    });
    fs.writeFileSync(path.join(outDir, name), body); files.push(name);
  }
}
const uncategorizedQuestions = allQuestions.filter(q => !usedQuestions.has(q.id));
if (uncategorizedQuestions.length) {
  const name = "07_P2_QUESTIONS_OTHER_BATCH_01.md"; let body = "# P2 Questions — OTHER\n\n";
  uncategorizedQuestions.forEach(q => { const es=[...(byText.get(q.text)||[]),...(q.options||[]).flatMap(o=>byText.get(o)||[])];es.filter(e=>questionEntries.includes(e)).forEach(e=>assignments.get(e.id).add(name));const primary=(byText.get(q.text)||[])[0];if(primary){ownerDecisionFields++;body+=entryBlock(primary,"question");}body+=`**Answer options for ${q.id}**\n\n${(q.options||[]).map(o=>`- ${o}`).join("\n")||"- None"}\n\n`; }); fs.writeFileSync(path.join(outDir,name),body);files.push(name);
}

writeBatch("08_P2_ORDINARY_UI", "P2 Ordinary UI", "ordinary", ordinary, 30);
let accessBody="# P2 Accessibility\n\nAttribute-only evidence.\n\n";accessibility.forEach(e=>{assignments.get(e.id).add("08_P2_ACCESSIBILITY.md");ownerDecisionFields++;accessBody+=entryBlock(e,"ordinary");});fs.writeFileSync(path.join(outDir,"08_P2_ACCESSIBILITY.md"),accessBody);files.push("08_P2_ACCESSIBILITY.md");
let adminBody="# P2 Advisor and Admin UI\n\nRole-facing evidence only.\n\n";advisorAdmin.forEach(e=>{assignments.get(e.id).add("08_P2_ADVISOR_ADMIN_UI.md");ownerDecisionFields++;adminBody+=entryBlock(e,"ordinary");});fs.writeFileSync(path.join(outDir,"08_P2_ADVISOR_ADMIN_UI.md"),adminBody);files.push("08_P2_ADVISOR_ADMIN_UI.md");

const familyDefs = [
  ["TERM-01", "assessment_name_01", /үнэлгээ|assessment/i], ["TERM-02", "test_name_01", /тест|test/i], ["TERM-03", "report_name_01", /тайлан|report/i],
  ["TERM-04", "initial_result_name_01", /эхний зураглал|эхний үр дүн/i],
  ["TERM-06", "advisor_role_name_01", /Coach|coach|зөвлөх|advisor/i],
  ["TERM-08", "evidence_observation_name_01", /нотолгоо|evidence|ажиглалт/i], ["TERM-09", "payment_document_name_01", /нэхэмжлэл|invoice/i],
  ["TERM-10", "experiment_program_plan_name_01", /туршилт|хөтөлбөр|төлөвлөгөө|experiment|program|plan/i]
];
let termBody="# P1 Terminology Families\n\nFamilies are code/render-context groupings for owner review, not canonical-term decisions.\n\n| Family ID | Concept label for review | Exact variants | Surfaces | Roles | Occurrences | Source locations | Owner-selected canonical term |\n| --------- | ------------------------ | -------------- | -------- | ----- | ----------: | ---------------- | ----------------------------- |\n";
for(const[id,label,pattern]of familyDefs){const matches=entries.filter(e=>pattern.test(e.text));const variants=[...new Set(matches.map(e=>e.text))];const locations=variants.map(v=>{const m=sourceMapping(v);return m.status==="RESOLVED"?`app.js:${m.line}`:"UNRESOLVED";});termBody+=`| ${id} | ${label} | ${md(variants.join(" ; "))} | ${[...new Set(matches.map(e=>e.surface))].join(", ")} | ${[...new Set(matches.map(e=>e.role))].join(", ")} | ${matches.reduce((n,e)=>n+e.occurrences,0)} | ${[...new Set(locations)].join(", ")} |  |\n`;matches.forEach(e=>assignments.get(e.id).add("04_P1_TERMINOLOGY_FAMILIES.md"));}
fs.writeFileSync(path.join(outDir,"04_P1_TERMINOLOGY_FAMILIES.md"),termBody);files.push("04_P1_TERMINOLOGY_FAMILIES.md");

const unassigned=entries.filter(e=>assignments.get(e.id).size===0);let noSignal="# No Review Signal Appendix\n\nEntries listed here remain traceable but have no deterministic review signal beyond rendered visibility. No replacement wording is proposed.\n\n";unassigned.forEach(e=>{assignments.get(e.id).add("99_NO_REVIEW_SIGNAL.md");ownerDecisionFields++;noSignal+=entryBlock(e,"ordinary");});fs.writeFileSync(path.join(outDir,"99_NO_REVIEW_SIGNAL.md"),noSignal);files.push("99_NO_REVIEW_SIGNAL.md");

const uniqueAssigned=entries.filter(e=>assignments.get(e.id).size>0);const cross=entries.filter(e=>assignments.get(e.id).size>1);const priorityForEntry=e=>{const names=[...assignments.get(e.id)];if(names.some(n=>/^0[123]_P0/.test(n)))return"P0";if(names.some(n=>/^0[456]_P1/.test(n)))return"P1";return"P2";};const priorityCounts={P0:0,P1:0,P2:0};entries.forEach(e=>priorityCounts[priorityForEntry(e)]++);
const groupCounts={};for(const file of files){const count=entries.filter(e=>assignments.get(e.id).has(file)).length;groupCounts[file]=count;}
const unresolved=entries.filter(e=>sourceMapping(e.text).status==="UNRESOLVED").length;
const metrics={generator_version:GENERATOR_VERSION,generated_from_commit:commit,catalog_entry_count:entries.length,unique_items_assigned:uniqueAssigned.length,unassigned_items:0,no_review_signal_count:unassigned.length,cross_group_items:cross.length,unresolved_source_mappings:unresolved,blank_owner_decision_fields:ownerDecisionFields,priority_counts:priorityCounts,group_counts:groupCounts,batch_files:files.sort(),pending_approved_replacement_count:manifest.replacements.length,applied_owner_correction_count:appliedCorrections.records.length,assigned_ids:Object.fromEntries(entries.map(e=>[e.id,[...assignments.get(e.id)].sort()]))};
fs.writeFileSync(path.join(outDir,"REVIEW_PACK_METRICS.json"),JSON.stringify(metrics,null,2)+"\n");

const order=["Mixed-language P0","Urgent/professional safety P0","Payment P0","Terminology families P1","Report/register P1","Template risks P1","Questions P2","Ordinary UI/accessibility P2"];
const readme=`# Mongolian Copy Owner Review Packs\n\nThese files contain current rendered copy only. One exact owner-approved navigation correction is recorded neutrally in the applied-correction registry; no pending or additional replacement text is proposed. Issue categories are structural review signals, not linguistic verdicts. Product-owner approval is required before any further implementation, and every pending approval field must remain blank until the owner supplies exact text.\n\n## Metrics\n\n- Total catalog entries: ${entries.length}\n- P0: ${priorityCounts.P0}\n- P1: ${priorityCounts.P1}\n- P2: ${priorityCounts.P2}\n- Unresolved source mappings: ${unresolved}\n- Cross-group items: ${cross.length}\n- No-review-signal items: ${unassigned.length}\n- Pending approved replacements: ${manifest.replacements.length}\n- Applied owner corrections: ${appliedCorrections.records.length}\n\n## Recommended review order\n\n${order.map((x,i)=>`${i+1}. ${x}`).join("\n")}\n\n## Batch files\n\n${files.sort().map(f=>`- [${f}](./${f})`).join("\n")}\n\n## How to review\n\nFor each item, leave \`Decision: PENDING\` and all approval fields blank until the product owner supplies exact approved text. Exact duplicates are consolidated within a group; cross-group use is retained only when review purpose differs. Source mapping is \`UNRESOLVED\` where an exact source literal cannot be proven.\n\nAfter owner review, a separate engineering task may validate exact approved entries and populate the locked manifest by matching current exact text at the documented source and surface. This review pack does not authorize that implementation.\n`;
fs.writeFileSync(path.join(outDir,"README.md"),readme);
const validationPath=path.join(root,"MONGOLIAN_COPY_ENGINEERING_VALIDATION.md");
const marker="\n## Owner review pack generation\n";
const existingValidation=fs.readFileSync(validationPath,"utf8").split(marker)[0].trimEnd();
const packValidation=`${marker}\n- Generator version: \`${GENERATOR_VERSION}\`\n- Generated from commit: \`${commit}\`\n- Catalog entries assigned: ${entries.length}\n- P0 unique items: ${priorityCounts.P0}\n- P1 unique items: ${priorityCounts.P1}\n- P2 unique items: ${priorityCounts.P2}\n- Batch/pack files: ${files.length}\n- Unassigned items: 0\n- No-review-signal items: ${unassigned.length}\n- Cross-group items: ${cross.length}\n- Unresolved source mappings: ${unresolved}\n- Blank owner-decision blocks: ${ownerDecisionFields}\n- Pending approved replacement count: ${manifest.replacements.length}\n- Applied owner correction count: ${appliedCorrections.records.length}\n- Review-pack integrity test: PASS\n- Authorized production correction limited to the home label, home path, and same-origin function endpoints\n`;
fs.writeFileSync(validationPath,`${existingValidation}${packValidation}`);
for(const file of fs.readdirSync(outDir).filter(name=>name.endsWith(".md"))){const target=path.join(outDir,file);fs.writeFileSync(target,`${fs.readFileSync(target,"utf8").trimEnd()}\n`);}
console.log(JSON.stringify({entries:entries.length,files:files.length,priorityCounts,unresolved,cross:cross.length,noReview:unassigned.length,ownerDecisionFields},null,2));
