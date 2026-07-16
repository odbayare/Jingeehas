import path from "node:path";
import { fileURLToPath } from "node:url";

export function verifyRecoveryConfig(env = process.env) {
  const missing = ["RECOVERY_ENCRYPTION_KEY", "RECOVERY_HASH_PEPPER", "RECOVERY_DELIVERY_API_URL", "RECOVERY_DELIVERY_API_KEY", "RECOVERY_RATE_LIMIT_STORE"].filter(name => !String(env[name] || ""));
  if (missing.length) return { status: "BLOCKED", reason: "Recovery configuration is missing", missing };
  let key;
  try { key = Buffer.from(String(env.RECOVERY_ENCRYPTION_KEY), "base64"); } catch { key = Buffer.alloc(0); }
  if (key.length !== 32) return { status: "FAIL", reason: "RECOVERY_ENCRYPTION_KEY must decode to exactly 32 bytes" };
  if (String(env.RECOVERY_HASH_PEPPER).length < 32) return { status: "FAIL", reason: "RECOVERY_HASH_PEPPER must contain at least 32 characters" };
  let delivery;
  try { delivery = new URL(String(env.RECOVERY_DELIVERY_API_URL)); } catch { return { status: "FAIL", reason: "RECOVERY_DELIVERY_API_URL is invalid" }; }
  if (delivery.protocol !== "https:") return { status: "FAIL", reason: "RECOVERY_DELIVERY_API_URL must use HTTPS" };
  if (env.RECOVERY_RATE_LIMIT_STORE !== "database") return { status: "FAIL", reason: "RECOVERY_RATE_LIMIT_STORE must be database; in-process limits are not production-ready" };
  return { status: "PASS", mode: "configuration-only", channels: ["email", "phone"], deliveryOrigin: delivery.origin, distributedRateLimit: "database", externalMessageSent: false };
}

function main() {
  const result = verifyRecoveryConfig();
  console.log(`RECOVERY_CONFIG_STATUS=${result.status}`);
  console.log(JSON.stringify(result, null, 2));
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
