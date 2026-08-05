import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, "..");

const literalReplacements = [
  ["Илүүдэл жингээс салах тест үнэлгээ", "Жингээ Хас тест"],
  ["сэтгэлзүйн", "сэтгэл зүйн"],
  ["Сэтгэлзүйн", "Сэтгэл зүйн"],
  ["сэтгэлзүйч", "сэтгэл зүйч"],
  ["Сэтгэлзүйч", "Сэтгэл зүйч"],
  ["хоолзүйч", "хоол зүйч"],
  ["Хоолзүйч", "Хоол зүйч"],
  ["Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.", "Таны хариултаас онцлон нэрлэх нэмэлт давуу тал одоогоор ялгараагүй байна."],
  ["шинэ асуудал зохиохгүйгээр одоо ажиллаж буй нөхцөлөө ажиглана.", "одоо ажиллаж буй нөхцөлөө өөрчлөхгүйгээр ажиглана."],
  ["Дэмжигдээгүй хооллолтын асуудлыг засах шинэ дүрэм нэмэхгүй.", "Хооллолтод шинэ хориг, шаардлагагүй дүрэм нэмэхгүй."],
  ["Хоолны зай уртсах үед өлсөлт хэт хүчтэй болсны дараа анзаарагдаж, оройн сонголтыг яаруулдаг байна.", "Хоолны зай уртсах үед өлсөлт хэт хүчтэй болсны дараа анзаарагдаж, хоолны сонголтоо яаран хийхэд хүргэж болзошгүй."],
  ["Орой хэт өлсөхөд идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог.", "Хэт өлссөн үед идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог."],
  ["Стресс нэмэгдэхэд идэх хүсэл тань хүчтэй болж, сэтгэл хөдлөл өдөр тутмын сонголтоо тогтвортой барихад саад болсон байна.", "Стресс нэмэгдэхэд идэх хүсэл тань хүчтэй болдог гэж хариулжээ. Энэ нь өдөр тутмын сонголтоо тогтвортой барихад зарим үед хүндрэл учруулж болзошгүй."],
  ["Өлсөөгүй үед орчны хоолны дохио нөлөөлдөг бөгөөд орчин төлөвлөсөн сонголтоо барихад саад болсон байна.", "Өлсөөгүй үед орчны хоолны дохио нөлөөлдөг гэж хариулжээ. Энэ нь төлөвлөсөн сонголтоо барихад зарим үед хүндрэл учруулж болзошгүй."],
  ["Нойр дутуу эсвэл тасалдсан үед ядаргаа нэмэгдэж, өдөр тутмын төлөвлөгөөгөө дагахад хүндрэл гардаг байна.", "Нойр дутуу эсвэл тасалдсан үед ядаргаа нэмэгдэж, өдөр тутмын төлөвлөгөөгөө дагахад хүндрэл учирч болзошгүй."],
  ["орой хэт өлсөх эсэх", "хэт өлсөх эсэх"],
  ["оройн хэт өлсөлтийн байдал", "хэт өлсөх үеийн байдал"],
  ["Энэ асуумж дангаараа", "Энэ тест дангаараа"],
  ["Асуумжид хамрагдаагүй", "Тестэд хамрагдаагүй"],
  ["асуумжид хамрагдсан", "тестэд хамрагдсан"],
  ["Энэ асуумжаар юуг дүгнэж болохгүй вэ?", "Энэ тестээр юуг дүгнэж болохгүй вэ?"],
  ["Хамгаалах буюу давуу тал болж буй хариултууд", "Танд түшиг болох давуу талууд"],
  ["Дагалдах хэв маягууд", "Бусад нөлөөлж буй хэв маяг, нөхцөл"],
  ["Бүрэн тайлан нээх эрх серверээс баталгаажаагүй байна.", "Бүрэн тайланг үзэх эрх баталгаажаагүй байна. Төлбөрийн төлөвийг дахин шалгана уу."],
  ["Төлбөр баталгаажсан. Тест нээх эрхийг серверээс дахин шалгана уу.", "Төлбөр баталгаажсан. Нээх эрхийг дахин шалгана уу."],
  ["Та яг одоо өөртөө хор хүргэх эрсдэлтэй бол ганцаараа үлдэхгүй, итгэдэг хүнтэйгээ хамт байж, 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй хандана уу.", "Та яг одоо өөртөө хор хүргэж болзошгүй гэж мэдэрч байвал ганцаараа бүү үлдээрэй. Итгэдэг хүнтэйгээ хамт байж, 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой."],
  ["Өөртөө хор хүргэх бодол хааяа төрж байгаа тул тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн мэргэжилтэн эсвэл итгэдэг хүнтэйгээ өнөөдөр ярилцаарай.", "Өөртөө хор хүргэх бодол хааяа төрж байгаа бол өнөөдөр итгэдэг хүнтэйгээ ярилцаж, сэтгэцийн эрүүл мэндийн мэргэжилтэнтэй холбогдоорой."],
  ["Одоогийн будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт хандана уу.", "Ухаан санаа будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой."],
  ["Таны сонгосон нөхцөлд жин хасах тестээс өмнө эмчийн үнэлгээ илүү тохиромжтой.", "Таны сонгосон нөхцөлд жин хасах төлөвлөгөө эхлэхээс өмнө эмчийн үнэлгээ авах нь илүү тохиромжтой."],
  ["Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?", "Өмнөх оролдлогоосоо та юу ойлгож авсан бэ?"],
  ["Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?"]
];

const appStructuralReplacements = [
  [
    "function renderPayment() {\n  const payment = state.payment || { status: \"idle\" };\n  const statusCopy = payment.status === \"paid\" ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY[payment.status] || \"\";\n  const createBlocked = [\"creating\", \"create_error\", \"create_unknown\", \"reconciling\", \"create_failed_confirmed\"].includes(payment.status);\n  const prepaid = state.commercialFlowVersion === \"prepaid_v2\";",
    "function renderPayment() {\n  const payment = state.payment || { status: \"idle\" };\n  const prepaid = state.commercialFlowVersion === \"prepaid_v2\";\n  const statusCopy = payment.status === \"paid\"\n    ? (prepaid ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY.paidAfterAssessment)\n    : payment.status === \"pending\" && !prepaid\n      ? \"QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.\"\n      : PAYMENT_COPY[payment.status] || \"\";\n  const createBlocked = [\"creating\", \"create_error\", \"create_unknown\", \"reconciling\", \"create_failed_confirmed\"].includes(payment.status);"
  ],
  [
    "${[\"pending\", \"check_error\", \"paid_but_not_unlocked\"].includes(payment.status) ? `<button class=\"button\" type=\"button\" data-action=\"check-payment\">Төлбөр шалгах</button>` : payment.status === \"paid\" ? (prepaid ? `<p class=\"notice\">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>` : `<p class=\"notice\">Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.</p><a class=\"button\" href=\"/report\" data-route>Бүрэн тайлан харах</a>`) : !paymentReady || createBlocked || prepaid ? \"\" : `<button class=\"button\" type=\"button\" data-action=\"create-invoice\">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}",
    "${[\"pending\", \"check_error\", \"paid_but_not_unlocked\"].includes(payment.status) ? `<button class=\"button\" type=\"button\" data-action=\"check-payment\">Төлбөр шалгах</button>` : payment.status === \"paid\" ? (prepaid ? \"\" : `<a class=\"button\" href=\"/report\" data-route>Бүрэн тайлан харах</a>`) : !paymentReady || createBlocked || prepaid ? \"\" : `<button class=\"button\" type=\"button\" data-action=\"create-invoice\">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}"
  ],
  [
    "function renderQuestionInput(question, value) {",
    "function questionOptionLabel(question, option) {\n  const common = {\n    \"Хариулахгүй байхыг хүсэж байна\": \"Хариулахгүй\",\n    \"Тодорхой биш\": \"Тодорхойгүй\",\n    \"Будилах\": \"Ухаан санаа будилах\"\n  };\n  if (question.id === \"Q-HUNGER\") return ({\n    \"Амар\": \"Өлсөж эхлэх үедээ\",\n    \"Заримдаа анзаардаг\": \"Заримдаа оройтож\",\n    \"Хэт өлссөний дараа анзаардаг\": \"Ихэвчлэн хэт өлссөний дараа\"\n  })[option] || common[option] || option;\n  if (question.id === \"Q-SLEEP-DURATION\") return ({\n    \"4–6 цаг\": \"4 цагаас 6 цаг хүрэхгүй\"\n  })[option] || common[option] || option;\n  if (question.id === \"Q-SLEEP-QUALITY\") return ({\n    \"Сайн амардаг\": \"Сайн\",\n    \"Заримдаа тасалддаг\": \"Дунд зэрэг\",\n    \"Олон сэрдэг\": \"Тааруу\",\n    \"Өглөө ядарсан хэвээр байдаг\": \"Маш тааруу\"\n  })[option] || common[option] || option;\n  if (question.id === \"Q-METHOD-REGAIN\") return ({\n    \"Үгүй\": \"Нэмэгдээгүй\",\n    \"Хэсэгчлэн нэмэгдсэн\": \"Бага зэрэг нэмэгдсэн\",\n    \"Ихэнх нь эргэн нэмэгдсэн\": \"Нэлээд нэмэгдсэн\"\n  })[option] || common[option] || option;\n  return common[option] || option;\n}\nfunction renderQuestionInput(question, value) {"
  ],
  [
    "<span>${escapeHtml(option)}</span>",
    "<span>${escapeHtml(questionOptionLabel(question, option))}</span>"
  ],
  [
    "Хоолноос өмнө өлсөх мэдрэмжээ анзаарах нь танд хэр амар байдаг вэ?",
    "Та өлсөх мэдрэмжээ ихэвчлэн хэзээ анзаардаг вэ?"
  ],
  [
    "Та одоогоор жирэмсэн, төрсний дараах эсвэл хөхүүл үед байна уу?",
    "Танд одоогоор дараах нөхцөлөөс аль нь хамгийн тохирох вэ?"
  ],
  [
    "{ id: \"context\", heading: \"ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?\"",
    "{ id: \"context\", heading: full.neutralResult ? \"ЮУГ АЖИГЛАХ ВЭ?\" : \"ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?\""
  ],
  [
    "{ id: \"management\", heading: \"ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?\"",
    "{ id: \"management\", heading: full.neutralResult ? \"ОДОО ТОХИРЧ БУЙ ХЭМНЭЛЭЭ ХЭРХЭН ХАДГАЛАХ ВЭ?\" : \"ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?\""
  ],
  [
    "{ id: \"difficult-moment\", heading: \"Хэцүү үеийг хэрхэн даван туулах вэ?\"",
    "{ id: \"difficult-moment\", heading: full.neutralResult ? \"ХЭМНЭЛ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?\" : \"Хэцүү үеийг хэрхэн даван туулах вэ?\""
  ]
];

const reportStructuralReplacements = [
  [
    "evidenceLink: \"Доорх зөвлөмжийг энэ хэв маягийг дэмжсэн, дээр тайлбарласан хариултын нөхцөлтэй холбож хэрэглэнэ.\",",
    "evidenceLink: \"Доорх зөвлөмжийг дээр тайлбарласан хариултуудтайгаа уялдуулан хэрэглээрэй.\","
  ],
  [
    "triggerRecognition: `${observe} ${pattern.title} эхлэхийн өмнө байсан газар, цаг, мэдрэмж эсвэл үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй.`,",
    "triggerRecognition: `${observe} Үүний өмнө байсан газар, цаг, мэдрэмж эсвэл үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй.`,"
  ],
  [
    "why: `${primary.title}-ийн нөхцөлийг эхэлж ажиглаад, дараа нь ${secondary.title}-тай давхцаж байгаа эсэхийг шалгавал бүх зүйлийг зэрэг өөрчлөхгүйгээр аль нөлөөнд түрүүлж анхаарахаа ялгаж болно.`,",
    "why: \"Эхлээд эхний хэв маяг ямар үед илэрч байгааг ажиглаарай. Дараа нь хоёр дахь хэв маяг мөн тэр үед давхцаж байгаа эсэхийг шалгаарай. Ингэснээр бүх зүйлийг зэрэг өөрчлөхгүйгээр аль нөлөөнд түрүүлж анхаарахаа ялгаж болно.\","
  ],
  [
    "evidenceLink: `${evidenceAnchor}; шинэ асуудал зохиохгүйгээр одоо ажиллаж буй нөхцөлөө ажиглана.`,\n      observe: `${evidenceAnchor}; ${String(observation.action).replace(/[.!?]$/, \"\").toLowerCase()}, дараа нь ямар нөхцөл дэмжсэн эсвэл саад болсныг нэг өгүүлбэрээр тэмдэглээрэй.`,\n      triggerRecognition: `${evidenceAnchor}; ${observation.variable} дээр ажиглалт хийх мөчийн өмнө байсан газар, цаг болон үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй.`,\n      prepare: `${evidenceAnchor}; ажиглах зүйлээ урьдчилан сонго: ${observation.variable}.`,\n      inMoment: `${evidenceAnchor}; сонгосон мөч ирэхэд шинэ хориг нэмэхгүйгээр дараах ажиглалтаа хий: ${observation.action}`,",
    "evidenceLink: `${evidenceAnchor}.`,\n      observe: `${String(observation.action).replace(/[.!?]$/, \"\")}. Дараа нь ямар нөхцөл дэмжсэн эсвэл саад болсныг нэг өгүүлбэрээр тэмдэглээрэй.`,\n      triggerRecognition: `${observation.variable} дээр ажиглалт хийх мөчийн өмнө байсан газар, цаг болон үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй.`,\n      prepare: `Ажиглах зүйлээ урьдчилан сонгоорой: ${observation.variable}.`,\n      inMoment: `Сонгосон мөч ирэхэд шинэ хориг нэмэхгүйгээр дараах ажиглалтаа хийгээрэй: ${observation.action}`,"
  ],
  [
    "resume: `${evidenceAnchor}; тэмдэглэж чадаагүй мөчийг нөхөх шаардлагагүй, дараагийн сонгосон мөчид ажиглалтаа үргэлжлүүлээд дараах дүрмээр шийд: ${observation.decisionRule}`",
    "resume: `Тэмдэглэж чадаагүй мөчийг нөхөх шаардлагагүй. Дараагийн сонгосон мөчид ажиглалтаа үргэлжлүүлээд дараах дүрмээр шийдээрэй: ${observation.decisionRule}`"
  ],
  [
    "{ order: 2, patternTitle: \"Одоо ажиллаж буй хэмнэл\", action: \"Сонгосон мөчид нэг ажиглалт хийж, нөлөөлсөн нөхцөлийг тэмдэглэ.\" },",
    "{ order: 2, patternTitle: \"Одоо ажиллаж буй хэмнэл\", action: \"Сонгосон мөчид нэг ажиглалт хийж, нөлөөлсөн нөхцөлийг тэмдэглээрэй.\" },"
  ],
  [
    "{ order: 3, patternTitle: \"Дараагийн шийдвэр\", action: \"Тэмдэглэлээ эргэн хараад одоогийн хэмнэлээ хадгалах эсэхээ нэг удаа шийд.\" }",
    "{ order: 3, patternTitle: \"Дараагийн шийдвэр\", action: \"Тэмдэглэлээ эргэн хараад одоогийн хэмнэлээ хадгалах эсэхээ нэг удаа шийдээрэй.\" }"
  ],
  [
    "resume: \"Алгассан ажиглалтыг нөхөхгүйгээр дараагийн сонгосон мөчөөс үргэлжлүүл.\",",
    "resume: \"Алгассан ажиглалтыг нөхөхгүйгээр дараагийн сонгосон мөчөөс үргэлжлүүлээрэй.\","
  ],
  [
    "softenRule: \"Шинэ хориг эсвэл шаардлагагүй засах дүрэм нэмэхгүй бай.\",",
    "softenRule: \"Шинэ хориг эсвэл шаардлагагүй засах дүрэм нэмэхгүй байгаарай.\","
  ],
  [
    "recheckTrigger: \"Ажиглалтад ямар бодит нөхцөл саад болсныг нэг өгүүлбэрээр тэмдэглэ.\",",
    "recheckTrigger: \"Ажиглалтад ямар бодит нөхцөл саад болсныг нэг өгүүлбэрээр тэмдэглээрэй.\","
  ],
  [
    "function publicReport(fullReport) {",
    "function polishPublicText(value) {\n  let text = String(value);\n  const exact = new Map([\n    [\"хэв маяг-ийн\", \"хэв маягийн\"],\n    [\"хэв маяг-тай\", \"хэв маягтай\"],\n    [\"нөхцөл-ийн\", \"нөхцөлийн\"],\n    [\"нөхцөл-тай\", \"нөхцөлтэй\"],\n    [\"Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.\", \"Таны хариултаас онцлон нэрлэх нэмэлт давуу тал одоогоор ялгараагүй байна.\"],\n    [\"Дэмжигдээгүй хооллолтын асуудлыг засах шинэ дүрэм нэмэхгүй.\", \"Хооллолтод шинэ хориг, шаардлагагүй дүрэм нэмэхгүй.\"]\n  ]);\n  for (const [from, to] of exact) text = text.split(from).join(to);\n  const polite = [\n    [/тэмдэглэ\\./g, \"тэмдэглээрэй.\"],\n    [/сонго\\./g, \"сонгоорой.\"],\n    [/бэлд\\./g, \"бэлдээрэй.\"],\n    [/үргэлжлүүл\\./g, \"үргэлжлүүлээрэй.\"],\n    [/шалга\\./g, \"шалгаарай.\"],\n    [/бич\\./g, \"бичээрэй.\"],\n    [/соль\\./g, \"солиорой.\"],\n    [/нэрлэ\\./g, \"нэрлээрэй.\"],\n    [/тогтоо\\./g, \"тогтоогоорой.\"],\n    [/хий\\./g, \"хийгээрэй.\"],\n    [/шаардахгүй бай\\./g, \"шаардахгүй байгаарай.\"],\n    [/нэмэхгүй бай\\./g, \"нэмэхгүй байгаарай.\"],\n    [/хязгаарлахгүй бай\\./g, \"хязгаарлахгүй байгаарай.\"],\n    [/нөхөхгүй бай\\./g, \"нөхөхгүй байгаарай.\"],\n    [/хэрэглэхгүй бай\\./g, \"хэрэглэхгүй байгаарай.\"],\n    [/өөрчлөхгүй бай\\./g, \"өөрчлөхгүй байгаарай.\"]\n  ];\n  for (const [pattern, replacement] of polite) text = text.replace(pattern, replacement);\n  return text;\n}\n\nfunction publicReport(fullReport) {"
  ],
  [
    "if (!value || typeof value !== \"object\") return value;",
    "if (!value || typeof value !== \"object\") return typeof value === \"string\" ? polishPublicText(value) : value;"
  ]
];

function listJavaScriptFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...listJavaScriptFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith(".js")) output.push(absolute);
  }
  return output;
}

function patchFile(file, replacements) {
  if (!fs.existsSync(file)) return { changed: false, replacements: 0 };
  let source = fs.readFileSync(file, "utf8");
  const before = source;
  let count = 0;
  for (const [from, to] of replacements) {
    if (!source.includes(from)) continue;
    source = source.split(from).join(to);
    count += 1;
  }
  if (source !== before) fs.writeFileSync(file, source);
  return { changed: source !== before, replacements: count };
}

export function applyMongolianCopyHotfix(root = defaultRoot) {
  const appFiles = [path.join(root, "app.js"), path.join(root, "site", "app.js")];
  const questionFiles = [path.join(root, "questions.js"), path.join(root, "site", "questions.js")];
  const functionFiles = listJavaScriptFiles(path.join(root, "netlify", "functions"));
  const allFiles = [...new Set([...appFiles, ...questionFiles, ...functionFiles])].filter(file => fs.existsSync(file));
  let changedFiles = 0;
  let appliedReplacements = 0;

  for (const file of allFiles) {
    const base = patchFile(file, literalReplacements);
    if (base.changed) changedFiles += 1;
    appliedReplacements += base.replacements;
  }
  for (const file of appFiles) {
    const result = patchFile(file, appStructuralReplacements);
    if (result.changed) changedFiles += 1;
    appliedReplacements += result.replacements;
  }
  for (const file of functionFiles.filter(file => file.endsWith(`${path.sep}_lib${path.sep}report.js`))) {
    const result = patchFile(file, reportStructuralReplacements);
    if (result.changed) changedFiles += 1;
    appliedReplacements += result.replacements;
  }

  const blocked = [
    "хэв маяг-ийн", "хэв маяг-тай", "нөхцөл-ийн нөхцөлийг",
    "Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.",
    "шинэ асуудал зохиохгүйгээр", "Дэмжигдээгүй хооллолтын асуудлыг",
    "тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн"
  ];
  const violations = [];
  for (const file of allFiles) {
    const source = fs.readFileSync(file, "utf8");
    for (const phrase of blocked) if (source.includes(phrase)) violations.push(`${path.relative(root, file)}: ${phrase}`);
  }
  if (violations.length) throw new Error(`Mongolian copy hotfix incomplete:\n${violations.join("\n")}`);
  console.log(`Mongolian copy hotfix applied (${changedFiles} files changed; ${appliedReplacements} replacement groups matched).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  applyMongolianCopyHotfix(defaultRoot);
}
