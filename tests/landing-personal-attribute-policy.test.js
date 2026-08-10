"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const visibleText = html => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ");

const required = [
  "ЖИН ХАСАХ АМАРХАН БОЛЛОО",
  "Та жин хасахад тань юу саад болж, яагаад хэцүү болгодогоо мэддэг гэж боддог уу? Таныг заримдаа дэглэмээ зөрчиж хооллох, хааяа нэг амттан сэмээрхэн идчихдэг, зарим хоолыг хэтрүүлчихдэг сэтгэлзүйн шалтгаануудаа та сайн мэдэж байгаа. Гэхдээ таныг далдуур удирдаж буй сэтгэлзүйн дадал зуршлууд хоорондоо нийлэхээрээ ямар үр дүнд хүргэдэгийг мэдэх үү?",
  "Жин хасахад саад болж буй сэтгэлзүйн хэв маягууд, тэдгээрийн харилцан нөлөө болон хэрхэн удирдаж, нөлөөг нь багасгах аргуудаа мэдэхийн тулд тестээ бөглөөрэй. Энэ мэдээлэл таны бүрэн тайланд нээгдэнэ.",
  "Бүрэн тайлан тань яг үүнийг харуулна.",
  "Танд ямар хэв маягууд байна?",
  "Аль нь альтайгаа давхцаж байна?",
  "Давхцах үедээ танд хэрхэн нөлөөлж байна?",
  "Тэр нөлөөний улмаас таныг ямар алхам хийлгэж байна?",
  "Тэр нөлөөллүүдийг яаж удирдах вэ?",
  "Тест үнэгүй · Хувийн тайлан 9,900₮"
];

const prohibited = [
  "Эхний үр дүн үнэгүй",
  "Эхний хувийн үр дүн",
  "Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?",
  "Илүүдэл жин тань таны санааг байнга зовоодог уу?",
  "Янз бүрийн дасгал хөдөлгөөн туршсан ч өөрчлөлт бага байна уу?",
  "Тураах бэлдмэл, хоолны дэглэм хэрэглэсэн ч үр дүн нь хангалтгүй эсвэл удаан тогтдоггүй юу?",
  "Жин хасахад зөвхөн хоол, дасгал биш — таны сэтгэлзүйн хэв маяг, далд зуршил хүчтэй нөлөөлдөг."
];

for (const copy of required) assert(visibleText(source).includes(copy), `required policy-safe copy missing: ${copy}`);
for (const copy of prohibited) assert(!source.includes(copy), `direct personal-attribute copy remains: ${copy}`);

app._test.setComingSoon(false);
const landing = app.renderForPath("/");
for (const copy of required) assert(visibleText(landing).includes(copy), `rendered landing missing: ${copy}`);
for (const copy of prohibited) assert(!landing.includes(copy), `rendered landing contains prohibited copy: ${copy}`);
assert(landing.includes("ТЕСТЭЭ ЭХЛҮҮЛЭХ"));
assert(landing.includes("9,900₮"));
app._test.resetComingSoon();

console.log("landing personal-attribute policy copy tests passed");
