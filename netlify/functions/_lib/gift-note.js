"use strict";
const crypto = require("node:crypto");
function key() {
  const secret = process.env.JINGEEHAS_DATABASE_API_KEY || "";
  if (secret.length < 48) throw Object.assign(new Error("gift_note_unavailable"), { code: "gift_note_unavailable", statusCode: 503 });
  return Buffer.from(crypto.hkdfSync("sha256", secret, "jingeehas", "gift-note-v1", 32));
}
function sealNote(note) {
  if (!note) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  cipher.setAAD(Buffer.from("jingeehas-gift-note-v1"));
  const encrypted = Buffer.concat([cipher.update(note, "utf8"), cipher.final()]);
  return `v1.${Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url")}`;
}
function openNote(value) {
  if (!value) return "";
  try {
    if (!/^v1\.[A-Za-z0-9_-]+$/.test(value)) return "";
    const bytes = Buffer.from(value.slice(3), "base64url");
    const cipher = crypto.createDecipheriv("aes-256-gcm", key(), bytes.subarray(0, 12));
    cipher.setAAD(Buffer.from("jingeehas-gift-note-v1"));
    cipher.setAuthTag(bytes.subarray(12, 28));
    return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString("utf8");
  } catch { return ""; } // Missing/rotated key or tampering never consumes a gift.
}
module.exports = { sealNote, openNote };
