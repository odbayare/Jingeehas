const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const indexHtml = fs.readFileSync("index.html", "utf8");
const mockBackendSource = fs.readFileSync("mockBackend.js", "utf8");

const CURRENT_NETLIFY_URL = "https://clever-souffle-1e5f74.netlify.app";

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function htmlTagContent(html, tagName) {
  const match = String(html).match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1].trim() : "";
}

function metaContent(html, name) {
  const matcher = new RegExp(
    `<meta\\s+[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = String(html).match(matcher);
  return match ? match[1].trim() : "";
}

function linkRefs(html, relPattern) {
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

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    qpayPayment: {
      status: "idle",
      message: "",
      invoice: null
    },
    currentAssessmentId: null,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageVoiceSummaries: {},
    removedEntries: [],
    ...overrides
  });
}

function assertNoTerms(text, terms, label) {
  const normalized = normalize(text).toLowerCase();
  terms.forEach(term => {
    assert(!normalized.includes(term.toLowerCase()), `${label}: forbidden public term present: ${term}`);
  });
}

function withLocalStorageMutationSpy(fn) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(global, "localStorage");
  const calls = [];

  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: {
      getItem(key) {
        calls.push(["getItem", key]);
        return null;
      },
      setItem(key, value) {
        calls.push(["setItem", key, value]);
      },
      removeItem(key) {
        calls.push(["removeItem", key]);
      }
    }
  });

  try {
    fn();
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(global, "localStorage", originalDescriptor);
    } else {
      delete global.localStorage;
    }
  }

  assert.deepStrictEqual(
    calls.filter(([method]) => method === "setItem" || method === "removeItem"),
    [],
    "domain/branding readiness render path must not mutate localStorage"
  );
}

const title = htmlTagContent(indexHtml, "title");
const metaDescription = metaContent(indexHtml, "description");
const ogTitle = metaContent(indexHtml, "og:title");
const ogDescription = metaContent(indexHtml, "og:description");
const ogUrl = metaContent(indexHtml, "og:url");
const iconRefs = linkRefs(indexHtml, "icon");
const officialProductName = "Илүүдэл жингээс салах тест үнэлгээ";
const missingBrandingMetadata = [
  !metaDescription && "meta description",
  !ogTitle && "Open Graph title",
  !ogDescription && "Open Graph description",
  !ogUrl && "Open Graph URL",
  iconRefs.length === 0 && "favicon/icon reference"
].filter(Boolean);

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");
assert(appSource.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "source prototype guard must remain false");
assert(appSource.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;"), "source runtime visible integration guard must remain true");

assert.strictEqual(title, officialProductName, "current public title must use official product name");
assert.strictEqual(ogTitle, officialProductName, "Open Graph title must use official product name");
assert(metaDescription, "meta description must be present");
assert(ogDescription, "Open Graph description must be present");
assert(missingBrandingMetadata.includes("Open Graph URL"), "missing Open Graph URL must be explicitly recorded");
assert(missingBrandingMetadata.includes("favicon/icon reference"), "missing favicon/icon reference must be explicitly recorded");

assert(!indexHtml.includes(CURRENT_NETLIFY_URL), "public HTML must not hardcode the current Netlify deploy URL");
assert(!appSource.includes(CURRENT_NETLIFY_URL), "app source must not hardcode the current Netlify deploy URL in public copy");
assert(!mockBackendSource.includes(CURRENT_NETLIFY_URL), "mock backend must not hardcode the current Netlify deploy URL");

assert(indexHtml.includes('<main id="app" class="app-shell"></main>'), "public app shell must remain domain-neutral");
assert(indexHtml.includes('<link rel="stylesheet" href="styles.css" />'), "stylesheet reference must remain relative for custom domain readiness");
assert(indexHtml.includes('<script src="mockBackend.js"></script>'), "mock backend script reference must remain relative for custom domain readiness");
assert(indexHtml.includes('<script src="app.js"></script>'), "app script reference must remain relative for custom domain readiness");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "9,900₮"'), "one-time anchor price label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach price label must remain unchanged");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain unchanged");
assert(appSource.includes("const COACH_WEIGHT_PRICE_MNT = 9900;"), "coach price constant must remain unchanged");
assert(appSource.includes("const COACH_COMMISSION_MNT = 4000;"), "coach commission constant must remain unchanged");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "QPay product code must remain unchanged");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("return state.coachDiscountConsent && state.coachInvite ? COACH_WEIGHT_PRICE_MNT : STANDARD_WEIGHT_PRICE_MNT;"), "current one-time amount helper must remain unchanged");
assert(appSource.includes("return Boolean(isQaPaymentBypassEnabled() || isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === \"paid\" || access.hasOneTimeReportAccess);"), "one-time access helper source must keep paid-state and entitlement guards");

assertNoTerms(indexHtml, ["internalDiagnostics", "ownerDebug", "runtimeGate", "fixtureName"], "public HTML");
assertNoTerms(indexHtml, ["хатуу дэглэм", "сахилгагүй", "оношилгоо", "эмчилгээ"], "public HTML");

withLocalStorageMutationSpy(() => {
  setOneTime();
  const unpaidHtml = _internal.renderReport();
  assertNoTerms(unpaidHtml, ["internalDiagnostics", "ownerDebug", "runtimeGate", "fixtureName"], "unpaid report output");
  assertNoTerms(unpaidHtml, ["хатуу дэглэм", "сахилгагүй", "оношилгоо", "эмчилгээ"], "unpaid report output");
  assert(!unpaidHtml.includes(CURRENT_NETLIFY_URL), "unpaid report output must not hardcode the current Netlify deploy URL");

  setOneTime({ oneTimePaid: true });
  const paidHtml = _internal.renderReport();
  assertNoTerms(paidHtml, ["internalDiagnostics", "ownerDebug", "runtimeGate", "fixtureName"], "paid report output");
  assertNoTerms(paidHtml, ["хатуу дэглэм", "сахилгагүй", "оношилгоо", "эмчилгээ"], "paid report output");
  assert(!paidHtml.includes(CURRENT_NETLIFY_URL), "paid report output must not hardcode the current Netlify deploy URL");
});

console.log("domain-branding-readiness tests passed");
