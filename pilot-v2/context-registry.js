"use strict";
(function expose(root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.JingeehasPilotContextRegistry = value;
})(typeof globalThis === "object" ? globalThis : this, function createRegistry() {
  const option = (code, label, fact) => Object.freeze({ code, label, fact });
  const items = Object.freeze([
    Object.freeze({ itemKey: "CONTEXT-SLEEP-V21", domain: "sleep_fatigue", prompt: "Сүүлийн 14 хоногийн нойр, ядрал таны өдөр тутмын байдалд хэр нөлөөлсөн бэ?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("little", "Бага", "Нойр, ядрал бага хэмжээнд нөлөөлсөн гэж тэмдэглэсэн."), option("some", "Зарим", "Нойр, ядрал зарим хэмжээнд нөлөөлсөн гэж тэмдэглэсэн."), option("substantial", "Нэлээд", "Нойр, ядрал нэлээд нөлөөлсөн гэж тэмдэглэсэн.")]) }),
    Object.freeze({ itemKey: "CONTEXT-MOVEMENT-V21", domain: "movement", prompt: "Өдөр тутмын хөдөлгөөн хийх боломж одоогоор ямар байна вэ?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("available", "Боломжтой", "Өдөр тутмын хөдөлгөөн хийх боломжтой гэж тэмдэглэсэн."), option("limited", "Хязгаарлагдмал", "Өдөр тутмын хөдөлгөөн хийх боломж хязгаарлагдмал гэж тэмдэглэсэн.")]) }),
    Object.freeze({ itemKey: "CONTEXT-INJURY-V21", domain: "injury", prompt: "Хөдөлгөөнд нөлөөлөх гэмтэл эсвэл өвдөлт одоо байна уу?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("none", "Үгүй", "Хөдөлгөөнд нөлөөлөх гэмтэл тэмдэглээгүй."), option("present", "Тийм", "Хөдөлгөөнд нөлөөлөх гэмтэл эсвэл өвдөлт байгааг тэмдэглэсэн.")]) }),
    Object.freeze({ itemKey: "CONTEXT-SCHEDULE-V21", domain: "schedule", prompt: "Таны хуваарь тогтмол хооллох боломжид хэр нөлөөлдөг вэ?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("little", "Бага", "Хуваарийн нөлөө бага гэж тэмдэглэсэн."), option("some", "Зарим", "Хуваарь тогтмол хооллоход зарим саадтай гэж тэмдэглэсэн."), option("substantial", "Нэлээд", "Хуваарь тогтмол хооллоход нэлээд саадтай гэж тэмдэглэсэн.")]) }),
    Object.freeze({ itemKey: "CONTEXT-COST-V21", domain: "cost", prompt: "Хүнсний зардал сонголтод тань хэр нөлөөлдөг вэ?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("little", "Бага", "Хүнсний зардлын нөлөө бага гэж тэмдэглэсэн."), option("some", "Зарим", "Хүнсний зардал сонголтод зарим нөлөөтэй гэж тэмдэглэсэн."), option("substantial", "Нэлээд", "Хүнсний зардал сонголтод нэлээд нөлөөтэй гэж тэмдэглэсэн.")]) }),
    Object.freeze({ itemKey: "CONTEXT-SUPPORT-V21", domain: "social_support", prompt: "Ойр орчноосоо хэрэгтэй дэмжлэг авах боломж ямар байна вэ?", options: Object.freeze([option("not_reported", "Хэлэхгүй", null), option("limited", "Хязгаарлагдмал", "Ойр орчны дэмжлэг хязгаарлагдмал гэж тэмдэглэсэн."), option("some", "Зарим", "Ойр орчноос зарим дэмжлэг авах боломжтой гэж тэмдэглэсэн."), option("available", "Боломжтой", "Ойр орчны дэмжлэг авах боломжтой гэж тэмдэглэсэн.")]) })
  ]);
  return Object.freeze({ version: "jingeehas-ai-pilot-context-v2.1", items });
});
