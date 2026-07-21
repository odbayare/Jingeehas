"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { saveAssessment, startAssessment } = require("../netlify/functions/_lib/assessment.js");
const { canonicalQuestion, recordQuestionView, markAnswersRecordedSafe } = require("../netlify/functions/_lib/question-progress.js");
const { createRoleSession } = require("../netlify/functions/_lib/auth.js");
const app = require("../app.js");
const questions = require("../questions.js");
const { questionAnalytics } = require("../netlify/functions/_lib/question-analytics.js");

async function assessment(database, id, createdAt, status = "draft", updatedAt = createdAt, sex = null) {
  const sessionId = `ws_${id}`;
  await database.insert("sessions", { id: sessionId, tokenHash: `hash_${id}`, createdAt, expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await database.insert("assessments", { id, sessionId, safetyCheckId: `sc_${id}`, status, questionnaireVersion: questions.QUESTIONNAIRE_VERSION,
    createdAt, updatedAt, completedAt: status === "complete" ? updatedAt : null });
  if (sex) await database.insert("assessment_answers", { id: `${id}:Q-SEX`, assessmentId: id, questionId: "Q-SEX", value: sex, updatedAt });
  return { id, sessionId };
}

(async () => {
  const database = new MemoryDatabaseAdapter(); setDatabaseForTests(database);
  const old = await assessment(database, "wa_old", "2026-07-19T16:00:00.000Z", "draft", "2026-07-19T17:00:00.000Z", "Эрэгтэй");
  const active = await assessment(database, "wa_active", "2026-07-19T18:00:00.000Z", "draft", "2026-07-20T15:30:00.000Z", "Эрэгтэй");
  const done = await assessment(database, "wa_done", "2026-07-19T19:00:00.000Z", "complete", "2026-07-20T10:00:00.000Z", "Эрэгтэй");
  const branch = await assessment(database, "wa_branch", "2026-07-19T20:00:00.000Z", "draft", "2026-07-19T20:00:00.000Z", "Эмэгтэй");

  const qAge = questionAnalytics("Q-AGE"); const qSex = questionAnalytics("Q-SEX"); const mc = questionAnalytics("MC-GATE");
  await database.recordQuestionProgress({ assessmentId: old.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-AGE", ...qAge, viewedAt: "2026-07-19T16:10:00.000Z", answered: false, source: "live" });
  const first = await database.find("assessment_question_progress", { assessmentId: old.id });
  await database.recordQuestionProgress({ assessmentId: old.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-AGE", ...qAge, viewedAt: "2026-07-19T16:20:00.000Z", answered: false, source: "live" });
  const refreshed = await database.find("assessment_question_progress", { assessmentId: old.id });
  assert.equal(refreshed.length, 1, "refresh does not duplicate reached question");
  assert.equal(refreshed[0].firstViewedAt, first[0].firstViewedAt, "re-render preserves first_viewed_at");
  assert.equal(refreshed[0].lastViewedAt, "2026-07-19T16:20:00.000Z", "re-render updates last_viewed_at");

  await saveAssessment(database, old.sessionId, { assessmentId: old.id, answers: { "Q-AGE": 35 } }, new Date("2026-07-19T16:21:00.000Z"));
  await database.recordQuestionProgress({ assessmentId: old.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-AGE", ...qAge, viewedAt: "2026-07-19T16:21:00.000Z", answered: true, source: "live" });
  assert.equal((await database.find("assessment_question_progress", { assessmentId: old.id }))[0].answeredAt, "2026-07-19T16:21:00.000Z", "successful save marks answered_at");
  await assert.rejects(() => saveAssessment(database, old.sessionId, { assessmentId: old.id, answers: { "Q-AGE": 999 } }, new Date("2026-07-19T16:22:00.000Z")), /Зөв тоон/);
  assert.equal((await database.find("assessment_question_progress", { assessmentId: old.id }))[0].answeredAt, "2026-07-19T16:21:00.000Z", "failed save cannot advance answered_at");
  await database.recordQuestionProgress({ assessmentId: old.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-SEX", ...qSex, viewedAt: "2026-07-19T16:22:00.000Z", answered: false, source: "live" });
  assert.equal((await database.find("assessment_question_progress", { assessmentId: old.id })).length, 2, "next render records next question");

  await assert.rejects(() => canonicalQuestion(database, old.sessionId, { assessmentId: old.id, questionId: "MC-GATE" }), error => error.code === "invalid_question", "branch-skipped question cannot be recorded");
  await database.recordQuestionProgress({ assessmentId: branch.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "MC-GATE", ...mc, viewedAt: "2026-07-19T20:10:00.000Z", answered: false, source: "live" });
  await database.recordQuestionProgress({ assessmentId: active.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-AGE", ...qAge, viewedAt: "2026-07-21T15:30:00.000Z", answered: false, source: "live" });
  await database.recordQuestionProgress({ assessmentId: done.id, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, questionId: "Q-AGE", ...qAge, viewedAt: "2026-07-19T19:10:00.000Z", answered: false, source: "live" });

  const aggregate = await database.getQuestionProgressAnalytics("2026-07-20", "2026-07-20", new Date("2026-07-21T16:00:00.000Z"));
  assert.equal(aggregate.summary.cohortStarted, 4, "Ulaanbaatar cohort includes UTC timestamps on the selected local day");
  const age = aggregate.questions.find(row => row.questionId === "Q-AGE"); const sex = aggregate.questions.find(row => row.questionId === "Q-SEX"); const branchRow = aggregate.questions.find(row => row.questionId === "MC-GATE");
  assert.equal(age.reachedCount, 3); assert.equal(age.stoppedCount, 0, "earlier reached question is not the stop point");
  assert.equal(sex.stoppedCount, 1, "last viewed unanswered question becomes the stop point");
  assert.equal(branchRow.reachedCount, 1, "branch denominator includes only reached assessments");
  assert.equal(branchRow.stoppedCount, 1);
  assert.equal(age.activeCount, 1, "activity within 24 hours is active, not stopped");
  assert.equal(app._test.questionProgressWarning(9), "Түүвэр бага тул уналтын үзүүлэлтийг урьдчилсан дохио гэж үзнэ.");
  assert.equal(app._test.questionProgressWarning(10), "Түүвэр нэмэгдэж байна. Гол уналтын цэгүүдийг ажиглана.");
  assert.equal(app._test.questionProgressWarning(30), ""); assert.equal(app._test.safeRate(null), "—");
  assert.equal(app._test.formatAnalyticsDate("2026-07-20T16:00:00.000Z"), "2026.07.21", "instrumentation date is deterministic Ulaanbaatar YYYY.MM.DD");

  app._test.setState({ admin: { ...app._test.getState().admin, analytics: { ...app._test.getState().admin.analytics,
    questionProgress: { summary: { cohortStarted: 7, coveredAssessments: 6, averageQuestionsReached: 18, completedCount: 2,
      topStopLabel: "Өмнө туршсан арга", topStopCount: 3, instrumentationStartedAt: "2026-07-21T00:00:00Z" },
      questions: Array.from({ length: 8 }, (_, index) => ({ questionId: `Q-${index}`, analyticsLabel: `Асуулт ${index}`, sectionLabel: "Үе шат",
        reachedCount: 6, answeredCount: 5, stoppedCount: 8 - index, dropoffRate: (8 - index) / 6 })), expanded: false, showAll: false } } } });
  let html = app._test.renderQuestionProgressAnalytics();
  assert(html.includes('aria-expanded="false"')); assert(!html.includes("Хамгийн их уналттай цэгүүд"), "details are collapsed by default");
  app._test.getState().admin.analytics.questionProgress.expanded = true; html = app._test.renderQuestionProgressAnalytics();
  assert.equal((html.match(/<tbody>/g) || []).length, 1); assert.equal((html.match(/<tr>/g) || []).length, 6, "expanded level renders header plus top five only");
  app._test.getState().admin.analytics.questionProgress.showAll = true; html = app._test.renderQuestionProgressAnalytics();
  assert.equal((html.match(/<tbody>/g) || []).length, 2, "second expansion renders full table");
  assert(!/(NaN|Infinity|null)/.test(html));

  app._test.getState().admin.analytics.questionProgress = { summary: { cohortStarted: 4, coveredAssessments: 4, averageQuestionsReached: 3,
    completedCount: 1, topStopLabel: null, topStopCount: 0, instrumentationStartedAt: "2026-07-21T00:00:00Z" },
    questions: [{ questionId: "Q-AGE", analyticsLabel: "Нас", sectionLabel: "Суурь мэдээлэл", reachedCount: 4, answeredCount: 4, stoppedCount: 0 }],
    expanded: true, showAll: false };
  html = app._test.renderQuestionProgressAnalytics();
  assert(html.includes("Одоогоор бүртгэгдээгүй"), "collapsed summary has exact no-stop copy");
  assert(html.includes("24 цагаас хуучин зогсолт одоогоор бүртгэгдээгүй байна."), "expanded empty state has exact copy");
  assert(!html.includes("Хамгийн их уналттай цэгүүд"), "no-stop state hides the top-five table heading");
  assert.equal((html.match(/<tbody>/g) || []).length, 0, "no-stop state hides the table");

  const paidDatabase = new MemoryDatabaseAdapter();
  const paidNow = new Date("2026-07-21T08:00:00.000Z");
  await paidDatabase.insert("sessions", { id: "ws_paid_progress", tokenHash: "hash", createdAt: paidNow.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await paidDatabase.insert("assessments", { id: "wa_paid_progress", sessionId: "ws_paid_progress", status: "payment_pending", commercialFlowVersion: "prepaid_v2",
    startedAt: null, questionnaireVersion: questions.QUESTIONNAIRE_VERSION, createdAt: paidNow.toISOString(), updatedAt: paidNow.toISOString() });
  assert.equal((await paidDatabase.find("assessment_question_progress", {})).length, 0, "payment preparation records no reached question");
  await assert.rejects(() => startAssessment(paidDatabase, "ws_paid_progress", "wa_paid_progress", paidNow), error => error.code === "payment_required");
  await assert.rejects(() => recordQuestionView(paidDatabase, "ws_paid_progress", { assessmentId: "wa_paid_progress", questionId: "Q-AGE" },
    { headers: { host: "jingeehas.fit", "user-agent": "Mozilla/5.0" } }, paidNow), error => error.code === "payment_required");
  assert.equal((await paidDatabase.find("assessment_question_progress", {})).length, 0, "unpaid access creates no progress row");
  await paidDatabase.insert("entitlements", { id: "we_paid_progress", assessmentId: "wa_paid_progress", paymentId: "wp_paid_progress", status: "active", grantedAt: paidNow.toISOString() });
  await paidDatabase.update("assessments", "wa_paid_progress", { status: "paid_ready" });
  const paidStarted = await startAssessment(paidDatabase, "ws_paid_progress", "wa_paid_progress", new Date("2026-07-21T08:00:01.000Z"));
  const paidRefreshed = await startAssessment(paidDatabase, "ws_paid_progress", "wa_paid_progress", new Date("2026-07-21T08:00:02.000Z"));
  assert.equal(paidStarted.startedAt, "2026-07-21T08:00:01.000Z");
  assert.equal(paidRefreshed.startedAt, paidStarted.startedAt, "authorized refresh preserves started_at");
  const originalNodeEnv = process.env.NODE_ENV; process.env.NODE_ENV = "production";
  const publicEvent = { httpMethod: "POST", headers: { host: "jingeehas.fit", "user-agent": "Mozilla/5.0" } };
  try {
    await recordQuestionView(paidDatabase, "ws_paid_progress", { assessmentId: "wa_paid_progress", questionId: "Q-AGE" }, publicEvent, new Date("2026-07-21T08:00:03.000Z"));
    await recordQuestionView(paidDatabase, "ws_paid_progress", { assessmentId: "wa_paid_progress", questionId: "Q-AGE" }, publicEvent, new Date("2026-07-21T08:00:04.000Z"));
    assert.equal((await paidDatabase.find("assessment_question_progress", { assessmentId: "wa_paid_progress" })).length, 1, "authorized refresh does not duplicate reached");
    const paidSaved = await saveAssessment(paidDatabase, "ws_paid_progress", { assessmentId: "wa_paid_progress", answers: { "Q-AGE": 35 } }, new Date("2026-07-21T08:00:05.000Z"));
    await markAnswersRecordedSafe(paidDatabase, paidSaved, ["Q-AGE"], publicEvent, new Date("2026-07-21T08:00:05.000Z"));
    assert.equal((await paidDatabase.find("assessment_question_progress", { assessmentId: "wa_paid_progress" }))[0].answeredAt, "2026-07-21T08:00:05.000Z");
    await assert.rejects(() => saveAssessment(paidDatabase, "ws_paid_progress", { assessmentId: "wa_paid_progress", answers: { "Q-AGE": 999 } }, new Date("2026-07-21T08:00:06.000Z")));
    assert.equal((await paidDatabase.find("assessment_question_progress", { assessmentId: "wa_paid_progress" }))[0].answeredAt, "2026-07-21T08:00:05.000Z", "failed save does not advance answered_at");
  } finally { process.env.NODE_ENV = originalNodeEnv; }

  await paidDatabase.insert("sessions", { id: "ws_owner_progress", tokenHash: "hash", createdAt: paidNow.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await paidDatabase.insert("assessments", { id: "wa_owner_progress", sessionId: "ws_owner_progress", status: "in_progress", commercialFlowVersion: "prepaid_v2",
    startedAt: paidNow.toISOString(), questionnaireVersion: questions.QUESTIONNAIRE_VERSION, createdAt: paidNow.toISOString(), updatedAt: paidNow.toISOString() });
  await paidDatabase.insert("assessment_sessions", { id: "wa_owner_progress:ws_owner_progress", assessmentId: "wa_owner_progress", sessionId: "ws_owner_progress", source: "owner" });
  process.env.NODE_ENV = "production";
  try {
    const ownerView = await recordQuestionView(paidDatabase, "ws_owner_progress", { assessmentId: "wa_owner_progress", questionId: "Q-AGE" },
      { httpMethod: "POST", headers: { host: "jingeehas.fit", cookie: "jingeehas_owner_preview=preview", "user-agent": "Mozilla/5.0" } }, paidNow);
    assert.deepEqual(ownerView, { recorded: true, excluded: false });
  } finally { process.env.NODE_ENV = originalNodeEnv; }
  assert.equal((await paidDatabase.find("assessment_question_progress", { assessmentId: "wa_owner_progress" })).length, 1, "owner preview records the functional question journey");
  const ownerExcluded = await paidDatabase.getQuestionProgressAnalytics("2026-07-21", "2026-07-21", new Date("2026-07-23T08:00:00.000Z"));
  assert.equal(ownerExcluded.summary.cohortStarted, 1, "owner preview is excluded from progress cohort");
  await assert.rejects(() => paidDatabase.recordQuestionProgress({ assessmentId: "wa_paid_progress", questionnaireVersion: "spoofed-version", questionId: "Q-AGE",
    viewedAt: paidNow.toISOString(), answered: false }), /version mismatch/, "assessment version prevents cross-version double counting");

  const admin = { id: "admin_owner", status: "active", isOwner: true };
  await database.insert("admin_accounts", admin);
  const role = await createRoleSession(database, { table: "admin_sessions", ownerField: "adminId", ownerId: admin.id, prefix: "ads_", cookieName: "jingeehas_admin" });
  const { handler, mergeCanonicalQuestionRows } = require("../netlify/functions/admin-question-progress.js");
  const response = await handler({ httpMethod: "GET", headers: { cookie: role.cookie.split(";")[0] }, queryStringParameters: { startDate: "2026-07-20", endDate: "2026-07-20" } });
  assert.equal(response.statusCode, 200); const payload = JSON.parse(response.body); const serialized = JSON.stringify(payload);
  for (const forbidden of ["assessmentId", "email", "phone", "sessionToken", "answers"]) assert(!serialized.includes(forbidden), `admin payload excludes ${forbidden}`);

  const sameMeaning = mergeCanonicalQuestionRows([
    { questionId: "Q-AGE", questionnaireVersion: questions.LEGACY_QUESTIONNAIRE_VERSION, reachedCount: 6, answeredCount: 5, stoppedCount: 2, activeCount: 0 },
    { questionId: "Q-AGE", questionnaireVersion: questions.QUESTIONNAIRE_VERSION, reachedCount: 2, answeredCount: 2, stoppedCount: 0, activeCount: 1 }
  ]);
  assert.equal(sameMeaning.length, 1, "same canonical question across versions is one visible row");
  assert.equal(sameMeaning[0].reachedCount, 8); assert.equal(sameMeaning[0].answeredCount, 7); assert.equal(sameMeaning[0].versionBadge, null);
  const changedMeaning = mergeCanonicalQuestionRows([
    { questionId: "Q-AGE", questionnaireVersion: "old", reachedCount: 3 }, { questionId: "Q-AGE", questionnaireVersion: "new", reachedCount: 4 }
  ], (_id, version) => ({ questionId: "Q-AGE", sectionKey: "baseline", sectionLabel: "Суурь", analyticsLabel: "Нас",
    meaningIdentity: `Q-AGE:${version}`, questionOrder: 1 }));
  assert.equal(changedMeaning.length, 2, "changed canonical meaning remains separate");
  assert.deepEqual(changedMeaning.map(row => row.versionBadge), ["v2", "v1"], "changed meanings carry stable version badges");

  const root = path.resolve(__dirname, ".."); const migration = fs.readFileSync(path.join(root, "supabase/migrations/20260721080832_add_question_progress_analytics.sql"), "utf8");
  for (const rule of ["enable row level security", "revoke all on table jingeehas.assessment_question_progress from public, anon, authenticated", "stopped_count::numeric / nullif(reached_count, 0)", "Asia/Ulaanbaatar", "canonical_answer_backfill"]) assert(migration.includes(rule), rule);
  assert(migration.includes("where p.source = 'live'"), "historical answer backfill cannot define a stop point");
  const tableSql = /create table if not exists jingeehas\.assessment_question_progress[\s\S]*?\n\);/.exec(migration)[0];
  for (const prohibited of ["value jsonb", "email", "phone", "ip_address", "user_agent", "payment"]) assert(!tableSql.includes(prohibited), prohibited);
  assert(!/canonical_answer_backfill[\s\S]*assessment_answers[\s\S]*(lead|lag|next)/i.test(migration), "backfill does not fabricate unanswered or next-question views");
  const integrationMigration = fs.readFileSync(path.join(root, "supabase/migrations/20260721165021_integrate_question_progress_paid_first.sql"), "utf8");
  for (const rule of ["commercial_flow_version = 'prepaid_v2' then a.started_at", "JH_QUESTION_PROGRESS_VERSION_MISMATCH",
    "revoke all on function jingeehas.get_question_progress_analytics(date, date, timestamptz) from public, anon, authenticated"]) assert(integrationMigration.includes(rule), rule);
  console.log("question progress analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
