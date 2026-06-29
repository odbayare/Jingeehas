const STORAGE_KEY = "weightLossDeepPatternMvp";
const mockBackend = typeof require === "function"
  ? require("./mockBackend.js")
  : window.MockBackend;
const PRICING = {
  oneTime: "29,000₮",
  oneTimeAnchor: "29,000₮",
  coachOneTime: "9,900₮",
  sevenDay: "29,000₮",
  sevenDayAnchor: "69,000₮",
  upgrade: "19,900₮"
};
const STANDARD_WEIGHT_PRICE_MNT = 29000;
const COACH_WEIGHT_PRICE_MNT = 9900;
const COACH_COMMISSION_MNT = 4000;
const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";
const WEIGHT_TEST_AMOUNT_MNT = 9900;
const WEIGHT_TEST_QPAY_ENDPOINTS = {
  create: "/.netlify/functions/qpay-create-invoice",
  check: "/.netlify/functions/qpay-check-payment"
};

const INTERNAL_FEEDBACK_DEFAULTS = {
  discomfort: "Үгүй",
  discomfortDetail: "",
  questionClarity: "Ерөнхийдөө ойлгомжтой",
  unclearQuestions: "",
  fitRating: "8",
  feltUnderstood: "Зарим хэсэг дээр",
  feltUnderstoodReason: "",
  newInsight: "Бага зэрэг",
  newInsightDetail: "",
  aiGenericFeeling: "Үгүй",
  aiGenericDetail: "",
  languageTone: "Байгалийн монгол хэлтэй",
  languageToneSuggestion: "",
  valueAt9900: "Магадгүй",
  valueReason: "",
  mostUsefulPart: "",
  mostNeedsFix: ""
};

const VALIDATION_PRODUCTS = {
  "one-time": {
    productType: "one_time",
    label: "Нэг удаагийн гүн анализ",
    priceLabel: PRICING.oneTime,
    priceMnt: STANDARD_WEIGHT_PRICE_MNT
  },
  "seven-day": {
    productType: "seven_day",
    label: "7 хоногийн гүн анализ",
    priceLabel: PRICING.sevenDay,
    priceMnt: 29000
  },
  upgrade: {
    productType: "upgrade",
    label: "7 хоногоор нарийвчлах эрх",
    priceLabel: PRICING.upgrade,
    priceMnt: 19900
  }
};

const WILLINGNESS_OPTIONS = [
  "Тийм, энэ үнээр авахад бэлэн",
  "Сонирхож байна, гэхдээ эхлээд тайлангийн жишээ хармаар байна",
  "Үнэ өндөр санагдаж байна",
  "Одоогоор эргэлзэж байна"
];

const publicMechanismCopy = {
  reward: { name: "Таатай мэдрэмж авах хэрэгцээ", short: "Таатай мэдрэмж" },
  regulation: { name: "Сэтгэл санааг хоолоор түр намдаах давтамж", short: "Сэтгэл намдаах" },
  hungerSafety: { name: "Дараа өлсөхөөс хамгаалах давтамж", short: "Өлсөлтөөс хамгаалах" },
  glucose: { name: "Биеийн дохиог хамгаалах хэрэгцээ", short: "Биеийн дохио" },
  satiety: { name: "Цадах дохио бүдгэрэх үе", short: "Цадах дохио" },
  cue: { name: "Орчны дохионоос эхэлдэг идэх хүсэл", short: "Орчны дохио" },
  collapse: { name: "Нэг алдаанаас бүхэл өдөр нурдаг давтамж", short: "Нурах давтамж" },
  executive: { name: "Оройн шийдвэрийн ачаалал", short: "Шийдвэрийн ачаалал" },
  circadian: { name: "Нойр ба тэнхээний зөрүү", short: "Нойр/тэнхээ" },
  social: { name: "Хүмүүсийн дунд амар сонголт руу орох үе", short: "Хамт олны нөхцөл" },
  medical: { name: "Биеийн нөхцлөөс үүсэх саад", short: "Биеийн саад" },
  autonomy: { name: "Хэт хатуу дүрэмд дургүйцэх хариу", short: "Өөрийн сонголт" },
  physiological: { name: "Өлсөлтөд бие хүчтэй хариулах үе", short: "Биеийн хариу" },
  decisionDefault: { name: "Бэлэн сонголт хамгийн амар болох үе", short: "Бэлэн сонголт" },
  rewardDeficit: { name: "Өдөржин таатай зүйл дутсан үе", short: "Таатай зүйл дутсан" },
  roleOverload: { name: "Өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх идэлт", short: "Өөрийгөө хойш тавих" },
  shameAvoidance: { name: "Ичгүүрээс зайлсхийх давтамж", short: "Ичгүүрээс зайлсхийх" },
  bodySafety: { name: "Биеэ харах дарамтаас аюулгүй зай авах хэрэгцээ", short: "Биеийн аюулгүй зай" },
  identity: { name: "Өөрийн дүр төрхтэй холбоотой зөрчил", short: "Дүр төрхийн зөрчил" },
  identityConflict: { name: "Өөрийн дүр төрхтэй холбоотой зөрчил", short: "Дүр төрхийн зөрчил" },
  perfectionism: { name: "Төгс хийх гэж хэт чангардаг хэв маяг", short: "Хэт чанга эхлэх" }
};

const mechanisms = {
  reward: {
    name: "Reward-Seeking / Stimulation Compensation",
    short: "Reward-Seeking",
    observation: "Өлсөөгүй үед 'нэг гоё юм' хүсэл хэзээ давтагдаж байгааг ажиглана.",
    hiddenFunction: "reward",
    avoid: "Өдөр бүр бүх амттай зүйлээ хориглох",
    lever: "planned_evening_reward",
    experiment: "Оройн reward хэрэгцээг урьдчилж төлөвлөсөн жижиг сонголт, амралтын зан үйлтэй холбох."
  },
  regulation: {
    name: "Food-as-Regulation System",
    short: "Food-as-Regulation",
    observation: "Стресс, мэдрэмж, тайвшрах хэрэгцээ идэлттэй яаж холбогдож байгааг ажиглана.",
    hiddenFunction: "regulation",
    avoid: "Стресс өндөр үед зөвхөн сахилга батаар барих",
    lever: "pre_eating_regulation_pause",
    experiment: "Идэхээс өмнө 3 минутын тайвшруулах pause, дараа нь сонголтоо хийх."
  },
  hungerSafety: {
    name: "Hunger-Safety / Scarcity Protection",
    short: "Hunger-Safety",
    observation: "Хоол холдох, дараа өлсөхөөс санаа зовох, оройн нөхөж идэх давтамж байгаа эсэхийг ажиглана.",
    hiddenFunction: "safety",
    avoid: "Мацаг, хоол алгасах, өдөр хэт бага идэх",
    lever: "anchor_meals",
    experiment: "Өдөрт 2 тогтмол anchor meal болон нэг planned bridge snack турших."
  },
  glucose: {
    name: "Glucose-Safety / Hypoglycemia Risk Pattern",
    short: "Glucose-Safety",
    observation: "Хоол холдоход гардаг биеийн дохио болон хэмжсэн сахар/даралтын мэдээллийг тэмдэглэнэ.",
    hiddenFunction: "body safety",
    avoid: "Мацаг, хоол алгасах, хүчтэй restriction",
    lever: "professional_check_plus_regular_meals",
    experiment: "Хоолны зайг хэт уртасгахгүй, шинж давтагдвал мэргэжлийн хүнтэй ярилцах тэмдэглэл бэлдэх."
  },
  satiety: {
    name: "Satiety Signal Disconnect",
    short: "Satiety Disconnect",
    observation: "Цадсан мэдрэмж мэдэгдэхгүй эсвэл цадсан ч үргэлжлэх мөчүүдийг ажиглана.",
    hiddenFunction: "дохиог тодруулах",
    avoid: "Хурдан идээд дараа нь өөрийгөө буруутгах",
    lever: "mid_meal_check",
    experiment: "Хоолны дунд 30 секунд зогсоод өлсөлт, цадалт, үргэлжлүүлэх шалтгаанаа нэрлэх."
  },
  cue: {
    name: "Cue-Conditioned Automatic Eating",
    short: "Cue-Conditioned Eating",
    observation: "Delivery, snack харагдах, үнэр, social cue идэлт эхлүүлж байгаа эсэхийг ажиглана.",
    hiddenFunction: "cue response",
    avoid: "Cue дүүрэн орчинд зөвхөн willpower шаардах",
    lever: "cue_redesign",
    experiment: "Нэг cue-г багасгаж, нэг default сонголтыг харагдах газар бэлдэх."
  },
  collapse: {
    name: "Control-Collapse Cycle",
    short: "Control-Collapse",
    observation: "Plan бага зэрэг алдагдахад 'одоо дууссан' мэдрэмж гарч байгаа эсэхийг ажиглана.",
    hiddenFunction: "control relief",
    avoid: "Маргаашаас илүү чанга барина гэсэн cycle",
    lever: "next_meal_reset",
    experiment: "Алдаа гарсан өдөр дараагийн хоолыг punishment биш reset болгох."
  },
  executive: {
    name: "Executive Load Failure",
    short: "Executive Load",
    observation: "Ядарсан, завгүй, decision fatigue үед хамгийн амар default сонголт ялж байгаа эсэхийг ажиглана.",
    hiddenFunction: "low-friction default",
    avoid: "Өдөр бүр шинэ шийдвэр шаардах plan",
    lever: "low_friction_defaults",
    experiment: "3 ширхэг бага friction-тэй default хоол/захиалгын сонголт урьдчилж тогтоох."
  },
  circadian: {
    name: "Circadian-Energy Mismatch",
    short: "Circadian-Energy",
    observation: "Нойр, оройн эрч хүчний уналт, амттай зүйл идэх хүсэл хоорондын холбоог ажиглана.",
    hiddenFunction: "эрч хүч нөхөх",
    avoid: "Нойр муу үед өндөр intensity challenge",
    lever: "evening_energy_plan",
    experiment: "Нойр муу өдрийн оройн хоол, амралтын богино plan урьдчилж сонгох."
  },
  social: {
    name: "Social Belonging Food Pattern",
    short: "Social Belonging",
    observation: "Хүмүүсийн дунд татгалзах эвгүй эсвэл social event идэлтэд нөлөөлж байгаа эсэхийг ажиглана.",
    hiddenFunction: "belonging",
    avoid: "Social нөхцөлд бүрэн хориг тавих",
    lever: "social_choice_script",
    experiment: "Social үед хэрэглэх нэг богино татгалзах/сонгох өгүүлбэр бэлдэх."
  },
  medical: {
    name: "Medical / Medication / Physiological Friction",
    short: "Medical Friction",
    observation: "Эм, төрсний дараах үе, огцом хавагнах, даралт, fatigue зэрэг дохиог ялгаж тэмдэглэнэ.",
    hiddenFunction: "physiological friction",
    avoid: "Шинж тэмдэгтэй үед aggressive weight-loss plan эхлэх",
    lever: "professional_discussion_summary",
    experiment: "Шинж, цаг хугацаа, эмийн өөрчлөлт, хэмжилтээ нэг хуудсанд цуглуулах."
  },
  rewardDeficit: {
    name: "Reward Deficit Compensation",
    short: "Reward Deficit",
    observation: "Амралт, өөрийн цаг, өдөр тутмын pleasure дутмаг үед хоол гол reward болж байгаа эсэхийг ажиглана.",
    hiddenFunction: "daily pleasure",
    avoid: "Өдрийн reward-г огт төлөвлөхгүй байх",
    lever: "planned_rest_reward",
    experiment: "Өдөр бүр хоолноос гадуур 10 минутын planned rest/reward slot турших."
  },
  physiological: {
    name: "Hunger-Triggered Physiological Reactivity",
    short: "Physiological Reactivity",
    observation: "Өлсөх үед зүрх дэлсэх, толгой өвдөх, цочромтгой болох, даралт өссөн мэт дохио давтагдаж байгаа эсэхийг ажиглана.",
    hiddenFunction: "physiological relief",
    avoid: "Хоолны зайг огцом уртасгах",
    lever: "body_signal_rhythm",
    experiment: "Хоолны зай, биеийн дохио, хөнгөрөх хугацааг 14 хоног neutral тэмдэглэх."
  },
  decisionDefault: {
    name: "Decision-Default Mismatch",
    short: "Decision Default",
    observation: "Хүссэн сонголт бэлэн биш, харин delivery/snack/default хамгийн амар байгаа эсэхийг ажиглана.",
    hiddenFunction: "available default",
    avoid: "Орчны default-ийг өөрчлөхгүйгээр willpower шаардах",
    lever: "default_environment_redesign",
    experiment: "Undesired default-ийг нэг алхам холдуулж, desired default-ийг нэг алхам ойртуулах."
  },
  perfectionism: {
    name: "Perfectionism / All-or-Nothing Pattern",
    short: "Perfectionism",
    observation: "70% амжилт failure мэт санагдах, planned imperfection хэцүү байгаа эсэхийг ажиглана.",
    hiddenFunction: "control certainty",
    avoid: "Төгс perfect plan",
    lever: "good_enough_rule",
    experiment: "14 хоногт 70% биелэлт гэж юу болохыг урьдчилж тодорхойлох."
  },
  autonomy: {
    name: "Autonomy Rebellion Pattern",
    short: "Autonomy Rebellion",
    observation: "Хориг, хязгаарлалт нэмэгдэхэд эсэргүүцэл, амттай зүйл идэх хүсэл нэмэгдэж байгаа эсэхийг ажиглана.",
    hiddenFunction: "autonomy",
    avoid: "Бүх дуртай хоолоо бүрэн хорих",
    lever: "choice_preserving_structure",
    experiment: "Хориг биш, сонголт үлдээсэн 2 boundary турших."
  },
  shameAvoidance: {
    name: "Shame-Avoidance Loop",
    short: "Shame Avoidance",
    observation: "Guilt/shame, tracking-ээс зугтах, нуух behavior cycle-г үргэлжлүүлж байгаа эсэхийг ажиглана.",
    hiddenFunction: "avoidance",
    avoid: "Shame-based accountability",
    lever: "neutral_feedback",
    experiment: "Жинг биш, trigger-ийг body-neutral байдлаар тэмдэглэх."
  },
  roleOverload: {
    name: "Role Overload / Self-Neglect Pattern",
    short: "Role Overload",
    observation: "Бусдын хэрэгцээ түрүүнд тавигдаж өөрийн хоол/нойр/хөдөлгөөн хамгийн сүүлд үлдэж байгаа эсэхийг ажиглана.",
    hiddenFunction: "self-neglect relief",
    avoid: "Өөрийн хоолыг үлдэгдэл цагт найдах",
    lever: "self_first_anchor",
    experiment: "Өдөрт нэг self-first food/sleep anchor хамгаалах."
  },
  identity: {
    name: "Identity Conflict / Learned Failure Expectancy",
    short: "Identity Conflict",
    observation: "“Би угаасаа чаддаггүй” script эхлэхээс өмнө plan-г сулруулж байгаа эсэхийг ажиглана.",
    hiddenFunction: "learned protection",
    avoid: "Өөрийгөө дахин нотлох public challenge",
    lever: "identity_safe_evidence",
    experiment: "Өдөр бүр нэг small proof тэмдэглэх."
  },
  bodySafety: {
    name: "Body-Safety / Attention Avoidance",
    short: "Body Safety",
    observation: "Body visibility, before/after, хэмжилт, хүмүүс анзаарах нь distress өгч байгаа эсэхийг ажиглана.",
    hiddenFunction: "attention safety",
    avoid: "Public before/after challenge",
    lever: "body_neutral_tracking",
    experiment: "Body-neutral, private tracking турших."
  }
};

const MENSTRUAL_GATE_YES = "Тийм, хамаарна";
const MENSTRUAL_CONTEXT_MODULE = "Menstrual cycle";

const stageOneQuestions = [
  { id: "S1-C00", module: "Warm start", type: "info", text: "Энэ тест таныг шүүх гэж биш. Жин хасах гэж хичээх үед яг ямар өдөр, ямар мэдрэмж, ямар ядаргаа, ямар орчин давхцахад хоолны сонголт өөрчлөгддөгийг хамт харах гэж байгаа юм." },
  { id: "S1-C01", module: "Basic context", type: "number", text: "Таны нас хэд вэ?", safety: value => Number(value) < 18 ? ["professional"] : [] },
  { id: "S1-C02", module: "Basic context", type: "single", text: "Та хүйсээ яаж тэмдэглэх вэ?", options: ["Эмэгтэй", "Эрэгтэй", "Өөрөөр тодорхойлно", "Хариулахгүй"] },
  { id: "S1-C03", module: "Basic context", type: "number", text: "Таны өндөр ойролцоогоор хэд вэ? /см/" },
  { id: "S1-C04", module: "Basic context", type: "number", text: "Таны одоогийн жин ойролцоогоор хэд вэ? /кг/" },
  { id: "S1-C05", module: "Basic context", type: "number", text: "Та ойролцоогоор хэдэн кг болохыг хүсэж байна вэ? /кг/" },
  { id: "S1-C06", module: "Basic context", type: "multi", text: "Жин бууруулах хүсэл тань өдөр тутмын амьдралын юутай хамгийн их холбоотой вэ?", options: ["Эрүүл мэнддээ анхаарах", "Өдрийн тэнхээ нэмэх", "Хувцсандаа тухтай байх", "Өөртөө итгэлтэй болох", "Гадаад төрхөө өөрчлөх", "Даралт, сахар, шинжилгээнд санаа зовсон", "Хөдлөхөд амар болох", "Төрсний дараа биеэ сэргээх", "Өөр зүйл"] },
  { id: "S1-W01", module: "Weight trajectory", type: "single", text: "Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?", options: ["Их өөрчлөгдөөгүй", "1-3 кг нэмсэн", "4-7 кг нэмсэн", "8+ кг нэмсэн", "Буурсан", "Мэдэхгүй"], scores: { "8+ кг нэмсэн": ["medical"], "4-7 кг нэмсэн": ["medical"] } },
  { id: "S1-W02", module: "Weight trajectory", type: "multi", text: "Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?", options: ["Ажил ихсэж, стресс нэмэгдсэн", "Хөдөлгөөн багассан", "Нойр муудсан", "Эм хэрэглэж эхэлсэн", "Жирэмсэн эсвэл төрсний дараах үе", "Өвчин, мэс засалтай давхацсан", "Сэтгэл санааны хүнд үе байсан", "Тодорхой зүйл байхгүй", "Мэдэхгүй"], scores: { "Ажил ихсэж, стресс нэмэгдсэн": ["regulation", "executive"], "Ажил-стресс": ["regulation", "executive"], "Хөдөлгөөн багассан": ["executive"], "Нойр муудсан": ["circadian"], "Эм хэрэглэж эхэлсэн": ["medical"], "Эм": ["medical"], "Жирэмсэн эсвэл төрсний дараах үе": ["medical"], "Жирэмсэн-төрсний дараа": ["medical"], "Өвчин, мэс засалтай давхацсан": ["medical"], "Өвчин-мэс засал": ["medical"] } },
  { id: "S1-W03", module: "Past attempts", type: "single", text: "Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?", options: ["Үгүй", "Нэг удаа", "Хэд хэдэн удаа", "Бараг бүх оролдлогоос хойш", "Санахгүй"], scores: { "Хэд хэдэн удаа": ["collapse"], "Бараг бүх оролдлогоос хойш": ["collapse", "hungerSafety"] } },
  { id: "S1-W04", module: "Past attempts", type: "multi", text: "Өмнө нь турж үзсэн аргуудаас аль нь танд хамгийн танил вэ?", options: ["Мацаг", "Калори тоолох", "Нүүрс ус хасах", "Орой хоол идэхгүй", "Фитнесийн богино сорил", "Хор гадагшлуулах арга", "Хоол орлуулах бүтээгдэхүүн", "Эм, тариа, нэмэлт бүтээгдэхүүн", "Дасгалжуулагч эсвэл бүлгийн хөтөлбөр", "Ерөнхийдөө бага идэх", "Оролдож байгаагүй"], scores: { "Мацаг": ["hungerSafety", "glucose"], "Орой хоол идэхгүй": ["hungerSafety"], "Ерөнхийдөө бага идэх": ["hungerSafety"], "Фитнесийн богино сорил": ["collapse"], "Фитнес challenge": ["collapse"] } },
  { id: "S1-W05", module: "Past attempts", type: "text", text: "Өмнө туршсан аргуудаас аль нь эхэндээ болж байгаад дараа нь үргэлжлүүлэхэд хэцүү болсон бэ? Тэр үед юу өөрчлөгдсөн гэж санагддаг вэ?", voice: true },
  { id: "S1-W06", module: "Past attempts", type: "single", text: "Төлөвлөгөө жаахан зөрөхөд таны толгойд ихэвчлэн юу орж ирдэг вэ?", options: ["Дараагийн хоолноос хэвийн үргэлжлүүлье", "Өнөөдөр өнгөрлөө, маргаашаас", "Маргааш илүү чанга барина", "Би угаасаа чаддаггүй юм байна", "Одоо бүх юм дууссан", "Тодорхой бодолгүй"], scores: { "Өнөөдөр өнгөрлөө, маргаашаас": ["collapse"], "Өнөөдөр алдсан, маргаашаас": ["collapse"], "Маргааш илүү чанга барина": ["collapse"], "Маргааш илүү чанга": ["collapse"], "Одоо бүх юм дууссан": ["collapse"], "Би угаасаа чаддаггүй юм байна": ["collapse"], "Би угаасаа чаддаггүй": ["collapse"] } },
  { id: "S1-M01", module: "Meal rhythm", type: "single", text: "Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?", options: ["2-3 удаа тогтмол хооллодог", "Өглөөний хоол алгасдаг", "Өдрийн хоол алгасдаг", "Өдөр бага идээд орой нөхдөг", "Хоолны цаг өдөр бүр өөр", "Тодорхой хэмнэл байхгүй"], scores: { "Өглөөний хоол алгасдаг": ["hungerSafety", "circadian"], "Өглөө алгасах": ["hungerSafety", "circadian"], "Өдрийн хоол алгасдаг": ["hungerSafety", "executive"], "Өдрийн хоол алгасах": ["hungerSafety", "executive"], "Өдөр бага идээд орой нөхдөг": ["hungerSafety", "circadian"], "Өдөр бага идээд орой нөхөх": ["hungerSafety", "circadian"], "Хоолны цаг өдөр бүр өөр": ["executive"], "Хоолны цаг өөр": ["executive"] } },
  { id: "S1-M02", module: "Meal rhythm", type: "single", text: "Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?", options: ["Бараг үгүй", "7 хоногт 1-2", "3-4", "Бараг өдөр бүр", "Мэдэхгүй"], scores: { "3-4": ["hungerSafety"], "Бараг өдөр бүр": ["hungerSafety", "glucose"] } },
  { id: "S1-M03", module: "Meal rhythm", type: "single", text: "Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?", options: ["Бараг нөлөөлдөггүй", "Заримдаа нөлөөлдөг", "Нэлээд нөлөөлдөг", "Бараг дандаа тэгдэг", "Анзаарч байгаагүй"], scores: { "Нэлээд нөлөөлдөг": ["hungerSafety", "circadian"], "Их нэмэгддэг": ["hungerSafety", "circadian"], "Бараг дандаа тэгдэг": ["hungerSafety", "collapse"], "Хянахад хэцүү": ["hungerSafety", "collapse"] } },
  { id: "S1-H01", module: "Hunger & satiety", type: "single", text: "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?", options: ["Амархан мэдэрдэг", "Заримдаа мэдэрдэг", "Сайн ялгадаггүй", "Цадсан ч үргэлжлүүлдэг", "Хэт өлстлөө хүлээгээд хэтрүүлдэг"], scores: { "Сайн ялгадаггүй": ["satiety"], "Сайн мэддэггүй": ["satiety"], "Цадсан ч үргэлжлүүлдэг": ["satiety", "reward"], "Хэт өлстлөө хүлээгээд хэтрүүлдэг": ["hungerSafety", "glucose"] } },
  { id: "S1-H02", module: "Hunger & satiety", type: "single", text: "Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?", options: ["Ихэвчлэн тийм", "Заримдаа", "Ихэвчлэн үгүй", "Ялгаж мэддэггүй", "Нөхцлөөс шалтгаална"], scores: { "Ихэвчлэн тийм": ["hungerSafety"], "Ихэвчлэн үгүй": ["reward", "regulation", "cue"], "Ялгаж мэддэггүй": ["satiety"] } },
  { id: "S1-H03", module: "Hunger & satiety", type: "single", text: "Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?", options: ["Тийм, ихэнхдээ ялгадаг", "Заримдаа ялгадаг", "Сайн ялгадаггүй", "Бүгд л 'юм идмээр' гэж мэдрэгддэг", "Анзаарч байгаагүй"], scores: { "Сайн ялгадаггүй": ["satiety", "regulation"], "Бүгд л 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"], "Бүгд 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"] } },
  { id: "S1-F01", module: "Hidden function", type: "multi", text: "Төлөвлөөгүй идэхийн яг өмнө танд юу хамгийн ойр санагддаг вэ?", options: ["Өлссөндөө идсэн", "Амттай юм идмээр байсан", "Тайвширмаар байсан", "Өөрийгөө жаахан шагнамаар санагдсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар сонголт тэр байсан", "Бие эвгүйрхэх вий гэж санаа зовсон", "Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог", "Мэдэхгүй"], max: 3, scores: { "Өлссөндөө идсэн": ["hungerSafety"], "Биеэрээ өлссөн": ["hungerSafety"], "Амттай юм идмээр байсан": ["reward"], "Амттай юм хүссэн": ["reward"], "Тайвширмаар байсан": ["regulation"], "Тайвширмаар": ["regulation"], "Өөрийгөө жаахан шагнамаар санагдсан": ["reward"], "Өөрийгөө шагнамаар": ["reward"], "Уйдсан": ["reward"], "Ядарсан": ["executive", "circadian"], "Дараа өлсөхөөс санаа зовсон": ["hungerSafety"], "Харагдаад эсвэл үнэртээд идмээр болсон": ["cue"], "Хоол хараад идмээр болсон": ["cue"], "Татгалзах эвгүй байсан": ["social"], "Хүмүүсийн дунд татгалзах эвгүй": ["social"], "Хамгийн амар сонголт тэр байсан": ["executive"], "Хамгийн амар сонголт хэрэгтэй": ["executive"], "Бие эвгүйрхэх вий гэж санаа зовсон": ["glucose"], "Бие муудах-сахар унах вий": ["glucose"] } },
  { id: "S1-F02", module: "Hidden function", type: "single", text: "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайвширдаг", "Сэтгэл ханамж", "Түр гайгүй болоод гэмшдэг", "Шууд гэмшдэг", "Бие гайгүй", "Одоо бүх юм дууссан", "Маргааш чанга барина", "Өөрчлөлтгүй", "Мэдэхгүй"], scores: { "Тайвширдаг": ["regulation"], "Сэтгэл ханамж": ["reward"], "Түр гайгүй болоод гэмшдэг": ["regulation", "collapse"], "Шууд гэмшдэг": ["collapse"], "Одоо бүх юм дууссан": ["collapse"], "Маргааш чанга барина": ["collapse"], "Бие гайгүй": ["glucose"] } },
  { id: "S1-V01", module: "Voice checkpoint", type: "text", text: "Сүүлийн үед төлөвлөөгүй идсэн хамгийн тод нэг мөчөө богино тайлбарлаарай. Юуны дараа болсон бэ? Тэр үед өлсөж байсан уу? Ямар мэдрэмж давамгай байсан бэ? Идсэний дараа юу өөрчлөгдсөн бэ?", voice: true },
  { id: "S1-R01", module: "Reward / craving", type: "single", text: "Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?", options: ["Үгүй", "Хааяа", "Нэлээд олон удаа", "Бараг өдөр бүр", "Өдөрт олон удаа"], scores: { "Нэлээд олон удаа": ["reward"], "7 хоногт хэд хэд": ["reward"], "Бараг өдөр бүр": ["reward"], "Өдөрт олон удаа": ["reward"] } },
  { id: "S1-R02", module: "Reward / craving", type: "multi", text: "Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?", options: ["Уйдсан үед", "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед", "Ажлын дараа амармаар санагдах үед", "Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад", "Стресс ихтэй үед", "Ганцаардсан үед", "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд", "Мэдэхгүй"], scores: { "Уйдсан үед": ["reward"], "Уйдал": ["reward"], "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед": ["reward"], "Өдрийн төгсгөлд өөрийгөө шагнах": ["reward"], "Өдрийн төгсгөлд шагнах": ["reward"], "Ажлын дараа амармаар санагдах үед": ["reward", "regulation"], "Ажлын дараах амралт": ["reward", "regulation"], "Амт, үнэр, мэдрэмж татах үед": ["reward"], "Амт, мэдрэмж": ["reward"], "Амт-мэдрэмж": ["reward"], "Хоолны зураг эсвэл захиалгын апп харахад": ["reward", "cue"], "Хоолны зураг эсвэл delivery": ["reward", "cue"], "Food зураг-delivery": ["reward", "cue"], "Стресс ихтэй үед": ["regulation"], "Стресс": ["regulation"], "Stress": ["regulation"], "Ганцаардсан үед": ["regulation", "social"], "Ганцаардал": ["regulation", "social"] } },
  { id: "S1-R03", module: "Reward / craving", type: "single", text: "Заримдаа идэхээс өмнөх хүсэл нь идэж байх үеийн сэтгэл ханамжаас илүү хүчтэй байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward"], "Ихэвчлэн": ["reward"], "Бараг үргэлж": ["reward"] } },
  { id: "S1-E01", module: "Emotion / regulation", type: "single", text: "Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд давтагддаг", "Ихэвчлэн тэгдэг", "Заримдаа идэж чаддаггүй"], scores: { "Хааяа": ["regulation"], "Нэлээд давтагддаг": ["regulation"], "Ихэвчлэн тэгдэг": ["regulation"], "Заримдаа нэмэгддэг": ["regulation"], "Ихэвчлэн нэмэгддэг": ["regulation"], "Маш их нэмэгддэг": ["regulation"] } },
  { id: "S1-E02", module: "Emotion / regulation", type: "multi", text: "Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?", options: ["Стресс", "Уур", "Гуниг", "Ганцаардал", "Санаа зовнил", "Ядаргаа", "Хоосон мэт мэдрэмж", "Баяртай эсвэл өөрийгөө шагнамаар үе", "Мэдэхгүй"], scores: { "Стресс": ["regulation"], "Уур": ["regulation"], "Гуниг": ["regulation"], "Ганцаардал": ["regulation", "social"], "Санаа зовнил": ["regulation"], "Ядаргаа": ["executive", "circadian"], "Хоосон мэт мэдрэмж": ["reward"], "Хоосон/flat мэдрэмж": ["reward"], "Баяртай эсвэл өөрийгөө шагнамаар үе": ["reward"], "Баяртай/reward mode": ["reward"] } },
  { id: "S1-E03", module: "Emotion / regulation", type: "single", text: "Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?", options: ["Тайвширдаг", "Түр тайвширдаг", "Өөрчлөгдөхгүй", "Гэмшдэг", "Илүү их санаа зовдог"], scores: { "Тайвширдаг": ["regulation"], "Түр тайвширдаг": ["regulation"], "Гэмшдэг": ["collapse"], "Илүү их санаа зовдог": ["collapse"] } },
  { id: "S1-G01", module: "Hunger-safety", type: "single", text: "Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["hungerSafety"], "Ихэвчлэн": ["hungerSafety"], "Маш хүчтэй": ["hungerSafety"] } },
  { id: "S1-G02", module: "Hunger-safety", type: "single", text: "Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?", options: ["Үгүй", "Ховор", "Заримдаа", "Тийм", "Маш тод"], scores: { "Заримдаа": ["hungerSafety"], "Тийм": ["hungerSafety"], "Маш тод": ["hungerSafety"] } },
  { id: "S1-G03", module: "Hunger-safety", type: "single", text: "Хоол үлдээхэд танд хэр хэцүү байдаг вэ?", options: ["Хэцүү биш", "Заримдаа", "Нэлээд хэцүү", "Маш хэцүү", "Анзаарч байгаагүй"], scores: { "Нэлээд хэцүү": ["hungerSafety"], "Маш хэцүү": ["hungerSafety"] } },
  { id: "S1-X01", module: "Restriction response", type: "single", text: "Хоол багасгах, хориглох үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайван", "Өлсөхөөс санаа зовдог", "Уур/эсэргүүцэл", "Идэх юм бодогдоно", "Бие сулрах вий гэж айдаг", "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог"], scores: { "Өлсөхөөс санаа зовдог": ["hungerSafety"], "Уур/эсэргүүцэл": ["autonomy"], "Идэх юм бодогдоно": ["reward"], "Бие сулрах вий гэж айдаг": ["physiological"], "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог": ["collapse"], "Хэсэг сайн яваад дараа нь үргэлжлэхээ больдог": ["collapse"], "Хэсэг сайн яваад дараа нь нурдаг": ["collapse"] } },
  { id: "S1-X02", module: "Restriction response", type: "single", text: "Хориглосон хоол улам их бодогдох үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward", "collapse"], "Ихэвчлэн": ["reward", "collapse"], "Бараг үргэлж": ["reward", "collapse"] } },
  { id: "S1-X03", module: "Restriction response", type: "single", text: "Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд тэгдэг", "Ихэвчлэн тэгдэг", "Маш хүчтэй"], scores: { "Хааяа": ["collapse"], "Нэлээд тэгдэг": ["collapse"], "Заримдаа": ["collapse"], "Ихэвчлэн тэгдэг": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] } },
  { id: "S1-V02", module: "Voice checkpoint", type: "text", text: "Хоол хасах, мацаг барих, эсвэл “маргаашаас эхэлнэ” гэж бодох үед таны биед, сэтгэлд юу хамгийн түрүүнд мэдрэгддэг вэ?", voice: true },
  { id: "S1-L01", module: "Executive load", type: "single", text: "Юу хийхээ мэдэж байсан ч хийх тэнхээ үлдээгүй үе хэр олон байдаг вэ?", options: ["Бараг үгүй", "Заримдаа", "7 хоногт хэд хэд", "Бараг өдөр бүр", "Маш их"], scores: { "7 хоногт хэд хэд": ["executive"], "Бараг өдөр бүр": ["executive"], "Маш их": ["executive"] } },
  { id: "S1-L02", module: "Executive load", type: "multi", text: "Ядарсан үед хамгийн амархан олдох сонголт юу болдог вэ?", options: ["Урьдчилж бэлдсэн хоол", "Хоол захиалах", "Ойр байсан зууш", "Хоол алгасах", "Гэрт байсан амар сонголт", "Чихэртэй ундаа/кофе", "Мэдэхгүй"], scores: { "Хоол захиалах": ["executive", "cue"], "Delivery": ["executive", "cue"], "Ойр байсан зууш": ["executive", "cue"], "Ойр байсан snack": ["executive", "cue"], "Snack": ["executive", "cue"], "Хоол алгасах": ["executive", "hungerSafety"], "Гэрт байсан амар сонголт": ["executive"], "Чихэртэй ундаа/кофе": ["reward", "circadian"] } },
  { id: "S1-L03", module: "Executive load", type: "multi", text: "Хоол бэлдэхэд хамгийн их саад болдог зүйл юу вэ?", options: ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх", "Дэлгүүр/материал", "Бусдын хэрэгцээ", "Орчин", "Мэдэхгүй"], scores: { "Цаг": ["executive"], "Ядаргаа": ["executive"], "Юу хийхээ шийдэх": ["executive"], "Бусдын хэрэгцээ": ["executive", "social"] } },
  { id: "S1-L04", module: "Environment", type: "single", text: "Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?", options: ["Нөлөөлөхгүй", "Заримдаа иддэг", "Ихэвчлэн иддэг", "Харагдвал бараг автоматаар иддэг", "Зууш ил байлгадаггүй"], scores: { "Заримдаа иддэг": ["cue"], "Ихэвчлэн иддэг": ["cue"], "Харагдвал бараг автоматаар иддэг": ["cue"] } },
  { id: "S1-L05", module: "Environment", type: "single", text: "Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["cue", "reward"], "Ихэвчлэн": ["cue", "reward"], "Маш хүчтэй": ["cue", "reward"] } },
  { id: "S1-N01", module: "Sleep / energy", type: "single", text: "Сүүлийн үед дундаж нойр тань ямар байна вэ?", options: ["4 цагаас бага", "4-6 цаг", "6-8 цаг", "8+ цаг", "Чанар муу", "Тогтворгүй"], scores: { "4 цагаас бага": ["circadian", "medical"], "4-6 цаг": ["circadian"], "Чанар муу": ["circadian"], "Тогтворгүй": ["circadian"] } },
  { id: "S1-N02", module: "Sleep / energy", type: "single", text: "Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш тод"], scores: { "Заримдаа": ["circadian", "reward"], "Ихэвчлэн": ["circadian", "reward"], "Маш тод": ["circadian", "reward"] } },
  { id: "S1-N03", module: "Sleep / energy", type: "multi", text: "Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?", options: ["Хурхирдаг", "Өдөр нойрмоглодог", "Өглөө ядруу сэрдэг", "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан", "Аль нь ч үгүй", "Мэдэхгүй"], scores: { "Хурхирдаг": ["medical", "circadian"], "Өдөр нойрмоглодог": ["medical", "circadian"], "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан": ["medical"], "Амьсгал тасалдах мэт хэлж байсан": ["medical"] } },
  { id: "S1-B01", module: "Body / medical", type: "multi", text: "Хоол холдоход дараах шинжээс илэрдэг үү?", options: ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх", "Сахар унасан мэт", "Будилах/ухаан балартах", "Аль нь ч үгүй"], scores: { "Гар салгалах": ["physiological"], "Зүрх дэлсэх": ["physiological"], "Хөлрөх": ["physiological"], "Толгой эргэх": ["physiological"], "Толгой өвдөх": ["physiological"], "Сахар унасан мэт": ["glucose", "physiological"], "Будилах/ухаан балартах": ["glucose", "medical"] }, safety: values => values.includes("Будилах/ухаан балартах") ? ["urgent"] : [] },
  { id: "S1-B02", module: "Body / medical", type: "single", text: "Та сахар эсвэл даралтаа хэмжиж үзсэн үү?", options: ["Үгүй", "Тийм, хэвийн", "Тийм, бага сахар гарч байсан", "Тийм, өндөр даралт гарч байсан", "Тийм, санаа зовоосон"], scores: { "Тийм, бага сахар гарч байсан": ["glucose", "medical"], "Тийм, өндөр даралт гарч байсан": ["medical"], "Тийм, санаа зовоосон": ["medical"] }, safety: value => ["Тийм, бага сахар гарч байсан", "Тийм, санаа зовоосон"].includes(value) ? ["professional"] : [] },
  { id: "S1-B03", module: "Body / medical", type: "single", text: "Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?", options: ["Үгүй", "Тийм", "Мэдэхгүй"], scores: { "Тийм": ["glucose", "medical"] }, safety: value => value === "Тийм" ? ["professional"] : [] },
  { id: "S1-B04", module: "Body / medical", type: "multi", text: "Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?", options: ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг", "Маш их ядардаг", "Аль нь ч үгүй"], scores: { "Огцом жин нэмсэн": ["medical"], "Хавагнадаг": ["medical"], "Амьсгааддаг": ["medical"], "Маш их ядардаг": ["medical"] }, safety: values => values.some(v => ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг"].includes(v)) ? ["professional"] : [] },
  { id: "S1-B05", module: "Body / medical", type: "single", text: "Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?", options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0-6 сар", "Төрсний дараах 6-24 сар", "Хөхүүл", "Хариулахгүй"], scores: { "Жирэмсэн": ["medical"], "Төрсний дараах 0-6 сар": ["medical"], "Төрсний дараах 6-24 сар": ["medical"], "Хөхүүл": ["medical"] }, safety: value => ["Жирэмсэн", "Төрсний дараах 0-6 сар", "Хөхүүл"].includes(value) ? ["professional"] : [] },
  { id: "MC-GATE", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", intro: "Зарим хүний өлсөх мэдрэмж, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа сарын тэмдгийн мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Энэ нь оношлох гэсэн асуулт биш. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.", options: [MENSTRUAL_GATE_YES, "Үгүй, хамаарахгүй", "Хариулахгүй"] },
  { id: "MC-INTRO", module: MENSTRUAL_CONTEXT_MODULE, type: "info", text: "Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно." },
  { id: "MC-01", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?", options: ["Тогтмол, ойролцоогоор 21–35 хоног", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Мэдэхгүй", "Хариулахгүй"] },
  { id: "MC-02", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?", options: ["Өнөөдөр–5 хоногийн дотор", "6–13 хоногийн өмнө", "14–17 хоногийн өмнө", "18–28 хоногийн өмнө", "28 хоногоос дээш", "Сайн мэдэхгүй", "Хариулахгүй"] },
  { id: "MC-03", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?", options: ["Мөчлөгтэй холбоо анзаардаггүй", "Сарын тэмдэг ирэхээс хэд хоногийн өмнө", "Сарын тэмдэг ирж байх үед", "Сарын тэмдэг дууссаны дараах өдрүүдэд", "Овуляцийн орчим гэж боддог", "Тодорхой биш", "Хариулахгүй"] },
  { id: "MC-04", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?", options: ["Илүү өлсдөг", "Амттай юм, гурилан зүйл илүү хүсдэг", "Давслаг, шарсан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг", "Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг", "Онц ялгаа анзаардаггүй", "Хариулахгүй"], max: 3 },
  { id: "MC-05", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?", options: ["Өөрчлөгддөггүй", "Жаахан нэмэгддэг", "Нэлээд нэмэгддэг", "Ойр ойрхон идмээр болдог", "Өвдөлт, дотор муухайралтаас болоод багасдаг", "Тодорхой хэлж мэдэхгүй", "Хариулахгүй"] },
  { id: "MC-06", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Та одоогоор дараахаас аль нэгэнд хамаарах уу?", options: ["Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг", "PCOS оноштой эсвэл сэжигтэй", "Төрсний дараах эсвэл хөхүүл үе", "Перименопауз байж магадгүй", "Аль нь ч биш", "Хариулахгүй"], max: 2 },
  { id: "MC-07", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?", options: ["Тийм", "Үгүй", "Сайн мэдэхгүй", "Хариулахгүй"] },
  { id: "S1-S01", module: "Safety", type: "single", text: "Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },
  { id: "S1-S02", module: "Safety", type: "single", text: "Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },
  { id: "S1-S03", module: "Safety", type: "single", text: "Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?", options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], safety: value => ["Одоо хааяа", "Одоо давтагддаг"].includes(value) ? ["professional"] : [] },
  { id: "S1-S04", module: "Safety", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], safety: value => value === "Одоо идэвхтэй бодогдож байна" ? ["urgent"] : value === "Одоо хааяа бодогддог" ? ["professional"] : [] },
  { id: "S1-V03", module: "Voice checkpoint", type: "text", text: "Өмнө хэрэглэсэн ч хамгийн удаан үргэлжлээгүй аргаа бодоорой. Тэр арга яагаад эхэндээ ажилласан, дараа нь яагаад үргэлжлээгүй гэж та боддог вэ?", voice: true },
  { id: "S1-V04", module: "Voice checkpoint", type: "text", text: "'Би яг ___ байвал илүү тогтвортой явж чадна' гэж өгүүлбэрийг дуусгаад тайлбарлаарай.", voice: true }
];

const dailyCore = [
  { id: "D-C01", type: "single", text: "Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв?", field: "meal_rhythm", options: ["Тогтуун, хоол алгасаагүй", "Нэг хоол алгассан", "Хоол хоорондын зай хэтэрсэн", "Өдөр бага идээд орой нөхсөн", "Юу идснээ сайн санахгүй байна"] },
  { id: "D-C02", type: "single", text: "Өнөөдөр ‘ингэе гэж бодоогүй байсан ч’ идэж, уусан зүйл гарсан уу?", field: "unplanned_eating_count", options: ["Үгүй", "Тийм, нэг удаа", "Тийм, хоёр удаа", "Тийм, гурваас олон удаа"] },
  { id: "D-C03", type: "single", text: "Тэр үе ихэвчлэн хэзээ байсан бэ?", field: "main_moment_time", options: ["Өглөө", "Өдөр", "Орой", "Шөнө", "Хүмүүстэй хамт байх үед", "Өнөөдөр тийм зүйл гараагүй"] },
  { id: "D-C04", type: "scale", text: "Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн", field: "hunger_level" },
  { id: "D-C05", type: "multi", text: "Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ?", field: "food_function", options: ["Өлссөндөө", "Амттай юм идмээр байсан", "Тайвширмаар байсан", "Өөрийгөө жаахан шагнамаар байсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар нь тэр байсан", "Бие эвгүйрхэх вий гэж санаа зовсон", "Сарын тэмдэгтэй холбоотой мэт санагдсан"] },
  { id: "D-C06", type: "single", text: "Өнөөдөр сэтгэлд хамгийн их үлдсэн мэдрэмж аль нь байсан бэ?", field: "emotion", options: ["Тайван", "Стресс", "Ууртай", "Гунигтай", "Ганцаардсан", "Санаа зовсон", "Ядарсан", "Хоосон юм шиг", "Өөрийгөө баярлуулмаар санагдсан", "Сайн ялгахгүй байна"] },
  { id: "D-C07", type: "scale", text: "Өнөөдрийн стрессийг 0–10 дээр тавивал хэд орчим байсан бэ?", field: "stress_score" },
  { id: "D-C08", type: "scale", text: "Орой болоход тэнхээ хэр үлдсэн байсан бэ? 0 = огт үлдээгүй, 10 = хангалттай байсан", field: "energy_score" },
  { id: "D-C09", type: "multi", text: "Өчигдөр шөнө хэр унтсан бэ?", field: "sleep", options: ["4 цагаас бага", "4–6 цаг", "6–8 цаг", "8 цагаас дээш", "Олон сэрсэн, чанар муу", "Сайн амарсан"] },
  { id: "D-C10", type: "multi", text: "Өнөөдөр та юу юу уув?", field: "drinks", options: ["Хар кофе", "Сүүтэй кофе", "Сүүтэй цай", "Жүүс / хийжүүлсэн ундаа", "Сэргээх ундаа", "Алкоголь", "Ус голдуу", "Онцгой зүйл байгаагүй"] },
  { id: "D-C11", type: "multi", text: "Хоол холдох үед эсвэл орой биеэр ямар нэг шинж мэдрэгдсэн үү?", field: "body_signals", options: ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх", "Сахар унасан мэт санагдах", "Хавагнах", "Аль нь ч үгүй"] },
  { id: "D-C12", type: "single", text: "Өнөөдрийн хөдөлгөөн хэр байсан бэ?", field: "movement", options: ["Маш бага", "Бага зэрэг алхсан", "20+ минут хөдөлсөн", "Дасгал хийсэн", "Өвдөлт/ядаргаанаас болоод бараг хөдөлсөнгүй"] },
  { id: "D-C13", type: "text", text: "Өнөөдөр төлөвлөөгүй идэлт гараагүй бол ямар нөхцөл тусалсан бэ?", field: "what_helped" },
  { id: "D-V01", type: "text", text: "Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино тайлбарлаарай. Юуны дараа болсон бэ? Тэр үед өлсөж байсан уу? Ямар мэдрэмж давамгай байсан бэ? Идсэний дараа юу өөрчлөгдсөн бэ?", field: "raw_reflection" },
  { id: "D-SUM01", type: "single", text: "Тайлбар хадгалагдлаа", field: "summary_confirmation", options: ["Үргэлжлүүлэх", "Засах", "Нэмэх зүйл байна"] }
];

const dailyMenstrual = [
  { id: "D-MC-01", type: "single", text: "Өнөөдөр мөчлөгийнхөө аль үедээ байгаа гэж бодож байна?", field: "cycle_today_phase", options: ["Сарын тэмдэг ирж байна", "Дууссанаас хойш эхний өдрүүд", "Овуляцийн орчим гэж бодож байна", "Ирэхээс өмнөх өдрүүд", "Мэдэхгүй", "Хамаарахгүй"] },
  { id: "D-MC-02", type: "single", text: "Өнөөдрийн идэх хүсэл мөчлөгтэй холбоотой юм шиг санагдсан уу?", field: "cycle_today_link", options: ["Үгүй", "Бага зэрэг", "Тийм, илүү өлссөн", "Тийм, амттай юм илүү хүссэн", "Тийм, сэтгэл санаатай хамт хүчтэй болсон", "Тийм, ядаргаа/нойртой давхцсан"] },
  { id: "D-MC-03", type: "single", text: "Өнөөдөр өвдөлт, хавагналт, ядаргаа, нойр муудах зэрэг нь хоолны сонголтод нөлөөлсөн үү?", field: "cycle_body_effect", options: ["Үгүй", "Бага зэрэг", "Дунд зэрэг", "Их"] }
];

const probeBank = {
  reward: [
    { id: "D-P-R01", type: "single", text: "Өнөөдөр өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэсэн хүсэл төрсөн үү?", field: "reward_seeking", options: ["Үгүй", "Бага зэрэг", "Тодорхой", "Маш хүчтэй"] },
    { id: "D-P-R02", type: "single", text: "Өдөржин өөртөө нэг ч таатай зүйл өгөөгүй юм шиг санагдаад, орой хоолоор нөхмөөр үе байсан уу?", field: "reward_driver", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш тод"] }
  ],
  hungerSafety: [
    { id: "D-P-HS01", type: "single", text: "Өнөөдөр дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байсан уу?", field: "hunger_safety", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш хүчтэй"] },
    { id: "D-P-HS02", type: "single", text: "Хоолны цаг тодорхойгүй болох үед та илүү их идсэн үү?", field: "uncertain_meal_more", options: ["Үгүй", "Заримдаа", "Тийм"] }
  ],
  regulation: [
    { id: "D-P-FR01", type: "single", text: "Хоол идсэний дараа сэтгэл түр намдах шиг болсон уу?", field: "food_regulation", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш тод"] },
    { id: "D-P-FR02", type: "single", text: "Идсэний дараа таны мэдрэмж яаж өөрчлөгдсөн бэ?", field: "after_emotion", options: ["Тайвширсан", "Түр тайвширсан", "Өөрчлөгдөөгүй", "Гэмшсэн"] }
  ],
  executive: [
    { id: "D-P-EL01", type: "single", text: "Юу хийхээ мэдэж байсан ч хийх тэнхээ үлдээгүй үе байсан уу?", field: "executive_load", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш их"] },
    { id: "D-P-EL02", type: "single", text: "Тэр үед хамгийн амархан олдох сонголт л ялсан уу?", field: "tired_default", options: ["Урьдчилж бэлдсэн хоол", "Хоол захиалах", "Ойр байсан зууш", "Хоол алгассан", "Гэрт байсан амар сонголт"] }
  ],
  collapse: [
    { id: "D-P-CC01", type: "single", text: "Бага зэрэг хазайсны дараа ‘өнөөдөр өнгөрлөө’ гэж бодогдсон уу?", field: "control_collapse", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш хүчтэй"] },
    { id: "D-P-CC02", type: "single", text: "Дараа нь ‘маргааш илүү чанга барина’ гэж бодогдсон уу?", field: "tighten_tomorrow", options: ["Үгүй", "Тийм"] }
  ],
  glucose: [
    { id: "D-P-GP01", type: "multi", text: "Өнөөдөр хоол холдоход биеийн хүчтэй шинж гарсан уу?", field: "glucose_signals", options: ["Үгүй", "Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Будилах / ухаан балартах"] },
    { id: "D-P-GP02", type: "single", text: "Өнөөдөр сахар эсвэл даралт хэмжсэн үү?", field: "measured_today", options: ["Үгүй", "Тийм, хэвийн", "Тийм, бага/өндөр гарсан", "Тийм, санаа зовоосон"] }
  ],
  circadian: [
    { id: "D-P-CE01", type: "single", text: "Нойр дутуу эсвэл оройн тэнхээ багассан нь өнөөдрийн идэх хүсэлд нөлөөлсөн үү?", field: "circadian_pull", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш тод"] }
  ],
  cue: [
    { id: "D-P-CU01", type: "single", text: "Хоол харагдах, үнэртэх, эсвэл захиалгын апп харах үед идэх хүсэл нэмэгдсэн үү?", field: "cue_pull", options: ["Үгүй", "Бага зэрэг", "Тийм", "Маш тод"] }
  ]
};

const dimensionByModule = {
  "Warm start": [],
  "Basic context": ["D01"],
  "Weight trajectory": ["D01"],
  "Past attempts": ["D02", "D11"],
  "Meal rhythm": ["D03", "D15"],
  "Hunger & satiety": ["D04"],
  "Hidden function": ["D05", "D06", "D07", "D13"],
  "Voice checkpoint": ["D02", "D05", "D06", "D07", "D13", "D16"],
  "Reward / craving": ["D05"],
  "Emotion / regulation": ["D06", "D16"],
  "Hunger-safety": ["D07"],
  "Restriction response": ["D10", "D11"],
  "Executive load": ["D13"],
  "Environment": ["D14"],
  "Sleep / energy": ["D15"],
  "Body / medical": ["D08", "D09", "D22"],
  "Menstrual cycle": ["D04", "D05", "D06", "D08", "D09", "D15", "D22"],
  "Safety": ["D09", "D12", "D16"],
  "daily_core": ["D03", "D04", "D05", "D06", "D08", "D09", "D13", "D15", "D16", "D21"],
  "daily_probe": ["D05", "D06", "D07", "D08", "D09", "D11", "D13", "D14", "D15", "D17"]
};

const mechanismNamesByKey = {
  reward: "Reward-Seeking / Stimulation Compensation",
  regulation: "Food-as-Regulation System",
  rewardDeficit: "Reward Deficit Compensation",
  hungerSafety: "Hunger-Safety / Scarcity Protection",
  glucose: "Glucose-Safety / Hypoglycemia Risk Pattern",
  physiological: "Hunger-Triggered Physiological Reactivity",
  satiety: "Satiety Signal Disconnect",
  cue: "Cue-Conditioned Automatic Eating",
  collapse: "Control-Collapse Cycle",
  executive: "Executive Load Failure",
  decisionDefault: "Decision-Default Mismatch",
  circadian: "Circadian-Energy Mismatch",
  autonomy: "Autonomy Rebellion Pattern",
  shameAvoidance: "Shame-Avoidance Loop",
  perfectionism: "Perfectionism / All-or-Nothing Pattern",
  social: "Social Belonging Food Pattern",
  roleOverload: "Role Overload / Self-Neglect Pattern",
  identity: "Identity Conflict / Learned Failure Expectancy",
  bodySafety: "Body-Safety / Attention Avoidance",
  medical: "Medical / Medication / Physiological Friction"
};

function answerTypeFor(type) {
  return { number: "numeric", info: "copy", single: "single", multi: "multi", scale: "scale", text: "text" }[type] || type;
}

function stageForQuestion(question, source) {
  if (source === "daily") return "daily_diary";
  if (question.id?.startsWith("S1-")) return "shared";
  return "shared";
}

function normalizedModule(question, source) {
  return source === "daily" ? (question.id?.startsWith("D-P") ? "daily_probe" : "daily_core") : question.module;
}

function optionSignals(label) {
  const text = String(label || "").toLowerCase();
  const tags = [];
  const dimensions = [];
  const mechanisms = [];
  const reportUse = [];
  let safetyTrigger = null;

  const add = (tagList = [], dimensionList = [], mechanismList = [], reportList = []) => {
    tags.push(...tagList);
    dimensions.push(...dimensionList);
    mechanisms.push(...mechanismList);
    reportUse.push(...reportList);
  };

  if (/алгас|5\+|орой нөх|хоолны хооронд/.test(text)) add(["skipped_meal", "meal_gap_5h_plus"], ["D03", "D15"], [mechanismNamesByKey.hungerSafety, mechanismNamesByKey.circadian], ["trigger_map", "before_30", "cycle_map"]);
  if (/амттай|шагна|нэг гоё|reward|уйд/.test(text)) add(["reward_pull"], ["D05"], [mechanismNamesByKey.reward, mechanismNamesByKey.rewardDeficit], ["hidden_function", "not_the_real_problem", "first_leverage_point"]);
  if (/тайвш|стресс|stress|санаа зовнил|гуниг|уур|ганцаард/.test(text)) add(["food_as_regulation"], ["D06", "D16"], [mechanismNamesByKey.regulation], ["hidden_function", "cycle_map"]);
  if (/дараа өлс|өлсөхөөс|санаа зовсон/.test(text)) add(["hunger_safety"], ["D07"], [mechanismNamesByKey.hungerSafety], ["hidden_function", "what_to_avoid", "first_leverage_point"]);
  if (/хамгийн амар|delivery|захиал|default/.test(text)) add(["executive_load", "default_delivery"], ["D13", "D14"], [mechanismNamesByKey.executive, mechanismNamesByKey.decisionDefault], ["trigger_map", "cycle_map", "first_leverage_point"]);
  if (/харагд|үнэр|cue|food зураг|snack/.test(text)) add(["cue_trigger"], ["D14"], [mechanismNamesByKey.cue, mechanismNamesByKey.decisionDefault], ["trigger_map", "before_30"]);
  if (/хүмүүс|social|татгалзах эвгүй|гэр бүл|найз/.test(text)) add(["social_pressure"], ["D17"], [mechanismNamesByKey.social], ["hidden_function", "not_the_real_problem"]);
  if (/хориг|эсэргүүц|өөрөө сонго|rebellion|autonomy/.test(text)) add(["autonomy_rebellion"], ["D21"], [mechanismNamesByKey.autonomy], ["hidden_function", "what_to_avoid", "first_leverage_point"]);
  if (/одоо бүх юм дууссан|маргааш чанга|collapse|бүхэлдээ|100|төгс|failure/.test(text)) add(["control_collapse"], ["D11", "D02"], [mechanismNamesByKey.collapse, mechanismNamesByKey.perfectionism], ["why_previous_attempts_failed", "what_to_avoid"]);
  if (/гэмш|ич|нуух|shame|guilt/.test(text)) add(["shame_guilt"], ["D12"], [mechanismNamesByKey.shameAvoidance, mechanismNamesByKey.collapse], ["after_30", "what_to_avoid"]);
  if (/бусдын хэрэгцээ|хүүхэд|care|өөрийн цаг|миний цаг|өөрийгөө.*сүүлд|хамгийн сүүлд/.test(text)) add(["role_overload"], ["D18", "D13"], [mechanismNamesByKey.roleOverload, mechanismNamesByKey.rewardDeficit], ["hidden_function", "not_the_real_problem", "first_leverage_point"]);
  if (/угаасаа чаддаггүй|төсөөлдөггүй|public|before\/after|зайлсхий|анзаарах|visibility/.test(text)) add(["identity_conflict", "body_safety"], ["D19", "D20", "D12"], [mechanismNamesByKey.identity, mechanismNamesByKey.bodySafety], ["tone_modifier", "what_to_avoid"]);
  if (/гар салгалах|зүрх дэлсэх|хөлрөх|толгой эргэх|толгой өвдөх/.test(text)) add(["physiological_reactivity"], ["D09", "D22"], [mechanismNamesByKey.physiological], ["professional_check", "what_to_avoid"]);
  if (/сахар|measured|insulin|sugar-lowering|бага\/өндөр|даралт|bp/.test(text)) add(["glucose_like_signal", "physiological_reactivity"], ["D08", "D09", "D22"], [mechanismNamesByKey.glucose, mechanismNamesByKey.physiological], ["professional_check", "what_to_avoid"]);
  if (/хаваг|амьсгаад|огцом жин|жирэмсэн|төрсний|хөхүүл|эм/.test(text)) {
    add(["medical_friction"], ["D22", "D09"], [mechanismNamesByKey.medical], ["professional_check"]);
    safetyTrigger = "professional";
  }
  if (/сарын тэмдэг|мөчлөг|овуляц|pcos|перименопауз/.test(text)) {
    add(["menstrual_cycle_context"], ["D04", "D05", "D06", "D08", "D15", "D22"], [], ["tone_modifier", "what_to_avoid", "first_leverage_point"]);
  }
  if (/ирээгүй|тогтмол бус|хоол хасалт|хэт их дасгал|жин огцом буурах/.test(text)) {
    add(["cycle_professional_check"], ["D09", "D22"], [], ["professional_check", "what_to_avoid"]);
  }
  if (/бага сахар|санаа зовоосон|insulin|sugar-lowering|давтамжтай|одоогийн|хөхүүл|жирэмсэн|төрсний дараах 0-6/.test(text)) safetyTrigger = safetyTrigger || "professional";
  if (/будилах|ухаан балар|өөртөө хор|идэвхтэй|таталт|seizure|faint|confusion/.test(text)) safetyTrigger = "urgent";

  return {
    label,
    value: String(label || "").toLowerCase().replace(/\s+/g, "_").replace(/[^\w\u0400-\u04ff-]+/g, ""),
    tags: unique(tags),
    dimensions: unique(dimensions),
    mechanisms: unique(mechanisms),
    reportUse: unique(reportUse),
    safetyTrigger
  };
}

function defaultQuestionMechanisms(question) {
  const mechanismsFromScores = Object.values(question.scores || {}).flat().map(key => mechanismNamesByKey[key]).filter(Boolean);
  const optionMechanisms = (question.options || []).flatMap(option => optionSignals(option).mechanisms);
  const explicit = [];
  if (question.id === "S1-X03") explicit.push(mechanismNamesByKey.perfectionism);
  if (question.id === "S1-W06") explicit.push(mechanismNamesByKey.identity);
  return unique([...mechanismsFromScores, ...optionMechanisms, ...explicit]);
}

function enrichQuestion(question, source) {
  const moduleName = normalizedModule(question, source);
  const optionMetadata = {};
  (question.options || []).forEach(option => {
    optionMetadata[option] = optionSignals(option);
  });
  const optionDimensions = Object.values(optionMetadata).flatMap(meta => meta.dimensions);
  const optionTags = Object.values(optionMetadata).flatMap(meta => meta.tags);
  const optionReportUse = Object.values(optionMetadata).flatMap(meta => meta.reportUse);
  const safetyTrigger = question.safety
    ? (Object.values(optionMetadata).some(meta => meta.safetyTrigger === "urgent") ? "urgent" : "professional")
    : (Object.values(optionMetadata).find(meta => meta.safetyTrigger)?.safetyTrigger || null);
  question.metadata = {
    id: question.id,
    stage: stageForQuestion(question, source),
    module: moduleName,
    questionText: question.text,
    answerType: answerTypeFor(question.type),
    dimensions: unique([...(dimensionByModule[moduleName] || []), ...optionDimensions]),
    tags: unique([moduleName, ...optionTags]),
    mechanisms: defaultQuestionMechanisms(question),
    reportUse: unique(["report_evidence", ...optionReportUse]),
    safetyTrigger,
    voiceEnabled: Boolean(question.voice || question.id === "D-V01"),
    required: question.type !== "info"
  };
  question.optionMetadata = optionMetadata;
  return question;
}

function allQuestionObjects() {
  return [
    ...stageOneQuestions,
    ...dailyCore,
    ...dailyMenstrual,
    ...Object.values(probeBank).flat()
  ];
}

stageOneQuestions.forEach(question => enrichQuestion(question, "stage"));
dailyCore.forEach(question => enrichQuestion(question, "daily"));
dailyMenstrual.forEach(question => enrichQuestion(question, "daily"));
Object.values(probeBank).flat().forEach(question => enrichQuestion(question, "daily"));

function getQuestionMetadata(questionId) {
  return allQuestionObjects().find(question => question.id === questionId)?.metadata || null;
}

function getQuestionObject(questionId) {
  return allQuestionObjects().find(question => question.id === questionId) || null;
}

function getOptionMetadata(questionId, answerValue) {
  const question = getQuestionObject(questionId);
  if (!question) return null;
  return question.optionMetadata?.[answerValue] || optionSignals(answerValue);
}

function explicitMechanismsForAnswer(question, answer) {
  const text = Array.isArray(answer) ? answer.join(" ") : String(answer || "");
  const mechanismsForAnswer = [];
  if (question.id === "S1-X03" && /Тийм|Маш|Бага/.test(text)) mechanismsForAnswer.push(mechanismNamesByKey.perfectionism);
  if (question.id === "S1-W06" && text) mechanismsForAnswer.push(mechanismNamesByKey.identity);
  return mechanismsForAnswer;
}

function extractTagsFromAnswer(questionOrId, answer) {
  const question = typeof questionOrId === "string" ? getQuestionObject(questionOrId) : questionOrId;
  if (!question || answer == null || answer === "") return [];
  const values = Array.isArray(answer) ? answer : [answer];
  return unique([
    ...(question.metadata?.tags || []),
    ...values.flatMap(value => getOptionMetadata(question.id, value)?.tags || [])
  ]);
}

function extractDimensionsFromAnswer(questionOrId, answer) {
  const question = typeof questionOrId === "string" ? getQuestionObject(questionOrId) : questionOrId;
  if (!question || answer == null || answer === "") return [];
  const values = Array.isArray(answer) ? answer : [answer];
  return unique([
    ...(question.metadata?.dimensions || []),
    ...values.flatMap(value => getOptionMetadata(question.id, value)?.dimensions || [])
  ]);
}

function extractMechanismsFromAnswer(questionOrId, answer) {
  const question = typeof questionOrId === "string" ? getQuestionObject(questionOrId) : questionOrId;
  if (!question || answer == null || answer === "") return [];
  const values = Array.isArray(answer) ? answer : [answer];
  return unique([
    ...values.flatMap(value => (question.scores?.[value] || []).map(key => mechanismNamesByKey[key]).filter(Boolean)),
    ...explicitMechanismsForAnswer(question, answer),
    ...values.flatMap(value => getOptionMetadata(question.id, value)?.mechanisms || [])
  ]);
}

function extractReportUseFromAnswer(questionOrId, answer) {
  const question = typeof questionOrId === "string" ? getQuestionObject(questionOrId) : questionOrId;
  if (!question || answer == null || answer === "") return [];
  const values = Array.isArray(answer) ? answer : [answer];
  return unique([
    ...(question.metadata?.reportUse || []),
    ...values.flatMap(value => getOptionMetadata(question.id, value)?.reportUse || [])
  ]);
}

function aggregateDimensionEvidence(responses = {}) {
  return Object.entries(responses).reduce((acc, [questionId, answer]) => {
    extractDimensionsFromAnswer(questionId, answer).forEach(dimension => {
      acc[dimension] = (acc[dimension] || 0) + 1;
    });
    return acc;
  }, {});
}

function aggregateMechanismSignals(responses = {}, confirmedSummaries = []) {
  const fromAnswers = Object.entries(responses).flatMap(([questionId, answer]) => extractMechanismsFromAnswer(questionId, answer));
  const summaries = Array.isArray(confirmedSummaries) ? confirmedSummaries : Object.values(confirmedSummaries || {});
  const fromSummaries = summaries.flatMap(summary => summary?.mechanismSignals || []);
  return unique([...fromAnswers, ...fromSummaries]);
}

function aggregateReportUseEvidence(responses = {}, confirmedSummaries = []) {
  const evidence = {};
  Object.entries(responses).forEach(([questionId, answer]) => {
    extractReportUseFromAnswer(questionId, answer).forEach(use => {
      evidence[use] = evidence[use] || [];
      evidence[use].push({ questionId, answer });
    });
  });
  const summaries = Array.isArray(confirmedSummaries) ? confirmedSummaries : Object.values(confirmedSummaries || {});
  summaries.filter(summary => summary?.userConfirmed).forEach(summary => {
    (summary.extractedTags || []).forEach(tag => {
      evidence.confirmed_summary = evidence.confirmed_summary || [];
      evidence.confirmed_summary.push({ tag, summary: summary.confirmedSummary });
    });
  });
  return evidence;
}

function mechanismKeyForName(name) {
  return Object.entries(mechanisms).find(([, mechanism]) => mechanism.name === name)?.[0] || null;
}

function labelForEvidence(label) {
  return {
    strong: "хүчтэй нийцэж байна",
    moderate: "дунд зэрэг нийцэж байна",
    possible: "боломжит pattern",
    insufficient: "мэдээлэл хангалтгүй",
    safety: "шалгуулах дохио илэрсэн"
  }[label] || "боломжит pattern";
}

function emptyMechanismEvidence(name) {
  return {
    score: 0,
    diaryScore: 0,
    stageScore: 0,
    summaryScore: 0,
    evidenceLabel: "insufficient",
    sources: { stage1: [], diary: [], confirmedSummaries: [] },
    repeatedDays: [],
    directSignals: [],
    indirectSignals: [],
    contradictionSignals: [],
    relatedDimensions: [],
    reportUse: []
  };
}

function addMechanismEvidence(bucket, mechanismName, amount, sourceType, detail = {}) {
  if (!mechanismName) return;
  bucket[mechanismName] = bucket[mechanismName] || emptyMechanismEvidence(mechanismName);
  const item = bucket[mechanismName];
  item.score += amount;
  if (sourceType === "stage1") item.stageScore += amount;
  if (sourceType === "diary") item.diaryScore += amount;
  if (sourceType === "confirmedSummaries") item.summaryScore += amount;
  item.sources[sourceType].push(detail);
  if (detail.day && !item.repeatedDays.includes(detail.day)) item.repeatedDays.push(detail.day);
  if (detail.direct) item.directSignals.push(...(detail.tags || []));
  if (!detail.direct) item.indirectSignals.push(...(detail.tags || []));
  item.relatedDimensions = unique([...item.relatedDimensions, ...(detail.dimensions || [])]);
  item.reportUse = unique([...item.reportUse, ...(detail.reportUse || [])]);
}

function scoreRepeatedDays(evidence) {
  Object.values(evidence).forEach(item => {
    const count = item.repeatedDays.length;
    if (count >= 6) item.score += 6;
    else if (count >= 4) item.score += 4;
    else if (count >= 2) item.score += 2;
  });
}

function applyContradictionRules(evidence) {
  const reward = evidence[mechanismNamesByKey.reward];
  const hunger = evidence[mechanismNamesByKey.hungerSafety];
  if (reward && hunger && reward.stageScore > 0 && hunger.repeatedDays.length >= 4 && hunger.diaryScore > reward.diaryScore) {
    reward.score = Math.max(reward.stageScore > 0 ? 1 : 0, reward.score - 3);
    reward.contradictionSignals.push("Diary дээр хоолны хэмнэл/өлсөлтийн evidence reward self-report-оос хүчтэй давтагдсан.");
  }

  const regulation = evidence[mechanismNamesByKey.regulation];
  const executive = evidence[mechanismNamesByKey.executive] || evidence[mechanismNamesByKey.decisionDefault];
  if (regulation && executive && executive.repeatedDays.length >= 4 && executive.diaryScore > regulation.diaryScore) {
    regulation.score = Math.max(regulation.stageScore > 0 ? 1 : 0, regulation.score - 2);
    regulation.contradictionSignals.push("Stress signal байсан ч diary дээр low-energy/default evidence илүү хүчтэй давтагдсан.");
  }

  const role = evidence[mechanismNamesByKey.roleOverload];
  const deficit = evidence[mechanismNamesByKey.rewardDeficit];
  if (reward && (role || deficit) && (role?.repeatedDays.length >= 3 || deficit?.repeatedDays.length >= 3)) {
    reward.score = Math.max(reward.stageScore > 0 ? 2 : 0, reward.score - 6);
    reward.contradictionSignals.push("Reward signal байгаа ч role overload/self-neglect evidence илүү тод давтагдсан.");
  }

  const circadian = evidence[mechanismNamesByKey.circadian];
  if (reward && circadian && circadian.repeatedDays.length >= 4 && circadian.diaryScore >= reward.diaryScore * 0.6) {
    reward.score = Math.max(reward.stageScore > 0 ? 2 : 0, reward.score - 6);
    reward.contradictionSignals.push("Таатай мэдрэмж авах хүсэл нойр ба оройн эрч хүчний уналтаас хамаарч давтагдсан.");
  }
}

function evidenceLabelFor(item, context) {
  if (!item || item.score <= 0) return "insufficient";
  if (context.evidenceQuality === "one_time") {
    if (item.score >= 4 && item.summaryScore > 0) return "strong";
    if (item.score >= 2) return "moderate";
    return "possible";
  }
  if (context.evidenceQuality === "insufficient") return item.score > 0 ? "possible" : "insufficient";
  if (item.repeatedDays.length >= 4 || item.score >= 10) return "strong";
  if (item.repeatedDays.length >= 2 || item.score >= 5) return "moderate";
  return "possible";
}

function evidenceQualityFor(currentState = state) {
  if (currentState.packageType === "one-time") return "one_time";
  const readiness = reportReadiness(currentState.diaryEntries || []);
  if (readiness.key === "insufficient") return "insufficient";
  if (readiness.key === "limited") return "limited";
  if (readiness.key === "usable") return "usable";
  return "full";
}

function safetyRouteForMode(mode) {
  return { deep: "mode1", check: "mode2", professional: "mode3", urgent: "mode4" }[mode.mode] || "mode1";
}

function calculateMechanismEvidence(currentState = state) {
  const evidence = {};
  const previousState = state;
  state = { ...initialState, ...currentState };
  const mode = reportMode();
  state = previousState;
  const evidenceQuality = evidenceQualityFor(currentState);

  Object.entries(currentState.stageAnswers || {}).forEach(([questionId, answer]) => {
    const mechanismsForAnswer = extractMechanismsFromAnswer(questionId, answer);
    const tags = extractTagsFromAnswer(questionId, answer);
    const dimensions = extractDimensionsFromAnswer(questionId, answer);
    const reportUse = extractReportUseFromAnswer(questionId, answer);
    mechanismsForAnswer.forEach(mechanismName => addMechanismEvidence(evidence, mechanismName, 1, "stage1", {
      questionId,
      answer,
      tags,
      dimensions,
      reportUse,
      direct: true
    }));
  });

  Object.values(currentState.stageVoiceSummaries || {}).filter(summary => summary?.userConfirmed).forEach(summary => {
    (summary.mechanismSignals || []).forEach(mechanismName => addMechanismEvidence(evidence, mechanismName, 1.5, "confirmedSummaries", {
      checkpointId: summary.checkpointId,
      tags: summary.extractedTags || [],
      dimensions: summary.evidenceDimensions || [],
      reportUse: ["confirmed_summary", "hidden_function"],
      direct: true
    }));
  });

  (currentState.diaryEntries || []).forEach(entry => {
    const tags = entryEvidenceTags(entry);
    const mechanismSignals = mapTagsToMechanismSignals(tags);
    const dimensions = mapTagsToDimensions(tags);
    mechanismSignals.forEach(mechanismName => addMechanismEvidence(evidence, mechanismName, 2, "diary", {
      day: entry.day_number,
      tags,
      dimensions,
      reportUse: ["trigger_map", "before_30", "cycle_map"],
      direct: true
    }));
    if (entry.confirmedSummaryObject?.userConfirmed) {
      (entry.confirmedSummaryObject.mechanismSignals || []).forEach(mechanismName => addMechanismEvidence(evidence, mechanismName, 2.5, "confirmedSummaries", {
        day: entry.day_number,
        tags: entry.confirmedSummaryObject.extractedTags || [],
        dimensions: entry.confirmedSummaryObject.evidenceDimensions || [],
        reportUse: ["confirmed_summary", "hidden_function"],
        direct: true
      }));
    }
  });

  scoreRepeatedDays(evidence);
  applyContradictionRules(evidence);

  const context = { evidenceQuality };
  Object.values(evidence).forEach(item => {
    item.directSignals = unique(item.directSignals);
    item.indirectSignals = unique(item.indirectSignals);
    item.contradictionSignals = unique(item.contradictionSignals);
    item.evidenceLabel = mode.mode === "check" && item.relatedDimensions.some(d => ["D08", "D09", "D22"].includes(d))
      ? "safety"
      : evidenceLabelFor(item, context);
  });

  const sorted = Object.entries(evidence)
    .filter(([, item]) => item.score > 0)
    .sort(([, a], [, b]) => {
      if (evidenceQuality !== "one_time" && b.diaryScore !== a.diaryScore) return b.diaryScore - a.diaryScore;
      if (b.repeatedDays.length !== a.repeatedDays.length) return b.repeatedDays.length - a.repeatedDays.length;
      return b.score - a.score;
    });

  const primaryMechanism = ["professional", "urgent"].includes(mode.mode) ? null : (sorted[0]?.[0] || null);
  const secondaryMechanisms = sorted.filter(([name]) => name !== primaryMechanism).slice(0, 2).map(([name]) => name);
  const supportingMechanisms = sorted.filter(([name]) => name !== primaryMechanism && !secondaryMechanisms.includes(name)).slice(0, 3).map(([name]) => name);

  return {
    mechanisms: evidence,
    primaryMechanism,
    secondaryMechanisms,
    supportingMechanisms,
    safetyRoute: safetyRouteForMode(mode),
    evidenceQuality,
    combinations: identifyMechanismCombinations(evidence)
  };
}

function identifyMechanismCombinations(evidence) {
  const has = name => Boolean(evidence[name]?.score > 0);
  const combos = [];
  const addCombo = (comboId, mechanismList, interpretation, firstLever, avoidList) => {
    if (mechanismList.every(has)) combos.push({ comboId, mechanisms: mechanismList, interpretation, firstLever, avoidList });
  };
  addCombo("hunger_safety_reward", [mechanismNamesByKey.hungerSafety, mechanismNamesByKey.reward], "Өлсөлт/safety response болон reward хүсэл нэг циклд давхцаж байна.", "anchor_meals_plus_planned_evening_option", ["Урт мацаг", "Амттай бүхнийг бүрэн хорих"]);
  addCombo("control_collapse_shame", [mechanismNamesByKey.collapse, mechanismNamesByKey.shameAvoidance], "Нэг хазайлтын дараах гэмшил, өөрийгөө буруутгах тойрог нуралтыг хүчтэй болгодог.", "recovery_rule", ["Төгс хийх гэж хэт чангарсан төлөвлөгөө", "Ичгүүрээр шахдаг хяналт"]);
  addCombo("executive_default", [mechanismNamesByKey.executive, mechanismNamesByKey.decisionDefault], "Тэнхээ дуусах үед орчны бэлэн сонголт хамгийн амар зам болдог.", "default_dinner_system", ["Олон дүрэмтэй хоолны төлөвлөгөө", "Орчны бэлэн сонголтыг үл өөрчлөх"]);
  addCombo("circadian_reward_deficit", [mechanismNamesByKey.circadian, mechanismNamesByKey.rewardDeficit], "Оройн energy rhythm болон daily reward deficit давхцаж байна.", "planned_rest_reward", ["Reward-г огт төлөвлөхгүй байх"]);
  addCombo("glucose_hunger_safety", [mechanismNamesByKey.glucose, mechanismNamesByKey.hungerSafety], "Body/sugar safety concern hunger-safety response-г нэмэгдүүлж байна.", "professional_check_plus_anchor_meals", ["Fasting", "Meal skipping"]);
  addCombo("social_autonomy", [mechanismNamesByKey.social, mechanismNamesByKey.autonomy], "Social pressure болон өөрөө сонгох хэрэгцээ хоорондоо мөргөлдөж байна.", "choice_preserving_social_script", ["Бүрэн хориг", "Social event дээр хатуу rule"]);
  addCombo("body_safety_shame", [mechanismNamesByKey.bodySafety, mechanismNamesByKey.shameAvoidance], "Body attention discomfort болон shame avoidance feedback-ээс зугтах cycle үүсгэж байна.", "body_neutral_tracking", ["Public before/after challenge"]);
  return combos;
}

const initialState = {
  view: "landing",
  packageType: null,
  stageIndex: 0,
  stageAnswers: {},
  safetyFlags: [],
  preliminary: [],
  diaryDay: 1,
  diaryQuestionIndex: 0,
  diaryDraft: {},
  diarySummaryUi: {},
  stageVoiceSummaries: {},
  stageSummaryUi: {},
  lastInsight: "",
  diaryEntries: [],
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  paymentSessionId: "",
  qpayPayment: {
    status: "idle",
    message: "",
    invoice: null
  },
  currentAssessmentId: null,
  internalTest: false,
  internalFeedbackForm: { ...INTERNAL_FEEDBACK_DEFAULTS },
  lastFeedbackId: null,
  leadProductKey: null,
  leadSourceScreen: null,
  leadForm: {
    name: "",
    contact: "",
    willingness: WILLINGNESS_OPTIONS[0],
    comment: ""
  },
  leadError: "",
  lastLeadId: null,
  coachInviteToken: "",
  coachInvite: null,
  coachDiscountConsent: false,
  coachLoginForm: { email: "", password: "" },
  coachLoginError: "",
  coachSessionToken: "",
  coachDashboardMessage: "",
  coachClientForm: { email: "", name: "", note: "" },
  coachReportView: null,
  adminCoachForm: { email: "", name: "", phone: "", commissionMnt: String(COACH_COMMISSION_MNT) },
  adminCoachResult: null
};

const hasBrowserRuntime = typeof window !== "undefined" && typeof document !== "undefined";
let state = hasBrowserRuntime ? loadState() : { ...initialState };

function loadState() {
  try {
    if (!hasBrowserRuntime) return { ...initialState };
    const params = new URLSearchParams(window.location.search || "");
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const pathView = initialViewFromPath(window.location.pathname || "");
    return {
      ...initialState,
      ...stored,
      view: pathView || stored.view || initialState.view,
      internalTest: params.get("internalTest") === "1" || stored.internalTest === true,
      coachInviteToken: params.get("coachInvite") || stored.coachInviteToken || ""
    };
  } catch {
    return { ...initialState };
  }
}

function initialViewFromPath(pathname = "") {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/coach/login") return "coachLogin";
  if (path === "/coach/dashboard") return "coachDashboard";
  if (path === "/admin/coach") return "adminCoach";
  return "";
}

function saveState() {
  if (!hasBrowserRuntime) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scrollToTopAfterRender() {
  if (!hasBrowserRuntime || typeof window.scrollTo !== "function") return;
  const runScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(runScroll);
    return;
  }
  runScroll();
}

function resetState() {
  const keepInternalTest = isInternalTestMode();
  state = { ...initialState, internalTest: keepInternalTest };
  saveState();
  render({ scrollToTop: true });
}

function setView(view) {
  state.view = view;
  saveState();
  render({ scrollToTop: true });
}

function choosePackage(packageType) {
  state.packageType = packageType;
  state.view = packageType === "one-time" ? "oneTimeStart" : "sevenDayStart";
  if (packageType === "one-time") refreshCoachInvite();
  saveState();
  render({ scrollToTop: true });
}

function refreshCoachInvite(email = "") {
  const invite = mockBackend.resolveCoachInvitation({
    email,
    inviteToken: state.coachInviteToken || ""
  });
  state.coachInvite = invite.matched ? invite : null;
  return state.coachInvite;
}

function acceptCoachDiscount() {
  const invite = refreshCoachInvite();
  if (!invite?.client?.id) return;
  const result = mockBackend.acceptCoachInvitation({
    coachClientId: invite.client.id,
    consent: true
  });
  state.coachInvite = {
    ...invite,
    client: result.client,
    price_mnt: result.price_mnt
  };
  state.coachDiscountConsent = true;
  saveState();
  render({ scrollToTop: true });
}

function declineCoachDiscount() {
  const invite = refreshCoachInvite();
  if (invite?.client?.id) {
    mockBackend.acceptCoachInvitation({
      coachClientId: invite.client.id,
      consent: false
    });
  }
  state.coachDiscountConsent = false;
  state.coachInvite = null;
  state.coachInviteToken = "";
  saveState();
  render({ scrollToTop: true });
}

function ensurePaymentSessionId() {
  if (state.paymentSessionId) return state.paymentSessionId;
  const random = Math.random().toString(16).slice(2, 10);
  state.paymentSessionId = `wt_${Date.now()}_${random}`;
  saveState();
  return state.paymentSessionId;
}

function beginAssessment(packageType = state.packageType || "one-time") {
  const coachInvite = packageType === "one-time" && state.coachDiscountConsent ? state.coachInvite : null;
  const assessment = mockBackend.createAssessment(packageType === "seven-day" ? "seven_day" : "one_time", {
    coachClientId: coachInvite?.client?.id || null,
    coachId: coachInvite?.coach?.id || null,
    userEmail: coachInvite?.client?.client_email_normalized || "",
    shareWithCoach: Boolean(coachInvite?.client?.share_report_consent)
  });
  if (coachInvite?.client?.id) {
    mockBackend.linkAssessmentToCoach(assessment.id, {
      coachClientId: coachInvite.client.id,
      userEmail: coachInvite.client.client_email_normalized,
      shareWithCoach: true
    });
  }
  state.packageType = packageType;
  state.currentAssessmentId = assessment.id;
  state.stageIndex = 0;
  state.stageAnswers = {};
  state.safetyFlags = [];
  state.preliminary = [];
  state.view = "stage1";
  saveState();
  render({ scrollToTop: true });
}

function demoCompletePayment(kind) {
  const productType = kind === "one-time" ? "one_time" : kind === "seven-day" ? "seven_day" : "upgrade";
  mockBackend.trackEvent("demo_unlock", {
    productType,
    sourceScreen: state.view,
    assessmentId: state.currentAssessmentId || null
  });
  const payment = mockBackend.createMockPayment(productType, state.currentAssessmentId || null, {
    coachId: kind === "one-time" && state.coachDiscountConsent ? state.coachInvite?.coach?.id : null,
    coachClientId: kind === "one-time" && state.coachDiscountConsent ? state.coachInvite?.client?.id : null,
    userEmail: kind === "one-time" && state.coachDiscountConsent ? state.coachInvite?.client?.client_email_normalized : ""
  });
  mockBackend.markMockPaymentPaid(payment.id);
  if (kind === "one-time") {
    state.oneTimePaid = true;
    state.view = "report";
  } else if (kind === "seven-day") {
    state.sevenDayPaid = true;
    state.packageType = "seven-day";
    state.view = state.preliminary.length ? "unlock" : "sevenDayStart";
  } else if (kind === "upgrade") {
    state.upgradePaid = true;
    state.sevenDayPaid = true;
    state.packageType = "seven-day";
    if (!state.preliminary.length) state.preliminary = rankedPatterns(false).slice(0, 4);
    state.view = "unlock";
  }
  saveState();
  render({ scrollToTop: true });
}

function startLeadCapture(kind) {
  const product = VALIDATION_PRODUCTS[kind];
  if (!product) return;
  mockBackend.trackEvent("paid_cta_click", {
    productType: product.productType,
    sourceScreen: state.view,
    assessmentId: state.currentAssessmentId || null
  });
  state.leadProductKey = kind;
  state.leadSourceScreen = state.view;
  state.leadForm = {
    name: "",
    contact: "",
    willingness: WILLINGNESS_OPTIONS[0],
    comment: ""
  };
  state.leadError = "";
  state.view = "leadCapture";
  mockBackend.trackEvent("lead_form_view", {
    productType: product.productType,
    sourceScreen: state.leadSourceScreen,
    assessmentId: state.currentAssessmentId || null
  });
  saveState();
  render({ scrollToTop: true });
}

function updateLeadField(field, value) {
  state.leadForm = {
    ...(state.leadForm || {}),
    [field]: value
  };
  saveState();
}

function submitLeadCapture() {
  const product = VALIDATION_PRODUCTS[state.leadProductKey];
  if (!product) return;
  const form = state.leadForm || {};
  if (!String(form.contact || "").trim()) {
    state.leadError = "Утас эсвэл имэйл үлдээнэ үү.";
    saveState();
    render();
    return;
  }
  const lead = mockBackend.createLeadIntent({
    productType: product.productType,
    productLabel: product.label,
    priceMnt: product.priceMnt,
    name: form.name || "",
    contact: form.contact,
    willingness: form.willingness || WILLINGNESS_OPTIONS[0],
    comment: form.comment || "",
    sourceScreen: state.leadSourceScreen || null,
    assessmentId: state.currentAssessmentId || null
  });
  state.lastLeadId = lead.id;
  state.leadError = "";
  state.view = "leadThankYou";
  saveState();
  render({ scrollToTop: true });
}

function qpayStatusMessage(status) {
  return {
    creating: "QPay QR үүсгэж байна.",
    pending: "Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.",
    checking: "Төлбөрийн төлөвийг шалгаж байна.",
    paid: "Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.",
    error: "Төлбөрийн төлөв шалгахад түр алдаа гарлаа. Түр хүлээгээд дахин шалгана уу."
  }[status] || "";
}

async function createWeightQpayInvoice() {
  ensurePaymentSessionId();
  state.qpayPayment = {
    status: "creating",
    message: qpayStatusMessage("creating"),
    invoice: null
  };
  saveState();
  render();
  try {
    const response = await fetch(WEIGHT_TEST_QPAY_ENDPOINTS.create, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productCode: WEIGHT_TEST_PRODUCT_CODE,
        sessionId: state.paymentSessionId,
        userId: state.paymentSessionId,
        amountMnt: currentOneTimePriceMnt(),
        coachId: state.coachDiscountConsent ? state.coachInvite?.coach?.id : null,
        coachClientId: state.coachDiscountConsent ? state.coachInvite?.client?.id : null
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok || !payload.invoice) throw new Error("CREATE_FAILED");
    state.qpayPayment = {
      status: "pending",
      message: qpayStatusMessage("pending"),
      invoice: payload.invoice
    };
  } catch {
    state.qpayPayment = {
      status: "error",
      message: qpayStatusMessage("error"),
      invoice: null
    };
  }
  saveState();
  render();
}

async function checkWeightQpayPayment() {
  const invoice = state.qpayPayment?.invoice;
  if (!invoice) return;
  state.qpayPayment = {
    ...state.qpayPayment,
    status: "checking",
    message: qpayStatusMessage("checking")
  };
  saveState();
  render();
  try {
    const response = await fetch(WEIGHT_TEST_QPAY_ENDPOINTS.check, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productCode: WEIGHT_TEST_PRODUCT_CODE,
        invoiceId: invoice.invoiceId,
        senderInvoiceNo: invoice.senderInvoiceNo
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) throw new Error("CHECK_FAILED");
    if (payload.payment?.paid && payload.payment?.productCode === WEIGHT_TEST_PRODUCT_CODE) {
      state.oneTimePaid = true;
      state.qpayPayment = {
        ...state.qpayPayment,
        status: "paid",
        message: qpayStatusMessage("paid")
      };
    } else {
      state.qpayPayment = {
        ...state.qpayPayment,
        status: "pending",
        message: qpayStatusMessage("pending")
      };
    }
  } catch {
    state.qpayPayment = {
      ...state.qpayPayment,
      status: "error",
      message: qpayStatusMessage("error")
    };
  }
  saveState();
  render();
}

function hasSevenDayAccess() {
  const access = mockBackend.getAccessState(state.currentAssessmentId || null);
  return Boolean(isInternalTestMode() || state.sevenDayPaid || state.upgradePaid || access.hasSevenDayAccess);
}

function hasOneTimeReportAccess() {
  const access = mockBackend.getAccessState(state.currentAssessmentId || null);
  return Boolean(isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === "paid" || access.hasOneTimeReportAccess);
}

function hasUpgradeAccess() {
  const access = mockBackend.getAccessState(state.currentAssessmentId || null);
  return Boolean(state.upgradePaid || access.hasUpgradeAccess);
}

function hasMenstrualCycleContext(answers = state.stageAnswers) {
  return answers["MC-GATE"] === MENSTRUAL_GATE_YES;
}

function isMenstrualStageQuestion(question) {
  return question?.module === MENSTRUAL_CONTEXT_MODULE;
}

function shouldShowStageQuestion(question, answers = state.stageAnswers) {
  if (!isMenstrualStageQuestion(question)) return true;
  if (question.id === "MC-GATE") return true;
  return hasMenstrualCycleContext(answers);
}

function stageQuestions() {
  const visible = question => shouldShowStageQuestion(question);
  if (state.packageType !== "seven-day") return stageOneQuestions.filter(visible);
  const setupModules = new Set([
    "Warm start",
    "Basic context",
    "Weight trajectory",
    "Past attempts",
    "Meal rhythm",
    "Hidden function",
    "Restriction response",
    "Executive load",
    "Environment",
    "Body / medical",
    MENSTRUAL_CONTEXT_MODULE,
    "Safety"
  ]);
  const setupIds = new Set(["S1-H02", "S1-H03", "S1-V01", "S1-V02"]);
  return stageOneQuestions.filter(question => (setupModules.has(question.module) || setupIds.has(question.id)) && visible(question));
}

function currentQuestion() {
  const questions = stageQuestions();
  if (state.stageIndex >= questions.length) state.stageIndex = Math.max(0, questions.length - 1);
  return questions[state.stageIndex];
}

function getValue(question) {
  return state.stageAnswers[question.id] ?? (question.type === "multi" ? [] : "");
}

function setAnswer(question, value) {
  state.stageAnswers[question.id] = value;
  state.safetyFlags = calculateSafetyFlags();
  saveState();
  render();
}

function setAnswerDraft(id, value) {
  state.stageAnswers[id] = value;
  state.safetyFlags = calculateSafetyFlags();
  saveState();
}

function calculateSafetyFlags() {
  return [
    ...calculateStageSafetyFlags(),
    ...calculateMenstrualSafetyFlags(),
    ...Object.values(state.stageVoiceSummaries || {}).flatMap(summary => summary.safetyFlags || []),
    ...calculateDiarySafetyFlags(state.diaryEntries)
  ];
}

function calculateStageSafetyFlags() {
  return stageQuestions().flatMap(question => {
    if (!question.safety) return [];
    const value = state.stageAnswers[question.id] ?? (question.type === "multi" ? [] : "");
    if (isEmptyAnswer(value)) return [];
    return question.safety(value).map(flag => `${question.id}:${flag}`);
  });
}

function isEmptyAnswer(value) {
  return value === "" || value == null || (Array.isArray(value) && value.length === 0);
}

function flattenEntryValues(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.flatMap(flattenEntryValues);
  if (typeof value === "object") return Object.values(value).flatMap(flattenEntryValues);
  return [String(value)];
}

function containsAny(text, needles) {
  const normalized = String(text || "").toLowerCase();
  return needles.some(needle => normalized.includes(needle));
}

const tagDimensionMap = {
  skipped_meal: ["D03"],
  meal_gap_5h_plus: ["D03"],
  evening_unplanned_eating: ["D03", "D15"],
  high_hunger: ["D04"],
  low_hunger_craving: ["D04", "D05"],
  reward_pull: ["D05"],
  food_as_regulation: ["D06", "D16"],
  hunger_safety: ["D07"],
  executive_load: ["D13"],
  default_delivery: ["D13", "D14"],
  cue_trigger: ["D14"],
  social_pressure: ["D17"],
  autonomy_rebellion: ["D21"],
  control_collapse: ["D11"],
  shame_guilt: ["D12"],
  glucose_like_signal: ["D08", "D09"],
  physiological_reactivity: ["D09", "D22"],
  bp_concern: ["D09"],
  swelling_signal: ["D09", "D22"],
  urgent_confusion_fainting: ["D09"],
  self_harm_signal: ["D16"]
};

const tagMechanismMap = {
  skipped_meal: ["Hunger-Safety / Scarcity Protection", "Circadian-Energy Mismatch"],
  meal_gap_5h_plus: ["Hunger-Safety / Scarcity Protection"],
  evening_unplanned_eating: ["Circadian-Energy Mismatch", "Reward-Seeking / Stimulation Compensation"],
  high_hunger: ["Hunger-Safety / Scarcity Protection"],
  low_hunger_craving: ["Reward-Seeking / Stimulation Compensation"],
  reward_pull: ["Reward-Seeking / Stimulation Compensation", "Reward Deficit Compensation"],
  food_as_regulation: ["Food-as-Regulation System"],
  hunger_safety: ["Hunger-Safety / Scarcity Protection"],
  executive_load: ["Executive Load Failure", "Decision-Default Mismatch"],
  default_delivery: ["Executive Load Failure", "Decision-Default Mismatch"],
  cue_trigger: ["Cue-Conditioned Automatic Eating"],
  social_pressure: ["Social Belonging Food Pattern"],
  autonomy_rebellion: ["Autonomy Rebellion Pattern"],
  control_collapse: ["Control-Collapse Cycle"],
  shame_guilt: ["Control-Collapse Cycle", "Shame-Avoidance Loop"],
  role_overload: ["Role Overload / Self-Neglect Pattern", "Reward Deficit Compensation"],
  body_safety: ["Body-Safety / Attention Avoidance", "Shame-Avoidance Loop"],
  circadian_crash: ["Circadian-Energy Mismatch", "Executive Load Failure"],
  glucose_like_signal: ["Glucose-Safety / Hypoglycemia Risk Pattern", "Hunger-Triggered Physiological Reactivity"],
  physiological_reactivity: ["Hunger-Triggered Physiological Reactivity"],
  bp_concern: ["Medical / Medication / Physiological Friction"],
  swelling_signal: ["Medical / Medication / Physiological Friction"],
  urgent_confusion_fainting: ["Glucose-Safety / Hypoglycemia Risk Pattern", "Medical / Medication / Physiological Friction"],
  self_harm_signal: ["Professional-First Safety"]
};

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function splitSummaryText(text) {
  return String(text || "")
    .split(/\n|;|•|-/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function generateDailySummaryBullets(draft = {}) {
  const bullets = [];
  const functions = draft.food_function || [];
  const reflection = String(draft.raw_reflection || "").trim();

  if (draft.meal_rhythm?.includes("Нэг хоол алгассан")) bullets.push("Нэг хоол алгассан");
  if (draft.meal_rhythm?.includes("5+")) bullets.push("Хоолны хооронд 5+ цагийн зай гарсан");
  if (draft.meal_rhythm?.includes("орой нөхсөн")) bullets.push("Өдөр бага идээд орой нөхөж идсэн давтамж тэмдэглэгдсэн");
  if (draft.main_moment_time === "Орой") bullets.push("Гол мөч орой гарсан");
  if (Number(draft.hunger_level) >= 7) bullets.push("Тэр үед өлсөлт өндөр байсан");
  if (Number(draft.hunger_level) <= 3 && draft.unplanned_eating_count && draft.unplanned_eating_count !== "Үгүй") bullets.push("Өлсөлт бага үед идэх хүсэл гарсан");
  if (functions.includes("Амттай юм хүссэн") || functions.includes("Өөрийгөө шагнамаар байсан")) bullets.push("Өөрийгөө баярлуулах эсвэл амттай юм идэх хүсэл давхцсан");
  if (functions.includes("Тайвширмаар байсан")) bullets.push("Хоол тайвшруулах үүрэгтэй байсан гэж тэмдэглэгдсэн");
  if (functions.includes("Дараа өлсөхөөс санаа зовсон")) bullets.push("Дараа өлсөхөөс болгоомжилсон мэдрэмж ажиглагдсан");
  if (functions.includes("Хамгийн амар сонголт байсан")) bullets.push("Ядарсан үед хамгийн амар сонголт нөлөөлсөн");
  if (functions.includes("Хоол харагдаад/үнэртээд идмээр болсон")) bullets.push("Орчны дохио идэх хүслийг асаасан");
  if (functions.includes("Хүмүүсийн дунд татгалзах эвгүй байсан")) bullets.push("Хүмүүсийн дунд татгалзах эвгүй мэдрэмж сонголтод нөлөөлсөн");
  if (functions.includes("Бие муудах/сахар унах вий гэж санаа зовсон")) bullets.push("Биеийн дохионд санаа зовсон мэдрэмж тэмдэглэгдсэн");
  if (["Стресс", "Уур", "Гуниг", "Санаа зовнил", "Ганцаардал"].includes(draft.emotion)) bullets.push(`${draft.emotion} мэдрэмж идэх хүсэлтэй давхцсан`);
  if (Number(draft.energy_score) <= 3) bullets.push("Оройн эрч хүч бага байсан");
  if ((draft.body_signals || []).some(item => item !== "Аль нь ч үгүй")) bullets.push("Биеийн дохио тэмдэглэгдсэн");
  if (/delivery|захиал/i.test(reflection)) bullets.push("Хоол захиалах нь хамгийн амар сонголт болсон");
  if (reflection && bullets.length < 3) bullets.push("Таны бичсэн тайлбар нэмэлт мэдээлэл болж хадгалагдсан");
  if (!bullets.length) bullets.push("Өдрийн бүтэцтэй хариулт хадгалагдсан");
  return unique(bullets).slice(0, 6);
}

function generateStageSummaryBullets(rawText = "", answers = {}) {
  const text = String(rawText || "").trim();
  const bullets = [];
  if (answers["S1-M01"]) bullets.push(`Хоолны хэмнэл: ${answers["S1-M01"]}`);
  if (answers["S1-F01"]) bullets.push(`Төлөвлөөгүй идэхийн өмнөх ойр дохио: ${[].concat(answers["S1-F01"]).join(", ")}`);
  if (answers["S1-W06"]) bullets.push(`Төлөвлөгөө алдагдсаны дараах бодол: ${answers["S1-W06"]}`);
  if (/delivery|захиал/i.test(text)) bullets.push("Хоол захиалах эсвэл хамгийн амар сонголт дурдагдсан");
  if (/стресс|stress|тайвш/i.test(text)) bullets.push("Стресс эсвэл тайвшрах хэрэгцээ дурдагдсан");
  if (/өлс|хоол холд|хоол уда|5\+/.test(text)) bullets.push("Өлсөлт эсвэл хоолны зайтай холбоотой зүйл дурдагдсан");
  if (/гэмш|ич|нуух/.test(text)) bullets.push("Дараа нь гэмших, ичих, нуух мэдрэмж дурдагдсан");
  if (text && bullets.length < 3) bullets.push("Таны бичсэн тайлбар нэмэлт мэдээлэл болж хадгалагдсан");
  return unique(bullets).slice(0, 6);
}

function extractTagsFromEvidence(structured = {}, confirmedSummary = []) {
  const text = [...flattenEntryValues(structured), ...confirmedSummary].join(" | ").toLowerCase();
  const tags = [];
  if (containsAny(text, ["нэг хоол алгассан", "хоол алгас", "skipped"])) tags.push("skipped_meal");
  if (containsAny(text, ["5+ цаг", "5+", "хоолны хооронд"])) tags.push("meal_gap_5h_plus");
  if (containsAny(text, ["орой", "evening"]) && containsAny(text, ["төлөвлөөгүй", "unplanned", "гол мөч"])) tags.push("evening_unplanned_eating");
  if (containsAny(text, ["өлсөлт өндөр", "8", "9", "10", "маш хүчтэй өлс"])) tags.push("high_hunger");
  if (containsAny(text, ["өлсөлт бага", "өлсөөгүй", "low hunger"])) tags.push("low_hunger_craving");
  if (containsAny(text, ["reward", "шагна", "амттай", "нэг гоё"])) tags.push("reward_pull");
  if (containsAny(text, ["тайвш", "стресс", "stress", "санаа зовнил", "гуниг", "уур"])) tags.push("food_as_regulation");
  if (containsAny(text, ["дараа өлс", "хамгаалах response", "safety"])) tags.push("hunger_safety");
  if (containsAny(text, ["energy бага", "хийх energy", "ядар", "хамгийн амар"])) tags.push("executive_load");
  if (containsAny(text, ["delivery", "захиал"])) tags.push("default_delivery");
  if (containsAny(text, ["cue", "харагда", "үнэрт", "food зураг"])) tags.push("cue_trigger");
  if (containsAny(text, ["social", "хүмүүсийн дунд", "татгалзах эвгүй"])) tags.push("social_pressure");
  if (containsAny(text, ["бусдын хэрэгцээ", "хүүхэд", "өөрийн цаг", "миний цаг", "өөрийгөө хамгийн сүүлд", "хамгийн сүүлд", "self-time", "leftover"])) tags.push("role_overload");
  if (containsAny(text, ["нойр муу", "4-6 цаг", "чанар муу", "оройн эрч хүч", "energy crash", "кофеин", "caffeine", "өглөөний хоолгүй", "өглөө алгас", "night craving"])) tags.push("circadian_crash");
  if (containsAny(text, ["одоо бүх юм дууссан", "маргааш чанга", "collapse"])) tags.push("control_collapse");
  if (containsAny(text, ["гэмш", "ич", "нуух", "shame", "guilt"])) tags.push("shame_guilt");
  if (containsAny(text, ["body visibility", "before/after", "public challenge", "бусдад харагдах", "өөрийгөө харах", "жин үз", "body-shaming"])) tags.push("body_safety");
  if (containsAny(text, ["гар салгалах", "зүрх дэлсэх", "хөлрөх", "толгой эргэх", "толгой өвдөх"])) tags.push("physiological_reactivity");
  if (containsAny(text, ["сахар унасан мэт", "бага сахар", "measured glucose", "бага/өндөр гарсан", "insulin", "sugar-lowering"])) tags.push("glucose_like_signal");
  if (containsAny(text, ["даралт", "bp", "blood pressure"])) tags.push("bp_concern");
  if (containsAny(text, ["хаваг", "swelling"])) tags.push("swelling_signal");
  if (containsAny(text, ["будилах", "ухаан балар", "ухаан ал", "faint", "confusion", "таталт", "seizure"])) tags.push("urgent_confusion_fainting");
  if (containsAny(text, ["өөртөө хор", "амьдрах хүсэлгүй", "амиа", "suicide", "self-harm", "kill myself"])) tags.push("self_harm_signal");
  return unique(tags);
}

function mapTagsToDimensions(tags = []) {
  return unique(tags.flatMap(tag => tagDimensionMap[tag] || []));
}

function mapTagsToMechanismSignals(tags = []) {
  return unique(tags.flatMap(tag => tagMechanismMap[tag] || []));
}

function safetyFlagsFromTags(tags = [], prefix = "SUMMARY") {
  if (tags.includes("self_harm_signal") || tags.includes("urgent_confusion_fainting")) return [`${prefix}:urgent`];
  if (tags.some(tag => ["bp_concern", "swelling_signal"].includes(tag))) return [`${prefix}:professional`];
  return [];
}

function createConfirmedSummaryObject({ kind, id, dayNumber, rawText, structured = {}, aiSummaryBullets = [], mode = "confirm", editText = "", addText = "" }) {
  const edited = mode === "edit" ? splitSummaryText(editText) : null;
  let confirmed = edited && edited.length ? edited : [...aiSummaryBullets];
  if (mode === "add") confirmed = [...confirmed, ...splitSummaryText(addText)];
  confirmed = unique(confirmed).slice(0, 8);
  const extractedTags = extractTagsFromEvidence(structured, confirmed);
  return {
    ...(kind === "stage" ? { checkpointId: id } : { diaryDay: dayNumber, promptId: id }),
    rawText: rawText || null,
    aiSummaryBullets,
    userConfirmed: true,
    userEditedSummary: edited,
    confirmedSummary: confirmed,
    extractedTags,
    evidenceDimensions: mapTagsToDimensions(extractedTags),
    mechanismSignals: mapTagsToMechanismSignals(extractedTags),
    safetyFlags: safetyFlagsFromTags(extractedTags, kind === "stage" ? id : `D-${dayNumber || "X"}`)
  };
}

function diaryEntrySafetyFlags(entry) {
  const evidenceOnly = {
    meal_rhythm: entry.meal_rhythm,
    unplanned_eating_count: entry.unplanned_eating_count,
    main_moment_time: entry.main_moment_time,
    hunger_level: entry.hunger_level,
    food_function: entry.food_function,
    emotion: entry.emotion,
    stress_score: entry.stress_score,
    energy_score: entry.energy_score,
    sleep: entry.sleep,
    body_signals: entry.body_signals,
    movement: entry.movement,
    pattern_probes: entry.pattern_probes,
    voice_confirmed_summary: entry.voice_confirmed_summary
  };
  const values = flattenEntryValues(evidenceOnly);
  const joined = values.join(" | ");
  const flags = [];
  const urgentTerms = [
    "будилах",
    "ухаан балар",
    "ухаан ал",
    "таталт",
    "seizure",
    "faint",
    "confusion",
    "өөртөө хор",
    "амиа",
    "үхье",
    "suicide",
    "self-harm",
    "kill myself"
  ];
  const professionalTerms = [
    "бага/өндөр гарсан",
    "санаа зовоосон",
    "даралт өссөн мэт",
    "сахар унасан мэт",
    "хавагнах"
  ];

  if (containsAny(joined, urgentTerms)) flags.push(`D-${entry.day_number || "X"}:urgent`);
  if (containsAny(joined, professionalTerms)) flags.push(`D-${entry.day_number || "X"}:professional`);
  return unique([...(entry.confirmedSummaryObject?.safetyFlags || []), ...flags]);
}

function calculateDiarySafetyFlags(entries = []) {
  return entries.flatMap(diaryEntrySafetyFlags);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return isEmptyAnswer(value) ? [] : [value];
}

function menstrualCycleEvidence(answers = state.stageAnswers, diaryEntries = state.diaryEntries, diaryDraft = state.diaryDraft) {
  const gateActive = hasMenstrualCycleContext(answers);
  const directCycleOptions = [
    ...asArray(answers["S1-F01"]),
    ...asArray(answers["S1-R02"]),
    ...asArray(diaryDraft.food_function),
    ...diaryEntries.flatMap(entry => asArray(entry.food_function))
  ].some(value => containsAny(value, ["сарын тэмдэг", "мөчлөг"]));
  if (!gateActive && !directCycleOptions) {
    return {
      active: false,
      tags: [],
      confidenceLow: false,
      premenstrual: false,
      professionalCheck: false,
      professionalFirst: false
    };
  }

  const tags = new Set(["menstrual_cycle_context"]);
  const cyclePattern = answers["MC-01"] || "";
  const cycleTiming = answers["MC-02"] || "";
  const appetiteTiming = answers["MC-03"] || "";
  const premenstrualChanges = asArray(answers["MC-04"]);
  const intakeChange = answers["MC-05"] || "";
  const modifiers = asArray(answers["MC-06"]);
  const disruption = answers["MC-07"] || "";
  const diaryCycleValues = diaryEntries.flatMap(entry => [
    entry.cycle_today_phase,
    entry.cycle_today_link,
    entry.cycle_body_effect,
    ...asArray(entry.food_function)
  ].flat()).filter(Boolean);

  if (containsAny(cyclePattern, ["зөрдөг", "тогтмол биш", "ирээгүй"])) tags.add("irregular_cycle_professional_check");
  if (cyclePattern === "Сүүлийн 3 сард ирээгүй") tags.add("amenorrhea_3_months");
  if (containsAny(cycleTiming, ["18–28", "28 хоногоос дээш"])) tags.add("cycle_phase_low_confidence");
  if (containsAny(appetiteTiming, ["ирэхээс"]) || asArray(answers["S1-R02"]).includes("Сарын тэмдэг ирэхийн өмнөх өдрүүдэд") || diaryCycleValues.some(value => containsAny(value, ["ирэхээс өмнөх", "амттай юм"]))) tags.add("premenstrual_appetite_shift");
  if (premenstrualChanges.includes("Илүү өлсдөг")) tags.add("cycle_hunger_increase");
  if (premenstrualChanges.includes("Амттай юм, гурилан зүйл илүү хүсдэг")) tags.add("cycle_sweet_craving");
  if (premenstrualChanges.includes("Давслаг, шарсан зүйл илүү хүсдэг")) tags.add("cycle_salty_fat_craving");
  if (premenstrualChanges.includes("Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг")) tags.add("cycle_mood_eating");
  if (premenstrualChanges.includes("Ядаргаа, нойр муудахтай давхцдаг")) tags.add("cycle_sleep_fatigue");
  if (premenstrualChanges.includes("Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг")) tags.add("cycle_bloating_body_signal");
  if (containsAny(intakeChange, ["Нэлээд", "Ойр ойрхон"])) tags.add("cycle_intake_increase");
  if (containsAny(intakeChange, ["өвдөлт", "дотор муухайралт"])) tags.add("cycle_pain_nausea_decrease");
  if (modifiers.some(value => value !== "Аль нь ч биш" && value !== "Хариулахгүй")) tags.add("cycle_modifier_confidence_low");
  if (modifiers.includes("PCOS оноштой эсвэл сэжигтэй")) tags.add("pcos_known_or_suspected");
  if (modifiers.includes("Төрсний дараах эсвэл хөхүүл үе")) tags.add("postpartum_breastfeeding");
  if (modifiers.includes("Перименопауз байж магадгүй")) tags.add("perimenopause");
  if (modifiers.includes("Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг")) tags.add("hormonal_contraception");
  if (disruption === "Тийм") tags.add("restriction_exercise_cycle_disruption");
  if (asArray(answers["S1-F01"]).includes("Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог")) tags.add("cycle_linked_function");
  if (diaryCycleValues.some(value => containsAny(value, ["бага зэрэг", "тийм", "дунд", "их", "мөчлөг"]))) tags.add("daily_cycle_context");

  const restrictionSignals = [
    ...asArray(answers["S1-W04"]),
    answers["S1-S03"] || "",
    answers["MC-07"] || ""
  ].some(value => containsAny(value, ["мацаг", "орой хоол идэхгүй", "бага идэх", "хэт их дасгал", "нөхөх", "тийм"]));
  const glucoseOrBpConcern = [answers["S1-B02"], answers["S1-B03"], ...asArray(answers["S1-B04"])]
    .some(value => containsAny(value, ["санаа зовоосон", "бага сахар", "өндөр даралт", "тийм", "огцом", "хаваг", "маш их"]));
  const professionalFirst = (
    tags.has("restriction_exercise_cycle_disruption") && (tags.has("amenorrhea_3_months") || restrictionSignals)
  ) || (
    tags.has("pcos_known_or_suspected") && tags.has("irregular_cycle_professional_check") && glucoseOrBpConcern
  ) || (
    tags.has("postpartum_breastfeeding") && glucoseOrBpConcern
  );

  return {
    active: true,
    tags: Array.from(tags),
    confidenceLow: tags.has("cycle_modifier_confidence_low") || tags.has("cycle_phase_low_confidence"),
    premenstrual: tags.has("premenstrual_appetite_shift") || tags.has("cycle_sweet_craving") || tags.has("cycle_salty_fat_craving") || tags.has("cycle_hunger_increase"),
    professionalCheck: tags.has("irregular_cycle_professional_check") || tags.has("cycle_pain_nausea_decrease") || professionalFirst,
    professionalFirst
  };
}

function calculateMenstrualSafetyFlags() {
  const evidence = menstrualCycleEvidence();
  return evidence.professionalFirst ? ["MC:professional"] : [];
}

function addScore(scores, key, amount = 1) {
  scores[key] = (scores[key] || 0) + amount;
}

function calculateScores(includeDiary = true) {
  const scores = {};
  stageOneQuestions.forEach(question => {
    const value = state.stageAnswers[question.id];
    if (!question.scores || value === undefined || value === "") return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach(answer => {
      (question.scores[answer] || []).forEach(key => addScore(scores, key));
    });
  });

  if (includeDiary) {
    state.diaryEntries.forEach(entry => {
      const f = entry.food_function || [];
      if (entry.meal_rhythm?.includes("5+") || entry.meal_rhythm?.includes("5 цагаас дээш") || entry.meal_rhythm?.includes("зай хэтэрсэн")) addScore(scores, "hungerSafety", 1.5);
      if (entry.meal_rhythm?.includes("орой нөхсөн")) addScore(scores, "hungerSafety", 1.5);
      if (entry.unplanned_eating_count && entry.unplanned_eating_count !== "Үгүй") addScore(scores, "cue", 0.5);
      if (Number(entry.hunger_level) >= 7) addScore(scores, "hungerSafety", 1);
      if (f.includes("Амттай юм хүссэн") || f.includes("Амттай юм идмээр байсан") || f.includes("Өөрийгөө шагнамаар байсан") || f.includes("Өөрийгөө жаахан шагнамаар санагдсан") || f.includes("Өөрийгөө жаахан шагнамаар байсан") || f.includes("Уйдсан")) addScore(scores, "reward", 1.5);
      if (f.includes("Тайвширмаар байсан")) addScore(scores, "regulation", 1.5);
      if (f.includes("Хамгийн амар сонголт байсан") || f.includes("Хамгийн амар сонголт тэр байсан") || f.includes("Хамгийн амар нь тэр байсан")) addScore(scores, "executive", 1.5);
      if (f.includes("Хоол харагдаад/үнэртээд идмээр болсон") || f.includes("Харагдаад эсвэл үнэртээд идмээр болсон")) addScore(scores, "cue", 1.5);
      if (f.includes("Дараа өлсөхөөс санаа зовсон")) addScore(scores, "hungerSafety", 1.5);
      if (f.includes("Бие муудах/сахар унах вий гэж санаа зовсон") || f.includes("Бие эвгүйрхэх вий гэж санаа зовсон")) addScore(scores, "glucose", 1.5);
      if (["Стресс", "Уур", "Ууртай", "Гуниг", "Гунигтай", "Ганцаардал", "Ганцаардсан", "Санаа зовнил", "Санаа зовсон"].includes(entry.emotion)) addScore(scores, "regulation", 1);
      if (Number(entry.stress_score) >= 7) addScore(scores, "regulation", 0.75);
      if (Number(entry.energy_score) <= 3) addScore(scores, "executive", 0.75);
      if ((entry.sleep || []).some(v => ["4 цагаас бага", "4-6 цаг", "4–6 цаг", "Чанар муу", "Олон сэрсэн, чанар муу"].includes(v))) addScore(scores, "circadian", 1);
      if ((entry.body_signals || []).some(v => ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх"].includes(v))) addScore(scores, "physiological", 1);
      if ((entry.body_signals || []).some(v => ["Сахар унасан мэт", "Сахар унасан мэт санагдах"].includes(v))) addScore(scores, "glucose", 1);
      Object.entries(entry.pattern_probes || {}).forEach(([field, value]) => {
        const signal = Array.isArray(value) ? value.join(" ") : value;
        if (/Тийм|Тодорхой|Маш|Бага\/өндөр|санаа зовоосон/.test(signal)) {
          if (field.includes("reward")) addScore(scores, "reward", 1);
          if (field.includes("hunger") || field.includes("uncertain")) addScore(scores, "hungerSafety", 1);
          if (field.includes("regulation") || field.includes("emotion")) addScore(scores, "regulation", 1);
          if (field.includes("executive") || field.includes("default")) addScore(scores, "executive", 1);
          if (field.includes("collapse") || field.includes("tighten")) addScore(scores, "collapse", 1);
          if (field.includes("glucose") || field.includes("measured")) addScore(scores, "glucose", 1);
          if (field.includes("circadian")) addScore(scores, "circadian", 1);
          if (field.includes("cue")) addScore(scores, "cue", 1);
        }
      });
      (entry.confirmedSummaryObject?.extractedTags || []).forEach(tag => {
        if (tag === "reward_pull") addScore(scores, "reward", 1);
        if (tag === "food_as_regulation") addScore(scores, "regulation", 1);
        if (tag === "hunger_safety" || tag === "skipped_meal" || tag === "meal_gap_5h_plus") addScore(scores, "hungerSafety", 1);
        if (tag === "glucose_like_signal") addScore(scores, "glucose", 1);
        if (tag === "executive_load" || tag === "default_delivery") addScore(scores, "executive", 1);
        if (tag === "cue_trigger") addScore(scores, "cue", 1);
        if (tag === "control_collapse" || tag === "shame_guilt") addScore(scores, "collapse", 1);
      });
    });
  }

  return scores;
}

function rankedPatterns(includeDiary = true) {
  const evidence = calculateMechanismEvidence({
    ...state,
    diaryEntries: includeDiary ? state.diaryEntries : []
  });
  const orderedNames = [
    evidence.primaryMechanism,
    ...evidence.secondaryMechanisms,
    ...evidence.supportingMechanisms,
    ...Object.entries(evidence.mechanisms)
      .filter(([name, item]) => item.score > 0 && ![
        evidence.primaryMechanism,
        ...evidence.secondaryMechanisms,
        ...evidence.supportingMechanisms
      ].includes(name))
      .sort(([, a], [, b]) => b.score - a.score)
      .map(([name]) => name)
  ].filter(Boolean);
  const rankedFromEvidence = orderedNames
    .map(name => [name, evidence.mechanisms[name]])
    .map(([name, item]) => ({
      key: mechanismKeyForName(name),
      score: item.score,
      label: labelForEvidence(item.evidenceLabel),
      evidenceLabel: item.evidenceLabel,
      repeatedDays: item.repeatedDays,
      contradictions: item.contradictionSignals
    }))
    .filter(item => item.key);
  if (rankedFromEvidence.length) return rankedFromEvidence;

  const scores = calculateScores(includeDiary);
  return Object.entries(scores)
    .filter(([key]) => mechanisms[key])
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({
      key,
      score,
      label: score >= 5 ? "хүчтэй нийцэж байна" : score >= 3 ? "дунд зэрэг нийцэж байна" : "боломжит pattern"
    }));
}

function completeStageOne() {
  state.preliminary = rankedPatterns(false).slice(0, 4);
  state.view = state.packageType === "one-time" ? "report" : "preliminary";
  saveState();
  render({ scrollToTop: true });
}

function nextStageQuestion() {
  const questions = stageQuestions();
  if (state.stageIndex >= questions.length - 1) {
    completeStageOne();
    return;
  }
  state.stageIndex += 1;
  saveState();
  render({ scrollToTop: true });
}

function previousStageQuestion() {
  state.stageIndex = Math.max(0, state.stageIndex - 1);
  saveState();
  render({ scrollToTop: true });
}

function topbar(progress, label = "Жин хасалтын гүн зураглал") {
  return `
    <div class="topbar">
      <div class="topbar-inner">
        <div class="brand">${label}</div>
        <div class="progress" aria-label="progress"><div class="progress-bar" style="--progress:${progress}"></div></div>
      </div>
    </div>
  `;
}

function renderLanding() {
  return `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Жин хасалтыг гацаадаг давтамжийг харах үнэлгээ</p>
          <h1>Яагаад хичээсэн ч жин буурахгүй байна вэ?</h1>
          <p class="lead">Энэ тест таныг шүүх гэж биш. Ямар өдөр, ямар мэдрэмж, ямар ядаргаа, ямар орчин давхцахад хоолны сонголт өөрчлөгддөгийг хамт харах гэж байгаа юм.</p>
          <div class="hero-actions">
            <button class="button" onclick="setView('choice')">Миний зураглалыг эхлүүлэх</button>
            <button class="button secondary" onclick="setView('about')">Үнэлгээний ялгааг харах</button>
          </div>
        </div>
      </div>
    </section>
    <section class="screen">
      <div class="grid">
        <div class="panel stack">
          <h2>Ерөнхий зөвлөгөө биш, давтамжийн зураглал</h2>
          <p class="muted">Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр санагдсан хариултаа сонгоход хангалттай.</p>
          <ul>
            <li>“Та юу иддэг вэ?” биш — “яагаад тэр сонголт руу дахин дахин ордог вэ?” гэдгийг харна.</li>
            <li>Жин хасалтыг гацааж буй 2-3 давтагддаг хэв маягийг гаргана.</li>
            <li>Өмнөх аргууд яагаад удаан ажиллаагүй байж болохыг тайлбарлана.</li>
            <li>Танд тохиромжгүй байж болох аргуудыг анхааруулна.</li>
            <li>Эхний 14 хоногт турших бодит алхам өгнө.</li>
          </ul>
        </div>
        <div class="aside">
          <div class="mini-stat"><strong>10-15 мин</strong><span class="muted">Нэг удаагийн гүн зураглал</span></div>
          <div class="mini-stat"><strong>Орой бүр 3–5 минут</strong><span class="muted">7 хоногийн богино тэмдэглэл</span></div>
        </div>
      </div>
      ${renderSampleResultPreview()}
    </section>
  `;
}

function renderSampleResultPreview() {
  return `
    <div class="sample-preview">
      <div>
        <p class="eyebrow">Жишээ үр дүн</p>
        <h2>Тайлан ямар харагдах вэ?</h2>
        <p class="muted">Доорх нь бүрэн тайлан биш. Зөвхөн тайлан ямар өнгө аястай гардагийг харуулах богино жишээ.</p>
      </div>
      <div class="sample-grid">
        <div>
          <h3>Хамгийн тод харагдаж буй зүйл</h3>
          <p>Орой ядарсан үед хоол бодож, сонгож, бэлдэх тэнхээ үлдэхгүй байна.</p>
        </div>
        <div>
          <h3>Энэ юу гэсэн үг вэ?</h3>
          <p>Та юу хийхээ мэдэхгүйдээ биш. Харин орой тэнхээ багасах үед хамгийн амар сонголт л ялж байна.</p>
        </div>
        <div>
          <h3>Эхний зөөлөн алхам</h3>
          <p>Ядарсан өдөр хэрэглэх 2 бэлэн оройн хоолны сонголт, өдөр алгасахгүй нэг тогтмол хоол.</p>
        </div>
        <div>
          <h3>7 хоногоор нарийвчилбал</h3>
          <p>Энэ нь яг ямар өдөр, ямар нөхцөлд давтагддагийг богино тэмдэглэлээр тодруулна.</p>
        </div>
      </div>
    </div>
  `;
}

function renderAbout() {
  return `
    ${topbar(0)}
    <section class="screen">
      <div class="panel stack">
        <h2>Үнэлгээний хоёр зам</h2>
        <p class="muted">Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна.</p>
        <div class="two-col">
          <div class="card"><h3>Нэг удаагийн гүн зураглал</h3><p>10–15 минутанд хамгийн тод давтагддаг нөхцөл, нөлөөлж буй 1–2 шалтгаан, одоогоор болгоомжлох зүйл, эхний зөөлөн алхам гарна.</p></div>
          <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div>
        </div>
        <div class="card">
          <h3>Харьцуулалт</h3>
          <div class="two-col">
            <p><strong>Нэг удаагийн:</strong> тухайн мөчийн хариултад суурилсан эхний зураглал.</p>
            <p><strong>7 хоногийн:</strong> илүү их тураах төлөвлөгөө биш, бодит өдөр тутмын давтамжийг нарийвчлах богино ажиглалт.</p>
          </div>
        </div>
        ${renderSampleResultPreview()}
        <div class="actions">
          <button class="button" onclick="setView('choice')">Сонголтоо хийх</button>
          <button class="button ghost" onclick="setView('landing')">Буцах</button>
        </div>
      </div>
    </section>
  `;
}

function displayModuleName(moduleName) {
  const names = {
    "Warm start": "Эхлэх хэсэг",
    "Basic context": "Ерөнхий мэдээлэл",
    "Weight trajectory": "Жингийн өөрчлөлт",
    "Past attempts": "Өмнөх оролдлогууд",
    "Meal rhythm": "Хоолны хэмнэл",
    "Hunger & satiety": "Өлсөлт ба цадах мэдрэмж",
    "Hidden function": "Зан үйлийн үүрэг",
    "Voice checkpoint": "Тайлбар баталгаажуулах",
    "Reward / craving": "Таатай зүйл хүсэх мөч",
    "Emotion / regulation": "Мэдрэмж ба идэх хүсэл",
    "Hunger-safety": "Өлсөлтийн аюулгүй байдал",
    "Restriction response": "Хязгаарлалтын хариу",
    "Executive load": "Ядарсан үеийн сонголт",
    Environment: "Орчин",
    "Sleep / energy": "Нойр ба эрч хүч",
    "Body / medical": "Биеийн дохио",
    "Menstrual cycle": "Сарын тэмдгийн мөчлөг",
    Safety: "Аюулгүй байдал"
  };
  return names[moduleName] || moduleName;
}

function renderChoice() {
  return `
    ${topbar(0, "Үнэлгээний сонголт")}
    <section class="screen">
      <div class="panel stack choice-panel">
        <h2>Та ямар түвшний зураглал авах вэ?</h2>
        <p class="muted">Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт.</p>
        <div class="choice-grid">
          <div class="card stack choice-card">
            <p class="choice-kicker">Хурдан эхлэх</p>
            <h3>Нэг удаагийн гүн анализ</h3>
            <div class="price-stack">
              <p class="price promo"><span>Үндсэн үнэ</span> ${PRICING.oneTime}</p>
            </div>
            <p class="muted">10–15 минутанд жин бууруулах оролдлого яг ямар үед гацаад байгааг эхлээд харна.</p>
            <div class="pill-row"><span class="pill">10–15 минут</span><span class="pill">Эхний хэсгийг үнэгүй харах</span><span class="pill">Бүрэн эхний тайлан</span></div>
            <ul>
              <li>Хамгийн тод давтагддаг нөхцөл</li>
              <li>Давхар нөлөөлж буй 1–2 зүйл</li>
              <li>Тэр идэлт тухайн үед юуг намдааж эсвэл нөхөж байж болох</li>
              <li>Одоогоор зайлсхийх зүйлс</li>
              <li>Эхний зөөлөн алхам</li>
              <li>14 хоногийн эхний туршилт</li>
              <li>7 хоногоор нарийвчлах боломж</li>
            </ul>
            <p class="muted">Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна.</p>
            <button class="button choice-button" onclick="choosePackage('one-time')">${PRICING.oneTime} төлөөд тайлангаа нээх</button>
          </div>
          <div class="card stack choice-card choice-card-featured">
            <p class="choice-kicker">Илүү нарийвчилсан</p>
            <h3>7 хоногийн гүн анализ</h3>
            <div class="price-stack">
              <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p>
              <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p>
            </div>
            <p class="muted">Орой бүр 3–5 минутын богино тэмдэглэлээр таны идэх хүсэл бодит амьдрал дээр ямар үед давтагдаж байгааг харна.</p>
            <div class="pill-row"><span class="pill">Эхлэх асуулт</span><span class="pill">Орой бүр 3–5 минут</span><span class="pill">5 өдөр бөглөсөн ч тайлан гарна</span></div>
            <ul>
              <li>Эхлэх богино асуулт</li>
              <li>7 өдөр богино тэмдэглэл</li>
              <li>Идэх хүсэл эхэлдэг нөхцөл</li>
              <li>Эхний зураглал ба ажиглалтын харьцуулалт</li>
              <li>Идэх хүсэл яг ямар үүрэгтэй давтагдаж байгааг тодруулах</li>
              <li>Илүү тод 14 хоногийн туршилт</li>
            </ul>
            <p class="muted">Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p>
            <button class="button choice-button" onclick="choosePackage('seven-day')">${PRICING.sevenDay} төлөөд 7 хоногийн үнэлгээ эхлүүлэх</button>
          </div>
        </div>
        ${renderSampleResultPreview()}
      </div>
    </section>
  `;
}

function renderOneTimeStart() {
  const invite = state.coachInvite || refreshCoachInvite();
  const coachName = invite?.coach?.display_name || "Coach";
  return `
    ${topbar(0, "Нэг удаагийн гүн зураглал")}
    <section class="screen">
      <div class="panel stack">
        <h2>Энэ тест таныг шүүхгүй</h2>
        <p>Жин хасах гэж хичээх үед яг ямар өдөр, ямар мэдрэмж, ямар ядаргаа, ямар орчин давхцахад хоолны сонголт өөрчлөгддөгийг хамт харна.</p>
        <div class="card stack">
          <p>Зөв, буруу хариулт байхгүй.</p>
          <p class="muted">Та өөрийгөө сайн тайлбарлах гэж хичээх шаардлагагүй. Өөрт хамгийн ойр санагдсан хариултаа сонгоход хангалттай.</p>
          <p class="muted">Зарим асуулт таны өмнөх оролдлого, ядаргаа, өлсөлт, стресс, биеийн дохионы тухай асууна. Энэ нь таныг буруутгах гэсэн биш, давтагддаг нөхцөлийг харах гэсэн юм.</p>
        </div>
        <div class="pill-row">
          <span class="pill">10-15 минут</span>
          <span class="pill">Бичгээр богино тайлбар оруулж болно</span>
          <span class="pill">Зөв/буруу хариулт байхгүй</span>
          <span class="pill">Зарим асуултыг алгасаж болно</span>
        </div>
        ${invite ? `<div class="card stack coach-discount-card">
          <p class="choice-kicker">Coach-ийн урилга илэрлээ</p>
          <h3>${escapeHtml(coachName)} танд энэ үнэлгээг санал болгосон байна.</h3>
          <p>Та coach-ийн урилгаар хөнгөлөлттэй үнээр үнэлгээ хийлгэх боломжтой.</p>
          <div class="price-stack">
            <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.oneTime}</p>
            <p class="price promo"><span>Coach-ийн хөнгөлөлттэй үнэ</span> ${PRICING.coachOneTime}</p>
          </div>
          <p class="muted">Хэрэв та энэ хөнгөлөлтөөр үнэлгээ хийлгэвэл таны тайланг ${escapeHtml(coachName)} өөрийн dashboard-оос харах боломжтой.</p>
          <label class="checkbox-row">
            <input type="checkbox" ${state.coachDiscountConsent ? "checked" : ""} onchange="${state.coachDiscountConsent ? "declineCoachDiscount()" : "acceptCoachDiscount()"}">
            <span>Би хөнгөлөлттэй үнээр үнэлгээ хийлгэж, гарсан тайлангаа ${escapeHtml(coachName)}-д харагдахыг зөвшөөрч байна.</span>
          </label>
          <div class="actions">
            <button class="button" onclick="acceptCoachDiscount()">Хөнгөлөлттэй үнээр үргэлжлүүлэх</button>
            <button class="button ghost" onclick="declineCoachDiscount()">Хөнгөлөлт ашиглахгүй, стандарт үнээр үргэлжлүүлэх</button>
          </div>
        </div>` : ""}
        <div class="actions">
          <button class="button" onclick="beginAssessment('one-time')">${state.coachDiscountConsent ? "Coach-ийн хөнгөлөлттэй үнээр тест эхлүүлэх" : "Тест эхлүүлэх"}</button>
          <button class="button ghost" onclick="setView('choice')">Буцах</button>
        </div>
      </div>
    </section>
  `;
}

function renderLeadCapture() {
  const product = VALIDATION_PRODUCTS[state.leadProductKey] || VALIDATION_PRODUCTS["one-time"];
  const form = state.leadForm || initialState.leadForm;
  return `
    ${topbar(100, "Нээлтийн туршилтын бүртгэл")}
    <section class="screen">
      <div class="panel stack paywall-panel">
        <p class="choice-kicker">Эхний хэрэглэгчийн эрх</p>
        <h2>Нээлтийн туршилтын бүртгэл</h2>
        <p>Энэ багцыг нээлтийн эхний хэрэглэгчидтэй туршиж байна. Та авах сонирхолтой бол мэдээллээ үлдээгээрэй. Эрх нээгдэх үед бид мэдэгдэнэ.</p>
        <div class="card">
          <h3>${product.label} — ${product.priceLabel}</h3>
          <p class="muted">Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна.</p>
        </div>
        <label class="field-label">Нэр</label>
        <input class="input" value="${escapeAttr(form.name || "")}" oninput="updateLeadField('name', this.value)" placeholder="Таны нэр" />
        <label class="field-label">Утас эсвэл имэйл</label>
        <input class="input" value="${escapeAttr(form.contact || "")}" oninput="updateLeadField('contact', this.value)" placeholder="Утас эсвэл имэйл" />
        <label class="field-label">Та энэ үнээр авахад бэлэн үү?</label>
        <select class="input" onchange="updateLeadField('willingness', this.value)">
          ${WILLINGNESS_OPTIONS.map(option => `<option value="${escapeAttr(option)}" ${form.willingness === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
        <label class="field-label">Юу тодорхой болвол авах шийдвэр гаргах вэ?</label>
        <textarea class="input" rows="4" oninput="updateLeadField('comment', this.value)" placeholder="Жишээ: тайлангийн жишээ, төлбөрийн баталгаа, илүү дэлгэрэнгүй тайлбар...">${escapeHtml(form.comment || "")}</textarea>
        ${state.leadError ? `<p class="danger-copy">${escapeHtml(state.leadError)}</p>` : ""}
        <div class="actions">
          <button class="button" onclick="submitLeadCapture()">Ингээд бүртгүүлэх</button>
          <button class="button ghost" onclick="setView('${escapeAttr(state.leadSourceScreen || "choice")}')">Буцах</button>
          ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('${escapeAttr(state.leadProductKey || "one-time")}')">Дотоод туршилтаар нээх</button>`)}
        </div>
      </div>
    </section>
  `;
}

function renderLeadThankYou() {
  const product = VALIDATION_PRODUCTS[state.leadProductKey] || VALIDATION_PRODUCTS["one-time"];
  return `
    ${topbar(100, "Бүртгэл хүлээн авлаа")}
    <section class="screen">
      <div class="panel stack">
        <p class="choice-kicker">Эхний хэрэглэгчийн эрх</p>
        <h2>Баярлалаа</h2>
        <p>Баярлалаа. Таны сонирхлыг бүртгэлээ. Нээлтийн эхний хэрэглэгчийн эрх бэлэн болох үед бид холбогдоно.</p>
        <div class="card">
          <h3>${product.label}</h3>
          <p>${product.priceLabel}</p>
        </div>
        <div class="actions">
          <button class="button" onclick="setView('choice')">Сонголт руу буцах</button>
          ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('${escapeAttr(state.leadProductKey || "one-time")}')">Дотоод туршилтаар нээх</button>`)}
        </div>
      </div>
    </section>
  `;
}

function renderValidationSummary() {
  const summary = mockBackend.summarizeLeadIntents();
  const productRows = Object.entries(summary.byProduct).map(([productType, item]) => `
    <tr><td>${escapeHtml(publicValidationProductLabel(productType))}</td><td>${item.count}</td><td>${item.averagePriceMnt.toLocaleString("en-US")}₮</td></tr>
  `).join("");
  const willingnessRows = Object.entries(summary.willingness).map(([label, count]) => `
    <tr><td>${escapeHtml(label)}</td><td>${count}</td></tr>
  `).join("");
  return `
    ${topbar(100, "Сонирхлын нэгтгэл")}
    <section class="screen">
      <div class="panel stack">
        <p class="choice-kicker">Дотоод туршилтын нэгтгэл</p>
        <h2>Сонирхлын нэгтгэл</h2>
        <div class="two-col">
          <div class="mini-stat"><strong>${summary.totalLeads}</strong><span>Бүртгэл</span></div>
          <div class="mini-stat"><strong>${summary.paidCtaClicks}</strong><span>Төлбөртэй товч дарсан</span></div>
          <div class="mini-stat"><strong>${summary.demoUnlocks}</strong><span>Дотоод нээлт</span></div>
          <div class="mini-stat"><strong>${summary.leadSubmits}</strong><span>Бүртгэл илгээсэн</span></div>
        </div>
        <div class="report-section">
          <h3>Багцаар</h3>
          <table><tbody>${productRows || `<tr><td class="muted">Одоогоор бүртгэл алга</td></tr>`}</tbody></table>
        </div>
        <div class="report-section">
          <h3>Авахад бэлэн эсэх</h3>
          <table><tbody>${willingnessRows || `<tr><td class="muted">Одоогоор хариулт алга</td></tr>`}</tbody></table>
        </div>
        <div class="report-section">
          <h3>Сэтгэгдэл</h3>
          ${summary.comments.length ? `<ul>${summary.comments.map(item => `<li><strong>${escapeHtml(publicValidationProductLabel(item.productType))}:</strong> ${escapeHtml(item.comment)}</li>`).join("")}</ul>` : `<p class="muted">Одоогоор сэтгэгдэл алга.</p>`}
        </div>
        <div class="actions">
          <button class="button ghost" onclick="setView('choice')">Сонголт руу буцах</button>
        </div>
      </div>
    </section>
  `;
}

function renderSevenDayPaywall() {
  return `
    ${topbar(0, "7 хоногийн гүн зураглал")}
    <section class="screen">
      <div class="panel stack paywall-panel">
        <p class="choice-kicker">Нээлтийн эрх</p>
        <h2>7 хоногийн гүн анализаа нээх</h2>
        <div class="price-stack">
          <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p>
          <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p>
        </div>
        <p>7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна.</p>
        <ul>
          <li>Эхлэх богино асуулт</li>
          <li>7 өдөр богино тэмдэглэл</li>
          <li>Орой бүр 3–5 минут</li>
          <li>5 өдөр бөглөсөн ч тайлан гарна</li>
          <li>Калори тоолохгүй, давтагддаг мөчүүдийг ажиглана</li>
        </ul>
        <div class="actions">
          <button class="button secondary" onclick="startLeadCapture('seven-day')">${PRICING.sevenDay} төлөөд эхлүүлэх</button>
          ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('seven-day')">Дотоод туршилтаар нээх</button>`)}
          <button class="button ghost" onclick="setView('choice')">Буцах</button>
        </div>
        <p class="muted">Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна.</p>
      </div>
    </section>
  `;
}

function renderSevenDayStart() {
  if (!hasSevenDayAccess()) return renderSevenDayPaywall();
  return `
    ${topbar(0, "7 хоногийн гүн зураглал")}
    <section class="screen">
      <div class="panel stack">
        <h2>7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна</h2>
        <p>Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна.</p>
        <div class="pill-row">
          <span class="pill">Эхлэл: 8-10 минут</span>
          <span class="pill">Орой бүр: 3–5 минут</span>
          <span class="pill">5/7 өдөр бөглөсөн ч тайлан гарна</span>
          <span class="pill">Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш</span>
          <span class="pill">Калори тоолохгүй</span>
          <span class="pill">Зөвхөн давтагддаг мөчүүдийг ажиглана</span>
        </div>
        <div class="actions">
          <button class="button" onclick="beginAssessment('seven-day')">7 хоногийн үнэлгээ эхлүүлэх</button>
          <button class="button ghost" onclick="setView('choice')">Буцах</button>
        </div>
      </div>
    </section>
  `;
}

function renderInput(question, value, setterName) {
  if (question.type === "info") {
    return `
      <div class="card stack">
        <p>Зөв, буруу хариулт байхгүй.</p>
        <p class="muted">Та өөрийгөө сайн тайлбарлах гэж хичээх шаардлагагүй. Өөрт хамгийн ойр санагдсан хариултаа сонгоход хангалттай.</p>
        <p class="muted">Зарим асуулт таны өмнөх оролдлого, ядаргаа, өлсөлт, стресс, биеийн дохионы тухай асууна. Энэ нь таныг буруутгах гэсэн биш, давтагддаг нөхцөлийг харах гэсэн юм.</p>
      </div>
    `;
  }
  if (question.type === "number") {
    return `<label class="field"><span class="muted">Тоогоор оруулна уу</span><input id="input-${question.id}" type="number" value="${escapeAttr(value)}" oninput="setAnswerDraft('${question.id}', this.value)" /></label>`;
  }
  if (question.type === "text") {
    return `<label class="field"><span class="muted">${question.voice ? "Богино тайлбар" : "Хариулт"}</span><textarea id="input-${question.id}" oninput="setAnswerDraft('${question.id}', this.value)">${escapeHtml(value)}</textarea></label><p class="muted">Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно.</p>${question.voice ? renderStageVoiceConfirmation(question, value) : ""}`;
  }
  if (question.type === "scale") {
    return `<div class="scale">${Array.from({ length: 11 }, (_, i) => `<button class="option ${String(value) === String(i) ? "selected" : ""}" onclick="${setterName}('${question.id}', '${i}')">${i}</button>`).join("")}</div>`;
  }
  if (question.type === "single") {
    return `<div class="option-list">${question.options.map(option => `
      <button class="option ${value === option ? "selected" : ""}" onclick="${setterName}('${question.id}', '${escapeJs(option)}')">
        <input type="radio" ${value === option ? "checked" : ""} tabindex="-1" />
        <span>${option}</span>
      </button>`).join("")}</div>`;
  }
  if (question.type === "multi") {
    const values = Array.isArray(value) ? value : [];
    return `<div class="option-list">${question.options.map(option => `
      <button class="option ${values.includes(option) ? "selected" : ""}" onclick="toggleMulti('${question.id}', '${escapeJs(option)}', ${question.max || 99})">
        <input type="checkbox" ${values.includes(option) ? "checked" : ""} tabindex="-1" />
        <span>${option}</span>
      </button>`).join("")}</div>`;
  }
  return "";
}

function updateQuestionValue(id, value) {
  const question = stageOneQuestions.find(item => item.id === id);
  setAnswer(question, value);
}

function renderStageVoiceConfirmation(question, rawText) {
  const existing = state.stageVoiceSummaries[question.id];
  const ui = state.stageSummaryUi[question.id] || {};
  const text = String(rawText || "").trim();
  if (!existing && text.length < 12) {
    return "";
  }
  const bullets = existing?.aiSummaryBullets || generateStageSummaryBullets(rawText, state.stageAnswers);
  if (!existing && !bullets.length) {
    return `
      <div class="card stack">
        <h3>Тайлбар хадгалагдлаа</h3>
        <p class="muted">Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно.</p>
      </div>
    `;
  }
  return `
    <div class="card stack">
      <h3>Тайлбар хадгалагдлаа</h3>
      <p class="muted">Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно.</p>
      ${bullets.length ? `<ul>${bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
      ${existing?.userConfirmed ? `<p class="pill">Баталгаажсан</p>` : ""}
      ${ui.mode === "edit" || ui.mode === "add" ? `<label class="field"><span class="muted">${ui.mode === "edit" ? "Зассан ойлголтоо мөр мөрөөр бичнэ үү" : "Нэмэх нэг зүйлээ бичнэ үү"}</span><textarea id="input-${question.id}-${ui.mode}" oninput="setStageSummaryText('${question.id}', this.value)">${escapeHtml(ui.text || "")}</textarea></label>` : ""}
      <div class="actions">
        <button class="button secondary" onclick="confirmStageVoiceSummary('${question.id}', 'confirm')">Үргэлжлүүлэх</button>
        <button class="button ghost" onclick="setStageSummaryMode('${question.id}', 'edit')">Засах</button>
        <button class="button ghost" onclick="setStageSummaryMode('${question.id}', 'add')">Нэмэх зүйл байна</button>
        ${ui.mode === "edit" || ui.mode === "add" ? `<button class="button" onclick="confirmStageVoiceSummary('${question.id}', '${ui.mode}')">Баталгаажуулах</button>` : ""}
      </div>
    </div>
  `;
}

function setStageSummaryMode(id, mode) {
  state.stageSummaryUi[id] = { mode, text: "" };
  saveState();
  render();
}

function setStageSummaryText(id, text) {
  state.stageSummaryUi[id] = { ...(state.stageSummaryUi[id] || {}), text };
  saveState();
}

function confirmStageVoiceSummary(id, mode) {
  const rawText = state.stageAnswers[id] || "";
  const ui = state.stageSummaryUi[id] || {};
  const aiSummaryBullets = generateStageSummaryBullets(rawText, state.stageAnswers);
  state.stageVoiceSummaries[id] = createConfirmedSummaryObject({
    kind: "stage",
    id,
    rawText,
    structured: state.stageAnswers,
    aiSummaryBullets,
    mode,
    editText: ui.text,
    addText: ui.text
  });
  state.safetyFlags = calculateSafetyFlags();
  saveState();
  render({ scrollToTop: true });
}

function toggleMulti(id, option, max) {
  const question = stageOneQuestions.find(item => item.id === id) || getDiaryQuestions().find(item => item.id === id);
  if (stageOneQuestions.includes(question)) {
    const current = getValue(question);
    let next = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
    if (next.length > max) next = next.slice(1);
    setAnswer(question, next);
    return;
  }
  const current = state.diaryDraft[question.field] || [];
  let next = current.includes(option) ? current.filter(item => item !== option) : [...current, option];
  if (next.length > max) next = next.slice(1);
  state.diaryDraft[question.field] = next;
  saveState();
  render();
}

function renderStageOne() {
  const questions = stageQuestions();
  if (state.stageIndex >= questions.length) state.stageIndex = Math.max(0, questions.length - 1);
  const question = currentQuestion();
  const progress = Math.round((state.stageIndex / Math.max(1, questions.length - 1)) * 100);
  const patterns = rankedPatterns(false).slice(0, 3);
  const backButton = state.stageIndex > 0
    ? `<div class="question-top-actions"><button class="button secondary compact" onclick="previousStageQuestion()">Буцах</button></div>`
    : "";
  return `
    ${topbar(progress, `Үе 1 · ${displayModuleName(question.module)}`)}
    <section class="screen">
      <div class="grid">
        <div class="panel">
          ${backButton}
          <p class="muted">Асуулт ${state.stageIndex + 1}/${questions.length}</p>
          ${question.intro ? `<p class="muted">${escapeHtml(question.intro)}</p>` : ""}
          <h2 class="question-text">${question.text}</h2>
          ${renderInput(question, getValue(question), "updateQuestionValue")}
          <div class="actions">
            <button class="button" onclick="nextStageQuestion()">${state.stageIndex === questions.length - 1 ? (state.packageType === "one-time" ? "Тайлан харах" : "Тэмдэглэлийн чиглэл харах") : "Үргэлжлүүлэх"}</button>
          </div>
        </div>
        <aside class="aside">
          <div class="card">
            <h3>Одоогийн дохио</h3>
            <div class="pill-row">${patterns.length ? patterns.map(item => `<span class="pill">${publicMechanismShort(item.key)}</span>`).join("") : `<span class="muted">Хариулт нэмэгдэхээр давтамж харагдана.</span>`}</div>
          </div>
          <div class="card">
            <h3>Хязгаар</h3>
            <p class="muted">Энэ үнэлгээ онош тавихгүй. Аюулгүй байдлын дохио гарвал тайлангийн дараалал автоматаар өөрчлөгдөнө.</p>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderPreliminary() {
  const patterns = state.preliminary.length ? state.preliminary : rankedPatterns(false).slice(0, 4);
  const safety = reportMode();
  return `
    ${topbar(100, "Эхний давтамжийн зураглал")}
    <section class="screen">
      <div class="panel stack">
        <h2>Таны эхний зураглал бэлэн боллоо</h2>
        ${safety.mode === "urgent" ? `<p class="danger-copy">Одоо жингийн тухай биш, таны аюулгүй байдал хамгийн чухал. Яаралтай тусламж эсвэл ойрын итгэлтэй хүнтэй шууд холбогдоорой.</p>` : ""}
        <div class="stack">
          ${patterns.map((item, index) => `<div class="card">
            <h3>${index + 1}. ${publicHtml(publicMechanismName(item.key))}</h3>
            <p class="muted">${publicHtml(`${item.label}. ${mechanisms[item.key].observation}`)}</p>
          </div>`).join("") || `<p class="muted">Одоогоор зураглал гаргахад мэдээлэл бага байна.</p>`}
        </div>
        <div class="card">
          <h3>Дараагийн 7 хоногт бид шалгах зүйл</h3>
          <ul>${patterns.slice(0, 3).map(item => `<li>${publicHtml(mechanisms[item.key].observation)}</li>`).join("")}</ul>
        </div>
        <div class="actions">
        ${safety.mode === "urgent" ? `<button class="button danger" onclick="setView('report')">Яаралтай зөвлөмж харах</button>` : `<button class="button" onclick="setView('${hasSevenDayAccess() ? "unlock" : "sevenDayStart"}')">7 хоногийн тэмдэглэл нээх</button>`}
          <button class="button ghost" onclick="setView('stage1')">Засах</button>
        </div>
      </div>
    </section>
  `;
}

function renderUnlock() {
  if (!hasSevenDayAccess()) return renderSevenDayPaywall();
  return `
    ${topbar(100, "Тэмдэглэл нээх")}
    <section class="screen">
      <div class="panel stack">
        <h2>Орой бүр 3–5 минут</h2>
        <p class="muted">Бид нэг өдрийг “сайн” эсвэл “муу” гэж дүгнэхгүй. Зүгээр л ямар нөхцөл давтагдахад идэх сонголт өөрчлөгдөж байгааг ажиглана.</p>
        <div class="two-col">
          <div class="mini-stat"><strong>7/7</strong><span>Бүрэн тайлан</span></div>
          <div class="mini-stat"><strong>5-6/7</strong><span>Ашиглахад сайн тайлан</span></div>
          <div class="mini-stat"><strong>4/7</strong><span>Хязгаартай тайлан</span></div>
          <div class="mini-stat"><strong>2-3/7</strong><span>Эхний зураглал</span></div>
        </div>
        <div class="card">
          <h3>Орой хэдэн цагт сануулах вэ?</h3>
          <div class="pill-row">
            <span class="pill">20:00</span>
            <span class="pill">21:00</span>
            <span class="pill">22:00</span>
            <span class="pill warn">Өөр цаг</span>
            <span class="pill warn">Сануулга хэрэггүй</span>
          </div>
          <p class="muted">Сануулгын цагийг одоогоор хадгалахгүй. Та орой өөрт тохирох цагтаа тэмдэглэлээ нээж бөглөж болно.</p>
        </div>
        <div class="actions">
          <button class="button" onclick="startDiary()">1 дэх өдрөө эхлүүлэх</button>
          <button class="button secondary" onclick="setView('report')">Одоогийн мэдээллээр тайлан харах</button>
        </div>
      </div>
    </section>
  `;
}

function startDiary() {
  state.view = "diary";
  state.diaryDay = Math.min(7, Math.max(1, state.diaryEntries.length + 1));
  state.diaryQuestionIndex = 0;
  state.diaryDraft = {};
  saveState();
  render({ scrollToTop: true });
}

function getDiaryQuestions() {
  const cycleQuestions = getDailyMenstrualQuestions();
  if (state.diaryDraft.unplanned_eating_count === "Үгүй") {
    return [
      dailyCore[0],
      dailyCore[1],
      dailyCore[6],
      dailyCore[7],
      dailyCore[8],
      dailyCore[11],
      dailyCore[12],
      ...cycleQuestions,
      dailyCore[14]
    ];
  }
  const topKeys = (state.preliminary.length ? state.preliminary : rankedPatterns(false)).slice(0, 3).map(item => item.key);
  const probes = topKeys.flatMap(key => probeBank[key] || []).slice(0, 4);
  return [...dailyCore.slice(0, 12), ...cycleQuestions, ...probes, dailyCore[13], dailyCore[14]];
}

function getDailyMenstrualQuestions() {
  if (!hasMenstrualCycleContext()) return [];
  const questions = [dailyMenstrual[0], dailyMenstrual[1]];
  if (state.diaryDraft.cycle_today_link && state.diaryDraft.cycle_today_link !== "Үгүй") {
    questions.push(dailyMenstrual[2]);
  }
  return questions;
}

function setDiaryValue(id, value) {
  const question = getDiaryQuestions().find(item => item.id === id);
  state.diaryDraft[question.field] = value;
  saveState();
  render();
}

function setDiaryDraftValue(id, value) {
  const question = getDiaryQuestions().find(item => item.id === id);
  state.diaryDraft[question.field] = value;
  saveState();
}

function nextDiaryQuestion() {
  const questions = getDiaryQuestions();
  if (state.diaryQuestionIndex >= questions.length - 1) {
    saveDiaryEntry();
    return;
  }
  state.diaryQuestionIndex += 1;
  saveState();
  render({ scrollToTop: true });
}

function previousDiaryQuestion() {
  state.diaryQuestionIndex = Math.max(0, state.diaryQuestionIndex - 1);
  saveState();
  render({ scrollToTop: true });
}

function saveDiaryEntry() {
  const entry = {
    diary_id: `diary-${Date.now()}`,
    day_number: state.diaryDay,
    date: new Date().toISOString().slice(0, 10),
    ...state.diaryDraft,
    pattern_probes: {}
  };
  getDiaryQuestions().forEach(question => {
    if (question.id.startsWith("D-P")) {
      entry.pattern_probes[question.field] = state.diaryDraft[question.field];
      delete entry[question.field];
    }
  });
  state.lastInsight = dailyMicroInsight(entry);
  state.diaryEntries = state.diaryEntries.filter(item => item.day_number !== state.diaryDay).concat(entry).sort((a, b) => a.day_number - b.day_number);
  state.safetyFlags = calculateSafetyFlags();
  state.diaryDraft = {};
  state.diaryQuestionIndex = 0;
  state.diaryDay = Math.min(7, state.diaryEntries.length + 1);
  state.view = state.diaryEntries.length >= 5 ? "reportReady" : "diaryHome";
  saveState();
  render({ scrollToTop: true });
}

function reportReadiness(entries = state.diaryEntries) {
  const count = entries.length;
  if (count <= 1) {
    return {
      key: "insufficient",
      count,
      canGenerateFullReport: false,
      canShowExperiment: false,
      title: "Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна",
      copy: "0-1 өдөр нь таны давтамжийг дүгнэхэд хангалтгүй. Тэмдэглэлээ үргэлжлүүлээд дор хаяж 2-3 өдөр хүрвэл эхний зураглал харагдаж эхэлнэ. 5 өдөр бөглөсөн ч бүрэн тайлан гарна."
    };
  }
  if (count <= 3) {
    return {
      key: "limited",
      count,
      canGenerateFullReport: false,
      canShowExperiment: false,
      title: "Хязгаартай эхний зураглал",
      copy: "2-3 өдрийн мэдээлэл дээр зарим дохио харагдаж болно. Гэхдээ энэ нь бүрэн тайлан биш, эхний reflection хэвээр байна."
    };
  }
  if (count === 4) {
    return {
      key: "usable",
      count,
      canGenerateFullReport: false,
      canShowExperiment: false,
      title: "Ашиглаж болох ч хязгаартай зураглал",
      copy: "4 өдрийн мэдээлэл давтамж харахад ашиглаж болох түвшинд хүрсэн. Дахиад 1 өдөр бөглөвөл бүрэн тайлан гаргах босгонд хүрнэ."
    };
  }
  return {
    key: count >= 6 ? "complete" : "strong",
    count,
    canGenerateFullReport: true,
    canShowExperiment: true,
    title: "Бүрэн тайлан гаргах боломжтой",
    copy: count >= 6 ? "Таны мэдээлэл давтамж харахад сайн хангалттай байна." : "5 өдөр хүрсэн тул бүрэн тайлан гаргах боломжтой боллоо."
  };
}

function progressCopy() {
  const count = state.diaryEntries.length;
  if (count >= 7) return "7 хоногийн ажиглалт дууслаа. Таны бүрэн зураглал бэлэн болж байна.";
  if (count >= 5) return "Бүрэн тайлан гаргах боломжтой боллоо. Хүсвэл үргэлжлүүлээд 7/7 болгож нарийвчилж болно.";
  if (count >= 4) return "Таны мэдээлэл тайлан гаргахад ашиглаж болох түвшинд хүрлээ. Дахиад 1 өдөр бөглөвөл илүү сайн болно.";
  if (count >= 2) return "Эхний давтамжууд харагдаж эхэлж байна. 5 өдөр хүрвэл тайлан гаргахад хангалттай мэдээлэлтэй болно.";
  return "Өчигдөр бөглөж амжаагүй байсан ч зүгээр. Өнөөдрөөс үргэлжлүүлье.";
}

function dailyMicroInsight(entry) {
  if (entry.unplanned_eating_count === "Үгүй") {
    return "Өнөөдөр төлөвлөөгүй идэлтгүй өдөр байна. Ямар нөхцөл тусалсныг тэмдэглэсэн нь эцсийн тайланд чухал мэдээлэл болно.";
  }
  if (Number(entry.hunger_level) >= 7 && Number(entry.energy_score) <= 3) {
    return "Өнөөдөр төлөвлөөгүй идэлт өлсөлт өндөр + оройн эрч хүчний уналттай давхцсан байна. Энэ давтамж давтагдах эсэхийг үргэлжлүүлж харъя.";
  }
  if ((entry.food_function || []).includes("Тайвширмаар байсан")) {
    return "Өнөөдөр идэх хүсэл “тайвшрах” үүрэгтэй байсан гэж тэмдэглэгдлээ. Энэ мөч хэдэн өдөр давтагдахыг харъя.";
  }
  if ((entry.food_function || []).some(item => item.includes("шагна") || item.includes("Амттай"))) {
    return "Өнөөдөр таатай мэдрэмж авах хүсэл тэмдэглэгдлээ. Энэ нь өлсөлт, эрч хүч, орчны дохиотой хэр давхцаж байгааг үргэлжлүүлж харъя.";
  }
  return "Өнөөдрийн тэмдэглэл хадгалагдлаа. Энэ бол эцсийн дүгнэлт биш, давталт харах нэг ажиглалт.";
}

function renderDiaryHome() {
  const readiness = reportReadiness();
  return `
    ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "7 хоногийн тэмдэглэл")}
    <section class="screen">
      <div class="panel stack">
        <h2>Тэмдэглэлийн явц</h2>
        <p class="muted">${progressCopy()}</p>
        ${state.lastInsight ? `<div class="card"><h3>Өдрийн богино дохио</h3><p>${state.lastInsight}</p></div>` : ""}
        <div class="two-col">
          <div class="mini-stat"><strong>${state.diaryEntries.length}/7</strong><span>Өдөр бөглөсөн</span></div>
          <div class="mini-stat"><strong>${dataQuality().label}</strong><span>Мэдээллийн чанар</span></div>
        </div>
        <div class="actions">
          <button class="button" onclick="startDiary()" ${state.diaryEntries.length >= 7 ? "disabled" : ""}>Дараагийн өдөр бөглөх</button>
          <button class="button secondary" onclick="setView('${readiness.canGenerateFullReport ? "reportReady" : "report"}')">${readiness.canGenerateFullReport ? "Тайлан харах" : "Одоогийн зураглал харах"}</button>
        </div>
      </div>
    </section>
  `;
}

function renderReportReady() {
  return `
    ${topbar(100, "Бүрэн тайлан")}
    <section class="screen">
      <div class="panel stack">
        <h2>Таны 7 хоногийн зураглал бэлэн боллоо</h2>
        <p>Бид эхний асуултаар гарсан давтамжуудыг 7 хоногийн тэмдэглэлтэй харьцуулж, аль нь бодит амьдрал дээр давтагдсан, аль нь сул байсан, аль нь таны тойргийг үргэлжлүүлж байгааг нэгтгэлээ.</p>
        <div class="actions">
          <button class="button" onclick="setView('report')">Миний бүрэн тайланг харах</button>
          <button class="button ghost" onclick="setView('diaryHome')">Тэмдэглэлийн явц руу буцах</button>
        </div>
      </div>
    </section>
  `;
}

function renderDiary() {
  const questions = getDiaryQuestions();
  const question = questions[state.diaryQuestionIndex];
  const progress = Math.round(((state.diaryEntries.length + state.diaryQuestionIndex / questions.length) / 7) * 100);
  const backButton = state.diaryQuestionIndex > 0
    ? `<div class="question-top-actions"><button class="button secondary compact" onclick="previousDiaryQuestion()">Буцах</button></div>`
    : "";
  return `
    ${topbar(progress, `Тэмдэглэлийн ${state.diaryDay} дэх өдөр`)}
    <section class="screen">
      <div class="grid">
        <div class="panel">
          ${backButton}
          <p class="muted">Асуулт ${state.diaryQuestionIndex + 1}/${questions.length}</p>
          <h2 class="question-text">${question.text}</h2>
          ${renderDiaryInput(question)}
          <div class="actions">
            <button class="button" onclick="nextDiaryQuestion()">${state.diaryQuestionIndex === questions.length - 1 ? "Өдрийг хадгалах" : "Үргэлжлүүлэх"}</button>
          </div>
        </div>
        <aside class="aside">
          <div class="card">
            <h3>Өнөөдрийн чиглэл</h3>
            <div class="pill-row">${(state.preliminary || []).slice(0, 3).map(item => `<span class="pill">${publicMechanismShort(item.key)}</span>`).join("")}</div>
          </div>
          <div class="card"><p class="muted">Нэмэлт тайлбарыг одоогоор бичгээр хадгална.</p></div>
        </aside>
      </div>
    </section>
  `;
}

function renderDiaryInput(question) {
  const value = state.diaryDraft[question.field] ?? (question.type === "multi" ? [] : "");
  if (question.id === "D-SUM01") {
    return renderDailySummaryConfirmation(question);
  }
  if (question.type === "text") {
    return `<label class="field"><span class="muted">1-2 өгүүлбэр хангалттай</span><textarea id="input-${question.id}" oninput="setDiaryDraftValue('${question.id}', this.value)">${escapeHtml(value)}</textarea></label><p class="muted">Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно.</p>`;
  }
  if (question.type === "scale") {
    return `<div class="scale">${Array.from({ length: 11 }, (_, i) => `<button class="option ${String(value) === String(i) ? "selected" : ""}" onclick="setDiaryValue('${question.id}', '${i}')">${i}</button>`).join("")}</div>`;
  }
  if (question.type === "single") {
    return `<div class="option-list">${question.options.map(option => `
      <button class="option ${value === option ? "selected" : ""}" onclick="setDiaryValue('${question.id}', '${escapeJs(option)}')">
        <input type="radio" ${value === option ? "checked" : ""} tabindex="-1" />
        <span>${option}</span>
      </button>`).join("")}</div>`;
  }
  if (question.type === "multi") {
    const values = Array.isArray(value) ? value : [];
    return `<div class="option-list">${question.options.map(option => `
      <button class="option ${values.includes(option) ? "selected" : ""}" onclick="toggleMulti('${question.id}', '${escapeJs(option)}', ${question.max || 99})">
        <input type="checkbox" ${values.includes(option) ? "checked" : ""} tabindex="-1" />
        <span>${option}</span>
      </button>`).join("")}</div>`;
  }
  return "";
}

function renderDailySummaryConfirmation(question) {
  const existing = state.diaryDraft.confirmedSummaryObject;
  const ui = state.diarySummaryUi || {};
  const reflection = String(state.diaryDraft.raw_reflection || "").trim();
  if (!existing && reflection.length < 12) {
    return `
      <div class="card stack">
        <h3>Тайлбар хадгалагдлаа</h3>
        <p class="muted">Өнөөдрийн сонгосон хариултууд хадгалагдсан. Бичмээр зүйл байхгүй бол үргэлжлүүлж болно.</p>
        <div class="actions">
          <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button>
          <button class="button ghost" onclick="previousDiaryQuestion()">Буцах</button>
        </div>
      </div>
    `;
  }
  const bullets = existing?.aiSummaryBullets || generateDailySummaryBullets(state.diaryDraft);
  return `
    <div class="card stack">
      <h3>Тайлбар хадгалагдлаа</h3>
      <p class="muted">Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно.</p>
      ${bullets.length ? `<ul>${bullets.map(bullet => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>` : ""}
      ${existing?.userConfirmed ? `<p class="pill">Баталгаажсан</p>` : ""}
      ${ui.mode === "edit" || ui.mode === "add" ? `<label class="field"><span class="muted">${ui.mode === "edit" ? "Зассан ойлголтоо мөр мөрөөр бичнэ үү" : "Нэмэх нэг зүйлээ бичнэ үү"}</span><textarea id="input-D-SUM01-${ui.mode}" oninput="setDailySummaryText(this.value)">${escapeHtml(ui.text || "")}</textarea></label>` : ""}
      <div class="actions">
        <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button>
        <button class="button ghost" onclick="setDailySummaryMode('edit')">Засах</button>
        <button class="button ghost" onclick="previousDiaryQuestion()">Буцах</button>
        <button class="button ghost" onclick="setDailySummaryMode('add')">Нэмэх зүйл байна</button>
        ${ui.mode === "edit" || ui.mode === "add" ? `<button class="button" onclick="confirmDailySummary('${ui.mode}')">Баталгаажуулах</button>` : ""}
      </div>
    </div>
  `;
}

function setDailySummaryMode(mode) {
  state.diarySummaryUi = { mode, text: "" };
  saveState();
  render();
}

function setDailySummaryText(text) {
  state.diarySummaryUi = { ...(state.diarySummaryUi || {}), text };
  saveState();
}

function confirmDailySummary(mode) {
  const ui = state.diarySummaryUi || {};
  const aiSummaryBullets = generateDailySummaryBullets(state.diaryDraft);
  state.diaryDraft.confirmedSummaryObject = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: state.diaryDay,
    rawText: state.diaryDraft.raw_reflection || "",
    structured: state.diaryDraft,
    aiSummaryBullets,
    mode,
    editText: ui.text,
    addText: ui.text
  });
  state.diaryDraft.summary_confirmation = mode === "edit" ? "Засах" : mode === "add" ? "Нэмэх зүйл байна" : "Тийм, зөв";
  state.diarySummaryUi = {};
  saveState();
  render({ scrollToTop: true });
}

function dataQuality() {
  const readiness = reportReadiness();
  if (readiness.key === "complete" || readiness.key === "strong") return { key: readiness.key, label: readiness.key === "complete" ? "Бүрэн" : "Ашиглахад сайн", copy: readiness.copy };
  if (readiness.key === "usable") return { key: "usable", label: "Хязгаартай", copy: readiness.copy };
  if (readiness.key === "limited") return { key: "limited", label: "Эхний", copy: readiness.copy };
  return { key: "insufficient", label: "Дутуу", copy: readiness.copy };
}

function reportMode() {
  const flags = calculateSafetyFlags().map(flag => flag.split(":")[1]);
  if (flags.includes("urgent")) return { mode: "urgent", title: "Яаралтай аюулгүй байдлын зөвлөмж" };
  if (flags.includes("professional")) return { mode: "professional", title: "Эхлээд мэргэжлийн хүнтэй ярилцах" };
  const scores = calculateScores(true);
  if ((scores.medical || 0) >= 2 || (scores.glucose || 0) >= 4 || (scores.physiological || 0) >= 4) return { mode: "check", title: "Давтамж тодорхой — нэг дохиог шалгуулахад илүүдэхгүй" };
  return { mode: "deep", title: "Гүн зураглалын тайлан" };
}

function repeatedEvidence(primaryKey) {
  const entries = state.diaryEntries;
  if (!entries.length) return [];
  const lines = [];
  const mealGapDays = entries.filter(entry => entry.meal_rhythm?.includes("5+") || entry.meal_rhythm?.includes("орой нөхсөн")).length;
  const stressDays = entries.filter(entry => Number(entry.stress_score) >= 7 || ["Стресс", "Уур", "Гуниг", "Санаа зовнил"].includes(entry.emotion)).length;
  const lowEnergyDays = entries.filter(entry => Number(entry.energy_score) <= 3).length;
  const rewardDays = entries.filter(entry => (entry.food_function || []).some(v => ["Амттай юм хүссэн", "Өөрийгөө шагнамаар байсан", "Уйдсан"].includes(v))).length;
  const bodyDays = entries.filter(entry => (entry.body_signals || []).some(v => v !== "Аль нь ч үгүй")).length;
  if (mealGapDays) lines.push(`${mealGapDays} өдөр хоолны зай уртсах эсвэл орой нөхөх давтамж гарсан.`);
  if (stressDays) lines.push(`${stressDays} өдөр стресс/мэдрэмж өндөр байсан.`);
  if (lowEnergyDays) lines.push(`${lowEnergyDays} өдөр оройн эрч хүч бага байсан.`);
  if (rewardDays) lines.push(`${rewardDays} өдөр өөрийгөө баярлуулах эсвэл амттай зүйл хүсэх үүрэг тэмдэглэгдсэн.`);
  if (bodyDays) lines.push(`${bodyDays} өдөр биеийн дохио тэмдэглэгдсэн.`);
  if (!lines.length && primaryKey) lines.push(`${publicMechanismShort(primaryKey)} давтамжийг батлахад тэмдэглэлийн мэдээлэл одоогоор бага байна.`);
  return lines;
}

function confirmedNarrativeEvidence(entries = state.diaryEntries) {
  return entries
    .map(entry => entry.confirmedSummaryObject)
    .filter(summary => summary?.userConfirmed)
    .map(summary => ({
      day: summary.diaryDay,
      bullets: summary.confirmedSummary || [],
      tags: summary.extractedTags || [],
      dimensions: summary.evidenceDimensions || [],
      mechanisms: summary.mechanismSignals || []
    }));
}

function confirmedStageEvidence(summaries = state.stageVoiceSummaries) {
  return Object.values(summaries || {})
    .filter(summary => summary?.userConfirmed)
    .map(summary => ({
      checkpointId: summary.checkpointId,
      bullets: summary.confirmedSummary || [],
      tags: summary.extractedTags || [],
      dimensions: summary.evidenceDimensions || [],
      mechanisms: summary.mechanismSignals || []
    }));
}

function entryEvidenceTags(entry) {
  const structuredTags = extractTagsFromEvidence({
    meal_rhythm: entry.meal_rhythm,
    unplanned_eating_count: entry.unplanned_eating_count,
    main_moment_time: entry.main_moment_time,
    hunger_level: entry.hunger_level,
    food_function: entry.food_function,
    emotion: entry.emotion,
    stress_score: entry.stress_score,
    energy_score: entry.energy_score,
    body_signals: entry.body_signals,
    movement: entry.movement,
    pattern_probes: entry.pattern_probes
  }, []);
  return unique([...(entry.confirmedSummaryObject?.extractedTags || []), ...structuredTags]);
}

function allReportTags(entries = state.diaryEntries) {
  return unique(entries.flatMap(entryEvidenceTags));
}

function allStageReportTags() {
  return unique([
    ...Object.entries(state.stageAnswers || {}).flatMap(([questionId, answer]) => {
      const values = Array.isArray(answer) ? answer : [answer];
      return values.flatMap(value => getOptionMetadata(questionId, value)?.tags || []);
    }),
    ...Object.values(state.stageVoiceSummaries || {}).flatMap(summary => summary?.extractedTags || [])
  ]);
}

function countEntries(entries, predicate) {
  return entries.filter(predicate).length;
}

function impactLabel(count, total) {
  if (!total || !count) return "Мэдээлэл хангалтгүй";
  const ratio = count / total;
  if (ratio >= 0.6) return "Хүчтэй";
  if (ratio >= 0.35) return "Дунд";
  return "Бага";
}

function triggerMapRows(entries = state.diaryEntries) {
  const total = entries.length;
  const rows = [
    {
      trigger: "Хоолны хооронд 5+ цаг эсвэл хоол алгасалт",
      count: countEntries(entries, entry => entry.meal_rhythm?.includes("5+") || entry.meal_rhythm?.includes("алгас")),
    },
    {
      trigger: "Оройн тэнхээ 3/10-аас бага",
      count: countEntries(entries, entry => Number(entry.energy_score) <= 3),
    },
    {
      trigger: "Стресс 7+/10 эсвэл хүчтэй мэдрэмж",
      count: countEntries(entries, entry => Number(entry.stress_score) >= 7 || ["Стресс", "Уур", "Гуниг", "Санаа зовнил"].includes(entry.emotion)),
    },
    {
      trigger: "Өөрийгөө баярлуулах хүсэл",
      count: countEntries(entries, entry => entryEvidenceTags(entry).includes("reward_pull")),
    },
    {
      trigger: "Хоол захиалга эсвэл бэлэн сонголт",
      count: countEntries(entries, entry => entryEvidenceTags(entry).includes("default_delivery") || entryEvidenceTags(entry).includes("executive_load")),
    },
    {
      trigger: "Биеийн дохио / сахар унах мэт санаа зовоосон мэдрэмж",
      count: countEntries(entries, entry => entryEvidenceTags(entry).includes("glucose_like_signal") || entryEvidenceTags(entry).includes("bp_concern")),
    }
  ];
  return rows
    .filter(row => row.count > 0 || total < 5)
    .map(row => ({
      ...row,
      frequency: total ? `${row.count}/${total}` : "Мэдээлэл хангалтгүй",
      impact: impactLabel(row.count, total)
    }));
}

function renderTriggerMapTable(rows) {
  return `
    <div class="table-scroll" tabindex="0">
      <table class="report-table">
        <thead><tr><th>Эхэлдэг нөхцөл</th><th>Давтамж</th><th>Нөлөө</th></tr></thead>
        <tbody>${rows.map(row => `<tr><td>${publicHtml(row.trigger)}</td><td>${publicHtml(row.frequency)}</td><td>${publicHtml(row.impact)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function surfaceBehaviors(entries = state.diaryEntries, tags = allReportTags(entries)) {
  const behaviors = [];
  if (tags.includes("evening_unplanned_eating")) behaviors.push("Орой төлөвлөөгүй идэлт давтагдах");
  if (tags.includes("skipped_meal") || tags.includes("meal_gap_5h_plus")) behaviors.push("Хоолны хэмнэл алдагдах, хоолны зай уртсах");
  if (tags.includes("default_delivery")) behaviors.push("Ядарсан үед хоол захиалга эсвэл бэлэн сонголт руу шилжих");
  if (tags.includes("reward_pull")) behaviors.push("Өлсөлтөөс гадна өөрийгөө баярлуулах хүсэл идэвхжих");
  if (tags.includes("food_as_regulation")) behaviors.push("Стресс/мэдрэмжийн үед идэх хүсэл нэмэгдэх");
  if (tags.includes("control_collapse")) behaviors.push("Төлөвлөгөө алдагдахад бүхэлдээ нурсан мэт мэдрэгдэх");
  return behaviors.length ? behaviors : ["Таны илэрч буй зан үйлийг илүү тод харахад тэмдэглэл үргэлжлүүлэх шаардлагатай байна"];
}

function hiddenFunctionItems(entries = state.diaryEntries, tags = allReportTags(entries)) {
  const total = entries.length;
  const items = [];
  const lowEnergy = countEntries(entries, entry => Number(entry.energy_score) <= 3);
  const reward = countEntries(entries, entry => entryEvidenceTags(entry).includes("reward_pull"));
  const regulation = countEntries(entries, entry => entryEvidenceTags(entry).includes("food_as_regulation"));
  const safety = countEntries(entries, entry => entryEvidenceTags(entry).includes("hunger_safety") || entryEvidenceTags(entry).includes("meal_gap_5h_plus"));
  const executive = countEntries(entries, entry => entryEvidenceTags(entry).includes("executive_load") || entryEvidenceTags(entry).includes("default_delivery"));
  const social = countEntries(entries, entry => entryEvidenceTags(entry).includes("social_pressure"));
  const body = countEntries(entries, entry => entryEvidenceTags(entry).includes("glucose_like_signal") || entryEvidenceTags(entry).includes("bp_concern"));
  const shame = countEntries(entries, entry => entryEvidenceTags(entry).includes("shame_guilt"));
  const role = countEntries(entries, entry => entryEvidenceTags(entry).includes("role_overload"));
  const circadian = countEntries(entries, entry => entryEvidenceTags(entry).includes("circadian_crash"));

  if (role || tags.includes("role_overload")) items.push({ name: "Өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх хариу", evidence: total ? `${role}/${total} өдөр бусдын хэрэгцээ, өөрийн цаг/хоол хойшлох мэдээлэл давтагдсан.` : "Өөрийн цаг, өөрийн хоол хамгийн сүүлд үлдэх дохио гарсан." });
  if (circadian || tags.includes("circadian_crash")) items.push({ name: "Нойр/эрч хүчний хэмнэл нөхөх", evidence: total ? `${circadian}/${total} өдөр нойр, өглөөний хоолгүй хэмнэл эсвэл оройн тэнхээний уналт давтагдсан.` : "Нойр, кофеин, өглөөний хоолгүй хэмнэл, оройн тэнхээний уналтын дохио гарсан." });
  if (lowEnergy || (!total && tags.includes("executive_load"))) items.push({ name: "Тэнхээ нөхөх", evidence: total ? `${lowEnergy}/${total} өдөр оройн эрч хүч бага байсан тул хоол эрч хүчний цоорхойг нөхөх үүрэгтэй байж магадгүй.` : "Эрч хүчний уналтын давтамжийг 7 хоногийн тэмдэглэл илүү тодруулна." });
  if (executive || (!total && tags.includes("default_delivery"))) items.push({ name: "Олон шийдвэрийн дараах ядаргаанаас гарах", evidence: total ? `${executive}/${total} өдөр хамгийн амар бэлэн сонголт нөлөөлсөн.` : "Ядарсан үед бэлэн сонголт хүчтэй дохио болсон." });
  if (safety || (!total && tags.includes("hunger_safety"))) items.push({ name: "Дараа өлсөхөөс хамгаалах", evidence: total ? `${safety}/${total} өдөр хоолны зай, өлсөлт, аюулгүй байдлын санаа зовнил давхцсан.` : "Хоол хасах үед хамгаалах хариу гарч байж магадгүй." });
  if (reward || (!total && tags.includes("reward_pull"))) items.push({ name: "Таатай мэдрэмж авах", evidence: total ? `${reward}/${total} өдөр өөрийгөө баярлуулах хүсэл тэмдэглэгдсэн.` : "Таатай мэдрэмж авах дохио таны хариулт дээр харагдаж байна." });
  if (regulation || (!total && tags.includes("food_as_regulation"))) items.push({ name: "Сэтгэл санааг түр тогтворжуулах", evidence: total ? `${regulation}/${total} өдөр стресс/мэдрэмж хоолтой давхцсан.` : "Стресс/мэдрэмжийн дохио бүтэцтэй хариулт дээр гарсан." });
  if (social || (!total && tags.includes("social_pressure"))) items.push({ name: "Хүмүүсийн дунд татгалзахгүй байх", evidence: total ? `${social}/${total} өдөр хүмүүсийн дундах дарамт тэмдэглэгдсэн.` : "Хүмүүсийн дундах дарамт таны хариулт дээр гарсан." });
  if (tags.includes("autonomy_rebellion")) items.push({ name: "Өөрөө сонгох мэдрэмжээ хамгаалах", evidence: "Хязгаарлалт нэмэгдэхэд эсэргүүцэх дохио гарсан." });
  if (body) items.push({ name: "Биеийн таагүй мэдрэмжийг намдаах", evidence: `${body}/${total} өдөр биеийн дохио эсвэл сахар унах мэт санаа зовнил тэмдэглэгдсэн.` });
  if (shame) items.push({ name: "Ичгүүрээс зайлсхийх", evidence: `${shame}/${total} өдөр гэмшил/ичгүүрийн дараах нөлөөний дохио гарсан.` });
  if (tags.includes("body_safety")) items.push({ name: "Бусдын хараанаас аюулгүй зай авах", evidence: "Биеэ бусдад анзаарагдахтай холбоотой тавгүй дохио гарсан." });
  return items.length ? items : [{ name: "Давтамж тодруулах", evidence: "Зан үйлийн үүргийг илүү тодруулахын тулд баталгаажсан тайлбар болон тэмдэглэл нэмэх хэрэгтэй." }];
}

function beforeEatingItems(entries = state.diaryEntries, tags = allReportTags(entries)) {
  const items = [];
  if (tags.includes("high_hunger")) items.push("Өлсөлт өндөр болсон");
  if (tags.includes("low_hunger_craving")) items.push("Өлсөлт бага үед амттай зүйл эсвэл өөрийгөө баярлуулах хүсэл гарсан");
  if (tags.includes("skipped_meal") || tags.includes("meal_gap_5h_plus")) items.push("Хоолны урт зай эсвэл хоол алгасалт байсан");
  if (countEntries(entries, entry => Number(entry.energy_score) <= 3)) items.push("Оройн эрч хүчний уналт давтагдсан");
  if (tags.includes("food_as_regulation")) items.push("Стресс/мэдрэмж өндөр байсан");
  if (tags.includes("reward_pull")) items.push("Өөрийгөө баярлуулах хүсэл идэвхжсэн");
  if (tags.includes("executive_load") || tags.includes("default_delivery")) items.push("Хамгийн амар сонголт хэрэгтэй мэдрэмж давамгайлсан");
  if (tags.includes("cue_trigger")) items.push("Хоол харагдах, үнэртэх, захиалгын дохио нөлөөлсөн");
  if (tags.includes("social_pressure")) items.push("Хүмүүсийн дундах дарамт эсвэл татгалзах эвгүй байдал нөлөөлсөн");
  if (tags.includes("glucose_like_signal")) items.push("Сахар унах мэт биеийн дохио санаа зовоосон");
  return items.length ? items : ["Төлөвлөөгүй идэлтийн өмнөх 30 минутын мэдээлэл хязгаарлагдмал байна."];
}

function afterEatingItems(entries = state.diaryEntries, tags = allReportTags(entries)) {
  const items = [];
  if (tags.includes("food_as_regulation")) items.push("Түр тайвшрах эсвэл хөнгөрөх мэдрэмж авах");
  if (tags.includes("reward_pull")) items.push("Таатай мэдрэмж авах");
  if (tags.includes("shame_guilt")) items.push("Дараа нь ичих/гэмших мэдрэмж нэмэгдэх");
  if (tags.includes("control_collapse")) items.push("“Маргааш чанга барина” эсвэл нурсан мэт хариу асаах");
  if (tags.includes("glucose_like_signal")) items.push("Биеийн таагүй мэдрэмж намдаахыг хайх");
  if (!items.length) items.push("Идсэний дараах нөлөөний мэдээлэл хязгаарлагдмал байна. Дараагийн тэмдэглэлд энэ хэсгийг илүү тодруулж болно.");
  return items;
}

function cycleMapSteps(primaryKey, tags = allReportTags()) {
  if (primaryKey === "executive" || tags.includes("executive_load") || tags.includes("default_delivery")) {
    return [
      "Өдөр олон шийдвэрийн ачаалал өндөр байна",
      "Орой эрч хүч унаж, хоол хийх сэтгэлийн зай багасна",
      "“Хамгийн амар сонголт” ялна",
      "Хоол захиалга эсвэл зууш руу амархан шилжинэ",
      "Түр амар мэдрэмж өгнө",
      "Дараа нь өөрийгөө буруутгах эсвэл маргааш чанга барих бодол гарна",
      "Дараагийн өдөр дахин тодорхой бэлэн зам байхгүй хэвээр үлдэнэ"
    ];
  }
  if (primaryKey === "hungerSafety" || tags.includes("hunger_safety") || tags.includes("meal_gap_5h_plus")) {
    return [
      "Өдөр хоолны хэмнэл алдагдана",
      "Орой эрч хүч унаж, өлсөлт нэмэгдэнэ",
      "“Дараа өлсөхгүй байх хэрэгтэй” гэсэн хамгаалах хариу гарна",
      "Амттай, хурдан, бэлэн сонголт илүү хүчтэй татна",
      "Түр тайвширч, тэнхээ орсон мэт болно",
      "Дараа нь гэмших эсвэл “маргаашаас барина” гэж бодно",
      "Маргааш дахин хэт хасвал орой цикл давтагдана"
    ];
  }
  if (primaryKey === "reward" || tags.includes("reward_pull")) {
    return [
      "Өдрийн төгсгөлд өөрийгөө баярлуулах хэрэгцээ хуримтлагдана",
      "Өлсөлтөөс гадна “нэг гоё юм” хүсэл нэмэгдэнэ",
      "Орчны дохио эсвэл амар сонголт хүсэлтэй давхцана",
      "Амттай зүйл түр таатай мэдрэмж өгнө",
      "Хэрвээ өөрийгөө буруутгах мэдрэмж нэмэгдвэл маргааш хатуу барих бодол гарна",
      "Таатай мэдрэмж авах хэрэгцээг төлөвлөөгүй үед цикл дахин амархан асна"
    ];
  }
  if (primaryKey === "regulation" || tags.includes("food_as_regulation")) {
    return [
      "Стресс эсвэл мэдрэмжийн даац багасна",
      "Тайвшрах хамгийн хурдан арга хоол болж харагдана",
      "Идэх сонголт түр амсхийх мэдрэмж өгнө",
      "Дараа нь гэмших эсвэл санаа зовнил нэмэгдэж болно",
      "Стресс хэвээр үлдвэл дараагийн өдөр ижил тайвшрах хэрэгцээ дахин гарна"
    ];
  }
  if (primaryKey === "glucose" || tags.includes("glucose_like_signal")) {
    return [
      "Хоол холдох эсвэл эрч хүчний нөөц багасна",
      "Биеийн дохио хүчтэй мэдрэгдэнэ",
      "Бие муудахаас хамгаалах идэх хүсэл гарна",
      "Хоол түр амсхийх мэдрэмж өгч болно",
      "Шинж давтагдвал мацаг/хоол алгасах нь буруу эхлэх цэг болж магадгүй",
      "Мэргэжлийн хүнтэй ярилцах болон тогтвортой хоолны хэмнэл эхний дараалал болно"
    ];
  }
  return [
    "Тодорхой эхэлдэг нөхцөл давтагдана",
    "Биеийн байдал, мэдрэмж, эрч хүчний хэрэгцээ нэмэгдэнэ",
    "Хамгийн хурдан эсвэл хамгийн танил бэлэн сонголт ялна",
    "Түр амсхийх эсвэл таатай мэдрэмж өгнө",
    "Дараа нь хэвийн үргэлжлүүлэх дүрэм байхгүй бол цикл дахин давтагдана"
  ];
}

function notRealProblemCopy(primaryKey, tags = allReportTags()) {
  const copies = {
    reward: "Асуудал амттай зүйлд дуртайдаа биш байж магадгүй. Гол нь таатай мэдрэмж авах хэрэгцээ төлөвлөгдөөгүй үед орчны дохио, уйдалт, өдрийн төгсгөлийн ядаргаатай нийлээд хамгийн хурдан сонголт болж байна. Тиймээс эхний засах зүйл амттай бүхнийг бүрэн хорих биш — таатай мэдрэмж авах жижиг сонголтоо урьдчилж төлөвлөх байна.",
    hungerSafety: "Асуудал орой идсэндээ биш байж магадгүй. Гол нь хоолны зай уртсах, өндөр өлсөлт, дараа өлсөхөөс хамгаалах хариу давхцаж байна. Тиймээс эхний засах зүйл хоол алгасах/мацаг биш — тогтмол хоолны тулгуур ба оройн бэлэн сонголт байна.",
    social: "Асуудал хүмүүсийн дунд сул байгаадаа биш байж магадгүй. Гол нь татгалзах эвгүй мэдрэмж болон өөрийн сонголтоо хадгалах хэрэгцээ мөргөлдөж байна. Тиймээс эхний засах зүйл зүгээр татгалз гэж өөрийгөө хүчлүүлэх биш — урьдчилж хэлэх богино өгүүлбэр ба нөхцөлөөс өмнөх хил байна.",
    executive: "Асуудал мэдэхгүйдээ биш байж магадгүй. Гол нь эрч хүч багассан үед дахин шийдвэр гаргах шаардлага гарч, хамгийн бага хүч шаарддаг сонголт ялж байна. Тиймээс эхний засах зүйл илүү хүсэл зориг биш — шийдвэр шаардахгүй оройн хоолны бэлэн зам байна.",
    decisionDefault: "Асуудал хүсэл сулдаа биш байж магадгүй. Гол нь хүссэн сонголт бэлэн биш, харин зууш/хоол захиалга/гарын дорх сонголт илүү ойр байна. Тиймээс эхний засах зүйл өөрийгөө хүчлэх биш — орчноо болон бэлэн сонголтоо дахин зохион байгуулах байна.",
    regulation: "Асуудал хоолондоо биш байж магадгүй. Гол нь стресс эсвэл мэдрэмж өндөр үед хоол түр тайвшруулах хамгийн хурдан арга болж байна. Тиймээс эхний засах зүйл зөвхөн тэвчих биш — хоолноос өөр богино тайвшруулах сонголтууд байна.",
    collapse: "Асуудал нэг удаа төлөвлөгөө алдсандаа биш байж магадгүй. Гол нь нэг хазайлт бүхэл өдөр/долоо хоногийг дууссан мэт болгодог цикл байна. Тиймээс эхний засах зүйл илүү чанга сорил биш — дараагийн хоолноос хэвийн үргэлжлүүлэх дүрэм байна.",
    roleOverload: "Таны оройн идэлт зөвхөн амттай юм хүссэндээ биш, өдөржин өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх response байж магадгүй. Тиймээс эхний засах зүйл “илүү тэвчих” биш — өөрийн хоол/амралтын хамгаалагдсан жижиг зай үүсгэх байна.",
    rewardDeficit: "Таны оройн идэлт зөвхөн амттай юм хүссэндээ биш, өдөржин өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх хариу байж магадгүй. Таатай мэдрэмж авах хэрэгцээ буруу биш, харин хэт орой, хэт санамсаргүй гарч ирж байна.",
    circadian: "Таны оройн идэх хүсэл зөвхөн амттай юм хүсэх биш, нойр, кофеин, өглөөний хоолгүй хэмнэл, оройн тэнхээний уналттай холбоотой байж магадгүй. Тиймээс эхний засах зүйл таатай мэдрэмж авах хүслээ хорих биш — эхний тогтмол хоол, кофеиний хил, нойрыг бодолцсон оройн сонголт байна.",
    bodySafety: "Жин хасах оролдлого таны хувьд зөвхөн биеийн хэмжээний асуудал биш, өөрийгөө харах, бусдад харагдах, ичгүүртэй холбогдож байж магадгүй. Тиймээс эхний засах зүйл илүү хатуу сорил биш — хувийн, биеэ буруутгахгүй дэмжлэг байна."
  };
  return copies[primaryKey] || "Асуудал зөвхөн хоолны сонголтод биш байж магадгүй. Гол нь тухайн сонголтыг давтуулж байгаа нөхцөл, тухайн үед нөхөж байгаа хэрэгцээ, хамгийн амар бэлэн замыг зөв олох хэрэгтэй. Тиймээс эхний засах зүйл өөрийгөө буруутгах биш — эхэлж өөрчлөх хамгийн амар цэгийг сонгох байна.";
}

function previousAttemptsCopy(primaryKey, tags = allReportTags()) {
  const attempts = [].concat(state.stageAnswers["S1-W04"] || []);
  const known = attempts.length ? attempts.join(", ") : "өмнөх хоолны төлөвлөгөө";
  if (attempts.includes("Мацаг") || attempts.includes("Орой хоол идэхгүй") || tags.includes("hunger_safety") || tags.includes("glucose_like_signal")) {
    return `Өмнө хэрэглэсэн арга: ${known}. Энэ нь эхэндээ энгийн дүрэм шиг санагдсан байж болно. Гэхдээ дараа өлсөхөөс хамгаалах хэрэгцээ эсвэл биеийн дохио давхцаж байвал мацаг, хоол алгасах арга хамгаалах хариуг улам хүчтэй болгож магадгүй. Илүү зөв эхлэх цэг нь тогтвортой хоолны хэмнэл болон аюулгүй мэдрэмж юм.`;
  }
  if (attempts.includes("Калори тоолох") || tags.includes("shame_guilt") || tags.includes("control_collapse")) {
    return `Өмнө хэрэглэсэн арга: ${known}. Тэмдэглэл хөтлөх нь эхэндээ бүтэц өгдөг ч гэмшил/ичгүүр эсвэл бүгдийг эсвэл юу ч биш гэж харах цикл идэвхтэй үед хариу мэдээлэл өөрөө өдөөгч нөхцөл болж болно. Илүү зөв эхлэх цэг нь өөрийгөө буруутгахгүй тэмдэглэл болон хэвийн үргэлжлүүлэх дүрэм юм.`;
  }
  if (attempts.includes("Нүүрс ус хасах") || tags.includes("reward_pull")) {
    return `Өмнө хэрэглэсэн арга: ${known}. Хасах дүрэм эхэндээ тодорхой мэт боловч таатай мэдрэмж авах хэрэгцээг огт төлөвлөхгүй бол идэх хүсэл хүчтэй эргэж ирдэг. Илүү зөв эхлэх цэг нь өөрийгөө баярлуулах жижиг сонголтоо урьдчилж төлөвлөх юм.`;
  }
  if (attempts.includes("Фитнесийн богино сорил") || attempts.includes("Фитнес challenge") || primaryKey === "collapse") {
    return `Өмнө хэрэглэсэн арга: ${known}. Богино сорил эхэндээ хөдлөх хүч өгдөг ч нэг алдаа гармагц бүхэлдээ нурдаг циклтэй мөргөлдөж болно. Илүү зөв эхлэх цэг нь дараагийн хоолноос хэвийн үргэлжлүүлэх дүрэм юм.`;
  }
  return `Өмнө хэрэглэсэн арга: ${known}. Тэр арга буруу байсан гэсэн үг биш. Харин таны бодит эхэлдэг нөхцөл, зан үйлийн үүрэг, бэлэн замыг оноогүй үед удаан үргэлжлэхэд хэцүү болдог.`;
}

function avoidListFor(primaryKey, tags = allReportTags()) {
  const avoid = new Set();
  const cycleEvidence = menstrualCycleEvidence();
  const cycleAvoidItems = [
    "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд хэт хатуу хоолны дүрэм эхлүүлэх",
    "Тэр өдрүүдийн өлсөлт, амттай зүйл хүсэх мэдрэмжийг зөвхөн сахилга бат гэж тайлбарлах",
    "Хавагналт, жингийн түр өөрчлөлтийг өөх нэмэгдсэн гэж шууд дүгнэх"
  ];
  if (primaryKey === "collapse" || tags.includes("control_collapse")) {
    ["Төгс төлөвлөгөө", "Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил", "Ичгүүрээр шахдаг хяналт"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "bodySafety" || tags.includes("body_safety")) {
    ["Олон нийтэд өмнө/дараах зураг харуулах сорил", "Өдөр бүр жингээ үзэж өөрийгөө шийтгэх", "Биеэ ичээх үг хэллэг", "Хэт огцом зорилт", "Ичгүүрээр шахдаг хяналт", "Бусдад харагдахыг хүчээр сэдэл болгох"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "roleOverload" || tags.includes("role_overload")) {
    ["“Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө", "Хэт хатуу хоолны дэглэм", "Олон нийтэд хийх сорил", "оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих", "Өөрийн хоолыг үлдэгдэл цагт найдах"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "circadian" || tags.includes("circadian_crash")) {
    ["оройн хоолыг шууд бүрэн хорих", "орой кофеин уух", "өглөө/өдөр хоол алгасаад орой тэсэх", "нойр дутуу үед хатуу хоолны дэглэм эхлүүлэх", "нойр муу үед өндөр ачаалалтай сорил эхлүүлэх"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "autonomy" || tags.includes("autonomy_rebellion")) {
    ["Бүрэн хориг", "Өөрийн сонголтгүй хатуу дүрэм"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "hungerSafety" || tags.includes("hunger_safety") || tags.includes("meal_gap_5h_plus")) {
    ["Урт мацаг", "Өдөр хоол алгасах", "“Өлсвөл тэс” гэж өөрийгөө хүчлэх", "Оройн зуушийг шууд бүрэн хорих"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "executive" || tags.includes("executive_load") || tags.includes("default_delivery")) {
    ["Олон дүрэмтэй хоолны төлөвлөгөө", "Өдөр бүр төгс тэмдэглэх шаардлага", "Ядарсан үед дахин хоол шийдэх төлөвлөгөө", "Хэт төвөгтэй хоол бэлдэх систем"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "reward" || tags.includes("reward_pull")) {
    ["Амттай бүхнийг бүрэн хорих", "Өөрийгөө баярлуулах хэрэгцээг огт төлөвлөхгүй байх", "Өдөөгч хоолыг гэрт байлгаад зөвхөн тэвчээрээр давах"].forEach(item => avoid.add(item));
  }
  if (primaryKey === "glucose" || primaryKey === "physiological" || tags.includes("glucose_like_signal") || tags.includes("physiological_reactivity") || tags.includes("bp_concern")) {
    ["Мацаг", "Хоол алгасах", "Хэт бага калорийн арга", "Кофе уугаад хоолгүй явах"].forEach(item => avoid.add(item));
  }
  if (cycleEvidence.premenstrual) {
    cycleAvoidItems.forEach(item => avoid.add(item));
  }
  if (!avoid.size) avoid.add("Илүү хатуу хоолны дэглэмийг бэлэн шийдэл болгох");
  if (cycleEvidence.premenstrual) {
    return unique([
      ...cycleAvoidItems,
      ...Array.from(avoid)
    ]).slice(0, 7);
  }
  if (primaryKey === "roleOverload" || tags.includes("role_overload")) {
    return unique([
      "“Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө",
      "Хэт хатуу хоолны дэглэм",
      "Олон нийтэд хийх сорил",
      "оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих",
      "Өөрийн хоолыг үлдэгдэл цагт найдах",
      ...Array.from(avoid)
    ]).slice(0, 7);
  }
  if (primaryKey === "circadian" || tags.includes("circadian_crash")) {
    return unique([
      "оройн хоолыг шууд бүрэн хорих",
      "орой кофеин уух",
      "өглөө/өдөр хоол алгасаад орой тэсэх",
      "нойр дутуу үед хатуу хоолны дэглэм эхлүүлэх",
      "нойр муу үед өндөр ачаалалтай сорил эхлүүлэх",
      ...Array.from(avoid)
    ]).slice(0, 7);
  }
  return Array.from(avoid).slice(0, 7);
}

function leveragePoint(primaryKey, tags = allReportTags()) {
  if (primaryKey === "glucose") {
    return { label: "professional_check_first", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: эхлээд мэргэжлийн хүнтэй ярилцах. Яагаад гэвэл биеийн дохио эсвэл сахар унах мэт санаа зовнил тэмдэглэгдсэн үед мацаг эсвэл хоол алгасах нь буруу дараалал байж магадгүй. Энэ нь та жин хасах гэж оролдож болохгүй гэсэн үг биш. Харин эхлээд биеийн дохиог аюулгүйгээр ойлгох хэрэгтэй гэсэн үг." };
  }
  if (primaryKey === "roleOverload" || tags.includes("role_overload")) {
    return { label: "protected_self_feeding_slot", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: өөрийн хоол, амралтын хамгаалагдсан жижиг зай. Яагаад гэвэл бусдын хэрэгцээ түрүүнд явж, өөрийн хоол/амралт хамгийн сүүлд үлдэх үед оройн идэлт нөхөх хариу болж байна. Энэ нь “зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө биш. Харин өдөрт нэг хамгийн бага өөртөө анхаарах дүрэм буюу өөрийн хоолыг үлдэгдэл цагт найдахгүй хамгаалах тухай юм." };
  }
  if (primaryKey === "circadian" || tags.includes("circadian_crash")) {
    return { label: "sleep_energy_anchor", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: эхний тогтмол хоол, кофеиний хил, оройн унтраах жижиг зан үйл. Яагаад гэвэл нойр, кофеин, өглөөний хоолгүй хэмнэл, оройн тэнхээний уналт давтагдахад амттай юм хүсэх, таатай мэдрэмж авах хүсэл орой хүчтэй болдог. Энэ нь амттай юм хүсэхийг буруутгах биш, нойрыг бодолцсон оройн бэлэн сонголт бэлдэх тухай юм." };
  }
  if (primaryKey === "bodySafety" || tags.includes("body_safety")) {
    return { label: "privacy_first_tracking", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: хувийн тэмдэглэл, биеэ буруутгахгүй хэмжүүр. Жин хасах оролдлого өөрийгөө харах, бусдад харагдах, ичгүүртэй холбогдож байвал эхлээд тайван тэмдэглэл болон мэргэжлийн дэмжлэгийг түрүүнд тавих нь зөв." };
  }
  if (primaryKey === "reward") {
    return { label: "planned_reward_system", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: таатай мэдрэмж авах жижиг сонголтоо урьдчилж төлөвлөх. Яагаад гэвэл өөрийгөө баярлуулах хэрэгцээ өлсөлтөөс тусдаа давтагдаж байна. Энэ нь амттай бүхнийг хорих тухай биш. Харин тэр хэрэгцээг санамсаргүй биш, төлөвлөсөн хэлбэрт оруулах тухай юм." };
  }
  if (primaryKey === "hungerSafety") {
    return { label: "anchor_meals_plus_planned_evening_option", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: тогтмол хоолны тулгуур ба оройн бэлэн сонголт. Яагаад гэвэл хоолны зай уртсах, оройн өлсөлт, хамгаалах хариу давхцаж байна. Энэ нь орой идэхийг шууд хорих тухай биш. Харин өдөр биеийн аюулгүй мэдрэмжийг тогтвортой болгох тухай юм." };
  }
  if (primaryKey === "executive" || primaryKey === "decisionDefault") {
    return { label: "default_dinner_system", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: ядарсан үед ажиллах шийдвэр шаардахгүй оройн хоолны бэлэн зам. Яагаад гэвэл тэнхээ бага үед хамгийн амар сонголт давтагдаж байна. Энэ нь хүсэл зориг дутаж байна гэсэн үг биш. Харин дахин шийдвэр гаргах шаардлагагүй 2-3 бэлэн сонголт хэрэгтэй гэсэн үг." };
  }
  if (primaryKey === "collapse" || tags.includes("control_collapse")) {
    return { label: "recovery_rule", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: дараагийн хоолноос хэвийн үргэлжлүүлэх дүрэм. Яагаад гэвэл нэг алдаа бүхэл төлөвлөгөөг нураах дохио гарч байна. Энэ нь илүү чанга барих тухай биш. Харин төлөвлөгөө алдагдсан үед буцах замтай болох тухай юм." };
  }
  if (tags.includes("glucose_like_signal") || tags.includes("bp_concern")) {
    return { label: "professional_check_first", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: эхлээд мэргэжлийн хүнтэй ярилцах. Яагаад гэвэл биеийн дохио эсвэл сахар унах мэт санаа зовнил тэмдэглэгдсэн үед мацаг эсвэл хоол алгасах нь буруу дараалал байж магадгүй. Энэ нь та жин хасах гэж оролдож болохгүй гэсэн үг биш. Харин эхлээд биеийн дохиог аюулгүйгээр ойлгох хэрэгтэй гэсэн үг." };
  }
  if (tags.includes("default_delivery")) {
    return { label: "default_dinner_system", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: ядарсан үед ажиллах шийдвэр шаардахгүй оройн хоолны бэлэн зам. Яагаад гэвэл тэнхээ бага үед хамгийн амар сонголт давтагдаж байна. Энэ нь хүсэл зориг дутаж байна гэсэн үг биш. Харин дахин шийдвэр гаргах шаардлагагүй 2-3 бэлэн сонголт хэрэгтэй гэсэн үг." };
  }
  if (tags.includes("meal_gap_5h_plus")) {
    return { label: "anchor_meals_plus_planned_evening_option", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: тогтмол хоолны тулгуур ба оройн бэлэн сонголт. Яагаад гэвэл хоолны зай уртсах, оройн өлсөлт, хамгаалах хариу давхцаж байна. Энэ нь орой идэхийг шууд хорих тухай биш. Харин өдөр биеийн аюулгүй мэдрэмжийг тогтвортой болгох тухай юм." };
  }
  if (tags.includes("reward_pull")) {
    return { label: "planned_reward_system", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: таатай мэдрэмж авах жижиг сонголтоо урьдчилж төлөвлөх. Яагаад гэвэл өөрийгөө баярлуулах хэрэгцээ өлсөлтөөс тусдаа давтагдаж байна. Энэ нь амттай бүхнийг хорих тухай биш. Харин тэр хэрэгцээг санамсаргүй биш, төлөвлөсөн хэлбэрт оруулах тухай юм." };
  }
  return { label: "neutral_tracking", copy: "Таны эхэлж өөрчлөх хамгийн амар цэг: өөрийгөө буруутгахгүй тэмдэглэх. Яагаад гэвэл давтамжийг ичгүүр биш, мэдээлэл гэж харах үед дараагийн зөв алхам тодордог." };
}

function experimentFor(primaryKey, tags = allReportTags()) {
  const leverage = leveragePoint(primaryKey, tags);
  if (leverage.label === "protected_self_feeding_slot") {
    return { goal: "Өөрийн хоол/амралтыг үлдэгдэл цагт найдахгүй хамгаалах", actions: ["Өдөр бүр өөрийн хоолны хамгаалагдсан нэг цаг тогтоох", "Орой хоолноос гадуур 10 минутын амрах жижиг зан үйл бэлдэх", "Өөрийн хоолыг хамгийн сүүлд үлдээхгүй байх хамгийн жижиг дүрэм тогтоох"], track: ["Өөрийн хоол хамгаалагдсан эсэх", "Оройн өөрийгөө баярлуулах хүсэл", "Бусдын хэрэгцээ түрүүлсэн өдөр"], success: "Оройн идэлт нөхөх хариу биш, төлөвлөсөн зан үйл болж эхэлнэ.", recovery: "Нэг өдөр алдвал өөрийгөө буруутгахгүй, дараагийн хамгаалагдсан цагаас үргэлжлүүлнэ." };
  }
  if (leverage.label === "sleep_energy_anchor") {
    return { goal: "Нойр/тэнхээний хэмнэлээс үүсэх оройн идэх хүслийг багасгах", actions: ["Өдрийн эхний тогтмол хоолоо өдөр бүр тогтоох", "Үдээс хойш кофеин уух хил тавих", "Орой унтраах богино зан үйл болон нойрыг бодолцсон оройн сонголт бэлдэх"], track: ["Нойр", "Кофеин уусан цаг", "Оройн тэнхээний уналт", "Шөнийн идэх хүсэл"], success: "Оройн идэх хүсэл зөвхөн амттай юм хүсэх биш, хэмнэлийн дохио гэдгийг ялгаж эхэлнэ.", recovery: "Нойр муу өдөр хатуу хоолны төлөвлөгөө эхлүүлэхгүй, нойрыг бодолцсон бэлэн сонголтоо ашиглана." };
  }
  if (leverage.label === "default_dinner_system") {
    return { goal: "Орой олон шийдвэрийн дараах ядаргаатай үед хоол захиалга/зууш руу амархан шилжихийг багасгах", actions: ["Оройн хоолны 2 бэлэн сонголт урьдчилж сонгох", "Ядарсан өдрийн нөөц сонголтыг бичиж хадгалах", "Орой 3 минут тэнхээ + өлсөлт шалгах"], track: ["Оройн тэнхээ", "Бэлэн сонголт", "Төлөвлөөгүй идэлт гарсан эсэх"], success: "Ядарсан өдөр ч дахин шийдвэр гаргах шаардлага багасна.", recovery: "Нэг өдөр хоол захиалсан бол дараагийн хоолыг шийтгэл биш, хэвийн үргэлжлэл болгоно." };
  }
  if (leverage.label === "anchor_meals_plus_planned_evening_option") {
    return { goal: "Орой нөхөх идэлт болон дараа өлсөхөөс хамгаалах хариуг багасгах", actions: ["Өдөрт 2 тогтмол хоол тогтоох", "5 цагаас дээш зай гарахаас өмнө жижиг гүүр зууш төлөвлөх", "Оройн бэлэн сонголт бэлдэх"], track: ["Хоолны зай", "Оройн өлсөлт", "Оройн төлөвлөөгүй идэлт"], success: "Оройн өлсөлт, яаралтай мэт мэдрэмж, нөхөх идэлт багасна.", recovery: "Тогтмол хоол алдсан өдөр оройг хатуу хорихгүй, бэлэн сонголтоо ашиглана." };
  }
  if (leverage.label === "planned_reward_system") {
    return { goal: "Таатай мэдрэмж авах хэрэгцээг санамсаргүй зууш биш төлөвлөсөн хэлбэрт оруулах", actions: ["Орой өөрийгөө баярлуулах жижиг сонголтоо урьдчилж сонгох", "Өөрийгөө баярлуулах хэрэгцээг өлсөлтөөс тусад нь нэрлэх", "Хоол захиалга эсвэл орчны дохионоос өмнө 3 минут завсарлах"], track: ["Өөрийгөө баярлуулах хүсэл", "Өлсөлт", "Орчны дохио"], success: "“Нэг гоё юм” хүсэл сохроор ажилладаг бэлэн сонголт биш болно.", recovery: "Хэтрүүлсэн өдөр маргааш бүрэн хорихгүй, таатай мэдрэмж авах сонголтоо дахин төлөвлөнө." };
  }
  if (leverage.label === "professional_check_first") {
    return { goal: "Биеийн дохиог аюулгүйгээр тодруулах", actions: ["Хоол холдоход гарсан шинжийг тэмдэглэх", "Хэмжсэн сахар/даралтын утгаа хадгалах", "Мэргэжлийн хүнтэй ярилцах товч нэгтгэл бэлдэх"], track: ["Биеийн дохио", "Хоолны зай", "Хэмжсэн сахар/даралт"], success: "Мацаг/хязгаарлалт эхлэхээс өмнө аюулгүй байдлын зураглал тодорно.", recovery: "Шинж хүчтэй бол жин хасалтын туршилтыг түр зогсоож, мэргэжлийн хүнтэй ярилцахыг түрүүнд тавина." };
  }
  return { goal: "Давтамжийг ичгүүр биш мэдээлэл болгож ажиглах", actions: ["Өдөр бүр 3 минут тайван шалгалт хийх", "Идэх хүсэл эхэлдэг нэг нөхцөлийг нэрлэх", "Дараагийн хоолыг хэвийн үргэлжлэл гэж харах"], track: ["Эхэлдэг нөхцөл", "Дараах нөлөө", "Хэвийн үргэлжлүүлэх дүрэм"], success: "Нэг алдаа бүхэл өдөр болох нь багасна.", recovery: "Алгассан өдөр бүтэлгүйтэл биш, дараагийн тэмдэглэлээс үргэлжлүүлнэ." };
}

function menstrualCycleContextHtml() {
  const evidence = menstrualCycleEvidence();
  if (!evidence.active) return "";
  const confidenceCopy = evidence.confidenceLow
    ? `<p>Мөчлөг тогтмол бус, дааврын жирэмслэлтээс хамгаалах хэрэгсэл, PCOS, төрсний дараах/хөхүүл үе, эсвэл перименопаузын нөхцөл байвал календарийн өдрөөр хатуу тайлбар хийхэд тохиромжгүй. Тиймээс энэ хэсгийг онош биш, зөвхөн ажиглах нэмэлт нөхцөл гэж үзээрэй.</p>`
    : "";
  const professionalCopy = evidence.tags.includes("amenorrhea_3_months") || evidence.tags.includes("restriction_exercise_cycle_disruption")
    ? `<p>Сарын тэмдэг ирэхгүй удах, мөчлөг огцом алдагдах нь хоол хасалт, жин огцом буурах, хэт их дасгал, стресс эсвэл бусад биеийн хүчин зүйлтэй давхцаж байвал эхлээд мэргэжлийн хүнтэй ярилцах нь зөв. Энэ тохиолдолд мацаг, огцом хязгаарлалт, өндөр ачаалалтай сорил санал болгохгүй.</p>`
    : "";
  const appetiteCopy = evidence.premenstrual
    ? `<p>Сарын тэмдэг ирэхийн өмнөх өдрүүдэд өлсөх мэдрэмж, амттай юм хүсэх, ядаргаа эсвэл сэтгэл санааны савлагаа нэмэгддэг гэж та тэмдэглэсэн байна. Энэ нь таны сул тал гэсэн үг биш. Зарим хүний идэх хүсэл мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог.</p><p>Тийм өдрүүдэд хэт хатуу хоолны дүрэм тавих нь “маргаашаас чанга барина” гэсэн тойргийг улам хүчтэй болгож магадгүй. Илүү зөв эхлэл нь урьдчилж бэлдсэн зөөлөн сонголт, тогтмол хоол, өөрийгөө буруутгахгүй тэмдэглэл байна.</p>`
    : `<p>Энэ давтамж мөчлөгийн тодорхой өдрүүдэд хүчтэй болох магадлалтай гэж тэмдэглэгдсэн байна. Энэ нь онош биш, гол шалтгааныг солих тайлбар биш. Харин тухайн өдрүүдэд бие, сэтгэл, нойр, идэх хүсэл яаж өөрчлөгддөгийг зөөлөн ажиглах нэмэлт нөхцөл юм.</p>`;
  return `
    <div class="report-section menstrual-cycle-note">
      <h3>Мөчлөгтэй холбоотой анхаарах зүйл</h3>
      ${appetiteCopy}
      ${confidenceCopy}
      ${professionalCopy}
    </div>
  `;
}

function menstrualCycleExperimentModifierHtml() {
  const evidence = menstrualCycleEvidence();
  if (!evidence.active || evidence.professionalFirst) return "";
  return `
    <div class="report-section menstrual-cycle-experiment">
      <h3>Мөчлөгтэй холбоотой өдрүүдэд</h3>
      <ul>
        <li>Хэт хатуу хязгаарлалт эхлүүлэхгүй.</li>
        <li>Тогтмол хоолны тулгуураа хадгална.</li>
        <li>Амттай зүйл хүсэхийг шууд хорихын оронд урьдчилсан жижиг сонголт бэлдэнэ.</li>
        <li>“Би сул байна” гэж дүгнэхгүй, тухайн өдрийн бие/сэтгэлийн дохио гэж тэмдэглэнэ.</li>
      </ul>
    </div>
  `;
}

function menstrualCycleProfessionalSummaryHtml() {
  const evidence = menstrualCycleEvidence();
  if (!evidence.professionalFirst) return "";
  return `
    <div class="report-section menstrual-cycle-note">
      <h3>Мөчлөгтэй холбоотой аюулгүй дараалал</h3>
      <p>Сарын тэмдэг ирэхгүй удах, мөчлөг огцом алдагдах, хоол хасалт, жин огцом буурах эсвэл хэт их дасгал давхцаж байгаа бол энэ хэсгийг ердийн жин хасалтын сорил гэж үзэхгүй. Эхлээд мэргэжлийн хүнтэй ярилцаж, хоол/дасгалын ачаалал биеийн дохиотой яаж холбоотой байж болохыг аюулгүйгээр тодруулах нь зөв.</p>
      <p>Энэ нь онош биш. Харин мацаг, огцом хязгаарлалт, өндөр ачаалалтай сорилыг түр хойшлуулж, биеийн аюулгүй байдлыг түрүүнд тавих сануулга юм.</p>
    </div>
  `;
}

function professionalCheckHtml(tags = allReportTags(), force = false) {
  if (!force && !tags.some(tag => ["glucose_like_signal", "bp_concern", "swelling_signal"].includes(tag))) return "";
  return `
    <div class="report-section">
      <h3>Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй дохио</h3>
      <p>Зарим хариултад эхлээд шалгуулахад илүүдэхгүй дохио гарч болно. Энэ нь онош гэсэн үг биш. Харин fasting, хоол алгасах, огцом restriction зэрэг буруу дарааллаар эхлэхээс хамгаалах зорилготой.</p>
      <p><strong>Шалгуулахад илүүдэхгүй дохио:</strong> биеийн дохио, сахар унах мэт санаа зовнил, даралт/хавангийн дохио тэмдэглэгдсэн байна.</p>
      <p><strong>Авч очих мэдээлэл:</strong></p>
      <ul><li>Хоол холдоход гарсан шинж</li><li>Хэмжсэн сахар/даралт байсан эсэх</li><li>Шинж гарсан өдөр, хоолны зай, эрч хүчний түвшин</li></ul>
      <p><strong>Одоогоор зайлсхийх арга:</strong> мацаг, хоол алгасах, хэт бага калорийн арга.</p>
    </div>
  `;
}

function bodySafetyPauseHtml(tags = unique([...allReportTags(), ...allStageReportTags()])) {
  const needsBodySafety = tags.some(tag => ["body_safety", "shame_guilt", "control_collapse", "identity_conflict"].includes(tag));
  if (!needsBodySafety) return "";
  return `
    <div class="report-section">
      <h3>Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ?</h3>
      <p>Жин хасах оролдлого таны хувьд зөвхөн биеийн хэмжээний асуудал биш, өөрийгөө харах, бусдад харагдах, ичгүүртэй холбогдож байж магадгүй.</p>
      <p>Доорх дохио илэрсэн байж болно: биеэ харахад тавгүй байх, зураг авахуулах/жин үзэхээс зайлсхийх, идсэний дараах ичгүүр, бүгдийг эсвэл юу ч биш гэж харах давтамж.</p>
      <p>Энэ нь онош биш. Харин ердийн жин хасалтын туршилтаас өмнө аюулгүй, хувийн дараалал хэрэгтэй гэсэн дохио юм.</p>
      <p><strong>Одоогоор зайлсхийх зүйлс:</strong></p>
      <ul>
        <li>Олон нийтэд өмнө/дараах зураг харуулах сорил</li>
        <li>өдөр бүр жингээ үзэж өөрийгөө шийтгэх</li>
        <li>Биеэ ичээх үг хэллэг</li>
        <li>Хэт огцом зорилт</li>
        <li>Ичгүүрээр шахдаг хяналт</li>
      </ul>
      <p><strong>Эхэлж өөрчлөх хамгийн амар цэг:</strong> эхлээд мэргэжлийн хүнтэй ярилцах, хувийн тэмдэглэл, биеэ буруутгахгүй хэмжүүр, тайван ажиглалт.</p>
    </div>
  `;
}

function compressedSecondaryPatterns(ranked = []) {
  return ranked
    .slice(1)
    .filter(item => ["strong", "moderate"].includes(item.evidenceLabel) || item.score >= 2)
    .slice(0, 2);
}

function selectedHiddenFunctions(primaryKey, secondaryKeys = [], tags = allReportTags()) {
  const selected = new Set([primaryKey, ...secondaryKeys]);
  const candidates = [
    { keys: ["reward", "rewardDeficit"], tag: "reward_pull", name: "Таатай мэдрэмж авах", evidence: "Амттай зүйл, уйдалт, өдрийн төгсгөлийн өөрийгөө баярлуулах хэрэгцээ идэх хүсэлтэй давхцаж байна." },
    { keys: ["hungerSafety"], tag: "hunger_safety", name: "Дараа өлсөхөөс хамгаалах", evidence: "Хоолны зай, өндөр өлсөлт, дараа өлсөхөөс санаа зовох хариу давхцаж байна." },
    { keys: ["executive", "decisionDefault"], tag: "default_delivery", name: "Олон шийдвэрийн дараах ядаргаанаас гарах", evidence: "Ядарсан үед хамгийн амар бэлэн сонголт илүү хүчтэй болж байна." },
    { keys: ["regulation"], tag: "food_as_regulation", name: "Сэтгэл санааг түр тогтворжуулах", evidence: "Стресс эсвэл мэдрэмж өндөр үед хоол түр амсхийх үүрэгтэй байж магадгүй." },
    { keys: ["social"], tag: "social_pressure", name: "Хүмүүсийн дунд татгалзахгүй байх", evidence: "Social pressure эсвэл татгалзах эвгүй мэдрэмж идэх сонголтод нөлөөлж байна." },
    { keys: ["collapse", "shameAvoidance"], tag: "shame_guilt", name: "Ичих, нуух мэдрэмжээс зай авах", evidence: "Төлөвлөгөө бага зэрэг алдагдсаны дараах гэмшил, өөрийгөө буруутгах мэдрэмж дараагийн сонголтыг хүндрүүлж байна." },
    { keys: ["roleOverload", "rewardDeficit"], tag: "role_overload", name: "Өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх хариу", evidence: "Бусдын хэрэгцээ, өөрийн цаг/хоол хойшлох үед оройн идэлт нөхөх үүрэгтэй болж байна." },
    { keys: ["bodySafety", "shameAvoidance"], tag: "body_safety", name: "Бусдын хараанаас аюулгүй зай авах", evidence: "Өөрийгөө харах, бусдад харагдах, ичгүүр хоол/жинтэй холбогдож байна." },
    { keys: ["circadian"], tag: "circadian_crash", name: "Нойр/эрч хүчний хэмнэл нөхөх", evidence: "Нойр, кофеин, өглөөний хоолгүй хэмнэл, оройн тэнхээний уналт идэх хүсэл болон бэлэн сонголттой давхцаж байна." },
    { keys: ["circadian"], tag: "executive_load", name: "Тэнхээ нөхөх", evidence: "Тэнхээний уналт оройн идэх хүсэл болон бэлэн сонголттой давхцаж байна." },
    { keys: ["glucose", "physiological"], tag: "physiological_reactivity", name: "Биеийн таагүй мэдрэмжийг намдаах", evidence: "Хоол холдох үед биеийн дохио анзаарагдсан байна." }
  ];
  return candidates
    .filter(item => item.keys.some(key => selected.has(key)) || tags.includes(item.tag))
    .slice(0, 3);
}

function compressedSurfaceBehaviors(primaryKey, tags = allReportTags()) {
  return surfaceBehaviors(state.diaryEntries, tags)
    .filter(item => !item.includes("илүү тод харахад"))
    .slice(0, 3);
}

function refinementBullets(primary, secondary = []) {
  const items = [primary, ...secondary].filter(Boolean).slice(0, 2).map(item => {
    const short = publicMechanismShort(item.key);
    return `${short} яг ямар өдөр, ямар нөхцөлд давтагддагийг харна.`;
  });
  items.push("Өмнөх 30 минут, оройн тэнхээ, орчны дохио, бэлэн сонголтын нөхцөлийг тэмдэглэл дээр тодруулна.");
  return items.slice(0, 3);
}

function renderQpayLinks(invoice = {}) {
  const urls = Array.isArray(invoice.urls) ? invoice.urls : [];
  if (!urls.length) return "";
  return `<div class="pill-row">${urls.map((item, index) => {
    const label = escapeHtml(item.name || item.description || `Банк ${index + 1}`);
    const link = escapeAttr(item.link || item.url || item.deeplink || "#");
    return `<a class="pill" href="${link}" target="_blank" rel="noopener">${label}</a>`;
  }).join("")}</div>`;
}

function normalizeQpayQrImage(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.startsWith("data:") || text.startsWith("http://") || text.startsWith("https://")) return text;
  return `data:image/png;base64,${text}`;
}

function renderWeightQpayPaymentBox() {
  const payment = state.qpayPayment || initialState.qpayPayment;
  const invoice = payment.invoice || null;
  const busy = payment.status === "creating" || payment.status === "checking";
  const qrImage = normalizeQpayQrImage(invoice?.qrImage);
  const oneTimePrice = currentOneTimePriceLabel();
  return `
    <div class="stack">
      ${payment.message ? `<p class="${payment.status === "error" ? "danger-copy" : "muted"}">${escapeHtml(payment.message)}</p>` : ""}
      ${invoice ? `
        <div class="card stack">
          ${qrImage ? `<img src="${escapeAttr(qrImage)}" alt="QPay QR код" class="qpay-qr">` : `<p class="muted">QR үүслээ. Банкны апп-аар төлбөрөө үргэлжлүүлнэ үү.</p>`}
          ${renderQpayLinks(invoice)}
          <p class="muted">Лавлах дугаар: ${escapeHtml(invoice.senderInvoiceNo || invoice.invoiceId || "")}</p>
        </div>
      ` : ""}
      <div class="actions">
        ${invoice
          ? `<button class="button secondary" onclick="checkWeightQpayPayment()" ${busy ? "disabled" : ""}>${busy ? "Шалгаж байна..." : "Дахин шалгах"}</button>`
          : `<button class="button secondary" onclick="createWeightQpayInvoice()" ${busy ? "disabled" : ""}>${busy ? "QR үүсгэж байна..." : `${oneTimePrice} төлөөд бүрэн тайлангаа нээх`}</button>`}
        ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('one-time')">Дотоод туршилтаар нээх</button>`)}
        <button class="button ghost" onclick="setView('choice')">Сонголт руу буцах</button>
      </div>
    </div>
  `;
}

function currentOneTimePriceLabel() {
  return state.coachDiscountConsent && state.coachInvite ? PRICING.coachOneTime : PRICING.oneTime;
}

function currentOneTimePriceMnt() {
  return state.coachDiscountConsent && state.coachInvite ? COACH_WEIGHT_PRICE_MNT : STANDARD_WEIGHT_PRICE_MNT;
}

function renderOneTimePaywall({ mode, primary, primaryMechanism, tags }) {
  const previewName = primary ? publicMechanismName(primary.key) : "Хамгийн түрүүнд нэг давтамж харагдаж байна";
  const previewInsight = primary ? livedExplanationFor(primary.key) : "Таны хариултаас нэг давтагддаг нөхцөл харагдаж байна.";
  const priceLabel = currentOneTimePriceLabel();
  const priceCaption = state.coachDiscountConsent && state.coachInvite ? "Coach-ийн хөнгөлөлттэй үнэ" : "Төлөх үнэ";
  return `
    ${topbar(100, "Тайлангийн эхний хэсэг")}
    <section class="screen">
      <div class="panel stack paywall-panel">
        <div class="report-section">
          <p class="choice-kicker">Эхний дохио</p>
          <h2>Таны эхний зураглал бэлэн боллоо</h2>
          <p class="muted">Бүрэн тайланг нээхээс өмнө харагдаж буй эхний дохио:</p>
          <div class="card">
            <h3>Хамгийн түрүүнд харагдаж буй зүйл</h3>
            <p><strong>${escapeHtml(previewName)}</strong></p>
            <p>${escapeHtml(previewInsight)}</p>
          </div>
          ${mode.mode === "check" ? `<p class="danger-copy">Нэг зүйл тод харагдаж байна. Нэмэлтээр нэг биеийн дохиог шалгуулахад илүүдэхгүй. Энэ нь онош гэсэн үг биш.</p>` : ""}
        </div>
        <div class="report-section">
          <h3>Бүрэн тайланд юу нээгдэх вэ?</h3>
          <p>Таны эхний зураглал бэлэн боллоо. Бүрэн тайланд давтагдаж байгаа гол шалтгаан, хоол тухайн үед танд юу “хийж өгдөг” байсан, юунаас эхэлж өөрчлөх нь илүү амар байхыг харуулна.</p>
          <ul>
            <li>Хамгийн тод давтагддаг нөхцөл</li>
            <li>Давхар нөлөөлж буй 1–2 зүйл</li>
            <li>Одоогоор зайлсхийх зүйлс</li>
            <li>Эхний зөөлөн алхам</li>
            <li>14 хоногийн эхний туршилт</li>
            <li>7 хоногийн гүн анализ руу шилжих боломж</li>
          </ul>
        </div>
        <div class="report-section">
          <h3>Нээх үнэ</h3>
          <div class="price-stack">
            <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.oneTimeAnchor}</p>
            <p class="price promo"><span>${priceCaption}</span> ${priceLabel}</p>
          </div>
          ${renderWeightQpayPaymentBox()}
        </div>
      </div>
    </section>
  `;
}

function renderUpgradeOffer() {
  if (!hasOneTimeReportAccess() || hasSevenDayAccess()) return "";
  return `
    <div class="report-section paywall-panel">
      <p class="choice-kicker">7 хоногоор нарийвчлах</p>
      <h3>Энэ зураглалыг 7 хоногоор илүү тодруулж болно</h3>
      <p class="price"><span class="price-label">Нарийвчлах үнэ:</span> ${PRICING.upgrade}</p>
      <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p>
      <p class="muted">7 хоногийн богино тэмдэглэл нь давтамж яг ямар өдөр, ямар нөхцөлд давтагддагийг нарийвчилна.</p>
      <div class="actions">
        <button class="button secondary" onclick="startSevenDayRefinement()">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button>
      </div>
    </div>
  `;
}

function renderUpgradePaywall() {
  return `
    ${topbar(100, "7 хоногоор нарийвчлах")}
    <section class="screen">
      <div class="panel stack paywall-panel">
        <p class="choice-kicker">7 хоногоор нарийвчлах</p>
        <h2>Энэ зураглалыг 7 хоногоор илүү тодруулж болно</h2>
        <p class="price"><span class="price-label">Нарийвчлах үнэ:</span> ${PRICING.upgrade} <span>7 хоногийн нээлтийн үнэ ${PRICING.sevenDay}</span></p>
        <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p>
        <ul>
          <li>Орой бүр 3–5 минутын богино тэмдэглэл</li>
          <li>Идэх хүсэл эхэлдэг нөхцлийн зураглал</li>
          <li>Эхний зураглал ба бодит ажиглалтын харьцуулалт</li>
          <li>Идэх хүсэл яг ямар хэрэгцээтэй давхцаж байгааг нарийвчлах</li>
          <li>Илүү тод 14 хоногийн туршилт</li>
        </ul>
        <div class="actions">
          <button class="button secondary" onclick="startLeadCapture('upgrade')">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button>
          ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('upgrade')">Дотоод туршилтаар нээх</button>`)}
          <button class="button ghost" onclick="setView('report')">Тайлан руу буцах</button>
        </div>
        <p class="muted">Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна.</p>
      </div>
    </section>
  `;
}

function livedExplanationFor(primaryKey) {
  return {
    executive: "Та юу хийхээ мэдэхгүйдээ биш. Харин өдөржин олон шийдвэр гаргасны дараа орой дахин хоол бодож, сонгож, бэлдэх тэнхээ үлдэхгүй байна. Тэр үед хамгийн амар сонголт л ялж байна.",
    decisionDefault: "Төлөвлөгөө муу байгаадаа биш. Харин ядарсан үед нүдэнд харагдаж, гарын дор байгаа сонголт бусдаас түрүүлж ялж байна.",
    reward: "Таны оройн идэлт зөвхөн өлссөнөөс биш, өдөржин хуримтлагдсан ядаргаа, амсхийх хүсэл, ‘нэг гоё юм’ авах хэрэгцээтэй давхцаж байна.",
    rewardDeficit: "Өдөржин өөртөө нэг ч таатай зүйл өгөөгүй мэт санагдах үед орой хоол амралт, шагнал, өөрийн цагийн оронд орж байна.",
    regulation: "Сэтгэл тавгүй, дотор давчуу үед хоол идсэний дараа хэсэг намдах шиг болдог мөч давтагдаж байна.",
    hungerSafety: "Өдөр хоол хойшлох эсвэл дараагийн хоол тодорхойгүй болох үед орой идэхээ барихад илүү хэцүү болж байна.",
    collapse: "Нэг удаа төлөвлөгөөнөөсөө хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодогдоод дараагийн хоолноос хэвийн үргэлжлэхэд хэцүү болдог мөч байна.",
    circadian: "Нойр, кофеин, оройн тэнхээний уналт давхцах үед идэх хүсэл илүү амархан нэмэгдэж байна.",
    cue: "Хоол харагдах, үнэртэх, захиалгын апп нээгдэх зэрэг жижиг дохио идэх хүслийг эхлүүлж байна.",
    social: "Хүмүүстэй байх үед татгалзах эвгүй, хамт идэх нь амар санагдах мөч идэх сонголтод нөлөөлж байна.",
    bodySafety: "Биеэ жинлэх, зураг авахуулах, бусдад харагдах тухай бодол таагүй болоход хоол, жинтэй холбоотой дарамт нэмэгдэж байна.",
    glucose: "Хоол холдох үед гар салгалах, толгой эргэх, сахар унасан мэт мэдрэмж зэрэг биеийн дохио таны сонголтод нөлөөлж байна."
  }[primaryKey] || "Таны хариултаас нэг давтагддаг нөхцөл тод харагдаж байна. Энэ нь сул тал гэхээсээ илүү таны өдөр тутмын ачаалал, мэдрэмж, орчны сонголт хоорондоо хэрхэн давхцаж байгааг харуулж байна.";
}

function ordinaryReportOpeningTitle(primaryKey, tags = []) {
  if (primaryKey === "executive" || primaryKey === "decisionDefault" || tags.includes("executive_load") || tags.includes("default_delivery")) {
    return "Таны хариултаас оройн тэнхээ багасах үе тод харагдаж байна";
  }
  if (primaryKey === "regulation" || tags.includes("food_as_regulation")) {
    return "Хоол зарим үед өлсөлтөөс илүү тайвшрах хэрэгцээтэй холбогдож байна";
  }
  if (primaryKey === "collapse" || primaryKey === "perfectionism" || tags.includes("control_collapse")) {
    return "Хэт чанга эхлээд, бага зэрэг хазайхад нурсан мэт мэдрэгдэх тойрог харагдаж байна";
  }
  if (primaryKey === "hungerSafety" || tags.includes("hunger_safety")) {
    return "Хоол холдох, дараа өлсөхөөс санаа зовох давтамж тодорч байна";
  }
  if (primaryKey === "reward" || primaryKey === "rewardDeficit" || tags.includes("reward_pull")) {
    return "Өдөржин өөртөө амрах, баярлах зай бага үлдэх үе тод харагдаж байна";
  }
  if (primaryKey === "cue" || tags.includes("cue_trigger")) {
    return "Орчны дохио идэх хүслийг эхлүүлдэг үе тодорч байна";
  }
  return "Таны жин хасалтыг гацааж байж болох гол нөхцөл тодорлоо";
}

const REPORT_VOICE_LIBRARY = {
  executive: {
    opening: [
      "Өдөр дуусах үед хоолны асуудал зөвхөн өлссөн эсэхээр шийдэгдэхгүй байна. Өдөржин олон зүйл бодож, шийдэж, зохицуулсны дараа орой дахин “юу идэх вэ?” гэж бодох өөрөө нэг ачаалал болж байна.",
      "Тэр үед та юу хийхээ мэдэхгүйдээ биш. Харин тэнхээ багассан үед хамгийн бага бодол, хамгийн бага хөдөлгөөн шаардсан сонголт л түрүүлж байна."
    ],
    needs: [
      "Дахин шийдвэр гаргах ачааллаас түр чөлөөлөх",
      "Оройн ядаргаанд хурдан хариу өгөх",
      "Бэлэн, амар зүйлээр түр амсхийлгэх"
    ],
    cycle: [
      "Өдөр олон зүйл шийдэж өнгөрнө",
      "Орой болоход хоол бодох зай багасна",
      "Бэлэн сонголт хамгийн амар харагдана",
      "Хоол захиалах эсвэл зууш авах шийдвэр хурдан гарна",
      "Түр амарсан мэт болно",
      "Дараа нь “маргааш өөрөөр хийнэ” гэж бодогдоно",
      "Маргааш орой бэлэн зам байхгүй бол тойрог дахин эхэлнэ"
    ],
    notProblem: "Энд гол нь мэдэхгүйдээ биш. Орой тэнхээ багасах үед дахин шийдвэр гаргах ачаалал нэмэгдэж, хамгийн амар сонголт л түрүүлж байна.",
    avoid: ["Орой дахин олон сонголт гаргах төлөвлөгөө", "Хэт төвөгтэй хоол бэлдэх систем", "Өдөр бүр төгс хийх шаардлага", "Оройн хоолыг шууд бүрэн хорих"],
    firstStep: "Эхний жижиг өөрчлөлт бол орой дахин шийдвэр гаргахгүй байх хоёр бэлэн зам бэлдэх. “Юу идэх вэ?” гэдэг асуултыг орой биш, тэнхээтэй үедээ урьдчилж шийднэ.",
    experiment: [
      ["Эхний 3 өдөр", "орой идэж болох 2 бодит сонголтоо бич. Хэт төгс биш, үнэхээр авч хэрэгжүүлж чадах сонголт байна."],
      ["4–10 дахь өдөр", "ядарсан орой бүр тэр хоёрын аль нэгийг ашигла. Хэрвээ захиалга авбал ч шийтгэл болгохгүй, дараагийн хоолноос хэвийн үргэлжлүүл."],
      ["11–14 дахь өдөр", "аль сонголт хамгийн бага бодол шаардсан, аль нь бодит амьдралд таарсан гэдгийг тэмдэглэ."],
      ["Хэрвээ нэг өдөр алгасвал", "маргааш илүү чанга барих биш, бэлэн хоёр сонголт руугаа буц."]
    ]
  },
  regulation: {
    opening: [
      "Стресс өндөр үед хоол танд зөвхөн өлсөлт дарах зүйл биш болж байна. Дотор давчдах, уурлах, санаа зовох, ядрах үед хоол богино хугацаанд амсхийх газар шиг ажиллаж байгаа нь харагдана.",
      "Идсэний дараа хэсэг тайвшрах ч дараа нь гэмших, санаа зовох мэдрэмж нэмэгдвэл энэ тойрог улам ядаргаатай болдог."
    ],
    needs: [
      "Сэтгэл тавгүй үед түр намдах мэдрэмж өгөх",
      "Доторх ачааллыг богино хугацаанд зөөллөх",
      "Яг тэр мөчид амсхийх боломж өгөх"
    ],
    cycle: [
      "Стресс эсвэл сэтгэлийн ачаалал нэмэгдэнэ",
      "Дотор давчдах, тавгүйрхэх мэдрэмж хүчтэй болно",
      "Хоол хамгийн хурдан тайвшруулах зүйл шиг санагдана",
      "Идсэний дараа хэсэг намдана",
      "Дараа нь гэмших эсвэл санаа зовох мэдрэмж нэмэгдэж болно",
      "Стресс өөрөө хэвээр байвал дараагийн удаа хоол дахин хамгийн ойрын арга болж харагдана"
    ],
    notProblem: "Асуудал хоолондоо биш байж магадгүй. Гол нь стресс эсвэл мэдрэмж өндөр үед хоол хамгийн хурдан амсхийх газар болж байна.",
    avoid: ["Илүү хатуу хоолны дэглэмийг бэлэн шийдэл болгох", "Стрессийн мөчид зөвхөн тэвчих гэж шахах", "Гэмшлээр өөрийгөө хөдөлгөх", "Мэдрэмжээ огт нэрлэхгүй орхих"],
    firstStep: "Эхний жижиг өөрчлөлт бол хоолноос өмнө заавал тэсэх биш. Харин “би яг одоо өлсөж байна уу, эсвэл амсхийх газар хайж байна уу?” гэж 60 секунд ялгах.",
    experiment: [
      ["Эхний 3 өдөр", "идэх хүсэл стрессийн дараа гарсан эсэхийг л тэмдэглэ. Засах гэж бүү оролд."],
      ["4–10 дахь өдөр", "хоолноос өмнө 60 секунд амьсгаа авах, ус уух, алхах, хүн рүү бичих зэрэг нэг богино амсхийх сонголт турш."],
      ["11–14 дахь өдөр", "аль жижиг амсхийх арга хамгийн бодитой байсныг сонго."],
      ["Хэрвээ нэг өдөр алгасвал", "тэр өдрийг бүтэлгүйтэл гэж үзэхгүй. Дараагийн стрессийн мөч дээр дахин 60 секундээс эхэл."]
    ]
  },
  collapse: {
    opening: [
      "Таны хариултаас нэг зүйл тод байна: асуудал ганц удаа төлөвлөгөөнөөс хазайсандаа биш. Харин тэр мөчөөс хойш “өнөөдөр өнгөрлөө” гэж мэдрэгдэхэд дараагийн хоолноос хэвийн үргэлжлэх зам харагдахгүй болж байна.",
      "Хэт чанга эхлэх тусам жижиг хазайлт том алдаа шиг санагдаж, маргаашаас бүр чанга барих бодол эргээд тойргийг дахин эхлүүлж байна."
    ],
    needs: [
      "“Нэгэнт алдсан” гэсэн дарамтаас түр холдох",
      "Хэт чанга дүрмийн эсрэг түр сулрах",
      "Өөрийгөө буруутгах мэдрэмжээс хэсэг зай авах"
    ],
    cycle: [
      "Шинэ төлөвлөгөө хэт чанга эхэлнэ",
      "Бага зэрэг хазайх мөч гарна",
      "“Өнөөдөр өнгөрлөө” гэж бодогдоно",
      "Дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрнэ",
      "Илүү их идэх эсвэл бүхлээр нь орхих хандлага гарна",
      "Дараа нь гэмшил нэмэгдэнэ",
      "Маргаашаас илүү чанга барина гэж бодно",
      "Хэт чанга эхлэл дахин давтагдана"
    ],
    notProblem: "Асуудал нэг удаа төлөвлөгөө алдсандаа биш. Гол нь нэг хазайлт бүхэл өдөр дууссан мэт санагдаж, буцах жижиг зам харагдахгүй болох мөч байна.",
    avoid: ["Төгс төлөвлөгөө", "Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил", "Ичгүүрээр шахдаг хяналт", "Алдаагаа нөхөх гэж маргааш нь илүү чангаруулах"],
    firstStep: "Эхний жижиг өөрчлөлт бол төгс төлөвлөгөө биш. Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй болох.",
    experiment: [
      ["Эхний 3 өдөр", "“70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь."],
      ["4–10 дахь өдөр", "төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Нөхөх гэж мацаг барихгүй."],
      ["11–14 дахь өдөр", "“өнөөдөр өнгөрлөө” бодол хэдэн удаа гарсан, хэдэн удаа дараагийн хоолноос үргэлжлүүлж чадсанаа тэмдэглэ."],
      ["Хэрвээ нэг өдөр алгасвал", "маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл."]
    ]
  },
  hungerSafety: {
    opening: [
      "Хоол холдох үед таны идэлт зөвхөн тухайн мөчийн өлсөлтөөр шийдэгдэхгүй байна. Дараа хэзээ идэх нь тодорхойгүй, эсвэл дахиад өлсөх вий гэсэн мэдрэмж нэмэгдэхэд бие өөрийгөө хамгаалах гэж илүү идэх тал руу хэлбийж байна.",
      "Энэ нь сул тал биш. Хоолны хэмнэл тогтворгүй үед бие “дараа дахиад өлсөнө” гэж урьдчилж хамгаалж байж магадгүй."
    ],
    needs: ["Дараа өлсөхөөс хамгаалах", "Биеийн аюулгүй мэдрэмжийг түр сэргээх", "Оройн хүчтэй өлсөлтийг хурдан намдаах"],
    cycle: [
      "Өдөр хоол холдоно",
      "Орой өлсөлт, яаралтай мэдрэмж нэмэгдэнэ",
      "“Дараа дахиад өлсөх вий” гэсэн хамгаалах бодол орж ирнэ",
      "Бэлэн байгаа хоол илүү татна",
      "Илүү их идсэний дараа бие түр тайвширна",
      "Маргааш дахин хасвал орой ижил тойрог эхэлнэ"
    ],
    notProblem: "Асуудал орой идсэндээ биш байж магадгүй. Гол нь хоолны зай хэт холдох үед бие хамгаалах горим руу орж байна.",
    avoid: ["Урт мацаг", "Өдөр хоол алгасах", "“Өлсвөл тэс” гэж өөрийгөө хүчлэх", "Оройн зуушийг шууд бүрэн хорих"],
    firstStep: "Эхний жижиг өөрчлөлт бол оройг хорих биш. Өдрийн хоолны зайг хэт холдуулахгүй нэг тулгуур хоол, нэг жижиг гүүр сонголт бэлдэх.",
    experiment: [
      ["Эхний 3 өдөр", "хоол хооронд хэдэн цагийн зай гарч байгааг л тэмдэглэ."],
      ["4–10 дахь өдөр", "5 цагаас дээш зай гарахаас өмнө жижиг гүүр сонголт ашигла."],
      ["11–14 дахь өдөр", "оройн өлсөлт, яаралтай идмээр мэдрэмж багассан эсэхийг хар."],
      ["Хэрвээ нэг өдөр алгасвал", "оройг шийтгэл болгохгүй. Дараагийн өдөр нэг тулгуур хоолноос эхэл."]
    ]
  },
  rewardDeficit: {
    opening: [
      "Таны хариултаас өдөржин өөрийн хэрэгцээ хамгийн сүүлд үлддэг өдөр олон байж магадгүй нь мэдрэгдэж байна. Хоол, амралт, өөртөө өгөх жижиг таатай зүйл хойшлогдсоор орой болоход амттай юм “надад ч гэсэн нэг юм хэрэгтэй” гэсэн мэдрэмжтэй холбогдож байна.",
      "Энэ нь зүгээр амттан хүссэн асуудал биш. Өдөржин өөрийгөө хойш тавьсны дараа хоол өөртөө өгөх хамгийн хурдан, хамгийн ойрын жижиг шагнал болж байна."
    ],
    needs: ["Өөртөө өгөх жижиг таатай мөч", "Өдөржин хойш тавьсан хэрэгцээг түр нөхөх", "“Миний цаг” гэсэн мэдрэмжийг богино хугацаанд өгөх"],
    cycle: [
      "Өдөр бусдын хэрэгцээ түрүүлнэ",
      "Өөрийн хоол, амралт, таатай зүйл хойш тавигдана",
      "Орой болоход хоосон, ядарсан, гомдолтой мэдрэмж хуримтлагдана",
      "Амттай зүйл өөртөө өгөх хамгийн ойрын шагнал шиг санагдана",
      "Идсэний дараа хэсэг таатай болно",
      "Дараа нь өөрийгөө буруутгах бодол орж ирж магадгүй",
      "Маргааш өөрийн хэрэгцээ дахин хойшлогдвол тойрог давтагдана"
    ],
    notProblem: "Асуудал амттай юманд дуртайдаа биш. Өөрийн хоол, амралт, жижиг таатай мөч өдөржин хойшлогдох үед орой хоол хамгийн ойрын нөхөх арга болж байна.",
    avoid: ["“Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө", "Өөрийн хоолыг үлдэгдэл цагт найдах", "Оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих", "Хэт хатуу хоолны дэглэм"],
    firstStep: "Эхний жижиг өөрчлөлт бол “өөртөө цаг гарга” гэсэн том зөвлөгөө биш. Өдөр бүр өөрийн хоол эсвэл амралтын 10 минутыг үлдэгдэл цагт найдахгүй хамгаалах.",
    experiment: [
      ["Эхний 3 өдөр", "өдөрт өөрийн төлөө хамгаалж болох хамгийн жижиг 10 минутыг сонго."],
      ["4–10 дахь өдөр", "тэр 10 минутыг хоол, цай, алхалт, тайван суухын аль нэгээр ашигла."],
      ["11–14 дахь өдөр", "өөрийн хэрэгцээг өдөрт багахан ч гэсэн түрүүлж тавьсан өдөр оройн идэх хүсэл яаж өөрчлөгдсөнийг тэмдэглэ."],
      ["Хэрвээ нэг өдөр алгасвал", "өөрийгөө буруутгахгүй. Дараагийн өдөр дахин 10 минутаас эхэл."]
    ]
  },
  cue: {
    opening: [
      "Таны хариултаас өлсөөгүй байсан ч хоол харагдах, үнэртэх, захиалгын апп нээгдэх, зууш гарын дор байх үед идэх бодол өөрөө орж ирдэг нь мэдрэгдэж байна.",
      "Энд гол нь хүсэл зориг сулдаа биш. Орчин өөрөө идэх шийдвэрийг таны өмнөөс эхлүүлээд байна."
    ],
    needs: ["Харагдсан зүйлд шууд хариу өгөх", "Бодолгүйгээр хурдан таатай мэдрэмж авах", "Гарын дор байгаа амар сонголтыг ашиглах"],
    cycle: [
      "Хоол, зууш, үнэр, зураг эсвэл захиалгын апп ойр байна",
      "Өлсөөгүй байсан ч идэх бодол орж ирнэ",
      "“Нэгийг авчихъя” гэсэн жижиг шийдвэр хурдан гарна",
      "Идсэний дараа түр таатай мэдрэмж өгнө",
      "Орчны дохио хэвээр үлдвэл дараагийн удаа дахин амархан давтагдана"
    ],
    notProblem: "Асуудал хүсэл зориг сулдаа биш. Орчны дохио идэх шийдвэрийг түрүүлж асааж байгаа учраас хамгийн ойрын нэг дохиог өөрчлөх нь эхний бодит алхам байна.",
    avoid: ["Бүх амттай зүйлийг нэг дор хорих", "Гарын дорх дохиог хэвээр үлдээгээд зөвхөн тэвчих", "Өдөр бүр бүх орчноо төгс өөрчлөх гэж зүтгэх", "Өлсөөгүй идсэнээ зан чанарын алдаа гэж үзэх"],
    firstStep: "Эхний жижиг өөрчлөлт бол бүх амттай зүйлийг хорих биш. Хамгийн хүчтэй нөлөөлдөг нэг дохиог нэг алхам холдуулж, илүү тохирох нэг сонголтыг нэг алхам ойртуулах.",
    experiment: [
      ["Эхний 3 өдөр", "хамгийн их нөлөөлдөг нэг дохиог сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга."],
      ["4–10 дахь өдөр", "тэр дохиог нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь."],
      ["11–14 дахь өдөр", "“хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ."],
      ["Хэрвээ нэг өдөр алгасвал", "бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг дохио руугаа буц."]
    ]
  },
  circadian: {
    opening: [
      "Нойр муу, оройн тэнхээ багасах, кофеин, өглөөний хоолгүй эхлэх зэрэг нь таны идэх хүсэлтэй холбогдож байна. Ийм өдөр амттай юм руу татагдах нь зөвхөн дуршил биш, бие тэнхээ нөхөх гэж байгаа дохио байж магадгүй.",
      "Тиймээс эхний өөрчлөлт зөвхөн хоол хорих биш. Өдрийн хэмнэл, кофеин, оройн унтраах зан үйлтэй хамт харах хэрэгтэй."
    ],
    needs: ["Тэнхээний уналтыг түр нөхөх", "Нойр дутуу өдрийн ядралтад хурдан хариу өгөх", "Оройн хоосон, сул мэдрэмжийг зөөллөх"],
    cycle: [
      "Нойр дутуу эсвэл чанар муутай хононо",
      "Өдөр тэнхээ бага, кофеин эсвэл амттай зүйл илүү татна",
      "Орой болоход бие амархан сулрана",
      "Амттай, тослог, хурдан зүйл илүү хүчтэй санагдана",
      "Идсэний дараа түр тэнхээ орсон мэт болно",
      "Хэмнэл өөрчлөгдөхгүй бол маргааш дахин давтагдана"
    ],
    notProblem: "Асуудал амттай юм хүссэндээ биш байж магадгүй. Нойр, кофеин, өдрийн эхний хоол, оройн тэнхээ хамт нөлөөлж байна.",
    avoid: ["Оройн хоолыг шууд бүрэн хорих", "Орой кофеин уух", "Өглөө/өдөр хоол алгасаад орой тэсэх", "Нойр муу үед хатуу хоолны дэглэм эхлүүлэх"],
    firstStep: "Эхний жижиг өөрчлөлт бол амттай зүйлээ шууд хорих биш. Өдрийн эхний тогтмол хоол, кофеиний хил, орой унтраах 10 минутын зан үйлийг хамтад нь турших.",
    experiment: [
      ["Эхний 3 өдөр", "нойр, кофеин уусан цаг, оройн тэнхээг л тэмдэглэ."],
      ["4–10 дахь өдөр", "үдээс хойш кофеин уух хязгаар тавьж, орой унтраах 10 минутын зан үйл турш."],
      ["11–14 дахь өдөр", "нойр муу өдөр амттай юм руу татагдах хүч өөрчлөгдсөн эсэхийг хар."],
      ["Хэрвээ нэг өдөр алгасвал", "нойр муу өдөр өөрийгөө шийтгэхгүй. Дараагийн орой 10 минутын зан үйлээс эхэл."]
    ]
  }
};

function selectReportVoiceKey(primaryKey, tags = []) {
  if (primaryKey === "roleOverload" || primaryKey === "rewardDeficit" || tags.includes("role_overload")) return "rewardDeficit";
  if (primaryKey === "cue" || tags.includes("cue_trigger")) return "cue";
  if (primaryKey === "collapse" || primaryKey === "perfectionism" || tags.includes("control_collapse")) return "collapse";
  if (primaryKey === "regulation" || tags.includes("food_as_regulation")) return "regulation";
  if (primaryKey === "hungerSafety" || tags.includes("hunger_safety") || tags.includes("meal_gap_5h_plus") || tags.includes("skipped_meal")) return "hungerSafety";
  if (primaryKey === "circadian" || tags.includes("circadian_crash")) return "circadian";
  if (primaryKey === "reward" || tags.includes("reward_pull")) return "rewardDeficit";
  return "executive";
}

function reportVoiceFor(primaryKey, tags = []) {
  const voiceKey = selectReportVoiceKey(primaryKey, tags);
  return {
    key: voiceKey,
    ...REPORT_VOICE_LIBRARY[voiceKey]
  };
}

function reportEvidenceNote(voiceKey, isOneTime) {
  if (isOneTime) {
    return "Энэ эхний зураглал таны хариулт болон баталгаажуулсан тайлбар дээр суурилсан. 7 хоногийн тэмдэглэл хийвэл яг ямар өдөр, ямар нөхцөлд давтагдаж байгааг илүү тодруулна.";
  }
  return {
    executive: "Тэмдэглэлд оройн тэнхээ, хоолны зай, бэлэн сонголт давхцах үед төлөвлөөгүй идэлт илүү ойртсон байна.",
    regulation: "Тэмдэглэлд стресс, тавгүй мэдрэмж, идсэний дараах түр намдах мэдрэмж хэд хэдэн өдөр давхцсан байна.",
    collapse: "Хариултад хэт чанга эхлэх, бага зэрэг хазайхад “өнөөдөр өнгөрлөө” гэж мэдрэгдэх дохио тодорсон байна.",
    hungerSafety: "Тэмдэглэлд хоолны зай холдох, оройн өлсөлт, яаралтай идмээр мэдрэмж хэд хэдэн өдөр давхцсан байна.",
    rewardDeficit: "Хариултад өөрийн хоол, амралт, таатай мөч хойшлогдох үед оройн амттай зүйл илүү хүчтэй татдаг зураг харагдсан байна.",
    cue: "Хариултад хоол харагдах, үнэртэх, захиалгын апп эсвэл зууш ойр байх үед идэх бодол амархан асдаг дохио гарсан байна.",
    circadian: "Тэмдэглэлд нойр, кофеин, оройн тэнхээний уналт, амттай зүйл рүү татагдах мэдрэмж давхцсан байна."
  }[voiceKey] || "Тэмдэглэлд энэ байдал хэд хэдэн өдөр давтагдсан байна.";
}

function renderStagedExperiment(voice) {
  return voice.experiment.map(([label, copy]) => `<p><strong>${publicHtml(label)}:</strong> ${publicHtml(copy)}</p>`).join("");
}

function renderHumanReadableReport({ mode, primary, secondary = [], tags = [], isOneTime = false }) {
  const voice = reportVoiceFor(primary?.key, tags);
  const refinementItems = refinementBullets(primary, secondary).slice(0, 3);
  const cycleEvidence = menstrualCycleEvidence();
  const avoidItems = cycleEvidence.premenstrual
    ? unique([...avoidListFor(primary?.key, tags), ...voice.avoid]).slice(0, 5)
    : voice.avoid.slice(0, 5);
  const modeCheckNote = mode.mode === "check"
    ? `<p class="danger-copy">Нэмэлтээр нэг биеийн дохиог шалгуулахад илүүдэхгүй. Тиймээс энэ туршилтыг мацаг, хоол алгасах, огцом хязгаарлалтгүй зөөлөн эхлүүлнэ.</p>`
    : "";
  return `
    ${topbar(100, mode.title)}
    <section class="screen">
      <div class="panel">
        <div class="report-section">
          <h2>Таны гүн зураглал бэлэн боллоо</h2>
          <p class="muted">Энэ бол таны хариулт, тэмдэглэл дээр суурилсан эхний зураглал. Өөрийгөө буруутгах гэж биш, давтагддаг мөчөө илүү тод харах гэж уншаарай.</p>
        </div>
        <div class="report-section">
          <h3>Гол зураг</h3>
          ${voice.opening.map(paragraph => `<p>${publicHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="report-section">
          <h3>Тэр үед хоол танд юу өгч байсан байж болох вэ?</h3>
          <p>Энэ нь зөв, буруу гэсэн дүгнэлт биш. Тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж байсан байж магадгүй.</p>
          <ul>${voice.needs.slice(0, 3).map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Давтагддаг тойрог</h3>
          <div class="cycle-map">${voice.cycle.slice(0, 7).map(step => `<p>${publicHtml(step)}</p>`).join("<span>↓</span>")}</div>
        </div>
        <div class="report-section">
          <h3>Үүнийг юунаас харсан бэ?</h3>
          <p>${publicHtml(reportEvidenceNote(voice.key, isOneTime))}</p>
        </div>
        <div class="report-section">
          <h3>Асуудал яг юу биш вэ?</h3>
          <p>${publicHtml(voice.notProblem)}</p>
        </div>
        <div class="report-section">
          <h3>Одоогоор болгоомжлох зүйлс</h3>
          <ul>${avoidItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        ${menstrualCycleContextHtml()}
        <div class="report-section">
          <h3>Эхний жижиг өөрчлөлт</h3>
          <p>${publicHtml(voice.firstStep)}</p>
          ${modeCheckNote}
        </div>
        <div class="report-section">
          <h3>14 хоногийн туршилт</h3>
          ${renderStagedExperiment(voice)}
        </div>
        ${menstrualCycleExperimentModifierHtml()}
        ${isOneTime ? `<div class="report-section">
          <h3>7 хоногоор нарийвчлах</h3>
          <p>Хэрвээ энэ зураглалыг илүү бодит өдөр тутмын түвшинд харахыг хүсвэл 7 хоногийн богино тэмдэглэлээр дараах хэсгүүдийг тодруулж болно.</p>
          <ul>${refinementItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>
        </div>` : ""}
        ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""}
        ${isOneTime ? renderUpgradeOffer() : ""}
        ${renderInternalTesterFeedbackSurvey()}
        <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div>
      </div>
    </section>
  `;
}

function renderOneTimeReport({ mode, ranked, primary, secondary, primaryMechanism, tags }) {
  return renderHumanReadableReport({
    mode,
    primary,
    secondary: compressedSecondaryPatterns(ranked),
    tags,
    isOneTime: true
  });

  const selectedSecondary = compressedSecondaryPatterns(ranked);
  const selectedSecondaryKeys = selectedSecondary.map(item => item.key);
  const hiddenItems = selectedHiddenFunctions(primary?.key, selectedSecondaryKeys, tags);
  const surfaceItems = compressedSurfaceBehaviors(primary?.key, tags);
  const cycleSteps = cycleMapSteps(primary?.key, tags).slice(0, 4);
  const avoidItems = avoidListFor(primary?.key, tags).slice(0, 5);
  const leverage = leveragePoint(primary?.key, mode.mode === "check" ? tags.filter(tag => !["glucose_like_signal", "bp_concern"].includes(tag)) : tags);
  const experiment = experimentFor(primary?.key, mode.mode === "check" ? tags.filter(tag => !["glucose_like_signal", "bp_concern"].includes(tag)) : tags);
  const refinements = refinementBullets(primary, selectedSecondary);

  return `
    ${topbar(100, mode.title)}
    <section class="screen">
      <div class="panel">
        <div class="report-section">
          <h2>Таны нэг удаагийн гүн анализ бэлэн боллоо</h2>
          <p class="muted">Энэ бол таны одоогийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн тэмдэглэл илүү тодруулна.</p>
          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>
        </div>
        <div class="report-section">
          <h3>Таны хариултаас хамгийн тод харагдаж буй зүйл</h3>
          ${primary ? `<p>${livedExplanationFor(primary.key)}</p><p>${publicMechanismFitSentence(primary.key)}</p><p>Энэ таны сул тал гэсэн үг биш. Тухайн зан үйл танд ${publicMechanismHiddenFunction(primary.key)} үүрэг гүйцэтгэж байж магадгүй.</p>` : `<p>Одоогоор нэг гол зураглал гаргахад мэдээлэл хангалтгүй байна.</p>`}
        </div>
        <div class="report-section">
          <h3>Давхар нөлөөлж буй давтамжууд</h3>
          <div class="pill-row">${selectedSecondary.map(item => `<span class="pill">${publicMechanismShort(item.key)}</span>`).join("") || `<span class="muted">Одоогоор хоёрдогч давтамжийг 7 хоногийн тэмдэглэлээр тодруулах нь зөв.</span>`}</div>
        </div>
        ${surfaceItems.length ? `<div class="report-section">
          <h3>Илэрч буй зан үйлүүд</h3>
          <ul>${surfaceItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>` : ""}
        <div class="report-section">
          <h3>Энэ зан үйл ямар үүрэгтэй байж болох вэ?</h3>
          <p>Тухайн үед энэ идэлт танд дараах байдлаар тусалж байсан байж магадгүй:</p>
          <ul>${hiddenItems.map(item => `<li><strong>${publicHtml(item.name)}</strong> — ${publicHtml(item.evidence)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Давтагддаг тойрог</h3>
          <div class="cycle-map">${cycleSteps.map(step => `<p>${publicHtml(step)}</p>`).join("<span>↓</span>")}</div>
        </div>
        <div class="report-section">
          <h3>Асуудал яг юу биш вэ?</h3>
          <p>${publicHtml(notRealProblemCopy(primary?.key, tags))}</p>
        </div>
        <div class="report-section">
          <h3>Одоогоор зайлсхийх зүйлс</h3>
          <ul>${avoidItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Эхний зөөлөн алхам</h3>
          <p>${publicHtml(leverage.copy)}</p>
          ${mode.mode === "check" ? `<p class="danger-copy">Таны давтамж харагдаж байна. Нэмэлтээр нэг биеийн дохиог шалгуулахад илүүдэхгүй. Тиймээс эхний туршилт илүү зөөлөн, аюулгүй байна.</p>` : ""}
        </div>
        <div class="report-section">
          <h3>14 хоногийн эхний туршилт</h3>
          <p><strong>Зорилго:</strong> ${publicHtml(experiment.goal)}</p>
          <p><strong>Өдөр бүр хийх:</strong></p>
          <ul>${experiment.actions.slice(0, 3).map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
          <p><strong>Ажиглах зүйл:</strong> ${publicHtml(experiment.track.slice(0, 3).join(", "))}</p>
          <p><strong>Хэрвээ тасалдвал:</strong> ${publicHtml(experiment.recovery)}</p>
        </div>
        <div class="report-section">
          <h3>Илүү нарийвчилж болох хэсгүүд</h3>
          <p>Энэ хэсгийг 7 хоногоор илүү тодруулж болно. Дараах хэсгийг тэмдэглэл илүү тод харуулна:</p>
          <ul>${refinements.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>
        </div>
        ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""}
        ${renderUpgradeOffer()}
        ${renderInternalTesterFeedbackSurvey()}
        <div class="actions"><button class="button secondary" onclick="setView('choice')">Сонголт руу буцах</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div>
      </div>
    </section>
  `;
}

function feedbackChoiceField(name, label, options, followUpName = "", followUpLabel = "") {
  const form = { ...INTERNAL_FEEDBACK_DEFAULTS, ...(state.internalFeedbackForm || {}) };
  return `
    <div class="feedback-question">
      <p><strong>${escapeHtml(label)}</strong></p>
      <div class="pill-row feedback-options">
        ${options.map(option => `
          <label class="feedback-option">
            <input type="radio" name="${escapeAttr(name)}" value="${escapeAttr(option)}" ${form[name] === option ? "checked" : ""} onchange="updateInternalFeedbackField('${escapeAttr(name)}', this.value)">
            <span>${escapeHtml(option)}</span>
          </label>
        `).join("")}
      </div>
      ${followUpName ? `<label class="field"><span class="muted">${escapeHtml(followUpLabel)}</span><textarea rows="2" oninput="updateInternalFeedbackField('${escapeAttr(followUpName)}', this.value)">${escapeHtml(form[followUpName] || "")}</textarea></label>` : ""}
    </div>
  `;
}

function updateCoachLoginField(field, value) {
  state.coachLoginForm = { ...(state.coachLoginForm || {}), [field]: value };
  saveState();
}

function submitCoachLogin() {
  try {
    const result = mockBackend.loginCoach(state.coachLoginForm.email, state.coachLoginForm.password);
    state.coachSessionToken = result.session.token;
    state.coachLoginError = "";
    state.view = "coachDashboard";
  } catch {
    state.coachLoginError = "Имэйл эсвэл нууц үг буруу байна.";
  }
  saveState();
  render({ scrollToTop: true });
}

function renderCoachLogin() {
  return `
    ${topbar(0, "Coach login")}
    <section class="screen">
      <div class="panel stack">
        <h2>Coach нэвтрэх</h2>
        <label class="field"><span class="muted">Имэйл</span><input type="email" value="${escapeAttr(state.coachLoginForm?.email || "")}" oninput="updateCoachLoginField('email', this.value)"></label>
        <label class="field"><span class="muted">Нууц үг</span><input type="password" value="${escapeAttr(state.coachLoginForm?.password || "")}" oninput="updateCoachLoginField('password', this.value)"></label>
        ${state.coachLoginError ? `<p class="danger-copy">${escapeHtml(state.coachLoginError)}</p>` : ""}
        <div class="actions">
          <button class="button" onclick="submitCoachLogin()">Нэвтрэх</button>
          <button class="button ghost" onclick="setView('landing')">Нүүр рүү буцах</button>
        </div>
      </div>
    </section>
  `;
}

function updateCoachClientField(field, value) {
  state.coachClientForm = { ...(state.coachClientForm || {}), [field]: value };
  saveState();
}

function addCoachClientFromDashboard() {
  try {
    const result = mockBackend.createCoachClient(state.coachSessionToken, {
      clientEmail: state.coachClientForm.email,
      clientName: state.coachClientForm.name,
      note: state.coachClientForm.note
    });
    state.coachDashboardMessage = `Хэрэглэгч нэмэгдлээ. Урилгын линк: ${result.inviteLink}`;
    state.coachClientForm = { email: "", name: "", note: "" };
  } catch (error) {
    state.coachDashboardMessage = error.message || "Хэрэглэгч нэмэхэд алдаа гарлаа.";
  }
  saveState();
  render({ scrollToTop: true });
}

function viewCoachAssessmentReport(assessmentId) {
  try {
    state.coachReportView = mockBackend.viewCoachReport(state.coachSessionToken, assessmentId);
  } catch {
    state.coachReportView = { allowed: false, reason: "Тайлан харах эрх олдсонгүй." };
  }
  saveState();
  render({ scrollToTop: true });
}

function renderCoachReportView() {
  const view = state.coachReportView;
  if (!view) return "";
  if (!view.allowed) {
    return `<div class="card stack"><h3>Дүгнэлт</h3><p class="danger-copy">${escapeHtml(view.reason)}</p></div>`;
  }
  return `
    <div class="card stack">
      <h3>Дүгнэлт</h3>
      <p class="muted">${escapeHtml(view.client_email_normalized)} · ${escapeHtml(view.report_mode)} · ${escapeHtml(String(view.paid_amount_mnt))}₮ · commission ${escapeHtml(String(view.commission_mnt))}₮</p>
      <pre class="feedback-export-json">${escapeHtml(view.report_text)}</pre>
    </div>
  `;
}

function renderCoachDashboard() {
  if (!state.coachSessionToken) return renderCoachLogin();
  let dashboard;
  try {
    dashboard = mockBackend.getCoachDashboard(state.coachSessionToken);
  } catch {
    state.coachSessionToken = "";
    return renderCoachLogin();
  }
  const summary = dashboard.summary;
  return `
    ${topbar(100, "Coach dashboard")}
    <section class="screen">
      <div class="panel stack">
        <h2>${escapeHtml(dashboard.coach.display_name)}</h2>
        <div class="two-col">
          <div class="mini-stat"><strong>${summary.addedClientsCount}</strong><span>Нэмсэн хэрэглэгч</span></div>
          <div class="mini-stat"><strong>${summary.paidClientsCount}</strong><span>Төлбөр төлсөн</span></div>
          <div class="mini-stat"><strong>${summary.completedReportsCount}</strong><span>Тайлан гарсан</span></div>
          <div class="mini-stat"><strong>${summary.totalPaidAmountMnt}₮</strong><span>Нийт оруулсан орлого</span></div>
          <div class="mini-stat"><strong>${summary.coachCommissionTotalMnt}₮</strong><span>Таны commission</span></div>
          <div class="mini-stat"><strong>${summary.pendingPayoutMnt}₮</strong><span>Төлөгдөөгүй commission</span></div>
        </div>
        <div class="card stack">
          <h3>Шинэ хэрэглэгч нэмэх</h3>
          <label class="field"><span class="muted">Хэрэглэгчийн имэйл</span><input type="email" value="${escapeAttr(state.coachClientForm?.email || "")}" oninput="updateCoachClientField('email', this.value)"></label>
          <label class="field"><span class="muted">Нэр / тэмдэглэл</span><input value="${escapeAttr(state.coachClientForm?.name || "")}" oninput="updateCoachClientField('name', this.value)"></label>
          <label class="field"><span class="muted">Нэмэлт тэмдэглэл</span><textarea rows="2" oninput="updateCoachClientField('note', this.value)">${escapeHtml(state.coachClientForm?.note || "")}</textarea></label>
          <button class="button" onclick="addCoachClientFromDashboard()">Нэмэх</button>
          ${state.coachDashboardMessage ? `<p class="muted">${escapeHtml(state.coachDashboardMessage)}</p>` : ""}
        </div>
        <div class="card stack">
          <h3>Хэрэглэгчийн жагсаалт</h3>
          <div class="table-like">
            ${dashboard.clients.map(client => `<div class="table-row">
              <span>${escapeHtml(client.client_email_normalized)}</span>
              <span>${escapeHtml(client.client_name || client.note || "-")}</span>
              <span>${escapeHtml(client.status)}</span>
              <span>${client.commission_mnt}₮</span>
              <button class="button compact secondary" onclick="viewCoachAssessmentReport('${escapeAttr(dashboard.completedAssessments.find(assessment => assessment.coach_client_id === client.id)?.id || "")}')">Дүгнэлт</button>
            </div>`).join("") || `<p class="muted">Одоогоор хэрэглэгч нэмэгдээгүй байна.</p>`}
          </div>
        </div>
        ${renderCoachReportView()}
      </div>
    </section>
  `;
}

function updateAdminCoachField(field, value) {
  state.adminCoachForm = { ...(state.adminCoachForm || {}), [field]: value };
  saveState();
}

function createCoachFromAdmin() {
  try {
    state.adminCoachResult = mockBackend.createCoachAccount({
      email: state.adminCoachForm.email,
      displayName: state.adminCoachForm.name,
      phone: state.adminCoachForm.phone,
      commissionMnt: Number(state.adminCoachForm.commissionMnt || COACH_COMMISSION_MNT)
    });
    state.adminCoachForm = { email: "", name: "", phone: "", commissionMnt: String(COACH_COMMISSION_MNT) };
  } catch (error) {
    state.adminCoachResult = { error: error.message || "Coach үүсгэхэд алдаа гарлаа." };
  }
  saveState();
  render({ scrollToTop: true });
}

function renderAdminCoach() {
  if (!isInternalTestMode()) return renderLanding();
  const coaches = mockBackend.listCoachAccounts();
  return `
    ${topbar(100, "Coach / Дэд админ")}
    <section class="screen">
      <div class="panel stack">
        <h2>Coach / Дэд админ</h2>
        <div class="card stack">
          <h3>Coach нэмэх</h3>
          <label class="field"><span class="muted">Coach email</span><input type="email" value="${escapeAttr(state.adminCoachForm?.email || "")}" oninput="updateAdminCoachField('email', this.value)"></label>
          <label class="field"><span class="muted">Coach name</span><input value="${escapeAttr(state.adminCoachForm?.name || "")}" oninput="updateAdminCoachField('name', this.value)"></label>
          <label class="field"><span class="muted">Phone</span><input value="${escapeAttr(state.adminCoachForm?.phone || "")}" oninput="updateAdminCoachField('phone', this.value)"></label>
          <label class="field"><span class="muted">Commission amount</span><input type="number" value="${escapeAttr(state.adminCoachForm?.commissionMnt || String(COACH_COMMISSION_MNT))}" oninput="updateAdminCoachField('commissionMnt', this.value)"></label>
          <button class="button" onclick="createCoachFromAdmin()">Coach нэмэх</button>
          ${state.adminCoachResult?.temporaryPassword ? `<p class="danger-copy">Түр нууц үг: ${escapeHtml(state.adminCoachResult.temporaryPassword)}<br>Энэ нууц үгийг нэг удаа харуулна. Coach нэвтэрсний дараа солих шаардлагатай.</p>` : ""}
          ${state.adminCoachResult?.error ? `<p class="danger-copy">${escapeHtml(state.adminCoachResult.error)}</p>` : ""}
        </div>
        <div class="card stack">
          <h3>Coach list</h3>
          ${coaches.map(coach => `<div class="table-row"><span>${escapeHtml(coach.display_name)}</span><span>${escapeHtml(coach.email_normalized)}</span><span>${escapeHtml(coach.status)}</span><span>${coach.commission_mnt}₮</span></div>`).join("") || `<p class="muted">Coach бүртгэл алга.</p>`}
        </div>
      </div>
    </section>
  `;
}

function renderInternalTesterFeedbackSurvey() {
  if (!isInternalTestMode()) return "";
  const mode = reportMode();
  if (["urgent", "professional"].includes(mode.mode)) return "";
  const form = { ...INTERNAL_FEEDBACK_DEFAULTS, ...(state.internalFeedbackForm || {}) };
  return `
    <div class="report-section feedback-survey" id="internal-feedback-survey">
      <p class="choice-kicker">Дотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.</p>
      <h3>Туршилтын санал асуулга</h3>
      <p>Та тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.</p>
      ${feedbackChoiceField("discomfort", "Тест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?", ["Үгүй", "Бага зэрэг", "Тийм"], "discomfortDetail", "Аль хэсэг дээр?")}
      ${feedbackChoiceField("questionClarity", "Асуултууд ойлгомжтой байсан уу?", ["Маш ойлгомжтой", "Ерөнхийдөө ойлгомжтой", "Зарим нь ойлгомжгүй", "Ихэнх нь ойлгомжгүй"], "unclearQuestions", "Ойлгомжгүй санагдсан асуулт байвал бичнэ үү.")}
      <div class="feedback-question">
        <p><strong>Тайлан таны нөхцөлтэй хэр нийцсэн бэ?</strong></p>
        <label class="field"><span class="muted">1 = огт нийцээгүй, 10 = маш сайн нийцсэн</span><input type="number" min="1" max="10" value="${escapeAttr(form.fitRating)}" oninput="updateInternalFeedbackField('fitRating', this.value)"></label>
      </div>
      ${feedbackChoiceField("feltUnderstood", "Тайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?", ["Тийм", "Зарим хэсэг дээр", "Үгүй"], "feltUnderstoodReason", "Яагаад?")}
      ${feedbackChoiceField("newInsight", "Тайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?", ["Тийм", "Бага зэрэг", "Үгүй"], "newInsightDetail", "Ямар хэсэг?")}
      ${feedbackChoiceField("aiGenericFeeling", "Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?", ["Үгүй", "Тийм"], "aiGenericDetail", "Аль хэсэг?")}
      ${feedbackChoiceField("languageTone", "Тайлангийн хэл найруулга ямар санагдсан бэ?", ["Байгалийн монгол хэлтэй", "Зарим хэсэг хиймэл", "Хэт албархуу", "Хэт зөөлөн/бөөрөнхий"], "languageToneSuggestion", "Засах санал:")}
      ${feedbackChoiceField("valueAt9900", "Энэ тайланг 29,000₮ төлж авахад үнэ цэнтэй санагдах уу?", ["Тийм", "Магадгүй", "Үгүй"], "valueReason", "Яагаад?")}
      <label class="field"><span class="muted">Хамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?</span><textarea rows="3" oninput="updateInternalFeedbackField('mostUsefulPart', this.value)">${escapeHtml(form.mostUsefulPart || "")}</textarea></label>
      <label class="field"><span class="muted">Хамгийн засмаар санагдсан хэсэг юу байсан бэ?</span><textarea rows="3" oninput="updateInternalFeedbackField('mostNeedsFix', this.value)">${escapeHtml(form.mostNeedsFix || "")}</textarea></label>
      <div class="actions">
        <button class="button" onclick="submitInternalFeedback()">Санал илгээх</button>
        <button class="button ghost" onclick="setView('feedbackExport')">Саналын экспорт</button>
      </div>
    </div>
  `;
}

function updateInternalFeedbackField(field, value) {
  state.internalFeedbackForm = {
    ...INTERNAL_FEEDBACK_DEFAULTS,
    ...(state.internalFeedbackForm || {}),
    [field]: value
  };
  saveState();
}

function internalFeedbackMetadata() {
  const mode = reportMode();
  const evidence = calculateMechanismEvidence(state);
  return {
    reportMode: mode.mode,
    primaryMechanism: evidence.primaryMechanism || null,
    secondaryMechanisms: evidence.secondaryMechanisms || [],
    safetyMode: mode.mode
  };
}

function submitInternalFeedback() {
  if (!isInternalTestMode()) return;
  const metadata = internalFeedbackMetadata();
  const feedback = {
    ...INTERNAL_FEEDBACK_DEFAULTS,
    ...(state.internalFeedbackForm || {})
  };
  const record = mockBackend.createTesterFeedback({
    ...metadata,
    feedback
  });
  state.lastFeedbackId = record.id;
  state.internalFeedbackForm = { ...INTERNAL_FEEDBACK_DEFAULTS };
  state.view = "feedbackThanks";
  saveState();
  render({ scrollToTop: true });
}

function renderFeedbackThanks() {
  return `
    ${topbar(100, "Санал асуулга")}
    <section class="screen">
      <div class="panel stack">
        <h2>Санал өгсөнд баярлалаа</h2>
        <p>Таны хариулт тестийн асуулт, тайлангийн найруулга, хэрэгтэй эсэхийг сайжруулахад шууд ашиглагдана.</p>
        ${isInternalTestMode() ? `<div class="actions"><button class="button secondary" onclick="setView('feedbackExport')">Саналын экспорт</button></div>` : ""}
        <button class="button" onclick="resetState()">Дахин эхлэх</button>
      </div>
    </section>
  `;
}

function renderFeedbackExport() {
  if (!isInternalTestMode()) return renderLanding();
  const records = mockBackend.getTesterFeedbackRecords();
  return `
    ${topbar(100, "Саналын экспорт")}
    <section class="screen">
      <div class="panel stack">
        <h2>Саналын экспорт</h2>
        <p class="muted">Дотоод туршилтын санал асуулгын JSON таталт.</p>
        <pre class="feedback-export-json">${escapeHtml(JSON.stringify(records, null, 2))}</pre>
        <div class="actions"><button class="button" onclick="setView('choice')">Тест рүү буцах</button><button class="button ghost" onclick="resetState()">Дахин эхлэх</button></div>
      </div>
    </section>
  `;
}

function renderReport() {
  const quality = dataQuality();
  const mode = reportMode();
  const ranked = rankedPatterns(true);
  const primary = ranked[0];
  const secondary = ranked.slice(1, 3);
  const primaryMechanism = primary ? mechanisms[primary.key] : null;
  const isOneTime = state.packageType === "one-time";
  const ctaPatterns = [primary, ...secondary].filter(Boolean).slice(0, 3);
  const readiness = reportReadiness();
  const narrativeEvidence = confirmedNarrativeEvidence();
  const stageEvidence = confirmedStageEvidence();
  const tags = unique([...allReportTags(), ...allStageReportTags()]);
  const triggerRows = triggerMapRows().slice(0, 5);
  const hiddenItems = hiddenFunctionItems(state.diaryEntries, tags).slice(0, 3);
  const surfaceItems = surfaceBehaviors(state.diaryEntries, tags).slice(0, 3);
  const beforeItems = beforeEatingItems(state.diaryEntries, tags).slice(0, 5);
  const afterItems = afterEatingItems(state.diaryEntries, tags).slice(0, 4);
  const cycleSteps = cycleMapSteps(primary?.key, tags);
  const avoidItems = avoidListFor(primary?.key, tags).slice(0, 6);
  const leverage = leveragePoint(primary?.key, tags);
  const experiment = experimentFor(primary?.key, tags);

  if (mode.mode === "urgent") {
    return `
      ${topbar(100, mode.title)}
      <section class="screen">
        <div class="panel stack">
          <h2>Одоо жин хасах тухай биш — эхлээд таны аюулгүй байдал чухал байна</h2>
          <p class="danger-copy">Өөртөө хор хүргэх бодол, ухаан балартах/будилах мэт хүчтэй дохио, эсвэл огцом бие муудаж байгаа байж болзошгүй хариулт илэрсэн тул энэ үнэлгээ ердийн жин хасалтын тайлан гаргахгүй.</p>
          <p>Хэрэв та өөрийгөө гэмтээх бодолтой байгаа эсвэл огцом бие муудаж байгаа бол ганцаараа бүү үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдох, тухайн газрын яаралтай тусламжийн дугаар руу залгах, эсвэл эмнэлгийн байгууллагад хандах нь хамгийн түрүүнд байна.</p>
          <button class="button secondary" onclick="resetState()">Шинээр эхлэх</button>
        </div>
      </section>
    `;
  }

  if (mode.mode === "professional") {
    return `
      ${topbar(100, mode.title)}
      <section class="screen">
        <div class="panel">
          <div class="report-section">
            <h2>Энд эхлээд мэргэжлийн хүнтэй ярилцахад илүүдэхгүй дохио байна</h2>
            <p>Энэ нь онош гэсэн үг биш. Харин хэт барих, хоол алгасах, огцом хоолны дэглэм эхлүүлэхээс өмнө аюулгүй талаа шалгах сануулга юм. Тиймээс энэ тохиолдолд ердийн жин хасалтын туршилт өгөхгүй, харин ярилцахад хэрэг болох товч нэгтгэл гаргана.</p>
          </div>
          <div class="report-section">
            <h3>Ярилцах товч нэгтгэл</h3>
            <ul>
              <li>Хоол, жин, биеийн дохио, мэдрэмж, эмийн хэрэглээ эсвэл төрсний дараах нөхцөлтэй холбоотой хариултуудаа нэгтгэж авч очих.</li>
              <li>Хоол холдох үед гардаг шинж, хэмжсэн сахар/даралт, ухаан балартах эсвэл будилах үе байсан эсэхийг тодорхой тэмдэглэх.</li>
              <li>Хяналт алдагдах, нуух, ичих мэдрэмж давтагддаг бол эхлээд мэргэжлийн хүнтэй ярилцах дараалал барих.</li>
            </ul>
          </div>
          ${menstrualCycleContextHtml()}
          ${menstrualCycleProfessionalSummaryHtml()}
          ${bodySafetyPauseHtml(tags)}
          <div class="actions"><button class="button secondary" onclick="setView('preliminary')">Эхний зураглал руу буцах</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div>
        </div>
      </section>
    `;
  }

  if (isOneTime && !hasOneTimeReportAccess()) {
    return renderOneTimePaywall({ mode, primary, primaryMechanism, tags });
  }

  if (!isOneTime && !hasSevenDayAccess()) {
    return renderSevenDayPaywall();
  }

  if (!isOneTime && !readiness.canGenerateFullReport) {
    return `
      ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "Тайлангийн бэлэн байдал")}
      <section class="screen">
        <div class="panel stack">
          <h2>${readiness.title}</h2>
          <p class="muted">${readiness.copy}</p>
          <div class="two-col">
            <div class="mini-stat"><strong>${readiness.count}/7</strong><span>Өдөр бөглөсөн</span></div>
            <div class="mini-stat"><strong>${quality.label}</strong><span>Хариултын хүрэлцээ</span></div>
          </div>
          ${readiness.key !== "insufficient" ? `<div class="card"><h3>Эхний дохионууд</h3><div class="pill-row">${ranked.slice(0, 3).map(item => `<span class="pill">${publicMechanismShort(item.key)}</span>`).join("") || `<span class="muted">Дохио харахад мэдээлэл бага байна.</span>`}</div></div>` : ""}
          <p>Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна.</p>
          <div class="actions">
            <button class="button" onclick="startDiary()">Тэмдэглэлээ үргэлжлүүлэх</button>
            <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button>
          </div>
        </div>
      </section>
    `;
  }

  if (isOneTime) {
    return renderOneTimeReport({ mode, ranked, primary, secondary, primaryMechanism, tags });
  }

  return renderHumanReadableReport({
    mode,
    primary,
    secondary,
    tags,
    isOneTime: false
  });

  return `
    ${topbar(100, mode.title)}
    <section class="screen">
      <div class="panel">
        <div class="report-section">
          <h2>${isOneTime ? "Таны нэг удаагийн гүн анализ бэлэн боллоо" : mode.mode === "check" ? "Нэг зүйл тод харагдаж байна — мөн шалгуулахад илүүдэхгүй дохио байна" : ordinaryReportOpeningTitle(primary?.key, tags)}</h2>
          <p class="muted">${isOneTime ? "Энэ тайлан таны одоогийн хариулт болон баталгаажуулсан тайлбар дээр суурилсан. Зарим зүйл бодит өдөр тутамд яаж давтагддагийг 7 хоногийн тэмдэглэл илүү тодруулж болно." : quality.copy}</p>
          ${isOneTime ? `<div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>` : ""}
        </div>
        <div class="report-section">
          <h3>Хариултын хүрэлцээ</h3>
          <p>${isOneTime ? "Энэ нь таны одоогийн хариултад суурилсан эхний зураглал. Өдөр тутмын давтамжийг батлахын тулд 7 хоногийн тэмдэглэл хэрэгтэй." : quality.copy}</p>
        </div>
        <div class="report-section">
          <h3>Эхний зураглал ба бодит ажиглалт</h3>
          <p>Эхний тестээр: ${publicHtml((state.preliminary || []).slice(0, 3).map(item => publicMechanismShort(item.key)).join(", ") || "давтамж харахад мэдээлэл хангалтгүй")}.</p>
          <p>${publicHtml(isOneTime ? "Энэ нь нэг удаагийн өөрийн ажиглалтад суурилсан зураглал. Өдөр тутмын давтамж, идэх хүсэл эхэлдэг цаг, идэхийн өмнөх ба дараах өөрчлөлтийг 7 хоногийн тэмдэглэл илүү тодруулна." : `7 хоногийн ажиглалтаар: ${repeatedEvidence(primary?.key).join(" ") || "давтамж харахад мэдээлэл хязгаарлагдмал байна."}`)}</p>
        </div>
        ${isOneTime ? `<div class="report-section">
          <h3>Баталгаажуулсан тайлбар</h3>
          ${stageEvidence.length ? stageEvidence.map((item, index) => `<div class="card"><h3>Тайлбар ${index + 1}</h3><ul>${item.bullets.map(bullet => `<li>${publicHtml(bullet)}</li>`).join("")}</ul></div>`).join("") : `<p class="muted">Баталгаажуулсан нэмэлт тайлбар байхгүй. Энэ тайлан бүтэцтэй хариултад суурилж байна.</p>`}
        </div>` : ""}
        <div class="report-section">
          <h3>${isOneTime ? "Таны хариултаас хамгийн тод харагдаж буй зүйл" : "Гол давтагдаж буй нөхцөл"}</h3>
          ${primary ? `<p>${livedExplanationFor(primary.key)}</p><p>${publicMechanismFitSentence(primary.key, primary.label)}</p><p>Энэ таны сул тал гэсэн үг биш. Тухайн зан үйл танд ${publicMechanismHiddenFunction(primary.key)} үүрэг гүйцэтгэж байж магадгүй.</p>` : `<p>Гол зураглал гаргахад мэдээлэл хангалтгүй байна.</p>`}
        </div>
        <div class="report-section">
          <h3>Давхар нөлөөлж буй давтамжууд</h3>
          <div class="pill-row">${secondary.map(item => `<span class="pill">${publicMechanismShort(item.key)}</span>`).join("") || `<span class="muted">Одоогоор давхар давтамж харахад мэдээлэл хангалтгүй.</span>`}</div>
        </div>
        <div class="report-section">
          <h3>Илэрч буй зан үйлүүд</h3>
          <ul>${surfaceItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Энэ зан үйл ямар үүрэгтэй байж болох вэ?</h3>
          <p>Таны идэлт дараах үүргүүдийг гүйцэтгэж байна:</p>
          <ul>${hiddenItems.map(item => `<li><strong>${publicHtml(item.name)}</strong> — ${publicHtml(item.evidence)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Давтагддаг тойрог</h3>
          <div class="cycle-map">${cycleSteps.map(step => `<p>${publicHtml(step)}</p>`).join("<span>↓</span>")}</div>
        </div>
        <div class="report-section">
          <h3>Идэх хүсэл эхэлдэг нөхцөл</h3>
          <p class="muted">Нөхцлийн зураглал нь таны идэлтийг “ямар хоол идсэн бэ?” гэж биш, “ямар нөхцөл давтагдахад идэх сонголт өөрчлөгдөж байна вэ?” гэж харуулдаг.</p>
          ${renderTriggerMapTable(triggerRows)}
        </div>
        ${!isOneTime ? `<div class="report-section">
          <h3>Баталгаажуулсан тайлбар</h3>
          ${narrativeEvidence.length ? narrativeEvidence.map(item => `<div class="card"><h3>${publicHtml(item.day)} дэх өдөр</h3><ul>${item.bullets.map(bullet => `<li>${publicHtml(bullet)}</li>`).join("")}</ul></div>`).join("") : `<p class="muted">Баталгаажуулсан нэмэлт тайлбар байхгүй. Энэ тайлан тэмдэглэлийн бүтэцтэй хариултад суурилж байна.</p>`}
        </div>` : ""}
        <div class="report-section">
          <h3>Идэхийн өмнөх 30 минут</h3>
          <p>Төлөвлөөгүй идэлтийн өмнөх 30 минутанд хамгийн их давтагдсан зүйлс:</p>
          <ul>${beforeItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Идсэний дараах 30 минут</h3>
          <ul>${afterItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        ${isOneTime ? `<div class="report-section">
          <h3>Илүү нарийвчилж болох хэсгүүд</h3>
          <p>Энэ хэсгийг 7 хоногоор илүү тодруулж болно:</p>
          <ul>${ctaPatterns.map(item => `<li><strong>${publicMechanismShort(item.key)}</strong> — энэ нь яг ямар өдөр, ямар нөхцөлд давтагдаж байгааг харна. ${item.key === "hungerSafety" ? "Ялангуяа хоолны хоорондын зай, оройн эрч хүч, төлөвлөөгүй идэлттэй хэрхэн давхцаж байгааг 7 хоногийн тэмдэглэл илүү тод харуулна." : ""}</li>`).join("") || "<li>Өдөр тутмын нөхцлийн зураглал болон идэхийн өмнөх/дараах давтамжийг тодруулна.</li>"}</ul>
          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>
        </div>` : ""}
        <div class="report-section">
          <h3>Асуудал яг юу биш вэ?</h3>
          <p>${publicHtml(notRealProblemCopy(primary?.key, tags))}</p>
        </div>
        <div class="report-section">
          <h3>Өмнөх аргууд яагаад удаан ажиллаагүй байж болох вэ?</h3>
          <p>${publicHtml(previousAttemptsCopy(primary?.key, tags))}</p>
        </div>
        <div class="report-section">
          <h3>Одоогоор зайлсхийх зүйлс</h3>
          <ul>${avoidItems.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
        </div>
        <div class="report-section">
          <h3>Эхэлж өөрчлөх хамгийн амар цэг</h3>
          <p>${publicHtml(leverage.copy)}</p>
        </div>
        <div class="report-section">
          <h3>14 хоногийн туршилт</h3>
          <p><strong>Зорилго:</strong> ${publicHtml(experiment.goal)}</p>
          <p><strong>Өдөр бүр хийх:</strong></p>
          <ul>${experiment.actions.map(item => `<li>${publicHtml(item)}</li>`).join("")}</ul>
          <p><strong>Ажиглах зүйл:</strong> ${publicHtml(experiment.track.join(", "))}</p>
          <p><strong>Амжилттай явж байгаагийн шинж:</strong> ${publicHtml(experiment.success)}</p>
          <p><strong>Хэрвээ тасалдвал:</strong> ${publicHtml(experiment.recovery)}</p>
          ${mode.mode === "check" ? `<p class="danger-copy">Биеийн дохио байгаа тул мацаг, хоол алгасах, огцом хязгаарлалт, өндөр ачаалалтай сорил санал болгохгүй.</p>` : ""}
          ${isOneTime ? `<p class="muted">Энэ туршилтыг 7 хоногийн тэмдэглэл дээр илүү нарийвчилж, нөхцлийн зураглал, давтагддаг цикл, эхэлж өөрчлөх хамгийн амар цэгийг тодруулж болно.</p><div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>` : ""}
        </div>
        ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""}
        ${renderInternalTesterFeedbackSurvey()}
        <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div>
      </div>
    </section>
  `;
}

function startSevenDayRefinement() {
  state.packageType = "seven-day";
  if (!state.preliminary.length) state.preliminary = rankedPatterns(false).slice(0, 4);
  state.view = hasSevenDayAccess() ? "unlock" : "upgradePaywall";
  saveState();
  render({ scrollToTop: true });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function sanitizePublicReportText(value) {
  return String(value ?? "")
    .replace(/\bPerfectionism\b/g, "төгс хийх гэж хэт чангардаг хэв маяг")
    .replace(/\bfeedback\b/gi, "хариу дохио")
    .replace(/\bdefault сонголт\b/gi, "хамгийн амар сонголт")
    .replace(/\bPlan\b/g, "Төлөвлөгөө")
    .replace(/\bplan\b/g, "төлөвлөгөө")
    .replace(/\bguilt\b/gi, "өөрийгөө буруутгах мэдрэмж")
    .replace(/\bshame\b/gi, "ичих, нуух мэдрэмж")
    .replace(/\bdefault\b/gi, "хамгийн амар сонголт")
    .replace(/\breward\b/gi, "таатай мэдрэмж авах хэрэгцээ")
    .replace(/\btrigger\b/gi, "эхэлдэг нөхцөл")
    .replace(/\bpattern\b/gi, "хэв маяг")
    .replace(/\bdiary\b/gi, "тэмдэглэл")
    .replace(/\bcraving\b/gi, "идэх хүсэл")
    .replace(/\breset\b/gi, "хэвийн үргэлжлүүлэх")
    .replace(/\bfailure\b/gi, "нурсан мэт санагдах үе");
}

function publicHtml(value) {
  return escapeHtml(sanitizePublicReportText(value));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function escapeJs(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function isDemoMode() {
  if (state.demoMode) return true;
  if (!hasBrowserRuntime) return false;
  const params = new URLSearchParams(window.location.search || "");
  return params.get("demo") === "1" || params.get("internal") === "1";
}

function isInternalTestMode() {
  if (state.internalTest) return true;
  if (!hasBrowserRuntime) return false;
  const params = new URLSearchParams(window.location.search || "");
  return params.get("internalTest") === "1";
}

function demoOnlyHtml(html) {
  return isDemoMode() ? html : "";
}

function publicMechanismName(key) {
  return publicMechanismCopy[key]?.name || mechanisms[key]?.name || "Эхний зураглал";
}

function publicMechanismShort(key) {
  return publicMechanismCopy[key]?.short || mechanisms[key]?.short || "Зураглал";
}

function publicMechanismHiddenFunction(key) {
  return {
    reward: "таатай мэдрэмж авах хэрэгцээ",
    rewardDeficit: "өдрийн төгсгөлд өөрийгөө баярлуулах хэрэгцээ",
    regulation: "сэтгэл түр намдаах",
    hungerSafety: "дараа өлсөхөөс хамгаалах",
    glucose: "биеийн дохиог хамгаалах",
    physiological: "биеийн таагүй мэдрэмжийг намдаах",
    executive: "хамгийн бага хүч шаарддаг сонголт олох",
    decisionDefault: "гарын дорх бэлэн сонголт руу шилжих",
    circadian: "тэнхээ нөхөх",
    cue: "орчны дохионд хариулах",
    collapse: "дараагийн хоолноос хэвийн үргэлжлүүлэх замгүй болох",
    social: "хүмүүсийн дунд эвтэйхэн байх",
    roleOverload: "өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх",
    shameAvoidance: "ичгүүрээс зай авах",
    bodySafety: "аюулгүй зай авах",
    identity: "өөрийгөө хамгаалах",
    perfectionism: "төгс хийх гэж хэт чангарсан төлөвлөгөөнөөс түр гарах"
  }[key] || "тухайн мөчид нэг хэрэгцээ нөхөх";
}

function publicMechanismFitSentence(key, label = "") {
  const safeLabel = escapeHtml(sanitizePublicReportText(label));
  if (key === "executive") {
    return `Энэ нь орой тэнхээ багасах үед сонголт амархан өөрчлөгддөг давтамжтай нийцэж байна${safeLabel ? ` — ${safeLabel}` : ""}.`;
  }
  return `Энэ нь <strong>${publicMechanismName(key)}</strong> гэх давтамжтай нийцэж байна${safeLabel ? ` — ${safeLabel}` : ""}.`;
}

function publicValidationProductLabel(productType) {
  return {
    one_time: "Нэг удаагийн гүн анализ",
    seven_day: "7 хоногийн гүн анализ",
    upgrade: "7 хоногоор нарийвчлах эрх"
  }[productType] || productType;
}

function render(options = {}) {
  if (!hasBrowserRuntime) return;
  if (getInternalFeedbackRoute()) {
    document.getElementById("app").innerHTML = renderFeedbackExport();
    if (options.scrollToTop) scrollToTopAfterRender();
    return;
  }
  const routes = {
    landing: renderLanding,
    about: renderAbout,
    choice: renderChoice,
    oneTimeStart: renderOneTimeStart,
    sevenDayStart: renderSevenDayStart,
    leadCapture: renderLeadCapture,
    leadThankYou: renderLeadThankYou,
    validationSummary: renderValidationSummary,
    stage1: renderStageOne,
    preliminary: renderPreliminary,
    unlock: renderUnlock,
    diaryHome: renderDiaryHome,
    diary: renderDiary,
    reportReady: renderReportReady,
    upgradePaywall: renderUpgradePaywall,
    report: renderReport,
    coachLogin: renderCoachLogin,
    coachDashboard: renderCoachDashboard,
    adminCoach: renderAdminCoach,
    feedbackThanks: renderFeedbackThanks,
    feedbackExport: renderFeedbackExport
  };
  document.getElementById("app").innerHTML = (routes[state.view] || renderLanding)();
  if (options.scrollToTop) scrollToTopAfterRender();
}

function getInternalFeedbackRoute() {
  if (!hasBrowserRuntime) return false;
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/feedback-export" && isInternalTestMode();
}

if (hasBrowserRuntime) {
  render();
}

if (typeof module !== "undefined") {
  module.exports = {
    initialState,
    mechanisms,
    stageOneQuestions,
    dailyCore,
    dailyMenstrual,
    probeBank,
    reportReadiness,
    diaryEntrySafetyFlags,
    calculateDiarySafetyFlags,
    generateDailySummaryBullets,
    generateStageSummaryBullets,
    extractTagsFromEvidence,
    mapTagsToDimensions,
    mapTagsToMechanismSignals,
    createConfirmedSummaryObject,
    confirmedNarrativeEvidence,
    confirmedStageEvidence,
    allQuestionObjects,
    getQuestionMetadata,
    getOptionMetadata,
    extractTagsFromAnswer,
    extractDimensionsFromAnswer,
    extractMechanismsFromAnswer,
    aggregateDimensionEvidence,
    aggregateMechanismSignals,
    aggregateReportUseEvidence,
    calculateMechanismEvidence,
    identifyMechanismCombinations,
    mechanismNamesByKey,
    containsAny,
    flattenEntryValues,
    _internal: {
      reportMode,
      calculateSafetyFlags,
      calculateMenstrualSafetyFlags,
      calculateScores,
      rankedPatterns,
      stageQuestions,
      getDiaryQuestions,
      hasMenstrualCycleContext,
      menstrualCycleEvidence,
      menstrualCycleContextHtml,
      menstrualCycleExperimentModifierHtml,
      setTestState(nextState) {
        state = {
          ...initialState,
          oneTimePaid: true,
          sevenDayPaid: true,
          upgradePaid: true,
          ...nextState
        };
      },
      getTestState() {
        return state;
      },
      nextStageQuestion,
      previousStageQuestion,
      updateQuestionValue,
      setAnswerDraft,
      toggleMulti,
      nextDiaryQuestion,
      previousDiaryQuestion,
      setDiaryValue,
      setDiaryDraftValue,
      demoCompletePayment,
      startLeadCapture,
      updateLeadField,
      submitLeadCapture,
      isInternalTestMode,
      updateInternalFeedbackField,
      submitInternalFeedback,
      refreshCoachInvite,
      acceptCoachDiscount,
      declineCoachDiscount,
      submitCoachLogin,
      updateCoachLoginField,
      addCoachClientFromDashboard,
      updateCoachClientField,
      viewCoachAssessmentReport,
      createCoachFromAdmin,
      updateAdminCoachField,
      renderInternalTesterFeedbackSurvey,
      renderFeedbackThanks,
      renderFeedbackExport,
      renderLanding,
      renderAbout,
      renderChoice,
      renderOneTimeStart,
      renderStageOne,
      renderLeadCapture,
      renderLeadThankYou,
      renderValidationSummary,
      renderSevenDayStart,
      renderSevenDayPaywall,
      renderDiary,
      hasOneTimeReportAccess,
      hasSevenDayAccess,
      hasUpgradeAccess,
      renderUnlock,
      renderUpgradePaywall,
      renderReport,
      renderCoachLogin,
      renderCoachDashboard,
      renderAdminCoach
    }
  };
}
