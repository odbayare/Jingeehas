"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { evaluateSafetyGate, ROUTE_COPY } = require("../../netlify/functions/_lib/safety.js");
const questions = require("../../questions.js");
const cohort = require("../fixtures/virtual-cohort-v2.js");
const { buildEvidence, buildFullReport, publicReport } = require("../../netlify/functions/_lib/report.js");
const root = path.resolve(__dirname, "../..");
const stats = { qpayCreate: 0, qpayCheck: 0, assessmentSave: 0, paymentRows: 0 };
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
  "admin-login": async (_body, response) => json(response, 200, { adminId: "owner-e2e", owner: true }, { "set-cookie": "jingeehas_admin=admin-e2e; Path=/; HttpOnly; Secure; SameSite=Strict" }),
  "admin-session-state": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") ? json(response, 200, { authenticated: true, owner: true }) : json(response, 401, { error: "unauthorized" }),
  "admin-preview-start": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") ? json(response, 201, { active: true, expiresAt: "2026-07-17T14:00:00.000Z", resumeDraft: false }, { "set-cookie": "jingeehas_owner_preview=preview-e2e; Path=/; HttpOnly; Secure; SameSite=Strict" }) : json(response, 401, { error: "unauthorized" }),
  "admin-preview-status": async (_body, response, request) => String(request.headers.cookie || "").includes("jingeehas_admin=admin-e2e") && String(request.headers.cookie || "").includes("jingeehas_owner_preview=preview-e2e") ? json(response, 200, { active: true, expiresAt: "2026-07-17T14:00:00.000Z" }) : json(response, 401, { error: "preview_required" }),
  "weight-session-start": async (_body, response) => json(response, 201, { sessionId: "ws-e2e", resumed: false }, { "set-cookie": "jingeehas_session=e2e; Path=/; HttpOnly; SameSite=Lax" }),
  "weight-safety-gate": async (body, response) => { const result = evaluateSafetyGate(body); json(response, 200, { safetyCheckId: "sc-e2e", ...result, guidance: result.route === "eligible" ? null : ROUTE_COPY[result.route] }); },
  "weight-recovery-contact-save": async (_body, response) => json(response, 201, { contactGroupId: "rcg-e2e" }),
  "weight-assessment-create": async (_body, response) => json(response, 201, { assessmentId: "wa-e2e", status: "draft" }),
  "qpay-create-invoice": async (_body, response) => { stats.qpayCreate += 1; stats.paymentRows += 1; json(response, 200, { paymentId: "wp-e2e", assessmentId: "wa-e2e", productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "pending", expiresAt: "2026-07-16T12:30:00.000Z", qrText: "qr", qrImage: "", urls: [] }); },
  "qpay-check-payment": async (_body, response) => { stats.qpayCheck += 1; json(response, 200, { paymentId: "wp-e2e", assessmentId: "wa-e2e", productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "paid", entitlement: true }); },
  "weight-assessment-save": async (body, response) => { stats.assessmentSave += 1; const ids = Object.keys(body.answers || {}); await new Promise(resolve => setTimeout(resolve, ids.includes("Q-AGE") ? 1200 : 30)); json(response, 200, { assessmentId: "wa-e2e", status: "draft", savedQuestionIds: ids }); },
  "weight-assessment-complete": async (_body, response) => json(response, 200, { assessmentId: "wa-e2e", status: "complete", reportMode: "sufficient", safetyRoute: null }),
  "weight-assessment-report": async (_body, response, request) => json(response, 200, { assessmentId: "wa-e2e", reportMode: "sufficient", safetyRoute: null, initialView: {}, fullReport: selectedReport(request), entitled: true }),
  "weight-session-state": async (_body, response, request) => { const paid = stats.qpayCheck > 0; const hasPayment = stats.paymentRows > 0; json(response, 200, { assessment: { assessmentId: "wa-e2e", status: "complete", safetyRoute: null }, payment: hasPayment ? { status: paid ? "paid" : "pending", paymentId: "wp-e2e" } : null, answers: {}, report: { assessmentId: "wa-e2e", reportMode: "sufficient", safetyRoute: null, initialView: {}, fullReport: selectedReport(request), entitled: true } }); },
  "weight-recovery-request": async (_body, response) => json(response, 202, { recoveryId: "rr-e2e", message: "Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ." }),
  "weight-recovery-confirm": async (body, response) => body.code === "123456" ? json(response, 200, { assessmentId: "wa-e2e", recovered: true }, { "set-cookie": "jingeehas_session=recovered; Path=/; HttpOnly" }) : json(response, 400, { error: "invalid_recovery_code" }),
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
  if (url.pathname === "/__test/select-report" && cohortReports[url.searchParams.get("id")]) {
    response.writeHead(302, { location: "/report?e2e=1", "set-cookie": `jingeehas_cohort=${url.searchParams.get("id")}; Path=/; HttpOnly; SameSite=Lax` });
    return response.end();
  }
  if (url.pathname.startsWith("/.netlify/functions/")) { const action = endpoints[url.pathname.split("/").pop()]; if (!action) return json(response, 404, { error: "not_found" }); return action(await readBody(request), response, request); }
  if (url.pathname === "/app-test.js" || url.pathname === "/app-production.js") { let source = fs.readFileSync(path.join(root, "app.js"), "utf8"); if (url.pathname === "/app-production.js") source = source.replace("const WEIGHT_TEST_COMING_SOON_MODE = false;", "const WEIGHT_TEST_COMING_SOON_MODE = true;"); response.writeHead(200, { "content-type": types[".js"] }); return response.end(source); }
  const relative = url.pathname === "/" ? "index.html" : url.pathname.slice(1); const absolute = path.join(root, relative);
  if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) { response.writeHead(200, { "content-type": types[path.extname(absolute)] || "application/octet-stream" }); return response.end(fs.readFileSync(absolute)); }
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8"); html = html.replace("app.js", url.searchParams.get("e2e") === "1" ? "app-test.js" : "app-production.js"); response.writeHead(200, { "content-type": types[".html"] }); response.end(html);
}).listen(4178, "127.0.0.1");
