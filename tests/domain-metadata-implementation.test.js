const assert = require("assert");
const fs = require("fs");

const indexHtml = fs.readFileSync("index.html", "utf8");
const appSource = fs.readFileSync("app.js", "utf8");

const CURRENT_NETLIFY_URL = "https://clever-souffle-1e5f74.netlify.app";

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

function linkHref(html, relPattern) {
  const refs = [];
  const linkPattern = /<link\s+[^>]*>/gi;
  const hrefPattern = /\shref=["']([^"']+)["']/i;
  const relMatcher = new RegExp(`\\srel=["'][^"']*${relPattern}[^"']*["']`, "i");
  let match;
  while ((match = linkPattern.exec(String(html)))) {
    if (!relMatcher.test(match[0])) continue;
    const hrefMatch = match[0].match(hrefPattern);
    if (hrefMatch) refs.push(hrefMatch[1]);
  }
  return refs;
}

function assertMetadataCopySafe(value, label) {
  const text = String(value || "").toLowerCase();
  [
    "оношилгоо",
    "эмчилгээ",
    "баталгаатай",
    "баталгаатай турна",
    "хатуу дэглэм",
    "сахилгагүй",
    "limited seats",
    "fake urgency",
    "fake scarcity",
    "хязгаарлагдмал суудал",
    "сүүлийн боломж",
    "яг одоо авахгүй бол"
  ].forEach(term => {
    assert(!text.includes(term.toLowerCase()), `${label}: forbidden metadata wording present: ${term}`);
  });
}

const title = tagContent(indexHtml, "title");
const description = metaContent(indexHtml, "description");
const ogTitle = metaContent(indexHtml, "og:title");
const ogDescription = metaContent(indexHtml, "og:description");
const ogType = metaContent(indexHtml, "og:type");
const twitterCard = metaContent(indexHtml, "twitter:card");
const twitterTitle = metaContent(indexHtml, "twitter:title");
const twitterDescription = metaContent(indexHtml, "twitter:description");
const themeColor = metaContent(indexHtml, "theme-color");

assert.strictEqual(title, "Жин хасалтын гүн зураглал", "public title must remain present");
assert(description, "meta description must exist");
assert(ogTitle, "Open Graph title must exist");
assert(ogDescription, "Open Graph description must exist");
assert.strictEqual(ogType, "website", "Open Graph type must be website");
assert.strictEqual(twitterCard, "summary", "Twitter card metadata must exist");
assert(twitterTitle, "Twitter title must exist");
assert(twitterDescription, "Twitter description must exist");
assert(themeColor, "theme color metadata must exist");

assert.strictEqual(ogTitle, title, "Open Graph title must match public title");
assert.strictEqual(twitterTitle, title, "Twitter title must match public title");
assert.strictEqual(ogDescription, description, "Open Graph description must match meta description");
assert.strictEqual(twitterDescription, description, "Twitter description must match meta description");

[
  ["title", title],
  ["meta description", description],
  ["Open Graph title", ogTitle],
  ["Open Graph description", ogDescription],
  ["Open Graph type", ogType],
  ["Twitter card", twitterCard],
  ["Twitter title", twitterTitle],
  ["Twitter description", twitterDescription]
].forEach(([label, value]) => assertMetadataCopySafe(value, label));

const metadataBlock = [
  title,
  description,
  ogTitle,
  ogDescription,
  ogType,
  twitterCard,
  twitterTitle,
  twitterDescription,
  themeColor
].join("\n");

assert(!metadataBlock.includes(CURRENT_NETLIFY_URL), "metadata must not hardcode the current Netlify production URL");
assert(!metaContent(indexHtml, "og:url"), "Open Graph URL must remain absent until owner approves a custom domain");
assert.strictEqual(linkHref(indexHtml, "icon").length, 0, "favicon/icon references must stay absent when no asset exists");

assert(indexHtml.includes('<link rel="stylesheet" href="styles.css" />'), "stylesheet reference must remain relative");
assert(indexHtml.includes('<script src="mockBackend.js"></script>'), "mock backend script reference must remain relative");
assert(indexHtml.includes('<script src="app.js"></script>'), "app script reference must remain relative");

assert(appSource.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "prototype guard must remain false");
assert(appSource.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;"), "runtime visible integration guard must remain true");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "9,900₮"'), "one-time anchor price label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach price label must remain unchanged");
assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged");
assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged");
assert(appSource.includes('upgrade: "19,900₮"'), "upgrade price label must remain unchanged");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain unchanged");
assert(appSource.includes("const COACH_WEIGHT_PRICE_MNT = 9900;"), "coach price constant must remain unchanged");
assert(appSource.includes("const COACH_COMMISSION_MNT = 4000;"), "coach commission constant must remain unchanged");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

console.log("domain-metadata-implementation tests passed");
