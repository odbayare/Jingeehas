import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_RAW_DIR = path.join(ROOT, "audits", "virtual-users-10", "raw");
const OUT_DIR = path.join(ROOT, "audits", "virtual-users-10-pdf");
const OUT_RAW_DIR = path.join(OUT_DIR, "raw");
const PDF_PATH = path.join(OUT_DIR, "WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf");
const MD_PATH = path.join(OUT_DIR, "WEIGHT_TEST_10_VIRTUAL_REPORTS.md");
const NOTES_PATH = path.join(OUT_DIR, "PDF_EXPORT_NOTES.md");
const TEMP_MODEL_PATH = path.join("/private/tmp", "weight-test-virtual-reports-pdf-model.json");
const TEMP_RENDERER_PATH = path.join("/private/tmp", "weight-test-virtual-reports-renderer.py");

const PYTHON = "/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const SOURCE_SCRIPT = "scripts/run-virtual-user-audit.mjs";
const EXPORT_SCRIPT = "scripts/export-virtual-reports-pdf.mjs";

const PUBLIC_BANNED_TERMS = [
  "Perfectionism",
  "feedback",
  "Plan",
  "guilt",
  "shame",
  "default",
  "reward",
  "trigger",
  "pattern",
  "diary",
  "craving",
  "reset",
  "failure",
  "reflection",
  "context",
  "Богино reflection",
  "Reflection-д бүтэцтэй context хараахан бага байна",
  "тасарсан бэ",
  "Хоол удахад дараахаас гардаг уу"
];

const USER_LABELS = {
  "user-01": "Оройн тэнхээ дуусах үе",
  "user-02": "Стрессийн дараах тайвшрах идэлт",
  "user-03": "Нэг хазайлтаас төлөвлөгөө үргэлжлэхээ болих үе",
  "user-04": "Дараа өлсөхөөс хамгаалах давтамж",
  "user-05": "Өөртөө таатай зүйл дутсан орой",
  "user-06": "Орчны дохионд автоматаар татагдах үе",
  "user-07": "Нойр ба оройн тэнхээний зөрүү",
  "user-08": "Биеийн нөхцөл эхэлж шалгах шаардлагатай үе",
  "user-09": "Сахар/даралтын дохио санаа зовоосон үе",
  "user-10": "Яаралтай аюулгүй байдлын дохио"
};

const FRIENDLY_MECHANISMS = {
  executive: "Орой хоол бодох тэнхээ дуусах үе",
  decisionDefault: "Бэлэн сонголт хамгийн амар болох үе",
  hungerSafety: "Дараа өлсөхөөс хамгаалах давтамж",
  glucose: "Биеийн дохиог хамгаалах хэрэгцээ",
  physiological: "Өлсөлтөд бие хүчтэй хариулах үе",
  medical: "Биеийн нөхцлөөс үүсэх саад",
  regulation: "Сэтгэл санааг хоолоор түр намдаах давтамж",
  reward: "Таатай мэдрэмж авах хэрэгцээ",
  rewardDeficit: "Өдөржин таатай зүйл дутсан үе",
  roleOverload: "Өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх идэлт",
  cue: "Орчны дохионоос эхэлдэг идэх хүсэл",
  collapse: "Нэг хазайлтаас бүхэл өдөр дууссан мэт болох давтамж",
  circadian: "Нойр ба тэнхээний зөрүү",
  social: "Хүмүүсийн дунд амар сонголт руу орох үе",
  bodySafety: "Биеэ харах дарамтаас аюулгүй зай авах хэрэгцээ",
  shameAvoidance: "Ичих, нуух мэдрэмжээс зай авах",
  identity: "Өөрийн дүр төрхтэй холбоотой зөрчил",
  perfectionism: "Төгс хийх гэж хэт чангардаг хэв маяг"
};

const MECHANISM_NAME_TO_KEY = {
  "Executive Load Failure": "executive",
  "Decision-Default Mismatch": "decisionDefault",
  "Hunger-Safety / Scarcity Protection": "hungerSafety",
  "Glucose-Safety / Hypoglycemia Risk Pattern": "glucose",
  "Hunger-Triggered Physiological Reactivity": "physiological",
  "Medical / Medication / Physiological Friction": "medical",
  "Food-as-Regulation System": "regulation",
  "Reward-Seeking / Stimulation Compensation": "reward",
  "Reward Deficit Compensation": "rewardDeficit",
  "Role Overload / Self-Neglect Pattern": "roleOverload",
  "Cue-Conditioned Automatic Eating": "cue",
  "Control-Collapse Cycle": "collapse",
  "Circadian-Energy Mismatch": "circadian",
  "Social Belonging Food Pattern": "social",
  "Body-Safety / Attention Avoidance": "bodySafety",
  "Shame-Avoidance Loop": "shameAvoidance",
  "Identity Conflict / Learned Failure Expectancy": "identity",
  "Perfectionism / All-or-Nothing Pattern": "perfectionism"
};

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8"
  });
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} ${args.join(" ")} failed${details ? `\n${details}` : ""}`);
  }
  return String(result.stdout || "").trim();
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function flattenAnswer(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value ?? "");
}

function translateExportText(value) {
  return String(value ?? "")
    .replace(/\bknows nutrition basics but ends days depleted\b/g, "хооллолтын суурь мэдлэгтэй ч өдөр дуусахад тэнхээ нь багасдаг")
    .replace(/\bSlow 8 kg gain over two years during workload and sleep pressure\./g, "Ажлын ачаалал, нойрны дарамттай давхцаж хоёр жилд аажмаар 8 кг нэмсэн.")
    .replace(/\bDaytime discipline, skipped lunches, evening delivery and desk snacks\./g, "Өдөр өөрийгөө барьдаг, өдрийн хоол алгасдаг, орой хоол захиалга болон ширээний зууш нэмэгддэг.")
    .replace(/\bFrustration and fatigue more than sadness; guilt the next morning\./g, "Гунигаас илүү бухимдал, ядаргаа давамгай; маргааш өглөө өөрийгөө буруутгах мэдрэмж төрдөг.")
    .replace(/\b5-6 hours, low evening energy\./g, "5-6 цаг унтдаг, оройн тэнхээ бага.")
    .replace(/\bNo severe safety signal\./g, "Хүнд аюулгүй байдлын дохио байхгүй.")
    .replace(/\bordinary report\b/g, "ердийн тайлан")
    .replace(/\bevening decision load \/ low-energy default\b/g, "орой хоол бодох тэнхээ дуусах үе / тэнхээ багасах үеийн хамгийн амар сонголт")
    .replace(/\bTwo-child working parent\b/g, "Хоёр хүүхэдтэй, ажилтай эцэг/эх")
    .replace(/\bOffice worker carrying deadlines\b/g, "Ажлын хугацаа, гэрийн хүлээлт давхцсан оффисын ажилтан")
    .replace(/\bfamily expectations\b/g, "гэр бүлийн хүлээлт")
    .replace(/\bRepeated calorie counting and fasting attempts\./g, "Калори тоолох, мацаг барих оролдлого давтагдсан.")
    .replace(/\bEats after stressful calls and tense evenings\./g, "Стресстэй дуудлага, түгшүүртэй оройн дараа иддэг.")
    .replace(/\bFood gives temporary calm, then guilt\./g, "Хоол түр тайвшруулдаг, дараа нь өөрийгөө буруутгах мэдрэмж төрдөг.")
    .replace(/\bAverage sleep, stress spikes\./g, "Нойр дундаж, стресс үе үе огцом нэмэгддэг.")
    .replace(/\bNo purging or self-harm\./g, "Бөөлжүүлэх, өөртөө хор хүргэх дохио байхгүй.")
    .replace(/\bfood-as-regulation \/ shame-avoidance secondary\b/g, "сэтгэлээ хоолоор түр намдаах / ичих мэдрэмжээс зай авах хоёрдогч давтамж")
    .replace(/\bStarts strict plans after every weekend\b/g, "Амралтын өдрийн дараа хатуу төлөвлөгөө эхлүүлдэг")
    .replace(/\bRepeated strict diets and Monday restarts\./g, "Хатуу хоолны дэглэм, даваа гарагийн дахин эхлэл давтагдсан.")
    .replace(/\bOne slip turns into overeating because the day feels ruined\./g, "Нэг хазайлт өдөр бүхэлдээ өнгөрсөн мэт санагдаж хэтрүүлж идэхэд хүрдэг.")
    .replace(/\bAll-or-nothing, guilt, restart pressure\./g, "Бүгд эсвэл юу ч биш бодол, өөрийгөө буруутгах мэдрэмж, дахин эхлэх дарамт.")
    .replace(/\bVariable\./g, "Тогтворгүй.")
    .replace(/\bNo urgent safety\./g, "Яаралтай аюулгүй байдлын дохио байхгүй.")
    .replace(/\bcontrol-collapse \/ all-or-nothing\b/g, "хяналт алдагдах тойрог / бүгд эсвэл юу ч биш сэтгэлгээ")
    .replace(/\bBusy field worker with unpredictable meal access\./g, "Хооллох боломж нь тогтворгүй, завгүй гадуур ажилтай хүн.")
    .replace(/\bWeight fluctuates with job seasons\./g, "Ажлын улирлын ачааллаас хамаарч жин хэлбэлздэг.")
    .replace(/\bLong meal gaps, eats in advance, leaves little uneaten\./g, "Хоол холдох нь олон, урьдчилж иддэг, хоол үлдээх нь бага.")
    .replace(/\bFear of later hunger, urgency around available food\./g, "Дараа өлсөхөөс айх, олдсон хоолонд яарах мэдрэмж.")
    .replace(/\bMostly normal\./g, "Ерөнхийдөө хэвийн.")
    .replace(/\bNo severe symptoms\./g, "Хүнд шинж тэмдэг байхгүй.")
    .replace(/\bhunger-safety \/ scarcity protection\b/g, "дараа өлсөхөөс хамгаалах / хоол хомсдохоос сэргийлэх давтамж")
    .replace(/\bCaregiver who takes care of others first\./g, "Бусдыг түрүүнд тавьж асардаг хүн.")
    .replace(/\bSlow gain after caregiving load increased\./g, "Асаргаа, халамжийн ачаалал нэмэгдсэний дараа аажмаар жин нэмсэн.")
    .replace(/\bEvening sweets feel like the only personal reward\./g, "Оройн амттан өөртөө үлдэх цорын ганц таатай мөч мэт санагддаг.")
    .replace(/\bSelf-neglect, emptiness, needing a small private pleasure\./g, "Өөрийгөө хойш тавих, хоосон мэт мэдрэмж, хувийн жижиг таатай зүйл хэрэгтэй болох.")
    .replace(/\bTired most evenings\./g, "Ихэнх орой ядарсан.")
    .replace(/\breward deficit \/ self-neglect secondary\b/g, "таатай зүйл дутсан үе / өөрийгөө хойш тавих хоёрдогч давтамж")
    .replace(/\bRemote worker surrounded by snack cues and delivery apps\./g, "Зууш, хоол захиалгын аппын дохио ойр байдаг зайнаас ажиллагч.")
    .replace(/\bWeight rose after working from home\./g, "Гэрээс ажиллах болсноос хойш жин нэмэгдсэн.")
    .replace(/\bOften not hungry; eats when food is visible\./g, "Ихэвчлэн өлсөөгүй ч хоол харагдахад иддэг.")
    .replace(/\bLow distress, mostly automatic environment response\./g, "Тавгүй мэдрэмж бага, ихэвчлэн орчны дохионд автоматаар хариулах хэлбэртэй.")
    .replace(/\bNormal\./g, "Хэвийн.")
    .replace(/\bNo strong emotional distress\./g, "Сэтгэлзүйн хүчтэй тавгүй байдал байхгүй.")
    .replace(/\bcue-conditioned automatic eating \/ environment default\b/g, "орчны дохионоос эхэлдэг автомат идэлт / орчны хамгийн амар сонголт")
    .replace(/\bLate-night worker with poor sleep and tired mornings\./g, "Орой ажилладаг, нойр муу, өглөө ядруу сэрдэг хүн.")
    .replace(/\bWeight gain followed sleep disruption\./g, "Нойр алдагдсаны дараа жин нэмэгдсэн.")
    .replace(/\bSweet\/fatty food pull after poor sleep\./g, "Нойр муу үед амттай, тослог хоол руу татагддаг.")
    .replace(/\bNot highly distressed; mostly exhausted\./g, "Тавгүй мэдрэмж өндөр биш, гол нь их ядарсан.")
    .replace(/\bBad sleep, possible snoring, wakes tired\./g, "Нойр муу, хурхирах магадлалтай, ядруу сэрдэг.")
    .replace(/\bNo urgent safety; check note may be useful if symptoms strengthen\./g, "Яаралтай аюулгүй байдлын дохио байхгүй; шинж нэмэгдвэл шалгуулах сануулга хэрэгтэй байж магадгүй.")
    .replace(/\bsleep\/energy mismatch\b/g, "нойр, тэнхээний зөрүү")
    .replace(/\bHealth change and medication period, worried the issue is not just habits\./g, "Эрүүл мэндийн өөрчлөлт, эмийн хэрэглээтэй үе; асуудал зөвхөн дадал биш байж магадгүй гэж санаа зовсон.")
    .replace(/\bWeight increased after medication and swelling\/fatigue appeared\./g, "Эм хэрэглэж эхэлсний дараа, хавагнах/ядрах шинжтэй давхцаж жин нэмсэн.")
    .replace(/\bModerate eating; behavior-only explanation feels incomplete\./g, "Идэлт дунд зэрэг; зөвхөн зан үйлээр тайлбарлахад дутуу санагддаг.")
    .replace(/\bConcern and confusion rather than loss of control\./g, "Хяналт алдсанаас илүү санаа зовнил, будилах мэдрэмж давамгай.")
    .replace(/\bFatigue and low energy\./g, "Ядаргаа, тэнхээ багасах.")
    .replace(/\bSwelling, fatigue, possible BP concern\./g, "Хавагнах, ядрах, даралттай холбоотой байж магадгүй санаа зовнил.")
    .replace(/\bmedical \/ medication \/ physiological friction\b/g, "биеийн нөхцөл / эмийн хэрэглээ / физиологийн саад")
    .replace(/\bLong meal gaps produce body symptoms and fear\./g, "Хоол холдох үед биеийн шинж болон айдас гардаг.")
    .replace(/\bHas tried skipping meals but symptoms worsen\./g, "Хоол алгасаж үзсэн ч шинж тэмдэг нэмэгддэг.")
    .replace(/\bTrembling, sweating, dizziness, heart pounding after long gaps\./g, "Хоол холдоход гар салгалах, хөлрөх, толгой эргэх, зүрх дэлсэх шинж гардаг.")
    .replace(/\bAnxious about sugar\/BP readings\./g, "Сахар/даралтын хэмжилтэд санаа зовдог.")
    .replace(/\bMeasured abnormal sugar\/BP before; may use related medication\./g, "Өмнө нь сахар/даралтын хэмжилт хэвийн бус гарч байсан; холбоотой эм хэрэглэдэг байж магадгүй.")
    .replace(/\bglucose\/BP concern\b/g, "сахар/даралтын санаа зовнил")
    .replace(/\bDelivery\b/g, "Хоол захиалга")
    .replace(/\bdelivery\b/g, "хоол захиалга")
    .replace(/\bSnack\b/g, "Зууш")
    .replace(/\bsnack\b/g, "зууш")
    .replace(/\bflat feeling\b/g, "хоосон мэт мэдрэмж")
    .replace(/\bchallenge\b/g, "сорил")
    .replace(/\bWeight and eating distress is severe and current safety text appears\./g, "Жин, идэлттэй холбоотой тавгүй мэдрэмж хүчтэй бөгөөд аюулгүй байдлын зөвлөмж гарч байгаа")
    .replace(/\bDistress around eating and body image has escalated\./g, "Идэлт, биеийн дүр төрхтэй холбоотой тавгүй мэдрэмж нэмэгдсэн")
    .replace(/\bNot audited as ordinary eating pattern because safety comes first\./g, "Аюулгүй байдал түрүүнд тул ердийн идэлтийн давтамжаар дүгнээгүй")
    .replace(/\bCurrent self-harm thought\./g, "Өөртөө хор хүргэх тухай одоогийн бодол илэрсэн")
    .replace(/\bPoor\./g, "Муу")
    .replace(/\bUrgent self-harm signal\./g, "Яаралтай аюулгүй байдлын дохио");
}

function friendlyMechanismFromKey(key) {
  return FRIENDLY_MECHANISMS[key] || key || "Тодорхойгүй";
}

function friendlyMechanismFromName(name, ranked = []) {
  if (!name) return "Аюулгүй байдлын чиглэл";
  const key = MECHANISM_NAME_TO_KEY[name] || ranked.find((item) => item.name === name)?.key;
  return friendlyMechanismFromKey(key) || name;
}

function routeLabel(mode) {
  return {
    deep: "Энгийн бүрэн тайлан",
    check: "Биеийн дохиог шалгах сануулгатай тайлан",
    professional: "Эхлээд мэргэжлийн хүнтэй ярилцах чиглэл",
    urgent: "Яаралтай аюулгүй байдлын чиглэл"
  }[mode] || mode;
}

function safetyModeLabel(mode) {
  return {
    deep: "Mode 1 - энгийн",
    check: "Mode 2 - шалгуулах дохио",
    professional: "Mode 3 - мэргэжлийн хүн түрүүнд",
    urgent: "Mode 4 - яаралтай аюулгүй байдал"
  }[mode] || mode;
}

function expectedRouteLabel(profile) {
  const expected = String(profile.expectedRoute || "");
  if (/urgent/i.test(expected)) return "Mode 4 - яаралтай аюулгүй байдал";
  if (/Mode 3|professional/i.test(expected)) return "Mode 3 - мэргэжлийн хүн түрүүнд";
  if (/Mode 2|check/i.test(expected)) return "Mode 2 - шалгуулах дохио";
  return "Энгийн тайлан";
}

function splitReportSections(text) {
  const headings = [
    "Гүн зураглалын тайлан",
    "Эхлээд мэргэжлийн хүнтэй ярилцах",
    "Яаралтай аюулгүй байдлын зөвлөмж",
    "Хариултын хүрэлцээ",
    "Эхний зураглал ба бодит ажиглалт",
    "Хамгийн тод давтагдаж буй зүйл",
    "Таны хариултаас хамгийн тод харагдаж буй зүйл",
    "Гол давтагдаж буй нөхцөл",
    "Давхар нөлөөлж буй давтамжууд",
    "Илэрч буй зан үйлүүд",
    "Энэ зан үйл ямар үүрэгтэй байж болох вэ?",
    "Давтагддаг тойрог",
    "Идэх хүсэл эхэлдэг нөхцөл",
    "Баталгаажуулсан тайлбар",
    "Идэхийн өмнөх 30 минут",
    "Идсэний дараах 30 минут",
    "Асуудал яг юу биш вэ?",
    "Өмнөх аргууд яагаад удаан ажиллаагүй байж болох вэ?",
    "Одоогоор зайлсхийх зүйлс",
    "Эхэлж өөрчлөх хамгийн амар цэг",
    "Эхний зөөлөн алхам",
    "14 хоногийн туршилт",
    "14 хоногийн эхний туршилт",
    "Илүү нарийвчилж болох хэсгүүд",
    "Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй дохио",
    "Ярилцах товч нэгтгэл"
  ];
  let formatted = ` ${String(text || "").replace(/\s+/g, " ").trim()} `;
  for (const heading of headings.sort((a, b) => b.length - a.length)) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    formatted = formatted.replace(new RegExp(`\\s(${escaped})\\s`, "g"), `\n\n### ${heading}\n`);
  }
  return formatted.trim();
}

function selectedAnswersSummary(result) {
  const entries = Object.entries(result.selectedAnswers || {});
  return entries
    .filter(([, value]) => value !== undefined && value !== null && flattenAnswer(value).trim())
    .map(([key, value]) => ({ key, value: translateExportText(flattenAnswer(value)) }));
}

function assertCleanReports(results) {
  const failures = [];
  for (const result of results) {
    const text = String(result.generatedReportText || "");
    for (const term of PUBLIC_BANNED_TERMS) {
      const isAscii = /^[\x00-\x7F]+$/.test(term);
      const pattern = isAscii
        ? new RegExp(`(^|[^A-Za-z])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`, "i")
        : new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      if (pattern.test(text)) failures.push(`${result.id}: ${term}`);
    }
  }
  if (failures.length) {
    throw new Error(`Banned public report terms found:\n${failures.join("\n")}`);
  }
}

function makeMarkdown(model) {
  const summaryRows = model.results.map((result) => {
    const label = USER_LABELS[result.id] || result.label;
    const primary = friendlyMechanismFromName(result.primaryMechanism, result.rankedPatterns);
    return `| ${result.id.replace("user-", "User ")} | ${escapeMarkdown(label)} | ${escapeMarkdown(expectedRouteLabel(result.personaProfile))} | ${escapeMarkdown(routeLabel(result.generatedMode))} | ${escapeMarkdown(primary)} | ${escapeMarkdown(safetyModeLabel(result.generatedMode))} | ${result.verdict} |`;
  });

  const parts = [
    "# Жин хасалтын гүн зураглал",
    "",
    "## 10 виртуал хэрэглэгчийн тайлангийн багц",
    "",
    `Generated: ${model.generatedAt}`,
    `Commit: ${model.commitHash}`,
    `Source script: ${SOURCE_SCRIPT}`,
    `Export script: ${EXPORT_SCRIPT}`,
    "QPay status: disabled",
    "Purpose: internal manual audit before real human testing",
    "",
    "Энэ файл нь бодит хэрэглэгчдэд илгээхээс өмнө тайлангийн чанар, найруулга, давтагдал, аюулгүй байдлын чиглэлийг шалгах зориулалттай.",
    "",
    "## Summary",
    "",
    "| Хэрэглэгч | Дүр | Хүлээгдэж буй чиглэл | Гарсан чиглэл | Гол давтамж | Аюулгүй байдлын түвшин | Дүн |",
    "|---|---|---|---|---|---|---|",
    summaryRows.join("\n"),
    ""
  ];

  model.results.forEach((result, index) => {
    const label = USER_LABELS[result.id] || result.label;
    const profile = result.profile || result.personaProfile || {};
    const primary = friendlyMechanismFromName(result.primaryMechanism, result.rankedPatterns);
    const secondary = (result.secondaryMechanisms || [])
      .map((name) => friendlyMechanismFromName(name, result.rankedPatterns))
      .join(", ") || "Байхгүй";
    const answers = selectedAnswersSummary(result);
    parts.push(
      "<div class=\"page-break\"></div>",
      "",
      `# ${result.id.replace("user-", "User ")} - ${label}`,
      "",
      `Дүрийн товч нэр: ${label}`,
      `Нас/нөхцөл: ${profile.age || ""} - ${translateExportText(profile.context || "")}`,
      `Хүлээгдэж буй чиглэл: ${expectedRouteLabel(profile)}`,
      `Гарсан чиглэл: ${routeLabel(result.generatedMode)}`,
      `Гол давтамж: ${primary}`,
      `Нэмэлт давтамжууд: ${secondary}`,
      `Аюулгүй байдлын түвшин: ${safetyModeLabel(result.generatedMode)}`,
      `Дүн: ${result.verdict}`,
      "",
      "## Дүрийн товч зураглал",
      "",
      `- Амьдралын нөхцөл: ${translateExportText(profile.context || "")}`,
      `- Жингийн түүх: ${translateExportText(profile.weightHistory || "")}`,
      `- Идэлтийн давтамж: ${translateExportText(profile.eatingPattern || "")}`,
      `- Сэтгэлзүйн давтамж: ${translateExportText(profile.emotionalPattern || "")}`,
      `- Нойр/энерги: ${translateExportText(profile.sleepEnergy || "")}`,
      `- Эрүүл мэнд/аюулгүй байдлын тэмдэглэл: ${translateExportText(profile.medicalSafety || "")}`,
      "",
      "## Сонгосон хариултын товч",
      "",
      ...answers.map((answer) => `- ${answer.key}: ${answer.value}`),
      "",
      "## Гарсан тайлан",
      "",
      splitReportSections(result.generatedReportText),
      "",
      ["professional", "urgent"].includes(result.generatedMode)
        ? "Mode 3/4 шалгалт: ердийн жин хасалтын тайлан, төлбөрийн хэсэг, ердийн 14 хоногийн туршилт энэ тайланд гараагүй."
        : "Mode 1/2 шалгалт: ердийн тайлангийн агуулга гарсан бөгөөд гар аргаар уншиж шалгахад бэлэн.",
      "",
      "## Гар шалгалт",
      "",
      "[ ] Хүн бичсэн мэт байгалийн, тодорхой санагдаж байна",
      "[ ] Дүртэйгээ нийцэж байна",
      "[ ] Ерөнхий diet зөвлөгөө шиг биш байна",
      "[ ] Ичээх/буруутгах өнгө байхгүй",
      "[ ] English/engine үг үлдээгүй",
      "[ ] Эхний алхам бодитой байна",
      "[ ] Аюулгүй байдлын чиглэл зөв байна",
      "",
      "Тэмдэглэл:",
      ""
    );
  });

  return `${parts.join("\n").replace(/\n+$/u, "")}\n`;
}

function makeNotes(model) {
  return `# PDF Export Notes

Generated: ${model.generatedAt}
Commit: ${model.commitHash}
Source script: ${SOURCE_SCRIPT}
Export script: ${EXPORT_SCRIPT}

## Output

- PDF: audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf
- Markdown: audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md
- Raw JSON: audits/virtual-users-10-pdf/raw/user-01.json ... user-10.json

## Validation

- Virtual audit was regenerated with \`node scripts/run-virtual-user-audit.mjs --assert-clean\`.
- 10 virtual reports included.
- Public generated report text was checked against the banned English/engine term list before PDF rendering.
- Хориглосон public report үг илрээгүй.
- PDF-д орсон Mode 3/4 тайлан: ${model.results.filter((result) => ["professional", "urgent"].includes(result.generatedMode)).map((result) => result.id).join(", ") || "байхгүй"}.

## Scope

- QPay remains disabled.
- No deploy was performed by this export script.
- Scoring and safety routing are not changed by this packaging step.
`;
}

function pythonRendererSource() {
  return String.raw`
import json
import os
import re
import sys
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

model_path, pdf_path = sys.argv[1], sys.argv[2]
with open(model_path, "r", encoding="utf-8") as fh:
    model = json.load(fh)

font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
font_name = "ArialUnicode"
pdfmetrics.registerFont(TTFont(font_name, font_path))

styles = getSampleStyleSheet()
for style_name in list(styles.byName):
    styles[style_name].fontName = font_name

title_style = ParagraphStyle("TitleMn", parent=styles["Title"], fontName=font_name, fontSize=22, leading=28, alignment=TA_CENTER, spaceAfter=12)
subtitle_style = ParagraphStyle("SubtitleMn", parent=styles["Heading2"], fontName=font_name, fontSize=14, leading=18, alignment=TA_CENTER, textColor=colors.HexColor("#43515c"), spaceAfter=18)
h1_style = ParagraphStyle("H1Mn", parent=styles["Heading1"], fontName=font_name, fontSize=16, leading=21, spaceBefore=8, spaceAfter=8, textColor=colors.HexColor("#1f343d"))
h2_style = ParagraphStyle("H2Mn", parent=styles["Heading2"], fontName=font_name, fontSize=13, leading=17, spaceBefore=7, spaceAfter=5, textColor=colors.HexColor("#31515c"))
h3_style = ParagraphStyle("H3Mn", parent=styles["Heading3"], fontName=font_name, fontSize=11.5, leading=15, spaceBefore=6, spaceAfter=4, textColor=colors.HexColor("#3b4d55"))
body_style = ParagraphStyle("BodyMn", parent=styles["BodyText"], fontName=font_name, fontSize=9.2, leading=12.8, spaceAfter=4)
small_style = ParagraphStyle("SmallMn", parent=body_style, fontSize=8.3, leading=11.4, textColor=colors.HexColor("#43515c"))
cell_style = ParagraphStyle("CellMn", parent=body_style, fontSize=7.3, leading=9.2)
check_style = ParagraphStyle("CheckMn", parent=body_style, fontSize=9, leading=13, leftIndent=8)

def clean(text):
    return str(text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def para(text, style=body_style):
    return Paragraph(clean(text), style)

def split_report(text):
    headings = [
        "Гүн зураглалын тайлан",
        "Эхлээд мэргэжлийн хүнтэй ярилцах",
        "Яаралтай аюулгүй байдлын зөвлөмж",
        "Хариултын хүрэлцээ",
        "Эхний зураглал ба бодит ажиглалт",
        "Хамгийн тод давтагдаж буй зүйл",
        "Таны хариултаас хамгийн тод харагдаж буй зүйл",
        "Гол давтагдаж буй нөхцөл",
        "Давхар нөлөөлж буй давтамжууд",
        "Илэрч буй зан үйлүүд",
        "Энэ зан үйл ямар үүрэгтэй байж болох вэ?",
        "Давтагддаг тойрог",
        "Идэх хүсэл эхэлдэг нөхцөл",
        "Баталгаажуулсан тайлбар",
        "Идэхийн өмнөх 30 минут",
        "Идсэний дараах 30 минут",
        "Асуудал яг юу биш вэ?",
        "Өмнөх аргууд яагаад удаан ажиллаагүй байж болох вэ?",
        "Одоогоор зайлсхийх зүйлс",
        "Эхэлж өөрчлөх хамгийн амар цэг",
        "Эхний зөөлөн алхам",
        "14 хоногийн туршилт",
        "14 хоногийн эхний туршилт",
        "Илүү нарийвчилж болох хэсгүүд",
        "Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй дохио",
        "Ярилцах товч нэгтгэл",
    ]
    value = " " + re.sub(r"\s+", " ", text or "").strip() + " "
    for heading in sorted(headings, key=len, reverse=True):
        value = re.sub(r"\s(" + re.escape(heading) + r")\s", "\n@@HEADING@@\\1\n", value)
    parts = []
    current_heading = ""
    buffer = []
    for line in value.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("@@HEADING@@"):
            if buffer or current_heading:
                parts.append((current_heading, " ".join(buffer).strip()))
            current_heading = line.replace("@@HEADING@@", "", 1)
            buffer = []
        else:
            buffer.append(line)
    if buffer or current_heading:
        parts.append((current_heading, " ".join(buffer).strip()))
    return parts or [("Гарсан тайлан", value.strip())]

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(font_name, 7)
    canvas.setFillColor(colors.HexColor("#66737a"))
    canvas.drawString(doc.leftMargin, 11 * mm, "Жин хасалтын гүн зураглал — дотоод тайлангийн шалгалт")
    canvas.drawRightString(A4[0] - doc.rightMargin, 11 * mm, f"Page {doc.page}")
    canvas.restoreState()

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=16 * mm,
    leftMargin=16 * mm,
    topMargin=15 * mm,
    bottomMargin=17 * mm,
)
story = []

story.append(Spacer(1, 34 * mm))
story.append(Paragraph("Жин хасалтын гүн зураглал", title_style))
story.append(Paragraph("10 виртуал хэрэглэгчийн тайлангийн багц", subtitle_style))
cover_rows = [
    ["Үүсгэсэн огноо", model["generatedAt"]],
    ["Commit", model["commitHash"]],
    ["Эх скрипт", model["sourceScript"]],
    ["QPay төлөв", "идэвхгүй"],
    ["Зорилго", "бодит human testing-ээс өмнөх дотоод гар шалгалт"],
]
cover_table = Table([[para(a, cell_style), para(b, cell_style)] for a, b in cover_rows], colWidths=[34 * mm, 120 * mm])
cover_table.setStyle(TableStyle([
    ("FONTNAME", (0, 0), (-1, -1), font_name),
    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eef3f4")),
    ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd6d9")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(cover_table)
story.append(Spacer(1, 9 * mm))
story.append(para("Энэ файл нь бодит хэрэглэгчдэд илгээхээс өмнө тайлангийн чанар, найруулга, давтагдал, аюулгүй байдлын чиглэлийг шалгах зориулалттай.", body_style))
story.append(PageBreak())

story.append(Paragraph("Нэгтгэл", h1_style))
header = ["Хэрэглэгч", "Дүр", "Хүлээгдсэн чиглэл", "Гарсан чиглэл", "Гол давтамж", "Аюулгүй түвшин", "Дүн"]
rows = [[para(x, cell_style) for x in header]]
for result in model["results"]:
    rows.append([para(x, cell_style) for x in [
        result["displayUser"],
        result["displayLabel"],
        result["expectedRouteLabel"],
        result["actualRouteLabel"],
        result["primaryFriendly"],
        result["safetyModeLabel"],
        result["verdict"],
    ]])
summary_table = Table(rows, colWidths=[16 * mm, 36 * mm, 30 * mm, 30 * mm, 36 * mm, 26 * mm, 15 * mm], repeatRows=1)
summary_table.setStyle(TableStyle([
    ("FONTNAME", (0, 0), (-1, -1), font_name),
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dfeaec")),
    ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#c2ced2")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
]))
story.append(summary_table)

for result in model["results"]:
    story.append(PageBreak())
    story.append(Paragraph(f'{result["displayUser"]} - {clean(result["displayLabel"])}', h1_style))
    meta_rows = [
        ["Дүрийн товч нэр", result["displayLabel"]],
        ["Нас/нөхцөл", f'{result["profile"].get("age", "")} - {result["profile"].get("context", "")}'],
        ["Хүлээгдэж буй чиглэл", result["expectedRouteLabel"]],
        ["Гарсан чиглэл", result["actualRouteLabel"]],
        ["Гол давтамж", result["primaryFriendly"]],
        ["Нэмэлт давтамжууд", result["secondaryFriendly"]],
        ["Аюулгүй байдлын түвшин", result["safetyModeLabel"]],
        ["Дүн", result["verdict"]],
    ]
    meta_table = Table([[para(a, cell_style), para(b, cell_style)] for a, b in meta_rows], colWidths=[42 * mm, 133 * mm])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eef3f4")),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd6d9")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Дүрийн товч зураглал", h2_style))
    profile = result["profile"]
    for label, key in [
        ("Амьдралын нөхцөл", "context"),
        ("Жингийн түүх", "weightHistory"),
        ("Идэлтийн давтамж", "eatingPattern"),
        ("Сэтгэлзүйн давтамж", "emotionalPattern"),
        ("Нойр/энерги", "sleepEnergy"),
        ("Эрүүл мэнд/аюулгүй байдлын тэмдэглэл", "medicalSafety"),
    ]:
        story.append(para(f"{label}: {profile.get(key, '')}", body_style))

    story.append(Paragraph("Сонгосон хариултын товч", h2_style))
    answer_rows = [[para("Асуулт", cell_style), para("Хариулт", cell_style)]]
    for item in result["selectedAnswerItems"]:
        answer_rows.append([para(item["key"], cell_style), para(item["value"], cell_style)])
    answer_table = Table(answer_rows, colWidths=[24 * mm, 151 * mm], repeatRows=1)
    answer_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), font_name),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0f4f5")),
        ("GRID", (0, 0), (-1, -1), 0.2, colors.HexColor("#d2dcdf")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(answer_table)

    story.append(Paragraph("Гарсан тайлан", h2_style))
    for heading, text in split_report(result["generatedReportText"]):
        if heading:
            story.append(Paragraph(heading, h3_style))
        for chunk in re.split(r"(?<=[.!?。])\s+", text):
            chunk = chunk.strip()
            if chunk:
                story.append(para(chunk, body_style))
    story.append(para(result["modeSuppressionNote"], small_style))

    story.append(Paragraph("Гар шалгалт", h2_style))
    for item in [
        "[ ] Хүн бичсэн мэт байгалийн, тодорхой санагдаж байна",
        "[ ] Дүртэйгээ нийцэж байна",
        "[ ] Ерөнхий diet зөвлөгөө шиг биш байна",
        "[ ] Ичээх/буруутгах өнгө байхгүй",
        "[ ] English/engine үг үлдээгүй",
        "[ ] Эхний алхам бодитой байна",
        "[ ] Аюулгүй байдлын чиглэл зөв байна",
    ]:
        story.append(Paragraph(clean(item), check_style))
    story.append(para("Тэмдэглэл:", body_style))
    story.append(Spacer(1, 14 * mm))

doc.build(story, onFirstPage=footer, onLaterPages=footer)
`;
}

function buildModel(results, commitHash) {
  const generatedAt = new Date().toISOString();
  return {
    generatedAt,
    commitHash,
    sourceScript: SOURCE_SCRIPT,
    exportScript: EXPORT_SCRIPT,
    results: results.map((result) => {
      const rawProfile = result.personaProfile || {};
      const profile = Object.fromEntries(
        Object.entries(rawProfile).map(([key, value]) => [key, translateExportText(value)])
      );
      const displayLabel = USER_LABELS[result.id] || result.label;
      const primaryFriendly = friendlyMechanismFromName(result.primaryMechanism, result.rankedPatterns);
      const secondaryFriendly = (result.secondaryMechanisms || [])
        .map((name) => friendlyMechanismFromName(name, result.rankedPatterns))
        .join(", ") || "Байхгүй";
      return {
        ...result,
        profile,
        displayUser: result.id.replace("user-", "User "),
        displayLabel,
        expectedRouteLabel: expectedRouteLabel(profile),
        actualRouteLabel: routeLabel(result.generatedMode),
        primaryFriendly,
        secondaryFriendly,
        safetyModeLabel: safetyModeLabel(result.generatedMode),
        selectedAnswerItems: selectedAnswersSummary(result),
        modeSuppressionNote: ["professional", "urgent"].includes(result.generatedMode)
          ? "Mode 3/4 шалгалт: ердийн жин хасалтын тайлан, төлбөрийн хэсэг, ердийн 14 хоногийн туршилт энэ тайланд гараагүй."
          : "Mode 1/2 шалгалт: ердийн тайлангийн агуулга гарсан бөгөөд гар аргаар уншиж шалгахад бэлэн."
      };
    })
  };
}

function main() {
  mkdirSync(OUT_RAW_DIR, { recursive: true });

  run("node", [SOURCE_SCRIPT, "--assert-clean"]);

  const rawFiles = readdirSync(SOURCE_RAW_DIR)
    .filter((file) => /^user-\d+\.json$/.test(file))
    .sort();
  if (rawFiles.length !== 10) {
    throw new Error(`Expected 10 raw user reports, found ${rawFiles.length}`);
  }

  const results = rawFiles.map((file) => {
    const source = path.join(SOURCE_RAW_DIR, file);
    const target = path.join(OUT_RAW_DIR, file);
    copyFileSync(source, target);
    return JSON.parse(readFileSync(source, "utf8"));
  });

  assertCleanReports(results);

  const commitHash = run("git", ["rev-parse", "HEAD"], { capture: true });
  const model = buildModel(results, commitHash);

  writeFileSync(TEMP_MODEL_PATH, JSON.stringify(model, null, 2));
  writeFileSync(TEMP_RENDERER_PATH, pythonRendererSource());
  writeFileSync(MD_PATH, makeMarkdown(model));
  writeFileSync(NOTES_PATH, makeNotes(model));

  if (!existsSync(PYTHON)) {
    throw new Error(`Python runtime not found: ${PYTHON}`);
  }
  run(PYTHON, [TEMP_RENDERER_PATH, TEMP_MODEL_PATH, PDF_PATH]);

  console.log(JSON.stringify({
    pdf: path.relative(ROOT, PDF_PATH),
    markdown: path.relative(ROOT, MD_PATH),
    notes: path.relative(ROOT, NOTES_PATH),
    rawReports: rawFiles.length,
    bannedTermsFound: 0,
    mode34Reports: results.filter((result) => ["professional", "urgent"].includes(result.generatedMode)).map((result) => result.id)
  }, null, 2));
}

main();
