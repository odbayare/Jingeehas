import path from "node:path";
import { fileURLToPath } from "node:url";

function csv(value) { return String(value || "").split(",").map(item => item.trim().toLowerCase()).filter(Boolean); }
export function verifyQPayConfig(env = process.env) {
  const required = ["QPAY_API_BASE_URL", "QPAY_CLIENT_ID", "QPAY_CLIENT_SECRET", "QPAY_INVOICE_CODE", "QPAY_CALLBACK_ORIGIN", "QPAY_ALLOWED_APP_SCHEMES", "QPAY_ALLOWED_HTTPS_HOSTS"];
  const missing = required.filter(name => !String(env[name] || ""));
  if (missing.length) return { status: "BLOCKED", reason: "QPay sandbox configuration is missing", missing, externalRequestMade: false };
  let base;
  let callback;
  try { base = new URL(String(env.QPAY_API_BASE_URL)); callback = new URL(String(env.QPAY_CALLBACK_ORIGIN)); }
  catch { return { status: "FAIL", reason: "QPay base or callback URL is invalid", externalRequestMade: false }; }
  if (base.protocol !== "https:" || callback.protocol !== "https:" || base.username || base.password || callback.username || callback.password) return { status: "FAIL", reason: "QPay base and callback origins must be credential-free HTTPS URLs", externalRequestMade: false };
  if (callback.pathname !== "/" || callback.search || callback.hash) return { status: "FAIL", reason: "QPAY_CALLBACK_ORIGIN must be an HTTPS origin without a path, query, or fragment", externalRequestMade: false };
  const schemes = csv(env.QPAY_ALLOWED_APP_SCHEMES);
  const hosts = csv(env.QPAY_ALLOWED_HTTPS_HOSTS);
  if (schemes.some(value => !/^[a-z][a-z0-9+.-]{1,30}$/.test(value) || ["http", "https", "javascript", "data", "file"].includes(value))) return { status: "FAIL", reason: "QPAY_ALLOWED_APP_SCHEMES contains an unsafe or invalid scheme", externalRequestMade: false };
  if (hosts.some(value => value.includes(":") || value.includes("/") || !/^(?:[a-z0-9-]+\.)*[a-z0-9-]+$/.test(value))) return { status: "FAIL", reason: "QPAY_ALLOWED_HTTPS_HOSTS must contain hostnames only", externalRequestMade: false };
  return { status: "PASS", mode: "configuration-only", baseOrigin: base.origin, callbackOrigin: callback.origin, allowedSchemeCount: schemes.length, allowedHostCount: hosts.length, productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, externalRequestMade: false };
}

function main() {
  const result = verifyQPayConfig();
  console.log(`QPAY_CONFIG_STATUS=${result.status}`);
  console.log(JSON.stringify(result, null, 2));
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
