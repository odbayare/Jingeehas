"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateOwnerAdmin } = require("./_lib/preview.js");

const DATE = /^\d{4}-\d{2}-\d{2}$/;
exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerAdmin(database, event);
  const query = event.queryStringParameters || {};
  if (!DATE.test(query.startDate || "") || !DATE.test(query.endDate || "") || query.startDate > query.endDate) {
    throw Object.assign(new Error("Invalid date range"), { statusCode: 400, code: "invalid_date_range" });
  }
  const days = Math.floor((Date.parse(`${query.endDate}T00:00:00Z`) - Date.parse(`${query.startDate}T00:00:00Z`)) / 86400000) + 1;
  if (days < 1 || days > 366) throw Object.assign(new Error("Date range too large"), { statusCode: 400, code: "invalid_date_range" });
  const analytics = await database.getDailyFunnelAnalytics(query.startDate, query.endDate);
  return response(200, { timeZone: "Asia/Ulaanbaatar", days: analytics.days, summary: analytics.summary });
});
