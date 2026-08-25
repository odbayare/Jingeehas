"use strict";
const assert = require("node:assert/strict");
const app = require("../app.js");

app._test.setComingSoon(false);
app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment", payment: {
  status: "pending", qrImage: "dynamic-qr-image", expiresAt: "2026-07-19T15:52:45.000+08:00", urls: [
    { name: "Khan bank", description: "Хаан банк", logo: "https://qpay.mn/q/logo/khanbank.png", link: "khanbank://q?qPay_QRcode=test" },
    { name: "Logo fallback", description: "Тест банк", logo: "", link: "testbank://q?invoice=test" }
  ]
} });
const linkedPaymentPage = app.renderForPath("/assessment/payment");
assert(linkedPaymentPage.includes("Банкны апп-аар төлөх"));
assert(linkedPaymentPage.includes("Хаан банк"));
assert(linkedPaymentPage.includes("https://qpay.mn/q/logo/khanbank.png"));
assert(linkedPaymentPage.includes("khanbank://q?qPay_QRcode=test"));
assert(linkedPaymentPage.includes("qpay-app-logo-fallback"));
assert(linkedPaymentPage.includes("data:image/png;base64,dynamic-qr-image"));
assert(linkedPaymentPage.indexOf("qpay-app-section") < linkedPaymentPage.indexOf("qpay-qr-section"), "mobile-first DOM order keeps bank apps before QR");

app._test.setState({ ownerPreview: true, assessmentStatus: "complete", assessmentId: "test-assessment", payment: {
  status: "paid", qrImage: "dynamic-qr-image", urls: [{ name: "Hidden", link: "hidden://pay" }]
} });
const paidPage = app.renderForPath("/assessment/payment");
assert(!paidPage.includes("qpay-app-section"));
assert(!paidPage.includes("dynamic-qr-image"));
console.log("QPay deeplink UI tests passed");
