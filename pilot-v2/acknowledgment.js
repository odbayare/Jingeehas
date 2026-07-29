"use strict";
(function expose(root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  else root.JingeehasPilotAcknowledgment = value;
})(typeof globalThis === "object" ? globalThis : this, function createAcknowledgment() {
  return Object.freeze({
    version: "jingeehas-private-pilot-ack-v2.1",
    title: "Туршилтын хүрээ, сайн дурын оролцооны танилцуулга",
    statements: Object.freeze([
      "Энэ асуумжийг AI-аар боловсруулж, AI симуляцаар урьдчилан шалгасан.",
      "Психометрийн баталгаажуулалт хийгдээгүй бөгөөд онош тавихгүй.",
      "Хариултыг арилжааны мэдээллээс тусдаа pilot өгөгдөлд хадгална.",
      "Оролцоо сайн дурын бөгөөд хүссэн үедээ зогсоож болно.",
      "Өгөгдлөө устгуулах хүсэлтийг support@jingeehas.fit хаягаар гаргаж болно.",
      "Аюулгүй байдлын урьдчилсан шалгалт нь мэргэжлийн үнэлгээг орлохгүй.",
      "Энэ нь төлбөртэй эмчилгээ, үйлчилгээний санал биш.",
      "Энэ зөвшөөрөл нь психометрийн судалгаанд ашиглах зөвшөөрөл биш."
    ])
  });
});
