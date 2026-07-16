"use strict";

function qpayConfig(env = process.env) {
  const baseUrl = String(env.QPAY_API_BASE_URL || "https://merchant.qpay.mn").replace(/\/+$/, "");
  const clientId = String(env.QPAY_CLIENT_ID || "");
  const clientSecret = String(env.QPAY_CLIENT_SECRET || "");
  const invoiceCode = String(env.QPAY_INVOICE_CODE || "");
  const callbackOrigin = String(env.QPAY_CALLBACK_ORIGIN || "").replace(/\/+$/, "");
  if (!baseUrl.startsWith("https://") || !clientId || !clientSecret || !invoiceCode || !callbackOrigin.startsWith("https://")) {
    throw Object.assign(new Error("QPay is not configured"), { statusCode: 503, code: "qpay_unavailable" });
  }
  return { baseUrl, clientId, clientSecret, invoiceCode, callbackOrigin,
    allowedSchemes: String(env.QPAY_ALLOWED_APP_SCHEMES || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean),
    allowedHosts: String(env.QPAY_ALLOWED_HTTPS_HOSTS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean) };
}

function safeAppLinks(urls, config) {
  return (Array.isArray(urls) ? urls : []).flatMap((item, index) => {
    const raw = String(item.link || item.url || "");
    try {
      const parsed = new URL(raw);
      const scheme = parsed.protocol.slice(0, -1).toLowerCase();
      const httpsAllowed = scheme === "https" && config.allowedHosts.includes(parsed.hostname.toLowerCase());
      const appAllowed = scheme !== "http" && scheme !== "https" && config.allowedSchemes.includes(scheme);
      if (!httpsAllowed && !appAllowed) return [];
      return [{ name: String(item.name || `Банкны апп ${index + 1}`).slice(0, 80), link: parsed.href }];
    } catch { return []; }
  });
}

class QPayClient {
  constructor(config = qpayConfig()) { this.config = config; this.cachedToken = null; }
  async token() {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now() + 60000) return this.cachedToken.value;
    const response = await fetch(`${this.config.baseUrl}/v2/auth/token`, {
      method: "POST", headers: { authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64")}` },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw Object.assign(new Error("QPay auth failed"), { statusCode: 502, code: "qpay_auth_error" });
    const data = await response.json();
    this.cachedToken = { value: data.access_token, expiresAt: Date.now() + Number(data.expires_in || 300) * 1000 };
    return this.cachedToken.value;
  }
  async request(path, body) {
    const token = await this.token();
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body), signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw Object.assign(new Error("QPay request failed"), { statusCode: 502, code: "qpay_provider_error" });
    return response.json();
  }
  async createInvoice({ senderInvoiceNo, amount }) {
    const data = await this.request("/v2/invoice", {
      invoice_code: this.config.invoiceCode,
      sender_invoice_no: senderInvoiceNo,
      invoice_receiver_code: senderInvoiceNo,
      invoice_description: "Илүүдэл жингээс салах тест үнэлгээ",
      amount,
      callback_url: `${this.config.callbackOrigin}/.netlify/functions/qpay-check-payment?senderInvoiceNo=${encodeURIComponent(senderInvoiceNo)}`
    });
    return { invoiceId: data.invoice_id, qrText: data.qr_text || "", qrImage: data.qr_image || "",
      urls: safeAppLinks(data.urls, this.config) };
  }
  checkPayment(invoiceId) { return this.request("/v2/payment/check", { object_type: "INVOICE", object_id: invoiceId, offset: { page_number: 1, page_limit: 100 } }); }
}

let testProvider = null;
function setQPayProviderForTests(provider) {
  if (process.env.NODE_ENV !== "test") throw new Error("Test QPay injection is disabled");
  testProvider = provider;
}
function getQPayProvider() { return process.env.NODE_ENV === "test" && testProvider ? testProvider : new QPayClient(); }

module.exports = { qpayConfig, safeAppLinks, QPayClient, setQPayProviderForTests, getQPayProvider };
