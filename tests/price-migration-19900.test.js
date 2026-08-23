"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const catalog = require("../product-config.js");
const backend = require("../netlify/functions/_lib/config.js");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

assert.equal(catalog.PRODUCT.amount, 19900);
assert.equal(catalog.PRODUCT.displayPrice, "19,900₮");
assert.equal(catalog.PRODUCT.priceVersion, "p19900_v1");
assert.deepEqual(catalog.LEGACY_FULL_REPORT_PRICES_MNT, [9900, 39000]);
assert.deepEqual(catalog.SUPPORTED_FULL_REPORT_PRICES_MNT, [9900, 39000, 19900]);
assert.equal(backend.PRODUCT, catalog.PRODUCT, "frontend and backend must import one price authority");

const analytics = read("netlify/functions/analytics-collect.js");
assert.match(analytics, /amountMnt: PRODUCT\.amount/);
assert.match(analytics, /offerPriceMnt: PRODUCT\.amount/);
assert.match(analytics, /priceVersion: PRODUCT\.priceVersion/);
const store = read("netlify/functions/_lib/store.js");
assert.match(store, /action: "get_offer_price_measurement", start_date: startDate, end_date: endDate, utm_content: utmContent/);
assert.match(store, /action: "record_p19900_cutover", effective_at: effectiveAt/);

const migration = read("supabase/migrations/20260823074841_full_report_price_19900.sql");
assert.match(migration, /amount in \(9900, 19900, 39000\)/);
assert.match(migration, /record_p19900_cutover/);
assert.match(migration, /get_offer_price_measurement/);
assert.doesNotMatch(migration, /update\s+jingeehas\.payments/i, "expand-only migration must not rewrite payment history");
assert.doesNotMatch(migration, /update\s+jingeehas\.entitlements/i, "migration must not rewrite entitlements");

console.log("19,900 MNT price authority and expand-only migration tests passed");
