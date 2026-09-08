"use strict";

const neutral = Object.freeze({
  "Q-AGE": 29, "Q-SEX": "Эмэгтэй", "Q-HEIGHT": 164, "Q-WEIGHT": 62, "Q-TARGET": 58,
  "Q-MEAL-RHYTHM": "3–4 цаг", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар",
  "Q-PORTION": ["Тодорхой хоол байхгүй"], "Q-EMOTION": "Өөрчлөгддөггүй", "Q-CUE": ["Аль нь ч үгүй"],
  "HFE-HOUSEHOLD": ["Ганцаараа"], "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн",
  "Q-TRAVEL": "Алхдаг", "Q-MOVEMENT": "Их", "Q-MEDICAL-MONITORING": "Үгүй",
  "Q-ALCOHOL-FOOD": "Согтууруулах ундаа хэрэглэдэггүй", "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"], "MC-01": "Тогтмол",
  "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"],
  "Q-METHOD-CURRENT": ["Одоогоор ямар нэг арга хэрэглээгүй"], "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"],
  "Q-METHOD-BARRIERS": ["Тодорхой саад байгаагүй"]
});
const maleNeutral = { ...neutral, "Q-AGE": 36, "Q-SEX": "Эрэгтэй", "Q-HEIGHT": 170, "Q-WEIGHT": 90, "Q-TARGET": 75 };
delete maleNeutral["REPRO-STATUS"]; delete maleNeutral["MC-01"];
const attempt = Object.freeze({
  "Q-METHOD-CURRENT": ["Хоолны дэглэм"], "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "1 жилээс урт", "Q-METHOD-STOP": "Өдөр тутмын цагийн хуваарьтай нийцээгүй тул тогтвортой үргэлжлээгүй.",
  "Q-METHOD-RESULT": "Тодорхой өөрчлөлт ажиглагдаагүй", "Q-METHOD-SUPPORT": ["Мэргэжлийн дэмжлэг аваагүй"],
  "Q-METHOD-MEDICATION": "Үгүй", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Стресс ба сэтгэл хөдлөл"]
});
const u09 = { ...maleNeutral, "Q-AGE": 34, "Q-HEIGHT": 172, "Q-WEIGHT": 87, "Q-TARGET": 76, "Q-WAIST": 99,
  "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-SATIETY": "Заримдаа хэцүү",
  "Q-PORTION": ["Амттан"], "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-CUE": ["Хоол харагдах", "Бусад хүн идэж байх"],
  "Q-SLEEP-DURATION": "4–6 цаг", "Q-SLEEP-QUALITY": "Тааруу", "Q-TRAVEL": "Гэрээсээ ажилладаг", "Q-MOVEMENT": "Бага",
  "Q-ALCOHOL-FOOD": "Идэх хэмжээ нэмэгддэг", ...attempt };

module.exports = [
  { id: "U01", label: "neutral_female_blank_optional", answers: { ...neutral }, blank: ["Q-WAIST", "Q-FUNCTION"] },
  { id: "U02", label: "neutral_male_blank_optional", answers: { ...maleNeutral }, blank: ["Q-WAIST", "Q-FUNCTION"] },
  { id: "U03", label: "male_irregular_meals", answers: { ...maleNeutral, "Q-AGE": 41, "Q-HEIGHT": 176, "Q-WEIGHT": 91, "Q-TARGET": 80, "Q-WAIST": 97,
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг" }, blank: [] },
  { id: "U04", label: "female_very_short_poor_sleep", answers: { ...neutral, "Q-AGE": 33, "Q-HEIGHT": 160, "Q-WEIGHT": 76, "Q-TARGET": 65, "Q-WAIST": 88,
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-SLEEP-DURATION": "4 цагаас бага", "Q-SLEEP-QUALITY": "Маш тааруу" }, blank: [] },
  { id: "U05", label: "postpartum_household_pressure", answers: { ...neutral, "Q-AGE": 38, "Q-HEIGHT": 167, "Q-WEIGHT": 83, "Q-TARGET": 70, "Q-WAIST": 101,
    "Q-MEAL-RHYTHM": "3–4 цаг", "Q-HUNGER": "Заримдаа анзаардаг", "Q-SATIETY": "Заримдаа хэцүү", "Q-PORTION": ["Амттан", "Давслаг зууш"],
    "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-CUE": ["Хоол харагдах", "Хоолны үнэр үнэртэх"], "HFE-HOUSEHOLD": ["Хань эсвэл хамтрагчтай", "Хүүхэдтэй"],
    "HFE-CONTEXT": ["Гэрийн үндсэн хоолыг ихэвчлэн өөр хүн бэлтгэдэг", "Өөрийн порц, хачир эсвэл идэх зүйлээ гэрийн бусад хүнээс өөрөөр тохируулахад хэцүү байдаг"],
    "Q-SLEEP-QUALITY": "Дунд зэрэг", "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага", "Q-ALCOHOL-FOOD": "Идэх хэмжээ нэмэгддэг",
    "Q-FUNCTION": ["Аль нь ч биш"], "REPRO-STATUS": ["Төрсний дараах 6–24 сар", "Хөхүүл"] }, blank: [] },
  { id: "U06", label: "menopause_low_movement", answers: { ...neutral, "Q-AGE": 52, "Q-HEIGHT": 181, "Q-WEIGHT": 104, "Q-TARGET": 88, "Q-WAIST": 112,
    "Q-MEAL-RHYTHM": "5 цагаас урт", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-SATIETY": "Ихэнхдээ хэцүү", "Q-PORTION": ["Түргэн хоол"],
    "Q-EMOTION": "Бага зэрэг нэмэгддэг", "Q-CUE": ["Хоол захиалгын апп нээх", "Хоол харагдах"], "Q-SLEEP-QUALITY": "Дунд зэрэг",
    "Q-TRAVEL": "Гэрээсээ ажилладаг", "Q-MOVEMENT": "Маш бага", "Q-MEDICAL-MONITORING": "Мэдэхгүй", "Q-ALCOHOL-FOOD": "Давслаг эсвэл тослог хоол илүү хүсдэг",
    "Q-FUNCTION": ["Аль нь ч биш"], "REPRO-STATUS": ["Цэвэршилтийн шилжилтийн үе эсвэл цэвэршсэн"] }, blank: [] },
  { id: "U07", label: "pregnant_strict_attempt", answers: { ...neutral, "Q-AGE": 27, "Q-HEIGHT": 158, "Q-WEIGHT": 72, "Q-TARGET": 60, "Q-WAIST": 86,
    "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-SATIETY": "Заримдаа хэцүү", "Q-PORTION": ["Амттан"],
    "Q-EMOTION": "Бага зэрэг нэмэгддэг", "Q-SLEEP-DURATION": "4–6 цаг", "Q-SLEEP-QUALITY": "Тааруу", "Q-TRAVEL": "Нийтийн тээврээр", "Q-MOVEMENT": "Дунд",
    "REPRO-STATUS": ["Жирэмсэн"], "Q-METHOD-CURRENT": ["Хоолны дэглэм", "Илчлэг тоолох"], "Q-METHOD-PAST": ["Хоолны дэглэм", "Мацаг барих"],
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-METHOD-LONGEST": "Хоолны дэглэм", "Q-METHOD-DURATION": "2–8 долоо хоног", "Q-METHOD-STOP": "Маш хатуу дүрэмтэй байсан тул нэг удаа зөрчөөд бүх төлөвлөгөөгөө орхисон.",
    "Q-METHOD-RESULT": "Тодорхой өөрчлөлт ажиглагдаагүй", "Q-METHOD-SUPPORT": ["Мэргэжлийн дэмжлэг аваагүй"], "Q-METHOD-MEDICATION": "Үгүй",
    "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Хэт хатуу дүрэм"] }, blank: [] },
  { id: "U08", label: "maintenance_gap", answers: { ...maleNeutral, "Q-AGE": 49, "Q-HEIGHT": 173, "Q-WEIGHT": 96, "Q-TARGET": 82, "Q-WAIST": 108,
    "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-SATIETY": "Заримдаа хэцүү", "Q-PORTION": ["Гурилан хоол"],
    "Q-EMOTION": "Бага зэрэг нэмэгддэг", "Q-CUE": ["Хоол харагдах"], "Q-SLEEP-DURATION": "4–6 цаг", "Q-SLEEP-QUALITY": "Тааруу", "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага",
    "Q-MEDICAL-MONITORING": "Цусны даралт", "Q-ALCOHOL-FOOD": "Идэх хэмжээ нэмэгддэг", "Q-METHOD-CURRENT": ["Алхалт"], "Q-METHOD-PAST": ["Хоолны дэглэм"],
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-METHOD-DURATION": "6–12 сар", "Q-METHOD-STOP": "Ажлын хуваарь өөрчлөгдөхөд өдөр тутмын арга тасарсан.", "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Нэлээд нэмэгдсэн",
    "Q-MAINTENANCE-PLAN": "Үгүй, өөр хувилбар бэлдээгүй", "Q-METHOD-SUPPORT": ["Хоолзүйч"], "Q-METHOD-MEDICATION": "Үгүй", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Ядаргаа эсвэл нойр"] }, blank: [] },
  { id: "U09", label: "alone_high_pattern", answers: { ...u09, "Q-FUNCTION": ["Аль нь ч биш"], "Q-METHOD-STOP": "Ажлын цагтай нийцээгүй." }, blank: [] },
  { id: "U10", label: "household_firewall", answers: { ...u09, "HFE-HOUSEHOLD": ["Хань эсвэл хамтрагчтай", "Хүүхэдтэй"],
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-METHOD-STOP": "Ажлын цагтай нийцээгүй.", "HFE-CONTEXT": ["Гэрийн бусад хүмүүсийн хоолыг би тогтмол бэлтгэж эсвэл зохицуулдаг", "Гэрийн бусад хүний хоолны цаг, хэрэгцээнд тааруулахын тулд өөрийн хоол хойшилдог", "Өөрийн порц, хачир эсвэл идэх зүйлээ гэрийн бусад хүнээс өөрөөр тохируулахад хэцүү байдаг", "Надад идэх хүсэл төрүүлдэг хүнс гэрийн бусад хүнд зориулж гэрт тогтмол бэлэн байдаг"] }, blank: [] },
  { id: "U11", label: "maintenance_plan_present", answers: { ...maleNeutral }, blank: [] },
  { id: "U12", label: "body_context_firewall", answers: { ...maleNeutral, "Q-WAIST": 105, "Q-FUNCTION": ["Алхах эсвэл шатаар өгсөх", "Бөхийх, гутлаа өмсөх зэрэг хөдөлгөөн"] }, blank: [] },
  { id: "U13", label: "eating_behavior_professional", expectedSafetyRoute: "eating_behavior_professional", answers: { ...neutral, "Q-AGE": 24, "Q-HEIGHT": 165, "Q-WEIGHT": 61, "Q-TARGET": 57, "Q-WAIST": 72,
    "Q-FUNCTION": ["Аль нь ч биш"], "REPRO-STATUS": ["Аль нь ч биш"], "S1-S03": "Сүүлийн 28 хоногт байсан", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"] }, blank: [] },
  { id: "U14", label: "urgent_self_harm", expectedSafetyRoute: "urgent_self_harm", answers: { ...neutral, "Q-AGE": 31, "Q-HEIGHT": 162, "Q-WEIGHT": 70, "Q-TARGET": 62, "Q-WAIST": 84,
    "Q-MEAL-RHYTHM": "4–5 цаг", "Q-HUNGER": "Заримдаа анзаардаг", "Q-SATIETY": "Заримдаа хэцүү", "Q-PORTION": ["Хариулахгүй"], "Q-EMOTION": "Хариулахгүй", "Q-CUE": ["Хариулахгүй"],
    "Q-SLEEP-DURATION": "4–6 цаг", "Q-SLEEP-QUALITY": "Тааруу", "Q-TRAVEL": "Нийтийн тээврээр", "Q-MOVEMENT": "Бага", "Q-MEDICAL-MONITORING": "Хариулахгүй",
    "Q-FUNCTION": ["Аль нь ч биш"], "Q-ALCOHOL-FOOD": "Хариулахгүй", "REPRO-STATUS": ["Хариулахгүй"], "S1-S03": "Үгүй", "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" }, blank: [] },
  { id: "U15", label: "urgent_medical_symptom", expectedSafetyRoute: "urgent_medical_symptom", answers: { ...maleNeutral, "Q-AGE": 58, "Q-HEIGHT": 169, "Q-WEIGHT": 88, "Q-TARGET": 78, "Q-WAIST": 106,
    "Q-FUNCTION": ["Хэсэг хугацаанд зогсох эсвэл алхах"], "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Тодорхой биш", "Q-SATIETY": "Хариулахгүй", "Q-PORTION": ["Хариулахгүй"],
    "Q-EMOTION": "Тодорхой биш", "Q-CUE": ["Хариулахгүй"], "HFE-HOUSEHOLD": ["Хань эсвэл хамтрагчтай"], "HFE-CONTEXT": ["Дээрхээс аль нь ч тогтмол тохиолддоггүй"],
    "Q-SLEEP-QUALITY": "Дунд зэрэг", "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага", "Q-MEDICAL-MONITORING": "Цусны даралт", "Q-ALCOHOL-FOOD": "Тодорхой биш",
    "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Ухаан балартах"] }, blank: [] }
];

const u08 = module.exports.find(profile => profile.id === "U08");
const u11 = module.exports.find(profile => profile.id === "U11");
u11.answers = { ...u08.answers, "Q-MAINTENANCE-PLAN": "Тийм, тодорхой хувилбар байсан" };
u11.answers["Q-FUNCTION"] = ["Аль нь ч биш"];
u11.answers["Q-METHOD-STOP"] = "Ажлын хуваарь өөрчлөгдөхөд өдөр тутмын арга тасарсан.";
u11.blank = [];
