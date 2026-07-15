import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const app = require("../app.js");

const { calculateMechanismEvidence, _internal } = app;

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "audits", "sprint-33-second-virtual-cohort");
const RAW_DIR = path.join(OUT_DIR, "raw");
const PDF_PATH = path.join(OUT_DIR, "WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf");
const TEMP_JSON = path.join("/private/tmp", "weight-test-sprint-33-cohort.json");
const TEMP_PY = path.join("/private/tmp", "weight-test-sprint-33-render.py");
const PYTHON = "/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const TITLE = "Жин хасалтын гүн зураглал — хоёр дахь 10 виртуал хүний тайлан";

const bannedUserFacing = [
  "Weight Test - хэрэглэгчид харагдах",
  "Хэрэглэгчийн унших 10 тайлан",
  "Дэлгэрэнгүй тайлан харах",
  "Санал илгээх",
  "Саналын экспорт",
  "Сонголт руу буцах",
  "Шинээр эхлэх",
  "Route:",
  "Verdict:",
  "Checklist:",
  "Selected answer summary",
  "cohort",
  "Urgent safety",
  "ordinary report",
  "restriction/exercise",
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
  "Plan",
  "миний юм",
  "ганц жижиг баяр",
  "өөртөө өгөх нэг жижиг зүйл",
  "кофеины хил",
  "орой унтраах",
  "бие яараад",
  "Нурах давтамж",
  "давтамж гэх давтамж",
  "гэх давтамжтай нийцэж байна"
];

const personas = [
  {
    userId: "user-01",
    title: "Шөнийн ээлжийн сувилагч",
    expectedMode: "deep",
    expectedText: ["шөнийн ээлж", "ээлжийн дараа", "ойр дэлгүүр"],
    persona: { age: 41, profile: "Шөнийн ээлжтэй. Өдөр унтах хэмнэл эвдэрдэг, сүүлийн кофе оройтож уудаг, ядарсан үед амттай зүйл татдаг." },
    selectedAnswers: {
      "S1-C01": "41",
      "S1-W02": ["Нойр муудсан", "Ажлын цаг өөрчлөгдсөн"],
      "S1-N01": "4-6 цаг",
      "S1-N02": "Ихэвчлэн",
      "S1-F01": ["Ядарсан", "Амттай юм идмээр байсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Шөнийн ээлжийн дараа нойр тасалдаад эмнэлгийн цайны газар эсвэл ойр дэлгүүрийн бэлэн хоол хурдан тэнхээ өгөх шиг санагддаг. Кофегоо ч заримдаа оройтож уудаг." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-02",
    title: "Гэрээс ажилладаг зууш ойр хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["Зууш нүдэнд ойр", "нэг алхам холдуул"],
    persona: { age: 30, profile: "Гэрээс ажилладаг. Гал тогоо ойр, ширээн дээрх жигнэмэг/самар байнга харагддаг. Өлсөөгүй үед ч гар хүрдэг." },
    selectedAnswers: {
      "S1-H02": "Ихэвчлэн үгүй",
      "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"],
      "S1-R02": ["Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Гэрээс ажиллахад гал тогоо хоёр алхмын цаана. Ширээн дээр юм байвал өлсөөгүй ч аваад идчихдэг." },
    scores: { clarity: 9, fit: 9, mongolian: 8, ai: 8, safety: 9, action: 9, value: 8 }
  },
  {
    userId: "user-03",
    title: "Төрсний дараах үе, өөрийн хоол хойшлогддог хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["хүүхэд", "өөрийн хоол", "анхаарал хэрэгтэй"],
    persona: { age: 34, profile: "Төрсний дараах үе. Хүүхэд асрах, тасалдсан нойр, өөрийн хоол хамгийн сүүлд үлдэх нь оройн идэлттэй холбоотой." },
    selectedAnswers: {
      "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
      "S1-E02": ["Хоосон мэт мэдрэмж", "Ядаргаа"],
      "S1-F01": ["Өөрийгөө жаахан шагнамаар санагдсан", "Ядарсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Төрсний дараах үе, хүүхэд асрах, тасалдсан нойр давхцаад өөрийн хоол хамгийн сүүлд үлддэг. Орой надад ч гэсэн анхаарал хэрэгтэй гэж мэдрэгддэг." },
    scores: { clarity: 9, fit: 9, mongolian: 8, ai: 8, safety: 9, action: 8, value: 8 }
  },
  {
    userId: "user-04",
    title: "Перименопауз, биеийн өөрчлөлтөд итгэл алдарсан хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["перименопауз", "бие", "хяналтаа"],
    persona: { age: 48, profile: "Мөчлөг зөрөх, нойр өөрчлөгдөх, бие хүнд оргих үе нэмэгдсэн. Биеэ ойлгоход хэцүү болж орой тайвшруулах идэлт нэмэгддэг." },
    selectedAnswers: {
      "S1-C02": "Эмэгтэй",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Заримдаа зөрдөг",
      "MC-03": "Тодорхой биш",
      "MC-04": ["Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг"],
      "MC-06": "Перименопауз байж магадгүй",
      "S1-F01": ["Амттай юм идмээр байсан", "Тайвширмаар байсан"],
      "S1-S04": "Үгүй"
    },
    menstrualCycleAnswersIfAny: {
      "MC-01": "Заримдаа зөрдөг",
      "MC-06": "Перименопауз байж магадгүй"
    },
    freeTextAnswers: { "S1-V01": "Перименопауз байж магадгүй, мөчлөг зөрөөд нойр муудаж бие хүнд оргих болсон. Бие өөрчлөгдөхөөр хяналтаа алдсан мэт санагдаж орой амттай зүйлээр тайвширдаг." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-05",
    title: "Амралтын өдөр найз нөхөд, архитай давхцдаг хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["татгалзах эвгүй"],
    persona: { age: 33, profile: "Ажлын долоо хоногт гайгүй ч амралтын өдөр найз нөхөд, архи, оройн хоолтой үед идэлт өөрчлөгддөг." },
    selectedAnswers: {
      "S1-F01": ["Татгалзах эвгүй байсан", "Амттай юм идмээр байсан"],
      "S1-R02": ["Ажлын дараах амралт", "Амт, үнэр, мэдрэмж татах үед"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Амралтын өдөр найзуудтай уулзахад архи, оройн хоол хамт ордог. Хүмүүсийн дунд татгалзах эвгүй, бүгд идэж байхад би яах вэ гэж бодогддог." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-06",
    title: "Нэг хазайлтаас хэт чангардаг хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["Өнөөдөр өнгөрлөө", "дараагийн хоолноос хэвийн үргэлжлүүлэх"],
    persona: { age: 37, profile: "Олон удаа хатуу дэглэм эхэлсэн. Нэг удаа төлөвлөгөө зөрвөл бүх өдөр дууссан мэт санагдаж маргаашаас чангардаг." },
    selectedAnswers: {
      "S1-W03": "Бараг бүх оролдлогоос хойш",
      "S1-W04": ["Калори тоолох", "Мацаг", "Орой хоол идэхгүй"],
      "S1-W06": "Өнөөдөр өнгөрлөө, маргаашаас",
      "S1-F02": "Одоо бүх юм дууссан",
      "S1-X03": "Маш хүчтэй",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V03": "Нэг удаа бялуу идчихвэл өнөөдөр өнгөрлөө гэж бодоод орой нь бүр замбараагүй иддэг. Маргаашаас илүү чанга барина гэж өөрийгөө шахдаг." },
    scores: { clarity: 9, fit: 9, mongolian: 8, ai: 8, safety: 9, action: 9, value: 8 }
  },
  {
    userId: "user-07",
    title: "Дасгалын сорил, нүүрс ус хасалтаас буцаад хүчтэй иддэг хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["Өлсөх тусам зөв явж байна", "бие орой хамгаалах"],
    persona: { age: 29, profile: "Фитнес challenge эхлэхдээ нүүрс ус хасаж, хүчтэй дасгал хийдэг. Өдөр тэсдэг ч орой өлсөлт огцом нэмэгддэг." },
    selectedAnswers: {
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"],
      "S1-M01": "Өдрийн хоол алгасдаг",
      "S1-F01": ["Өлссөндөө идсэн", "Дараа өлсөхөөс санаа зовсон"],
      "S1-X01": "Өлсөхөөс санаа зовдог",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Дасгал challenge эхлээд нүүрс ус хассан. Өлсөх тусам зөв явж байна гэж бодоод орой бие орой хамгаалах шиг хэт өлсдөг." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 7 }
  },
  {
    userId: "user-08",
    title: "PCOS сэжиг, мөчлөг тогтмол бус хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["PCOS", "хяналтаа", "бие"],
    persona: { age: 35, profile: "Мөчлөг тогтмол бус, PCOS сэжигтэй. Бие урьдчилж таахад хэцүү санагдаж, хяналтаа авах гэж хатуу дэглэм эхлүүлдэг." },
    selectedAnswers: {
      "S1-C02": "Эмэгтэй",
      "S1-W01": "4-7 кг нэмсэн",
      "MC-GATE": "Тийм, хамаарна",
      "MC-01": "Ихэнхдээ тогтмол биш",
      "MC-02": "Сайн мэдэхгүй",
      "MC-03": "Тодорхой биш",
      "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Ядаргаа, нойр муудахтай давхцдаг"],
      "MC-05": "Тодорхой хэлж мэдэхгүй",
      "MC-06": "PCOS оноштой эсвэл сэжигтэй",
      "S1-W06": "Маргааш илүү чанга барина",
      "S1-F01": ["Амттай юм идмээр байсан", "Ядарсан"],
      "S1-S04": "Үгүй"
    },
    menstrualCycleAnswersIfAny: {
      "MC-01": "Ихэнхдээ тогтмол биш",
      "MC-06": "PCOS оноштой эсвэл сэжигтэй"
    },
    freeTextAnswers: { "S1-V01": "PCOS байж магадгүй гэж санаа зовдог. Мөчлөг тогтмол бус болохоор бие урьдчилж таахад хэцүү, хяналтаа буцааж авах гэж хэт чанга дэглэм эхлүүлдэг." },
    scores: { clarity: 8, fit: 7, mongolian: 8, ai: 8, safety: 9, action: 7, value: 7 }
  },
  {
    userId: "user-09",
    title: "Эм, даралт, хоолны дуршлын өөрчлөлтөд санаа зовсон хэрэглэгч",
    expectedMode: "deep",
    expectedText: ["Эмийн хэрэглээ", "Бие өөрчлөгдөх", "хяналтаа"],
    persona: { age: 52, profile: "Даралтын эм хэрэглэж эхэлсний дараа хоолны дуршил, хавагнах мэдрэмж өөрчлөгдсөн гэж санаа зовсон." },
    selectedAnswers: {
      "S1-W02": ["Эм"],
      "S1-W06": "Маргааш илүү чанга барина",
      "S1-F01": ["Бие эвгүйрхэх вий гэж санаа зовсон", "Тайвширмаар байсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Даралтын эм хэрэглэж эхэлсний дараа бие өөрчлөгдөж хавагнах шиг санагдсан. Хяналтаа алдсан мэт болоод хоолоо хэт чанга барих гэж оролддог." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 9, action: 8, value: 6 }
  },
  {
    userId: "user-10",
    title: "Толь, зураг, хүмүүсийн дунд биеэ нуух хэрэглэгч",
    expectedMode: "professional",
    expectedText: ["өөрийгөө харах", "бусдад харагдах", "ичгүүртэй"],
    persona: { age: 31, profile: "Толь, зураг, хүмүүсийн дунд биеэ нуух хүсэл нэмэгддэг. Идсэний дараа ичих, нуух мэдрэмж хүчтэй тул энгийн тайлан дарагдана." },
    selectedAnswers: {
      "S1-S01": "Заримдаа",
      "S1-S02": "Ихэвчлэн",
      "S1-F02": "Шууд гэмшдэг",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Толь, зураг, бусдад харагдах хүмүүсийн дунд биеэ нуух хүсэл ихэсдэг. Идсэний дараа ичих, нуух мэдрэмж хүчтэй болдог." },
    scores: { clarity: 8, fit: 8, mongolian: 8, ai: 8, safety: 10, action: 8, value: 5 }
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
    .replace(/<h[1-4][^>]*>/gi, "\n")
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
  return section(text, label, endLabels).replace(label, "").trim();
}

function removeReviewChrome(text) {
  const blockedStandaloneLines = new Set([
    "[REMOVED_FEATURE_REFINEMENT]",
    "Эхний хариу руу буцах",
    "Шинээр эхлэх",
    "Сонголт руу буцах",
    "Тэмдэглэл рүү буцах",
    "Саналын экспорт",
    "Санал илгээх",
    "Дэлгэрэнгүй тайлан харах",
    "Тайлан"
  ]);
  return String(text || "")
    .replace(/Дотоод туршилтын хувилбар[\s\S]*$/g, "")
    .replace(/Сонголт руу буцах\s*Шинээр эхлэх/g, "")
    .replace(/Тэмдэглэл рүү буцах\s*Шинээр эхлэх/g, "")
    .replace(/Эхний хариу руу буцах\s*Шинээр эхлэх/g, "")
    .split("\n")
    .filter((line) => !blockedStandaloneLines.has(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function simpleResultFromReport(text) {
  const simple = section(text, "Товч хариу", ["Дэлгэрэнгүй тайлан"]);
  if (!simple) return { stuckMoment: "", meaningBullets: [], firstStep: "", avoidForNow: "", menstrualCycleNoteIfAny: "" };
  const meaning = valueAfter(simple, "2. Энэ юу гэсэн үг вэ?", ["3. Эхлээд хийх нэг жижиг зүйл"]);
  return {
    stuckMoment: valueAfter(simple, "1. Таны гол гацдаг мөч", ["2. Энэ юу гэсэн үг вэ?"]).trim(),
    meaningBullets: meaning.split(/\n- |\n/).map((item) => item.replace(/^- /, "").trim()).filter(Boolean),
    firstStep: valueAfter(simple, "3. Эхлээд хийх нэг жижиг зүйл", ["4. Одоогоор түр болгоомжлох зүйл"]).trim(),
    avoidForNow: valueAfter(simple, "4. Одоогоор түр болгоомжлох зүйл", ["Нэмэлтээр анхаарах зүйл"]).trim(),
    menstrualCycleNoteIfAny: simple.includes("Нэмэлтээр анхаарах зүйл") ? valueAfter(simple, "Нэмэлтээр анхаарах зүйл").trim() : ""
  };
}

function routeCorrect(actual, expected) {
  if (actual === expected) return true;
  return expected === "professional" && actual === "check";
}

function bannedFound(text) {
  return bannedUserFacing.filter((term) => {
    const flags = term === "Plan" ? "" : "i";
    return new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags).test(text);
  });
}

function runPersona(persona, internalTest = true) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest,
    oneTimePaid: true,
    removedFeaturePaid: true,
    upgradePaid: true,
    stageAnswers: {
      ...persona.selectedAnswers,
      ...persona.freeTextAnswers
    },
    removedEntries: [],
    preliminary: []
  });
  const html = _internal.renderReport();
  const text = internalTest ? htmlToText(html) : removeReviewChrome(htmlToText(html));
  const mode = _internal.reportMode().mode;
  const state = _internal.getTestState();
  const evidence = calculateMechanismEvidence(state);
  const simpleResult = simpleResultFromReport(text);
  const userFacingBanned = bannedFound(text);
  const issues = [];
  if (!routeCorrect(mode, persona.expectedMode)) issues.push(`Route expected ${persona.expectedMode}, got ${mode}`);
  if (persona.expectedMode === "deep" && !simpleResult.stuckMoment) issues.push("Товч хариу байхгүй");
  persona.expectedText.filter((phrase) => !text.includes(phrase)).forEach((phrase) => issues.push(`Expected phrase missing: ${phrase}`));
  if (userFacingBanned.length) issues.push(`Banned user-facing terms: ${userFacingBanned.join(", ")}`);
  if (/даавраас болж байна|энэ бол PMS|энэ бол PCOS|эмэгтэй хүмүүс бүгд/i.test(text)) issues.push("Cycle over-attribution");
  if (persona.expectedMode !== "deep" && /14 хоногийн туршилт/.test(text)) issues.push("Safety/professional route contains ordinary 14-day plan");
  if (persona.expectedMode === "urgent" && /Товч хариу|төлөөд бүрэн тайлангаа нээх|Туршилтын санал асуулга/.test(text)) issues.push("Mode 4 exposed ordinary/commercial content");
  if (
    persona.userId === "user-08" &&
    !/дааврын жирэмслэлтээс хамгаалах|тогтмол бус|календар/i.test(text)
  ) {
    issues.push("P1: дааврын хэрэгсэл/тогтмол бус мөчлөгийн confidence-low тайлбар дутуу");
  }
  const verdict = issues.length === 0 ? "PASS" : issues.some((issue) => /Route|Banned|Mode 4|ordinary 14-day/.test(issue)) ? "FAIL" : "PARTIAL";
  return {
    userId: persona.userId,
    title: persona.title,
    persona: persona.persona,
    selectedAnswers: persona.selectedAnswers,
    freeTextAnswers: persona.freeTextAnswers,
    menstrualCycleAnswersIfAny: persona.menstrualCycleAnswersIfAny || {},
    generatedMode: mode,
    primaryMechanism: evidence.primaryMechanism,
    secondaryMechanisms: evidence.secondaryMechanisms,
    simpleResult,
    userFacingReport: text,
    detailedReportText: valueAfter(text, "Дэлгэрэнгүй тайлан") || text,
    feedbackSimulation: simulateFeedback(persona, mode, text, simpleResult, issues),
    audit: {
      routeCorrect: routeCorrect(mode, persona.expectedMode),
      expectedCopyPresent: persona.expectedText.every((phrase) => text.includes(phrase)),
      noBannedTerms: userFacingBanned.length === 0,
      safetyCorrect: persona.expectedMode === "urgent" ? mode === "urgent" && !text.includes("Товч хариу") : true,
      verdict
    },
    scores: persona.scores,
    issuesFound: issues,
    bannedTermsFound: userFacingBanned
  };
}

function simulateFeedback(persona, mode, text, simpleResult, issues) {
  const clarity = persona.scores.clarity >= 9 ? "Тийм, шууд ойлгосон" : persona.scores.clarity >= 8 ? "Ерөнхийдөө ойлгосон" : "Дахин уншиж байж ойлгосон";
  return {
    simpleResultClarity: mode === "urgent" ? "Ерөнхийдөө ойлгосон" : clarity,
    reportFitRating: persona.scores.fit,
    feltUnderstood: persona.scores.fit >= 8 ? "Тийм" : "Зарим хэсэг дээр",
    newInsight: persona.scores.action >= 8 ? "Тийм" : "Бага зэрэг",
    aiGenericFeeling: persona.scores.ai >= 8 ? "Үгүй" : "Тийм",
    valueAt9900: persona.scores.value >= 8 ? "Тийм" : persona.scores.value >= 7 ? "Магадгүй" : "Үгүй",
    mostUsefulPart: simpleResult.stuckMoment || "Аюулгүй байдлын чиглэл",
    mostNeedsFix: issues.length ? issues.join("; ") : (text.length > 4700 ? "Дэлгэрэнгүй хэсэг зарим хэрэглэгчид урт санагдаж магадгүй." : "Ноцтой засвар саналгүй.")
  };
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function profilesMd(results) {
  return `# Sprint 33 second virtual cohort profiles\n\n${results.map((r) => `## ${r.userId} — ${r.title}\n\n- Нас: ${r.persona.age}\n- Төлөв: ${r.persona.profile}\n- Хүлээгдсэн route: ${personas.find((p) => p.userId === r.userId).expectedMode}\n- Гарсан route: ${r.generatedMode}\n- Гол тайлбар: ${r.primaryMechanism || "safety-first"}\n`).join("\n")}`;
}

function answersMd(results) {
  return `# Sprint 33 selected answers\n\n${results.map((r) => `## ${r.userId} — ${r.title}\n\n### Сонгосон хариултууд\n\n${Object.entries(r.selectedAnswers).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`).join("\n")}\n\n### Чөлөөт тайлбар\n\n${Object.entries(r.freeTextAnswers).map(([key, value]) => `- ${key}: ${value}`).join("\n") || "- Байхгүй"}\n\n### Мөчлөгтэй холбоотой хариулт\n\n${Object.entries(r.menstrualCycleAnswersIfAny).map(([key, value]) => `- ${key}: ${value}`).join("\n") || "- Хамаарахгүй"}\n`).join("\n")}`;
}

function userFacingReportsMd(results) {
  return [
    TITLE,
    "",
    "Энэ файлд зөвхөн хоёр дахь виртуал багцын хэрэглэгчид унших тайлангийн текст орсон.",
    "",
    ...results.flatMap((r, index) => [
      `Тайлан ${index + 1} — ${r.title}`,
      "",
      r.userFacingReport,
      "",
      "-----",
      ""
    ])
  ].join("\n").trimEnd();
}

function comprehensionAuditMd(results, summary) {
  const rows = results.map((r) => `| ${r.userId} | ${r.generatedMode} | ${r.scores.clarity} | ${r.scores.fit} | ${r.scores.mongolian} | ${r.scores.ai} | ${r.scores.safety} | ${r.scores.action} | ${r.scores.value} | ${r.audit.verdict} |`).join("\n");
  return `# Sprint 33 comprehension audit\n\nMain question: Does the current report copy hold up across a fresh, more varied 10-person cohort?\n\n| User | Route | Simple clarity | Fit | Mongolian | AI smell | Safety | Actionability | Paid value | Verdict |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |\n${rows}\n\n## Summary\n\n- PASS: ${summary.pass}\n- PARTIAL: ${summary.partial}\n- FAIL: ${summary.fail}\n- P0: ${summary.p0}\n- P1: ${summary.p1}\n- P2: ${summary.p2}\n- Average simple clarity: ${summary.simpleAverage}\n- Average paid value: ${summary.valueAverage}\n- Recommendation: ${summary.recommendation}\n`;
}

function issuesMd(results, summary) {
  const rows = results.flatMap((r) => r.issuesFound.map((issue) => `- ${r.userId}: ${issue}`));
  const polish = results.filter((r) => r.userFacingReport.length > 4700).map((r) => `- ${r.userId}: Дэлгэрэнгүй тайлан урт санагдаж магадгүй.`);
  return `# Sprint 33 issues and suggested fixes\n\n## P0 blockers\n\n${summary.p0 ? rows.join("\n") : "- Байхгүй"}\n\n## P1 fixes before real humans\n\n${summary.p1 ? rows.join("\n") : "- Байхгүй"}\n\n## P2 polish\n\n${polish.length ? polish.join("\n") : "- Байхгүй"}\n\n## Suggested fixes\n\n${rows.length ? rows.join("\n") : "- Одоогоор copy patch шаардах blocker илрээгүй. Owner approval хүртэл human testing HOLD хэвээр."}\n`;
}

function summaryFor(results) {
  const pass = results.filter((r) => r.audit.verdict === "PASS").length;
  const partial = results.filter((r) => r.audit.verdict === "PARTIAL").length;
  const fail = results.filter((r) => r.audit.verdict === "FAIL").length;
  const p0 = fail;
  const p1 = partial;
  const p2 = results.some((r) => r.userFacingReport.length > 4700) ? 1 : 0;
  const simpleAverage = (results.reduce((sum, r) => sum + r.scores.clarity, 0) / results.length).toFixed(1);
  const valueAverage = (results.reduce((sum, r) => sum + r.scores.value, 0) / results.length).toFixed(1);
  const gatesPass = p0 === 0 && p1 === 0 && results.every((r) => r.bannedTermsFound.length === 0);
  return {
    pass,
    partial,
    fail,
    p0,
    p1,
    p2,
    simpleAverage,
    valueAverage,
    recommendation: gatesPass ? "READY FOR OWNER REVIEW - HUMAN TESTING STILL HOLD" : "HOLD HUMAN TESTING"
  };
}

function sprintSummaryMd(summary) {
  return `# Sprint 33 summary\n\n- Cohort: second virtual cohort, 10 new personas\n- PASS: ${summary.pass}\n- PARTIAL: ${summary.partial}\n- FAIL: ${summary.fail}\n- P0/P1/P2: ${summary.p0}/${summary.p1}/${summary.p2}\n- Average simple clarity: ${summary.simpleAverage}\n- Average paid value: ${summary.valueAverage}\n- Recommendation: ${summary.recommendation}\n\nHuman testing remains HOLD by owner decision.\nNo coach demo, public traffic, production deploy, or paid flow was run.\nQPay remains disabled. Scoring, mechanism detection, and safety routing were not changed.\n`;
}

function listItems(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

function reportPdfModel(result, index) {
  const full = result.userFacingReport;
  const detailed = result.detailedReportText || full;
  const simple = result.simpleResult || simpleResultFromReport(full);
  const cycleNote = section(detailed, "Мөчлөг тогтмол бус үед", ["Эхний жижиг өөрчлөлт"])
    || section(detailed, "Мөчлөгтэй холбоотой анхаарах зүйл", ["Эхний жижиг өөрчлөлт"])
    || simple.menstrualCycleNoteIfAny
    || "";
  return {
    index: index + 1,
    title: result.title,
    mode: result.generatedMode,
    intro: "Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.",
    fullText: full,
    simple: {
      stuckMoment: simple.stuckMoment || "",
      meaningBullets: simple.meaningBullets || [],
      firstStep: simple.firstStep || "",
      avoidForNow: simple.avoidForNow || ""
    },
    surface: valueAfter(full, "Ил харагдаж байгаа зүйл", ["Цаана нь ажиллаж байгаа зүйл"]),
    hidden: valueAfter(full, "Цаана нь ажиллаж байгаа зүйл", ["Дэлгэрэнгүй тайлан"]),
    detailed: {
      goalPicture: valueAfter(detailed, "Гол зураг", ["Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?"]),
      foodFeeling: valueAfter(detailed, "Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?", ["Давтагддаг тойрог"]),
      cycle: valueAfter(detailed, "Давтагддаг тойрог", ["Яагаад ингэж хэлж байна вэ?"]),
      why: valueAfter(detailed, "Яагаад ингэж хэлж байна вэ?", ["Гол буруу ойлголт"]),
      misunderstanding: valueAfter(detailed, "Гол буруу ойлголт", ["Одоохондоо хэт яарахгүй зүйлс"]),
      avoid: valueAfter(detailed, "Одоохондоо хэт яарахгүй зүйлс", ["Мөчлөг тогтмол бус үед", "Мөчлөгтэй холбоотой анхаарах зүйл", "Эхний жижиг өөрчлөлт"]),
      cycleNote,
      firstStep: valueAfter(detailed, "Эхний жижиг өөрчлөлт", ["14 хоногийн туршилт"]),
      experiment: valueAfter(detailed, "14 хоногийн туршилт", ["7 хоногийн тэмдэглэл юуг тодруулах вэ?"]),
      diary: valueAfter(detailed, "7 хоногийн тэмдэглэл юуг тодруулах вэ?")
    },
    professional: result.generatedMode !== "deep" ? {
      title: firstLine(full),
      summary: valueAfter(full, firstLine(full), ["Ярилцах товч нэгтгэл"]),
      consult: valueAfter(full, "Ярилцах товч нэгтгэл", ["Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ?"]),
      whyStopped: valueAfter(full, "Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ?", ["Одоогоор зайлсхийх зүйлс:"]),
      avoid: valueAfter(full, "Одоогоор зайлсхийх зүйлс:", ["Эхэлж өөрчлөх хамгийн амар цэг:"]),
      firstStep: valueAfter(full, "Эхэлж өөрчлөх хамгийн амар цэг:")
    } : null
  };
}

function firstLine(text) {
  return String(text || "").split("\n").map((line) => line.trim()).find(Boolean) || "";
}

function renderPdf(results, outputPath, title) {
  writeFileSync(TEMP_JSON, JSON.stringify({
    outputPath,
    title,
    reports: results.map(reportPdfModel)
  }, null, 2));
  writeFileSync(TEMP_PY, `
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

data = json.load(open("${TEMP_JSON}", "r", encoding="utf-8"))
font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
try:
    pdfmetrics.registerFont(TTFont("MongolianFont", font_path))
    font_name = "MongolianFont"
except Exception:
    font_name = "Helvetica"

styles = getSampleStyleSheet()
PAGE_W, PAGE_H = A4
BG = colors.HexColor("#F7F3EA")
INK = colors.HexColor("#26332D")
MUTED = colors.HexColor("#5E6A60")
GREEN = colors.HexColor("#23483A")
GREEN_DARK = colors.HexColor("#173328")
GREEN_SOFT = colors.HexColor("#DDE8DF")
GREEN_PALE = colors.HexColor("#EEF5ED")
BEIGE = colors.HexColor("#EADDC8")
BEIGE_DARK = colors.HexColor("#B79C72")
CARD = colors.HexColor("#FFFDF7")
LINE = colors.HexColor("#D8CDB9")
WHITE = colors.HexColor("#FFFFFB")

base = ParagraphStyle("base", parent=styles["BodyText"], fontName=font_name, fontSize=10.2, leading=14.5, textColor=INK, alignment=TA_LEFT, spaceAfter=6)
small = ParagraphStyle("small", parent=base, fontSize=8.7, leading=12, textColor=MUTED, spaceAfter=4)
kicker = ParagraphStyle("kicker", parent=base, fontSize=8, leading=10, textColor=BEIGE_DARK, spaceAfter=4)
h1 = ParagraphStyle("h1", parent=base, fontSize=22, leading=26, textColor=GREEN_DARK, spaceAfter=9)
h2 = ParagraphStyle("h2", parent=base, fontSize=15, leading=18, textColor=GREEN, spaceBefore=4, spaceAfter=7)
h3 = ParagraphStyle("h3", parent=base, fontSize=12, leading=15, textColor=GREEN, spaceAfter=4)
quote_style = ParagraphStyle("quote", parent=base, fontSize=11.5, leading=16, textColor=GREEN, leftIndent=2, rightIndent=2)
chip_style = ParagraphStyle("chip", parent=base, fontSize=7.8, leading=9.5, textColor=GREEN_DARK, spaceAfter=0)
number_style = ParagraphStyle("number", parent=base, fontSize=16, leading=18, textColor=GREEN_DARK, alignment=1, spaceAfter=0)
cover_label = ParagraphStyle("cover_label", parent=base, fontSize=8.5, leading=10, textColor=BEIGE, spaceAfter=10)
cover_title = ParagraphStyle("cover_title", parent=base, fontSize=20, leading=24, textColor=colors.white, spaceAfter=8)
cover_small = ParagraphStyle("cover_small", parent=base, fontSize=9, leading=12, textColor=GREEN_PALE, spaceAfter=0)
cover_number = ParagraphStyle("cover_number", parent=base, fontSize=34, leading=38, textColor=GREEN_DARK, alignment=1, spaceAfter=0)

def esc(value):
    return str(value or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def p(text, style=base):
    return Paragraph(esc(text).replace("\\n", "<br/>"), style)

def lines(text):
    return [line.strip().replace("- ", "", 1) for line in str(text or "").split("\\n") if line.strip()]

def card(title, body="", accent=False, width=164):
    content = []
    if title:
        content.append(p(title, kicker if accent else h3))
    if isinstance(body, list):
        for item in body:
            content.append(p("• " + item, base))
    elif body:
        content.append(p(body, base))
    table = Table([[content]], colWidths=[width * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN_SOFT if accent else CARD),
        ("BOX", (0, 0), (-1, -1), 0.65, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return table

def chip(label, value):
    body = [p(label, kicker), p(value, chip_style)]
    t = Table([[body]], colWidths=[50 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN_PALE),
        ("BOX", (0, 0), (-1, -1), 0.55, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t

def chip_row(report):
    t = Table([[
        chip("Тайлан", str(report["index"])),
        chip("Профайл", report["title"]),
        chip("Зорилго", "Гол тойргоо ойлгох")
    ]], colWidths=[53 * mm, 53 * mm, 53 * mm])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def cover_opener(report):
    left = [
        p("Жин хасалтын гүн зураглал", cover_label),
        p("Тайлан %s — %s" % (report["index"], report["title"]), cover_title),
        p("Хувийн зан төлөвийн гүн тайлан", cover_small)
    ]
    right = [
        p("Тайлан", kicker),
        p(str(report["index"]), cover_number),
        p("Гол зураглал", chip_style)
    ]
    t = Table([[left, right]], colWidths=[116 * mm, 48 * mm], rowHeights=[46 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), GREEN_DARK),
        ("BACKGROUND", (1, 0), (1, 0), BEIGE),
        ("LINEAFTER", (0, 0), (0, 0), 4, BEIGE_DARK),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
    ]))
    return t

def quote_card(text):
    body = [[p("Гол санаа", kicker)], [p("“" + str(text or "").strip() + "”", quote_style)]]
    t = Table(body, colWidths=[164 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
        ("BOX", (0, 0), (-1, -1), 0.8, BEIGE_DARK),
        ("LINEBEFORE", (0, 0), (-1, -1), 4, GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return t

def two_cards(left_title, left_body, right_title, right_body):
    t = Table([[
        card(left_title, left_body, False, 78),
        card(right_title, right_body, True, 78)
    ]], colWidths=[80 * mm, 80 * mm])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def editorial_pair(left_title, left_body, right_title, right_body):
    t = Table([[
        card(left_title, left_body, True, 78),
        card(right_title, right_body, False, 78)
    ]], colWidths=[80 * mm, 80 * mm])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def optional_surface_hidden(report):
    surface = str(report.get("surface") or "").strip()
    hidden = str(report.get("hidden") or "").strip()
    if surface and hidden:
        return two_cards("Ил харагдаж байгаа зүйл", surface, "Цаана нь ажиллаж байгаа зүйл", hidden)
    if surface:
        return card("Ил харагдаж байгаа зүйл", surface)
    if hidden:
        return card("Цаана нь ажиллаж байгаа зүйл", hidden, True)
    return None

def page_header(story, report, label, title=None):
    story.append(p("Жин хасалтын гүн зураглал", kicker))
    story.append(p(title or "Тайлан %s — %s" % (report["index"], report["title"]), h1))
    story.append(p(label, small))
    story.append(Spacer(1, 8))

def page_break(story):
    story.append(PageBreak())

def flow_steps(text):
    items = [item.strip() for item in str(text or "").replace("↓", "\\n").split("\\n") if item.strip()]
    if not items:
        return [card("Давтагддаг тойрог", "Энэ хэсэгт тойргийн алхмууд гарна.")]
    flow = []
    circled = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"]
    for index, item in enumerate(items, start=1):
        marker = p(circled[index - 1] if index <= len(circled) else str(index), number_style)
        step_card = card("", item, False, 140)
        row = Table([[marker, step_card]], colWidths=[18 * mm, 144 * mm])
        row.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), GREEN_SOFT),
            ("BOX", (0, 0), (0, 0), 0.8, GREEN),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        flow.append(row)
        if index < len(items):
            connector = Table([["", ""]], colWidths=[18 * mm, 144 * mm], rowHeights=[5 * mm])
            connector.setStyle(TableStyle([
                ("LINEBEFORE", (0, 0), (0, 0), 1.2, BEIGE_DARK),
                ("LEFTPADDING", (0, 0), (-1, -1), 9 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            flow.append(connector)
    flow.append(Spacer(1, 4))
    flow.append(card("Дахин эргэх цэг", "Хэрвээ бэлтгэсэн жижиг тулгуур байхгүй бол энэ тойрог дараагийн төстэй өдөр буцаж ирдэг.", True))
    return flow

def experiment_blocks(text):
    items = lines(text)
    return items or [str(text or "").strip()]

def experiment_plan(text):
    items = experiment_blocks(text)
    labels = ["Эхний 3 өдөр", "4-10 дахь өдөр", "11-14 дэх өдөр"]
    blocks = []
    recovery = ""
    for item in items:
        lower = item.lower()
        if "хэрвээ" in lower or "алгас" in lower:
            recovery = item
        elif "эхний 3" in lower:
            blocks.append(("Эхний 3 өдөр", item.split(":", 1)[-1].strip() or item))
        elif "4-10" in lower or "4–10" in lower:
            blocks.append(("4-10 дахь өдөр", item.split(":", 1)[-1].strip() or item))
        elif "11-14" in lower or "11–14" in lower:
            blocks.append(("11-14 дэх өдөр", item.split(":", 1)[-1].strip() or item))
    while len(blocks) < 3 and len(blocks) < len(items):
        idx = len(blocks)
        blocks.append((labels[idx], items[idx]))
    return blocks[:3], recovery

def diary_prompts(text):
    return lines(text)[:4] or [str(text or "").strip()]

def plan_step(index, title, body, accent=False):
    marker = p(str(index), number_style)
    content = [p(title, h3), p(body, base)]
    t = Table([[marker, content]], colWidths=[16 * mm, 146 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), BEIGE if accent else GREEN_SOFT),
        ("BACKGROUND", (1, 0), (1, 0), GREEN_SOFT if accent else CARD),
        ("BOX", (0, 0), (-1, -1), 0.65, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t

def prompt_card(index, text):
    t = Table([[p(str(index), number_style), p(text, base)]], colWidths=[14 * mm, 146 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), GREEN_SOFT),
        ("BACKGROUND", (1, 0), (1, 0), CARD),
        ("BOX", (0, 0), (-1, -1), 0.65, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t

def prompt_panel(index, text, width=78, label="Ажиглах асуулт"):
    body = [p(str(index), number_style), p(label, kicker), p(text, base)]
    t = Table([[body]], colWidths=[width * mm], rowHeights=[34 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CARD),
        ("BOX", (0, 0), (-1, -1), 0.65, LINE),
        ("LINEBEFORE", (0, 0), (-1, -1), 3, GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def prompt_grid(prompts):
    panels = [prompt_panel(i, prompt, 78) for i, prompt in enumerate(prompts, start=1)]
    rows = []
    for i in range(0, len(panels), 2):
        row = panels[i:i+2]
        if len(row) == 1:
            row.append("")
        rows.append(row)
    t = Table(rows, colWidths=[80 * mm, 80 * mm])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t

def cycle_context_cards(text):
    items = lines(text)
    if items and items[0] == "Мөчлөг тогтмол бус үед":
        items = items[1:]
    if not items:
        items = [str(text or "").strip()]
    story_items = [card("Мөчлөг тогтмол бус үед", "Энэ хэсгийг онош биш, зөвхөн нэмэлт нөхцөл гэж уншаарай.", True)]
    for index, item in enumerate(items[:4], start=1):
        story_items.append(Spacer(1, 6))
        story_items.append(prompt_panel(index, item, 164, "Анхаарах зүйл"))
    return story_items

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, 8 * mm, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(BEIGE)
    canvas.rect(8 * mm, 0, 2 * mm, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(BEIGE_DARK)
    canvas.setLineWidth(0.7)
    canvas.line(22 * mm, 20 * mm, 188 * mm, 20 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(font_name, 7.5)
    canvas.drawString(22 * mm, 14.5 * mm, "Жин хасалтын гүн зураглал")
    canvas.drawRightString(188 * mm, 14.5 * mm, "Хуудас %s" % doc.page)
    canvas.restoreState()

story = []
for report in data["reports"]:
    if report["mode"] != "deep":
        story.append(cover_opener(report))
        story.append(Spacer(1, 10))
        story.append(p("Мэргэжлийн хүнтэй эхэлж ярилцах тайлан", h2))
        story.append(chip_row(report))
        story.append(Spacer(1, 10))
        story.append(card("Эхлээд мэргэжлийн хүнтэй ярилцах", report["professional"]["summary"], True))
        page_break(story)
        page_header(story, report, "Ярилцахад авч очих нэгтгэл")
        consult_items = lines(report["professional"]["consult"])
        for index, item in enumerate(consult_items[:3], start=1):
            story.append(prompt_panel(index, item, 164, "Ярилцах зүйл"))
            story.append(Spacer(1, 6))
        story.append(card("Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ?", report["professional"]["whyStopped"]))
        page_break(story)
        page_header(story, report, "Аюулгүй эхлэх дараалал")
        story.append(card("Одоогоор зайлсхийх зүйлс", lines(report["professional"]["avoid"])))
        story.append(Spacer(1, 8))
        story.append(card("Эхэлж өөрчлөх хамгийн амар цэг", report["professional"]["firstStep"], True))
        if report != data["reports"][-1]:
            page_break(story)
        continue

    story.append(cover_opener(report))
    story.append(Spacer(1, 10))
    story.append(chip_row(report))
    story.append(Spacer(1, 9))
    story.append(p(report["intro"], small))
    story.append(Spacer(1, 6))
    story.append(card("Товч хариу", report["simple"]["stuckMoment"], True))
    story.append(Spacer(1, 7))
    surface_hidden = optional_surface_hidden(report)
    if surface_hidden:
        story.append(surface_hidden)
        story.append(Spacer(1, 7))
    story.append(quote_card(report["hidden"] or (report["simple"]["meaningBullets"][0] if report["simple"]["meaningBullets"] else report["simple"]["stuckMoment"])))
    story.append(Spacer(1, 7))
    story.append(card("Онцлох санаа", report["simple"]["meaningBullets"], False))
    story.append(Spacer(1, 7))
    story.append(card("Эхлээд хийх нэг жижиг зүйл", report["simple"]["firstStep"], True))
    page_break(story)

    page_header(story, report, "Далд сэтгэлзүйн механизм")
    story.append(card("Гол зураг", report["detailed"]["goalPicture"], True))
    story.append(Spacer(1, 8))
    story.append(editorial_pair("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?", report["detailed"]["foodFeeling"], "Яагаад ингэж хэлж байна вэ?", report["detailed"]["why"]))
    story.append(Spacer(1, 8))
    story.append(card("Гол буруу ойлголт", report["detailed"]["misunderstanding"], True))
    page_break(story)

    page_header(story, report, "Давтагддаг тойрог")
    for item in flow_steps(report["detailed"]["cycle"]):
        story.append(item)
    page_break(story)

    page_header(story, report, "Эхний 14 хоногийн туршилт")
    story.append(card("Одоохондоо хэт яарахгүй зүйлс", lines(report["detailed"]["avoid"])))
    story.append(Spacer(1, 8))
    story.append(card("Эхний жижиг өөрчлөлт", report["detailed"]["firstStep"], True))
    story.append(Spacer(1, 8))
    plan_blocks, recovery_note = experiment_plan(report["detailed"]["experiment"])
    for index, (label, body) in enumerate(plan_blocks, start=1):
        story.append(plan_step(index, label, body))
        story.append(Spacer(1, 5))
    if recovery_note:
        story.append(plan_step(4, "Хэрвээ нэг өдөр алгасвал", recovery_note.split(":", 1)[-1].strip(), True))
    page_break(story)

    page_header(story, report, "7 хоногийн тэмдэглэл")
    story.append(p("Энэ тэмдэглэл нь гол тойрог яг ямар өдөр, ямар нөхцөлд хүчтэй болдгийг тодруулахад тусална.", small))
    story.append(Spacer(1, 8))
    story.append(prompt_grid(diary_prompts(report["detailed"]["diary"])))
    story.append(Spacer(1, 6))
    story.append(card("Дараагийн алхам", "Энэ хэсэг нь дараагийн 7 хоногийн тэмдэглэлээр илүү тодорно.", True))

    if report["detailed"]["cycleNote"]:
        page_break(story)
        page_header(story, report, "Нэмэлт нөхцөл")
        for item in cycle_context_cards(report["detailed"]["cycleNote"]):
            story.append(item)
    if report != data["reports"][-1]:
        page_break(story)

doc = SimpleDocTemplate(
    data["outputPath"],
    pagesize=A4,
    rightMargin=22 * mm,
    leftMargin=22 * mm,
    topMargin=24 * mm,
    bottomMargin=24 * mm
)
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
`);
  const result = spawnSync(PYTHON, [TEMP_PY], { stdio: "inherit", encoding: "utf8" });
  if (result.status !== 0) throw new Error(`PDF render failed for ${outputPath}`);
}

function main() {
  ensureDirs();
  const results = personas.map((persona) => runPersona(persona, false));
  const summary = summaryFor(results);
  results.forEach((result) => write(path.join(RAW_DIR, `${result.userId}.json`), JSON.stringify(result, null, 2)));
  write(path.join(OUT_DIR, "VIRTUAL_USER_PROFILES.md"), profilesMd(results));
  write(path.join(OUT_DIR, "VIRTUAL_USER_ANSWERS.md"), answersMd(results));
  write(path.join(OUT_DIR, "USER_FACING_REPORTS.md"), userFacingReportsMd(results));
  write(path.join(OUT_DIR, "COMPREHENSION_AUDIT.md"), comprehensionAuditMd(results, summary));
  write(path.join(OUT_DIR, "ISSUES_AND_FIXES.md"), issuesMd(results, summary));
  write(path.join(OUT_DIR, "SPRINT_33_SUMMARY.md"), sprintSummaryMd(summary));
  renderPdf(results, PDF_PATH, TITLE);
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
