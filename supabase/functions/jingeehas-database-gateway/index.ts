import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    diff |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return diff === 0;
}

function looksLikeSupabaseCredential(value: string): boolean {
  return /^sb_(?:publishable|secret)_/i.test(value) || /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

function validDedicatedSecret(value: string): boolean {
  return value.length >= 48 && !/\s/.test(value) && !looksLikeSupabaseCredential(value);
}

function snakeKey(value: string): string {
  return value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function camelKey(value: string): string {
  return value.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

function mapRecordKeys(value: unknown, keyMapper: (key: string) => string): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [keyMapper(key), item]));
}

function normalizeOperation(operation: Record<string, unknown>): Record<string, unknown> {
  // Custom RPC operations keep their arguments at the request root, while
  // generic CRUD operations put data under row/patch/filters. Normalize both
  // shapes without changing established custom RPC contracts such as recovery.
  const reportVersionActions = new Set([
    "get_active_report_snapshot", "list_report_snapshot_versions", "get_report_snapshot_version",
    "create_report_snapshot_version", "activate_report_snapshot_version",
  ]);
  const normalized = reportVersionActions.has(String(operation.action || ""))
    ? mapRecordKeys(operation, snakeKey) as Record<string, unknown>
    : { ...operation };
  for (const field of ["row", "patch", "filters"]) {
    if (field in normalized) normalized[field] = mapRecordKeys(normalized[field], snakeKey);
  }
  if (operation.action === "transaction" && Array.isArray(operation.operations)) {
    normalized.operations = operation.operations.map(item => item && typeof item === "object" && !Array.isArray(item)
      ? normalizeOperation(item as Record<string, unknown>) : item);
  }
  return normalized;
}

function normalizeResult(result: unknown): unknown {
  if (Array.isArray(result)) return result.map(item => mapRecordKeys(item, camelKey));
  if (!result || typeof result !== "object") return result;
  const record = result as Record<string, unknown>;
  if (Array.isArray(record.results)) {
    return { ...(mapRecordKeys(record, camelKey) as Record<string, unknown>), results: record.results.map(item => mapRecordKeys(item, camelKey)) };
  }
  return mapRecordKeys(record, camelKey);
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });

  const gatewaySecret = Deno.env.get("JINGEEHAS_GATEWAY_SECRET") ?? "";
  const authHeader = request.headers.get("authorization") ?? "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!validDedicatedSecret(gatewaySecret)) return json(503, { error: "gateway_unavailable" });
  if (looksLikeSupabaseCredential(bearer) || !constantTimeEqual(bearer, gatewaySecret)) {
    return json(401, { error: "unauthorized" });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 262_144) {
    return json(413, { error: "payload_too_large" });
  }

  let operation: unknown;
  try {
    const body = new Uint8Array(await request.arrayBuffer());
    if (body.byteLength > 262_144) return json(413, { error: "payload_too_large" });
    operation = JSON.parse(new TextDecoder().decode(body));
  }
  catch { return json(400, { error: "invalid_json" }); }
  if (!operation || typeof operation !== "object" || Array.isArray(operation)) {
    return json(400, { error: "invalid_operation" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceRoleKey) return json(503, { error: "gateway_unavailable" });

  try {
    const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/jingeehas_execute_request`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ request: normalizeOperation(operation as Record<string, unknown>) }),
      signal: AbortSignal.timeout(7000),
    });
    if (!rpcResponse.ok) return json(rpcResponse.status === 409 ? 409 : rpcResponse.status === 404 ? 404 : 503, { error: "database_error" });
    return json(200, normalizeResult(await rpcResponse.json()));
  } catch { return json(503, { error: "database_unavailable" }); }
});
