"use strict";

(function publishPriceCatalog() {

const FULL_REPORT_PRICE_MNT = 19900;
const FULL_REPORT_PRICE_VERSION = "p19900_v1";
const LEGACY_FULL_REPORT_PRICES_MNT = Object.freeze([9900, 39000]);
const SUPPORTED_FULL_REPORT_PRICES_MNT = Object.freeze([
  ...LEGACY_FULL_REPORT_PRICES_MNT,
  FULL_REPORT_PRICE_MNT
]);
const PRODUCT = Object.freeze({
  name: "Жингээ Хас — хувийн бүрэн тайлан",
  code: "WEIGHT_TEST_ONE_TIME",
  amount: FULL_REPORT_PRICE_MNT,
  displayPrice: "19,900₮",
  priceVersion: FULL_REPORT_PRICE_VERSION
});

const catalog = Object.freeze({
  FULL_REPORT_PRICE_MNT,
  FULL_REPORT_PRICE_VERSION,
  LEGACY_FULL_REPORT_PRICES_MNT,
  SUPPORTED_FULL_REPORT_PRICES_MNT,
  PRODUCT
});

if (typeof module !== "undefined" && module.exports) module.exports = catalog;
if (typeof globalThis !== "undefined") globalThis.JINGEEHAS_PRODUCT_CONFIG = catalog;
})();
