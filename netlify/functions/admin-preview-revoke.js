"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { revokeOwnerPreview, previewCookie } = require("./_lib/preview.js");
exports.handler = handler("POST", async event => {
  await revokeOwnerPreview(getDatabase(), event);
  return response(200, { revoked: true }, { "set-cookie": previewCookie("", 0) });
});
