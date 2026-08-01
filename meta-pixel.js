"use strict";

(() => {
  if (typeof window === "undefined" || typeof window.fetch !== "function") return;

  const nativeFetch = window.fetch.bind(window);
  const state = { config: null, ready: false, queued: [], sent: new Set() };

  function requestPath(input) {
    try {
      const value = typeof input === "string" ? input : input?.url;
      return new URL(value, window.location.origin).pathname;
    } catch { return ""; }
  }

  function installPixel(pixelId) {
    if (state.ready || !/^\d{5,32}$/.test(String(pixelId || ""))) return;
    if (!window.fbq) {
      const fbq = function (...args) { fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args); };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }
    window.fbq("init", pixelId);
    state.ready = true;
    const queued = state.queued.splice(0);
    for (const item of queued) send(item.name, item.data, item.eventId);
    send("PageView", {});
    send("ViewContent", {
      content_ids: [state.config.productCode],
      content_type: "product",
      value: state.config.amount,
      currency: state.config.currency
    });
  }

  function send(name, data = {}, eventId = "") {
    const dedupeKey = eventId ? `${name}:${eventId}` : "";
    if (dedupeKey && state.sent.has(dedupeKey)) return;
    if (!state.ready || typeof window.fbq !== "function") {
      state.queued.push({ name, data, eventId });
      return;
    }
    if (dedupeKey) state.sent.add(dedupeKey);
    if (eventId) window.fbq("track", name, data, { eventID: eventId });
    else window.fbq("track", name, data);
  }

  async function inspectResponse(input, response) {
    if (!state.config?.enabled || !response?.ok) return;
    const path = requestPath(input);
    if (!["/.netlify/functions/qpay-create-invoice", "/.netlify/functions/qpay-check-payment"].includes(path)) return;
    const body = await response.clone().json().catch(() => null);
    if (!body || typeof body !== "object") return;

    if (path.endsWith("qpay-create-invoice") && body.paymentId && ["pending", "paid"].includes(body.status)) {
      send("InitiateCheckout", {
        content_ids: [state.config.productCode],
        content_type: "product",
        value: state.config.amount,
        currency: state.config.currency
      }, `jh_checkout_${String(body.paymentId).slice(0, 100)}`);
    }

    if (path.endsWith("qpay-check-payment") && body.status === "paid" && body.purchaseEventId) {
      send("Purchase", {
        value: state.config.amount,
        currency: state.config.currency,
        order_id: String(body.paymentId || "").slice(0, 100),
        content_ids: [state.config.productCode],
        content_type: "product",
        product_code: state.config.productCode
      }, String(body.purchaseEventId).slice(0, 100));
    }
  }

  window.fetch = async function (...args) {
    const response = await nativeFetch(...args);
    inspectResponse(args[0], response).catch(() => {});
    return response;
  };

  nativeFetch("/.netlify/functions/meta-browser-config", { method: "GET", credentials: "same-origin" })
    .then(response => response.ok ? response.json() : null)
    .then(config => {
      if (!config?.enabled) return;
      state.config = config;
      installPixel(config.pixelId);
    })
    .catch(() => {});
})();
