import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { hashPassword } = require("../netlify/functions/_lib/auth.js");
const { randomId } = require("../netlify/functions/_lib/crypto.js");
const { normalizeEmail } = require("../netlify/functions/_lib/recovery.js");
const { RestDatabaseAdapter } = require("../netlify/functions/_lib/store.js");
const CONFIRMATION = "CREATE FIRST JINGEEHAS ADMIN";

export function validateStrongPassword(password, email = "") {
  const value = String(password || "");
  if (value.length < 16 || value.length > 200 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value) || value.toLowerCase().includes(String(email).split("@")[0].toLowerCase())) {
    throw new Error("Password must be 16-200 characters with upper/lowercase, number, symbol, and must not contain the email name");
  }
}

export async function bootstrapAdmin({ database, email, password, apply = false, rotate = false, confirmation = "", now = new Date() }) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("A valid explicit admin email is required");
  validateStrongPassword(password, normalized);
  if (apply && confirmation !== CONFIRMATION) throw new Error("Production safety confirmation is absent");
  const active = await database.find("admin_accounts", { status: "active" });
  const target = active.find(row => row.email === normalized);
  if (active.length && !rotate) throw new Error("An active administrator already exists; use the explicit rotation procedure");
  if (rotate && !target) throw new Error("Rotation requires an existing active administrator with the supplied email");
  const action = rotate ? "admin_password_rotated" : "initial_admin_created";
  if (!apply) return { status: "PREPARED", dryRun: true, action, email: normalized, writes: 0 };

  const adminId = target?.id || randomId("admin_");
  const accountOperation = target
    ? { action: "update", table: "admin_accounts", id: adminId, patch: { passwordHash: hashPassword(password), updatedAt: now.toISOString() } }
    : { action: "insert", table: "admin_accounts", row: { id: adminId, email: normalized, passwordHash: hashPassword(password), status: "active", createdAt: now.toISOString(), updatedAt: now.toISOString() } };
  const auditOperation = { action: "insert", table: "admin_audit_logs", row: { id: randomId("aal_"), adminId, action, targetType: "admin_account", targetId: adminId, details: { method: "privileged_bootstrap" }, createdAt: now.toISOString() } };
  await database.transaction([accountOperation, auditOperation]);
  return { status: "PASS", dryRun: false, action, email: normalized, adminId, writes: 2 };
}

function parseArguments(argv) {
  if (argv.some(arg => arg === "--password" || arg.startsWith("--password="))) throw new Error("Password command-line arguments are forbidden; use --password-stdin");
  const allowed = new Set(["--apply", "--rotate", "--password-stdin", "--email"]);
  const options = { apply: false, rotate: false, passwordStdin: false, email: "" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!allowed.has(arg)) throw new Error(`Unknown argument: ${arg}`);
    if (arg === "--apply") options.apply = true;
    else if (arg === "--rotate") options.rotate = true;
    else if (arg === "--password-stdin") options.passwordStdin = true;
    else if (arg === "--email") options.email = String(argv[++index] || "");
  }
  if (!options.passwordStdin) throw new Error("--password-stdin is required");
  return options;
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const password = fs.readFileSync(0, "utf8").replace(/[\r\n]+$/, "");
    const database = new RestDatabaseAdapter();
    const result = await bootstrapAdmin({ database, email: options.email, password, apply: options.apply, rotate: options.rotate,
      confirmation: process.env.ADMIN_BOOTSTRAP_SAFETY_CONFIRMATION || "" });
    console.log(`ADMIN_BOOTSTRAP_STATUS=${result.status}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("ADMIN_BOOTSTRAP_STATUS=FAIL");
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
