import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASE_GATEWAY } from "./verify-database-config.mjs";

const FORBIDDEN_RESPONSE = /service[_ -]?role|supabase_service_role_key|postgres(?:ql)?|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|stack|trace|secret|bearer\s+[a-z0-9._-]+/i;
const READ_ONLY_BODY = JSON.stringify({ action: "get", table: "certification_records", id: "auth_probe_never_created" });

async function probe(fetchImpl, name, init, expected) {
  const response = await fetchImpl(`${DATABASE_GATEWAY.baseUrl}/transaction`, { ...init, signal: AbortSignal.timeout(8000) });
  const text = await response.text();
  if (response.status >= 200 && response.status < 300) throw new Error(`${name} unexpectedly returned ${response.status}`);
  if (!expected.includes(response.status)) throw new Error(`${name} returned ${response.status}; expected ${expected.join(" or ")}`);
  if (FORBIDDEN_RESPONSE.test(text)) throw new Error(`${name} response exposed internal or sensitive details`);
  return { name, status: response.status };
}

export async function verifyDatabaseGatewayAuth({ fetchImpl = globalThis.fetch } = {}) {
  const common = { method: "POST", headers: { "content-type": "application/json" }, body: READ_ONLY_BODY };
  const missingBearer = await probe(fetchImpl, "missing-bearer", common, [401]);
  const invalidBearer = await probe(fetchImpl, "invalid-bearer", { ...common, headers: { ...common.headers, authorization: "Bearer invalid-certification-token" } }, [401]);
  const getRequest = await probe(fetchImpl, "get-request", { method: "GET" }, [401, 405]);
  return { status: "PASS", gateway: DATABASE_GATEWAY.baseUrl, probes: [missingBearer, invalidBearer, getRequest], operations: "read-only get probe only", databaseRecordCreated: false, realCredentialUsed: false };
}

async function main() {
  try {
    const result = await verifyDatabaseGatewayAuth();
    console.log(`DATABASE_GATEWAY_AUTH_STATUS=${result.status}`);
    for (const probeResult of result.probes) console.log(`${probeResult.name}: PASS (HTTP ${probeResult.status})`);
    console.log("database-record-created: false");
  } catch (error) {
    console.error("DATABASE_GATEWAY_AUTH_STATUS=FAIL");
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
