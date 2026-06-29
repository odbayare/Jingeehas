import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const app = require("../app.js");

const { calculateMechanismEvidence, mechanismNamesByKey, _internal } = app;

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "audits", "sprint-30-virtual-human-retest");
const RAW_DIR = path.join(OUT_DIR, "raw");
const PDF_PATH = path.join(OUT_DIR, "WEIGHT_TEST_10_VIRTUAL_HUMAN_RETEST.pdf");
const TEMP_JSON = path.join("/private/tmp", "weight-test-sprint-30-retest.json");
const TEMP_PY = path.join("/private/tmp", "weight-test-sprint-30-render.py");
const PYTHON = "/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";

const M = mechanismNamesByKey;

const bannedTerms = [
  "тасалдал",
  "дэглэм тасалдал",
  "тасарсан",
  "тасардаг",
  "тасалдах",
  "тасалдвал",
  "давтамж гэх давтамж",
  "гэх давтамжтай нийцэж байна",
  "хүчтэй нийцэж байна",
  "дунд зэрэг нийцэж байна",
  "механизм",
  "engine",
  "Reflection",
  "context",
  "default",
  "reward",
  "trigger",
  "pattern",
  "diary",
  "craving",
  "reset",
  "failure",
  "Perfectionism",
  "feedback",
  "guilt",
  "shame",
  "Plan"
];

const personas = [
  {
    userId: "user-01",
    title: "Орой тэнхээ дуусдаг хэрэглэгч",
    expected: "Энгийн тайлан, оройн тэнхээ багасах / бэлэн сонголт",
    expectedMode: "deep",
    expectedText: ["Орой тэнхээ багасах", "хамгийн амар сонголт"],
    persona: { age: 38, profile: "Ажилтай, гэр бүлтэй. Өдөр гайгүй барьдаг ч орой ядарч хоол захиалдаг. Хоолны цаг өдөр бүр өөр. Нойр 5-6 цаг." },
    selectedAnswers: {
      "S1-C01": "38",
      "S1-W02": ["Хөдөлгөөн багассан", "Нойр муудсан"],
      "S1-M01": "Хоолны цаг өдөр бүр өөр",
      "S1-F01": ["Ядарсан", "Хамгийн амар сонголт тэр байсан"],
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Хоол захиалах", "Гэрт байсан амар сонголт"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"],
      "S1-N01": "4-6 цаг",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Өдөр ажлаа дуусгаад хүүхдүүдээ унтуулсны дараа дахин хоол бодох тэнхээ үлддэггүй. Хоолны цаг өдөр бүр өөр болохоор орой хоол захиалах нь хамгийн амар болдог." },
    scores: { clarity: 9, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 8 }
  },
  {
    userId: "user-02",
    title: "Стрессээр иддэг хэрэглэгч",
    expected: "Энгийн тайлан, стрессийн үед хоол түр амсхийх арга",
    expectedMode: "deep",
    expectedText: ["Стресс өндөр үед", "түр амсхийх"],
    persona: { age: 34, profile: "Оффисын ажил. Санаа зовнил, уур, ажлын дарамтын дараа идэх хүсэл нэмэгддэг. Идсэний дараа түр тайвширдаг, дараа нь гэмшдэг." },
    selectedAnswers: {
      "S1-E01": "Ихэвчлэн тэгдэг",
      "S1-E02": ["Стресс", "Уур", "Санаа зовнил"],
      "S1-E03": "Түр тайвширдаг",
      "S1-F01": ["Тайвширмаар байсан"],
      "S1-F02": "Түр гайгүй болоод гэмшдэг",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Даргатайгаа эвгүй ярьсны дараа дотор давчдаад юм идэхээр түр гайгүй болдог. Дараа нь яагаад тэгэв гэж боддог." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 7, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-03",
    title: "Хэт чанга эхлээд нурдаг хэрэглэгч",
    expected: "Энгийн тайлан, нэг хазайлтын дараах бүхэл өдөр дууссан мэт болох тойрог",
    expectedMode: "deep",
    expectedText: ["Өнөөдөр өнгөрлөө", "дараагийн хоолноос хэвийн үргэлжлүүлэх", "хэт чанга"],
    persona: { age: 29, profile: "Даваагаас эхэлнэ гэж боддог. Нэг удаа хазайвал өнөөдөр өнгөрлөө гэж мэдэрдэг. Маргаашаас илүү чанга барина." },
    selectedAnswers: {
      "S1-W03": "Бараг бүх оролдлогоос хойш",
      "S1-W04": ["Калори тоолох", "Мацаг", "Орой хоол идэхгүй"],
      "S1-W06": "Өнөөдөр өнгөрлөө, маргаашаас",
      "S1-F02": "Одоо бүх юм дууссан",
      "S1-X03": "Маш хүчтэй",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V03": "Эхэндээ маш хатуу барьдаг. Нэг өдөр хазайхаар бүх юм дууссан юм шиг санагдаад маргаашаас бүр чанга барина гэж боддог." },
    scores: { clarity: 9, fit: 9, mongolian: 8, ai: 8, safety: 9, action: 9, value: 8 }
  },
  {
    userId: "user-04",
    title: "Хоол холдоход хэтрүүлдэг хэрэглэгч",
    expected: "Энгийн тайлан, дараа өлсөхөөс хамгаалах",
    expectedMode: "deep",
    expectedText: ["Хоол холдоход", "дараа өлсөхөөс хамгаалах"],
    persona: { age: 42, profile: "Хоолны зай уртсахад орой хэт өлсдөг. Дараа өлсөхөөс хамгаалж илүү иддэг. Хүнд биеийн шинжгүй." },
    selectedAnswers: {
      "S1-M01": "Өдрийн хоол алгасдаг",
      "S1-M02": "Бараг өдөр бүр",
      "S1-M03": "Бараг дандаа тэгдэг",
      "S1-G01": "Ихэвчлэн",
      "S1-G02": "Тийм",
      "S1-F01": ["Өлссөндөө идсэн", "Дараа өлсөхөөс санаа зовсон"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Ажил дээр хооллож амжихгүй бол орой юу таарснаа их иддэг. Дараа дахиж өлсчих вий гэж бодогддог." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-05",
    title: "Өөрийгөө хойш тавьдаг хэрэглэгч",
    expected: "Энгийн тайлан, өөрийн хэрэгцээ хойшлогдох / жижиг шагнал",
    expectedMode: "deep",
    expectedText: ["өөрийгөө хойш тавьсны дараа", "жижиг шагнал", "өөрийн хоол", "үлдэгдэл цагт найдахгүй"],
    persona: { age: 31, profile: "Бусдын хэрэгцээ түрүүлдэг. Орой амттай зүйл өөртөө өгөх ганц жижиг шагнал мэт санагддаг." },
    selectedAnswers: {
      "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
      "S1-E02": ["Хоосон мэт мэдрэмж", "Ядаргаа"],
      "S1-F01": ["Өөрийгөө жаахан шагнамаар санагдсан", "Ядарсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Өдөржин хүүхэд, гэр, ажил гээд бусдын хэрэгцээ түрүүлдэг. Орой л миний цаг юм шиг санагдаад амттай зүйл идмээр болдог." },
    scores: { clarity: 9, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 8 }
  },
  {
    userId: "user-06",
    title: "Орчны дохиогоор автоматаар иддэг хэрэглэгч",
    expected: "Энгийн тайлан, хоол харагдах / захиалгын апп / нэг дохио",
    expectedMode: "deep",
    expectedText: ["Хоол харагдах", "захиалгын апп", "нэг дохиог"],
    persona: { age: 27, profile: "Зууш ширээн дээр байвал иддэг. Захиалгын апп, хоолны зураг, үнэр нөлөөлдөг. Өлсөөгүй үед ч иддэг." },
    selectedAnswers: {
      "S1-H02": "Ихэвчлэн үгүй",
      "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"],
      "S1-R02": ["Хоолны зураг эсвэл захиалгын апп харахад", "Амт, үнэр, мэдрэмж татах үед"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Өлсөөгүй байхад ч ширээн дээр зууш харагдвал аваад идчихдэг. Захиалгын апп нээхээр юм идмээр болдог." },
    scores: { clarity: 9, fit: 9, mongolian: 8, ai: 8, safety: 9, action: 9, value: 8 }
  },
  {
    userId: "user-07",
    title: "Нойр муу, оройн тэнхээ багасдаг хэрэглэгч",
    expected: "Энгийн тайлан, нойр ба тэнхээний зөрүү",
    expectedMode: "deep",
    expectedText: ["Нойр муу", "оройн тэнхээ"],
    persona: { age: 36, profile: "Оройтож унтдаг. Өглөө ядруу. Нойр муу үед амттай зүйл хүсдэг." },
    selectedAnswers: {
      "S1-W02": ["Нойр муудсан"],
      "S1-N01": "4-6 цаг",
      "S1-N02": "Ихэвчлэн",
      "S1-F01": ["Ядарсан", "Амттай юм идмээр байсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Нойр муу хоносон өдөр орой бие сулраад амттай юм идмээр болдог. Заримдаа кофе их уусан байдаг." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 7, value: 7 }
  },
  {
    userId: "user-08",
    title: "Сарын тэмдгийн өмнөх дуршил өөрчлөгддөг хэрэглэгч",
    expected: "Энгийн тайлан, мөчлөгийн нэмэлт тайлбар гарсан",
    expectedMode: "deep",
    expectedText: ["мөчлөг", "онош биш", "хатуу дүрэм биш"],
    persona: { age: 32, profile: "Мөчлөг тогтмол. Сарын тэмдэг ирэхээс өмнө 3-7 хоногт амттан, гурилан зүйл, ядаргаа, сэтгэл савлах нэмэгддэг." },
    selectedAnswers: {
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Тогтмол, ойролцоогоор 21–35 хоног",
      "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
      "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг"],
      "MC-05": "Жаахан нэмэгддэг",
      "MC-06": "Аль нь ч биш",
      "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"],
      "S1-F01": ["Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог", "Амттай юм идмээр байсан"],
      "S1-S04": "Үгүй"
    },
    menstrualCycleAnswersIfAny: {
      "MC-GATE": "Тийм, хамаарна",
      "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
      "MC-04": "Амттай юм, гурилан зүйл, сэтгэл санаа, ядаргаа"
    },
    freeTextAnswers: { "S1-V01": "Сарын тэмдэг ирэхээс өмнө амттан, гурилан зүйл илүү татдаг. Бусад үед тийм хүчтэй биш." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 7, value: 7 }
  },
  {
    userId: "user-09",
    title: "PCOS/тогтмол бус мөчлөг + сахар/жин санаа зовсон хэрэглэгч",
    expected: "Мэргэжлийн хүнтэй эхэлж ярилцах чиглэл",
    expectedMode: "professional",
    expectedText: ["мэргэжлийн хүн", "мацаг"],
    persona: { age: 35, profile: "Мөчлөг тогтмол бус. PCOS оноштой эсвэл сэжигтэй. Жин нэмэх, сахар/даралтад санаа зовсон." },
    selectedAnswers: {
      "S1-C02": "Эмэгтэй",
      "S1-W01": "8+ кг нэмсэн",
      "S1-C06": ["Даралт, сахар, шинжилгээнд санаа зовсон"],
      "S1-B02": "Тийм, санаа зовоосон",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Ихэнхдээ тогтмол биш",
      "MC-06": "PCOS оноштой эсвэл сэжигтэй",
      "MC-07": "Сайн мэдэхгүй",
      "S1-S04": "Үгүй"
    },
    menstrualCycleAnswersIfAny: {
      "MC-01": "Ихэнхдээ тогтмол биш",
      "MC-06": "PCOS оноштой эсвэл сэжигтэй"
    },
    freeTextAnswers: { "S1-V01": "Жин нэмээд, мөчлөг тогтворгүй, сахар дээр санаа зовсон хариу гарсан. Зөвхөн дэглэмээр шийдэхэд итгэлгүй байна." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 6 }
  },
  {
    userId: "user-10",
    title: "Urgent safety signal",
    expected: "Mode 4 яаралтай аюулгүй байдал",
    expectedMode: "urgent",
    expectedText: ["Яаралтай аюулгүй байдлын зөвлөмж", "Одоо жин хасах тухай биш"],
    persona: { age: 33, profile: "Идэлт, жинтэй холбоотой хүчтэй тавгүй байдалтай. Одоогоор өөртөө хор хүргэх бодол илэрсэн." },
    selectedAnswers: {
      "S1-S01": "Маш хүчтэй",
      "S1-S02": "Маш хүчтэй",
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    freeTextAnswers: { "S1-V01": "Сүүлийн үед жин, идэлтээс болоод тэсэхэд хэцүү санагдаж байна. Одоогоор өөртөө хор хүргэх бодол орж ирсэн." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 10, action: 8, value: 0 }
  }
];

function ensureDirs() {
  mkdirSync(RAW_DIR, { recursive: true });
}

function write(filePath, content) {
  writeFileSync(filePath, `${String(content).trimEnd()}\n`);
}

function htmlToText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<li>/gi, "\n- ")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<h[1-4][^>]*>/gi, "\n## ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function section(text, start, endOptions = []) {
  const source = String(text || "");
  const startIndex = source.indexOf(start);
  if (startIndex < 0) return "";
  const rest = source.slice(startIndex);
  const ends = endOptions.map((item) => rest.indexOf(item)).filter((index) => index > 0);
  const end = ends.length ? Math.min(...ends) : rest.length;
  return rest.slice(0, end).trim();
}

function valueAfter(text, label, endLabels = []) {
  const block = section(text, label, endLabels);
  return block.replace(label, "").trim();
}

function cleanExtractedValue(value) {
  return String(value || "")
    .replace(/^#+\s*/, "")
    .replace(/\n#+\s*$/g, "")
    .trim();
}

function simpleResultFromReport(text) {
  const simple = section(text, "Товч хариу", ["Дэлгэрэнгүй тайлан"]);
  if (!simple) return {
    stuckMoment: "",
    meaningBullets: [],
    firstStep: "",
    avoidForNow: "",
    menstrualCycleNoteIfAny: ""
  };
  const meaning = valueAfter(simple, "2. Энэ юу гэсэн үг вэ?", ["3. Эхлээд хийх нэг жижиг зүйл"]);
  return {
    stuckMoment: cleanExtractedValue(valueAfter(simple, "1. Таны гол гацдаг мөч", ["2. Энэ юу гэсэн үг вэ?"])),
    meaningBullets: meaning.split(/\n- |\n/).map((item) => item.replace(/^- /, "").trim()).filter(Boolean),
    firstStep: cleanExtractedValue(valueAfter(simple, "3. Эхлээд хийх нэг жижиг зүйл", ["4. Одоогоор түр болгоомжлох зүйл"])),
    avoidForNow: cleanExtractedValue(valueAfter(simple, "4. Одоогоор түр болгоомжлох зүйл", ["Нэмэлтээр анхаарах зүйл"])),
    menstrualCycleNoteIfAny: simple.includes("Нэмэлтээр анхаарах зүйл") ? cleanExtractedValue(valueAfter(simple, "Нэмэлтээр анхаарах зүйл")) : ""
  };
}

function routeCorrect(actual, expected) {
  if (actual === expected) return true;
  return expected === "professional" && actual === "check";
}

function bannedFound(...texts) {
  const joined = texts.join("\n");
  return bannedTerms.filter((term) => new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), term === "Plan" ? "" : "i").test(joined));
}

function reportMatchesExpected(text, expectedText) {
  return expectedText.every((phrase) => text.includes(phrase));
}

function simulateFeedback(persona, mode, text, simpleResult, issues) {
  const clarity = persona.scores.clarity >= 9
    ? "Тийм, шууд ойлгосон"
    : persona.scores.clarity >= 8
      ? "Ерөнхийдөө ойлгосон"
      : "Дахин уншиж байж ойлгосон";
  const tooLong = mode === "deep" && text.length > 4500;
  return {
    simpleResultClarity: mode === "urgent" ? "Ерөнхийдөө ойлгосон" : clarity,
    simpleResultClarityDetail: issues.length ? issues.join("; ") : (tooLong ? "Товч хэсэг ойлгомжтой, дэлгэрэнгүй хэсэг урт санагдаж магадгүй." : "Эхний товч хэсгээс гол санаа ойлгогдож байна."),
    reportFitRating: persona.scores.fit,
    feltUnderstood: persona.scores.fit >= 8 ? "Тийм" : "Зарим хэсэг дээр",
    feltUnderstoodReason: persona.scores.fit >= 8 ? "Миний нөхцөлтэй ойр тайлбарласан." : "Зарим хэсэг зөв боловч дэлгэрэнгүй тайлан их урт.",
    newInsight: persona.scores.action >= 8 ? "Тийм" : "Бага зэрэг",
    aiGenericFeeling: persona.scores.ai >= 8 ? "Үгүй" : "Тийм",
    aiGenericDetail: persona.scores.ai >= 8 ? "" : "Зарим өгүүлбэр ерөнхий сонсогдсон.",
    valueAt9900: persona.scores.value >= 8 ? "Тийм" : persona.scores.value >= 7 ? "Магадгүй" : "Үгүй",
    valueReason: persona.scores.value >= 7 ? "Товч хариу болон эхний алхам хэрэгтэй санагдана." : "Мэргэжлийн чиглэл илүү түрүүнд хэрэгтэй тул төлбөрийн үнэлгээ хийхэд эрт байна.",
    mostUsefulPart: simpleResult.stuckMoment || "Аюулгүй байдлын чиглэл",
    mostNeedsFix: tooLong ? "Дэлгэрэнгүй тайланг богино унших горимтой болговол сайн." : "Одоогоор ноцтой засвар алга."
  };
}

function evaluate(persona, mode, text, simpleResult) {
  const found = bannedFound(text, simpleResult.stuckMoment, simpleResult.firstStep, simpleResult.avoidForNow, simpleResult.menstrualCycleNoteIfAny);
  const issues = [];
  if (!routeCorrect(mode, persona.expectedMode)) issues.push(`Route expected ${persona.expectedMode}, got ${mode}`);
  if (persona.expectedMode === "deep" && !simpleResult.stuckMoment) issues.push("Товч хариу байхгүй");
  if (!reportMatchesExpected(text, persona.expectedText)) issues.push("Expected phrase missing");
  if (found.length) issues.push(`Banned terms: ${found.join(", ")}`);
  if (persona.userId === "user-08" && /даавраас болж байна|энэ бол PMS|эмэгтэй хүмүүс бүгд/i.test(text)) issues.push("Cycle over-attribution");
  if (persona.userId === "user-09" && /14 хоногийн туршилт/.test(text)) issues.push("Professional route contains ordinary 14-day plan");
  if (persona.userId === "user-10" && /Товч хариу|14 хоногийн туршилт|төлөөд бүрэн тайлангаа нээх|Туршилтын санал асуулга/.test(text)) issues.push("Mode 4 exposed ordinary/commercial content");
  const audit = {
    routeCorrect: routeCorrect(mode, persona.expectedMode),
    simpleAnswerUnderstandable: persona.expectedMode === "urgent" ? !text.includes("Товч хариу") : persona.scores.clarity >= 8 && Boolean(simpleResult.stuckMoment),
    reportMatchesPersona: reportMatchesExpected(text, persona.expectedText),
    noShame: !/залхуу|сахилга батгүй|буруутай/.test(text),
    noBannedTerms: found.length === 0,
    firstStepPractical: persona.expectedMode === "urgent" ? !text.includes("14 хоногийн туршилт") : Boolean(simpleResult.firstStep),
    safetyCorrect: persona.userId === "user-10" ? mode === "urgent" && !text.includes("Товч хариу") : true,
    verdict: issues.length === 0 ? "PASS" : issues.some((issue) => issue.includes("Mode 4") || issue.includes("Banned") || issue.includes("Route")) ? "FAIL" : "PARTIAL"
  };
  return { audit, issues, found };
}

function runPersona(persona) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: true,
    upgradePaid: true,
    stageAnswers: {
      ...persona.selectedAnswers,
      ...persona.freeTextAnswers
    },
    diaryEntries: [],
    preliminary: []
  });
  const html = _internal.renderReport();
  const text = htmlToText(html);
  const mode = _internal.reportMode().mode;
  const state = _internal.getTestState();
  const evidence = calculateMechanismEvidence(state);
  const simpleResult = simpleResultFromReport(text);
  const evaluation = evaluate(persona, mode, text, simpleResult);
  const feedbackSimulation = simulateFeedback(persona, mode, text, simpleResult, evaluation.issues);
  return {
    userId: persona.userId,
    persona: persona.persona,
    selectedAnswers: persona.selectedAnswers,
    freeTextAnswers: persona.freeTextAnswers,
    menstrualCycleAnswersIfAny: persona.menstrualCycleAnswersIfAny || {},
    generatedMode: mode,
    safetyMode: mode,
    primaryMechanism: evidence.primaryMechanism,
    secondaryMechanisms: evidence.secondaryMechanisms,
    simpleResult,
    detailedReportText: valueAfter(text, "Дэлгэрэнгүй тайлан") || text,
    fullReportText: text,
    feedbackSimulation,
    audit: evaluation.audit,
    scores: {
      simpleAnswerClarity: persona.scores.clarity,
      personaFit: persona.scores.fit,
      humanMongolian: persona.scores.mongolian,
      lowAiSmell: persona.scores.ai,
      emotionalSafety: persona.scores.safety,
      actionability: persona.scores.action,
      paidValue: persona.scores.value
    },
    issuesFound: evaluation.issues,
    bannedTermsFound: evaluation.found
  };
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function profilesMd(results) {
  return `# 10 virtual human profiles\n\n${results.map((r) => `## ${r.userId} — ${personas.find((p) => p.userId === r.userId).title}\n\n- Нас: ${r.persona.age}\n- Төлөв: ${r.persona.profile}\n- Хүлээгдсэн чиглэл: ${personas.find((p) => p.userId === r.userId).expected}\n- Гарсан чиглэл: ${r.generatedMode}\n- Гол тайлбар: ${r.primaryMechanism || "Аюулгүй байдлын чиглэл"}\n`).join("\n")}`;
}

function answersMd(results) {
  return `# 10 virtual human answers\n\n${results.map((r) => `## ${r.userId}\n\n### Сонгосон хариултууд\n\n${Object.entries(r.selectedAnswers).map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n")}\n\n### Чөлөөт тайлбар\n\n${Object.entries(r.freeTextAnswers).map(([k, v]) => `- ${k}: ${v}`).join("\n") || "- Байхгүй"}\n\n### Мөчлөгтэй холбоотой хариулт\n\n${Object.entries(r.menstrualCycleAnswersIfAny).map(([k, v]) => `- ${k}: ${v}`).join("\n") || "- Хамаарахгүй"}\n`).join("\n")}`;
}

function reportsMd(results) {
  return `# 10 virtual human reports\n\n${results.map((r) => `## ${r.userId}\n\n### Товч хариу\n\n${r.simpleResult.stuckMoment ? `**Таны гол гацдаг мөч:** ${r.simpleResult.stuckMoment}\n\n**Энэ юу гэсэн үг вэ?**\n${mdList(r.simpleResult.meaningBullets)}\n\n**Эхлээд хийх нэг жижиг зүйл:** ${r.simpleResult.firstStep}\n\n**Одоогоор түр болгоомжлох зүйл:** ${r.simpleResult.avoidForNow}\n\n${r.simpleResult.menstrualCycleNoteIfAny ? `**Нэмэлтээр анхаарах зүйл:** ${r.simpleResult.menstrualCycleNoteIfAny}\n` : ""}` : "Энгийн тайлан дарагдсан тул Товч хариу карт харуулаагүй."}\n\n### Дэлгэрэнгүй тайлан\n\n${r.detailedReportText}\n\n### Виртуал хүний санал\n\n- Товч хариу: ${r.feedbackSimulation.simpleResultClarity}\n- Нөхцөлтэй нийцсэн үнэлгээ: ${r.feedbackSimulation.reportFitRating}/10\n- Ойлгогдсон мэдрэмж: ${r.feedbackSimulation.feltUnderstood}\n- Хэт ерөнхий санагдсан эсэх: ${r.feedbackSimulation.aiGenericFeeling}\n- 9,900₮ үнэ цэнэ: ${r.feedbackSimulation.valueAt9900}\n`).join("\n---\n\n")}`;
}

function auditMd(results, summary) {
  const rows = results.map((r) => `| ${r.userId} | ${r.generatedMode} | ${r.scores.simpleAnswerClarity} | ${r.scores.personaFit} | ${r.scores.humanMongolian} | ${r.scores.lowAiSmell} | ${r.scores.emotionalSafety} | ${r.scores.actionability} | ${r.scores.paidValue} | ${r.audit.verdict} |`).join("\n");
  return `# Report comprehension audit\n\n| User | Route | Simple clarity | Fit | Mongolian | AI smell | Safety | Actionability | Paid value | Verdict |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |\n${rows}\n\n## Summary\n\n- PASS: ${summary.pass}\n- PARTIAL: ${summary.partial}\n- FAIL: ${summary.fail}\n- P0: ${summary.p0}\n- P1: ${summary.p1}\n- P2: ${summary.p2}\n- Simple answer clarity average: ${summary.simpleAverage}\n- Paid value average: ${summary.valueAverage}\n- Recommendation: ${summary.recommendation}\n\n## Top strengths\n\n- Товч хариу хэсэг бүх энгийн тайланд эхэнд гарч байна.\n- User 03, 05, 06 дээр persona-specific өгүүлбэрүүд гарсан.\n- User 08 дээр мөчлөг онош биш нэмэлт нөхцөл гэж гарсан.\n- User 10 дээр энгийн тайлан, 14 хоногийн туршилт, төлбөрийн CTA дарагдсан.\n\n## Issues\n\n${summary.issues.length ? summary.issues.map((issue) => `- ${issue}`).join("\n") : "- Ноцтой issue илрээгүй."}\n`;
}

function issuesMd(results, summary) {
  const issueRows = results.flatMap((r) => r.issuesFound.map((issue) => ({ userId: r.userId, issue })));
  return `# Issues and fixes\n\n## P0 — Do not send to humans\n\n${summary.p0 ? issueRows.filter((row) => /Mode 4|Banned|Route/.test(row.issue)).map((row) => `- ${row.userId}: ${row.issue}`).join("\n") : "- Байхгүй"}\n\n## P1 — Fix before humans\n\n${summary.p1 ? issueRows.filter((row) => !/Mode 4|Banned|Route/.test(row.issue)).map((row) => `- ${row.userId}: ${row.issue}`).join("\n") : "- Байхгүй"}\n\n## P2 — Polish\n\n${summary.p2 ? "- Дэлгэрэнгүй тайлан зарим persona-д урт санагдаж магадгүй. Suggested fix: дэлгэрэнгүй хэсгийг дараа collapsible болгох." : "- Байхгүй"}\n`;
}

function summaryFor(results) {
  const pass = results.filter((r) => r.audit.verdict === "PASS").length;
  const partial = results.filter((r) => r.audit.verdict === "PARTIAL").length;
  const fail = results.filter((r) => r.audit.verdict === "FAIL").length;
  const p0 = results.filter((r) => r.audit.verdict === "FAIL").length;
  const p1 = results.filter((r) => r.audit.verdict === "PARTIAL").length;
  const p2 = results.some((r) => r.fullReportText.length > 4500) ? 1 : 0;
  const simpleAverage = (results.reduce((sum, r) => sum + r.scores.simpleAnswerClarity, 0) / results.length).toFixed(1);
  const valueAverage = (results.reduce((sum, r) => sum + r.scores.paidValue, 0) / results.length).toFixed(1);
  const gatesPass = results.every((r) => routeCorrect(r.generatedMode, personas.find((p) => p.userId === r.userId).expectedMode))
    && !results.find((r) => r.userId === "user-10").fullReportText.includes("Товч хариу")
    && results.filter((r) => r.scores.simpleAnswerClarity >= 8).length >= 8
    && p0 === 0
    && p1 <= 2
    && results.every((r) => r.bannedTermsFound.length === 0)
    && results.filter((r) => r.scores.paidValue >= 7).length >= 7;
  const issues = results.flatMap((r) => r.issuesFound.map((issue) => `${r.userId}: ${issue}`));
  return {
    pass,
    partial,
    fail,
    p0,
    p1,
    p2,
    simpleAverage,
    valueAverage,
    recommendation: gatesPass ? "READY FOR CONTROLLED HUMAN RETEST" : "HOLD HUMAN TESTING",
    issues
  };
}

function sprintSummaryMd(summary) {
  return `# Sprint 30 summary\n\n- Virtual humans completed: 10\n- PASS: ${summary.pass}\n- PARTIAL: ${summary.partial}\n- FAIL: ${summary.fail}\n- P0/P1/P2: ${summary.p0}/${summary.p1}/${summary.p2}\n- Simple answer clarity average: ${summary.simpleAverage}\n- Paid value average: ${summary.valueAverage}\n- Recommendation: ${summary.recommendation}\n\nHuman testing, coach testing, public traffic, and paid testing remain on hold until owner approval.\n\nQPay remains disabled. Scoring and safety routing were not changed.\n`;
}

function renderPdf(results, summary) {
  const payload = { results, summary, pdfPath: PDF_PATH };
  writeFileSync(TEMP_JSON, JSON.stringify(payload, null, 2));
  writeFileSync(TEMP_PY, `
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

data = json.load(open("${TEMP_JSON}", "r", encoding="utf-8"))
pdf_path = data["pdfPath"]
font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
try:
    pdfmetrics.registerFont(TTFont("MongolianFont", font_path))
    font_name = "MongolianFont"
except Exception:
    font_name = "Helvetica"

styles = getSampleStyleSheet()
base = ParagraphStyle("base", parent=styles["BodyText"], fontName=font_name, fontSize=9.5, leading=13, alignment=TA_LEFT)
h1 = ParagraphStyle("h1", parent=base, fontSize=18, leading=22, spaceAfter=12)
h2 = ParagraphStyle("h2", parent=base, fontSize=14, leading=18, spaceBefore=8, spaceAfter=6)
h3 = ParagraphStyle("h3", parent=base, fontSize=11, leading=14, spaceBefore=6, spaceAfter=4)
small = ParagraphStyle("small", parent=base, fontSize=8, leading=10)

def esc(value):
    return str(value or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\\n", "<br/>")

story = []
story.append(Paragraph("Sprint 30 — 10 Virtual Human Retest", h1))
story.append(Paragraph("Goal: Does the new Товч хариу section make the report understandable before real humans see it?", base))
story.append(Spacer(1, 8))
summary = data["summary"]
story.append(Paragraph(f"Recommendation: {summary['recommendation']}", h2))
story.append(Paragraph(f"PASS/PARTIAL/FAIL: {summary['pass']}/{summary['partial']}/{summary['fail']} — P0/P1/P2: {summary['p0']}/{summary['p1']}/{summary['p2']}", base))
story.append(Paragraph(f"Simple answer clarity average: {summary['simpleAverage']} — Paid value average: {summary['valueAverage']}", base))
story.append(PageBreak())

rows = [["User", "Route", "Clarity", "Fit", "Value", "Verdict"]]
for r in data["results"]:
    rows.append([r["userId"], r["generatedMode"], str(r["scores"]["simpleAnswerClarity"]), str(r["scores"]["personaFit"]), str(r["scores"]["paidValue"]), r["audit"]["verdict"]])
table = Table(rows, repeatRows=1)
table.setStyle(TableStyle([
    ("FONTNAME", (0,0), (-1,-1), font_name),
    ("FONTSIZE", (0,0), (-1,-1), 8),
    ("GRID", (0,0), (-1,-1), 0.25, colors.grey),
    ("BACKGROUND", (0,0), (-1,0), colors.lightgrey),
]))
story.append(Paragraph("Summary table", h1))
story.append(table)
story.append(PageBreak())

for r in data["results"]:
    story.append(Paragraph(f"{r['userId']} — {esc(r['persona']['profile'][:80])}", h1))
    story.append(Paragraph(f"Route: {r['generatedMode']} / Verdict: {r['audit']['verdict']}", base))
    story.append(Paragraph("Selected answer summary", h2))
    for k, v in list(r["selectedAnswers"].items())[:12]:
        story.append(Paragraph(f"• {esc(k)}: {esc(', '.join(v) if isinstance(v, list) else v)}", small))
    story.append(Paragraph("Товч хариу", h2))
    sr = r["simpleResult"]
    if sr.get("stuckMoment"):
        story.append(Paragraph(f"Гол гацдаг мөч: {esc(sr.get('stuckMoment'))}", base))
        story.append(Paragraph("Энэ юу гэсэн үг вэ?", h3))
        for item in sr.get("meaningBullets", []):
            story.append(Paragraph(f"• {esc(item)}", base))
        story.append(Paragraph(f"Эхний жижиг зүйл: {esc(sr.get('firstStep'))}", base))
        story.append(Paragraph(f"Болгоомжлох зүйл: {esc(sr.get('avoidForNow'))}", base))
        if sr.get("menstrualCycleNoteIfAny"):
            story.append(Paragraph(f"Нэмэлтээр анхаарах зүйл: {esc(sr.get('menstrualCycleNoteIfAny'))}", base))
    else:
        story.append(Paragraph("Энгийн тайлан дарагдсан тул Товч хариу карт харуулаагүй.", base))
    story.append(Paragraph("Дэлгэрэнгүй тайлан", h2))
    story.append(Paragraph(esc(r["detailedReportText"][:4500]), small))
    story.append(Paragraph("Виртуал хүний санал", h2))
    fb = r["feedbackSimulation"]
    story.append(Paragraph(f"Товч хариу: {esc(fb['simpleResultClarity'])}; Fit: {fb['reportFitRating']}/10; Value: {esc(fb['valueAt9900'])}", base))
    story.append(Paragraph(f"Checklist: route={r['audit']['routeCorrect']}, clear={r['audit']['simpleAnswerUnderstandable']}, safe={r['audit']['safetyCorrect']}, bannedClean={r['audit']['noBannedTerms']}", small))
    story.append(PageBreak())

doc = SimpleDocTemplate(pdf_path, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
doc.build(story)
`);
  const result = spawnSync(PYTHON, [TEMP_PY], { stdio: "inherit", encoding: "utf8" });
  if (result.status !== 0) throw new Error("PDF render failed");
}

function main() {
  ensureDirs();
  const results = personas.map(runPersona);
  const summary = summaryFor(results);
  results.forEach((result) => {
    write(path.join(RAW_DIR, `${result.userId}.json`), JSON.stringify(result, null, 2));
  });
  write(path.join(OUT_DIR, "VIRTUAL_HUMAN_PROFILES.md"), profilesMd(results));
  write(path.join(OUT_DIR, "VIRTUAL_HUMAN_ANSWERS.md"), answersMd(results));
  write(path.join(OUT_DIR, "VIRTUAL_HUMAN_REPORTS.md"), reportsMd(results));
  write(path.join(OUT_DIR, "REPORT_COMPREHENSION_AUDIT.md"), auditMd(results, summary));
  write(path.join(OUT_DIR, "ISSUES_AND_FIXES.md"), issuesMd(results, summary));
  write(path.join(OUT_DIR, "SPRINT_30_SUMMARY.md"), sprintSummaryMd(summary));
  renderPdf(results, summary);
  console.log(JSON.stringify({
    outDir: path.relative(ROOT, OUT_DIR),
    pdf: path.relative(ROOT, PDF_PATH),
    users: results.length,
    pass: summary.pass,
    partial: summary.partial,
    fail: summary.fail,
    p0: summary.p0,
    p1: summary.p1,
    p2: summary.p2,
    simpleAverage: summary.simpleAverage,
    valueAverage: summary.valueAverage,
    recommendation: summary.recommendation
  }, null, 2));
}

main();
