"use strict";

const PATTERN_COPY = Object.freeze({
  emotional_regulation: {
    explanation: "Стресс нэмэгдэх үед хоол нь түр тайвшрах, амрах эсвэл анхаарлаа өөр тийш шилжүүлэх арга болж мэднэ.",
    effectOnWeightLoss: "Хэрэв хоол тухайн мөчид түр амсхийх мэт мэдрэмж өгдөг бол стрессийн шалтгаан хэвээр үлдэхэд идэх хүсэл дахин төрж болно.",
    uncertainty: "Энэ нь онош биш бөгөөд сэтгэл хөдлөл бүр хооллолтыг өөрчилдөг гэсэн үг биш."
  },
  environmental_cues: {
    explanation: "Хоол нүдэнд ойр байх, үнэртэх эсвэл захиалгын апп нээхэд өлсөөгүй байсан ч идэх хүсэл хөдөлдөг.",
    effectOnWeightLoss: "Орчин хоолыг дахин дахин сануулахад төлөвлөөгүй үед идэх нь нэмэгдэж, хоолны хэмнэл алдагдахад нөлөөлдөг.",
    uncertainty: "Орчны дохио дангаараа бүх сонголтыг тайлбарлахгүй."
  },
  irregular_meals_late_hunger: {
    explanation: "Хоолны зай уртсах эсвэл тогтмол бус болох үед өлсөлтийн дохио хэт хүчтэй болсны дараа анзаарагддаг.",
    effectOnWeightLoss: "Орой хэт өлсөхөд идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог.",
    uncertainty: "Өдөр бүр ижил биш тул яг аль цагт хүндрэл үүсдгийг ажиглах хэрэгтэй."
  },
  hunger_satiety: {
    explanation: "Өлсөх эсвэл цадах дохиог цагт нь анзаарахад хэцүү үед хооллож эхлэх болон идэхээ зогсоох мөч хоёулаа оройтдог.",
    effectOnWeightLoss: "Ийм үед идэх хэмжээгээ тайван тохируулахад хэцүү болж болно.",
    uncertainty: "Нэг хоолны туршлагаар биш, давтагддаг мөчөөр нь дүгнэнэ."
  },
  sleep_fatigue: {
    explanation: "Нойр дутуу эсвэл тасалдсан өдөр бодож төлөвлөх тэнхээ оройдоо багасдаг.",
    effectOnWeightLoss: "Ядарсан үед хоол бэлтгэх, сонголтоо урьдчилан бодох тэнхээ багасч, тогтвортой төлөвлөгөө барихад саад болдог.",
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
    uncertainty: "Өмнөх арга бүр хэт хатуу байсан гэж дүгнэхгүй; энэ дүгнэлт зөвхөн хэт хатуу дүрэм болон өмнөх оролдлогын талаарх мэдээлэлд тулгуурлана."
  },
  plan_daily_life_mismatch: {
    explanation: "Өдөр тутмын бодит нөхцөлтэй нийцэхгүй төлөвлөгөө сайн санаатай байсан ч тогтмол хэрэгжихгүй үлддэг.",
    effectOnWeightLoss: "Хэрэгжүүлэх босго өндөр байх тусам бодит нөхцөл өөрчлөгдөхөд төлөвлөгөөнөөс гарах нь амархан болдог.",
    uncertainty: "Энэ нь сахилга батгүй гэсэн үг биш; төлөвлөгөөний ачаалал амьдралын нөхцөлтэй нийцсэн эсэхийг шалгаж байна."
  },
  previous_attempt_sustainability: {
    explanation: "Өмнөх арга зогсох эсвэл нөхцөл өөрчлөгдөх үед үр дүнг хадгалах өдөр тутмын төлөвлөгөө хэрэгтэй болдог.",
    effectOnWeightLoss: "Орлуулах бодит төлөвлөгөөгүй бол өмнөх өөрчлөлтөө өдөр тутам үргэлжлүүлэхэд хэцүү болдог.",
    uncertainty: "Энэ нь эхлэх эсвэл тууштай байх чадвар дутсан гэсэн үг биш; өмнөх оролдлогын үр дүнг хадгалах төлөвлөгөөг тайлбарлаж байна."
  }
});

const PATTERN_PUBLIC_TITLES = Object.freeze({
  previous_attempt_sustainability: "Өмнөх аргын үр дүнг хадгалах төлөвлөгөө дутсан нь"
});

const CONTEXT_PUBLIC_TITLES = Object.freeze({
  low_movement: "Өдөр тутмын хөдөлгөөн бага хэвээр үлдсэн нь",
  injury_or_pain_barrier: "Өмнөх гэмтэл хөдөлгөөнийг үргэлжлүүлэхэд саад болсон нь"
});

const SENTENCE_TEMPLATES = Object.freeze({
  overview_emotional: { requiredPatterns: ["emotional_regulation"], text: "Таны хариултаар стресс нэмэгдэх үед хоол идэх хүсэл хүчтэй болдог давтагдсан нөхцөл харагдаж байна." },
  overview_environmental: { requiredPatterns: ["environmental_cues"], text: "Өлсөөгүй үед хоол харагдах, үнэртэх эсвэл бусад хүн идэхэд идэх хүсэл тань хөдөлдөг байна." },
  overview_meal_rhythm: { requiredPatterns: ["irregular_meals_late_hunger"], text: "Хоолны зай уртсах үед өлсөлт хэт хүчтэй болсны дараа анзаарагдаж, оройн сонголтыг яаруулдаг байна." },
  overview_hunger_satiety: { requiredPatterns: ["hunger_satiety"], text: "Өлсөх, цадах дохиог цагт нь анзаарахад хүндрэлтэй байгаа нь идэх мөч болон хэмжээг тохируулахад нөлөөлж байна." },
  overview_restrictive: { requiredPatterns: ["restrictive_rebound"], text: "Хэт хатуу дэглэмийг үргэлжлүүлэхэд хэцүү болоход өмнөх дүрмээ бүхэлд нь орхих эрсдэл илүү тод байна." },
  overview_plan_mismatch: { requiredPatterns: ["plan_daily_life_mismatch"], text: "Өмнөх төлөвлөгөө өдөр тутмын амьдралд багтаагүй нь тогтвортой үргэлжлүүлэхэд саад болжээ." },
  overview_previous_attempt: { requiredPatterns: ["previous_attempt_sustainability"], text: "Хамгийн тод асуудал нь өмнөх арга үр дүнгүй байсанд бус, гарсан үр дүнг өдөр тутам хадгалах бодит төлөвлөгөө бэлэн байгаагүйд байна." },
  overview_low_movement: { requiredPatterns: ["low_movement"], text: "Одоогийн өдөр тутмын хөдөлгөөн бага байгаа нь дараагийн төлөвлөгөөнд заавал тооцох нөхцөл болж байна." },
  overview_sleep: { requiredPatterns: ["sleep_fatigue"], text: "Нойр болон ядаргаа өдөр тутмын сонголтоо төлөвлөхөд нөлөөлж байна." },
  overview_schedule: { requiredSignals: ["schedule_barrier"], text: "Дараагийн хувилбар цагийн хуваарьт бодитоор багтах шаардлагатай." },
  overview_cost: { requiredSignals: ["cost_barrier"], text: "Нэмэлт зардал шаардахгүй байх нь төлөвлөгөөг үргэлжлүүлэхэд чухал." },
  overview_injury: { requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтлийг сэдрээхгүй хүрээнд сонголт хийх шаардлагатай." },
  overview_practical_cluster: { requiredPatterns: ["low_movement"], requiredSignals: ["schedule_barrier", "cost_barrier"], requiredContexts: ["injury_or_pain_evidence"], text: "Өдөр тутмын хөдөлгөөн бага хэвээр байгаа тул дараагийн хувилбар нь цагийн хуваарьт багтаж, нэмэлт зардал шаардахгүй, өмнөх гэмтлийг сэдрээхгүй хүрээнд хэрэгжихээр байх хэрэгтэй." },
  overview_protective_core: { requiredProtectiveSignals: ["emotional_eating", "hunger_recognition_difficulty", "satiety_difficulty"], text: "Сэтгэл хөдлөлийн нөлөөгөөр идэх эсвэл өлсөх, цадах дохиогоо анзаарах хүндрэл нь гол саад болж харагдсангүй." },
  overview_strategy_direction: { requiredPatterns: ["previous_attempt_sustainability"], requiredProtectiveSignals: ["emotional_eating", "hunger_recognition_difficulty", "satiety_difficulty"], text: "Тиймээс хооллолтыг шинээр хязгаарлахаас илүү өдөр тутам үргэлжлүүлж болох төлөвлөгөөнд төвлөрөх нь таны хариултад илүү нийцнэ." },

  evidence_emotional: { requiredPatterns: ["emotional_regulation"], text: "Стресс нэмэгдэхэд идэх хүсэл тань хүчтэй болж, сэтгэл хөдлөл өдөр тутмын сонголтоо тогтвортой барихад саад болсон байна." },
  evidence_environmental: { requiredPatterns: ["environmental_cues"], text: "Өлсөөгүй үед орчны хоолны дохио нөлөөлдөг бөгөөд орчин төлөвлөсөн сонголтоо барихад саад болсон байна." },
  evidence_meal_rhythm: { requiredPatterns: ["irregular_meals_late_hunger"], text: "Хоол хоорондын зай тань урт байдаг бөгөөд өлсөлт хэт хүчтэй болсон хойно л анзаарагддаг гэж хариулжээ." },
  evidence_hunger_satiety: { requiredPatterns: ["hunger_satiety"], text: "Та өлсөлтөө хэт хүчтэй болсны дараа анзаардаг бөгөөд өлсөх эсвэл цадах мэдрэмж өмнөх аргын саад болсон гэж тэмдэглэсэн." },
  evidence_sleep: { requiredPatterns: ["sleep_fatigue"], text: "Нойр дутуу эсвэл тасалдсан үед ядаргаа нэмэгдэж, өдөр тутмын төлөвлөгөөгөө дагахад хүндрэл гардаг байна." },
  evidence_restrictive: { requiredPatterns: ["restrictive_rebound"], text: "Хэт хатуу дүрмийг удаан барихад хэцүү болж, нэг хазайлтын дараа төлөвлөгөөг бүхэлд нь орхих эрсдэл нэмэгдсэн байна." },
  evidence_plan_mismatch: { requiredPatterns: ["plan_daily_life_mismatch"], text: "Төлөвлөгөөг өдөр тутам хэрэгжүүлэхэд бодит саад тулгарч, өмнөх оролдлого тогтвортой үргэлжлээгүй байна." },
  evidence_previous_attempt: { requiredPatterns: ["previous_attempt_sustainability"], text: "Өмнөх арга зогссоны дараа гарсан үр дүнг өдөр тутам хадгалах орлуулах төлөвлөгөө бэлэн байгаагүй." },
  evidence_previous_attempt_complete: { requiredPatterns: ["previous_attempt_sustainability"], requiredSignals: ["activity_based_method", "sustained_attempt", "initial_attempt_success", "weight_regain"], text: "Өмнөх хөдөлгөөнд суурилсан арга эхэндээ үр дүн өгч, нэг жилээс урт үргэлжилсэн ч зогссоны дараа үр дүнг хадгалах хялбар хувилбар бэлэн байгаагүй." },
  evidence_previous_attempt_injury_cluster: { requiredPatterns: ["previous_attempt_sustainability"], requiredSignals: ["activity_based_method", "sustained_attempt", "initial_attempt_success", "weight_regain"], requiredContexts: ["explicit_injury_stop_context"], text: "Таны хувьд гол хүндрэл нь өөрчлөлт эхлүүлэх чадвар биш. Харин ажиллаж байсан хөдөлгөөнөө үргэлжлүүлэх боломжгүй болсон үед өмнөх үр дүнг хадгалах, өдөр тутмын амьдралд хэрэгжүүлж болох өөр төлөвлөгөө бэлэн байгаагүйд байна." },
  evidence_previous_attempt_maintenance: { requiredPatterns: ["previous_attempt_sustainability"], text: "Тэр үед өмнөх үр дүнг дэмжих, өдөр тутам хэрэгжүүлж болох өөр хувилбар бэлэн байгаагүй байна." },
  evidence_previous_attempt_meaning_voluntary: { requiredPatterns: ["previous_attempt_sustainability"], requiredContexts: ["explicit_voluntary_stop_context"], forbiddenContexts: ["explicit_injury_stop_context"], text: "Өмнөх аргаа зогсоосны дараа үр дүнг өдөр тутам хадгалах өөр хувилбар бэлэн байгаагүй байна." },
  evidence_previous_attempt_meaning_neutral: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenContexts: ["explicit_injury_stop_context", "explicit_voluntary_stop_context"], text: "Өмнөх оролдлого үргэлжлээгүй үед үр дүнг өдөр тутам хадгалах өөр хувилбар бэлэн байгаагүй байна." },

  context_low_car: { requiredSignals: ["low_movement", "car_travel_context"], text: "Та өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн бөгөөд машинаар зорчдог тул өдөр тутмын хөдөлгөөн аяндаа нэмэгдэх боломж хязгаарлагдмал байна." },
  context_low_home: { requiredSignals: ["low_movement", "home_work_context"], text: "Та гэрээсээ ажилладаг бөгөөд өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн байна." },
  context_low_only: { requiredSignals: ["low_movement"], forbiddenSignals: ["car_travel_context", "home_work_context"], text: "Та өдрийн нийт хөдөлгөөнөө бага гэж үнэлсэн байна." },
  context_injury_impossible: { requiredContexts: ["explicit_injury_stop_context"], text: "Дараагийн хөдөлгөөнөө сонгохдоо гэмтэлтэй холбоотой зовиур нэмэгдэхгүй байхыг харгалзана." },
  context_injury_difficult: { requiredContexts: ["injury_or_pain_evidence"], forbiddenContexts: ["explicit_injury_stop_context"], text: "Таны дурдсан өвдөлт эсвэл хөдөлгөөний хязгаарлалт хөдөлгөөнөө тогтмол үргэлжлүүлэхэд саад болсон байна." },
  context_schedule: { requiredSignals: ["schedule_barrier"], text: "Завгүй өдөр үндсэн төлөвлөгөөг хэрэгжүүлэх боломжгүй байж болох тул урьдчилан богиносгож болох хувилбар хэрэгтэй." },
  context_cost: { requiredSignals: ["cost_barrier"], text: "Зардал дахин саад болохоос сэргийлж нэмэлт төлбөргүйгээр үргэлжлүүлж болох хувилбар хэрэгтэй." },
  context_food_discomfort: { requiredSignals: ["food_discomfort_context"], text: "Зарим хүнсний дараах тавгүй мэдрэмжийг хоол, хэмжээ, тухайн үеийн нөхцөлтэй нь хамт ажиглах нь хэрэгтэй." },
  context_alcohol_food_change: { requiredSignals: ["alcohol_food_change"], text: "Согтууруулах ундаа хэрэглэсэн үед идэх хэмжээ эсвэл сонголт өөрчлөгдсөн бол тэр нөхцөлийг тусад нь ажиглах хэрэгтэй." },

  attempt_method_movement: { requiredSignals: ["activity_based_method"], text: "Өмнөх арга хөдөлгөөнд суурилж байжээ." },
  attempt_duration_long: { requiredSignals: ["sustained_attempt"], text: "Та уг аргыг нэг жилээс урт хугацаанд үргэлжлүүлсэн байна." },
  attempt_duration_medium: { requiredSignals: ["medium_duration_attempt"], forbiddenSignals: ["sustained_attempt"], text: "Та уг аргыг 6–12 сар үргэлжлүүлсэн байна." },
  attempt_initial_success: { requiredSignals: ["initial_attempt_success"], text: "Эхний үед жин буурсан нь тухайн арга тодорхой нөхцөлд үр дүн өгснийг харуулна." },
  previous_method_stopped_due_to_injury: { requiredContexts: ["explicit_injury_stop_context"], text: "Таны дурдсан гэмтлийн улмаас өмнөх хөдөлгөөнөө үргэлжлүүлэх боломжгүй болжээ." },
  attempt_injury_stop_general: { requiredContexts: ["injury_or_pain_evidence"], forbiddenContexts: ["explicit_injury_stop_context"], text: "Таны дурдсан өвдөлт эсвэл хөдөлгөөний хязгаарлалт өмнөх хөдөлгөөнийг үргэлжлүүлэхэд саад болжээ." },
  attempt_weight_regain: { requiredSignals: ["weight_regain"], text: "Үүний дараа жин буцжээ." },
  attempt_schedule_cost: { requiredSignals: ["schedule_barrier", "cost_barrier"], text: "Цагийн хуваарь болон зардал нь дараагийн төлөвлөгөөг тогтвортой хэрэгжүүлэхэд нэмэлт саад болжээ." },
  attempt_schedule_only: { requiredSignals: ["schedule_barrier"], forbiddenSignals: ["cost_barrier"], text: "Цагийн хуваарь нь дараагийн төлөвлөгөөг тогтвортой хэрэгжүүлэхэд нэмэлт саад болжээ." },
  attempt_cost_only: { requiredSignals: ["cost_barrier"], forbiddenSignals: ["schedule_barrier"], text: "Зардал нь дараагийн төлөвлөгөөг тогтвортой хэрэгжүүлэхэд нэмэлт саад болжээ." },

  strength_body: { requiredProtectiveSignals: ["hunger_recognition_difficulty", "satiety_difficulty"], text: "Та өлсөх, цадах мэдрэмжээ харьцангуй сайн анзаардаг нь хооллолтоо биеийн дохиотой уялдуулах бодит давуу тал юм." },
  strength_common_barriers: { requiredProtectiveSignals: ["emotional_eating", "environmental_cue_reactivity", "short_sleep", "poor_sleep_quality"], text: "Стресс, орчны хоолны өдөөлт болон нойр таны хооллолтыг тогтмол алдагдуулдаг шинж харагдсангүй." },
  strength_adherence_success: { requiredSignals: ["sustained_attempt", "initial_attempt_success"], text: "Өмнөх аргаа нэг жилээс урт хугацаанд хэрэгжүүлж, эхний үр дүн гаргаж чадсан нь өөрчлөлтийг тууштай барих чадвартайг харуулна." },

  neutral_no_pattern: { requiredPatternCount: 0, text: "Одоогийн өгсөн хариултуудаар жин хасалтад саад болж буй нэг тод сэтгэлзүйн эсвэл зан үйлийн хэв маяг ялгараагүй байна." },
  neutral_meaning_complete: { requiredPatternCount: 0, text: "Энэ нь хүндрэл огт байхгүй гэсэн үг биш. Харин асуумжид хамрагдсан чиглэлүүдээс аль нэг нь бусдаасаа илүү тод, давтагдсан хэв маяг болж ялгараагүйг илэрхийлнэ." },
  neutral_meaning_insufficient: { requiredPatternCount: 0, text: "Одоогийн хариултаар тод хэв маяг дүгнэхэд мэдээлэл хүрэлцээгүй байна." },
  neutral_absent_emotional: { requiredPatternCount: 0, requiredProtectiveSignals: ["emotional_eating"], text: "Стресс нэмэгдэхэд идэх хүсэл тогтмол өөрчлөгддөг шинж илрээгүй." },
  neutral_absent_environmental: { requiredPatternCount: 0, requiredProtectiveSignals: ["environmental_cue_reactivity"], text: "Хоол харагдах, үнэртэх эсвэл бусад хүн идэх нь өлсөөгүй үед идэх хүсэл тогтмол төрүүлдэг шинж илрээгүй." },
  neutral_absent_body_signals: { requiredPatternCount: 0, requiredProtectiveSignals: ["hunger_recognition_difficulty", "satiety_difficulty"], text: "Өлсөх, цадах мэдрэмжээ анзаарах нь одоогийн гол хүндрэл болж харагдсангүй." },
  neutral_absent_sleep: { requiredPatternCount: 0, requiredProtectiveSignals: ["short_sleep", "poor_sleep_quality"], text: "Нойрны хугацаа болон чанар хоолны сонголтыг тогтмол алдагдуулдаг шинж илрээгүй." },
  neutral_absent_portion: { requiredPatternCount: 0, requiredProtectiveSignals: ["portion_difficulty"], text: "Тодорхой хүнсний хэмжээг тохируулахад тогтмол хүндрэлтэй гэсэн шинж илрээгүй." },
  neutral_absent_fallback: { requiredPatternCount: 0, text: "Асуумжид үнэлсэн нийтлэг хэв маягуудаас аль нэгийг хүчтэй гэж нэрлэх хангалттай давтагдсан мэдээлэл одоогоор алга." },
  neutral_strengths_fallback: { requiredPatternCount: 0, requiredProtectiveCount: 0, text: "Давуу тал гэж тодорхой нэрлэх хариулт цөөн байгаа тул өдөр тутмын ажиглалтаас нэмэлт мэдээлэл авах нь илүү бодитой." },
  neutral_limits: { requiredPatternCount: 0, text: "Энэ асуумж дангаараа жингийн өөрчлөлтийн бүх шалтгааныг тогтоохгүй бөгөөд даавар, бодисын солилцоо эсвэл бусад эмнэлгийн шалтгааныг оношлохгүй." },
  neutral_more_information: { requiredPatternCount: 0, text: "Асуумжийн хариултаар тод хэв маяг ялгараагүй тул өдөр тутмын бодит нөхцөл хэд хэдэн удаа давтагдаж байгаа эсэхийг ажиглавал дараагийн дүгнэлт илүү тод болно." },
  neutral_observation_action: { requiredPatternCount: 0, text: "Хооллох нэг давтагддаг мөчийг сонгож, тэр үед ямар хэрэгцээ эсвэл нөхцөл сонголтод тань нөлөөлснийг товч тэмдэглэнэ." },
  neutral_observation_constant: { requiredPatternCount: 0, text: "Ажиглалтын хугацаанд хоолны хэмжээ, цэс, хөдөлгөөнөө зориуд өөрчлөхгүй; зөвхөн юу давтагдаж байгааг тэмдэглэнэ." },
  neutral_decision_rule: { requiredPatternCount: 0, text: "Нэг ижил нөхцөл дахин давтагдвал дараагийн тайлбар, төлөвлөгөөг тэр нөхцөлд чиглүүлнэ; тодорхой зүйл давтагдахгүй бол илүү дэлгэрэнгүй мэдээлэл цуглуулна." },
  neutral_professional_scope: { requiredPatternCount: 0, text: "Асуумжид хамрагдаагүй шинж тэмдэг, эмчилгээ эсвэл биеийн өөрчлөлтийн талаар санаа зовж байгаа бол энэ тайлангаар шалтгаан тогтоохгүй, тохирох мэргэжлийн хүнтэй ярилцана уу." },
  neutral_report_use: { requiredPatternCount: 0, text: "Энэ тайланг эцсийн онош гэж бус, дараагийн ажиглалтаа хаанаас эхлэхийг заах суурь зураглал болгон ашиглана." },
  neutral_context_sleep: { requiredPatternCount: 0, requiredPatterns: ["sleep_fatigue"], text: "Сэтгэлзүйн эсвэл зан үйлийн гол хэв маяг ялгараагүй ч нойр, ядаргаа нь өдөр тутмын сонголтод нөлөөлөх нөхцөл болж байна." },
  neutral_context_movement: { requiredPatternCount: 0, requiredPatterns: ["low_movement"], text: "Сэтгэлзүйн гол саад ялгараагүй ч өдөр тутмын хөдөлгөөний суурь түвшин бага байгаа нь тусад нь анхаарах нөхцөл болж байна." },
  neutral_context_schedule: { requiredPatternCount: 0, requiredSignals: ["schedule_barrier"], text: "Цагийн хуваарь нь өмнөх төлөвлөгөөг тогтмол хэрэгжүүлэхэд нөлөөлсөн бодит нөхцөл байна." },
  neutral_context_cost: { requiredPatternCount: 0, requiredSignals: ["cost_barrier"], text: "Зардал нь өмнөх төлөвлөгөөг тогтмол хэрэгжүүлэхэд нөлөөлсөн бодит нөхцөл байна." },
  neutral_context_injury: { requiredPatternCount: 0, requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтэл эсвэл биеийн хүндрэл нь хөдөлгөөний сонголтод тусад нь харгалзах нөхцөл болж байна." },
  neutral_context_food: { requiredPatternCount: 0, requiredSignals: ["food_discomfort_context"], text: "Зарим хүнсний дараах биеийн мэдрэмж нь тусад нь ажиглавал зохих нөхцөл байна." },
  neutral_context_alcohol: { requiredPatternCount: 0, requiredSignals: ["alcohol_food_change"], text: "Согтууруулах ундаа хэрэглэсэн үеийн хоолны өөрчлөлт нь тусад нь ажиглавал зохих нөхцөл байна." },

  emotional_experiment_trigger: { requiredPatterns: ["emotional_regulation"], text: "Стресс нэмэгдэж, хоол авах гэж буй давтагддаг мөчийг ажиглана." },
  emotional_experiment_action: { requiredPatterns: ["emotional_regulation"], text: "Хоол авахаасаа өмнө түр азнаад: “Одоо биеэрээ өлсөж байна уу, эсвэл тайвшрах, амрах, анхаарлаа сарниулах зэрэг өөр хэрэгцээ байна уу?” гэж өөрөөсөө асууна." },
  emotional_experiment_observe: { requiredPatterns: ["emotional_regulation"], text: "Ямар хэрэгцээ хамгийн тод байсан, хоол идсэний дараа тэр хэрэгцээ хэр өөрчлөгдсөн, дараагийн сонголтод юу нөлөөлснийг тэмдэглэнэ." },
  emotional_experiment_constant: { requiredPatterns: ["emotional_regulation"], text: "Хоолны цаг, хэмжээг зориуд өөрчлөхгүй бөгөөд хоолыг хориглох шинэ дүрэм нэмэхгүй." },
  emotional_experiment_success: { requiredPatterns: ["emotional_regulation"], text: "Тухайн мөчийн хэрэгцээг ялгаж анзаараад, дараагийн сонголтоо яаралгүй хийж чадвал туршилт хэрэгжиж байна гэж үзнэ." },
  emotional_experiment_fallback: { requiredPatterns: ["emotional_regulation"], text: "Нэг мөчийг ажиглалгүй өнгөрөөсөн бол нөхөж давтахгүй; дараагийн ижил нөхцөлд ажиглалтаа хэвийн үргэлжлүүлнэ." },

  experiment_meal_timing_priority: { requiredPatterns: ["irregular_meals_late_hunger", "hunger_satiety"], text: "Хоолны зайг эхэлж тогтворжуулснаар хэт өлсөлтийн нөлөөг багасгаж, стресс болон цадах дохионы хүндрэл тусдаа үедээ хэр хүчтэй байгааг илүү тод ажиглах боломжтой." },

  recommendation_schedule_fit: { requiredSignals: ["schedule_barrier"], text: "Шинэ төлөвлөгөө завгүй өдөр ч хэрэгжихээр цагийн хуваарьт багтах хэрэгтэй." },
  recommendation_cost_fit: { requiredSignals: ["cost_barrier"], text: "Тогтмол үргэлжлүүлэхийн тулд нэмэлт зардал шаардахгүй хувилбар сонгох нь тохиромжтой." },

  plan_option_injury: { requiredPatterns: ["previous_attempt_sustainability"], requiredContexts: ["injury_or_pain_evidence"], text: "Өмнөх гэмтлийг сэдрээхгүй хүрээнд бага ачааллын алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн ижил түвшний хөдөлгөөнөөс нэгийг сонгоно." },
  plan_option_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenContexts: ["injury_or_pain_evidence"], text: "Бага ачааллын алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн ижил түвшний хөдөлгөөнөөс нэгийг сонгоно." },
  plan_injury_stop_exact: { requiredContexts: ["explicit_injury_stop_context"], text: "Өмнөх гэмтэлтэй холбоотой зовиур мэдрэгдвэл тухайн өдрийн хөдөлгөөнийг зогсоож, зовиур үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө." },
  plan_injury_stop_general: { requiredContexts: ["injury_or_pain_evidence"], forbiddenContexts: ["explicit_injury_stop_context"], text: "Өвдөлт эсвэл хөдөлгөөний хязгаарлалт нэмэгдвэл тухайн өдрийн хөдөлгөөнийг зогсоож, үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө." },
  plan_cost: { requiredSignals: ["cost_barrier"], text: "Нэмэлт төлбөр, тоног төхөөрөмж шаардахгүй хувилбарыг сонгоно." },
  plan_fallback_schedule: { requiredSignals: ["schedule_barrier"], text: "Завгүй өдөр сонгосон хөдөлгөөнийхөө 5 минутын бага ачааллын богино хувилбарыг хийнэ." },
  plan_fallback_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenSignals: ["schedule_barrier"], text: "Үндсэн хувилбар тухайн өдөр багтахгүй бол сонгосон хөдөлгөөнийхөө 5 минутын бага ачааллын богино хувилбарыг хийнэ." },
  plan_success_injury: { requiredPatterns: ["previous_attempt_sustainability"], requiredContexts: ["injury_or_pain_evidence"], text: "14 хоногийн 8 сонгосон удаагийн дор хаяж 6-д үндсэн эсвэл богино хувилбараа хийж, өмнөх гэмтэлтэй холбоотой зовиур нэмэгдээгүй бол амжилт гэж үзнэ; жингийн тоогоор дүгнэхгүй." },
  plan_success_general: { requiredPatterns: ["previous_attempt_sustainability"], forbiddenContexts: ["injury_or_pain_evidence"], text: "14 хоногийн 8 сонгосон удаагийн дор хаяж 6-д үндсэн эсвэл богино хувилбараа хийсэн бол амжилт гэж үзнэ; жингийн тоогоор дүгнэхгүй." },

  guidance_blood_pressure: { requiredContexts: ["blood_pressure_followup"], text: "Хэрэв даралт сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хөдөлгөөний ачааллаа нэмэхээс өмнө эмчтэй зөвлөнө үү." },
  guidance_glucose: { requiredContexts: ["glucose_followup"], text: "Хэрэв цусан дахь сахар сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хоолны зайг огцом уртасгалгүй эмчтэй зөвлөнө үү." },
  guidance_injury_exact: { requiredContexts: ["explicit_injury_stop_context"], text: "Өмнөх гэмтэлтэй холбоотой зовиур үргэлжилж байгаа бол хөдөлгөөний шинэ хувилбарыг мэргэжлийн хүнтэй тохируулна уу." },
  guidance_injury_general: { requiredContexts: ["injury_or_pain_evidence"], forbiddenContexts: ["explicit_injury_stop_context"], text: "Өвдөлт эсвэл хөдөлгөөний хязгаарлалт үргэлжилж байгаа бол хөдөлгөөний шинэ хувилбарыг мэргэжлийн хүнтэй тохируулна уу." },
  guidance_medication: { requiredContexts: ["unsupervised_medication"], text: "Эмчийн хяналтгүй эм хэрэглэсэн бол дахин хэрэглэхээсээ өмнө эмч эсвэл эм зүйчтэй зөвлөлдөнө үү." },
  guidance_reproductive: { requiredContexts: ["reproductive_followup"], text: "Нөхөн үржихүйн эсвэл мөчлөгийн нөхцөлтэй холбоотой өөрчлөлт байгаа бол жин бууруулах том төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу." },
  guidance_urgent_blood_pressure: { requiredContexts: ["blood_pressure_followup"], text: "Ухаан балартах, цээжээр хүчтэй өвдөх, амьсгал огцом давчдах зэрэг яаралтай шинж илэрвэл энэ төлөвлөгөөг үргэлжлүүлэхгүй, яаралтай тусламж авна уу." }
});

const RECOMMENDATIONS = Object.freeze({
  pause_before_emotional_eating: { action: "Стресс ихсэх нэг давтагддаг мөчид хоол авахаасаа өмнө түр азнаад, яг одоо өлсөж байна уу эсвэл амрах хэрэгтэй байна уу гэж ялгаж тэмдэглэнэ.", reason: "Энэ алхам хоолыг хорихгүйгээр сэтгэл хөдлөл ба өлсөлтийн дохиог салгаж харахад тусална." },
  change_one_visible_cue: { action: "Хамгийн их өдөөдөг нэг хүнсийг туршилтын хугацаанд нүдэнд шууд харагдахгүй газар байрлуулна.", reason: "Нэг орчны дохиог өөрчлөх нь олон дүрэм нэмэхгүйгээр төлөвлөөгүй сонголтыг багасгаж чадна." },
  anchor_one_meal_time: { action: "Өдөр тутам тогтвортой давтаж болох нэг хоолны цагаа сонгоод, эхний туршилтын хугацаанд баримтална.", reason: "Нэг хоолны цаг тогтворжвол хэт өлсөх болон оройн яарсан сонголт зэрэг хэд хэдэн хүндрэлд зэрэг нөлөөлнө." },
  mid_meal_pause: { action: "Нэг үндсэн хоолны дунд халбагаа тавиад, өлсөлт болон цадалтын мэдрэмжээ түр ажиглана.", reason: "Идэх хэмжээг хүчээр тогтоохын оронд биеийн дохиог цагт нь анзаарах боломж нэмэгдэнэ." },
  fixed_wind_down: { action: "Унтахаас өмнө нэг тогтмол тайвшрах үйлдэлд богино хугацаа зориулна.", reason: "Оройн ачааллыг бага зэрэг бууруулах нь маргааш ядарсан үед хамгийн ойр байгаа хоолыг яаран сонгох эрсдэлийг багасгана." },
  one_movement_anchor: { action: "Өдөрт хамгийн тогтвортой давтагддаг нэг үйл явдлын дараа алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн бага ачааллын хувилбараас нэгийг сонгож туршина.", reason: "Тогтсон нэг мөчид хийх нь дасгалын том төлөвлөгөөнөөс хэрэгжүүлэхэд хялбар." },
  remove_one_strict_rule: { action: "Одоогийн төлөвлөгөөн дэх хамгийн хатуу нэг дүрмийг сонгоод, бүрэн хоригийн оронд урьдчилж тогтоосон уян хувилбараар солино.", reason: "Нэг дүрмийг уян болгох нь бүх төлөвлөгөөг орхих эрсдэлийг бууруулж чадна." },
  minimum_viable_plan: { action: "Үндсэн төлөвлөгөө багтахгүй нөхцөлд ч хийж чадах нэг хоол эсвэл хөдөлгөөний хялбаршуулсан хувилбарыг урьдчилж бичнэ.", reason: "Амьдралын бодит нөхцөлд багтах хялбаршуулсан хувилбар тогтвортой байдлыг хамгаална." },
  build_maintenance_bridge: { action: "Өмнөх аргыг яг хуучнаар нь сэргээхээс илүү өдөр тутамд давтаж болох хялбаршуулсан хувилбар болон алгассан өдрийн дараа хэвийн үргэлжлүүлэх дүрмийг урьдчилж тогтооно.", reason: "Ингэснээр эхлэхээс гадна үр дүнгээ хадгалах, алгассан өдрийн дараа хэвийн үргэлжлүүлэх хэсгийг төлөвлөгөөнд оруулна." }
});

const STRATEGY_COPY = Object.freeze({
  pause_before_emotional_eating: { action: "Стрессийн үеийн идэх хүсэлтэй тэмцэхээс илүү өлсөлт болон амрах хэрэгцээг ялгаж танихад төвлөрнө.", reason: "Ингэснээр хоолыг хорихгүйгээр тухайн мөчийн хэрэгцээнд тохирсон сонголт хийх зай гарна." },
  change_one_visible_cue: { action: "Бүх орчноо нэг дор өөрчлөхгүй; өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг дохиог нүднээс холдуулна.", reason: "Нэг тодорхой дохиог өөрчлөх нь олон дүрэм нэмэхгүйгээр орчны нөлөөг шалгах боломж өгнө." },
  anchor_one_meal_time: { action: "Бүх хоолны цагаа зэрэг засахгүй; хэт өлсөхөөс өмнө барьж болох нэг тогтвортой хоолны мөчөөс эхэлнэ.", reason: "Нэг мөч тогтворжиход оройн яарсан сонголт болон хоолны урт зайг хамтад нь багасгах боломжтой." },
  mid_meal_pause: { action: "Хоолны хэмжээг гаднаас хатуу тогтоохоос илүү идэж байх үеийн өлсөлт, цадалтын дохиог анзаарах чадварыг ашиглана.", reason: "Энэ чиглэл биеийн дохиог хүчээр дарахгүйгээр идэхээ зогсоох мөчийг илүү тод болгоно." },
  fixed_wind_down: { action: "Нойрыг нэг дор төгс болгох зорилго тавихгүй; оройн ачааллыг бууруулах тогтмол нэг үйлдлээс эхэлнэ.", reason: "Оройн хэмнэл тогтворжих нь маргаашийн ядаргаа болон яарсан сонголтыг ажиглах суурь болно." },
  one_movement_anchor: { action: "Дасгалын том хөтөлбөрөөс өмнө өдөр тутам давтаж болох бага ачааллын нэг хөдөлгөөнийг тогтмол мөчтэй холбоно.", reason: "Ингэснээр хөдөлгөөний хэмжээнээс түрүүлж давтаж болох нөхцөлийг олно." },
  remove_one_strict_rule: { action: "Төлөвлөгөөг бүхэлд нь солихгүй; тасрах эрсдэлийг хамгийн их нэмэгдүүлдэг нэг хатуу дүрмийг уян болгоно.", reason: "Нэг дүрмийг өөрчлөх нь хазайлтын дараа бүх төлөвлөгөөг орхих эрсдэлийг багасгана." },
  minimum_viable_plan: { action: "Төгс өдрийн төлөвлөгөө бус, хамгийн завгүй өдөр ч багтах хялбаршуулсан хувилбар бэлдэнэ.", reason: "Өдөр тутмын бодит нөхцөлд багтсан төлөвлөгөөг тогтмол давтах боломж илүү өндөр." },
  build_maintenance_bridge: { action: "Өмнөх аргыг яг хуучнаар нь давтахаас илүү өдөр тутмын амьдралд тогтмол хэрэгжүүлж болох орлуулах төлөвлөгөө бэлдэнэ.", reason: "Орлуулах төлөвлөгөө нь үндсэн хувилбар, нөхцөл хүндрэхэд хийх богино хувилбар, алгассан өдрийн дараа хэвийн үргэлжлүүлэх дүрэм гэсэн гурван хэсэгтэй байна." }
});

const INTERACTION_COPY = Object.freeze({
  meal_hunger_satiety: "Хоолны зай уртсахад өлсөлт хүчтэй болж, цадсанаа анзаарах эсвэл хэмжээгээ тохируулахад илүү хэцүү болж болно.",
  sleep_plan: "Нойр дутуу өдөр ядаргаа нэмэгдэж, өдөр тутмын төлөвлөгөөний хамгийн бага бэлтгэл шаардсан хувилбарыг ч хийхэд хүнд болж болно.",
  sleep_emotion: "Ядарсан үед төлөвлөсөн сонголтоо барихад хэцүү болж болно. Хэрэв хоол тухайн мөчид түр амсхийх мэт мэдрэмж өгдөг бол стрессийн шалтгаан хэвээр үлдэхэд идэх хүсэл дахин төрж болно.",
  emotion_restriction: "Стресстэй үеийн идэх хүсэл нэмэгдэхтэй зэрэгцэн хэт хатуугаар дахин эхлэх нь өмнөх мөчлөгийг улам хүчтэй болгож болно.",
  cue_meal_rhythm: "Орчны дохиогоор төлөвлөөгүй идэхэд дараагийн хоолны цаг хойшилж, хоолны хэмнэл дахин алдагдаж болно.",
  cue_satiety: "Хоол байнга нүдэнд өртөх үед цадсан байсан ч дахин идэх хүсэл төрж болно.",
  cue_movement: "Гэр эсвэл суугаа орчинд хоол ойр байхад хөдөлгөөнгүй удаан суух мөчид идэх хүсэл давхар төрж болно.",
  restriction_sustainability: "Хэт хатуу дүрмийг үргэлжлүүлэхэд хэцүү болох үед өмнөх оролдлого зогссон нөхцөл дахин давтагдаж болно.",
  routine_sustainability: "Өдөр тутмын хуваарьтай нийцээгүй төлөвлөгөө өмнөх оролдлого зогссон цэгийг дахин үүсгэж болно.",
  movement_maintenance: "Өмнөх үр дүнг дэмжиж байсан хөдөлгөөний хэмнэл алдагдсан байна. Одоогийн өдөр тутмын хөдөлгөөн бага байгаа тул түүнийг орлох тогтмол хэмнэл хараахан бүрдээгүй байна."
});

const PROTECTIVE_COPY = Object.freeze({
  emotional_eating: "Стресстэй үед идэх хүсэл өөрчлөгддөггүй нь сэтгэл хөдлөл хооллолтыг шууд удирддаггүй хамгаалах хүчин зүйл болж байна.",
  environmental_cue_reactivity: "Өлсөөгүй үед орчны хоолны дохио гол саад болж харагдсангүй.",
  portion_difficulty: "Тодорхой хүнсний хэмжээг тохируулахад хүндрэлгүй байгаа нь цадах дохиогоо ашиглах давуу тал болж байна.",
  regular_meal_rhythm: "Таны хоолны хэмнэл тогтвортой байгаа нь хэт өлсөлт одоогийн гол саад биш байгааг харуулна.",
  hunger_recognition_difficulty: "Өлсөх мэдрэмжээ амархан анзаардаг нь биеийн дохиогоо ашиглах хамгаалах хүчин зүйл болж байна.",
  satiety_difficulty: "Цадсанаа анзаараад зогсож чаддаг нь идэх хэмжээгээ тохируулахад ашиглаж болох бодит давуу тал юм.",
  short_sleep: "Унтах хугацаа гол саад болж харагдсангүй.",
  poor_sleep_quality: "Нойрны чанар сайн байгаа нь өдөр тутмын сонголтоо төлөвлөхөд дэмжлэг болно.",
  low_movement: "Өдрийн хөдөлгөөн их байгаа нь одоо байгаа бодит давуу тал юм.",
  weight_regain: "Өмнөх оролдлогын дараа жин буцаагүй нь тогтвортой болгож чадсан зүйл байсныг харуулж байна.",
  professional_support: "Өмнө нь мэргэжлийн дэмжлэг авч байсан нь тусламж ашиглах бодит туршлага болж байна.",
  sustainability_barrier: "Тодорхой саад байгаагүй гэсэн хариулт нь хэрэгжүүлэх суурь боломж байгааг харуулж байна.",
  medium_duration_attempt: "Өмнөх аргаа 6–12 сар үргэлжлүүлсэн нь тодорхой хугацаанд тогтвортой хэрэгжүүлж чадсаныг харуулж байна.",
  sustained_attempt: "Нэг жилээс урт хугацаанд аргаа үргэлжлүүлсэн нь тогтвортой өөрчлөлт хийж чаддаг бодит давуу тал юм.",
  initial_attempt_success: "Өмнөх оролдлогын эхэнд жин буурсан нь тохирсон нөхцөл бүрдэхэд үр дүн гаргаж чаддагийг харуулж байна."
});

function sentenceTemplateMatches(template, state = {}) {
  const positiveSignals = new Set(state.positiveSignals || []);
  const protectiveSignals = new Set(state.protectiveSignals || []);
  const supportedPatterns = new Set(state.supportedPatterns || []);
  const influencingPatterns = new Set(state.influencingPatterns || state.supportedPatterns || []);
  const contexts = new Set(state.contexts || []);
  return (template.requiredSignals || []).every(signal => positiveSignals.has(signal))
    && (template.forbiddenSignals || []).every(signal => !positiveSignals.has(signal))
    && (template.requiredProtectiveSignals || []).every(signal => protectiveSignals.has(signal))
    && (template.requiredPatterns || []).every(pattern => supportedPatterns.has(pattern))
    && (template.forbiddenPatterns || []).every(pattern => !supportedPatterns.has(pattern))
    && (template.requiredPatternCount == null || influencingPatterns.size === template.requiredPatternCount)
    && (template.requiredProtectiveCount == null || protectiveSignals.size === template.requiredProtectiveCount)
    && (template.requiredContexts || []).every(context => contexts.has(context))
    && (template.forbiddenContexts || []).every(context => !contexts.has(context));
}

module.exports = { PATTERN_COPY, PATTERN_PUBLIC_TITLES, CONTEXT_PUBLIC_TITLES, SENTENCE_TEMPLATES, RECOMMENDATIONS, STRATEGY_COPY, INTERACTION_COPY, PROTECTIVE_COPY, sentenceTemplateMatches };
