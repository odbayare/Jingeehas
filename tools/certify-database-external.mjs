import path from "node:path";
import { fileURLToPath } from "node:url";
import { databaseConfiguration } from "./verify-database-config.mjs";

function operationLogger(log, name, passed, detail = "") { log(`${name}: ${passed ? "PASS" : "FAIL"}${detail ? ` (${detail})` : ""}`); }

export async function certifyDatabaseExternal({ env = process.env, fetchImpl = globalThis.fetch, log = console.log } = {}) {
  if (env.JINGEEHAS_EXTERNAL_DATABASE_CERTIFICATION !== "approved") throw new Error("External database certification is not approved");
  const config = databaseConfiguration(env, { externalCertification: true });
  if (config.status !== "READY") throw new Error(config.reason);
  const certificationId = `cert_gateway_${crypto.randomUUID()}`;
  const rollbackId = `cert_gateway_rollback_${crypto.randomUUID()}`;
  const kind = `external_gateway_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const request = async operation => {
    const response = await fetchImpl(config.finalRequestUrl, { method: "POST", headers: { authorization: `Bearer ${config.apiKey}`, "content-type": "application/json" }, body: JSON.stringify(operation), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`Gateway returned HTTP ${response.status}`);
    return response.json();
  };
  const record = { id: certificationId, kind, status: "inserted", details: { lifecycle: "external_gateway" }, createdAt: now };
  let lifecycleError = null;
  let cleanupConfirmed = false;
  try {
    const inserted = await request({ action: "insert", table: "certification_records", row: record });
    operationLogger(log, "insert", inserted?.id === certificationId);
    if (inserted?.id !== certificationId) throw new Error("Insert verification failed");
    const read = await request({ action: "get", table: "certification_records", id: certificationId });
    operationLogger(log, "get", read?.id === certificationId);
    if (read?.id !== certificationId) throw new Error("Get verification failed");
    const updated = await request({ action: "update", table: "certification_records", id: certificationId, patch: { status: "updated", details: { lifecycle: "external_gateway", updated: true } } });
    operationLogger(log, "update", updated?.status === "updated");
    if (updated?.status !== "updated") throw new Error("Update verification failed");
    const found = await request({ action: "find", table: "certification_records", filters: { kind, status: "updated" } });
    operationLogger(log, "find", Array.isArray(found) && found.length === 1 && found[0].id === certificationId);
    if (!Array.isArray(found) || found.length !== 1 || found[0].id !== certificationId) throw new Error("Find verification failed");
    await request({ action: "delete", table: "certification_records", id: certificationId });
    operationLogger(log, "delete", true);
    const deleted = await request({ action: "get", table: "certification_records", id: certificationId });
    operationLogger(log, "confirm-delete", deleted == null);
    if (deleted != null) throw new Error("Deleted certification record remains");
    const rollback = await request({ action: "transaction", rollback: true, operations: [{ action: "insert", table: "certification_records", row: { ...record, id: rollbackId, status: "rollback" } }] });
    operationLogger(log, "rollback", rollback?.rolledBack === true);
    if (rollback?.rolledBack !== true) throw new Error("Rollback was not confirmed");
    const rolledBack = await request({ action: "get", table: "certification_records", id: rollbackId });
    operationLogger(log, "confirm-rollback", rolledBack == null);
    if (rolledBack != null) throw new Error("Rollback record persisted");
  } catch (error) { lifecycleError = error; }
  try {
    await request({ action: "delete", table: "certification_records", id: certificationId }).catch(() => null);
    await request({ action: "delete", table: "certification_records", id: rollbackId }).catch(() => null);
    const [first, second, residual] = await Promise.all([
      request({ action: "get", table: "certification_records", id: certificationId }),
      request({ action: "get", table: "certification_records", id: rollbackId }),
      request({ action: "find", table: "certification_records", filters: { kind } })
    ]);
    cleanupConfirmed = first == null && second == null && Array.isArray(residual) && residual.length === 0;
    operationLogger(log, "cleanup", cleanupConfirmed);
  } catch { operationLogger(log, "cleanup", false); }
  if (!cleanupConfirmed) throw new Error("Certification cleanup could not be confirmed");
  if (lifecycleError) throw lifecycleError;
  return { status: "PASS", operations: ["insert", "get", "update", "find", "delete", "confirm-delete", "rollback", "confirm-rollback", "cleanup"], residualRecords: 0 };
}

async function main() {
  try {
    const result = await certifyDatabaseExternal();
    console.log(`DATABASE_EXTERNAL_CERTIFICATION_STATUS=${result.status}`);
  } catch (error) {
    console.error("DATABASE_EXTERNAL_CERTIFICATION_STATUS=FAIL");
    console.error(error.message);
    process.exitCode = 1;
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
