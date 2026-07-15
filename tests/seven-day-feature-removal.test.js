const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const backend = require("../mockBackend.js");

app._internal.setTestState({
  packageType: "seven-day",
  view: "diaryHome",
  oneTimePaid: true,
  sevenDayPaid: true,
  diaryEntries: [{ day: 1 }]
});
const migrated = app._internal.getTestState();
assert.strictEqual(migrated.packageType, "one-time");
assert.strictEqual(migrated.view, "report");
assert(!Object.prototype.hasOwnProperty.call(migrated, "sevenDayPaid"));
assert(!Object.prototype.hasOwnProperty.call(migrated, "diaryEntries"));

assert.throws(() => backend.createAssessment("seven_day"), /Unsupported assessment type/);
assert.deepStrictEqual(Object.keys(backend.PRODUCT_AMOUNTS), ["one_time"]);
assert(!app._internal.renderChoice().includes("29,000"));
assert(!app._internal.renderLanding().includes("7 хоногийн богино тэмдэглэл"));
assert(!app._internal.renderLanding().includes("Орой бүр 3–5 минут"));

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
assert(source.includes("function migrateLegacySevenDayState"));
const guard = fs.readFileSync(require.resolve("../tools/assert-seven-day-feature-removed.mjs"), "utf8");
assert(guard.includes("7\\s*(?:хоногийн|өдрийн)\\s+(?:богино\\s+)?тэмдэглэл"));
assert(guard.includes("Орой бүр 3–5 минут"));
console.log("seven-day feature removal tests passed");
