"use strict";
(function expose(root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.JingeehasPilotSafetyRegistry = value;
})(typeof globalThis === "object" ? globalThis : this, function createRegistry() {
  const options = Object.freeze([
    Object.freeze({ code: "none", label: "Үгүй", routesToSafety: false }),
    Object.freeze({ code: "present", label: "Тийм", routesToSafety: true })
  ]);
  const items = Object.freeze([
    Object.freeze({ itemKey: "SAFETY-COMPENSATORY-V21", domain: "compensatory_behavior", prompt: "Сүүлийн үед идсэнээ нөхөхийн тулд бөөлжих, туулгах эм хэрэглэх эсвэл хэт дасгал хийх тохиолдол байсан уу?", options }),
    Object.freeze({ itemKey: "SAFETY-SELF-HARM-V21", domain: "self_harm_thought", prompt: "Одоо өөрийгөө гэмтээх тухай бодол төрж байна уу?", options }),
    Object.freeze({ itemKey: "SAFETY-URGENT-PHYSICAL-V21", domain: "urgent_physical_symptom", prompt: "Одоо ухаан балартах, цээжээр хүчтэй өвдөх зэрэг яаралтай биеийн шинж байна уу?", options })
  ]);
  return Object.freeze({ version: "jingeehas-ai-pilot-safety-v2.1", items });
});
