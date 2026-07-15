const assert = require("assert");
const app = require("../app.js");
const { _internal } = app;

function setAnswer(value) {
  _internal.setTestState({ packageType: "one-time", view: "report", oneTimePaid: true, stageAnswers: { "S1-S04": value } });
}
setAnswer("Одоо идэвхтэй бодогдож байна");
assert.strictEqual(_internal.reportMode().mode, "urgent");
assert(_internal.renderReport().includes("Эхлээд таны аюулгүй байдал чухал"));
setAnswer("Одоо хааяа бодогддог");
assert.strictEqual(_internal.reportMode().mode, "professional");
assert(_internal.renderReport().includes("мэргэжлийн хүнтэй"));
setAnswer("Үгүй");
assert.strictEqual(_internal.reportMode().mode, "deep");
console.log("safety readiness tests passed");
