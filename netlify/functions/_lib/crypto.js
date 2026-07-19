"use strict";

const nodeCrypto = require("node:crypto");

function randomToken(prefix = "") {
  return `${prefix}${nodeCrypto.randomBytes(32).toString("base64url")}`;
}

function randomId(prefix = "") {
  return `${prefix}${nodeCrypto.randomUUID()}`;
}

function randomDigits(length = 6) {
  const maximum = 10 ** length;
  return String(nodeCrypto.randomInt(0, maximum)).padStart(length, "0");
}

function hashToken(value) {
  return nodeCrypto.createHash("sha256").update(String(value)).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && nodeCrypto.timingSafeEqual(a, b);
}

module.exports = { randomToken, randomId, randomDigits, hashToken, safeEqual };
