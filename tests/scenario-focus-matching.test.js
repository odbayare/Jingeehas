const assert = require("assert");
const app = require("../app.js");

const { _internal, mechanismNamesByKey } = app;
const M = mechanismNamesByKey;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function run(stageAnswers, stageSummaryText = "") {
  const stageVoiceSummaries = stageSummaryText
    ? {
        "S1-V01": app.createConfirmedSummaryObject({
          kind: "stage",
          id: "S1-V01",
          rawText: stageSummaryText,
          structured: stageAnswers,
          aiSummaryBullets: [stageSummaryText],
          mode: "confirm"
        })
      }
    : {};
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    stageAnswers: {
      ...stageAnswers,
      ...(stageSummaryText ? { "S1-V01": stageSummaryText } : {})
    },
    stageVoiceSummaries,
    preliminary: [],
    diaryEntries: []
  });
  return {
    text: normalize(_internal.renderReport()),
    ranked: _internal.rankedPatterns(true),
    state: _internal.getTestState()
  };
}

function assertFocus(label, result, expectedKey, requiredPhrases, forbiddenGenericStress = true) {
  assert.strictEqual(result.ranked[0]?.key, expectedKey, `${label}: primary focus`);
  const lowerText = result.text.toLowerCase();
  const stuckStart = result.text.indexOf("1. Энэ тайлан юунд тулгуурласан бэ?");
  const stuckEnd = result.text.indexOf("2. Таны гол давтагдаж буй механизм");
  const stuck = result.text.slice(stuckStart, stuckEnd);
  requiredPhrases.forEach(phrase => {
    assert(lowerText.includes(phrase.toLowerCase()) || stuck.toLowerCase().includes(phrase.toLowerCase()), `${label}: missing scenario phrase ${phrase}`);
  });
  if (forbiddenGenericStress) {
    assert(
      !stuck.includes("Стресс ихтэй үед хоол танд түр амрах газар шиг болж байна"),
      `${label}: must not fall back to generic stress`
    );
  }
}

assertFocus(
  "sleep/rhythm male",
  run({
    "S1-C02": "Эрэгтэй",
    "S1-W02": ["Нойр муудсан"],
    "S1-N01": "4-6 цаг",
    "S1-N02": "Ихэвчлэн",
    "S1-N03": ["Өглөө ядруу сэрдэг"],
    "S1-F01": ["Ядарсан"]
  }, "Нойр муу, өглөө ядруу, өдөр нойрмог, орой амттай юм татдаг."),
  "circadian",
  ["Нойр", "тэнхээ"]
);

assertFocus(
  "night work male",
  run({
    "S1-C02": "Эрэгтэй",
    "S1-N01": "Тогтворгүй",
    "S1-L02": ["Хоол захиалах"],
    "S1-V01": "Шөнийн ээлжийн дараа унтах цаг, хоолны цаг зөрж ойр дэлгүүрийн хоол авдаг."
  }, "Шөнийн ээлж, унтах цаг, хоолны цагийн зөрүү давтагддаг."),
  "circadian",
  ["Шөнийн ээлж", "унтах цаг", "хоолны цаг"]
);

assertFocus(
  "cue/snacking unknown gender",
  run({
    "S1-C02": "Хариулахгүй",
    "S1-L02": ["Ойр байсан зууш"],
    "S1-L04": "Харагдвал бараг автоматаар иддэг",
    "S1-L05": "Ихэвчлэн",
    "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"]
  }, "Гэрээс ажиллах үед ширээн дээрх зууш, апп, зураг нүдэнд ойр байдаг."),
  "cue",
  ["Зууш", "нүдэнд ойр", "гар"]
);

assertFocus(
  "family leftovers female",
  run({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Үгүй, хамаарахгүй",
    "S1-L03": ["Бусдын хэрэгцээ", "Гэр бүл"],
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
    "S1-V01": "Гэр бүлийн хоол, үлдэгдэл, хүүхдийн хэрэгцээ түрүүлээд өөрийн хоол амралт хойшилдог."
  }, "Бусдын хэрэгцээ түрүүлж, өөрийн хоол амралт хойшлогддог."),
  "roleOverload",
  ["бусдын хэрэгцээ", "өөрийн хоол"]
);

assertFocus(
  "strict diet rebound male",
  run({
    "S1-C02": "Эрэгтэй",
    "S1-W04": ["Завсарлагатай мацаг / мацаг барих", "Орой хоол идэхгүй байх"],
    "S1-W06": "Маргааш илүү чанга барина гэж боддог",
    "S1-X03": "Ихэвчлэн тэгдэг",
    "S1-F02": "Одоо бүх юм дууссан"
  }, "Өнөөдөр өнгөрлөө, маргааш илүү чанга барина гэж дахин эхэлдэг."),
  "collapse",
  ["Нэг удаа", "дараагийн хоол"]
);

assertFocus(
  "weekend social male",
  run({
    "S1-C02": "Эрэгтэй",
    "S1-F01": ["Татгалзах эвгүй байсан"],
    "S1-V01": "Амралтын өдөр найзууд, согтууруулах ундаа хэрэглэсэн орой, хүмүүсийн дунд татгалзах эвгүй."
  }, "Амралтын өдөр найз нөхөдтэй байхад татгалзах эвгүй."),
  "social",
  ["Амралтын өдөр", "татгалзах"]
);

assertFocus(
  "stress emotional eating female",
  run({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Үгүй, хамаарахгүй",
    "S1-E01": "Ихэвчлэн тэгдэг",
    "S1-E02": ["Стресс", "Санаа зовнил"],
    "S1-F01": ["Тайвширмаар байсан"],
    "S1-F02": "Тайвширдаг"
  }, "Стресс өндөр үед идээд хэсэг тайвширдаг."),
  "regulation",
  ["Стресс", "тайвш"],
  false
);

console.log("scenario-focus-matching tests passed");
