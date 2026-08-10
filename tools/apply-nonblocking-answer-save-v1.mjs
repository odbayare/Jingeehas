import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const markers = [`async function ${name}(`, `function ${name}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start >= 0) break;
  }
  if (start < 0) throw new Error(`Non-blocking answer-save function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Non-blocking answer-save body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Non-blocking answer-save function end missing: ${name}`);
}

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Non-blocking answer-save insertion missing: ${label}`);
  return source.replace(from, to);
}

function replaceInsideFunction(source, name, from, to, label) {
  const marker = source.includes(`async function ${name}(`) ? `async function ${name}(` : `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Non-blocking answer-save function missing: ${name}`);
  const nextFunction = source.indexOf("\nfunction ", start + marker.length);
  const nextAsyncFunction = source.indexOf("\nasync function ", start + marker.length);
  const candidates = [nextFunction, nextAsyncFunction].filter(index => index >= 0);
  const end = candidates.length ? Math.min(...candidates) : source.length;
  const body = source.slice(start, end);
  if (body.includes(to)) return source;
  if (!body.includes(from)) throw new Error(`Non-blocking answer-save insertion missing: ${label}`);
  return `${source.slice(0, start)}${body.replace(from, to)}${source.slice(end)}`;
}

const RENDER_QUESTIONS = `function renderQuestions() {
  const questions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
  state.questionIndex = Math.min(state.questionIndex, Math.max(0, questions.length - 1));
  const question = questions[state.questionIndex];
  const percent = Math.round(((state.questionIndex + 1) / questions.length) * 100);
  return \`<div class="page assessment-page"><main class="content-card"><p class="eyebrow">Тестийн явц</p><progress role="progressbar" aria-label="Тестийн явц" aria-valuemin="0" aria-valuemax="100" aria-valuenow="\${percent}" value="\${percent}" max="100">\${percent}%</progress>
    <p>\${state.questionIndex + 1}-р асуулт</p><h1 id="page-title" tabindex="-1">\${escapeHtml(question.section)}</h1>
    <p class="muted">Өөрт хамгийн ойр хариултаа сонгоорой. Таны явц автоматаар хадгалагдана.</p>
    <form id="question-form" novalidate aria-busy="\${state.busy ? "true" : "false"}">\${renderQuestionInput(question, state.answers[question.id])}<p id="question-error" class="error" role="alert" aria-live="assertive">\${escapeHtml(state.validationError)}</p>
      <div class="save-status" role="status" aria-live="polite">\${state.saveStatus === "completing" ? "Хариултуудыг нэгтгэж байна..." : state.saveStatus === "saving" ? "Хадгалж байна" : state.saveStatus === "saved" ? "Хадгалагдлаа" : state.saveStatus === "failed" ? \`Хадгалж чадсангүй — <button class="text-link" type="button" data-action="retry-answer-saves">дахин оролдох</button>\` : ""}</div>
      <div class="actions">\${state.questionIndex > 0 ? \`<button class="button secondary" type="button" data-action="previous-question">Буцах</button>\` : ""}<button class="button" type="submit" \${state.busy ? "disabled" : ""}>\${state.busy ? "Хариултуудыг нэгтгэж байна..." : state.questionIndex === questions.length - 1 ? "Тестийг дуусгах" : "Үргэлжлүүлэх"}</button></div>
    </form></main>\${footer()}</div>\`;
}`;

const UPDATE_ANSWER_AND_QUEUE = `function updateAnswer(input) {
  const question = questionApi.questionById(input.dataset.question, state.questionnaireVersion); if (!question) return;
  const previousValue = state.answers[question.id];
  if (question.type === "multi") {
    const current = Array.isArray(state.answers[question.id]) ? state.answers[question.id] : [];
    const selected = input.value;
    let next;
    if (EXCLUSIVE.has(selected)) next = input.checked ? [selected] : [];
    else {
      const withoutExclusive = current.filter(value => !EXCLUSIVE.has(value) && value !== selected);
      if (input.checked && withoutExclusive.length >= question.max) { state.validationError = \`Та хамгийн ихдээ \${question.max} хариулт сонгох боломжтой.\`; render(); return; }
      next = input.checked ? [...withoutExclusive, selected] : withoutExclusive;
    }
    state.answers[question.id] = next;
  } else state.answers[question.id] = input.value;
  if (previousValue !== state.answers[question.id] && BRANCH_PREFIXES[question.id]) {
    for (const key of Object.keys(state.answers)) {
      if (key !== question.id && BRANCH_PREFIXES[question.id].some(prefix => key.startsWith(prefix))) {
        delete state.answers[key]; answerSaveQueue.pending.delete(key); answerSaveQueue.failed.delete(key);
      }
    }
  }
  state.validationError = "";
}
function sameAnswer(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
function resetAnswerSaveQueue() {
  answerSaveQueue.pending.clear(); answerSaveQueue.failed.clear(); answerSaveQueue.inFlight = null; answerSaveQueue.worker = null; answerSaveQueue.paused = false; answerSaveQueue.completionStarted = false;
  state.saveStatus = "idle";
}
function saveFailureMessage(error) {
  const code = error?.body?.error;
  if (code === "assessment_incomplete") return "Шаардлагатай өмнөх асуултын хариулт дутуу байна. Хариултаа нөхөөд дахин үргэлжлүүлнэ үү.";
  if (["invalid_answer", "inapplicable_question"].includes(code)) return "Энэ хариултыг хадгалах боломжгүй байна. Сонголтоо шалгаад дахин оролдоно уу.";
  if (["preview_required", "preview_expired", "session_expired"].includes(code)) return "Туршилтын эрхийн хугацаа дууссан байна. Удирдлагын хэсгээс эрхээ дахин нээнэ үү.";
  return "Хариултыг хадгалж чадсангүй. Таны оруулсан хариулт хадгалагдсан хэвээр; дахин оролдоно уу.";
}
function applySaveFailure(error) {
  const questionId = error?.body?.questionId;
  if (questionId) {
    const index = questionApi.visibleQuestions(state.answers, state.questionnaireVersion).findIndex(item => item.id === questionId);
    if (index >= 0) state.questionIndex = index;
  }
  state.validationError = saveFailureMessage(error); state.saveStatus = "failed";
}
function pumpAnswerSaveQueue() {
  if (answerSaveQueue.worker || answerSaveQueue.paused || !answerSaveQueue.pending.size || !state.assessmentId) return answerSaveQueue.worker;
  const batch = new Map(answerSaveQueue.pending); answerSaveQueue.pending.clear(); answerSaveQueue.inFlight = batch; state.saveStatus = "saving";
  answerSaveQueue.worker = (async () => {
    try {
      const saved = await api("/.netlify/functions/weight-assessment-save", { method: "PATCH", keepalive: true, body: JSON.stringify({ assessmentId: state.assessmentId, answers: Object.fromEntries(batch) }) });
      for (const [questionId, value] of batch) {
        if (answerSaveQueue.pending.has(questionId) && !sameAnswer(answerSaveQueue.pending.get(questionId), value)) continue;
        if (!saved.savedQuestionIds?.includes(questionId)) throw Object.assign(new Error("answer_not_confirmed"), { body: { error: "answer_not_confirmed", questionId } });
        answerSaveQueue.failed.delete(questionId);
      }
      state.saveStatus = answerSaveQueue.pending.size ? "saving" : "saved";
    } catch (error) {
      const visibleQuestionIds = new Set(questionApi.visibleQuestions(state.answers, state.questionnaireVersion).map(question => question.id));
      const retryable = [];
      for (const [questionId, value] of batch) {
        const hasNewerPending = answerSaveQueue.pending.has(questionId) && !sameAnswer(answerSaveQueue.pending.get(questionId), value);
        const stillCurrent = Object.prototype.hasOwnProperty.call(state.answers, questionId)
          && visibleQuestionIds.has(questionId)
          && sameAnswer(state.answers[questionId], value);
        if (!hasNewerPending && stillCurrent) {
          answerSaveQueue.pending.set(questionId, value);
          retryable.push(questionId);
        }
      }
      if (retryable.length) {
        for (const questionId of retryable) answerSaveQueue.failed.set(questionId, true);
        answerSaveQueue.paused = true; applySaveFailure(error);
      } else {
        answerSaveQueue.paused = false;
        state.saveStatus = answerSaveQueue.pending.size ? "saving" : "saved";
      }
    } finally {
      answerSaveQueue.inFlight = null; answerSaveQueue.worker = null; render({ focus: false });
      if (answerSaveQueue.pending.size && !answerSaveQueue.paused) queueMicrotask(pumpAnswerSaveQueue);
    }
  })();
  return answerSaveQueue.worker;
}
function enqueueAnswerSave(questionId, value) {
  answerSaveQueue.pending.set(questionId, value); answerSaveQueue.failed.delete(questionId); answerSaveQueue.paused = false; state.saveStatus = "saving";
  pumpAnswerSaveQueue();
}
async function flushAnswerSaves() {
  answerSaveQueue.paused = false;
  while (answerSaveQueue.pending.size || answerSaveQueue.worker) {
    const worker = answerSaveQueue.worker || pumpAnswerSaveQueue();
    if (worker) await worker;
    if (answerSaveQueue.failed.size) throw Object.assign(new Error("answer_save_failed"), { body: { error: "answer_save_failed" } });
  }
}
function retryAnswerSaves() { answerSaveQueue.failed.clear(); answerSaveQueue.paused = false; state.validationError = ""; state.saveStatus = "saving"; pumpAnswerSaveQueue(); render({ focus: false }); }`;

const NEXT_QUESTION = `async function nextQuestion() {
  if (state.busy || answerSaveQueue.completionStarted) return;
  const questions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion); const question = questions[state.questionIndex];
  const error = questionApi.validateAnswer(question, state.answers[question.id], { answers: state.answers, version: state.questionnaireVersion });
  if (error) { state.validationError = error; render(); return; }
  state.validationError = ""; enqueueAnswerSave(question.id, state.answers[question.id]);
  const routedQuestions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
  const currentIndex = routedQuestions.findIndex(item => item.id === question.id);
  if (currentIndex < routedQuestions.length - 1) { state.questionIndex = currentIndex + 1; render({ focus: false }); return; }
  answerSaveQueue.completionStarted = true; state.busy = true; state.saveStatus = "completing"; render({ focus: false });
  try {
    await flushAnswerSaves();
    const completed = await api("/.netlify/functions/weight-assessment-complete", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
    state.assessmentStatus = completed.status; state.busy = false;
    if (completed.safetyRoute) { state.report = await loadReport(); navigate("/report"); return; }
    if (completed.nextRoute === "/assessment/result") {
      state.initialResult = null; state.initialResultError = ""; navigate("/assessment/result");
      loadInitialResult().then(() => render()).catch(() => render()); return;
    }
    if (completed.nextRoute === "/report" || state.commercialFlowVersion === "prepaid_v2") { state.report = await loadReport(); navigate("/report"); return; }
    navigate(completed.nextRoute || "/assessment/completed");
  } catch (requestError) {
    answerSaveQueue.completionStarted = false; state.busy = false; applySaveFailure(requestError); render({ focus: false });
  }
}`;

const APPLY_ASSESSMENT_STATE = `function applyAssessmentState(restored) {
  if (!restored?.assessment) return;
  const nextAssessmentId = restored.assessment.assessmentId;
  const sameAssessment = state.assessmentId === nextAssessmentId;
  const queuedAnswers = sameAssessment
    ? Object.fromEntries([...(answerSaveQueue.inFlight || new Map()), ...answerSaveQueue.pending])
    : {};
  if (!sameAssessment) {
    resetAnswerSaveQueue();
    state.initialResult = null; state.initialResultError = "";
  }
  state.assessmentId = nextAssessmentId;
  state.assessmentStatus = restored.assessment.status;
  state.commercialFlowVersion = restored.assessment.commercialFlowVersion || "legacy_postpaid_v1";
  state.questionnaireVersion = restored.assessment.questionnaireVersion || questionApi.LEGACY_QUESTIONNAIRE_VERSION;
  state.payment = restored.payment || state.payment;
  const serverAnswers = restored.answers || {};
  if (sameAssessment && Object.keys(queuedAnswers).length) {
    const mergedAnswers = { ...serverAnswers, ...queuedAnswers };
    const visibleQuestionIds = new Set(questionApi.visibleQuestions(mergedAnswers, state.questionnaireVersion).map(question => question.id));
    state.answers = Object.fromEntries(Object.entries(mergedAnswers).filter(([questionId]) => visibleQuestionIds.has(questionId)));
  } else state.answers = serverAnswers;
  state.report = restored.report || null;
}`;

function patchState(source) {
  if (!source.includes('saveStatus: "idle"')) {
    source = replaceOnce(
      source,
      'answers: {}, questionIndex: 0, validationError: "",',
      'answers: {}, questionIndex: 0, validationError: "", saveStatus: "idle",',
      "save-status state"
    );
  }
  if (!source.includes("const answerSaveQueue =")) {
    source = replaceOnce(
      source,
      "let paymentPollingStartedAt = 0;",
      "let paymentPollingStartedAt = 0;\nconst answerSaveQueue = { pending: new Map(), inFlight: null, failed: new Map(), worker: null, paused: false, completionStarted: false };",
      "answer save queue"
    );
  }
  source = source.replace(", busy: false, slowSave: false };", ", busy: false };");
  return source;
}

function patchLifecycle(source) {
  source = replaceInsideFunction(source, "startFreeAssessment", "state.assessmentId = assessment.assessmentId;", "resetAnswerSaveQueue();\n    state.assessmentId = assessment.assessmentId;", "free assessment queue reset");
  source = replaceInsideFunction(source, "submitContact", "state.assessmentId = assessment.assessmentId;", "resetAnswerSaveQueue(); state.assessmentId = assessment.assessmentId;", "prepaid assessment queue reset");
  source = replaceInsideFunction(source, "submitConsent", "state.assessmentId = assessment.assessmentId;", "resetAnswerSaveQueue(); state.assessmentId = assessment.assessmentId;", "consent assessment queue reset");
  if (!source.includes('data-action="retry-answer-saves"\')?.addEventListener')) {
    const initialResultRetry = 'root.querySelector(\'[data-action="retry-initial-result"]\')?.addEventListener';
    const invoiceBinding = 'root.querySelector(\'[data-action="create-invoice"]\')?.addEventListener';
    source = source.includes(initialResultRetry)
      ? replaceOnce(source, initialResultRetry, 'root.querySelector(\'[data-action="retry-answer-saves"]\')?.addEventListener("click", retryAnswerSaves);\n  ' + initialResultRetry, "answer-save retry binding")
      : replaceOnce(source, invoiceBinding, 'root.querySelector(\'[data-action="retry-answer-saves"]\')?.addEventListener("click", retryAnswerSaves);\n  ' + invoiceBinding, "answer-save retry binding");
  }
  if (!source.includes("_test: { nextQuestion,")) {
    source = replaceOnce(
      source,
      "_test: { setComingSoon",
      "_test: { nextQuestion, enqueueAnswerSave, pumpAnswerSaveQueue, flushAnswerSaves, retryAnswerSaves, resetAnswerSaveQueue, applyAssessmentState, answerSaveQueue, setComingSoon",
      "answer-save test exports"
    );
  }
  return source;
}

export function applyNonBlockingAnswerSaveV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    source = patchState(source);
    source = replaceNamedFunction(source, "renderQuestions", RENDER_QUESTIONS);
    source = replaceNamedFunction(source, "updateAnswer", UPDATE_ANSWER_AND_QUEUE);
    source = replaceNamedFunction(source, "nextQuestion", NEXT_QUESTION);
    source = replaceNamedFunction(source, "applyAssessmentState", APPLY_ASSESSMENT_STATE);
    source = patchLifecycle(source);
    if (source.includes("state.slowSave") || source.includes("Хариултыг хадгалж байна...")) {
      throw new Error(`Blocking answer-save marker remains: ${appPath}`);
    }
    fs.writeFileSync(appPath, source);
  }
}
