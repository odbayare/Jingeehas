import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLES = new Set([
  "sessions", "assessment_sessions", "safety_checks", "assessments", "assessment_answers", "assessment_summaries",
  "report_snapshots", "payments", "entitlements", "recovery_contacts", "advisor_accounts", "advisor_sessions",
  "advisor_clients", "advisor_commissions", "advisor_report_access_logs", "admin_accounts", "admin_sessions",
  "admin_audit_logs", "recovery_challenges", "data_deletion_requests", "schema_migrations", "certification_records"
]);
const ACTIONS = new Set(["get", "find", "insert", "update", "upsert", "delete", "transaction"]);
const HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: HEADERS });

function validate(value: unknown, nested = false): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "invalid_operation";
  const op = value as Record<string, unknown>;
  const action = String(op.action || "");
  if (!ACTIONS.has(action)) return "invalid_action";
  if (action === "transaction") {
    if (nested || !Array.isArray(op.operations) || op.operations.length > 100) return "invalid_operations";
    for (const item of op.operations) {
      const error = validate(item, true);
      if (error) return error;
    }
    return null;
  }
  return TABLES.has(String(op.table || "")) ? null : "invalid_table";
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
  if (!new URL(req.url).pathname.endsWith("/transaction")) return reply(404, { ok: false, error: "not_found" });
  if (Number(req.headers.get("content-length") || "0") > 1_000_000) return reply(413, { ok: false, error: "payload_too_large" });

  const authorization = req.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return reply(401, { ok: false, error: "unauthorized" });

  let operation: unknown;
  try { operation = await req.json(); }
  catch { return reply(400, { ok: false, error: "invalid_json" }); }
  const validationError = validate(operation);
  if (validationError) return reply(400, { ok: false, error: validationError });

  const projectUrl = Deno.env.get("SUPABASE_URL");
  const gatewayKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!projectUrl || !gatewayKey) return reply(503, { ok: false, error: "database_unavailable" });

  try {
    const rpc = await fetch(`${projectUrl}/rest/v1/rpc/jingeehas_transaction`, {
      method: "POST",
      headers: { apikey: gatewayKey, authorization, "content-type": "application/json" },
      body: JSON.stringify({ operation }),
      signal: AbortSignal.timeout(7500)
    });
    const payload = await rpc.json().catch(() => null);
    if (!rpc.ok) {
      const message = String(payload?.message || "");
      if (message.includes("JH_NOT_FOUND")) return reply(404, { ok: false, error: "not_found" });
      if (message.includes("JH_CONFLICT")) return reply(409, { ok: false, error: "conflict" });
      if (rpc.status === 401 || rpc.status === 403) return reply(403, { ok: false, error: "forbidden" });
      if (message.includes("JH_") || rpc.status === 400) return reply(400, { ok: false, error: "invalid_operation" });
      return reply(503, { ok: false, error: "database_error" });
    }
    return reply(200, payload);
  } catch {
    return reply(503, { ok: false, error: "database_unavailable" });
  }
});
