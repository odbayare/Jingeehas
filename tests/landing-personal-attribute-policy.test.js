"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");

const required = [
  "Жин хасах оролдлогод нөлөөлдөг хэв маягаа таних",
  "Жин хасах оролдлого яагаад тогтвортой үргэлжлэхгүй байдгийг ойлгоход туслах тест үнэлгээ",
  "Стресс, ядаргаа, нойрны хэмнэл хооллолтын шийдвэрт нөлөөлж болно.",
  "Хэт хатуу дэглэмийг удаан хугацаанд тогтвортой үргэлжлүүлэхэд хэцүү байж болно.",
  "Орчин, цагийн хуваарь болон автомат зуршил давтагдсан саад үүсгэж болно.",
  "Жин хасах оролдлогод хоол, хөдөлгөөнөөс гадна сэтгэлзүйн хэв маяг, өдөр тутмын зуршил болон орчин нөлөөлж болно.",
  "Эмнэлгийн болон сэтгэлзүйн онош тавихгүй. Хариултад тулгуурласан өөрийгөө ойлгох үнэлгээ."
];

const prohibited = [
  "Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?",
  "Илүүдэл жин тань таны санааг байнга зовоодог уу?",
  "Янз бүрийн дасгал хөдөлгөөн туршсан ч өөрчлөлт бага байна уу?",
  "Тураах бэлдмэл, хоолны дэглэм хэрэглэсэн ч үр дүн нь хангалтгүй эсвэл удаан тогтдоггүй юу?",
  "Жин хасахад зөвхөн хоол, дасгал биш — таны сэтгэлзүйн хэв маяг, далд зуршил хүчтэй нөлөөлдөг."
];

for (const copy of required) assert(source.includes(copy), `required policy-safe copy missing: ${copy}`);
for (const copy of prohibited) assert(!source.includes(copy), `direct personal-attribute copy remains: ${copy}`);

app._test.setComingSoon(false);
const landing = app.renderForPath("/");
for (const copy of required) assert(landing.includes(copy), `rendered landing missing: ${copy}`);
for (const copy of prohibited) assert(!landing.includes(copy), `rendered landing contains prohibited copy: ${copy}`);
assert(landing.includes("Тестээ үнэгүй эхлүүлэх"));
assert(landing.includes("9,900₮"));
app._test.resetComingSoon();

console.log("landing personal-attribute policy copy tests passed");
