"use strict";

(function expose(root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.JingeehasPilotScaleRegistry = value;
})(typeof globalThis === "object" ? globalThis : this, function createRegistry() {
  const option = (code, label, score) => Object.freeze({ code, label, score });
  const withMissing = labels => Object.freeze(labels.map((label, score) => option(String(score), label, score))
    .concat(option("NA", "Ийм нөхцөл тохиолдоогүй", null)));
  const registry = {
    frequency_14d_opportunity_0_4_na: withMissing(["Огт тохиолдоогүй", "Нэг хоёр удаа", "Заримдаа", "Олон удаа", "Бараг өдөр бүр"]),
    frequency_30d_opportunity_0_4_na: withMissing(["Огт тохиолдоогүй", "Нэг хоёр удаа", "Заримдаа", "Олон удаа", "Бараг өдөр бүр"]),
    confidence_0_4_na: withMissing(["Огт итгэлгүй", "Бага зэрэг итгэлтэй", "Дунд зэрэг итгэлтэй", "Нэлээд итгэлтэй", "Маш итгэлтэй"]),
    typicality_0_4_na: withMissing(["Надад огт тохирохгүй", "Бага зэрэг тохирно", "Зарим талаар тохирно", "Ихэнхдээ тохирно", "Маш сайн тохирно"]),
    difficulty_control_0_4_na: withMissing(["Огт хэцүү биш", "Бага зэрэг хэцүү", "Дунд зэрэг хэцүү", "Нэлээд хэцүү", "Маш хэцүү"]),
    agreement_research_0_4_na: Object.freeze(["Огт санал нийлэхгүй", "Бага зэрэг санал нийлнэ", "Зарим талаар санал нийлнэ", "Ихэнхдээ санал нийлнэ", "Бүрэн санал нийлнэ"]
      .map((label, score) => option(String(score), label, score)).concat(option("NA", "Хариулах боломжгүй", null)))
  };
  for (const [key, value] of Object.entries(registry)) registry[key] = Object.freeze(value);
  const frozen = Object.freeze(registry);
  function score(scaleId, code) {
    const match = frozen[scaleId]?.find(item => item.code === String(code));
    if (!match) throw Object.assign(new Error("Unknown pilot response"), { code: "invalid_pilot_response" });
    return match.score;
  }
  return Object.freeze({ registry: frozen, score });
});
