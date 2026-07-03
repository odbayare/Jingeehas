const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

const FORBIDDEN_VISIBLE_TEXT = [
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "internalDiagnostics",
  "ownerDebug",
  "fixtureName",
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control",
  "test_only",
  "QPay",
  "payment",
  "unlock",
  "premium",
  "diagnosis",
  "diagnose",
  "treatment",
  "treat",
  "medical cause",
  "medical-cause",
  "prescribe",
  "₮"
];

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-W04": ["Мацаг"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
    },
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    diaryEntries: [],
    ...overrides
  });
}

function diaryEntry(overrides = {}) {
  return {
    day_number: 1,
    meal_rhythm: "Тогтвортой, хоол алгасаагүй",
    unplanned_eating_count: "Үгүй",
    stress_score: 3,
    energy_score: 6,
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
}

function setSevenDay(overrides = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: true,
    upgradePaid: false,
    preliminary: [{ key: "hungerSafety", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: [
      diaryEntry({ day_number: 1 }),
      diaryEntry({ day_number: 2 }),
      diaryEntry({ day_number: 3 }),
      diaryEntry({ day_number: 4 }),
      diaryEntry({ day_number: 5 })
    ],
    ...overrides
  });
}

function visibleSurfaceHtml(html) {
  return String(html)
    .split('<section class="visible-surface-prototype"')
    .slice(1)
    .map(part => `<section class="visible-surface-prototype"${part.split("</section>")[0]}</section>`)
    .join("\n");
}

function assertNoForbiddenVisibleText(html, label) {
  const visibleHtml = visibleSurfaceHtml(html);
  FORBIDDEN_VISIBLE_TEXT.forEach(text => {
    assert(!visibleHtml.includes(text), `${label}: visible surfaces leaked ${text}`);
  });
}

function assertSurfaces(html, expected, label) {
  assert(html.includes("visible-surface-prototype"), `${label}: real renderReport output must include visible surfaces`);
  assert.strictEqual(
    html.includes('data-surface="preview"'),
    expected.includes("preview"),
    `${label}: preview surface mismatch`
  );
  assert.strictEqual(
    html.includes('data-surface="paid"'),
    expected.includes("paid"),
    `${label}: paid surface mismatch`
  );
  assert.strictEqual(
    html.includes('data-surface="safety"'),
    expected.includes("safety"),
    `${label}: safety surface mismatch`
  );
  assert.strictEqual(
    html.includes("Эхний товч зураглал"),
    expected.includes("preview"),
    `${label}: preview heading mismatch`
  );
  assert.strictEqual(
    html.includes("Гүн тайлангийн хэсэг"),
    expected.includes("paid"),
    `${label}: paid heading mismatch`
  );
  assert(html.includes("Аюулгүй байдлын сануулга"), `${label}: safety heading must be visible`);
  assertNoForbiddenVisibleText(html, label);
}

function assertNoPaymentMutation(before, label) {
  const after = mockBackend.getMockBackendState();
  assert.deepStrictEqual(after.payments, before.payments, `${label}: payments must not mutate`);
  assert.deepStrictEqual(after.entitlements, before.entitlements, `${label}: entitlements must not mutate`);
}

mockBackend.resetMockBackend();
assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible guard must be enabled for WP28");

setOneTime({ oneTimePaid: false });
const unpaidBackendBefore = mockBackend.getMockBackendState();
const unpaid = _internal.renderReport();
assertSurfaces(unpaid, ["preview", "safety"], "ordinary unpaid report");
assert(!unpaid.includes('data-surface="paid"'), "ordinary unpaid report must not render paid surface");
assertNoPaymentMutation(unpaidBackendBefore, "ordinary unpaid report");

setOneTime({ oneTimePaid: true });
const paidBackendBefore = mockBackend.getMockBackendState();
const paid = _internal.renderReport();
assertSurfaces(paid, ["preview", "paid", "safety"], "ordinary paid report");
assertNoPaymentMutation(paidBackendBefore, "ordinary paid report");

setSevenDay({
  diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })]
});
assert.strictEqual(_internal.reportMode().mode, "professional", "professional setup must route to professional mode");
const professional = _internal.renderReport();
assertSurfaces(professional, ["safety"], "professional report");
assert(!professional.includes('data-surface="preview"'), "professional report must suppress preview");
assert(!professional.includes('data-surface="paid"'), "professional report must suppress paid");

setSevenDay({
  diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })]
});
assert.strictEqual(_internal.reportMode().mode, "urgent", "urgent setup must route to urgent mode");
const urgent = _internal.renderReport();
assertSurfaces(urgent, ["safety"], "urgent report");
assert(!urgent.includes('data-surface="preview"'), "urgent report must suppress preview");
assert(!urgent.includes('data-surface="paid"'), "urgent report must suppress paid");

console.log("public-visible-surface-enable-live tests passed");
