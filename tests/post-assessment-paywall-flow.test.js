"use strict";

process.env.NODE_ENV = "test";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { createAssessment } = require("../netlify/functions/_lib/assessment.js");
const { FREE_POSTPAID_FLOW, nextRoute } = require("../netlify/functions/_lib/commercial-flow.js");

const distAppPath = path.join(__dirname, "..", "dist", "app.js");
const app = require(distAppPath);
const appSource = fs.readFileSync(distAppPath, "utf8");

(async () => {
  app._test.setComingSoon(false);

  const landing = app.renderForPath("/");
  assert(landing.includes('href="/assessment/start"'), "landing CTA must open the free assessment start route");
  assert(landing.includes("ТЕСТЭЭ ЭХЛҮҮЛЭХ"), "landing free-test CTA is missing");
  assert(!landing.includes("төлөөд тестээ эхлүүлэх"), "landing still advertises payment before the test");

  const start = app.renderForPath("/assessment/start");
  assert(start.includes("Тестээ эхлүүлэх"));
  for (const forbidden of ["39,000₮", "QPay", "Нэхэмжлэл", "картын мэдээлэл"]) {
    assert(!start.includes(forbidden), `pre-test payment copy leaked into start screen: ${forbidden}`);
  }

  const retiredContact = app.renderForPath("/assessment/contact");
  assert(retiredContact.includes("Тестийн өмнө төлбөр шаардахгүй"), "historical payment-first route is not retired");
  assert(retiredContact.includes("Тестээ үнэгүй эхлүүлэх"));
  assert(!retiredContact.includes('id="contact-form"'), "payment-first contact form remains public");
  assert(!retiredContact.includes("төлөөд тестээ эхлүүлэх"), "payment-first CTA remains public");

  const startIndex = appSource.indexOf("async function startFreeAssessment(form)");
  const submitContactIndex = appSource.indexOf("async function submitContact(form)", startIndex);
  assert(startIndex >= 0 && submitContactIndex > startIndex, "deployed free-start function is missing");
  const startFreeSource = appSource.slice(startIndex, submitContactIndex);
  assert(startFreeSource.includes('restored.assessment?.commercialFlowVersion === "free_assessment_postpaid_v1"'), "free start does not scope session resume to the current free flow");
  assert(!startFreeSource.includes("if (restored.assessment) {"), "any historical assessment can still hijack free start");
  assert(startFreeSource.includes('assessment.status === "complete"'), "completed free assessment resume is not handled safely");

  app._test.setState({
    assessmentStatus: "complete",
    commercialFlowVersion: FREE_POSTPAID_FLOW,
    initialResult: {
      mode: "summary",
      patternCount: 4,
      interactionCount: 2,
      primaryPattern: { title: "SECRET_PATTERN", condition: "SECRET_CONDITION", explanation: "SECRET_REASON" },
      lockedSections: ["SECRET_SECTION"]
    },
    resultEmail: { skipped: true, saved: false, error: "" },
    payment: { status: "idle" },
    busy: false,
    report: null
  });
  const paywall = app.renderForPath("/assessment/result");
  for (const expected of [
    "ТЕСТ ДУУСЛАА",
    "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо",
    "Тестийн хариултуудыг тань нэгтгэн, жин хасах төлөвлөгөөгөө дагахад ямар нөхцөл хүндрэл үүсгэж болох, өөр дээрээ юуг анзаарах, юунаас эхлэхийг бүрэн тайланд харуулна.",
    "Бүрэн тайлангаас та:",
    "Таны хариултаас юу хамгийн тод ажиглагдсаныг",
    "Ямар нөхцөлд хүндрэл нэмэгдэж болох, хэд хэдэн хэв маяг зэрэг ажиглагдсан бол тэдгээрийн уялдаа холбоог",
    "Өөр дээрээ юу ажиглаж, ямар алхмаас эхэлж болохыг харна",
    "ТАНЫ ХУВИЙН БҮРЭН ТАЙЛАН",
    "39,000₮",
    "Нэг удаагийн төлбөр",
    "БҮРЭН ТАЙЛАНГАА НЭЭХ",
    "QPay · Төлбөр баталгаажмагц бүрэн тайлан нээгдэнэ",
    "Тайлангийн агуулгыг таны өгсөн хариултад тулгуурлан бүрдүүлнэ. Тод хэв маяг ажиглагдаагүй бол зохиомол дүгнэлт нэмэхгүй.",
    "Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.",
    "Жингээ Хас",
    "Төлбөрийн тусламж"
  ]) assert(paywall.includes(expected), `sealed post-assessment copy missing: ${expected}`);
  for (const forbidden of [
    "4 хэв маяг",
    "2 чухал уялдаа холбоо",
    "SECRET_PATTERN",
    "SECRET_CONDITION",
    "SECRET_REASON",
    "SECRET_SECTION",
    "Та нэг аяга кофены үнээр",
    "Бүрэн тайлангаа нээх — 39,000₮",
    ">Нүүр<",
    ">Тестийн тухай<",
    ">Тайлан сэргээх<",
    "Төлбөр баталгаажсаны дараа тест нээгдэнэ"
  ]) assert(!paywall.includes(forbidden), `personal insight or prepaid copy leaked into paywall: ${forbidden}`);

  app._test.setState({
    assessmentStatus: "complete",
    commercialFlowVersion: FREE_POSTPAID_FLOW,
    payment: { status: "paid" },
    busy: false
  });
  const paidScreen = app.renderForPath("/assessment/payment");
  assert(paidScreen.includes("Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."), "postpaid confirmation does not identify the full report");
  assert(!paidScreen.includes("Төлбөр баталгаажлаа. Тест нээгдлээ."), "prepaid confirmation leaked into postpaid payment screen");

  const database = new MemoryDatabaseAdapter();
  const now = new Date("2026-08-06T06:00:00.000Z");
  await database.insert("sessions", {
    id: "ws-flow-cutover",
    tokenHash: "hash",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 3600000).toISOString(),
    revokedAt: null
  });
  const historicalPrepaid = await createAssessment(database, "ws-flow-cutover", { prepaid: true }, now);
  const freeAssessment = await createAssessment(database, "ws-flow-cutover", { flowVersion: FREE_POSTPAID_FLOW }, new Date(now.getTime() + 1000));
  assert.equal(historicalPrepaid.commercialFlowVersion, "prepaid_v2");
  assert.equal(await nextRoute(database, historicalPrepaid), "/assessment/payment");
  assert.equal(freeAssessment.commercialFlowVersion, FREE_POSTPAID_FLOW);
  assert.equal(freeAssessment.status, "draft");
  assert.notEqual(freeAssessment.id, historicalPrepaid.id, "historical prepaid assessment was reused as the free assessment");
  assert.equal(await nextRoute(database, freeAssessment), "/assessment/questions");

  app._test.resetComingSoon();
  console.log("sealed post-assessment paywall and stale-session isolation tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
