"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  DEFAULT_GRAPH_API_VERSION,
  metaCapiConfig,
  metaBrowserConfig,
  purchaseEventId,
  purchasePayload,
  deliverConfirmedPurchase
} = require("../netlify/functions/_lib/meta-capi.js");

class MemoryDb {
  constructor(row) { this.row = { ...row }; }
  async get(table, id) {
    assert.equal(table, "payments");
    return id === this.row.id ? { ...this.row } : null;
  }
  async update(table, id, patch) {
    assert.equal(table, "payments");
    assert.equal(id, this.row.id);
    this.row = { ...this.row, ...patch };
    return { ...this.row };
  }
}

(async () => {
  assert.equal(metaCapiConfig({}).version, DEFAULT_GRAPH_API_VERSION);
  assert.deepEqual(metaBrowserConfig({ META_BROWSER_PIXEL_ENABLED: "true", META_PIXEL_ID: "123456789" }), {
    enabled: true,
    pixelId: "123456789",
    productCode: "WEIGHT_TEST_ONE_TIME",
    amount: 39000,
    currency: "MNT"
  });
  assert.equal(metaBrowserConfig({ META_BROWSER_PIXEL_ENABLED: "false", META_PIXEL_ID: "123456789" }).enabled, false);
  assert.equal(metaBrowserConfig({ META_BROWSER_PIXEL_ENABLED: "true", META_PIXEL_ID: "not-an-id" }).enabled, false);

  const payment = {
    id: "wp_safe_order_1",
    status: "paid",
    providerPaymentId: "provider-payment-1",
    paidAt: "2026-08-01T02:59:30.000Z",
    amount: 9900,
    productCode: "WEIGHT_TEST_ONE_TIME",
    weight: 94,
    bmi: 31,
    result: "sensitive",
    email: "private@example.com"
  };
  const eventId = purchaseEventId(payment);
  assert.match(eventId, /^jh_purchase_[a-f0-9]{32}$/);
  assert.equal(eventId, purchaseEventId(payment));

  const event = {
    headers: {
      "x-nf-client-connection-ip": "203.0.113.5",
      "user-agent": "Test Browser",
      cookie: "_fbp=fb.1.123.abc; _fbc=fb.1.123.xyz",
      referer: "https://jingeehas.fit/assessment/payment?assessmentId=never-send"
    }
  };
  const payload = purchasePayload(payment, event, new Date("2026-08-01T03:00:00.000Z"));
  assert.equal(payload.event_name, "Purchase");
  assert.equal(payload.event_id, eventId);
  assert.equal(payload.event_time, Math.floor(Date.parse(payment.paidAt) / 1000));
  assert.equal(payload.event_source_url, "https://jingeehas.fit/assessment/payment");
  assert.deepEqual(payload.custom_data, {
    value: 9900,
    currency: "MNT",
    order_id: "wp_safe_order_1",
    content_ids: ["WEIGHT_TEST_ONE_TIME"],
    content_type: "product",
    product_code: "WEIGHT_TEST_ONE_TIME"
  });
  const currentPayment = { ...payment, id: "wp_current_39000", providerPaymentId: "provider-current-39000", amount: 39000 };
  assert.equal(purchasePayload(currentPayment, event).custom_data.value, 39000);
  assert.deepEqual(payload.user_data, {
    client_ip_address: "203.0.113.5",
    client_user_agent: "Test Browser",
    fbp: "fb.1.123.abc",
    fbc: "fb.1.123.xyz"
  });
  const serialized = JSON.stringify(payload);
  for (const forbidden of ["private@example.com", "sensitive", "never-send", "\"weight\"", "\"bmi\"", "\"result\""]) {
    assert.ok(!serialized.includes(forbidden), `Meta payload must exclude ${forbidden}`);
  }

  const db = new MemoryDb(payment);
  const calls = [];
  const env = {
    META_CAPI_ENABLED: "true",
    META_DATASET_ID: "123456789",
    META_CAPI_ACCESS_TOKEN: "secret-token",
    META_GRAPH_API_VERSION: "v25.0"
  };
  const delivered = await deliverConfirmedPurchase(db, payment.id, event, {
    env,
    now: new Date("2026-08-01T03:00:00.000Z"),
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return { ok: true, status: 200, async json() { return { events_received: 1 }; } };
    }
  });
  assert.equal(delivered.delivered, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://graph.facebook.com/v25.0/123456789/events");
  assert.equal(calls[0].init.headers.authorization, "Bearer secret-token");
  assert.ok(!calls[0].url.includes("secret-token"), "access token must not be placed in the URL");
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.data[0].event_id, eventId);
  assert.equal(sent.data[0].event_time, Math.floor(Date.parse(payment.paidAt) / 1000));
  assert.equal(db.row.metaPurchaseEventId, eventId);
  assert.equal(db.row.metaPurchaseSentAt, "2026-08-01T03:00:00.000Z");
  assert.equal(db.row.metaPurchaseApiVersion, "v25.0");

  const duplicate = await deliverConfirmedPurchase(db, payment.id, event, {
    env,
    fetchImpl: async () => { throw new Error("must not send duplicate"); }
  });
  assert.equal(duplicate.reason, "already_delivered");

  const disabledDb = new MemoryDb(payment);
  assert.equal((await deliverConfirmedPurchase(disabledDb, payment.id, event, { env: {} })).reason, "disabled");
  assert.equal((await deliverConfirmedPurchase(disabledDb, payment.id, event, {
    env,
    flags: { isTest: true }
  })).reason, "non_customer");

  const root = path.resolve(__dirname, "..");
  const browserSource = fs.readFileSync(path.join(root, "meta-pixel.js"), "utf8");
  const configSource = fs.readFileSync(path.join(root, "netlify/functions/meta-browser-config.js"), "utf8");
  const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
  for (const forbidden of ["META_CAPI_ACCESS_TOKEN", "email", "assessmentId", "bmi", "weight", "score", "answers"]) {
    assert.ok(!browserSource.includes(forbidden), `browser Pixel bridge must exclude ${forbidden}`);
    assert.ok(!configSource.includes(forbidden), `browser config must exclude ${forbidden}`);
  }
  assert.ok(indexSource.indexOf("/meta-pixel.js") < indexSource.indexOf("/app.js"), "Pixel bridge must wrap fetch before app.js runs");
  assert.equal((browserSource.match(/value: paymentAmount/g) || []).length, 2, "browser checkout and purchase must use the server payment amount");

  console.log("Meta CAPI tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
