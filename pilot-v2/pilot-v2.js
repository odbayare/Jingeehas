"use strict";
(function pilotApp() {
  const root = document.getElementById("pilot-app");
  const exactCopy = "AI-аар боловсруулж, AI симуляцаар урьдчилан шалгасан туршилтын өөрийгөө үнэлэх асуумж.";
  const limitations = ["Хүнээр психометрийн баталгаажуулалт хийгдээгүй.", "Хүн амын норм тогтоогдоогүй.", "Клиникийн болон сэтгэлзүйн онош биш.", "Эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй.", "Үр дүн нь pilot profile score.", "Өндөр/дунд/бага гэсэн баталгаажсан ангилал биш."];
  const state = { instrument: null, scales: null, assessmentId: sessionStorage.getItem("pilot_v2_assessment") || "", answers: {} };
  const params = new URLSearchParams(location.search);
  if (params.has("pilot_invite")) {
    sessionStorage.setItem("pilot_v2_invite", params.get("pilot_invite"));
    history.replaceState({}, "", location.pathname);
  }
  function headers() {
    const invite = sessionStorage.getItem("pilot_v2_invite");
    return { "content-type": "application/json", ...(invite ? { authorization: `Pilot ${invite}` } : {}) };
  }
  async function api(name, method = "GET", body) {
    const result = await fetch(`/.netlify/functions/${name}`, { method, headers: headers(), credentials: "same-origin", ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await result.json().catch(() => ({}));
    if (!result.ok) throw Object.assign(new Error(payload.error || "request_failed"), { status: result.status });
    return payload;
  }
  function intro(extra = "") {
    return `<p class="eyebrow">PRIVATE SOFTWARE PILOT · V2.1</p><p class="required-copy">${exactCopy}</p><div class="limits"><ul>${limitations.map(item => `<li>${item}</li>`).join("")}</ul></div>${extra}`;
  }
  function denied() {
    root.innerHTML = `<section class="card denied">${intro()}<h1>Хандах эрхгүй</h1><p>Энэ бол хаалттай software pilot. Зөвхөн идэвхтэй owner/admin session эсвэл хугацаатай урилгын холбоосоор нэвтэрнэ.</p><p class="muted">Олон нийтэд бүртгүүлэх, төлбөр төлөх зам байхгүй.</p></section>`;
  }
  async function loadInstrument() {
    if (!state.instrument) { const data = await api("pilot-v2-instrument"); state.instrument = data.instrument; state.scales = data.scales; }
  }
  async function start() {
    if (!state.assessmentId) {
      const data = await api("pilot-v2-assessment", "POST", { action: "start" });
      state.assessmentId = data.assessmentId; sessionStorage.setItem("pilot_v2_assessment", state.assessmentId);
      api("pilot-v2-event", "POST", { eventName: "pilot_started", assessmentId: state.assessmentId }).catch(() => {});
    }
    location.assign("/pilot-v2/questions");
  }
  function landing() {
    root.innerHTML = `<section class="card">${intro()}<h1>Туршилтын профайл үүсгэх</h1><p>49 candidate item-аас бүрдэх энэ хувилбар нь software behavior шалгах зориулалттай. Хариу нь хүний validation evidence болохгүй.</p><div class="actions"><button id="start-pilot">${state.assessmentId ? "Үргэлжлүүлэх" : "Эхлэх"}</button></div></section>`;
    document.getElementById("start-pilot").addEventListener("click", start);
  }
  async function questions() {
    await loadInstrument();
    if (!state.assessmentId) return landing();
    const saved = await api("pilot-v2-assessment", "POST", { action: "load", assessmentId: state.assessmentId });
    state.answers = saved.answers || {};
    root.innerHTML = `<section class="card">${intro()}<h1>Туршилтын асуултууд</h1><p class="progress" id="progress"></p><form id="pilot-form">${state.instrument.items.map((item, index) => {
      const options = state.scales[item.responseScaleId];
      return `<fieldset class="question"><legend>${index + 1}. ${item.itemText}</legend><p class="muted">${item.recallPeriod || ""}</p><div class="options">${options.map(choice => `<label class="option"><input type="radio" name="${item.itemKey}" value="${choice.code}" ${state.answers[item.itemKey] === choice.code ? "checked" : ""}><span>${choice.label}</span></label>`).join("")}</div></fieldset>`;
    }).join("")}<div class="actions"><button type="submit">Хадгалж, үр дүн харах</button></div></form></section>`;
    const form = document.getElementById("pilot-form"); const progress = document.getElementById("progress");
    const update = () => { progress.textContent = `${[...new FormData(form).keys()].length} / ${state.instrument.items.length} хариулсан`; };
    form.addEventListener("change", update); update();
    form.addEventListener("submit", async event => {
      event.preventDefault(); const answers = Object.fromEntries(new FormData(form));
      await api("pilot-v2-assessment", "POST", { action: "save", assessmentId: state.assessmentId, answers });
      await api("pilot-v2-assessment", "POST", { action: "complete", assessmentId: state.assessmentId, context: {}, safety: null });
      api("pilot-v2-event", "POST", { eventName: "pilot_completed", assessmentId: state.assessmentId }).catch(() => {});
      location.assign("/pilot-v2/report");
    });
  }
  const safeText = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  function renderReport(report) {
    const p = report.sections;
    root.innerHTML = `<section class="card ${report.safetyRoute ? "safety" : ""}">${intro()}<h1>${safeText(report.title)}</h1><h2>${safeText(p.howToRead.title)}</h2><p>${safeText(p.howToRead.body)}</p><h2>${safeText(p.profile.title)}</h2>${p.profile.constructs.map(item => `<div class="bar-row"><strong class="bar-name">${safeText(item.name)}</strong><progress max="100" value="${item.transformedScore == null ? 0 : item.transformedScore}">${item.transformedScore == null ? 0 : item.transformedScore}</progress><span>${item.transformedScore == null ? "—" : `${item.transformedScore}`}</span><small class="status">${item.validItems}/${item.totalItems} · ${safeText(item.dataStatus)}</small></div>`).join("")}<p class="muted">${safeText(p.profile.disclaimer)}</p>
    <h2>${safeText(p.endorsed.title)}</h2><p>${safeText(p.endorsed.label)}</p>${p.endorsed.items.length ? `<ul>${p.endorsed.items.map(item => `<li>${safeText(item.label)}</li>`).join("")}</ul>` : "<p>Зэрэглэхэд хангалттай хэмжээст мэдээлэл бүрдээгүй.</p>"}
    <h2>${safeText(p.strengths.title)}</h2><p>${safeText(p.strengths.preliminary)}</p><ul>${p.strengths.items.map(item => `<li>${safeText(item.label)} — ${safeText(item.wording)}</li>`).join("")}</ul>
    <h2>${safeText(p.details.title)}</h2>${p.details.items.map(item => `<article class="detail"><h3>${safeText(item.name)}</h3><p>${safeText(item.measures)}</p><p><strong>${item.aggregateScore == null ? "—" : item.aggregateScore}</strong> · ${item.validItems}/${item.totalItems} · ${safeText(item.dataStatus)}</p><p>${safeText(item.interpretation)}</p><p><em>${safeText(item.reflectionQuestion)}</em></p></article>`).join("")}
    <h2>${safeText(p.context.title)}</h2><p>${safeText(p.context.scoringEffect)}</p><h2>${safeText(p.startingDirection.title)}</h2><p>${safeText(p.startingDirection.body)}</p><h2>${safeText(p.safety.title)}</h2><p>${safeText(p.safety.body)}</p><h2>${safeText(p.limits.title)}</h2><p>${safeText(p.limits.body)}</p><p>${safeText(report.interactions.statement)}</p><h2>${safeText(p.provenance.title)}</h2><dl><dt>Instrument</dt><dd>${safeText(p.provenance.instrumentVersion)}</dd><dt>Scoring</dt><dd>${safeText(p.provenance.scoringVersion)}</dd><dt>Report</dt><dd>${safeText(p.provenance.reportVersion)}</dd><dt>Item-bank SHA-256</dt><dd>${safeText(p.provenance.itemBankSha256)}</dd><dt>Generated</dt><dd>${safeText(p.provenance.generatedAt)}</dd></dl></section>`;
  }
  async function report() {
    if (!state.assessmentId) return landing();
    const saved = await api("pilot-v2-assessment", "POST", { action: "load", assessmentId: state.assessmentId });
    if (!saved.report) return location.assign("/pilot-v2/questions");
    renderReport(saved.report);
    api("pilot-v2-event", "POST", { eventName: "report_opened", assessmentId: state.assessmentId }).catch(() => {});
  }
  async function boot() {
    try {
      await api("pilot-v2-access");
      if (location.pathname.endsWith("/questions")) await questions();
      else if (location.pathname.endsWith("/report")) await report();
      else landing();
    } catch (error) { if (error.status === 401 || error.status === 403 || error.status === 503) denied(); else denied(); }
  }
  boot();
})();
