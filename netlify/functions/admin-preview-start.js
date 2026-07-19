"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { createOwnerPreview } = require("./_lib/preview.js");
const { authenticateSession } = require("./_lib/session.js");
exports.handler = handler("POST", async event => {
  const database = getDatabase();
  const result = await createOwnerPreview(database, event);
  const session = await authenticateSession(database, event, false);
  const drafts = session ? await database.find("assessments", { sessionId: session.id, status: "draft" }) : [];
  return response(201, { ...result.preview, resumeDraft: drafts.length > 0 }, { "set-cookie": result.cookie });
});
