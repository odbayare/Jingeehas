"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { saveAssessment } = require("../netlify/functions/_lib/assessment.js");
const { canonicalQuestion } = require("../netlify/functions/_lib/question-progress.js");
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

  const admin = { id: "admin_owner", status: "active", isOwner: true };
  await database.insert("admin_accounts", admin);
  const role = await createRoleSession(database, { table: "admin_sessions", ownerField: "adminId", ownerId: admin.id, prefix: "ads_", cookieName: "jingeehas_admin" });
  const handler = require("../netlify/functions/admin-question-progress.js").handler;
  const response = await handler({ httpMethod: "GET", headers: { cookie: role.cookie.split(";")[0] }, queryStringParameters: { startDate: "2026-07-20", endDate: "2026-07-20" } });
  assert.equal(response.statusCode, 200); const payload = JSON.parse(response.body); const serialized = JSON.stringify(payload);
  for (const forbidden of ["assessmentId", "email", "phone", "sessionToken", "answers"]) assert(!serialized.includes(forbidden), `admin payload excludes ${forbidden}`);

  const root = path.resolve(__dirname, ".."); const migration = fs.readFileSync(path.join(root, "supabase/migrations/20260721080832_add_question_progress_analytics.sql"), "utf8");
  for (const rule of ["enable row level security", "revoke all on table jingeehas.assessment_question_progress from public, anon, authenticated", "stopped_count::numeric / nullif(reached_count, 0)", "Asia/Ulaanbaatar", "canonical_answer_backfill"]) assert(migration.includes(rule), rule);
  assert(migration.includes("where p.source = 'live'"), "historical answer backfill cannot define a stop point");
  const tableSql = /create table if not exists jingeehas\.assessment_question_progress[\s\S]*?\n\);/.exec(migration)[0];
  for (const prohibited of ["value jsonb", "email", "phone", "ip_address", "user_agent", "payment"]) assert(!tableSql.includes(prohibited), prohibited);
  assert(!/canonical_answer_backfill[\s\S]*assessment_answers[\s\S]*(lead|lag|next)/i.test(migration), "backfill does not fabricate unanswered or next-question views");
  console.log("question progress analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
