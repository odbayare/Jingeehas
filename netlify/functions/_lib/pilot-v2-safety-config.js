"use strict";

const CONFIG = Object.freeze({
  version: "jingeehas-mn-pilot-safety-guidance-v2.1",
  reviewStatus: "pending_human_approval",
  jurisdiction: "Mongolia",
  contacts: Object.freeze([]),
  guidance: Object.freeze({
    self_harm_thought: Object.freeze({
      category: "active_self_harm_thought",
      heading: "Өөрийгөө гэмтээх бодлын үед",
      body: "Одоо ганцаараа үлдэхгүй байж, ойрын итгэлтэй хүндээ шууд хэлэн, яаралтай мэргэжлийн тусламж авахыг хүснэ үү. Энэ нь онош биш."
    }),
    urgent_physical_symptom: Object.freeze({
      category: "urgent_physical_symptom",
      heading: "Яаралтай биеийн шинжийн үед",
      body: "Ухаан балартах, цээжээр хүчтэй өвдөх зэрэг шинж байгаа бол асуумжийг үргэлжлүүлэхгүй, яаралтай эмнэлгийн тусламж авна уу. Энэ нь онош биш."
    }),
    compensatory_behavior: Object.freeze({
      category: "compensatory_behavior",
      heading: "Нөхөх зан үйлийн үед",
      body: "Идсэнээ нөхөх зан үйл давтагдсан бол асуумжийн ердийн тайлбараас илүүтэй эмч эсвэл сэтгэлзүйн мэргэжилтэнтэй аюулгүй, шүүмжлэлгүй ярилцахыг зөвлөе. Энэ нь онош биш."
    })
  })
});

module.exports = CONFIG;
