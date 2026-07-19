(function exposeQuestionBank(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JingeehasQuestions = api;
})(typeof window !== "undefined" ? window : globalThis, function buildQuestionBank() {
  "use strict";

  const LEGACY_QUESTIONNAIRE_VERSION = "jingeehas-production-2026-07";
  const QUESTIONNAIRE_VERSION = "jingeehas-production-2026-07-v2-method-link";

  const QUESTIONS = Object.freeze([
    { id: "Q-AGE", section: "Суурь мэдээлэл", type: "number", text: "Таны нас", required: true, min: 18, max: 120, unit: "нас" },
    { id: "Q-SEX", section: "Суурь мэдээлэл", type: "single", text: "Таны биологийн хүйс аль вэ?", required: true, options: ["Эмэгтэй", "Эрэгтэй", "Хариулахгүй байхыг хүсэж байна"], sensitive: true, routingOnly: true },
    { id: "Q-HEIGHT", section: "Суурь мэдээлэл", type: "number", text: "Таны өндөр", required: true, min: 120, max: 230, unit: "см" },
    { id: "Q-WEIGHT", section: "Суурь мэдээлэл", type: "number", text: "Таны одоогийн жин", required: true, min: 30, max: 350, unit: "кг" },
    { id: "Q-TARGET", section: "Суурь мэдээлэл", type: "number", text: "Таны зорилтот жин", required: false, min: 30, max: 350, unit: "кг" },
    { id: "Q-MEAL-RHYTHM", section: "Хооллох хэмнэл", type: "single", text: "Ердийн өдрүүдэд хоол хоорондын зай тань ямар байдаг вэ?", required: true, options: ["3–4 цаг", "4–5 цаг", "5 цагаас урт", "Тогтмол биш"] },
    { id: "Q-HUNGER", section: "Өлсөх ба цадах дохио", type: "single", text: "Хоолноос өмнө өлсөх мэдрэмжээ анзаарах нь танд хэр амар байдаг вэ?", required: true, options: ["Амар", "Заримдаа анзаардаг", "Хэт өлссөний дараа анзаардаг", "Тодорхой биш"] },
    { id: "Q-SATIETY", section: "Өлсөх ба цадах дохио", type: "single", text: "Идэж байхдаа цадсанаа анзаараад зогсох нь танд хэр амар байдаг вэ?", required: true, options: ["Амар", "Заримдаа хэцүү", "Ихэнхдээ хэцүү", "Хариулахгүй"], sensitive: true },
    { id: "Q-FOOD-FEELING", section: "Хооллосны дараах мэдрэмж ба цадалт", type: "multi", text: "Идсэний дараа тавгүй мэдрэмж төрүүлсэн хоол аль нь вэ?", required: false, max: 3, options: ["Тослог, шарсан хоол", "Гурилан хоол", "Сүү, сүүн бүтээгдэхүүн", "Чихэрлэг зүйл", "Тодорхой хоол анзаараагүй", "Хариулахгүй"], sensitive: true },
    { id: "Q-PORTION", section: "Хооллосны дараах мэдрэмж ба цадалт", type: "multi", text: "Идэх хэмжээгээ тохируулахад хэцүү санагддаг хоол аль нь вэ?", required: false, max: 3, options: ["Амттан", "Давслаг зууш", "Түргэн хоол", "Гурилан хоол", "Тодорхой хоол байхгүй", "Хариулахгүй"], sensitive: true },
    { id: "Q-EMOTION", section: "Сэтгэл хөдлөл", type: "single", text: "Стресстэй үедээ хоол идэх хүсэл тань хэр өөрчлөгддөг вэ?", required: true, options: ["Өөрчлөгддөггүй", "Бага зэрэг нэмэгддэг", "Нэлээд нэмэгддэг", "Тодорхой биш", "Хариулахгүй"], sensitive: true },
    { id: "Q-CUE", section: "Орчны дохио", type: "multi", text: "Өлсөөгүй үед идэх хүсэл төрөхөд аль нөхцөл нөлөөлдөг вэ?", required: false, max: 3, options: ["Хоол харагдах", "Хоолны үнэр үнэртэх", "Хоол захиалгын апп нээх", "Бусад хүн идэж байх", "Аль нь ч үгүй", "Хариулахгүй"] },
    { id: "Q-SLEEP-DURATION", section: "Нойр", type: "single", text: "Ердийн шөнө хэдэн цаг унтдаг вэ?", required: true, options: ["4 цагаас бага", "4–6 цаг", "6–8 цаг", "8 цагаас их"] },
    { id: "Q-SLEEP-QUALITY", section: "Нойр", type: "single", text: "Унтсан хугацаанаас үл хамааран нойрны чанар тань ямар байдаг вэ?", required: true, options: ["Сайн амардаг", "Заримдаа тасалддаг", "Олон сэрдэг", "Өглөө ядарсан хэвээр байдаг"] },
    { id: "Q-TRAVEL", section: "Өдөр тутмын хөдөлгөөн", type: "single", text: "Та өдөр тутам ихэвчлэн хэрхэн зорчдог вэ?", required: false, options: ["Алхдаг", "Нийтийн тээврээр", "Машинаар", "Гэрээсээ ажилладаг", "Өөр хэлбэрээр"] },
    { id: "Q-MOVEMENT", section: "Өдөр тутмын хөдөлгөөн", type: "single", text: "Зорчих хэлбэрээс үл хамааран өдрийн нийт хөдөлгөөн тань ямар байдаг вэ?", required: true, options: ["Маш бага", "Бага", "Дунд", "Их"] },
    { id: "Q-GLUCOSE", section: "Биеийн шинж", type: "single", text: "Цусан дахь сахараа хэмжиж байсан бол үр дүн нь ямар байсан бэ?", required: false, options: ["Хэмжиж байгаагүй", "Хэвийн", "Хэвийн хэмжээнээс бага эсвэл их гарч байсан", "Хариулахгүй"], sensitive: true },
    { id: "Q-BLOOD-PRESSURE", section: "Биеийн шинж", type: "single", text: "Цусны даралтаа хэмжиж байсан бол үр дүн нь ямар байсан бэ?", required: false, options: ["Хэмжиж байгаагүй", "Хэвийн", "Хэвийн хэмжээнээс бага эсвэл их гарч байсан", "Хариулахгүй"], sensitive: true },
    { id: "MC-GATE", parent: "Q-SEX", showWhen: "Эмэгтэй", section: "Сарын тэмдгийн мөчлөг", type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", required: false, options: ["Тийм, хамаарна", "Үгүй, хамаарахгүй", "Хариулахгүй"], sensitive: true, sexSpecific: true },
    { id: "MC-01", parent: "MC-GATE", showWhen: "Тийм, хамаарна", section: "Сарын тэмдгийн мөчлөг", type: "single", text: "Таны мөчлөг ихэвчлэн ямар байдаг вэ?", required: false, options: ["Тогтмол", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Хариулахгүй"], sensitive: true },
    { id: "ALC-GATE", section: "Согтууруулах ундааны хэрэглээ", type: "single", text: "Та согтууруулах ундаа хэрэглэдэг үү?", required: false, options: ["Үгүй", "Хааяа", "Тогтмол", "Хариулахгүй"], sensitive: true },
    { id: "ALC-01", parent: "ALC-GATE", showWhen: ["Хааяа", "Тогтмол"], section: "Согтууруулах ундааны хэрэглээ", type: "single", text: "Хэрэглэсэн үед хоолны сонголт тань хэр өөрчлөгддөг вэ?", required: false, options: ["Өөрчлөгддөггүй", "Идэх хэмжээ нэмэгддэг", "Давслаг эсвэл тослог хоол илүү хүсдэг", "Тодорхой биш", "Хариулахгүй"] },
    { id: "TOB-GATE", section: "Тамхины хэрэглээ", type: "single", text: "Та тамхи эсвэл никотин агуулсан бүтээгдэхүүн хэрэглэдэг үү?", required: false, options: ["Үгүй", "Хааяа", "Тогтмол", "Хариулахгүй"], sensitive: true },
    { id: "TOB-01", parent: "TOB-GATE", showWhen: ["Хааяа", "Тогтмол"], section: "Тамхины хэрэглээ", type: "single", text: "Хэрэглэх үед хоолны дуршил тань өөрчлөгддөг үү?", required: false, options: ["Өөрчлөгддөггүй", "Багасдаг", "Дараа нь нэмэгддэг", "Тодорхой биш", "Хариулахгүй"] },
    { id: "PREG-GATE", parent: "Q-SEX", showWhen: "Эмэгтэй", section: "Жирэмслэлт ба төрсний дараах үе", type: "single", text: "Та одоогоор жирэмсэн, төрсний дараах эсвэл хөхүүл үед байна уу?", required: false, options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0–6 сар", "Төрсний дараах 6–24 сар", "Хөхүүл", "Хариулахгүй"], sensitive: true, sexSpecific: true },
    { id: "MENO-GATE", parent: "Q-SEX", showWhen: "Эмэгтэй", section: "Цэвэршилтийн үе", type: "single", text: "Цэвэршилттэй холбоотой асуулт танд хамаарах уу?", required: false, options: ["Тийм, хамаарна", "Үгүй, хамаарахгүй", "Тодорхойгүй", "Хариулахгүй"], sensitive: true, sexSpecific: true },
    { id: "S1-S03", section: "Аюулгүй байдлын дохио", type: "single", text: "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?", required: true, options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], sensitive: true },
    { id: "S1-S04", section: "Аюулгүй байдлын дохио", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", required: true, options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], sensitive: true },
    { id: "S1-B01", section: "Аюулгүй байдлын дохио", type: "multi", text: "Одоо илэрч буй биеийн яаралтай шинж аль нь вэ?", required: true, max: 3, options: ["Будилах", "Ухаан балартах", "Бие огцом муудах", "Аль нь ч үгүй", "Хариулахгүй"], sensitive: true },
    { id: "Q-METHOD-CURRENT", section: "Жин бууруулах аргын түүх", type: "multi", text: "Та одоогоор жингээ бууруулахын тулд ямар арга хэрэглэж байна вэ?", required: true, max: 8, options: ["Хоолны дэглэм", "Илчлэг тоолох", "Мацаг барих", "Нүүрс ус багасгах", "Дасгал хөдөлгөөн", "Алхалт", "Жин хасах эм", "Хоолны дуршил бууруулах бүтээгдэхүүн", "Нэмэлт бүтээгдэхүүн", "Мэргэжлийн хоолзүйчийн зөвлөгөө", "Сэтгэлзүйн зөвлөгөө", "Мэс заслын арга", "Онлайн хөтөлбөр эсвэл апп", "Өөр арга", "Одоогоор ямар нэг арга хэрэглээгүй"] },
    { id: "Q-METHOD-PAST", section: "Жин бууруулах аргын түүх", type: "multi", text: "Жингээ бууруулахын тулд дараах аргуудаас алийг нь хэрэглэж үзсэн бэ?", required: true, max: 8, options: ["Хоолны дэглэм", "Илчлэг тоолох", "Мацаг барих", "Нүүрс ус багасгах", "Дасгал хөдөлгөөн", "Алхалт", "Жин хасах эм", "Хоолны дуршил бууруулах бүтээгдэхүүн", "Нэмэлт бүтээгдэхүүн", "Мэргэжлийн хоолзүйчийн зөвлөгөө", "Сэтгэлзүйн зөвлөгөө", "Мэс заслын арга", "Онлайн хөтөлбөр эсвэл апп", "Өөр арга", "Ямар нэг арга хэрэглэж үзээгүй"] },
    { id: "Q-METHOD-LONGEST", introducedIn: QUESTIONNAIRE_VERSION, parent: "Q-METHOD-PAST", showWhenSelectionCountAtLeast: 2, showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], dynamicOptionsFrom: "Q-METHOD-PAST", section: "Жин бууруулах аргын түүх", type: "single", text: "Таны хамгийн удаан үргэлжилсэн оролдлого аль арга байсан бэ?", required: true, options: [] },
    { id: "Q-METHOD-DURATION", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "single", text: "Өмнөх оролдлогоос хамгийн удаан үргэлжилсэн нь хэр удаан байсан бэ?", required: true, options: ["2 долоо хоногоос бага", "2–8 долоо хоног", "2–6 сар", "6–12 сар", "1 жилээс урт", "Тодорхой санахгүй"] },
    { id: "Q-METHOD-STOP", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "text", text: "Тэр оролдлого яагаад зогссон бэ?", required: true, maxLength: 1000 },
    { id: "Q-METHOD-RESULT", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "single", text: "Эхний үед ямар үр дүн ажиглагдсан бэ?", required: true, options: ["Жин буурсан", "Жин тогтвортой байсан", "Жин нэмэгдсэн", "Тодорхой өөрчлөлт ажиглагдаагүй", "Тодорхой санахгүй"] },
    { id: "Q-METHOD-REGAIN", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "single", text: "Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", required: true, options: ["Үгүй", "Хэсэгчлэн нэмэгдсэн", "Ихэнх нь эргэн нэмэгдсэн", "Өмнөхөөс илүү нэмэгдсэн", "Тодорхой санахгүй"] },
    { id: "Q-METHOD-SUPPORT", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "multi", text: "Тухайн үед ямар мэргэжлийн дэмжлэг авсан бэ?", required: true, max: 4, options: ["Эмч", "Хоолзүйч", "Сэтгэлзүйч", "Дасгал хөдөлгөөний мэргэжилтэн", "Бусад мэргэжилтэн", "Мэргэжлийн дэмжлэг аваагүй", "Хариулахгүй"] },
    { id: "Q-METHOD-MEDICATION", parent: "Q-METHOD-PAST", showWhenExcludes: ["Ямар нэг арга хэрэглэж үзээгүй"], section: "Жин бууруулах аргын түүх", type: "single", text: "Жин бууруулах оролдлогын үеэр эм эсвэл нэмэлт бүтээгдэхүүн хэрэглэж байсан уу? Нэр, тун бичих шаардлагагүй.", required: true, options: ["Үгүй", "Эмчийн хяналттай эм хэрэглэсэн", "Эмчийн хяналтгүй эм хэрэглэсэн", "Нэмэлт бүтээгдэхүүн хэрэглэсэн", "Тодорхойгүй", "Хариулахгүй"], sensitive: true },
    { id: "Q-METHOD-BARRIERS", section: "Жин бууруулах аргын түүх", type: "multi", text: "Аргаа тогтвортой үргэлжлүүлэхэд юу хамгийн их саад болдог вэ?", required: true, max: 5, options: ["Цагийн хуваарь", "Өлсөх эсвэл цадах мэдрэмж", "Стресс ба сэтгэл хөдлөл", "Гэр бүл эсвэл орчны нөлөө", "Зардал", "Ядаргаа эсвэл нойр", "Өвдөлт эсвэл хөдөлгөөний хязгаарлалт", "Үр дүн удаан харагдах", "Хэт хатуу дүрэм", "Тодорхой саад байгаагүй", "Хариулахгүй"] },
    { id: "OPEN-PAST", section: "Өмнөх оролдлого", type: "text", text: "Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?", required: false, maxLength: 2000 }
  ]);
  const MAX_ROUTED_QUESTION_COUNT = 40;

  function versionAllows(question, version = QUESTIONNAIRE_VERSION) {
    return !question.introducedIn || version === question.introducedIn;
  }
  function questionById(id, version = QUESTIONNAIRE_VERSION) {
    const question = QUESTIONS.find(item => item.id === id) || null;
    return question && versionAllows(question, version) ? question : null;
  }
  function isApplicable(question, answers, seen = new Set(), version = QUESTIONNAIRE_VERSION) {
    if (!versionAllows(question, version)) return false;
    if (!question.parent) return true;
    if (seen.has(question.id)) return false;
    const parentQuestion = questionById(question.parent, version);
    if (!parentQuestion || !isApplicable(parentQuestion, answers, new Set([...seen, question.id]), version)) return false;
    const parentValue = answers[question.parent];
    if (question.showWhenExcludes) {
      if (!Array.isArray(parentValue) || parentValue.length === 0) return false;
      if (question.showWhenExcludes.some(value => parentValue.includes(value))) return false;
      if (question.showWhenSelectionCountAtLeast && parentValue.length < question.showWhenSelectionCountAtLeast) return false;
      return true;
    }
    return Array.isArray(question.showWhen) ? question.showWhen.includes(parentValue) : parentValue === question.showWhen;
  }
  function materializeQuestion(question, answers = {}) {
    if (!question.dynamicOptionsFrom) return question;
    const selected = Array.isArray(answers[question.dynamicOptionsFrom]) ? answers[question.dynamicOptionsFrom] : [];
    return { ...question, options: selected.filter(option => option !== "Ямар нэг арга хэрэглэж үзээгүй") };
  }
  function visibleQuestions(answers = {}, version = QUESTIONNAIRE_VERSION) {
    return QUESTIONS.filter(question => isApplicable(question, answers, new Set(), version)).map(question => materializeQuestion(question, answers));
  }
  function autoLinkedLongestMethod(answers = {}, version = QUESTIONNAIRE_VERSION) {
    if (version !== QUESTIONNAIRE_VERSION) return null;
    const selected = Array.isArray(answers["Q-METHOD-PAST"]) ? answers["Q-METHOD-PAST"].filter(option => option !== "Ямар нэг арга хэрэглэж үзээгүй") : [];
    return selected.length === 1 ? selected[0] : answers["Q-METHOD-LONGEST"] || null;
  }
  function validateAnswer(question, value, context = {}) {
    question = materializeQuestion(question, context.answers || {});
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
    if (empty) return question.required ? "Энэ асуултад хариулна уу." : "";
    if (question.type === "number") {
      const number = Number(value);
      if (!Number.isFinite(number) || number < question.min || number > question.max) return "Зөв тоон утга оруулна уу.";
    }
    if (question.type === "single" && !question.options.includes(value)) return "Зөв хариулт сонгоно уу.";
    if (question.type === "multi") {
      if (!Array.isArray(value) || new Set(value).size !== value.length || value.some(item => !question.options.includes(item))) return "Зөв хариулт сонгоно уу.";
      if (value.length > question.max) return `Та хамгийн ихдээ ${question.max} хариулт сонгох боломжтой.`;
    }
    if (question.type === "text" && (typeof value !== "string" || value.length > question.maxLength)) return "Хариултаа богиносгоно уу.";
    return "";
  }

  return { QUESTIONS, LEGACY_QUESTIONNAIRE_VERSION, QUESTIONNAIRE_VERSION, MAX_ROUTED_QUESTION_COUNT, questionById, isApplicable, visibleQuestions, autoLinkedLongestMethod, validateAnswer };
});
