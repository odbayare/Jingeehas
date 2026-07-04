const MOCK_BACKEND_STORAGE_KEY = "weightLossMockBackendState";

const PRODUCT_AMOUNTS = {
  one_time: 9900,
  seven_day: 29000,
  upgrade: 19900
};

const COACH_PARTNER = {
  standardPriceMnt: 9900,
  coachPriceMnt: 9900,
  defaultCommissionMnt: 4000
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
    event: 0,
    feedback: 0,
    coach: 0,
    coachClient: 0,
    coachSession: 0,
    commission: 0,
    reportAccess: 0,
    audit: 0
  },
  sessions: [],
  assessments: [],
  payments: [],
  entitlements: [],
  leadIntents: [],
  feedbackRecords: [],
  coachAccounts: [],
  coachClients: [],
  coachSessions: [],
  coachCommissionLedger: [],
  coachReportAccessLogs: [],
  auditLogs: [],
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
  state.feedbackRecords = Array.isArray(state.feedbackRecords) ? state.feedbackRecords : [];
  state.coachAccounts = Array.isArray(state.coachAccounts) ? state.coachAccounts : [];
  state.coachClients = Array.isArray(state.coachClients) ? state.coachClients : [];
  state.coachSessions = Array.isArray(state.coachSessions) ? state.coachSessions : [];
  state.coachCommissionLedger = Array.isArray(state.coachCommissionLedger) ? state.coachCommissionLedger : [];
  state.coachReportAccessLogs = Array.isArray(state.coachReportAccessLogs) ? state.coachReportAccessLogs : [];
  state.auditLogs = Array.isArray(state.auditLogs) ? state.auditLogs : [];
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

function normalizeEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function stableHash(value = "") {
  let hash = 5381;
  String(value).split("").forEach(char => {
    hash = ((hash << 5) + hash) + char.charCodeAt(0);
    hash >>>= 0;
  });
  return hash.toString(16).padStart(8, "0");
}

function hashSecret(secret, salt) {
  return `mock_hash_${salt}_${stableHash(`${salt}:${secret}`)}`;
}

function generateSecret(prefix = "WT") {
  return `${prefix}-${Math.random().toString(36).slice(2, 6)}-${Date.now().toString(36).slice(-4)}`;
}

function auditLog(state, attrs = {}) {
  const timestamp = nowIso();
  const row = {
    id: nextId(state, "audit", "aud"),
    actor_type: attrs.actor_type || "system",
    actor_id: attrs.actor_id || null,
    action: attrs.action || "unknown",
    target_type: attrs.target_type || null,
    target_id: attrs.target_id || null,
    metadata_json: clone(attrs.metadata_json || {}),
    created_at: timestamp
  };
  state.auditLogs.push(row);
  return row;
}

function hashInviteToken(token) {
  return hashSecret(token, "coach_invite");
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

function createAssessment(assessmentType = "one_time", attrs = {}) {
  const session = getCurrentSession();
  const state = readState();
  const timestamp = nowIso();
  const assessment = {
    id: nextId(state, "assessment", "asmt"),
    session_id: session.id,
    assessment_type: assessmentType,
    user_email_normalized: normalizeEmail(attrs.userEmail || attrs.user_email_normalized || ""),
    coach_client_id: attrs.coachClientId || attrs.coach_client_id || null,
    coach_id: attrs.coachId || attrs.coach_id || null,
    share_with_coach: Boolean(attrs.shareWithCoach || attrs.share_with_coach),
    status: "started",
    report_mode: "mode1",
    safety_mode: "mode1",
    primary_mechanism: null,
    secondary_mechanisms_json: [],
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
  assessment.safety_mode = result.safety_mode || result.report_mode || assessment.safety_mode || assessment.report_mode || "mode1";
  assessment.primary_mechanism = result.primary_mechanism || assessment.primary_mechanism || null;
  assessment.secondary_mechanisms_json = Array.isArray(result.secondary_mechanisms_json)
    ? clone(result.secondary_mechanisms_json)
    : (assessment.secondary_mechanisms_json || []);
  assessment.confirmed_summaries_json = clone(result.confirmed_summaries_json || assessment.confirmed_summaries_json || {});
  assessment.evidence_json = clone(result.evidence_json || assessment.evidence_json || {});
  assessment.report_json = result.report_json ? clone(result.report_json) : assessment.report_json;
  assessment.report_text = result.report_text || assessment.report_text || "";
  assessment.completed_at = nowIso();
  if (assessment.coach_client_id) {
    const coachClient = state.coachClients.find(client => client.id === assessment.coach_client_id);
    if (coachClient) {
      coachClient.status = assessment.safety_mode === "mode4" ? "restricted_safety" : "completed";
      coachClient.updated_at = assessment.completed_at;
    }
  }
  writeState(state);
  return clone(assessment);
}

function createMockPayment(productType, assessmentId = null, attrs = {}) {
  if (!Object.prototype.hasOwnProperty.call(PRODUCT_AMOUNTS, productType)) {
    throw new Error(`Unsupported product type: ${productType}`);
  }
  const session = getCurrentSession();
  const state = readState();
  const timestamp = nowIso();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const coachClient = attrs.coachClientId
    ? state.coachClients.find(client => client.id === attrs.coachClientId)
    : null;
  const isCoachDiscount = productType === "one_time" && Boolean(coachClient || attrs.coachId);
  const commissionMnt = isCoachDiscount
    ? Number(attrs.commissionMnt || coachClient?.commission_mnt || COACH_PARTNER.defaultCommissionMnt)
    : 0;
  const amountMnt = isCoachDiscount ? COACH_PARTNER.coachPriceMnt : PRODUCT_AMOUNTS[productType];
  const payment = {
    id: nextId(state, "payment", "pay"),
    session_id: session.id,
    assessment_id: assessmentId,
    product_type: productType,
    product_code: productType === "one_time" ? "WEIGHT_TEST_ONE_TIME" : productType,
    user_email_normalized: normalizeEmail(attrs.userEmail || ""),
    coach_id: attrs.coachId || coachClient?.coach_id || null,
    coach_client_id: attrs.coachClientId || coachClient?.id || null,
    amount_mnt: amountMnt,
    base_price_mnt: productType === "one_time" ? COACH_PARTNER.standardPriceMnt : PRODUCT_AMOUNTS[productType],
    discount_amount_mnt: isCoachDiscount ? COACH_PARTNER.standardPriceMnt - COACH_PARTNER.coachPriceMnt : 0,
    commission_mnt: commissionMnt,
    status: "pending",
    provider: "mock",
    mock_invoice_id: nextId(state, "payment", "mock_inv"),
    invoice_id: null,
    sender_invoice_no: null,
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
  if (payment.coach_id && payment.coach_client_id) {
    createCommissionFromPayment(state, payment);
  }
  writeState(state);
  return clone(created);
}

function createCommissionFromPayment(state, payment) {
  const existing = state.coachCommissionLedger.find(row => row.payment_id === payment.id);
  if (existing) return existing;
  const commissionMnt = Number(payment.commission_mnt || COACH_PARTNER.defaultCommissionMnt);
  const row = {
    id: nextId(state, "commission", "comm"),
    coach_id: payment.coach_id,
    coach_client_id: payment.coach_client_id,
    payment_id: payment.id,
    assessment_id: payment.assessment_id || null,
    gross_paid_mnt: payment.amount_mnt,
    commission_mnt: commissionMnt,
    platform_share_mnt: Number(payment.amount_mnt || 0) - commissionMnt,
    status: "pending",
    created_at: nowIso(),
    approved_at: null,
    paid_out_at: null
  };
  state.coachCommissionLedger.push(row);
  const coachClient = state.coachClients.find(client => client.id === payment.coach_client_id);
  if (coachClient) {
    coachClient.status = "paid";
    coachClient.updated_at = row.created_at;
  }
  auditLog(state, {
    actor_type: "system",
    action: "coach_commission_created",
    target_type: "coach_commission_ledger",
    target_id: row.id,
    metadata_json: { payment_id: payment.id, commission_mnt: commissionMnt }
  });
  return row;
}

function markMockPaymentPaid(paymentId) {
  const state = readState();
  const payment = state.payments.find(item => item.id === paymentId);
  if (!payment) throw new Error(`Payment not found: ${paymentId}`);
  if (payment.status !== "paid") {
    payment.status = "paid";
    payment.paid_at = nowIso();
  }
  writeState(state);
  createEntitlementFromPayment(payment);
  return getPaymentStatus(paymentId);
}

function refundMockPayment(paymentId) {
  const state = readState();
  const payment = state.payments.find(item => item.id === paymentId);
  if (!payment) throw new Error(`Payment not found: ${paymentId}`);
  payment.status = "refunded";
  const commission = state.coachCommissionLedger.find(row => row.payment_id === payment.id);
  if (commission) commission.status = "void";
  auditLog(state, {
    actor_type: "system",
    action: "payment_refunded",
    target_type: "payment",
    target_id: payment.id
  });
  writeState(state);
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

function createCoachAccount(attrs = {}) {
  const email = normalizeEmail(attrs.email);
  if (!email) throw new Error("Coach email is required");
  const state = readState();
  const existing = state.coachAccounts.find(coach => coach.email_normalized === email);
  if (existing) throw new Error("Coach email already exists");
  const timestamp = nowIso();
  const temporaryPassword = generateSecret("COACH");
  const passwordSalt = nextId(state, "coach", "salt");
  const coach = {
    id: nextId(state, "coach", "coach"),
    email_normalized: email,
    display_name: String(attrs.displayName || attrs.display_name || email).trim(),
    phone: attrs.phone || "",
    password_hash: hashSecret(temporaryPassword, passwordSalt),
    password_salt: passwordSalt,
    role: "coach",
    status: "active",
    must_change_password: true,
    commission_mnt: Number(attrs.commissionMnt || attrs.commission_mnt || COACH_PARTNER.defaultCommissionMnt),
    created_by_admin_id: attrs.createdByAdminId || attrs.created_by_admin_id || "super-admin",
    created_at: timestamp,
    updated_at: timestamp,
    last_login_at: null
  };
  state.coachAccounts.push(coach);
  auditLog(state, {
    actor_type: "admin",
    actor_id: coach.created_by_admin_id,
    action: "coach_created",
    target_type: "coach_account",
    target_id: coach.id
  });
  writeState(state);
  return { coach: clone(coach), temporaryPassword };
}

function sanitizeCoach(coach) {
  if (!coach) return null;
  const copy = clone(coach);
  delete copy.password_hash;
  delete copy.password_salt;
  return copy;
}

function listCoachAccounts() {
  return readState().coachAccounts.map(sanitizeCoach);
}

function setCoachStatus(coachId, status) {
  const state = readState();
  const coach = state.coachAccounts.find(item => item.id === coachId);
  if (!coach) throw new Error("Coach not found");
  coach.status = status;
  coach.updated_at = nowIso();
  auditLog(state, {
    actor_type: "admin",
    action: `coach_${status}`,
    target_type: "coach_account",
    target_id: coach.id
  });
  writeState(state);
  return sanitizeCoach(coach);
}

function resetCoachPassword(coachId) {
  const state = readState();
  const coach = state.coachAccounts.find(item => item.id === coachId);
  if (!coach) throw new Error("Coach not found");
  const temporaryPassword = generateSecret("RESET");
  coach.password_salt = nextId(state, "coach", "salt");
  coach.password_hash = hashSecret(temporaryPassword, coach.password_salt);
  coach.must_change_password = true;
  coach.updated_at = nowIso();
  auditLog(state, {
    actor_type: "admin",
    action: "coach_password_reset",
    target_type: "coach_account",
    target_id: coach.id
  });
  writeState(state);
  return { coach: sanitizeCoach(coach), temporaryPassword };
}

function loginCoach(email, password) {
  const state = readState();
  const normalized = normalizeEmail(email);
  const coach = state.coachAccounts.find(item => item.email_normalized === normalized);
  if (!coach || coach.status !== "active") throw new Error("Invalid coach login");
  if (coach.password_hash !== hashSecret(password, coach.password_salt)) throw new Error("Invalid coach login");
  const timestamp = nowIso();
  const session = {
    id: nextId(state, "coachSession", "csess"),
    token: generateSecret("coach_session"),
    coach_id: coach.id,
    role: "coach",
    created_at: timestamp,
    expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
  };
  coach.last_login_at = timestamp;
  state.coachSessions.push(session);
  auditLog(state, {
    actor_type: "coach",
    actor_id: coach.id,
    action: "coach_login",
    target_type: "coach_account",
    target_id: coach.id
  });
  writeState(state);
  return { session: clone(session), coach: sanitizeCoach(coach) };
}

function getCoachBySessionToken(token) {
  const state = readState();
  const session = state.coachSessions.find(item => item.token === token && new Date(item.expires_at).getTime() > Date.now());
  if (!session) throw new Error("Coach session not found");
  const coach = state.coachAccounts.find(item => item.id === session.coach_id && item.status === "active");
  if (!coach) throw new Error("Coach not active");
  return { state, session, coach };
}

function createCoachClient(tokenOrCoachId, attrs = {}) {
  const stateFromToken = stateFromCoachTokenOrId(tokenOrCoachId);
  const state = stateFromToken.state;
  const coach = stateFromToken.coach;
  const email = normalizeEmail(attrs.clientEmail || attrs.client_email_normalized || attrs.email);
  if (!email) throw new Error("Client email is required");
  const duplicate = state.coachClients.find(client =>
    client.coach_id === coach.id &&
    client.client_email_normalized === email &&
    !["revoked", "expired"].includes(client.status)
  );
  if (duplicate) throw new Error("Active client invite already exists");
  const timestamp = nowIso();
  const inviteToken = generateSecret("invite");
  const client = {
    id: nextId(state, "coachClient", "cclient"),
    coach_id: coach.id,
    client_email_normalized: email,
    client_name: attrs.clientName || attrs.client_name || "",
    note: attrs.note || "",
    invite_token_hash: hashInviteToken(inviteToken),
    status: "invited",
    share_report_consent: false,
    consent_at: null,
    commission_mnt: Number(attrs.commissionMnt || coach.commission_mnt || COACH_PARTNER.defaultCommissionMnt),
    created_at: timestamp,
    updated_at: timestamp
  };
  state.coachClients.push(client);
  auditLog(state, {
    actor_type: "coach",
    actor_id: coach.id,
    action: "coach_client_created",
    target_type: "coach_client",
    target_id: client.id
  });
  writeState(state);
  return {
    client: clone(client),
    inviteToken,
    inviteLink: `/weight?coachInvite=${encodeURIComponent(inviteToken)}`
  };
}

function stateFromCoachTokenOrId(tokenOrCoachId) {
  const state = readState();
  const session = state.coachSessions.find(item => item.token === tokenOrCoachId && new Date(item.expires_at).getTime() > Date.now());
  const coachId = session?.coach_id || tokenOrCoachId;
  const coach = state.coachAccounts.find(item => item.id === coachId && item.status === "active");
  if (!coach) throw new Error("Coach not found");
  return { state, session, coach };
}

function listCoachClients(tokenOrCoachId) {
  const { state, coach } = stateFromCoachTokenOrId(tokenOrCoachId);
  return clone(state.coachClients.filter(client => client.coach_id === coach.id));
}

function resolveCoachInvitation({ email = "", inviteToken = "" } = {}) {
  const state = readState();
  const normalized = normalizeEmail(email);
  const tokenHash = inviteToken ? hashInviteToken(inviteToken) : "";
  const client = state.coachClients.find(item =>
    !["revoked", "expired"].includes(item.status) &&
    ((tokenHash && item.invite_token_hash === tokenHash) || (normalized && item.client_email_normalized === normalized))
  );
  if (!client) {
    return {
      matched: false,
      price_mnt: COACH_PARTNER.standardPriceMnt,
      standard_price_mnt: COACH_PARTNER.standardPriceMnt,
      coach_price_mnt: COACH_PARTNER.coachPriceMnt
    };
  }
  const coach = state.coachAccounts.find(item => item.id === client.coach_id);
  return {
    matched: true,
    coach: sanitizeCoach(coach),
    client: clone(client),
    price_mnt: COACH_PARTNER.coachPriceMnt,
    standard_price_mnt: COACH_PARTNER.standardPriceMnt,
    coach_price_mnt: COACH_PARTNER.coachPriceMnt
  };
}

function acceptCoachInvitation({ coachClientId = "", inviteToken = "", email = "", consent = false } = {}) {
  const state = readState();
  const tokenHash = inviteToken ? hashInviteToken(inviteToken) : "";
  const normalized = normalizeEmail(email);
  const client = state.coachClients.find(item =>
    item.id === coachClientId ||
    (tokenHash && item.invite_token_hash === tokenHash) ||
    (normalized && item.client_email_normalized === normalized)
  );
  if (!client) throw new Error("Coach invitation not found");
  const timestamp = nowIso();
  client.status = "started";
  client.share_report_consent = Boolean(consent);
  client.consent_at = consent ? timestamp : null;
  client.updated_at = timestamp;
  auditLog(state, {
    actor_type: "system",
    action: consent ? "coach_invite_accepted_with_consent" : "coach_invite_declined_consent",
    target_type: "coach_client",
    target_id: client.id
  });
  writeState(state);
  return {
    client: clone(client),
    price_mnt: consent ? COACH_PARTNER.coachPriceMnt : COACH_PARTNER.standardPriceMnt,
    share_with_coach: Boolean(consent)
  };
}

function linkAssessmentToCoach(assessmentId, attrs = {}) {
  const state = readState();
  const assessment = findAssessment(state, assessmentId);
  if (!assessment) throw new Error(`Assessment not found: ${assessmentId}`);
  const client = state.coachClients.find(item => item.id === attrs.coachClientId);
  if (!client) throw new Error("Coach client not found");
  assessment.coach_client_id = client.id;
  assessment.coach_id = client.coach_id;
  assessment.user_email_normalized = normalizeEmail(attrs.userEmail || client.client_email_normalized);
  assessment.share_with_coach = Boolean(attrs.shareWithCoach && client.share_report_consent);
  client.status = "started";
  client.updated_at = nowIso();
  writeState(state);
  return clone(assessment);
}

function getCoachDashboard(tokenOrCoachId) {
  const { state, coach } = stateFromCoachTokenOrId(tokenOrCoachId);
  const clients = state.coachClients.filter(client => client.coach_id === coach.id);
  const payments = state.payments.filter(payment => payment.coach_id === coach.id);
  const paidPayments = payments.filter(payment => payment.status === "paid");
  const commissions = state.coachCommissionLedger.filter(row => row.coach_id === coach.id);
  const assessments = state.assessments.filter(assessment => assessment.coach_id === coach.id);
  return clone({
    coach: sanitizeCoach(coach),
    summary: {
      addedClientsCount: clients.length,
      paidClientsCount: new Set(paidPayments.map(payment => payment.coach_client_id)).size,
      completedReportsCount: assessments.filter(assessment => ["completed", "report_ready", "unlocked"].includes(assessment.status) || assessment.completed_at).length,
      totalPaidAmountMnt: paidPayments.reduce((sum, payment) => sum + Number(payment.amount_mnt || 0), 0),
      coachCommissionTotalMnt: commissions.reduce((sum, row) => sum + Number(row.commission_mnt || 0), 0),
      pendingPayoutMnt: commissions.filter(row => row.status === "pending").reduce((sum, row) => sum + Number(row.commission_mnt || 0), 0),
      paidOutCommissionMnt: commissions.filter(row => row.status === "paid_out").reduce((sum, row) => sum + Number(row.commission_mnt || 0), 0)
    },
    clients,
    completedAssessments: assessments.filter(assessment => assessment.completed_at),
    commissionLedger: commissions
  });
}

function viewCoachReport(tokenOrCoachId, assessmentId) {
  const stateFromToken = stateFromCoachTokenOrId(tokenOrCoachId);
  const state = stateFromToken.state;
  const coach = stateFromToken.coach;
  const assessment = state.assessments.find(item => item.id === assessmentId);
  const payment = state.payments.find(item => item.assessment_id === assessmentId && item.status === "paid");
  let accessResult = "denied";
  let reason = "Тайлан хараахан гараагүй байна.";
  let payload = { allowed: false, reason };

  if (!assessment || assessment.coach_id !== coach.id) {
    reason = "Энэ тайлан таны хэрэглэгчид хамаарахгүй байна.";
  } else if (!assessment.share_with_coach) {
    reason = "Энэ үйлчлүүлэгч дүгнэлтээ coach-той хуваалцахыг зөвшөөрөөгүй байна.";
  } else if (!payment) {
    reason = "Төлбөр баталгаажаагүй байна.";
  } else if (!assessment.completed_at && !assessment.report_text) {
    reason = "Тайлан хараахан гараагүй байна.";
  } else if (assessment.safety_mode === "mode4" || assessment.report_mode === "mode4") {
    reason = "Энэ үнэлгээ ердийн жин хасалтын дүгнэлт гаргаагүй. Аюулгүй байдлын чиглэл илэрсэн тул дэлгэрэнгүй дүгнэлт coach цэсэнд харагдахгүй.";
  } else {
    accessResult = "allowed";
    reason = "";
    payload = {
      allowed: true,
      assessment_id: assessment.id,
      client_email_normalized: assessment.user_email_normalized,
      report_mode: assessment.report_mode,
      safety_mode: assessment.safety_mode,
      report_text: assessment.report_text,
      paid_amount_mnt: payment.amount_mnt,
      commission_mnt: payment.commission_mnt,
      report_date: assessment.completed_at
    };
  }

  if (!payload.allowed) payload = { allowed: false, reason };
  const log = {
    id: nextId(state, "reportAccess", "ralog"),
    coach_id: coach.id,
    assessment_id: assessmentId || null,
    client_email_normalized: assessment?.user_email_normalized || "",
    viewed_at: nowIso(),
    access_result: accessResult,
    reason: payload.reason || null
  };
  state.coachReportAccessLogs.push(log);
  auditLog(state, {
    actor_type: "coach",
    actor_id: coach.id,
    action: "coach_report_view",
    target_type: "weight_assessment",
    target_id: assessmentId,
    metadata_json: { access_result: accessResult, reason: payload.reason || null }
  });
  writeState(state);
  return clone({ ...payload, accessLog: log });
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

function createTesterFeedback(attrs = {}) {
  const state = readState();
  const timestamp = nowIso();
  const feedback = {
    id: nextId(state, "feedback", "fb"),
    createdAt: timestamp,
    internalTest: true,
    assessmentType: "weight-test",
    reportMode: attrs.reportMode || "",
    primaryMechanism: attrs.primaryMechanism || null,
    secondaryMechanisms: Array.isArray(attrs.secondaryMechanisms) ? attrs.secondaryMechanisms : [],
    safetyMode: attrs.safetyMode || attrs.reportMode || "",
    feedback: { ...(attrs.feedback || {}) }
  };
  state.feedbackRecords.push(feedback);
  writeState(state);
  return clone(feedback);
}

function getTesterFeedbackRecords() {
  return clone(readState().feedbackRecords);
}

function clearTesterFeedbackRecords() {
  const state = readState();
  state.feedbackRecords = [];
  writeState(state);
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
  COACH_PARTNER,
  startSession,
  getCurrentSession,
  createAssessment,
  saveAssessmentAnswers,
  completeAssessment,
  createMockPayment,
  markMockPaymentPaid,
  refundMockPayment,
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
  createCoachAccount,
  listCoachAccounts,
  setCoachStatus,
  resetCoachPassword,
  loginCoach,
  createCoachClient,
  listCoachClients,
  resolveCoachInvitation,
  acceptCoachInvitation,
  linkAssessmentToCoach,
  getCoachDashboard,
  viewCoachReport,
  createTesterFeedback,
  getTesterFeedbackRecords,
  clearTesterFeedbackRecords,
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
