import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const markers = [`async function ${name}(`, `function ${name}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start >= 0) break;
  }
  if (start < 0) throw new Error(`Answer-save finalizer function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Answer-save finalizer function end missing: ${name}`);
}

const RESET_QUEUE = `function resetAnswerSaveQueue() {
  answerSaveQueue.generation += 1;
  answerSaveQueue.pending.clear(); answerSaveQueue.failed.clear(); answerSaveQueue.inFlight = null; answerSaveQueue.worker = null; answerSaveQueue.paused = false; answerSaveQueue.completionStarted = false;
  state.saveStatus = "idle";
}`;

const PUMP_QUEUE = `function updateAnswerSaveStatus() {
  if (typeof document === "undefined") return;
  const node = document.querySelector(".save-status");
  if (!node) return;
  node.innerHTML = state.saveStatus === "completing" ? "Хариултуудыг нэгтгэж байна..."
    : state.saveStatus === "saving" ? "Хадгалж байна"
    : state.saveStatus === "saved" ? "Хадгалагдлаа"
    : state.saveStatus === "failed" ? 'Хадгалж чадсангүй — <button class="text-link" type="button" data-action="retry-answer-saves">дахин оролдох</button>'
    : "";
  node.querySelector('[data-action="retry-answer-saves"]')?.addEventListener("click", retryAnswerSaves);
}
function pumpAnswerSaveQueue() {
  if (answerSaveQueue.worker || answerSaveQueue.paused || !answerSaveQueue.pending.size || !state.assessmentId) return answerSaveQueue.worker;
  const generation = answerSaveQueue.generation;
  const assessmentId = state.assessmentId;
  const batch = new Map(answerSaveQueue.pending); answerSaveQueue.pending.clear(); answerSaveQueue.inFlight = batch; state.saveStatus = "saving";
  const worker = (async () => {
    try {
      const saved = await api("/.netlify/functions/weight-assessment-save", { method: "PATCH", keepalive: true, body: JSON.stringify({ assessmentId, answers: Object.fromEntries(batch) }) });
      if (answerSaveQueue.generation !== generation || state.assessmentId !== assessmentId || answerSaveQueue.worker !== worker) return;
      for (const [questionId, value] of batch) {
        if (answerSaveQueue.pending.has(questionId) && !sameAnswer(answerSaveQueue.pending.get(questionId), value)) continue;
        if (!saved.savedQuestionIds?.includes(questionId)) throw Object.assign(new Error("answer_not_confirmed"), { body: { error: "answer_not_confirmed", questionId } });
        answerSaveQueue.failed.delete(questionId);
      }
      state.saveStatus = answerSaveQueue.pending.size ? "saving" : "saved";
    } catch (error) {
      if (answerSaveQueue.generation !== generation || state.assessmentId !== assessmentId || answerSaveQueue.worker !== worker) return;
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
      if (answerSaveQueue.generation !== generation || answerSaveQueue.worker !== worker) return;
      answerSaveQueue.inFlight = null; answerSaveQueue.worker = null;
      if (answerSaveQueue.paused) render({ focus: false }); else updateAnswerSaveStatus();
      if (answerSaveQueue.pending.size && !answerSaveQueue.paused) queueMicrotask(pumpAnswerSaveQueue);
    }
  })();
  answerSaveQueue.worker = worker;
  return worker;
}`;

export function applyNonBlockingAnswerSaveFinalizeV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    if (!source.includes("generation: 0")) {
      const from = "const answerSaveQueue = { pending: new Map(), inFlight: null, failed: new Map(), worker: null, paused: false, completionStarted: false };";
      const to = "const answerSaveQueue = { pending: new Map(), inFlight: null, failed: new Map(), worker: null, paused: false, completionStarted: false, generation: 0 };";
      if (!source.includes(from)) throw new Error(`Answer-save queue insertion missing: ${appPath}`);
      source = source.replace(from, to);
    }
    source = replaceNamedFunction(source, "resetAnswerSaveQueue", RESET_QUEUE);
    source = replaceNamedFunction(source, "pumpAnswerSaveQueue", PUMP_QUEUE);
    fs.writeFileSync(appPath, source);
  }
}
