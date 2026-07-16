"use strict";

const { databaseConfig, TABLES } = require("./config.js");

function copy(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

class MemoryDatabaseAdapter {
  constructor() {
    this.tables = Object.fromEntries(TABLES.map(table => [table, new Map()]));
  }

  table(name) {
    if (!this.tables[name]) throw new Error(`Unknown table: ${name}`);
    return this.tables[name];
  }

  async get(table, id) { return copy(this.table(table).get(id) || null); }
  async find(table, filters = {}) {
    return copy([...this.table(table).values()].filter(row =>
      Object.entries(filters).every(([key, value]) => row[key] === value)
    ));
  }
  async insert(table, row) {
    if (!row.id || this.table(table).has(row.id)) throw Object.assign(new Error("Record conflict"), { statusCode: 409, code: "conflict" });
    this.table(table).set(row.id, copy(row));
    return copy(row);
  }
  async update(table, id, patch) {
    const current = await this.get(table, id);
    if (!current) throw Object.assign(new Error("Record not found"), { statusCode: 404, code: "not_found" });
    const next = { ...current, ...copy(patch), id };
    this.table(table).set(id, next);
    return copy(next);
  }
  async upsert(table, id, row) {
    const next = { ...(await this.get(table, id) || {}), ...copy(row), id };
    this.table(table).set(id, next);
    return copy(next);
  }
  async delete(table, id) { const existed = this.table(table).delete(id); return { deleted: existed }; }
}

class RestDatabaseAdapter {
  constructor(config = databaseConfig()) { this.config = config; }
  async request(operation) {
    const response = await fetch(`${this.config.url}/transaction`, {
      method: "POST",
      headers: { "authorization": `Bearer ${this.config.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(operation),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw Object.assign(new Error("Database request failed"), { statusCode: 503, code: "database_error" });
    return response.json();
  }
  get(table, id) { return this.request({ action: "get", table, id }); }
  find(table, filters) { return this.request({ action: "find", table, filters }); }
  insert(table, row) { return this.request({ action: "insert", table, row }); }
  update(table, id, patch) { return this.request({ action: "update", table, id, patch }); }
  upsert(table, id, row) { return this.request({ action: "upsert", table, id, row }); }
  delete(table, id) { return this.request({ action: "delete", table, id }); }
}

let testDatabase = null;
function setDatabaseForTests(adapter) {
  if (process.env.NODE_ENV !== "test") throw new Error("Test database injection is disabled");
  testDatabase = adapter;
}
function getDatabase() {
  if (process.env.NODE_ENV === "test" && testDatabase) return testDatabase;
  return new RestDatabaseAdapter();
}

module.exports = { MemoryDatabaseAdapter, RestDatabaseAdapter, setDatabaseForTests, getDatabase };
