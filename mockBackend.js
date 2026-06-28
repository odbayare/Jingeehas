const MOCK_BACKEND_STORAGE_KEY = "weightLossMockBackendState";

const PRODUCT_AMOUNTS = {
  one_time: 9900,
  seven_day: 29000,
  upgrade: 19900
};

const hasBrowserStorage = typeof window !== "undefined" && Boolean(window.localStorage);

const emptyState = () => ({
  currentSessionId: null,
  counters: {
    session: 0,
    assessment: 0,
    payment: 0,
    entitlement: 0,
    lead: 0,
    event: 0
  },
  sessions: [],
  assessments: [],
  payments: [],
  entitlements: [],
  leadIntents: [],
  events: []
});

let memoryState = emptyState();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readState() {
  if (!hasBrowserStorage) return normalizeState(memoryState);
  try {
    const stored = window.localStorage.getItem(MOCK_BACKEND_STORAGE_KEY);
    return stored ? normalizeState(JSON.parse(stored)) : emptyState();
  } catch {
    return emptyState();
  }
}

function writeState(nextState) {
  memoryState = normalizeState(nextState);
  if (!hasBrowserStorage) return;
  window.localStorage.setItem(MOCK_BACKEND_STORAGE_KEY, JSON.stringify(memoryState));
}

function normalizeState(input) {
  const base = emptyState();
  const state = { ...base, ...(input || {}) };
  state.counters = { ...base.counters, ...(input?.counters || {}) };
  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.assessments = Array.isArray(state.assessments) ? state.assessments : [];
  state.payments = Array.isArray(state.payments) ? state.payments : [];
  state.entitlements = Array.isArray(state.entitlements) ? state.entitlements : [];
  state.leadIntents = Array.isArray(state.leadIntents) ? state.leadIntents : [];
  state.events = Array.isArray(state.events) ? state.events : [];
  return state;
}

function nowIso() {
  return new Date().toISOString();
}

function nextId(state, type, prefix) {
  state.counters[type] += 1;
  return `${prefix}_${String(state.counters[type]).padStart(4, "0")}`;
}

function startSession() {
  const state = readState();
  if (state.currentSessionId) {
    const current = state.sessions.find(session => session.id === state.currentSessionId);
    if (current) return clone(current);
  }

  const timestamp = nowIso();
  const session = {
    id: nextId(state, "session", "sess"),
    anonymous_session_id: nextId(state, "session", "anon"),
    created_at: timestamp,
    updated_at: timestamp
  };
  state.sessions.push(session);
  state.currentSessionId = session.id;
  writeState(state);
  return clone(session);
}

function getCurrentSession() {
  const state = readState();
  const session = state.sessions.find(item => item.id === state.currentSessionId);
  return session ? clone(session) : startSession();
}

function createAssessment(assessmentType = "one_time") {
  const session = getCurrentSession();
  const state = readState();
  const timestamp = nowIso();
  const assessment = {
    id: nextId(state, "assessment", "asmt"),
    session_id: session.id,
    assessment_type: assessmentType,
    status: "started",
    report_mode: "mode1",
    answers_json: {},
    confirmed_summaries_json: {},
    evidence_json: {},
    report_json: null,
    report_text: "",
    created_at: timestamp,
    completed_at: null
  };
  state.currentSessionId = session.id;
  state.assessments.push(assessment);
  writeState(state);
  return clone(assessment);
}

function findAssessment(state, assessmentId) {
  return state.assessments.find(assessment => assessment.id === assessmentId);
}

function saveAssessmentAnswers(assessmentId, answers = {}) {
  const state = readState();
  const assessment = findAssessment(state, assessmentId);
  if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);
  assessment.answers_json = clone(answers);
  writeState(state);
  return clone(assessment);
}

function completeAssessment(assessmentId, result = {}) {
  const state = readState();
  const assessment = findAssessment(state, assessmentId);
  if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);
  assessment.status = result.status || "completed";
  assessment.report_mode = result.report_mode || assessment.report_mode || "mode1";
  assessment.confirmed_summaries_json = clone(result.confirmed_summaries_json || assessment.confirmed_summaries_json || {});
  assessment.evidence_json = clone(result.evidence_json || assessment.evidence_json || {});
  assessment.report_json = result.report_json ? clone(result.report_json) : assessment.report_json;
  assessment.report_text = result.report_text || assessment.report_text || "";
  assessment.completed_at = nowIso();
  writeState(state);
  return clone(assessment);
}

function createMockPayment(productType, assessmentId = null) {
  if (!Object.prototype.hasOwnProperty.call(PRODUCT_AMOUNTS, productType)) {
    throw new Error(`Unsupported product type: ${productType}`);
  }
  const session = getCurrentSession();
  const state = readState();
  const timestamp = nowIso();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const payment = {
    id: nextId(state, "payment", "pay"),
    session_id: session.id,
    assessment_id: assessmentId,
    product_type: productType,
    amount_mnt: PRODUCT_AMOUNTS[productType],
    status: "pending",
    provider: "mock",
    mock_invoice_id: nextId(state, "payment", "mock_inv"),
    created_at: timestamp,
    paid_at: null,
    expires_at: expiresAt
  };
  state.currentSessionId = session.id;
  state.payments.push(payment);
  writeState(state);
  return clone(payment);
}

function createEntitlement(state, attrs) {
  const existing = state.entitlements.find(entitlement =>
    entitlement.session_id === attrs.session_id &&
    entitlement.entitlement_type === attrs.entitlement_type &&
    entitlement.assessment_id === (attrs.assessment_id || null) &&
    entitlement.status === "active"
  );
  if (existing) return existing;

  const entitlement = {
    id: nextId(state, "entitlement", "ent"),
    session_id: attrs.session_id,
    entitlement_type: attrs.entitlement_type,
    assessment_id: attrs.assessment_id || null,
    payment_id: attrs.payment_id || null,
    status: "active",
    created_at: nowIso(),
    expires_at: attrs.expires_at || null
  };
  state.entitlements.push(entitlement);
  return entitlement;
}

function createEntitlementFromPayment(paymentInput) {
  const state = readState();
  const payment = state.payments.find(item => item.id === paymentInput.id);
  if (!payment) throw new Error(`Payment not found: ${paymentInput.id}`);
  if (payment.status !== "paid") throw new Error("Payment must be paid before entitlement creation");

  const created = [];
  if (payment.product_type === "one_time") {
    created.push(createEntitlement(state, {
      session_id: payment.session_id,
      entitlement_type: "one_time_report",
      assessment_id: payment.assessment_id,
      payment_id: payment.id
    }));
  }
  if (payment.product_type === "seven_day") {
    created.push(createEntitlement(state, {
      session_id: payment.session_id,
      entitlement_type: "seven_day_access",
      assessment_id: payment.assessment_id,
      payment_id: payment.id
    }));
  }
  if (payment.product_type === "upgrade") {
    created.push(createEntitlement(state, {
      session_id: payment.session_id,
      entitlement_type: "upgrade_access",
      assessment_id: payment.assessment_id,
      payment_id: payment.id
    }));
    created.push(createEntitlement(state, {
      session_id: payment.session_id,
      entitlement_type: "seven_day_access",
      assessment_id: payment.assessment_id,
      payment_id: payment.id
    }));
  }
  writeState(state);
  return clone(created);
}

function markMockPaymentPaid(paymentId) {
  const state = readState();
  const payment = state.payments.find(item => item.id === paymentId);
  if (!payment) throw new Error(`Payment not found: ${paymentId}`);
  payment.status = "paid";
  payment.paid_at = nowIso();
  writeState(state);
  createEntitlementFromPayment(payment);
  return getPaymentStatus(paymentId);
}

function getPaymentStatus(paymentId) {
  const state = readState();
  const payment = state.payments.find(item => item.id === paymentId);
  if (!payment) throw new Error(`Payment not found: ${paymentId}`);
  return clone({
    payment,
    entitlements: state.entitlements.filter(entitlement => entitlement.payment_id === payment.id)
  });
}

function getEntitlements(sessionId = getCurrentSession().id) {
  const state = readState();
  return clone(state.entitlements.filter(entitlement =>
    entitlement.session_id === sessionId &&
    entitlement.status === "active" &&
    (!entitlement.expires_at || new Date(entitlement.expires_at).getTime() > Date.now())
  ));
}

function hasEntitlement(type, assessmentId = null) {
  return getEntitlements().some(entitlement =>
    entitlement.entitlement_type === type &&
    (!assessmentId || !entitlement.assessment_id || entitlement.assessment_id === assessmentId)
  );
}

function createProfessionalSummaryEntitlement(assessmentId = null) {
  const session = getCurrentSession();
  const state = readState();
  const entitlement = createEntitlement(state, {
    session_id: session.id,
    entitlement_type: "professional_summary",
    assessment_id: assessmentId,
    payment_id: null
  });
  writeState(state);
  return clone(entitlement);
}

function getAccessState(assessmentId = null) {
  return {
    hasOneTimeReportAccess: hasEntitlement("one_time_report", assessmentId),
    hasSevenDayAccess: hasEntitlement("seven_day_access", assessmentId),
    hasUpgradeAccess: hasEntitlement("upgrade_access", assessmentId),
    hasProfessionalSummaryAccess: hasEntitlement("professional_summary", assessmentId)
  };
}

function canAccessProfessionalSummary(reportMode, assessmentId = null) {
  return reportMode === "mode3" || hasEntitlement("professional_summary", assessmentId);
}

function canAccessUrgentSafety(reportMode) {
  return reportMode === "mode4";
}

function canShowUpgradeCta(reportMode) {
  return reportMode !== "mode4";
}

function canGenerateSevenDayReport(diaryEntries = []) {
  return Array.isArray(diaryEntries) && diaryEntries.length >= 5;
}

function trackEvent(eventType, attrs = {}) {
  const state = readState();
  const event = {
    id: nextId(state, "event", "evt"),
    eventType,
    productType: attrs.productType || null,
    sourceScreen: attrs.sourceScreen || null,
    assessmentId: attrs.assessmentId || null,
    createdAt: nowIso()
  };
  state.events.push(event);
  writeState(state);
  return clone(event);
}

function createLeadIntent(data) {
  if (!data?.contact || !String(data.contact).trim()) {
    throw new Error("Contact is required for lead intent");
  }
  const state = readState();
  const lead = {
    id: nextId(state, "lead", "lead"),
    productType: data.productType,
    productLabel: data.productLabel,
    priceMnt: data.priceMnt,
    name: data.name || "",
    contact: String(data.contact).trim(),
    willingness: data.willingness || "unspecified",
    comment: data.comment || "",
    sourceScreen: data.sourceScreen || null,
    assessmentId: data.assessmentId || null,
    createdAt: nowIso()
  };
  state.leadIntents.push(lead);
  state.events.push({
    id: nextId(state, "event", "evt"),
    eventType: "lead_submit",
    productType: lead.productType,
    sourceScreen: lead.sourceScreen,
    assessmentId: lead.assessmentId,
    createdAt: lead.createdAt
  });
  writeState(state);
  return clone(lead);
}

function getLeadIntents() {
  return clone(readState().leadIntents);
}

function clearLeadIntents() {
  const state = readState();
  state.leadIntents = [];
  writeState(state);
}

function summarizeLeadIntents() {
  const state = readState();
  const summary = {
    totalLeads: state.leadIntents.length,
    paidCtaClicks: state.events.filter(event => event.eventType === "paid_cta_click").length,
    leadSubmits: state.events.filter(event => event.eventType === "lead_submit").length,
    demoUnlocks: state.events.filter(event => event.eventType === "demo_unlock").length,
    byProduct: {},
    willingness: {},
    comments: []
  };
  state.leadIntents.forEach(lead => {
    if (!summary.byProduct[lead.productType]) {
      summary.byProduct[lead.productType] = {
        count: 0,
        totalPriceMnt: 0,
        averagePriceMnt: 0
      };
    }
    summary.byProduct[lead.productType].count += 1;
    summary.byProduct[lead.productType].totalPriceMnt += Number(lead.priceMnt || 0);
    summary.willingness[lead.willingness] = (summary.willingness[lead.willingness] || 0) + 1;
    if (lead.comment) summary.comments.push({ productType: lead.productType, comment: lead.comment });
  });
  Object.values(summary.byProduct).forEach(product => {
    product.averagePriceMnt = product.count ? Math.round(product.totalPriceMnt / product.count) : 0;
  });
  return clone(summary);
}

function resetMockBackend() {
  memoryState = emptyState();
  if (hasBrowserStorage) window.localStorage.removeItem(MOCK_BACKEND_STORAGE_KEY);
}

function getMockBackendState() {
  return clone(readState());
}

const api = {
  PRODUCT_AMOUNTS,
  startSession,
  getCurrentSession,
  createAssessment,
  saveAssessmentAnswers,
  completeAssessment,
  createMockPayment,
  markMockPaymentPaid,
  getPaymentStatus,
  createEntitlementFromPayment,
  getEntitlements,
  hasEntitlement,
  createProfessionalSummaryEntitlement,
  getAccessState,
  canAccessProfessionalSummary,
  canAccessUrgentSafety,
  canShowUpgradeCta,
  canGenerateSevenDayReport,
  trackEvent,
  createLeadIntent,
  getLeadIntents,
  clearLeadIntents,
  summarizeLeadIntents,
  resetMockBackend,
  getMockBackendState
};

if (typeof window !== "undefined") {
  window.MockBackend = api;
}

if (typeof module !== "undefined") {
  module.exports = api;
}
