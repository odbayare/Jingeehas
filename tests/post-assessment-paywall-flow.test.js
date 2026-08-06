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
  assert(landing.includes("Тестээ үнэгүй эхлүүлэх"), "landing free-test promise is missing");
  assert(!landing.includes("төлөөд тестээ эхлүүлэх"), "landing still advertises payment before the test");

  const start = app.renderForPath("/assessment/start");
  assert(start.includes("Тестээ эхлүүлэх"));
  for (const forbidden of ["9,900₮", "QPay", "Нэхэмжлэл", "картын мэдээлэл"]) {
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
    payment: { status: "idle" },
    busy: false,
    report: null
  });
  const paywall = app.renderForPath("/assessment/result");
  for (const expected of [
    "Тест дууслаа",
    "Таны хариултад тулгуурласан бүрэн тайлан бэлэн",
    "Төлбөр хийхээс өмнө мэдэх зүйлс",
    "Тайлан зөвхөн таны тестийн хариултаар дэмжигдсэн мэдээлэлд тулгуурлана.",
    "Захиалга болон автоматаар сунгалт байхгүй.",
    "QPay төлбөр баталгаажмагц бүрэн тайлан шууд нээгдэнэ.",
    "Та тестээ аль хэдийн бүрэн дуусгасан.",
    "Бүрэн тайлангаа нээх — 9,900₮"
  ]) assert(paywall.includes(expected), `post-assessment trust copy missing: ${expected}`);
  assert(paywall.includes("Тод хэв маяг илрээгүй бол зохиомол асуудал нэмэхгүй"), "neutral-safe trust message is missing");
  for (const forbidden of [
    "QPay-аар 9,900₮ төлөөд тестээ эхлүүлэх",
    "Төлбөр баталгаажсаны дараа тест нээгдэнэ",
    "хэдэн сэтгэлзүйн болон зан үйлийн хэв маяг"
  ]) assert(!paywall.includes(forbidden), `prepaid or unconditional claim remains on paywall: ${forbidden}`);

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
  console.log("post-assessment paywall and stale-session isolation tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
