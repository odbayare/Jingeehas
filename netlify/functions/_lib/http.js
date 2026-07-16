"use strict";

function parseJson(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  try { return JSON.parse(raw); }
  catch { throw Object.assign(new Error("Invalid JSON"), { statusCode: 400, code: "invalid_json" }); }
}

function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
    body: JSON.stringify(body)
  };
}

function cookies(event) {
  const source = event.headers?.cookie || event.headers?.Cookie || "";
  return Object.fromEntries(source.split(";").map(part => part.trim()).filter(Boolean).map(part => {
    const index = part.indexOf("=");
    return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
  }));
}

function handler(method, action) {
  return async event => {
    if (event.httpMethod !== method) return response(405, { error: "method_not_allowed" }, { allow: method });
    try { return await action(event, parseJson(event)); }
    catch (error) {
      const statusCode = Number(error.statusCode) || 500;
      return response(statusCode, { error: error.code || "server_error" });
    }
  };
}

module.exports = { parseJson, response, cookies, handler };
