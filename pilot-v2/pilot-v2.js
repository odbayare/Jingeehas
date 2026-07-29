"use strict";
(function pilotApp() {
  const root = document.getElementById("pilot-app");
  const exactCopy = "AI-аар боловсруулж, AI симуляцаар урьдчилан шалгасан туршилтын өөрийгөө үнэлэх асуумж.";
  const limitations = ["Хүнээр психометрийн баталгаажуулалт хийгдээгүй.", "Хүн амын норм тогтоогдоогүй.", "Клиникийн болон сэтгэлзүйн онош биш.", "Эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй.", "Үр дүн нь pilot profile score.", "Өндөр/дунд/бага гэсэн баталгаажсан ангилал биш."];
  const state = { instrument: null, scales: null, contextRegistry: null, safetyRegistry: null, sections: [],
    assessmentId: sessionStorage.getItem("pilot_v2_assessment") || "", answers: {}, contextResponses: {}, safetyResponses: {}, currentIndex: 0 };

  function consumeInviteFragment() {
    const fragment = new URLSearchParams(location.hash.slice(1));
    const token = fragment.get("pilot_invite") || "";
    if (token && /^[A-Za-z0-9_-]{20,2048}\.[A-Za-z0-9_-]{20,128}$/.test(token)) sessionStorage.setItem("pilot_v2_invite", token);
    if (location.hash) history.replaceState({}, "", `${location.pathname}${location.search}`);
  }
  consumeInviteFragment();
  function headers() {
    const invite = sessionStorage.getItem("pilot_v2_invite");
    return { "content-type": "application/json", ...(invite ? { authorization: `Pilot ${invite}` } : {}) };
  }
  async function api(name, method = "GET", body) {
    let result;
    try {
      result = await fetch(`/.netlify/functions/${name}`, { method, headers: headers(), credentials: "same-origin",
        referrerPolicy: "same-origin", ...(body ? { body: JSON.stringify(body) } : {}) });
    } catch {
      throw Object.assign(new Error("network_failure"), { status: 0, code: "network_failure" });
    }
    const payload = await result.json().catch(() => ({}));
    if (!result.ok) throw Object.assign(new Error(payload.error || "request_failed"), { status: result.status, code: payload.error || "request_failed" });
    return payload;
  }
  function intro(extra = "") {
    return `<p class="eyebrow">PRIVATE SOFTWARE PILOT · V2.1</p><p class="required-copy">${exactCopy}</p><div class="limits"><ul>${limitations.map(item => `<li>${item}</li>`).join("")}</ul></div>${extra}`;
  }
  function denied(expired = false) {
    root.innerHTML = `<section class="card denied">${intro()}<h1>${expired ? "Урилгын хугацаа дууссан" : "Хандах эрхгүй"}</h1><p>Энэ бол хаалттай software pilot. Зөвхөн идэвхтэй owner/admin session эсвэл хугацаатай урилгын холбоосоор нэвтэрнэ.</p><p class="muted">Олон нийтэд бүртгүүлэх, төлбөр төлөх зам байхгүй.</p></section>`;
  }
  function errorCategory(error, fallback) {
    if (error.code === "pilot_version_mismatch") return "version_mismatch";
    if (error.code === "invalid_pilot_response") return "invalid_response";
    if (error.status === 401) return "expired_invite";
    if (error.status === 0) return "network_failure";
    return fallback;
  }
  function emitError(error, fallback) {
    if (!state.assessmentId) return;
    api("pilot-v2-event", "POST", { eventName: "error_category", assessmentId: state.assessmentId,
      category: errorCategory(error, fallback) }).catch(() => {});
  }
  function showError(error, retry, fallback = "save_failure") {
    emitError(error, fallback);
    if (error.code === "pilot_version_mismatch") {
      root.innerHTML = `<section class="card denied">${intro()}<h1>Хувилбар шинэчлэгдсэн</h1><p>Энэ туршилтын хувилбар шинэчлэгдсэн тул өмнөх хариултыг өөр scoring хувилбараар үргэлжлүүлэхгүй. Шинэ pilot эхлүүлнэ үү.</p><div class="actions"><button id="new-pilot">Шинэ pilot эхлүүлэх</button></div></section>`;
      document.getElementById("new-pilot").addEventListener("click", () => { sessionStorage.removeItem("pilot_v2_assessment"); state.assessmentId = ""; location.assign("/pilot-v2"); });
      return;
    }
    if (error.status === 401) return denied(true);
    root.innerHTML = `<section class="card denied">${intro()}<h1>Үйлдэл амжилтгүй</h1><p>${error.code === "invalid_pilot_response" ? "Хариултын формат тохирохгүй байна." : "Сүлжээ эсвэл хадгалалтын алдаа гарлаа. Хариултыг тайланд ашиглаагүй."}</p><div class="actions"><button id="retry-pilot">Дахин оролдох</button></div></section>`;
    document.getElementById("retry-pilot").addEventListener("click", retry);
  }
  async function loadInstrument() {
    if (!state.instrument) {
      const data = await api("pilot-v2-instrument");
      Object.assign(state, { instrument: data.instrument, scales: data.scales, contextRegistry: data.contextRegistry, safetyRegistry: data.safetyRegistry });
      const constructs = [...new Set(data.instrument.items.filter(item => item.pilotRole === "scored_core_candidate").map(item => item.construct))];
      state.sections = constructs.map(key => ({ key, type: "profile", title: data.instrument.items.find(item => item.construct === key).construct, items: data.instrument.items.filter(item => item.construct === key) }))
        .concat({ key: "research_quality", type: "profile", title: "Судалгааны чанарын асуулт", items: data.instrument.items.filter(item => item.pilotRole === "non_scored_research_quality") },
          { key: "context", type: "context", title: "Нэмэлт нөхцөл", items: data.contextRegistry.items },
          { key: "safety", type: "safety", title: "Аюулгүй байдлын тусдаа шалгалт", items: data.safetyRegistry.items });
    }
  }
  async function start() {
    try {
      if (!state.assessmentId) {
        const data = await api("pilot-v2-assessment", "POST", { action: "start" });
        state.assessmentId = data.assessmentId; sessionStorage.setItem("pilot_v2_assessment", state.assessmentId);
        api("pilot-v2-event", "POST", { eventName: "pilot_started", assessmentId: state.assessmentId }).catch(() => {});
      }
      location.assign("/pilot-v2/questions");
    } catch (error) { showError(error, start, "network_failure"); }
  }
  function landing() {
    root.innerHTML = `<section class="card">${intro()}<h1>Туршилтын профайл үүсгэх</h1><p>49 candidate item, тусдаа нэмэлт нөхцөл болон аюулгүй байдлын модулиас бүрдэх software pilot. Хариу нь хүний validation evidence болохгүй.</p><div class="actions"><button id="start-pilot">${state.assessmentId ? "Үргэлжлүүлэх" : "Эхлэх"}</button></div></section>`;
    document.getElementById("start-pilot").addEventListener("click", start);
  }
  function selectedFor(section, itemKey) {
    return section.type === "context" ? state.contextResponses[itemKey] : section.type === "safety" ? state.safetyResponses[itemKey] : state.answers[itemKey];
  }
  function renderOptions(section, item) {
    const options = section.type === "profile" ? state.scales[item.responseScaleId] : item.options;
    return options.map(choice => `<label class="option"><input type="radio" name="${item.itemKey}" value="${choice.code}" ${selectedFor(section, item.itemKey) === choice.code ? "checked" : ""}><span>${choice.label}</span></label>`).join("");
  }
  function sectionPrompt(section, item, index) {
    return `<fieldset class="question"><legend>${index + 1}. ${item.itemText || item.prompt}</legend>${item.recallPeriod ? `<p class="muted">${item.recallPeriod}</p>` : ""}<div class="options">${renderOptions(section, item)}</div></fieldset>`;
  }
  async function emitSectionReached(section) {
    const marker = `pilot_v2_reached_${state.assessmentId}_${section.key}`;
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    api("pilot-v2-event", "POST", { eventName: "section_reached", assessmentId: state.assessmentId, section: section.key }).catch(() => sessionStorage.removeItem(marker));
  }
  function renderSection() {
    const section = state.sections[state.currentIndex];
    if (!section) return completePilot();
    root.innerHTML = `<section class="card">${intro()}<p class="progress">Хэсэг ${state.currentIndex + 1} / ${state.sections.length}</p><h1>${section.title}</h1>${section.type === "context" ? "<p>Эдгээр хариулт профайлын оноонд нөлөөлөхгүй.</p>" : ""}${section.type === "safety" ? "<p>Энэ тусдаа модуль профайлын оноо болон analytics-д орохгүй.</p>" : ""}<form id="pilot-section-form">${section.items.map((item, index) => sectionPrompt(section, item, index)).join("")}<p id="save-state" class="save-state" role="status">Хариултаа сонгоод хэсгийг хадгална уу.</p><div class="actions">${state.currentIndex ? '<button type="button" class="secondary" id="previous-section">Өмнөх</button>' : ""}<button type="submit">Хадгалж үргэлжлүүлэх</button></div></form></section>`;
    if (state.currentIndex) document.getElementById("previous-section").addEventListener("click", () => { state.currentIndex -= 1; renderSection(); });
    document.getElementById("pilot-section-form").addEventListener("submit", event => saveSection(event, section));
    emitSectionReached(section);
  }
  async function saveSection(event, section) {
    event.preventDefault();
    const form = event.currentTarget; const saveState = document.getElementById("save-state"); const submit = form.querySelector('button[type="submit"]');
    const values = Object.fromEntries(new FormData(form));
    if (section.type === "safety" && Object.keys(values).length !== section.items.length) {
      saveState.textContent = "Аюулгүй байдлын бүх асуултад хариулна уу."; return;
    }
    saveState.textContent = "Хадгалж байна…"; submit.disabled = true;
    const payload = { action: "save", assessmentId: state.assessmentId, lastCompletedSection: section.key,
      answers: section.type === "profile" ? values : {}, contextResponses: section.type === "context" ? values : {},
      safetyResponses: section.type === "safety" ? values : {} };
    try {
      await api("pilot-v2-assessment", "POST", payload);
      if (section.type === "profile") Object.assign(state.answers, values);
      if (section.type === "context") Object.assign(state.contextResponses, values);
      if (section.type === "safety") Object.assign(state.safetyResponses, values);
      saveState.textContent = "Хадгалагдлаа."; state.currentIndex += 1; renderSection();
    } catch (error) {
      saveState.textContent = "Хадгалж чадсангүй. Дахин оролдоно уу."; submit.disabled = false;
      emitError(error, "save_failure");
    }
  }
  async function completePilot() {
    root.innerHTML = `<section class="card">${intro()}<h1>Тайлан үүсгэж байна</h1><p>Зөвхөн серверт хадгалсан, шалгагдсан хариултыг ашиглана.</p></section>`;
    try {
      await api("pilot-v2-assessment", "POST", { action: "complete", assessmentId: state.assessmentId });
      api("pilot-v2-event", "POST", { eventName: "pilot_completed", assessmentId: state.assessmentId }).catch(() => {});
      location.assign("/pilot-v2/report");
    } catch (error) { showError(error, completePilot, "completion_failure"); }
  }
  async function questions() {
    try {
      await loadInstrument();
      if (!state.assessmentId) return landing();
      const saved = await api("pilot-v2-assessment", "POST", { action: "load", assessmentId: state.assessmentId });
      state.answers = saved.answers || {}; state.contextResponses = saved.contextResponses || {}; state.safetyResponses = saved.safetyResponses || {};
      const lastIndex = state.sections.findIndex(section => section.key === saved.lastCompletedSection);
      state.currentIndex = lastIndex >= 0 ? Math.min(lastIndex + 1, state.sections.length) : 0;
      if (saved.status === "complete") return location.assign("/pilot-v2/report");
      renderSection();
    } catch (error) { showError(error, questions, "network_failure"); }
  }
  const safeText = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  function renderReport(report) {
    const p = report.sections;
    const safetyFirst = report.safetyRoute ? `<div class="safety"><h2>${safeText(p.safety.title)}</h2><p>${safeText(p.safety.body)}</p></div>` : "";
    root.innerHTML = `<section class="card ${report.safetyRoute ? "safety-report" : ""}">${intro()}<h1>${safeText(report.title)}</h1>${safetyFirst}<h2>${safeText(p.howToRead.title)}</h2><p>${safeText(p.howToRead.body)}</p><h2>${safeText(p.profile.title)}</h2>${p.profile.constructs.map(item => `<div class="bar-row"><strong class="bar-name">${safeText(item.name)}</strong><progress max="100" value="${item.nativeScore == null ? 0 : item.nativeScore}">${item.nativeScore == null ? 0 : item.nativeScore}</progress><span>${item.nativeScore == null ? "—" : `${item.nativeScore}`}</span><small class="status">${item.validItems}/${item.totalItems} · ${safeText(item.dataStatus)} · ${safeText(item.constructOrientation)}</small></div>`).join("")}<p class="muted">${safeText(p.profile.disclaimer)}</p>
    <h2>${safeText(p.endorsed.title)}</h2><p>${safeText(p.endorsed.label)}</p>${p.endorsed.items.length ? `<ul>${p.endorsed.items.map(item => `<li>${safeText(item.label)}</li>`).join("")}</ul>` : "<p>Энэ хэсгийн ердийн тайлбарыг үзүүлэхгүй.</p>"}
    <h2>${safeText(p.strengths.title)}</h2><p>${safeText(p.strengths.preliminary)}</p>${p.strengths.items.length ? `<ul>${p.strengths.items.map(item => `<li>${safeText(item.label)} — ${safeText(item.wording)}</li>`).join("")}</ul>` : "<p>Энэ хэсгийн ердийн тайлбарыг үзүүлэхгүй.</p>"}
    <h2>${safeText(p.details.title)}</h2>${p.details.items.map(item => `<article class="detail"><h3>${safeText(item.name)}</h3><p>${safeText(item.measures)}</p><p><strong>${item.nativeScore == null ? "—" : item.nativeScore}</strong> · ${item.validItems}/${item.totalItems} · ${safeText(item.dataStatus)}</p><p>${safeText(item.scoreMeaning)}</p><p>${safeText(item.interpretation)}</p><p><em>${safeText(item.reflectionQuestion)}</em></p></article>`).join("")}
    <h2>${safeText(p.context.title)}</h2>${p.context.facts.length ? `<ul>${p.context.facts.map(fact => `<li>${safeText(fact)}</li>`).join("")}</ul>` : "<p>Нэмэлт нөхцөл тэмдэглээгүй.</p>"}<p>${safeText(p.context.scoringEffect)}</p><h2>${safeText(p.startingDirection.title)}</h2><p>${safeText(p.startingDirection.body)}</p>${report.safetyRoute ? "" : `<h2>${safeText(p.safety.title)}</h2><p>${safeText(p.safety.body)}</p>`}<h2>${safeText(p.limits.title)}</h2><p>${safeText(p.limits.body)}</p><p>${safeText(report.interactions.statement)}</p><h2>${safeText(p.provenance.title)}</h2><dl><dt>Instrument</dt><dd>${safeText(p.provenance.instrumentVersion)}</dd><dt>Scoring</dt><dd>${safeText(p.provenance.scoringVersion)}</dd><dt>Report</dt><dd>${safeText(p.provenance.reportVersion)}</dd><dt>Item-bank SHA-256</dt><dd>${safeText(p.provenance.itemBankHash)}</dd><dt>Generated</dt><dd>${safeText(p.provenance.generatedAt)}</dd></dl></section>`;
  }
  async function report() {
    try {
      if (!state.assessmentId) return landing();
      const saved = await api("pilot-v2-assessment", "POST", { action: "load", assessmentId: state.assessmentId });
      if (!saved.report) return location.assign("/pilot-v2/questions");
      renderReport(saved.report);
      api("pilot-v2-event", "POST", { eventName: "report_opened", assessmentId: state.assessmentId }).catch(() => {});
    } catch (error) { showError(error, report, "network_failure"); }
  }
  async function boot() {
    try {
      await api("pilot-v2-access");
      if (location.pathname.endsWith("/questions")) await questions();
      else if (location.pathname.endsWith("/report")) await report();
      else landing();
    } catch (error) { if (error.status === 401 || error.status === 403 || error.status === 503) denied(error.status === 401 && Boolean(sessionStorage.getItem("pilot_v2_invite"))); else showError(error, boot, "network_failure"); }
  }
  boot();
})();
