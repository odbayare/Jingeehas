"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateOwnerPreviewStrict } = require("./_lib/preview.js");
exports.handler = handler("GET", async event => {
  const preview = await authenticateOwnerPreviewStrict(getDatabase(), event);
  return response(200, { active: true, expiresAt: preview.expiresAt });
});
