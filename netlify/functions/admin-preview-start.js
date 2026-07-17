"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { createOwnerPreview } = require("./_lib/preview.js");
const { sessionCookie } = require("./_lib/session.js");
exports.handler = handler("POST", async event => {
  const result = await createOwnerPreview(getDatabase(), event);
  return response(201, result.preview, {}, { "set-cookie": [result.cookie, sessionCookie("", 0)] });
});
