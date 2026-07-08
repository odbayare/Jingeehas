const assert = require("assert");
const app = require("../app.js");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setState(nextState) {
  app._internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: true,
    upgradePaid: true,
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    diaryEntries: [],
    diaryDraft: {},
    ...nextState
  });
}

function run() {
  const gate = app.stageOneQuestions.find(question => question.id === "MC-GATE");
  assert(gate, "menstrual gate question should exist");
  assert.strictEqual(gate.text, "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?");
  assert(gate.options.includes("Тийм, хамаарна"));
  assert(gate.options.includes("Үгүй, хамаарахгүй"));

  setState({ stageAnswers: { "S1-C02": "Эмэгтэй", "MC-GATE": "Үгүй, хамаарахгүй" } });
  let visibleIds = app._internal.stageQuestions().map(question => question.id);
  assert(visibleIds.includes("MC-GATE"), "gate should remain visible");
  assert(!visibleIds.includes("MC-01"), "menstrual module should be skipped when gate is no");

  setState({ stageAnswers: { "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна" } });
  visibleIds = app._internal.stageQuestions().map(question => question.id);
  assert(visibleIds.includes("MC-01"), "menstrual module should render when gate is yes");
  assert(visibleIds.includes("MC-07"), "cycle disruption safety question should render when active");

  const functionQuestion = app.stageOneQuestions.find(question => question.id === "S1-F01");
  const cravingQuestion = app.stageOneQuestions.find(question => question.id === "S1-R02");
  const dailyFunctionQuestion = app.dailyCore.find(question => question.id === "D-C05");
  assert(functionQuestion.options.includes("Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан"));
  assert(cravingQuestion.options.includes("Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"));
  assert(dailyFunctionQuestion.options.includes("Сарын тэмдэгтэй холбоотой мэт санагдсан"));

  setState({
    packageType: "seven-day",
    stageAnswers: { "S1-C02": "Эмэгтэй", "MC-GATE": "Үгүй, хамаарахгүй" },
    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" },
    preliminary: [{ key: "reward" }]
  });
  let diaryIds = app._internal.getDiaryQuestions().map(question => question.id);
  assert(!diaryIds.includes("D-MC-01"), "daily menstrual questions should not render when inactive");

  setState({
    packageType: "seven-day",
    stageAnswers: { "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна" },
    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" },
    preliminary: [{ key: "reward" }]
  });
  diaryIds = app._internal.getDiaryQuestions().map(question => question.id);
  assert(diaryIds.includes("D-MC-01"), "daily menstrual phase question should render when active");
  assert(diaryIds.includes("D-MC-02"), "daily menstrual appetite question should render when active");
  assert(!diaryIds.includes("D-MC-03"), "third daily cycle question should wait for cycle-linked answer");

  setState({
    packageType: "seven-day",
    stageAnswers: { "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна" },
    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа", cycle_today_link: "Тийм, амттай юм илүү хүссэн" },
    preliminary: [{ key: "reward" }]
  });
  diaryIds = app._internal.getDiaryQuestions().map(question => question.id);
  assert(diaryIds.includes("D-MC-03"), "third daily cycle question should render after a cycle-linked answer");

  setState({
    stageAnswers: {
      "S1-C01": "33",
      "S1-R01": "Нэлээд олон удаа",
      "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"],
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Тогтмол, ойролцоогоор 21–35 хоног",
      "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
      "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Ядаргаа, нойр муудахтай давхцдаг"],
      "S1-S04": "Үгүй"
    }
  });
  let evidence = app._internal.menstrualCycleEvidence();
  assert(evidence.active, "cycle evidence should be active");
  assert(evidence.premenstrual, "premenstrual appetite evidence should be detected");
  const ranked = app._internal.rankedPatterns(false);
  assert(!ranked.some(item => item.key === "menstrual_cycle_context"), "cycle context should not become a primary mechanism");
  let report = normalize(app._internal.renderReport());
  assert(report.includes("Таны тайлан бэлэн боллоо"), "ordinary paid report should use the clear WP62 report opening");
  assert(report.includes("1. Энэ тайлан юунд тулгуурласан бэ?"), "ordinary paid report should include the clear main-blockage section");
  assert(report.includes("2. Таны гол давтагдаж буй механизм"), "ordinary paid report should explain why it repeats");
  assert(report.includes("8. 7–14 хоногийн туршилт"), "ordinary paid report should include one 14-day experiment");

  const deterministicBanned = [
    "даавраас болж байна",
    "энэ бол PMS",
    "энэ бол PCOS",
    "сарын тэмдэг ирэхийн өмнө заавал илүү иддэг",
    "эмэгтэй хүмүүс бүгд"
  ];
  deterministicBanned.forEach(phrase => {
    assert(!report.includes(phrase), `report should avoid deterministic cycle copy: ${phrase}`);
  });

  setState({
    stageAnswers: {
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Сүүлийн 3 сард ирээгүй",
      "S1-S04": "Үгүй"
    }
  });
  evidence = app._internal.menstrualCycleEvidence();
  assert(evidence.professionalCheck, "isolated missed period should be a professional-check signal");
  assert(!evidence.professionalFirst, "isolated missed period should not force professional-first");
  assert.notStrictEqual(app._internal.reportMode().mode, "urgent", "isolated cycle irregularity should not trigger Mode 4");

  setState({
    stageAnswers: {
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Ихэнхдээ тогтмол биш",
      "MC-06": ["PCOS оноштой эсвэл сэжигтэй"],
      "S1-B02": "Тийм, санаа зовоосон",
      "S1-S04": "Үгүй"
    }
  });
  assert.strictEqual(app._internal.reportMode().mode, "professional", "irregular cycle plus PCOS/glucose concern should route professional-first");
  report = normalize(app._internal.renderReport());
  assert(report.includes("өдрөөр нь хатуу тайлбарлах хэрэггүй"), "confidence-lowering conditions should appear as low-confidence copy");

  setState({
    stageAnswers: {
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Сүүлийн 3 сард ирээгүй",
      "MC-07": "Тийм",
      "S1-W04": ["Мацаг", "Фитнесийн богино сорил"],
      "S1-S04": "Үгүй"
    }
  });
  assert.strictEqual(app._internal.reportMode().mode, "professional", "missed periods plus restriction/exercise concern should route professional-first");
  report = normalize(app._internal.renderReport());
  assert(report.includes("Мөчлөгтэй холбоотой аюулгүй дараалал"), "professional report should explain cycle safety branch");
  assert(!report.includes("14 хоногийн туршилт"), "professional-first cycle branch should suppress ordinary experiment");

  setState({
    stageAnswers: {
      "S1-C01": "33",
      "S1-S04": "Одоо идэвхтэй бодогдож байна",
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-04": ["Илүү өлсдөг"]
    },
    safetyFlags: ["S1-S04:urgent"]
  });
  report = normalize(app._internal.renderReport());
  assert(report.includes("Яаралтай аюулгүй байдлын зөвлөмж"), "Mode 4 urgent safety should remain unchanged");
  assert(!report.includes("9,900₮ төлөөд"), "Mode 4 should not show commercial CTA");

  const virtualCycleUsers = [
    {
      name: "Cycle User A",
      state: {
        stageAnswers: {
          "S1-C01": "31",
          "S1-R01": "Нэлээд олон удаа",
          "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"],
          "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
          "MC-01": "Тогтмол, ойролцоогоор 21–35 хоног",
          "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
          "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг"],
          "S1-S04": "Үгүй"
        }
      },
      expectedMode: "deep",
      expectedCopy: "Таны тайлан бэлэн боллоо"
    },
    {
      name: "Cycle User B",
      state: {
        stageAnswers: {
          "S1-C01": "36",
          "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
          "MC-01": "Ихэнхдээ тогтмол биш",
          "MC-06": ["PCOS оноштой эсвэл сэжигтэй"],
          "S1-B02": "Тийм, санаа зовоосон",
          "S1-S04": "Үгүй"
        }
      },
      expectedMode: "professional",
      expectedCopy: "өдрөөр нь хатуу тайлбарлах хэрэггүй"
    },
    {
      name: "Cycle User C",
      state: {
        stageAnswers: {
          "S1-C01": "27",
          "S1-W04": ["Мацаг"],
          "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
          "MC-01": "Сүүлийн 3 сард ирээгүй",
          "MC-07": "Тийм",
          "S1-S04": "Үгүй"
        }
      },
      expectedMode: "professional",
      expectedCopy: "Мөчлөгтэй холбоотой аюулгүй дараалал"
    }
  ];

  virtualCycleUsers.forEach(user => {
    setState(user.state);
    assert.strictEqual(app._internal.reportMode().mode, user.expectedMode, `${user.name} should route to expected mode`);
    assert(normalize(app._internal.renderReport()).includes(user.expectedCopy), `${user.name} should include expected report copy`);
  });
}

run();
console.log("menstrual-cycle-context tests passed");
