"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");

const required = [
  "ЖИН ХАСАХ АМАРХАН БОЛЛОО",
  "Та өөртөө юу саад болдгийг мэддэг. Харин тэд хоорондоо яаж нийлж ажилладгийг мэдэх үү?",
  "Хүн стрессдэхээрээ, баярлахаараа, гуниглахаараа дуртай зүйлээ идчихдэг, орой болохоор хоолны дуршил нэмэгддэг, дэглэмээ нэг алдахаараа бүр орхичихдог гэх мэт жин хасахад саад болдог зуршлуудаа өөрөө сайн мэдэж байдаг.",
  "Гэхдээ эдгээр нь амьдрал дээр дандаа тус тусдаа ажилладаггүй.",
  "Зарим хэв маяг давхацахаараа нэг нь нөгөөгөө улам хүчтэй болгож, таныг өөрийн мэдэлгүйгээр жин хасах зорилгыг чинь унтраадаг.",
  "Энэхүү тест яг үүнийг олж харна.",
  "Танд ямар хэв маягууд байна?",
  "Аль нь альтайгаа давхцаж байна?",
  "Давхцах үедээ танд хэрхэн нөлөөлж байна?",
  "Тэр нөлөөний улмаас таныг ямар алхам хийлгэж байна?",
  "Тэр нөлөөллүүдийг яаж удирдах вэ?",
  "Эхний үр дүн үнэгүй"
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
