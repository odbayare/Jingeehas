import path from "node:path";
import { fileURLToPath } from "node:url";

export const DATABASE_GATEWAY = Object.freeze({
  baseUrl: "https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway",
  hostname: "nemgfbanmwqudjfzddrn.supabase.co",
  pathname: "/functions/v1/jingeehas-database-gateway",
  transactionPath: "/functions/v1/jingeehas-database-gateway/transaction"
});

function looksLikeSupabaseCredential(value) {
  const candidate = String(value || "");
  return /^sb_(?:publishable|secret)_/i.test(candidate) || /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(candidate);
}

export function databaseConfiguration(env = process.env, { externalCertification = false } = {}) {
  const rawUrl = String(env.JINGEEHAS_DATABASE_API_URL || "").trim();
  const apiKey = String(env.JINGEEHAS_DATABASE_API_KEY || "");
  const missing = [];
  if (!rawUrl) missing.push("JINGEEHAS_DATABASE_API_URL");
  if (!apiKey) missing.push("JINGEEHAS_DATABASE_API_KEY");
  if (!rawUrl) return { status: "BLOCKED", reason: "Database gateway configuration is missing", missing, expectedBaseUrl: DATABASE_GATEWAY.baseUrl };
  let url;
  try { url = new URL(rawUrl); } catch { return { status: "FAIL", reason: "JINGEEHAS_DATABASE_API_URL is invalid" }; }
  if (url.protocol !== "https:") return { status: "FAIL", reason: "JINGEEHAS_DATABASE_API_URL must use HTTPS" };
  if (url.username || url.password || url.search || url.hash) return { status: "FAIL", reason: "Database gateway URL must not contain credentials, query, or fragment" };
  const normalizedPath = url.pathname.replace(/\/+$/, "");
  if (url.hostname !== DATABASE_GATEWAY.hostname) return { status: "FAIL", reason: "Database gateway project hostname does not match the verified Supabase project" };
  if (normalizedPath.endsWith("/transaction")) return { status: "FAIL", reason: "JINGEEHAS_DATABASE_API_URL must be the base URL; the adapter appends /transaction" };
  if (normalizedPath !== DATABASE_GATEWAY.pathname) return { status: "FAIL", reason: "Database gateway Edge Function path does not match jingeehas-database-gateway" };
  const baseUrl = `${url.origin}${normalizedPath}`;
  if (!apiKey) return { status: "BLOCKED", reason: "Dedicated database gateway secret is not injected", missing: ["JINGEEHAS_DATABASE_API_KEY"], baseUrl, finalRequestUrl: `${baseUrl}/transaction` };
  if (!externalCertification) return { status: "FAIL", reason: "JINGEEHAS_DATABASE_API_KEY may be supplied only to the explicit external certification command" };
  if (looksLikeSupabaseCredential(apiKey)) return { status: "FAIL", reason: "Supabase API keys and JWTs are forbidden as database gateway credentials" };
  if (apiKey.length < 48 || /\s/.test(apiKey)) return { status: "FAIL", reason: "Dedicated database gateway secret does not meet the security policy" };
  if (/placeholder|example|changeme/i.test(apiKey) || /^test_/i.test(apiKey)) {
    if (env.NODE_ENV !== "test") return { status: "FAIL", reason: "Placeholder database keys are accepted only in injected test environments" };
  }
  return { status: "READY", baseUrl, finalRequestUrl: `${baseUrl}/transaction`, apiKey };
}

export function verifyDatabaseConfig({ env = process.env } = {}) {
  const result = databaseConfiguration(env, { externalCertification: false });
  if (result.status === "FAIL" && result.reason.includes("may be supplied only")) return result;
  return { ...result, apiKey: undefined, mode: "configuration-only", networkRequestMade: false };
}

function main() {
  const result = verifyDatabaseConfig();
  console.log(`DATABASE_CONFIG_STATUS=${result.status}`);
  console.log(JSON.stringify(result, (key, value) => key === "apiKey" ? undefined : value, 2));
  if (result.status === "FAIL") process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
