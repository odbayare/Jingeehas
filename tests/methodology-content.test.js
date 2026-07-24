"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const landing = app.renderForPath("/");
const methodology = app.renderForPath("/methodology");

assert.equal(app.routeName("/methodology"), "methodology");
assert(landing.includes("Яагаад хоолны дэглэм барих, дасгал хөдөлгөөн хийх дангаараа хангалтгүй байдаг вэ?"));
assert(!landing.includes("Яагаад хоол, дасгал дангаараа хангалтгүй байдаг вэ?"));
for (const pillar of ["Аюулгүй байдлын дохио", "Хоолны зан үйлийн судалгаа", "Сэтгэл хөдлөлийн хооллолт", "Нойр ба амьдралын хэмнэл"]) assert(landing.includes(pillar), pillar);
assert(!landing.includes("TFEQ, DEBQ, AEBQ, EEQ, BEDS-7, SCOFF, WEL-SF, STOP-Bang, PHQ-9, IPAQ, IWQOL-Lite"));
assert(landing.includes("Мэргэжлийн тусламж хэрэгтэйг илтгэх дохио хариултаас илэрвэл"));
assert(landing.includes('href="/methodology"'));

for (const name of ["TFEQ", "TFEQ-R18", "DEBQ", "AEBQ", "EEQ", "BEDS-7", "SCOFF", "PHQ-9", "STOP-Bang", "WEL", "WEL-SF", "IPAQ", "IWQOL-Lite", "Obesity Canada 5As", "Obesity Canada 4Ms", "AACE", "NICE", "Noom", "WeightWatchers", "Calibrate", "Wegovy consumer quiz"]) assert(methodology.includes(name), name);
for (const section of ["Хооллолтын зан үйлийн судалгаа", "Аюулгүй байдлын шалгалтын судалгаа", "Өөрийгөө зохицуулах итгэл, хөдөлгөөн ба амьдралын ачаалал", "Жингийн менежментийн клиникийн хүрээнүүд", "Тайлан гаргах зарчим", "Үйлчилгээний туршлагын харьцуулалт", "Арга зүйн хязгаарлалт"]) assert(methodology.includes(section), section);
assert(methodology.includes("Арга зүйн хувилбар:</strong> 1.0"));
assert(methodology.includes("Сүүлийн шинэчлэл:</strong> 2026 оны 7 дугаар сар"));

for (const claim of ["шинжлэх ухаанаар батлагдсан", "клиникийн баталгаажсан", "validated assessment", "эмч нар боловсруулсан", "сэтгэлзүйчид боловсруулсан", "олон улсын стандарт тест"]) assert(!source.toLowerCase().includes(claim.toLowerCase()), claim);
assert(!/turn\d+(?:view|search|fetch|open)\d+/i.test(source));
assert(source.includes("const WEIGHT_TEST_COMING_SOON_MODE = false;"));
assert(styles.includes(":focus-visible"));
assert(styles.includes(".methodology-pillars { grid-template-columns: 1fr; }"));
assert(landing.indexOf("<h1") < landing.indexOf("<h2"));
assert(methodology.indexOf("<h1") < methodology.indexOf("<h2"));

console.log("methodology trust-content tests passed");
