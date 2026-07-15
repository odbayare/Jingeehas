const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-W04": ["Мацаг"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
    },
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    removedEntries: [],
    ...overrides
  });
}

(async () => {
  assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
  assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, false, "runtime visible guard must remain false while wiring is blocked");
  assert.strictEqual(typeof _internal.renderReportWithRuntimeVisibleSurface, "function", "runtime integration helper must exist");

  const baseHtml = `
    <section class="screen">
      <div class="panel runtime-report-base">
        <h2>Runtime report base</h2>
      </div>
    </section>
  `;

  const enabledWithoutPayload = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    { mode: { mode: "ordinary" } },
    null,
    { enabled: true, hasPaidAccess: true, placement: "before-section-end" }
  );

  assert.strictEqual(enabledWithoutPayload.pass, false, "enabled runtime integration without adapter payload must fail closed");
  assert.strictEqual(enabledWithoutPayload.html, baseHtml, "failed integration must preserve original report HTML");
  assert.deepStrictEqual(enabledWithoutPayload.renderedSurfaces, [], "failed integration must not report visible surfaces");
  assert(
    enabledWithoutPayload.errors.some(error => error.includes("requires an adapter payload")),
    "enabled runtime integration must report missing adapter payload blocker"
  );

  setOneTime();
  const reportHtml = _internal.renderReport();
  assert(!reportHtml.includes("visible-surface-prototype"), "real renderReport output must not claim visible surfaces when guard remains false");
  assert(!reportHtml.includes("Эхний товч зураглал"), "real renderReport output must not show preview surface while blocked");
  assert(!reportHtml.includes("Дэлгэрэнгүй тайлангийн хэсэг"), "real renderReport output must not show paid surface while blocked");
  assert(!reportHtml.includes("Аюулгүй байдлын сануулга"), "real renderReport output must not show runtime visible safety surface while blocked");

  console.log("public-visible-surface-enable hold tests passed");
})();
