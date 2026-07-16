"use strict";

const { databaseConfig } = require("./config.js");

class RestDatabaseAdapter {
  constructor(config = databaseConfig()) { this.config = config; }
  async request(operation) {
    const response = await fetch(`${this.config.url}/transaction`, {
      method: "POST",
      headers: { "authorization": `Bearer ${this.config.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(operation),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw Object.assign(new Error("Database request failed"), {
      statusCode: response.status === 409 ? 409 : 503,
      code: response.status === 409 ? "conflict" : "database_error"
    });
    return response.json();
  }
  get(table, id) { return this.request({ action: "get", table, id }); }
  find(table, filters) { return this.request({ action: "find", table, filters }); }
  insert(table, row) { return this.request({ action: "insert", table, row }); }
  update(table, id, patch) { return this.request({ action: "update", table, id, patch }); }
  upsert(table, id, row) { return this.request({ action: "upsert", table, id, row }); }
  delete(table, id) { return this.request({ action: "delete", table, id }); }
  transaction(operations, options = {}) { return this.request({ action: "transaction", operations, rollback: options.rollback === true }); }
  consumeRecoveryChallenge(id, codeHash, now) {
    return this.request({ action: "consume_recovery_challenge", id, codeHash, now });
  }
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

module.exports = { RestDatabaseAdapter, setDatabaseForTests, getDatabase };
