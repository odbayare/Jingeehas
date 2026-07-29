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
for (const removed of ["Үнэлгээний зарчим", "Арга зүй ба судалгааны үндэслэл", "Үнэлгээ нь нэг асуулт эсвэл нэг нийт оноогоор дүгнэхгүй", "Аюулгүй байдлын дохио", "Сэтгэлзүй ба зан үйлийн хэв маяг", "Өдөр тутмын саад ба орчны нөлөө", "Судалж харьцуулсан арга зүй:", "Эдгээр хэрэгслийг нэг багц болгон шууд хуулбарлаагүй", "Тайлан хэрхэн гардаг вэ?", "Арга зүйг дэлгэрэнгүй унших"]) assert(!landing.includes(removed), removed);
assert(methodology.includes("Арга зүй ба судалгааны үндэслэл"));

const scientificBoxTitle = "Ашигласан шинжлэх ухааны аргачлалууд";
const scientificIntro = "Weight Test-ийн бүтэц, хэмжээс болон үр дүнгийн тайлбарыг боловсруулахдаа идэх зан үйл, сэтгэлзүйн хүчин зүйлсийг судалдаг олон улсын аргачлал, онолын хүрээг харгалзан үзсэн.";
const scientificDisclaimer = "Weight Test нь дээрх асуумжуудын шууд орчуулга биш бөгөөд сэтгэлзүйн болон эмнэлзүйн онош тавихгүй. Эдгээр аргачлалд судлагддаг шинжлэх ухааны концепцуудыг ашиглан жин хасахад саад болж болзошгүй сэтгэлзүйн болон идэх зан үйлийн хэв маягийг танихад тусална.";
assert(landing.includes(scientificBoxTitle));
assert(landing.includes(scientificIntro));
assert(landing.includes(scientificDisclaimer));
for (const method of ["Биопсихосоциал загвар", "Dutch Eating Behavior Questionnaire", "DEBQ", "Three-Factor Eating Questionnaire", "TFEQ", "Binge Eating Scale", "BES", "Night Eating Questionnaire", "NEQ", "Когнитив-зан үйлийн функциональ шинжилгээ"]) assert(landing.includes(method), method);
assert(landing.indexOf('id="scientific-methods-title"') < landing.indexOf("</main>"));
assert.equal((landing.match(/class="scientific-methods-box"/g) || []).length, 1);
assert(landing.includes('<h2 id="scientific-methods-title">'));
assert(landing.includes('type="button" data-action="toggle-scientific-methods" aria-expanded="true" aria-controls="scientific-methods-details" hidden'));
assert(landing.includes('<div id="scientific-methods-details" class="scientific-methods-details">'));

for (const name of ["TFEQ", "TFEQ-R18", "DEBQ", "AEBQ", "EEQ", "BEDS-7", "SCOFF", "PHQ-9", "STOP-Bang", "WEL", "WEL-SF", "IPAQ", "IWQOL-Lite", "Obesity Canada 5As", "Obesity Canada 4Ms", "AACE", "NICE", "Noom", "WeightWatchers", "Calibrate", "Wegovy consumer quiz"]) assert(methodology.includes(name), name);
for (const section of ["Хооллолтын зан үйлийн судалгаа", "Аюулгүй байдлын шалгалтын судалгаа", "Өөрийгөө зохицуулах итгэл, хөдөлгөөн ба амьдралын ачаалал", "Жингийн менежментийн клиникийн хүрээнүүд", "Тайлан гаргах зарчим", "Үйлчилгээний туршлагын харьцуулалт", "Арга зүйн хязгаарлалт"]) assert(methodology.includes(section), section);
assert(methodology.includes("Арга зүйн хувилбар:</strong> 1.0"));
assert(methodology.includes("Сүүлийн шинэчлэл:</strong> 2026 оны 7 дугаар сар"));

for (const claim of ["шинжлэх ухаанаар батлагдсан", "клиникийн баталгаажсан", "validated assessment", "эмч нар боловсруулсан", "сэтгэлзүйчид боловсруулсан", "олон улсын стандарт тест"]) assert(!source.toLowerCase().includes(claim.toLowerCase()), claim);
for (const forbidden of ["Шинжлэх ухаанаар батлагдсан Weight Test", "Клиникийн баталгаатай", "Таргалалтын жинхэнэ шалтгааныг тогтооно", "DEBQ, TFEQ, BES, NEQ тестийг ашигладаг", "Олон улсын тестүүдийн Монгол хувилбар", "Эмнэлзүйн үнэлгээ", "100% үнэн зөв", "Таны таргалалтын үндсэн шалтгааныг илрүүлнэ"]) assert(!source.toLowerCase().includes(forbidden.toLowerCase()), forbidden);
assert(!/turn\d+(?:view|search|fetch|open)\d+/i.test(source));
assert(source.includes("const WEIGHT_TEST_COMING_SOON_MODE = false;"));
assert(styles.includes(":focus-visible"));
assert(styles.includes(".scientific-method-names, .scientific-methods-grid { grid-template-columns: 1fr; }"));
assert(styles.includes("color: var(--primary-dark); font-size: clamp(1.1rem, 1.5vw, 1.3rem); font-weight: 800; line-height: 1.5"));
assert(styles.includes("color: var(--text); font-size: clamp(1.05rem, 1.25vw, 1.18rem); font-weight: 600; line-height: 1.65"));
assert(landing.indexOf("<h1") < landing.indexOf("<h2"));
assert(methodology.indexOf("<h1") < methodology.indexOf("<h2"));

console.log("methodology trust-content tests passed");
