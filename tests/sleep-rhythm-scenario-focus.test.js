const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function runReport(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers,
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {}
  });
  return {
    text: normalize(_internal.renderReport()),
    ranked: _internal.rankedPatterns(true)
  };
}

const user10 = runReport({
  "S1-C02": "Эрэгтэй",
  "S1-N01": "Чанар муу",
  "S1-N02": "Ихэвчлэн",
  "S1-N03": ["Өглөө ядруу сэрдэг", "Өдөр нойрмоглодог"],
  "S1-M01": "Өдөр бага идээд орой нөхдөг",
  "S1-F01": ["Ядарсан", "Тайвширмаар байсан"],
  "S1-S04": "Үгүй"
});

assert.strictEqual(user10.ranked[0]?.key, "circadian", "WP67 user 10 must keep circadian as primary mechanism");
assert(user10.text.includes("Таны тайлан бэлэн боллоо"), "sleep report must remain the paid report");
assert(user10.text.includes("нойр, тэнхээ, хоолны хэмнэлийн зөрүү"), "sleep report must name the sleep/energy/meal-rhythm focus");
assert(user10.text.includes("Нойр"), "sleep report must include sleep wording");
assert(user10.text.includes("тэнхээ"), "sleep report must include energy wording");
assert(user10.text.includes("кофе"), "sleep report must include coffee timing wording");
assert(user10.text.includes("Өдрийн эхний хоолоо тогтмол болго"), "sleep report must give a rhythm anchor");
assert(!user10.text.includes("Стресс ихтэй үед хоол түр амрах газар"), "sleep report must not fall back to generic stress/emotional eating voice");
assert(!user10.text.includes("Дотор давчдах, санаа зовох"), "sleep report must not use regulation-specific explanation as the main voice");

const fatigueEvening = runReport({
  "S1-C02": "Эрэгтэй",
  "S1-N01": "4-6 цаг",
  "S1-N02": "Маш тод",
  "S1-N03": ["Өдөр нойрмоглодог"],
  "S1-M01": "Өдөр бага идээд орой нөхдөг",
  "S1-M03": "Нэлээд нөлөөлдөг",
  "S1-L02": ["Чихэртэй ундаа/кофе", "Гэрт байсан амар сонголт"],
  "S1-S04": "Үгүй"
});

assert.strictEqual(fatigueEvening.ranked[0]?.key, "circadian", "similar fatigue + evening eating path must prefer circadian");
assert(fatigueEvening.text.includes("нойр, тэнхээ, хоолны хэмнэлийн зөрүү"), "similar sleep path must use the sleep/rhythm focus");
assert(fatigueEvening.text.includes("кофе"), "similar sleep path must mention coffee timing");
assert(!fatigueEvening.text.includes("Стресс ихтэй үед хоол түр амрах газар"), "similar sleep path must not become generic stress report");

console.log("sleep-rhythm-scenario-focus tests passed");
