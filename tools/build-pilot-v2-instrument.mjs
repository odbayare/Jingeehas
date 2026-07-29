import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidatePath = path.join(root, "docs/psychometrics/candidate-bank-v2-1/PILOT_CANDIDATE_BANK_V2_1.csv");
const heldPath = path.join(root, "docs/psychometrics/candidate-bank-v2-1/HELD_ITEMS_V2_1.csv");
const outputPath = path.join(root, "pilot-v2/generated/instrument-v2.1.json");
const { registry } = require(path.join(root, "pilot-v2/scale-registry.js"));

function parseCsv(text) {
  const rows = []; let row = []; let field = ""; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field); field = ""; if (row.some(value => value !== "")) rows.push(row); row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...values] = rows;
  return values.map((cells, rowIndex) => Object.fromEntries(headers.map((header, index) => {
    if (cells[index] === undefined) throw new Error(`CSV row ${rowIndex + 2} missing field ${header}`);
    return [header, cells[index]];
  })));
}

const source = fs.readFileSync(candidatePath);
const candidate = parseCsv(source.toString("utf8"));
const held = new Set(parseCsv(fs.readFileSync(heldPath, "utf8")).map(row => row.item_key));
const scored = candidate.filter(row => row.pilot_role === "scored_core_candidate");
const research = candidate.filter(row => row.pilot_role === "non_scored_research_quality");
const constructs = new Set(scored.map(row => row.construct));
const expectedConstructs = ["emotional_eating", "external_cue_reactivity", "uncontrolled_eating", "eating_self_efficacy", "hunger_satiety_awareness", "habit_automaticity", "body_image_avoidance", "implementation_maintenance_friction", "restrictive_rebound"];
const sourceOptionsByScale = new Map();
const fail = message => { throw new Error(`PILOT_V2_BANK_INVALID: ${message}`); };
if (candidate.length !== 49) fail(`expected 49 rows, received ${candidate.length}`);
if (scored.length !== 48) fail(`expected 48 scored rows, received ${scored.length}`);
if (research.length !== 1) fail(`expected one non-scored research-quality row, received ${research.length}`);
if (new Set(candidate.map(row => row.item_key)).size !== candidate.length) fail("duplicate item_key");
if (expectedConstructs.some(key => !constructs.has(key)) || constructs.size !== 9) fail("all nine constructs are required");
for (const [index, row] of candidate.entries()) {
  const line = index + 2;
  if (held.has(row.item_key)) fail(`row ${line} item_key ${row.item_key} is held/reserve`);
  if (row.production_ready === "true" || row.production_enabled === "true") fail(`row ${line} is production-enabled`);
  if (!registry[row.response_scale_id]) fail(`row ${line} response_scale_id ${row.response_scale_id} is absent from registry`);
  if (row.response_options.split("|").map(value => value.trim()).length !== registry[row.response_scale_id].length) fail(`row ${line} response_options cardinality differs from registry`);
  if (sourceOptionsByScale.has(row.response_scale_id) && sourceOptionsByScale.get(row.response_scale_id) !== row.response_options) fail(`row ${line} response_options conflicts within scale ${row.response_scale_id}`);
  sourceOptionsByScale.set(row.response_scale_id, row.response_options);
  if (row.pilot_role === "scored_core_candidate" && !["higher_barrier", "higher_capability"].includes(row.scoring_direction)) fail(`row ${line} lacks explicit scoring_direction`);
}
const items = candidate.map(row => ({
  itemKey: row.item_key, construct: row.construct, facet: row.facet, itemText: row.item_text,
  behavioralContext: row.behavioral_context, recallPeriod: row.recall_period,
  responseScaleId: row.response_scale_id, scoringDirection: row.scoring_direction,
  pilotRole: row.pilot_role, sensitive: row.sensitive === "true"
}));
const result = {
  schemaVersion: 1, instrumentVersion: "jingeehas-ai-pilot-v2.1",
  scoringVersion: "jingeehas-ai-pilot-scoring-v2.1-equal-weight",
  reportVersion: "jingeehas-ai-pilot-report-v2.1",
  pilotStatusLabel: "AI_DESIGNED_AI_PRETESTED_NOT_HUMAN_REVIEWED_NOT_PSYCHOMETRICALLY_VALIDATED",
  itemBankSha256: crypto.createHash("sha256").update(source).digest("hex"),
  source: "docs/psychometrics/candidate-bank-v2-1/PILOT_CANDIDATE_BANK_V2_1.csv", items
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Pilot V2.1 instrument generated: ${items.length} rows (${scored.length} scored), ${result.itemBankSha256}`);
