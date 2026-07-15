const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const indexHtml = fs.readFileSync("index.html", "utf8");
const appSource = fs.readFileSync("app.js", "utf8");

const PRODUCT_NAME = "Илүүдэл жингээс салах тест үнэлгээ";
const OLD_PRIMARY_CTA = ["Тест", "үнэлгээг", "эхлүүлэх"].join(" ");
const PUBLIC_COPY = [
  "Илүүдэл жин үүсгэж буй сэтгэлзүйн шалтгаанаа илрүүл.",
  "Ямар далд зуршлууд илүүдэл жин үүсэхэд нөлөөлж буйг тайлж мэд.",
  "Жин хасахад тань тохирох дөт хэв маяг, дасгал сургуулилтын чиглэлээ мэдэж ав."
];

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tagContent(html, tagName) {
  const match = String(html).match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function metaContent(html, key) {
  const matcher = new RegExp(
    `<meta\\s+[^>]*(?:name|property)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = String(html).match(matcher);
  return match ? match[1].trim() : "";
}

function assertCopySafe(value, label) {
  const text = String(value || "").toLowerCase();
  [
    "оношилгоо",
    "эмчилгээ",
    "баталгаатай",
    "баталгаатай турна",
    "хатуу дэглэм",
    "сахилгагүй",
    "амжилтгүй",
    "limited seats",
    "fake urgency",
    "fake scarcity",
    "хязгаарлагдмал суудал",
    "сүүлийн боломж",
    "яг одоо авахгүй бол"
  ].forEach(term => {
    assert(!text.includes(term.toLowerCase()), `${label}: forbidden public copy present: ${term}`);
  });
}

assert.strictEqual(tagContent(indexHtml, "title"), PRODUCT_NAME, "HTML title must use official product name");
assert.strictEqual(metaContent(indexHtml, "og:title"), PRODUCT_NAME, "OG title must use official product name");
assert.strictEqual(metaContent(indexHtml, "twitter:title"), PRODUCT_NAME, "Twitter title must use official product name");

const metadata = [
  tagContent(indexHtml, "title"),
  metaContent(indexHtml, "description"),
  metaContent(indexHtml, "og:title"),
  metaContent(indexHtml, "og:description"),
  metaContent(indexHtml, "twitter:title"),
  metaContent(indexHtml, "twitter:description")
].join("\n");
assert(metadata.includes("сэтгэлзүйн шалтгаан"), "metadata must include approved psychological cause framing");
assert(metadata.includes("далд зуршил"), "metadata must include approved hidden habit framing");
assert(metadata.includes("дасгал сургуулилтын чиглэл"), "metadata must include approved training direction framing");
assertCopySafe(metadata, "metadata");

assert(appSource.includes(`const PUBLIC_PRODUCT_NAME = "${PRODUCT_NAME}";`), "app source must define official public product name");
PUBLIC_COPY.forEach(line => {
  assert(appSource.includes(line), `app source must include approved public copy: ${line}`);
});
assert(appSource.includes("Тест эхлэх"), "landing CTA must use short test start wording");
assert(!appSource.includes(OLD_PRIMARY_CTA), "old landing CTA wording must be absent");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

const landingHtml = _internal.renderLanding();
const landing = normalize(landingHtml);
assert(landing.includes(PRODUCT_NAME), "landing must render official product name");
PUBLIC_COPY.forEach(line => {
  assert(landing.includes(line), `landing must render approved public copy: ${line}`);
});
assert(landing.includes("Тест эхлэх"), "landing must render updated CTA");
assert(!landing.includes(OLD_PRIMARY_CTA), "landing must not render old CTA");
assert(!landing.includes("Яагаад хичээсэн ч жин буурахгүй байна вэ?"), "old hero headline must be removed");
assert(!landing.includes("Миний зураглалыг эхлүүлэх"), "old hero CTA must be removed");
assertCopySafe(landingHtml, "landing");

console.log("product-name-public-copy tests passed");
