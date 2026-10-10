"use strict";
const { spawn, execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { promisify } = require("node:util");
const execFile = promisify(require("node:child_process").execFile);
function quote(value) { return value == null ? "NULL" : `'${String(value).replace(/'/g, "''")}'`; }
class NativeGiftDatabase {
  constructor(socket, port = "55439") { this.args = ["-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-h", socket, "-p", port, "-d", "postgres"]; }
  async run(sql, options = {}) {
    if (options.role && !["anon", "authenticated", "service_role"].includes(options.role)) throw new Error("fixture role only");
    const prefix = `set search_path=jingeehas,public; set statement_timeout='10s'; set lock_timeout='5s'; set application_name='gift-native-test'; set request.jwt.claims=${quote(JSON.stringify({ role: options.claims || "service_role" }))}; ${options.role ? `set role ${options.role};` : ""}`;
    const { stdout } = await execFile("psql", [...this.args, "-c", prefix + sql], { timeout: 15000, maxBuffer: 4 * 1024 * 1024 });
    return stdout.trim();
  }
  async exec(sql, options) { await this.run(sql, options); }
  async query(sql, values = [], options) {
    const bound = sql.replace(/\$(\d+)/g, (_match, position) => quote(values[Number(position) - 1]));
    const select = /^\s*select\b/i.test(bound);
    const text = await this.run(select ? `select coalesce(json_agg(fixture_row),'[]'::json) from (${bound.replace(/;\s*$/, "")}) fixture_row;` : bound, options);
    return { rows: select && text ? JSON.parse(text) : [] };
  }
  async holdGift(id) {
    const child = spawn("psql", this.args, { stdio: ["pipe", "pipe", "pipe"] });
    let output = "", errors = "";
    child.stderr.on("data", value => { errors += value; });
    const ready = new Promise((resolve, reject) => {
      child.stdout.on("data", value => { output += value; if (output.includes("GIFT_LOCK_READY")) resolve(); });
      child.on("error", reject); child.on("exit", code => { if (!output.includes("GIFT_LOCK_READY")) reject(new Error(errors || `lock exit ${code}`)); });
    });
    child.stdin.write(`begin; select id from jingeehas.gift_orders where id=${quote(id)} for update; select 'GIFT_LOCK_READY';\n`);
    await ready;
    return { release: () => { child.stdin.end("commit;\n\\q\n"); return new Promise((resolve, reject) => child.on("exit", code => code === 0 ? resolve() : reject(new Error(errors)))); } };
  }
  async waitForBlocked(count = 1) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const result = await this.query("select count(*)::int as n from pg_stat_activity where application_name='gift-native-test' and wait_event_type='Lock'");
      if (result.rows[0].n >= count) return;
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    throw new Error("Expected separate native connections to block on the held lock");
  }
}
async function disposableNative(run) {
  const root = fs.mkdtempSync("/tmp/jingeehas-gift-native-suite-");
  fs.chmodSync(root, 0o700); fs.mkdirSync(path.join(root, "socket"));
  let started = false;
  try {
    execFileSync("initdb", ["-D", path.join(root,"data"), "--auth-local=trust", "--auth-host=reject"], { stdio:"pipe" });
    execFileSync("pg_ctl", ["-D", path.join(root,"data"), "-l", path.join(root,"server.log"), "-o", `-k ${path.join(root,"socket")} -h '' -p 55439`, "start"], { stdio:"pipe" });
    started = true;
    await run(new NativeGiftDatabase(path.join(root,"socket")));
  } finally {
    if (started) execFileSync("pg_ctl", ["-D", path.join(root,"data"), "stop", "-m", "fast"], { stdio:"pipe" });
    fs.rmSync(root,{ recursive:true, force:true });
  }
}
module.exports = { NativeGiftDatabase, disposableNative, quote };
