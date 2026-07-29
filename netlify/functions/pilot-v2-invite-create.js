"use strict";
const crypto = require("node:crypto");
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot, createInvite } = require("./_lib/pilot-v2-access.js");
const safetyConfig = require("./_lib/pilot-v2-safety-config.js");
exports.handler = handler("POST", async (event, body) => {
  const access = await authorizePilot(getDatabase(), event);
  if (access.kind !== "admin" || !access.owner) throw Object.assign(new Error("Forbidden"), { statusCode: 403, code: "owner_required" });
  if (safetyConfig.reviewStatus !== "approved" || process.env.PILOT_V2_HUMAN_INVITES_ENABLED !== "true") {
    throw Object.assign(new Error("Human pilot invites are disabled"), { statusCode: 403, code: "human_invites_disabled" });
  }
  const expiresAt = new Date(Date.now() + Math.min(Math.max(Number(body.expiresInHours || 24), 1), 168) * 3600000);
  const token = createInvite({ expiresAt, inviteId: crypto.randomUUID() });
  return response(201, { token, inviteUrl: `/pilot-v2#pilot_invite=${encodeURIComponent(token)}`, expiresAt: expiresAt.toISOString() });
});
