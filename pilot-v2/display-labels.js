"use strict";
(function expose(root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.JingeehasPilotDisplayLabels = value;
})(typeof globalThis === "object" ? globalThis : this, function createLabels() {
  return Object.freeze({
    constructs: Object.freeze({
      emotional_eating: Object.freeze({ name: "Сэтгэл хөдлөлтэй холбоотой идэлт", measures: "Сэтгэл хөдлөлтэй холбоотой идэх хандлагын дэмжлэг." }),
      external_cue_reactivity: Object.freeze({ name: "Гадаад өдөөлтийн нөлөө", measures: "Харагдах, үнэртэх зэрэг гадаад дохионы нөлөө." }),
      uncontrolled_eating: Object.freeze({ name: "Хяналт алдагдсан мэт идэлт", measures: "Идэх явцыг зогсоох, хэмжээг барихад мэдрэгдсэн бэрхшээл." }),
      eating_self_efficacy: Object.freeze({ name: "Хооллолтын өөртөө итгэх итгэл", measures: "Нөхцөл бүрд хооллолтын сонголтоо удирдах итгэл." }),
      hunger_satiety_awareness: Object.freeze({ name: "Өлсгөлөн, цадалтын мэдрэмж", measures: "Биеийн өлсгөлөн, цадалтын дохиог анзаарах чадвар." }),
      habit_automaticity: Object.freeze({ name: "Дадлын автомат байдал", measures: "Хооллох үйлдэл бодолгүй, автоматаар өрнөх хандлага." }),
      body_image_avoidance: Object.freeze({ name: "Биеийн дүр төрхөөс зайлсхийх", measures: "Биеийн дүр төрхтэй холбоотой зайлсхийх хандлага." }),
      implementation_maintenance_friction: Object.freeze({ name: "Төлөвлөгөөг хэрэгжүүлэх саад", measures: "Санааг бодит үйлдэл болгон үргэлжлүүлэхэд мэдрэгдсэн саад." }),
      restrictive_rebound: Object.freeze({ name: "Хэт хязгаарлалтын буцалт", measures: "Хэт хязгаарласны дараах буцаж идэх хандлага." })
    }),
    orientations: Object.freeze({ barrier: "Саадын чиглэл", capability: "Дэмжих чадварын чиглэл" }),
    dataStatuses: Object.freeze({ complete: "Бүрэн хариулсан", partial_scorable: "Хэсэгчлэн бүрдсэн", insufficient_data: "Хангалттай хариултгүй" }),
    scoreTerms: Object.freeze({ nativeScore: "Тухайн чиглэлийн дүрслэх оноо", barrierBurdenScore: "Саадын дотоод тооцоолол", scoreMeaning: "Онооны утга" }),
    sections: Object.freeze({ safety: "Аюулгүй байдлын урьдчилсан шалгалт", research_quality: "Асуумжийн ойлгомжтой байдлын асуулт", context: "Нэмэлт нөхцөл" }),
    technical: Object.freeze({ heading: "Хувилбарын техникийн мэдээлэл", instrumentVersion: "Асуумжийн хувилбар",
      scoringVersion: "Тооцооллын хувилбар", reportVersion: "Тайлангийн хувилбар", itemBankHash: "Асуултын сангийн хэш",
      generatedAt: "Тайлан үүсгэсэн огноо", contextVersion: "Нэмэлт нөхцөлийн хувилбар", safetyVersion: "Аюулгүй байдлын шалгалтын хувилбар" })
  });
});
