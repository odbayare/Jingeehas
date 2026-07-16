(function exposeQuestionBank(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JingeehasQuestions = api;
})(typeof window !== "undefined" ? window : globalThis, function buildQuestionBank() {
  "use strict";

  const QUESTIONS = Object.freeze([
    { id: "Q-AGE", section: "Суурь мэдээлэл", type: "number", text: "Таны нас", required: true, min: 18, max: 120, unit: "нас" },
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
    { id: "MC-GATE", section: "Сарын тэмдгийн мөчлөг", type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", required: false, options: ["Тийм, хамаарна", "Үгүй, хамаарахгүй", "Хариулахгүй"], sensitive: true },
    { id: "MC-01", parent: "MC-GATE", showWhen: "Тийм, хамаарна", section: "Сарын тэмдгийн мөчлөг", type: "single", text: "Таны мөчлөг ихэвчлэн ямар байдаг вэ?", required: false, options: ["Тогтмол", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Хариулахгүй"], sensitive: true },
    { id: "ALC-GATE", section: "Согтууруулах ундааны хэрэглээ", type: "single", text: "Та согтууруулах ундаа хэрэглэдэг үү?", required: false, options: ["Үгүй", "Хааяа", "Тогтмол", "Хариулахгүй"], sensitive: true },
    { id: "ALC-01", parent: "ALC-GATE", showWhen: ["Хааяа", "Тогтмол"], section: "Согтууруулах ундааны хэрэглээ", type: "single", text: "Хэрэглэсэн үед хоолны сонголт тань хэр өөрчлөгддөг вэ?", required: false, options: ["Өөрчлөгддөггүй", "Идэх хэмжээ нэмэгддэг", "Давслаг эсвэл тослог хоол илүү хүсдэг", "Тодорхой биш", "Хариулахгүй"] },
    { id: "TOB-GATE", section: "Тамхины хэрэглээ", type: "single", text: "Та тамхи эсвэл никотин агуулсан бүтээгдэхүүн хэрэглэдэг үү?", required: false, options: ["Үгүй", "Хааяа", "Тогтмол", "Хариулахгүй"], sensitive: true },
    { id: "TOB-01", parent: "TOB-GATE", showWhen: ["Хааяа", "Тогтмол"], section: "Тамхины хэрэглээ", type: "single", text: "Хэрэглэх үед хоолны дуршил тань өөрчлөгддөг үү?", required: false, options: ["Өөрчлөгддөггүй", "Багасдаг", "Дараа нь нэмэгддэг", "Тодорхой биш", "Хариулахгүй"] },
    { id: "PREG-GATE", section: "Жирэмслэлт ба төрсний дараах үе", type: "single", text: "Та одоогоор жирэмсэн, төрсний дараах эсвэл хөхүүл үед байна уу?", required: false, options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0–6 сар", "Төрсний дараах 6–24 сар", "Хөхүүл", "Хариулахгүй"], sensitive: true },
    { id: "S1-S03", section: "Аюулгүй байдлын дохио", type: "single", text: "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?", required: true, options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], sensitive: true },
    { id: "S1-S04", section: "Аюулгүй байдлын дохио", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", required: true, options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], sensitive: true },
    { id: "S1-B01", section: "Аюулгүй байдлын дохио", type: "multi", text: "Одоо илэрч буй биеийн яаралтай шинж аль нь вэ?", required: true, max: 3, options: ["Будилах", "Ухаан балартах", "Бие огцом муудах", "Аль нь ч үгүй", "Хариулахгүй"], sensitive: true },
    { id: "OPEN-PAST", section: "Өмнөх оролдлого", type: "text", text: "Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?", required: false, maxLength: 2000 }
  ]);

  function questionById(id) { return QUESTIONS.find(question => question.id === id) || null; }
  function isApplicable(question, answers) {
    if (!question.parent) return true;
    const parentValue = answers[question.parent];
    return Array.isArray(question.showWhen) ? question.showWhen.includes(parentValue) : parentValue === question.showWhen;
  }
  function visibleQuestions(answers = {}) { return QUESTIONS.filter(question => isApplicable(question, answers)); }
  function validateAnswer(question, value) {
    const empty = value == null || value === "" || (Array.isArray(value) && value.length === 0);
    if (empty) return question.required ? "Энэ асуултад хариулна уу." : "";
    if (question.type === "number") {
      const number = Number(value);
      if (!Number.isFinite(number) || number < question.min || number > question.max) return "Зөв тоон утга оруулна уу.";
    }
    if (question.type === "multi" && Array.isArray(value) && value.length > question.max) return "Та хамгийн ихдээ 3 хариулт сонгох боломжтой.";
    if (question.type === "text" && String(value).length > question.maxLength) return "Хариултаа богиносгоно уу.";
    return "";
  }

  return { QUESTIONS, questionById, isApplicable, visibleQuestions, validateAnswer };
});
