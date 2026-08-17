"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { evaluateSafetyGate, ROUTE_COPY } = require("../../netlify/functions/_lib/safety.js");
const questions = require("../../questions.js");
const cohort = require("../fixtures/virtual-cohort-v2.js");
const { buildEvidence, buildFullReport, publicReport } = require("../../netlify/functions/_lib/report.js");
const root = path.resolve(__dirname, "../..");
const stats = {
  qpayCreate: 0,
  qpayCheck: 0,
  assessmentCreate: 0,
  assessmentSave: 0,
  assessmentComplete: 0,
  initialResult: 0,
  resultEmailSave: 0,
  paymentRows: 0,
  sessionStart: 0,
  safetyGate: 0,
  analyticsCollect: 0,
  questionProgressRows: 0
};
const recordedQuestionProgress = new Set();
const questionProgressRows = Array.from({ length: 8 }, (_, index) => {
  const activeAtQuestionCount = index === 7 ? 1 : 0;
  const liveReachedCount = index === 7 ? 1 : 6;
  const backfillReachedCount = index === 7 ? 5 : 2;
  const dropoffEligibleCount = Math.max(liveReachedCount - activeAtQuestionCount, 0);
  const confirmedStoppedCount = index === 7 ? 0 : Math.max(1, 5 - index);
  return { questionId: `Q-${index + 1}`, questionnaireVersion: "jingeehas-production-2026-07",
    sectionKey: "baseline", sectionLabel: "Суурь мэдээлэл", analyticsLabel: `Богино нэр ${index + 1}`, questionOrder: index + 1,
    totalReachedCount: liveReachedCount + backfillReachedCount, totalAnsweredCount: liveReachedCount + backfillReachedCount - 1,
    liveReachedCount, backfillReachedCount, activeAtQuestionCount, confirmedStoppedCount, dropoffEligibleCount,
    confirmedDropoffRate: dropoffEligibleCount ? confirmedStoppedCount / dropoffEligibleCount : null,
    reachedCount: liveReachedCount + backfillReachedCount, answeredCount: liveReachedCount + backfillReachedCount - 1,
    activeCount: activeAtQuestionCount, stoppedCount: confirmedStoppedCount,
    dropoffRate: dropoffEligibleCount ? confirmedStoppedCount / dropoffEligibleCount : null };
});
let assessmentExists = false;
let assessmentStatus = "";
let paymentStatus = "";
let entitled = false;
let savedAnswers = {};
let flowMode = "pattern";
function resetFlowState() {
  for (const key of Object.keys(stats)) stats[key] = 0;
  recordedQuestionProgress.clear();
  assessmentExists = false;
  assessmentStatus = "";
  paymentStatus = "";
  entitled = false;
  savedAnswers = {};
  flowMode = "pattern";
}
const initialResult = {
  mode: "summary",
  patternCount: 3,
  interactionCount: 1,
  lockedSections: [
    "Танд нөлөөлж буй хэв маягууд",
    "Хэв маягуудын уялдаа холбоо",
    "Ямар үед илүү хүчтэй болдог",
    "Сэтгэлзүйн хэв маягаа хэрхэн удирдах вэ?",
    "Хэцүү үеийг хэрхэн даван туулах вэ?",
    "Эхэлж хэрэгжүүлэх 3 алхам",
    "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?"
  ],
  price: 39000,
  currency: "MNT"
};
const neutralInitialResult = {
  mode: "neutral",
  patternCount: 0,
  interactionCount: 0,
  lockedSections: initialResult.lockedSections,
  price: 39000,
  currency: "MNT"
};
const singleInitialResult = { ...initialResult, patternCount: 1, interactionCount: 0 };
const fullReport = { productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: "2026-07-16T00:00:00.000Z", mode: "sufficient", coverage: "Тайлбарын үндэслэл: 8 өөр асуултын хариулт", sections: [{ title: "1. Таны хамгийн тод ажиглагдсан хэв маяг", body: "Хооллох хэмнэлтэй холбоотой ажиглалт давтагдсан байна." }], experiment: { variable: "хооллох хэмнэл", action: "Нэг сонголтоо урьдчилж тогтооно.", observe: "Өлсөх мэдрэмжээ ажиглана.", keepConstant: "Бусад зүйлээ өөрчлөхгүй." } };
const cohortReports = Object.fromEntries(cohort.filter(profile => ["VU-03", "VU-06"].includes(profile.id)).map(profile => {
  const linkedLongestMethod = profile.answers["Q-METHOD-LONGEST"] || questions.autoLinkedLongestMethod(profile.answers);
  const evidence = buildEvidence(Object.entries(profile.answers).map(([questionId, value]) => ({ questionId, value })), [], { questionnaireVersion: questions.QUESTIONNAIRE_VERSION, linkedLongestMethod });
  return [profile.id, publicReport(buildFullReport(evidence, new Date("2026-07-18T06:00:00.000Z"), { questionnaireVersion: questions.QUESTIONNAIRE_VERSION }))];
}));
function selectedReport(request) {
  const match = String(request.headers.cookie || "").match(/(?:^|;\s*)jingeehas_cohort=(VU-0[36])/);
  return cohortReports[match?.[1]] || fullReport;
}
function json(response, status, body, headers = {}) { response.writeHead(status, { "content-type": "application/json", ...headers }); response.end(JSON.stringify(body)); }
function readBody(request) { return new Promise(resolve => { let raw = ""; request.on("data", chunk => { raw += chunk; }); request.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch { resolve({}); } }); }); }
const endpoints = {
  "analytics-collect": async (_body, response) => { stats.analyticsCollect += 1; json(response, 202, { accepted: true, recorded: true }); },
  "admin-login": async (_body, response) => json(response, 200, { adminId: "owner-e2e", owner: true }, { "set-cookie": "jingeehas_admin=admin-e2e; Path=/; HttpOnly; Secure; SameSite=Strict" }),
  "admin-session-state": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") ? json(response, 200, { authenticated: true, owner: true }) : json(response, 401, { error: "unauthorized" }),
  "admin-report-regeneration-candidates": async (_body, response) => json(response, 200, { candidates: [], reportEngineVersion: "test", reportSchemaVersion: "test", generationReason: "test" }),
  "admin-analytics-daily": async (_body, response) => {
    const conversion = (entryCount, convertedCount) => ({ entryCount, convertedCount, rate: entryCount ? convertedCount / entryCount : null, status: entryCount ? "available" : "unavailable", reason: entryCount ? null : "zero_denominator" });
    const currentFlow = {
      eligibleVisitors: 10,
      assessmentsStarted: 8,
      assessmentsCompleted: 6,
      initialResultsViewed: 6,
      emailsSaved: 3,
      fullReportCtaClicks: 4,
      invoicesCreated: 4,
      paymentsConfirmed: 3,
      reportsOpened: 3,
      revenueMnt: 29700
    };
    json(response, 200, {
      timeZone: "Asia/Ulaanbaatar",
      days: [{ date: "2026-07-19", uniqueVisitors: 10, ...currentFlow }],
      currentFlow,
      priorCurrentFlow: {},
      prepaidFlow: { assessmentsStarted: 2, assessmentsCompleted: 2, invoicesCreated: 2, paymentsConfirmed: 2, reportsOpened: 2, revenueMnt: 19800 },
      legacyFlow: { assessmentsStarted: 0, assessmentsCompleted: 0, invoicesCreated: 0, paymentsConfirmed: 0, reportsOpened: 0, revenueMnt: 0 },
      allFlows: { uniqueVisitors: 10 },
      campaignAttribution: { rows: [{ utmSource: "meta", utmMedium: "paid_social", utmCampaign: "jingeehas_traffic_lpv_reel_v1",
        utmContent: "paid_cut_v1_lpv", utmTerm: "broad_25plus", unattributed: false, visitors: 6, assessmentsStarted: 5,
        assessmentsCompleted: 4, paywallViews: 4, fullReportCtaClicks: 3, invoicesCreated: 3, paymentsConfirmed: 2,
        reportsOpened: 2, revenueMnt: 19800 }, { utmSource: null, utmMedium: null, utmCampaign: null, utmContent: null,
        utmTerm: null, unattributed: true, visitors: 4, assessmentsStarted: 3, assessmentsCompleted: 2, paywallViews: 2,
        fullReportCtaClicks: 1, invoicesCreated: 1, paymentsConfirmed: 1, reportsOpened: 1, revenueMnt: 9900 }],
        excluded: { eventCount: 4, paymentCount: 1, revenueMnt: 9900 } },
      conversions: {
        visitorToAssessmentStart: conversion(10, 8),
        assessmentStartToComplete: conversion(8, 6),
        completeToInitialResult: conversion(6, 6),
        initialResultToEmail: conversion(6, 3),
        initialResultToFullReportCta: conversion(6, 4),
        fullReportCtaToInvoice: conversion(4, 4),
        invoiceToPayment: conversion(4, 3),
        paymentToFullReportOpen: conversion(3, 3)
      },
      coverage: {
        freeFlowCutoverAt: "2026-07-31T00:00:00.000Z",
        allMeasuredVisitors: 10,
        freeFlowEligibleVisitors: 10,
        legacyActivityPresent: false,
        prepaidActivityPresent: true,
        flowState: "mixed"
      }
    });
  },
  "admin-question-progress": async (_body, response) => json(response, 200, { timeZone: "Asia/Ulaanbaatar", summary: { cohortStarted: 7, coveredAssessments: 6,
    coverageRate: 6 / 7, averageQuestionsReached: 18, completedCount: 2, completionRate: 2 / 7, activeInProgressCount: 1,
    liveProgressAssessments: 5, backfillOnlyAssessments: 1,
    topStopQuestionId: "Q-1", topStopLabel: "Өмнө туршсан арга", topStopCount: 5, instrumentationStartedAt: "2026-07-21T00:00:00Z" }, questions: questionProgressRows }),
  "admin-preview-start": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") ? json(response, 201, { active: true, expiresAt: "2026-07-17T14:00:00.000Z", resumeDraft: false }, { "set-cookie": "jingeehas_owner_preview=preview-e2e; Path=/; HttpOnly; Secure; SameSite=Strict" }) : json(response, 401, { error: "unauthorized" }),
  "admin-preview-status": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") && String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e") ? json(response, 200, { active: true, expiresAt: "2026-07-17T14:00:00.000Z" }) : json(response, 401, { error: "preview_required" }),
  "weight-session-start": async (_body, response) => { stats.sessionStart += 1; json(response, 201, { sessionId: "ws-e2e", resumed: false }, { "set-cookie": "jingeehas_session=e2e; Path=/; HttpOnly; SameSite=Lax" }); },
  "weight-safety-gate": async (body, response) => { stats.safetyGate += 1; const result = evaluateSafetyGate(body); json(response, 200, { safetyCheckId: "sc-e2e", ...result, guidance: result.route === "eligible" ? null : ROUTE_COPY[result.route] }); },
  "weight-recovery-contact-save": async (_body, response) => stats.sessionStart > 0 ? json(response, 201, { contactGroupId: "rcg-e2e" }) : json(response, 401, { error: "unauthorized" }),
  "weight-assessment-create": async (_body, response, request) => {
    const previewBypass = String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e");
    if (!assessmentExists) {
      assessmentExists = true;
      assessmentStatus = "draft";
      stats.assessmentCreate += 1;
    }
    json(response, 201, {
      assessmentId: previewBypass ? "wa-owner-e2e" : "wa-e2e",
      status: assessmentStatus,
      commercialFlowVersion: "free_assessment_postpaid_v1",
      questionnaireVersion: questions.QUESTIONNAIRE_VERSION,
      previewBypass
    });
  },
  "qpay-create-invoice": async (_body, response) => {
    if (!assessmentExists || assessmentStatus !== "complete") return json(response, 409, { error: "assessment_incomplete" });
    if (flowMode === "safety") return json(response, 409, { error: "safety_route" });
    if (!stats.paymentRows) {
      stats.qpayCreate += 1;
      stats.paymentRows += 1;
    }
    paymentStatus = "pending";
    json(response, 200, { paymentId: "wp-e2e", assessmentId: "wa-e2e", productCode: "WEIGHT_TEST_ONE_TIME", amount: 39000, status: "pending", expiresAt: "2027-07-21T12:30:00.000Z", qrText: "qr", qrImage: "", urls: [{ name: "Банкны апп", link: "https://example.com/qpay-e2e" }] });
  },
  "qpay-check-payment": async (_body, response) => {
    stats.qpayCheck += 1;
    paymentStatus = "paid";
    entitled = true;
    json(response, 200, { paymentId: "wp-e2e", assessmentId: "wa-e2e", productCode: "WEIGHT_TEST_ONE_TIME", amount: 39000, status: "paid", entitlement: true, nextRoute: "/report" });
  },
  "weight-assessment-questions": async (_body, response, request) => { assessmentStatus = "in_progress"; const preview = String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e"); json(response, 200, { assessmentId: preview ? "wa-owner-e2e" : "wa-e2e", status: assessmentStatus, startedAt: "2026-07-21T08:00:00.000Z", questionnaireVersion: questions.QUESTIONNAIRE_VERSION }); },
  "weight-assessment-save": async (body, response) => {
    stats.assessmentSave += 1;
    const ids = Object.keys(body.answers || {});
    savedAnswers = { ...savedAnswers, ...(body.answers || {}) };
    await new Promise(resolve => setTimeout(resolve, ids.includes("Q-AGE") ? 250 : 20));
    json(response, 200, { assessmentId: "wa-e2e", status: "in_progress", savedQuestionIds: ids });
  },
  "weight-question-progress": async (body, response) => {
    if (assessmentStatus !== "in_progress") return json(response, 402, { error: "payment_required" });
    recordedQuestionProgress.add(`${body.assessmentId}:${body.questionId}`); stats.questionProgressRows = recordedQuestionProgress.size;
    return json(response, 200, { recorded: true, excluded: false }); },
  "weight-assessment-complete": async (_body, response, request) => {
    stats.assessmentComplete += 1;
    assessmentStatus = "complete";
    const preview = String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e");
    const safetyRoute = flowMode === "safety" ? "professional_support" : null;
    json(response, 200, { assessmentId: preview ? "wa-owner-e2e" : "wa-e2e", status: "complete", reportMode: safetyRoute ? "safety" : "sufficient", safetyRoute, nextRoute: preview || safetyRoute ? "/report" : "/assessment/result" });
  },
  "weight-assessment-initial-result": async (_body, response) => {
    if (!assessmentExists || assessmentStatus !== "complete") return json(response, 409, { error: "assessment_incomplete" });
    if (flowMode === "safety") return json(response, 409, { error: "safety_route" });
    stats.initialResult += 1;
    json(response, 200, flowMode === "neutral" ? neutralInitialResult : flowMode === "single" ? singleInitialResult : initialResult);
  },
  "weight-result-email-save": async (_body, response) => {
    if (!assessmentExists || assessmentStatus !== "complete") return json(response, 409, { error: "assessment_incomplete" });
    stats.resultEmailSave += 1;
    json(response, 200, { saved: true });
  },
  "weight-assessment-report": async (_body, response, request) => {
    const preview = String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e");
    const directReport = String(request.headers.referer || "").includes("/report");
    const hasAccess = entitled || preview || directReport;
    if (flowMode === "safety") {
      return json(response, 200, {
        assessmentId: preview ? "wa-owner-e2e" : "wa-e2e",
        reportMode: "safety",
        safetyRoute: "professional_support",
        initialView: { guidance: { title: "Мэргэжлийн хүнтэй ярилцахыг зөвлөж байна", body: "Таны хариултад мэргэжлийн хүнтэй ярилцах шаардлагатай байж болох дохио ажиглагдлаа.", action: "Тусламж авах" } },
        fullReport: null,
        entitled: false
      });
    }
    const visibleInitial = flowMode === "neutral" ? neutralInitialResult : flowMode === "single" ? singleInitialResult : initialResult;
    json(response, 200, { assessmentId: preview ? "wa-owner-e2e" : "wa-e2e", reportMode: "sufficient", safetyRoute: null, initialView: visibleInitial, fullReport: hasAccess ? selectedReport(request) : null, entitled: hasAccess });
  },
  "weight-session-state": async (_body, response, request) => {
    const preview = String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e");
    const directReport = String(request.headers.referer || "").includes("/report");
    if (!assessmentExists && !directReport) return json(response, 200, { assessment: null, nextRoute: "/assessment/start", payment: null, answers: {}, report: null });
    if (directReport && !assessmentExists) {
      assessmentExists = true;
      assessmentStatus = "complete";
      entitled = true;
    }
    const assessmentId = preview ? "wa-owner-e2e" : "wa-e2e";
    const nextRoute = flowMode === "safety" && assessmentStatus === "complete"
      ? "/report"
      : preview && assessmentStatus === "complete"
      ? "/report"
      : entitled
        ? "/report"
        : paymentStatus === "pending"
          ? "/assessment/payment"
          : assessmentStatus === "complete"
            ? "/assessment/result"
            : ["draft", "in_progress"].includes(assessmentStatus)
              ? "/assessment/questions"
              : "/assessment/start";
    json(response, 200, {
      assessment: { assessmentId, status: assessmentStatus, safetyRoute: flowMode === "safety" ? "professional_support" : null, commercialFlowVersion: "free_assessment_postpaid_v1", questionnaireVersion: questions.QUESTIONNAIRE_VERSION },
      nextRoute,
      payment: paymentStatus ? { status: paymentStatus, paymentId: "wp-e2e", amount: 39000, productCode: "WEIGHT_TEST_ONE_TIME", expiresAt: "2027-07-21T12:30:00.000Z", qrText: "qr", qrImage: "", urls: [{ name: "Банкны апп", link: "https://example.com/qpay-e2e" }] } : null,
      answers: savedAnswers,
      report: nextRoute === "/report"
        ? flowMode === "safety"
          ? { assessmentId, reportMode: "safety", safetyRoute: "professional_support", initialView: { guidance: { title: "Мэргэжлийн хүнтэй ярилцахыг зөвлөж байна", body: "Таны хариултад мэргэжлийн хүнтэй ярилцах шаардлагатай байж болох дохио ажиглагдлаа.", action: "Тусламж авах" } }, fullReport: null, entitled: false }
          : { assessmentId, reportMode: "sufficient", safetyRoute: null, initialView: flowMode === "neutral" ? neutralInitialResult : flowMode === "single" ? singleInitialResult : initialResult, fullReport: selectedReport(request), entitled: true }
        : null
    });
  },
  "weight-recovery-request": async (_body, response) => json(response, 202, { recoveryId: "rr-e2e", message: "Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ." }),
  "weight-recovery-confirm": async (body, response) => {
    if (body.code !== "123456") return json(response, 400, { error: "invalid_recovery_code" });
    assessmentExists = true;
    assessmentStatus = "complete";
    entitled = true;
    return json(response, 200, { assessmentId: "wa-e2e", nextRoute: "/report", recovered: true }, { "set-cookie": "jingeehas_session=recovered; Path=/; HttpOnly" });
  },
  "advisor-invite-resolve": async (_body, response) => json(response, 200, { coachClientId: "ac-e2e", coachId: "adv-e2e", advisorName: "Нараа", consentStatus: "pending" }),
  "advisor-consent": async (body, response) => json(response, 200, { coachClientId: body.coachClientId, consentStatus: body.consent ? "consent_accepted" : "consent_declined" }),
  "advisor-login": async (_body, response) => json(response, 200, { coachId: "adv-e2e", name: "Нараа", forcePasswordChange: false }, { "set-cookie": "jingeehas_advisor=e2e; Path=/; HttpOnly" }),
  "advisor-dashboard": async (_body, response) => json(response, 200, { coachId: "adv-e2e", clients: [{ coachClientId: "ac-e2e", name: "Үйлчлүүлэгч", status: "Зөвшөөрсөн", assessmentId: "wa-e2e" }], totals: { clientPayments: 9900, commissionTotal: 4000, commissionPending: 4000, commissionPaid: 0 } }),
  "advisor-client-invite": async (_body, response) => json(response, 201, { coachClientId: "ac-2", inviteToken: "invite-e2e", advisorName: "Нараа" }),
  "advisor-report": async (_body, response) => json(response, 200, { assessmentId: "wa-e2e", fullReport }),
  "advisor-logout": async (_body, response) => json(response, 200, { loggedOut: true })
};
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:4178");
  if (url.pathname === "/__test/stats") return json(response, 200, stats);
  if (url.pathname === "/__test/reset") { resetFlowState(); return json(response, 200, { reset: true }); }
  if (url.pathname === "/__test/result") {
    assessmentExists = true;
    assessmentStatus = "complete";
    flowMode = ["pattern", "single", "neutral"].includes(url.searchParams.get("mode")) ? url.searchParams.get("mode") : "pattern";
    response.writeHead(302, { location: "/assessment/result?e2e=1", "set-cookie": "jingeehas_session=e2e; Path=/; HttpOnly; SameSite=Lax" });
    return response.end();
  }
  if (url.pathname === "/__test/mode") {
    const mode = url.searchParams.get("value");
    if (!["pattern", "single", "neutral", "safety"].includes(mode)) return json(response, 400, { error: "invalid_mode" });
    flowMode = mode;
    return json(response, 200, { mode });
  }
  if (url.pathname === "/__test/select-report" && cohortReports[url.searchParams.get("id")]) {
    response.writeHead(302, { location: "/report?e2e=1", "set-cookie": `jingeehas_cohort=${url.searchParams.get("id")}; Path=/; HttpOnly; SameSite=Lax` });
    return response.end();
  }
  if (url.pathname.startsWith("/.netlify/functions/")) { const action = endpoints[url.pathname.split("/").pop()]; if (!action) return json(response, 404, { error: "not_found" }); return action(await readBody(request), response, request); }
  if (url.pathname === "/app-test.js" || url.pathname === "/app-production.js") { let source = fs.readFileSync(path.join(root, "app.js"), "utf8"); if (url.pathname === "/app-production.js") source = source.replace("const WEIGHT_TEST_COMING_SOON_MODE = false;", "const WEIGHT_TEST_COMING_SOON_MODE = true;"); response.writeHead(200, { "content-type": types[".js"] }); return response.end(source); }
  const relative = url.pathname === "/" ? "index.html" : url.pathname.slice(1); const absolute = path.join(root, relative);
  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) { response.writeHead(200, { "content-type": types[path.extname(absolute)] || "application/octet-stream" }); return response.end(fs.readFileSync(absolute)); }
  const e2eSession = String(request.headers.cookie || "").includes("jingeehas_session=e2e") || String(request.headers.cookie || "").includes("jingeehas_session=recovered");
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8"); html = html.replace("app.js", url.searchParams.get("e2e") === "1" || e2eSession ? "app-test.js" : "app-production.js"); response.writeHead(200, { "content-type": types[".html"] }); response.end(html);
}).listen(4178, "127.0.0.1");
