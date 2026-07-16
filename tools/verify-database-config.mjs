import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function expectedSchema(schemaText = fs.readFileSync(path.join(root, "database", "schema.sql"), "utf8")) {
  const tables = {};
  for (const match of schemaText.matchAll(/create table\s+(\w+)\s*\(([\s\S]*?)\n\);/gi)) {
    const columns = match[2].split("\n").map(line => line.trim()).filter(line => /^[a-z][a-z0-9_]*\s+/i.test(line) && !/^(primary|foreign|unique|check|constraint)\b/i.test(line)).map(line => line.match(/^([a-z][a-z0-9_]*)/i)[1]);
    tables[match[1]] = columns;
  }
  return tables;
}

export function databaseConfiguration(env = process.env) {
  const url = String(env.JINGEEHAS_DATABASE_API_URL || "").replace(/\/+$/, "");
  const apiKey = String(env.JINGEEHAS_DATABASE_API_KEY || "");
  const missing = [];
  if (!url) missing.push("JINGEEHAS_DATABASE_API_URL");
  if (!apiKey) missing.push("JINGEEHAS_DATABASE_API_KEY");
  if (url && !url.startsWith("https://")) return { status: "FAIL", reason: "JINGEEHAS_DATABASE_API_URL must use HTTPS", missing: [] };
  return missing.length ? { status: "BLOCKED", reason: "Database configuration is missing", missing } : { status: "READY", url, apiKey, missing: [] };
}

async function request(fetchImpl, config, pathName, init = {}) {
  const response = await fetchImpl(`${config.url}${pathName}`, { ...init, headers: { authorization: `Bearer ${config.apiKey}`, ...(init.headers || {}) }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Database certification request failed with HTTP ${response.status}`);
  return response.json();
}

export async function verifyDatabaseConfig({ env = process.env, externalCertification = false, fetchImpl = globalThis.fetch } = {}) {
  const config = databaseConfiguration(env);
  if (config.status !== "READY") return config;
  if (!externalCertification) return { status: "BLOCKED", reason: "Configuration shape is valid; external database certification was not enabled", missing: ["--external-certification"] };

  const health = await request(fetchImpl, config, "/health", { method: "GET" });
  if (health.status !== "ok") throw new Error("Database health check did not return status=ok");
  const schema = await request(fetchImpl, config, "/transaction", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "schema" }) });
  const expected = expectedSchema();
  const remoteTables = schema.tables || {};
  const missingTables = Object.keys(expected).filter(table => !remoteTables[table]);
  const missingColumns = Object.entries(expected).flatMap(([table, columns]) => columns.filter(column => !new Set(remoteTables[table]?.columns || []).has(column)).map(column => `${table}.${column}`));
  if (missingTables.length || missingColumns.length) return { status: "FAIL", reason: "Database schema is incomplete", missingTables, missingColumns };

  const id = `cert_db_${crypto.randomUUID()}`;
  const rollbackId = `cert_db_rollback_${crypto.randomUUID()}`;
  const record = { id, kind: "staging_database", status: "disposable", details: { purpose: "certification" }, createdAt: new Date().toISOString() };
  const operation = body => request(fetchImpl, config, "/transaction", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  try {
    await operation({ action: "insert", table: "certification_records", row: record });
    const readBack = await operation({ action: "get", table: "certification_records", id });
    if (readBack?.id !== id) throw new Error("Certification record read-back failed");
    const rollback = await operation({ action: "transaction", rollback: true, operations: [{ action: "insert", table: "certification_records", row: { ...record, id: rollbackId } }] });
    if (rollback.rolledBack !== true) throw new Error("Database adapter did not confirm transaction rollback");
    if (await operation({ action: "get", table: "certification_records", id: rollbackId })) throw new Error("Rollback certification record persisted");
  } finally {
    await operation({ action: "delete", table: "certification_records", id }).catch(() => null);
  }
  if (await operation({ action: "get", table: "certification_records", id })) throw new Error("Disposable certification record cleanup failed");
  const storeSource = fs.readFileSync(path.join(root, "netlify", "functions", "_lib", "store.js"), "utf8");
  if (!storeSource.includes('process.env.NODE_ENV === "test"') || /return new MemoryDatabaseAdapter\s*\(/.test(storeSource)) throw new Error("Production database can fall back to memory");
  return { status: "PASS", health: "ok", schemaVersion: "2026071601_initial_certifiable_schema", tableCount: Object.keys(expected).length, disposableRecord: "created/read/deleted", rollback: "verified", productionMemoryFallback: "disabled" };
}

async function main() {
  try {
    const result = await verifyDatabaseConfig({ externalCertification: process.argv.includes("--external-certification") });
    console.log(`DATABASE_CONFIG_STATUS=${result.status}`);
    console.log(JSON.stringify(result, null, 2));
    if (result.status === "FAIL") process.exitCode = 1;
  } catch (error) {
    console.error("DATABASE_CONFIG_STATUS=FAIL");
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
