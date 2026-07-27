"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { hashToken, randomId } = require("./_lib/crypto.js");
const { authenticateOwnerAdmin } = require("./_lib/preview.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const admin = await authenticateOwnerAdmin(database, event);
  const code = String(body.code || "").trim();
  const codeHash = code.length >= 20 && code.length <= 512 ? hashToken(code) : "";
  const rows = codeHash ? await database.find("access_handoffs", { codeHash }) : [];
  const handoff = rows[0];
  let state = "expired";
  if (handoff && !handoff.redeemedAt && new Date(handoff.expiresAt) > new Date()) state = "pending";
  if (handoff?.redeemedAt) {
    const entitlements = await database.find("entitlements", { assessmentId: handoff.assessmentId, status: "active" });
    const assessment = await database.get("assessments", handoff.assessmentId);
    state = entitlements.length ? assessment?.status === "complete" ? "completed" : "paid_available" : "pending";
  }
  await database.insert("admin_audit_logs", { id: randomId("aal_"), adminId: admin.adminId, action: "access_handoff_lookup", targetType: "access_handoff", targetId: handoff?.id || "none", details: { state }, createdAt: new Date().toISOString() });
  return response(200, { state });
});
