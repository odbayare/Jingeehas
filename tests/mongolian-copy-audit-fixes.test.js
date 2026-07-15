const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const normalize = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

assert(!fs.existsSync(path.join(root, "mongolian-copy-normalizer.js")));
assert(!fs.existsSync(path.join(root, "mongolian-copy-domain-normalizer.js")));
const index = read("index.html");
assert(!index.includes("mongolian-copy-normalizer"));
assert(!index.includes("mongolian-copy-domain-normalizer"));

const productionSources = [read("app.js"), index, read("mockBackend.js")].join("\n");
assert(!productionSources.includes("MutationObserver"), "no post-render language observer may be installed");
assert(!productionSources.includes("TOKEN_REPLACEMENTS"), "no generic token replacement map may remain");
assert(!productionSources.includes("EXACT_REPLACEMENTS"), "no provisional exact replacement map may remain");

const userText = "User input: Coach analysis pattern diary tracking cycle reward default cue evidence willpower";
app._internal.setTestState({ stageAnswers: {} });
app._internal.setAnswerDraft("USER-TEXT-PROBE", userText);
assert.strictEqual(app._internal.getTestState().stageAnswers["USER-TEXT-PROBE"], userText);

const { _internal } = app;
[
  ["landing", () => _internal.renderLanding()],
  ["about", () => _internal.renderAbout()],
  ["choice", () => _internal.renderChoice()],
  ["one-time start", () => _internal.renderOneTimeStart()]
].forEach(([surface, render]) => assert(normalize(render()).length > 20, `${surface} must render without normalizers`));

_internal.setTestState({
  packageType: "one-time", view: "report", oneTimePaid: false, sevenDayPaid: false,
  upgradePaid: false, stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
  preliminary: [], diaryEntries: [], stageVoiceSummaries: {}
});
assert.strictEqual(_internal.reportMode().mode, "urgent");
const urgent = normalize(_internal.renderReport());
assert(urgent.length > 20, "urgent content must remain visible without payment");
assert(!urgent.includes("14 хоногийн туршилт"), "urgent mode must suppress ordinary experiments");
assert(!urgent.includes("QPay"), "urgent mode must suppress payment controls");
assert(!urgent.includes("29,000₮"), "urgent mode must suppress upsell controls");

const manifest = JSON.parse(read("MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"));
assert.strictEqual(manifest.approval_status, "EMPTY_NOT_APPROVED");
assert.deepStrictEqual(manifest.replacements, []);
const catalog = read("MONGOLIAN_COPY_REVIEW_CATALOG.md");
["landing", "about", "choice", "report", "qpay", "coach", "admin", "diary", "safety"].forEach(surface =>
  assert(catalog.toLowerCase().includes(surface), `catalog must include known surface: ${surface}`)
);

console.log("mongolian-copy-audit-fixes engineering tests passed");
