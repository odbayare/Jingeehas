"use strict";

const PATTERN_COPY = Object.freeze({
  emotional_regulation: {
    explanation: "Стресс ихсэх үед хоол идэх хүсэл нэмэгдэж, хоол түр амрах арга шиг санагддаг үе гардаг.",
    effectOnWeightLoss: "Ийм үед урьдчилсан төлөвлөгөөнөөс илүү тухайн мөчийн тайвшрал сонголтыг чиглүүлэх магадлалтай.",
    uncertainty: "Энэ нь онош биш бөгөөд сэтгэл хөдлөл бүр хооллолтыг өөрчилдөг гэсэн үг биш."
  },
  environmental_cues: {
    explanation: "Хоол нүдэнд ойр байх, үнэртэх эсвэл захиалгын апп нээхэд өлсөөгүй байсан ч идэх хүсэл хөдөлдөг.",
    effectOnWeightLoss: "Орчин давтан сануулахад төлөвлөөгүй идэлт нэмэгдэж, хоолны хэмнэл алдагдахад нөлөөлдөг.",
    uncertainty: "Орчны дохио дангаараа бүх сонголтыг тайлбарлахгүй."
  },
  irregular_meals_late_hunger: {
    explanation: "Хоолны зай уртсах эсвэл тогтмол бус болох үед өлсөлтийн дохио хэт хүчтэй болсны дараа анзаарагддаг.",
    effectOnWeightLoss: "Орой бие яарч эхлэхэд идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог.",
    uncertainty: "Өдөр бүр ижил биш тул яг аль цагт хүндрэл үүсдгийг ажиглах хэрэгтэй."
  },
  hunger_satiety: {
    explanation: "Өлсөх эсвэл цадах дохиог цагт нь анзаарах хэцүү үед хоол эхлэх, зогсох мөч хоёулаа оройтдог.",
    effectOnWeightLoss: "Идэх хэмжээ биеийн дохионоос илүү таваг, орчин эсвэл тухайн мөчийн яарлаар шийдэгдэх эрсдэлтэй.",
    uncertainty: "Нэг хоолны туршлагаар биш, давтагддаг мөчөөр нь дүгнэнэ."
  },
  sleep_fatigue: {
    explanation: "Нойр дутуу эсвэл тасалдсан өдөр бодож төлөвлөх тэнхээ оройдоо багасдаг.",
    effectOnWeightLoss: "Ядарсан үед хамгийн амархан бэлэн сонголт руу орох нь нэмэгдэж, тогтвортой төлөвлөгөө барихад саад болдог.",
    uncertainty: "Нойр нь нөлөөлөгч нөхцөл болохоос жингийн ганц шалтгаан биш."
  },
  low_movement: {
    explanation: "Өдөржин суух, машинаар зорчих эсвэл нийт хөдөлгөөн бага байх нь өдөр тутмын зарцуулалтыг багасгадаг.",
    effectOnWeightLoss: "Хооллолт өөрчлөгдөөгүй ч хөдөлгөөн багатай өдрүүд зорилгод хүрэх хурдад нөлөөлөх боломжтой.",
    uncertainty: "Энд дасгалын чадвар бус, одоогийн өдрийн нийт хөдөлгөөнийг л тайлбарлаж байна."
  },
  restrictive_rebound: {
    explanation: "Хэт хатуу дүрэмтэй арга эхэндээ хэрэгжих мэт боловч удаан барихад хэцүү болж, төлөвлөгөөг бүхэлд нь орхих эрсдэлтэй.",
    effectOnWeightLoss: "Нэг удаагийн хазайлтыг бүтэлгүйтэл гэж үзвэл төлөвлөгөөг бүхэлд нь орхих магадлал нэмэгдэнэ.",
    uncertainty: "Өмнөх арга бүр хэт хатуу байсан гэж дүгнэхгүй; зөвхөн давхцсан хариултуудыг тайлбарлаж байна."
  },
  plan_daily_life_mismatch: {
    explanation: "Өдөр тутмын бодит нөхцөлтэй нийцэхгүй төлөвлөгөө сайн санаатай байсан ч тогтмол хэрэгжихгүй үлддэг.",
    effectOnWeightLoss: "Хэрэгжүүлэх босго өндөр байх тусам бодит нөхцөл өөрчлөгдөхөд төлөвлөгөөнөөс гарах нь амархан болдог.",
    uncertainty: "Энэ нь сахилга батгүй гэсэн үг биш; төлөвлөгөөний ачаалал амьдралын нөхцөлтэй нийцсэн эсэхийг шалгаж байна."
  },
  previous_attempt_sustainability: {
    explanation: "Өмнөх арга зогсох эсвэл нөхцөл өөрчлөгдөх үед үр дүнг хадгалах өдөр тутмын төлөвлөгөө хэрэгтэй болдог.",
    effectOnWeightLoss: "Орлуулах бодит төлөвлөгөөгүй бол өмнөх өөрчлөлтөө өдөр тутам үргэлжлүүлэхэд хэцүү болдог.",
    uncertainty: "Энэ нь эхлэх эсвэл тууштай байх чадвар дутсан гэсэн үг биш; арга тасарсны дараах төлөвлөгөөг тайлбарлаж байна."
  }
});

const PATTERN_PUBLIC_TITLES = Object.freeze({
  previous_attempt_sustainability: "Арга тасарсны дараа үр дүнгээ хадгалах төлөвлөгөө дутсан нь"
});

const CONTEXT_PUBLIC_TITLES = Object.freeze({
  low_movement: "Өдөр тутмын хөдөлгөөн бага хэвээр үлдсэн нь",
  injury_or_pain_barrier: "Өмнөх гэмтэл хөдөлгөөнийг үргэлжлүүлэхэд саад болсон нь"
});

const SENTENCE_TEMPLATES = Object.freeze({
  overview_emotional: { requiredPatterns: ["emotional_regulation"], text: "Таны хариултаар стресс нэмэгдэх үед хоол идэх хүсэл хүчтэй болдог нь хамгийн тод анхаарах хэв маягийн нэг байна." },
  overview_environmental: { requiredPatterns: ["environmental_cues"], text: "Өлсөөгүй үед ч орчны хоолны дохио идэх хүсэлд нөлөөлдөг нь гол анхаарах хэв маягийн нэг байна." },
  overview_meal_rhythm: { requiredPatterns: ["irregular_meals_late_hunger"], text: "Хоолны хэмнэл алдагдаж, өлсөлт хэт хүчтэй болсны дараа анзаарагддаг нь гол анхаарах хэв маягийн нэг байна." },
  overview_hunger_satiety: { requiredPatterns: ["hunger_satiety"], text: "Өлсөх, цадах дохиог цагт нь анзаарахад хүндрэлтэй байгаа нь идэх мөч болон хэмжээг тохируулахад нөлөөлж байна." },
  overview_restrictive: { requiredPatterns: ["restrictive_rebound"], text: "Хэт хатуу арга тасрахад өмнөх дүрэм бүхэлдээ орхигдох эрсдэл илүү тод байна." },
  overview_plan_mismatch: { requiredPatterns: ["plan_daily_life_mismatch"], text: "Өмнөх төлөвлөгөө өдөр тутмын амьдралд багтаагүй нь тогтвортой үргэлжлүүлэхэд саад болжээ." },
  overview_previous_attempt: { requiredPatterns: ["previous_attempt_sustainability"], text: "Хамгийн тод асуудал нь өмнөх арга үр дүнгүй байсанд бус, арга тасарсны дараа үр дүнгээ хадгалах бодит төлөвлөгөө бэлэн байгаагүйд байна." },
  overview_low_movement: { requiredPatterns: ["low_movement"], text: "Одоогийн өдөр тутмын хөдөлгөөн бага байгаа нь дараагийн төлөвлөгөөнд заавал тооцох нөхцөл болж байна." },
  overview_sleep: { requiredPatterns: ["sleep_fatigue"], text: "Нойр болон ядаргаа өдөр тутмын сонголтоо төлөвлөхөд нөлөөлж байна." },
  overview_schedule: { requiredSignals: ["schedule_barrier"], text: "Дараагийн хувилбар цагийн хуваарьт бодитоор багтах шаардлагатай." },
  overview_cost: { requiredSignals: ["cost_barrier"], text: "Нэмэлт зардал шаардахгүй байх нь төлөвлөгөөг үргэлжлүүлэхэд чухал." },
  overview_injury: { requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтлийг сэдрээхгүй хүрээнд сонголт хийх шаардлагатай." },
  overview_protective_emotion: { requiredProtectiveSignals: ["emotional_eating"], text: "Сэтгэл хөдлөлийн нөлөөгөөр идэх нь одоогийн гол саад болж харагдсангүй." },
  overview_protective_body: { requiredProtectiveSignals: ["hunger_recognition_difficulty", "satiety_difficulty"], text: "Өлсөх, цадах мэдрэмжээ анзаарах чадвар тань харьцангуй сайн байна." },
  overview_protective_cue: { requiredProtectiveSignals: ["environmental_cue_reactivity"], text: "Орчны хоолны өдөөлт таны сонголтыг тогтмол алдагдуулдаг шинж илрээгүй." },
  overview_protective_sleep: { requiredProtectiveSignals: ["short_sleep", "poor_sleep_quality"], text: "Нойрны хүндрэл хооллолтын гол саад болж харагдсангүй." },
  overview_protective_core: { requiredProtectiveSignals: ["emotional_eating", "hunger_recognition_difficulty", "satiety_difficulty"], text: "Сэтгэл хөдлөлийн нөлөөгөөр идэх эсвэл өлсөх, цадах дохиогоо анзаарах хүндрэл нь гол саад болж харагдсангүй." },
  overview_strategy_direction: { requiredPatterns: ["previous_attempt_sustainability"], requiredProtectiveSignals: ["emotional_eating", "hunger_recognition_difficulty", "satiety_difficulty"], text: "Тиймээс хооллолтыг шинээр хязгаарлахаас илүү өдөр тутам үргэлжлүүлж болох төлөвлөгөөнд төвлөрөх нь таны хариултад илүү нийцнэ." },

  evidence_emotional: { requiredPatterns: ["emotional_regulation"], text: "Стресс нэмэгдэхэд идэх хүсэл тань хүчтэй болж, сэтгэл хөдлөл өдөр тутмын сонголтоо тогтвортой барихад саад болсон байна." },
  evidence_environmental: { requiredPatterns: ["environmental_cues"], text: "Өлсөөгүй үед орчны хоолны дохио нөлөөлдөг бөгөөд орчин төлөвлөсөн сонголтоо барихад саад болсон байна." },
  evidence_meal_rhythm: { requiredPatterns: ["irregular_meals_late_hunger"], text: "Хоолны зай урт эсвэл тогтмол бус үед өлсөлт хэт хүчтэй болсны дараа анзаарагддаг байна." },
  evidence_hunger_satiety: { requiredPatterns: ["hunger_satiety"], text: "Өлсөх эсвэл цадах дохиог цагт нь анзаарах, идэх хэмжээг тохируулахтай холбоотой хэд хэдэн хариулт нэг чиглэлд давхацсан байна." },
  evidence_sleep: { requiredPatterns: ["sleep_fatigue"], text: "Унтах хугацаа, нойрны чанар болон ядаргаатай холбоотой хариултууд өдөр тутмын төлөвлөгөөнд нөлөөлөх нэг чиглэлд давхацсан байна." },
  evidence_restrictive: { requiredPatterns: ["restrictive_rebound"], text: "Хатуу хязгаарлалттай арга болон арга зогссоны дараах жингийн өөрчлөлт нэг чиглэлд давхацсан байна." },
  evidence_plan_mismatch: { requiredPatterns: ["plan_daily_life_mismatch"], text: "Төлөвлөгөөг өдөр тутам хэрэгжүүлэхэд бодит саад тулгарч, өмнөх оролдлого тогтвортой үргэлжлээгүй байна." },
  evidence_previous_attempt: { requiredPatterns: ["previous_attempt_sustainability"], text: "Өмнөх аргаас авсан үр дүнг өдөр тутам хадгалах орлуулах төлөвлөгөө дутсан нь хариултуудаас харагдаж байна." },

  context_low_car: { requiredSignals: ["low_movement", "car_travel_context"], text: "Та өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн бөгөөд машинаар зорчдог тул өдөр тутмын хөдөлгөөн аяндаа нэмэгдэх боломж хязгаарлагдмал байна." },
  context_low_home: { requiredSignals: ["low_movement", "home_work_context"], text: "Та гэрээсээ ажилладаг бөгөөд өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн байна." },
  context_low_only: { requiredSignals: ["low_movement"], forbiddenSignals: ["car_travel_context", "home_work_context"], text: "Та өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн байна." },
  context_injury: { requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтлийн түүх нь хөдөлгөөний төрлийг сонгохдоо зовиурын өөрчлөлтийг харгалзах шаардлагатайг харуулна." },
  context_schedule: { requiredSignals: ["schedule_barrier"], text: "Завгүй өдөр үндсэн төлөвлөгөө тасрах эрсдэлтэй тул урьдчилан богиносгож болох хувилбар хэрэгтэй." },
  context_cost: { requiredSignals: ["cost_barrier"], text: "Зардал дахин саад болохоос сэргийлж нэмэлт төлбөргүйгээр үргэлжлүүлж болох хувилбар хэрэгтэй." },

  attempt_method_movement: { requiredSignals: ["activity_based_method"], text: "Өмнөх арга хөдөлгөөнд суурилж байжээ." },
  attempt_duration_long: { requiredSignals: ["sustained_attempt"], text: "Та уг аргыг нэг жилээс урт хугацаанд үргэлжлүүлсэн байна." },
  attempt_duration_medium: { requiredSignals: ["medium_duration_attempt"], forbiddenSignals: ["sustained_attempt"], text: "Та уг аргыг 6–12 сар үргэлжлүүлсэн байна." },
  attempt_initial_success: { requiredSignals: ["initial_attempt_success"], text: "Эхний үед жин буурсан нь тухайн арга тодорхой нөхцөлд үр дүн өгснийг харуулна." },
  attempt_injury_stop: { requiredContexts: ["injury_or_pain_evidence"], text: "Харин өмнөх гэмтэл, өвдөлт эсвэл хөдөлгөөний хязгаарлалт аргыг үргэлжлүүлэхэд саад болжээ." },
  attempt_weight_regain: { requiredSignals: ["weight_regain"], text: "Үүний дараа жин буцжээ." },
  attempt_schedule: { requiredSignals: ["schedule_barrier"], text: "Дараа нь сонгосон хувилбарыг цагийн хуваарьт багтаахад хүндрэл гарсан байна." },
  attempt_cost: { requiredSignals: ["cost_barrier"], text: "Зардал ч тогтвортой үргэлжлүүлэх боломжийг хязгаарлажээ." },
  attempt_interpretation: { requiredPatterns: ["previous_attempt_sustainability"], text: "Энэ түүх нь хүсэл зориг дутсаныг бус, арга тасрах үед үр дүнгээ хадгалах хялбар төлөвлөгөө дутсаныг илүү тод харуулж байна." },

  strength_body: { requiredProtectiveSignals: ["hunger_recognition_difficulty", "satiety_difficulty"], text: "Та өлсөх, цадах мэдрэмжээ харьцангуй сайн анзаардаг нь хооллолтоо биеийн дохиотой уялдуулах бодит давуу тал юм." },
  strength_common_barriers: { requiredProtectiveSignals: ["emotional_eating", "environmental_cue_reactivity", "short_sleep", "poor_sleep_quality"], text: "Стресс, орчны хоолны өдөөлт болон нойр таны хооллолтыг тогтмол алдагдуулдаг шинж харагдсангүй." },
  strength_adherence_success: { requiredSignals: ["sustained_attempt", "initial_attempt_success"], text: "Өмнөх аргаа нэг жилээс урт хугацаанд хэрэгжүүлж, эхний үр дүн гаргаж чадсан нь өөрчлөлтийг тууштай барих чадвартайг харуулна." },
  strength_strategy: { requiredPatterns: ["previous_attempt_sustainability"], requiredProtectiveSignals: ["hunger_recognition_difficulty", "satiety_difficulty"], text: "Дараагийн стратеги энэ чадварыг хадгалж, зөвхөн арга тасарсны дараах төлөвлөгөөг илүү бодит болгоход чиглэх нь тохиромжтой." },

  recommendation_schedule_fit: { requiredSignals: ["schedule_barrier"], text: "Шинэ төлөвлөгөө завгүй өдөр ч хэрэгжихээр цагийн хуваарьт багтах хэрэгтэй." },
  recommendation_cost_fit: { requiredSignals: ["cost_barrier"], text: "Тогтмол үргэлжлүүлэхийн тулд нэмэлт зардал шаардахгүй хувилбар сонгох нь тохиромжтой." },
  recommendation_injury_fit: { requiredContexts: ["injury_or_pain_evidence"], text: "Хөдөлгөөний сонголтыг өмнөх гэмтлийг сэдрээхгүй хүрээнд хийнэ." },

  plan_option_injury: { requiredPatterns: ["previous_attempt_sustainability"], requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтлийг сэдрээхгүй хүрээнд бага ачааллын алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн ижил түвшний хөдөлгөөнөөс нэгийг сонгоно." },
  plan_option_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenContexts: ["injury_or_pain_evidence"], text: "Бага ачааллын алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн ижил түвшний хөдөлгөөнөөс нэгийг сонгоно." },
  plan_injury_stop: { requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтэлтэй холбоотой өвдөлт, хавдар, догололт эсвэл хөдөлгөөний хязгаарлалт нэмэгдвэл тухайн өдрийн хөдөлгөөнийг зогсоож, үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө." },
  plan_cost: { requiredSignals: ["cost_barrier"], text: "Нэмэлт төлбөр, тоног төхөөрөмж шаардахгүй хувилбарыг сонгоно." },
  plan_fallback_schedule: { requiredSignals: ["schedule_barrier"], text: "Завгүй өдөр сонгосон хөдөлгөөнийхөө 5 минутын бага ачааллын богино хувилбарыг хийнэ." },
  plan_fallback_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenSignals: ["schedule_barrier"], text: "Үндсэн хувилбар тухайн өдөр багтахгүй бол сонгосон хөдөлгөөнийхөө 5 минутын бага ачааллын богино хувилбарыг хийнэ." },
  plan_success_injury: { requiredPatterns: ["previous_attempt_sustainability"], requiredContexts: ["injury_or_pain_evidence"], text: "14 хоногийн 8 сонгосон удаагийн дор хаяж 6-д үндсэн эсвэл богино хувилбараа хийж, өмнөх гэмтэлтэй холбоотой зовиур нэмэгдээгүй бол амжилт гэж үзнэ; жингийн тоогоор дүгнэхгүй." },
  plan_success_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenContexts: ["injury_or_pain_evidence"], text: "14 хоногийн 8 сонгосон удаагийн дор хаяж 6-д үндсэн эсвэл богино хувилбараа хийсэн бол амжилт гэж үзнэ; жингийн тоогоор дүгнэхгүй." },

  guidance_blood_pressure: { requiredContexts: ["blood_pressure_followup"], text: "Хэрэв даралт сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хөдөлгөөний ачааллаа нэмэхээс өмнө эмчтэй зөвлөнө үү." },
  guidance_glucose: { requiredContexts: ["glucose_followup"], text: "Хэрэв цусан дахь сахар сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хоолны зайг огцом уртасгалгүй эмчтэй зөвлөнө үү." },
  guidance_injury: { requiredContexts: ["injury_or_pain_evidence"], text: "Гэмтэл, өвдөлт эсвэл хөдөлгөөний хязгаарлалт үргэлжилж байгаа бол хөдөлгөөний шинэ хувилбарыг мэргэжлийн хүнтэй тохируулна уу." },
  guidance_medication: { requiredContexts: ["unsupervised_medication"], text: "Эмчийн хяналтгүй эм хэрэглэсэн бол дахин хэрэглэхээсээ өмнө эмч эсвэл эм зүйчтэй зөвлөлдөнө үү." },
  guidance_reproductive: { requiredContexts: ["reproductive_followup"], text: "Нөхөн үржихүйн эсвэл мөчлөгийн нөхцөлтэй холбоотой өөрчлөлт байгаа бол жин бууруулах том төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу." },
  guidance_urgent_blood_pressure: { requiredContexts: ["blood_pressure_followup"], text: "Ухаан балартах, цээжээр хүчтэй өвдөх, амьсгал огцом давчдах зэрэг яаралтай шинж илэрвэл энэ төлөвлөгөөг үргэлжлүүлэхгүй, яаралтай тусламж авна уу." }
});

const SIGNAL_LABELS = Object.freeze({
  emotional_eating: "стресстэй үед идэх хүсэл өөрчлөгдсөн", emotional_barrier: "сэтгэл хөдлөл тогтвортой байдалд саад болсон",
  environmental_cue_reactivity: "өлсөөгүй үед орчны дохио нөлөөлсөн", environmental_barrier: "гэр бүл эсвэл орчны нөлөө саад болсон",
  environmental_portion_trigger: "зарим хүнсний хэмжээг тохируулахад хэцүү байсан", home_environment_exposure: "гэрийн орчинд хоол ойр байсан",
  meal_gap: "хоолны зай уртассан", irregular_meal_rhythm: "хоолны цаг тогтмол бус байсан", late_hunger_recognition: "өлсөлтийг хэт хүчтэй болсны дараа анзаарсан",
  hunger_recognition_difficulty: "өлсөх дохиог ялгахад хүндрэл байсан", satiety_difficulty: "цадсанаа анзаараад зогсоход хүндрэл байсан", portion_difficulty: "идэх хэмжээг тохируулахад хүндрэл байсан",
  short_sleep: "унтах хугацаа богино байсан", poor_sleep_quality: "нойр тасалдсан", sleep_fatigue: "өглөө ядарсан хэвээр байсан", fatigue_barrier: "ядаргаа эсвэл нойр саад болсон",
  sedentary_context: "өдөр тутам алхаж зорчдог", car_travel_context: "машинаар зорчдог", home_work_context: "гэрээсээ ажилладаг", low_movement: "өдрийн нийт хөдөлгөөн бага байсан",
  restrictive_method_current: "одоогийн арга хатуу хязгаарлалт агуулсан", restrictive_method_past: "өмнөх арга хатуу хязгаарлалт агуулсан",
  short_lived_attempt: "өмнөх оролдлого богино үргэлжилсэн", weight_regain: "аргаа зогсоосны дараа жин буцсан", strict_rule_barrier: "хэт хатуу дүрэм саад болсон",
  activity_based_method: "өмнөх арга хөдөлгөөнд тулгуурласан", medium_duration_attempt: "өмнөх арга 6–12 сар үргэлжилсэн", sustained_attempt: "өмнөх аргыг нэг жилээс урт үргэлжлүүлсэн", initial_attempt_success: "эхний үед жин буурсан",
  schedule_barrier: "цагийн хуваарь саад болсон", cost_barrier: "зардал саад болсон", injury_or_pain_barrier: "өвдөлт эсвэл хөдөлгөөний хязгаарлалт байсан", access_barrier: "хүртээмж саад болсон", support_barrier: "шаардлагатай дэмжлэг хүрэлцээгүй",
  attempt_not_sustained: "өмнөх оролдлогын үр дүн тогтоогүй", sustainability_barrier: "үр дүн удаан харагдах нь саад болсон"
});

const RECOMMENDATIONS = Object.freeze({
  pause_before_emotional_eating: { action: "Стресс ихсэх нэг давтагддаг мөчид хоол авахаасаа өмнө түр азнаад, яг одоо өлсөж байна уу эсвэл амрах хэрэгтэй байна уу гэж ялгаж тэмдэглэнэ.", reason: "Энэ алхам хоолыг хорихгүйгээр сэтгэл хөдлөл ба өлсөлтийн дохиог салгаж харахад тусална." },
  change_one_visible_cue: { action: "Хамгийн их өдөөдөг нэг хүнсийг туршилтын хугацаанд нүдэнд шууд харагдахгүй газар байрлуулна.", reason: "Нэг орчны дохиог өөрчлөх нь олон дүрэм нэмэхгүйгээр төлөвлөөгүй сонголтыг багасгаж чадна." },
  anchor_one_meal_time: { action: "Өдөр бүр хамгийн амархан тогтоож болох нэг хоолны цагаа сонгоод, эхний туршилтын хугацаанд тогтвортой барина.", reason: "Нэг хоолны цаг тогтворжвол хэт өлсөх болон оройн яарсан сонголт зэрэг хэд хэдэн хүндрэлд зэрэг нөлөөлнө." },
  mid_meal_pause: { action: "Нэг үндсэн хоолны дунд халбагаа тавиад, өлсөлт болон цадалтын мэдрэмжээ түр ажиглана.", reason: "Идэх хэмжээг хүчээр тогтоохын оронд биеийн дохиог цагт нь анзаарах боломж нэмэгдэнэ." },
  fixed_wind_down: { action: "Унтахаас өмнө нэг тогтмол тайвшрах үйлдэлд богино хугацаа зориулна.", reason: "Оройн ачааллыг бага зэрэг бууруулах нь маргаашийн ядаргаа болон амархан сонголт руу орох эрсдэлийг хамтад нь багасгана." },
  one_movement_anchor: { action: "Өдөрт хамгийн тогтвортой давтагддаг нэг үйл явдлын дараа алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн бага ачааллын хувилбараас нэгийг сонгож туршина.", reason: "Тогтсон нэг мөчид хийх нь дасгалын том төлөвлөгөөнөөс хэрэгжүүлэхэд хялбар." },
  remove_one_strict_rule: { action: "Одоогийн төлөвлөгөөн дэх хамгийн хатуу нэг дүрмийг сонгоод, бүрэн хоригийн оронд урьдчилж тогтоосон уян хувилбараар солино.", reason: "Нэг дүрмийг уян болгох нь бүх төлөвлөгөөг орхих эрсдэлийг бууруулж чадна." },
  minimum_viable_plan: { action: "Үндсэн төлөвлөгөө багтахгүй нөхцөлд ч хийж чадах нэг хоол эсвэл хөдөлгөөний хялбаршуулсан хувилбарыг урьдчилж бичнэ.", reason: "Амьдралын бодит нөхцөлд багтах хялбаршуулсан хувилбар тогтвортой байдлыг хамгаална." },
  build_maintenance_bridge: { action: "Өмнөх аргыг яг хуучнаар нь сэргээхээс илүү өдөр тутамд давтаж болох хялбаршуулсан хувилбар болон тасарсан өдрийн буцах дүрмийг урьдчилж тогтооно.", reason: "Ингэснээр эхлэхээс илүү үр дүнгээ хадгалах, тасарсны дараа буцах хэсгийг төлөвлөгөөнд оруулна." }
});

const STRATEGY_COPY = Object.freeze({
  pause_before_emotional_eating: { action: "Стрессийн үеийн идэх хүсэлтэй тэмцэхээс илүү өлсөлт болон амрах хэрэгцээг ялгаж танихад төвлөрнө.", reason: "Ингэснээр хоолыг хорихгүйгээр тухайн мөчийн хэрэгцээнд тохирсон сонголт хийх зай гарна." },
  change_one_visible_cue: { action: "Бүх орчноо нэг дор өөрчлөхгүй; төлөвлөөгүй идэлтийг хамгийн их өдөөдөг нэг дохионы хүртээмжийг багасгана.", reason: "Нэг тодорхой дохиог өөрчлөх нь олон дүрэм нэмэхгүйгээр орчны нөлөөг шалгах боломж өгнө." },
  anchor_one_meal_time: { action: "Бүх хоолны цагаа зэрэг засахгүй; хэт өлсөхөөс өмнө барьж болох нэг тогтвортой хоолны мөчөөс эхэлнэ.", reason: "Нэг мөч тогтворжиход оройн яарсан сонголт болон хоолны урт зайг хамтад нь багасгах боломжтой." },
  mid_meal_pause: { action: "Хоолны хэмжээг гаднаас хатуу тогтоохоос илүү идэж байх үеийн өлсөлт, цадалтын дохиог анзаарах чадварыг ашиглана.", reason: "Энэ чиглэл биеийн дохиог хүчээр дарахгүйгээр хоол зогсоох мөчийг илүү тод болгоно." },
  fixed_wind_down: { action: "Нойрыг нэг дор төгс болгох зорилго тавихгүй; оройн ачааллыг бууруулах тогтмол нэг үйлдлээс эхэлнэ.", reason: "Оройн хэмнэл тогтворжих нь маргаашийн ядаргаа болон яарсан сонголтыг ажиглах суурь болно." },
  one_movement_anchor: { action: "Дасгалын том хөтөлбөрөөс өмнө өдөр тутам давтаж болох бага ачааллын нэг хөдөлгөөнийг тогтмол мөчтэй холбоно.", reason: "Ингэснээр хөдөлгөөний хэмжээнээс түрүүлж давтаж болох нөхцөлийг олно." },
  remove_one_strict_rule: { action: "Төлөвлөгөөг бүхэлд нь солихгүй; тасрах эрсдэлийг хамгийн их нэмэгдүүлдэг нэг хатуу дүрмийг уян болгоно.", reason: "Нэг дүрмийг өөрчлөх нь хазайлтын дараа бүх төлөвлөгөөг орхих эрсдэлийг багасгана." },
  minimum_viable_plan: { action: "Төгс өдрийн төлөвлөгөө бус, хамгийн завгүй өдөр ч багтах хялбаршуулсан хувилбар бэлдэнэ.", reason: "Өдөр тутмын бодит нөхцөлд багтсан төлөвлөгөөг тогтмол давтах боломж илүү өндөр." },
  build_maintenance_bridge: { action: "Өмнөх аргыг яг хуучнаар нь давтахаас илүү өдөр тутам үргэлжлүүлж болох орлуулах төлөвлөгөө бэлдэнэ.", reason: "Орлуулах төлөвлөгөө нь үндсэн хувилбар, нөхцөл хүндрэхэд хийх богино хувилбар, тасарсны дараа буцах дүрэм гэсэн гурван хэсэгтэй байна." }
});

const INTERACTION_COPY = Object.freeze({
  meal_hunger_satiety: "Хоолны зай уртсахад өлсөлт хүчтэй болж, цадсанаа анзаарах эсвэл хэмжээгээ тохируулахад илүү хэцүү болж болно.",
  sleep_plan: "Нойр дутуу өдөр ядаргаа нэмэгдэж, өдөр тутмын төлөвлөгөөний хамгийн амархан хувилбарыг ч хийхэд хүнд болж болно.",
  sleep_emotion: "Ядарсан үед сэтгэл хөдлөлөө зохицуулах нөөц багасаж, хоол түр амрах арга шиг санагдах нь нэмэгдэж болно.",
  emotion_restriction: "Стресстэй үед хоолоор түр тайвширсны дараа хэт хатуугаар дахин эхлэх нь өмнөх мөчлөгийг улам хүчтэй болгож болно.",
  cue_meal_rhythm: "Орчны дохиогоор төлөвлөөгүй идэхэд дараагийн хоолны цаг хойшилж, хоолны хэмнэл дахин алдагдаж болно.",
  cue_satiety: "Хоол байнга нүдэнд өртөх үед биеийн цадах дохионоос өмнө орчин дараагийн идэлтийг сануулж болно.",
  cue_movement: "Гэр эсвэл суугаа орчинд хоол ойр байхад хөдөлгөөн багатай урт хугацаа төлөвлөөгүй идэлтийг давхар дэмжиж болно.",
  restriction_sustainability: "Хатуу дүрэм удаан баригдахгүй үед өмнөх оролдлого зогссон нөхцөл дахин давтагдаж болно.",
  routine_sustainability: "Өдөр тутмын хуваарьтай нийцээгүй төлөвлөгөө өмнөх оролдлого зогссон цэгийг дахин үүсгэж болно.",
  movement_maintenance: "Өмнөх хөдөлгөөний арга зогсож, өдөр тутмын хөдөлгөөн бага хэвээр үлдсэнээр эхний үр дүнг хадгалах дадал тасарчээ."
});

const PROTECTIVE_COPY = Object.freeze({
  emotional_eating: "Стресстэй үед идэх хүсэл өөрчлөгддөггүй нь сэтгэл хөдлөл хооллолтыг шууд удирддаггүй хамгаалах хүчин зүйл болж байна.",
  environmental_cue_reactivity: "Өлсөөгүй үед орчны аль ч дохио нөлөөлдөггүй гэсэн хариулт нь төлөвлөөгүй идэлтийн энэ эрсдэлийг бууруулж байна.",
  portion_difficulty: "Тодорхой хүнсний хэмжээг тохируулахад хүндрэлгүй байгаа нь цадах дохиогоо ашиглах давуу тал болж байна.",
  regular_meal_rhythm: "Хоолны хэмнэл тогтвортой байх нь хэт өлсөх эрсдэлийг бууруулах давуу тал болж байна.",
  hunger_recognition_difficulty: "Өлсөх мэдрэмжээ амархан анзаардаг нь биеийн дохиогоо ашиглах хамгаалах хүчин зүйл болж байна.",
  satiety_difficulty: "Цадсанаа анзаараад зогсож чаддаг нь идэх хэмжээг тохируулах давуу тал болж байна.",
  short_sleep: "Унтах хугацаа тогтвортой байгаа нь ядаргаатай холбоотой эрсдэлийг бууруулж байна.",
  poor_sleep_quality: "Нойрны чанар сайн байгаа нь өдөр тутмын сонголтоо төлөвлөхөд дэмжлэг болно.",
  low_movement: "Өдрийн хөдөлгөөн их байгаа нь одоо байгаа бодит давуу тал юм.",
  weight_regain: "Өмнөх оролдлогын дараа жин буцаагүй нь тогтвортой болгож чадсан зүйл байсныг харуулж байна.",
  professional_support: "Өмнө нь мэргэжлийн дэмжлэг авч байсан нь тусламж ашиглах бодит туршлага болж байна.",
  sustainability_barrier: "Тодорхой саад байгаагүй гэсэн хариулт нь хэрэгжүүлэх суурь боломж байгааг харуулж байна.",
  medium_duration_attempt: "Өмнөх аргаа 6–12 сар үргэлжлүүлсэн нь тодорхой хугацаанд тогтвортой хэрэгжүүлж чадсаныг харуулж байна.",
  sustained_attempt: "Нэг жилээс урт хугацаанд аргаа үргэлжлүүлсэн нь тогтвортой өөрчлөлт хийж чаддаг бодит давуу тал юм.",
  initial_attempt_success: "Өмнөх оролдлогын эхэнд жин буурсан нь тохирсон нөхцөл бүрдэхэд үр дүн гаргаж чаддагийг харуулж байна."
});

module.exports = { PATTERN_COPY, PATTERN_PUBLIC_TITLES, CONTEXT_PUBLIC_TITLES, SENTENCE_TEMPLATES, RECOMMENDATIONS, STRATEGY_COPY, INTERACTION_COPY, PROTECTIVE_COPY };
