const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function cycleText(html) {
  const marker = '<div class="cycle-map">';
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const rest = html.slice(start + marker.length);
  const end = rest.indexOf("</div>");
  return normalize(end >= 0 ? rest.slice(0, end) : rest);
}

function setOneTime(stageAnswers = {}, extras = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    diaryEntries: [],
    ...extras
  });
  return _internal.renderReport();
}

function setSevenDay(stageAnswers = {}, diaryEntries = [], extras = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    internalTest: true,
    oneTimePaid: false,
    sevenDayPaid: true,
    upgradePaid: false,
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    diaryEntries,
    ...extras
  });
  return _internal.renderReport();
}

function rewardDiaryEntries() {
  return Array.from({ length: 5 }, (_, index) => ({
    day_number: index + 1,
    meal_rhythm: "2-3 тогтмол хоол",
    unplanned_eating_count: "Тийм, 1 удаа",
    food_function: ["Амттай юм хүссэн", "Өөрийгөө шагнамаар байсан"],
    hunger_level: "3",
    energy_score: "4",
    stress_score: "4",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {
      reward_driver: "Тийм"
    }
  }));
}

function collapseDiaryEntries() {
  return Array.from({ length: 5 }, (_, index) => ({
    day_number: index + 1,
    meal_rhythm: "2-3 тогтмол хоол",
    unplanned_eating_count: "Тийм, 1 удаа",
    food_function: ["Өнөөдөр өнгөрлөө"],
    hunger_level: "4",
    energy_score: "5",
    stress_score: "5",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {
      collapse_rule: "Маш тод"
    }
  }));
}

function run() {
  const rewardOneTimeHtml = setOneTime({
    "S1-V01": "Өдөржин бусдын хэрэгцээ түрүүлээд өөрийн хоол, амралт хойшлогддог. Орой амттай юм идмээр санагддаг.",
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
    "S1-F01": ["Өөрийгөө жаахан шагнамаар санагдсан"]
  });
  const rewardOneTime = normalize(rewardOneTimeHtml);
  assert(rewardOneTime.includes("амттай зүйл"), "reward-deficit report should keep broad tasty-food wording");
  assert(!rewardOneTime.includes("зүгээр амттан хүссэн асуудал биш"), "reward-deficit report should not narrow the craving to sweets");
  assert(!rewardOneTime.includes("Гол гацалт Гол гацалт"), "report should not duplicate the main-stuck heading");
  assert(!cycleText(rewardOneTimeHtml).includes(" 4."), "reward cycle text should not contain stray trailing numbers");

  const collapseOneTimeHtml = setOneTime({
    "S1-W03": "Бараг бүх оролдлогоос хойш",
    "S1-W06": "Өнөөдөр өнгөрлөө, маргаашаас",
    "S1-F02": "Одоо бүх юм дууссан",
    "S1-X03": "Маш хүчтэй"
  });
  const collapseOneTime = normalize(collapseOneTimeHtml);
  assert(collapseOneTime.includes("боломжит хэв маяг"), "one-time report should keep natural uncertainty language");
  assert(!collapseOneTime.includes("Эхний жижиг өөрчлөлт"), "one-time report should avoid mechanical first-change wording");
  assert(!cycleText(collapseOneTimeHtml).includes(" 4."), "collapse cycle text should not contain stray trailing numbers");

  const rewardSevenDay = normalize(setSevenDay({
    "S1-V01": "Өөрийн хэрэгцээ өдөржин хойшлогдоод орой амттай зүйл хүсдэг."
  }, rewardDiaryEntries()));
  assert(rewardSevenDay.includes("Хамгийн хялбар эхлэх цэг") || rewardSevenDay.includes("Авч хэрэгжүүлж болох эхний алхам"), "seven-day report should use natural first-step wording");
  assert(!rewardSevenDay.includes("Эхний жижиг өөрчлөлт"), "seven-day report should avoid mechanical first-change wording");

  const compressedCycle = normalize(setSevenDay({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Тийм, хамаарна",
    "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
    "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг"],
    "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"]
  }, rewardDiaryEntries()));
  assert(compressedCycle.includes("Сарын тэмдэг ирэхээс өмнөх"), "compressed seven-day report should keep menstrual-cycle meaning");
  assert(!compressedCycle.includes("Эхний жижиг өөрчлөлт"), "compressed seven-day report should avoid mechanical first-change wording");

  const bodySafety = normalize(setOneTime({
    "S1-B01": ["Сахар унасан мэт", "Толгой эргэх"],
    "S1-S03": "Одоо давтагддаг"
  }));
  assert(bodySafety.includes("мэргэжлийн хүнтэй ярилцах"), "body-signal route should keep professional safety guidance");
  assert(bodySafety.includes("хоолоо огцом хасах") || bodySafety.includes("мацаг"), "body-signal route should not weaken safety caution");

  const collapseSevenDay = normalize(setSevenDay({
    "S1-W06": "Өнөөдөр өнгөрлөө, маргаашаас",
    "S1-F02": "Одоо бүх юм дууссан"
  }, collapseDiaryEntries()));
  assert(!collapseSevenDay.includes("Гол гацалт Гол гацалт"), "seven-day report should not duplicate the main-stuck heading");
  assert(!collapseSevenDay.includes("Эхний жижиг өөрчлөлт"), "seven-day collapse report should avoid mechanical first-change wording");
}

run();
console.log("wp73 report voice copy cleanup tests passed");
