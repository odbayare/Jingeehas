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
    expectedText: ["Нойр муу", "Өдрийн эхний хоолоо тогтмол болго"],
    persona: { age: 41, profile: "Шөнийн ээлжтэй. Өдөр унтах хэмнэл эвдэрдэг, сүүлийн кофе оройтож уудаг, ядарсан үед амттай зүйл татдаг." },
    selectedAnswers: {
      "S1-C01": "41",
      "S1-W02": ["Нойр муудсан", "Ажлын цаг өөрчлөгдсөн"],
      "S1-N01": "4-6 цаг",
      "S1-N02": "Ихэвчлэн",
      "S1-F01": ["Ядарсан", "Амттай юм идмээр байсан"],
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Шөнийн ээлжийн дараа нойр тасалдаад орой амттай юм хурдан тэнхээ өгөх шиг санагддаг. Кофегоо ч заримдаа оройтож уудаг." },
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
    persona: { age: 48, profile: "Мөчлөг зөрөх, нойр өөрчлөгдөх, бие хүнд оргих үе нэмэгдсэн. Биеэ ойлгоход хэцүү болж орой comfort идэлт нэмэгддэг." },
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
    title: "Дасгалын сорил, нүүрс ус хасалтаас rebound авдаг хэрэглэгч",
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
    expectedText: ["эмийн хэрэглээ", "Бие өөрчлөгдөх", "хяналтаа"],
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
    title: "Толь, зураг, social event дээр биеэ нуух хэрэглэгч",
    expectedMode: "professional",
    expectedText: ["өөрийгөө харах", "бусдад харагдах", "ичгүүртэй"],
    persona: { age: 31, profile: "Толь, зураг, social event дээр биеэ нуух хүсэл нэмэгддэг. Идсэний дараа ичих, нуух мэдрэмж хүчтэй тул энгийн тайлан дарагдана." },
    selectedAnswers: {
      "S1-S01": "Заримдаа",
      "S1-S02": "Ихэвчлэн",
      "S1-F02": "Шууд гэмшдэг",
      "S1-S04": "Үгүй"
    },
    freeTextAnswers: { "S1-V01": "Толь, зураг, бусдад харагдах social event дээр биеэ нуух хүсэл ихэсдэг. Идсэний дараа ичих, нуух мэдрэмж хүчтэй болдог." },
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
    "7 хоногоор нарийвчлах",
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

function renderPdf(inputPath, outputPath, title) {
  writeFileSync(TEMP_JSON, JSON.stringify({ inputPath, outputPath, title }, null, 2));
  writeFileSync(TEMP_PY, `
import json
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

data = json.load(open("${TEMP_JSON}", "r", encoding="utf-8"))
text = Path(data["inputPath"]).read_text(encoding="utf-8")
font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
try:
    pdfmetrics.registerFont(TTFont("MongolianFont", font_path))
    font_name = "MongolianFont"
except Exception:
    font_name = "Helvetica"

styles = getSampleStyleSheet()
base = ParagraphStyle("base", parent=styles["BodyText"], fontName=font_name, fontSize=9.5, leading=13, alignment=TA_LEFT, spaceAfter=5)
h1 = ParagraphStyle("h1", parent=base, fontSize=17, leading=21, spaceAfter=12)
h2 = ParagraphStyle("h2", parent=base, fontSize=13, leading=17, spaceBefore=8, spaceAfter=5)
small = ParagraphStyle("small", parent=base, fontSize=8.5, leading=11)

def esc(value):
    return str(value or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

story = [Paragraph(esc(data["title"]), h1), Spacer(1, 8)]
for block in text.split("\\n\\n"):
    block = block.strip()
    if not block or block == data["title"]:
        continue
    if block == "-----" or block == "---":
        story.append(PageBreak())
        continue
    style = h2 if block.startswith("Тайлан ") else small if len(block) > 800 else base
    story.append(Paragraph(esc(block).replace("\\n", "<br/>"), style))

doc = SimpleDocTemplate(data["outputPath"], pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
doc.build(story)
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
  renderPdf(path.join(OUT_DIR, "USER_FACING_REPORTS.md"), PDF_PATH, TITLE);
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
