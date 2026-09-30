"use strict";

const { test, expect } = require("@playwright/test");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const dist = path.join(root, "dist");
const origin = "http://127.0.0.1:4178";
const now = new Date("2026-09-30T08:00:00.000Z");
const pendingCopy = "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bankUrls = Array.from({ length: 23 }, (_, index) => ({
  name: `Fixture bank ${index + 1}`,
  description: `Тест банк ${index + 1}`,
  kind: "bank_app",
  logo: "",
  link: `fixturebank${index + 1}://pay?invoice=private-invoice-fixture&qr=private-qr-fixture`
}));
const paymentFixture = {
  paymentId: "wp-private-payment-fixture",
  assessmentId: "wa-checkout-fixture",
  productCode: "WEIGHT_TEST_ONE_TIME",
  amount: 19900,
  status: "pending",
  expiresAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
  qrText: "private-qr-fixture",
  // A valid local one-pixel PNG avoids external image loading and decode noise.
  qrImage: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=",
  urls: [...bankUrls, { name: "QPay", kind: "qpay_short_url", link: "https://qpay.mn/q/private-short-url-fixture" }]
};

test.use({ serviceWorkers: "block" });

// The normal e2e server serves source app.js. These regressions deliberately run
// untouched production bytes: the conversion build replaces both checkout renderers.
test.beforeAll(() => {
  execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "pipe" });
  expect(fs.readFileSync(path.join(dist, "app.js"), "utf8")).toContain("Бусад банк, wallet харах");
});

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

async function openCheckout(page, options = {}) {
  const payment = { ...paymentFixture, ...options.payment };
  const calls = { checks: [], analytics: [], report: [], invoice: [], blocked: [], unexpected: [], app: 0 };
  const responses = [];
  const reportResponses = [];
  let analyticsResponse = () => ({ status: 202, body: { accepted: true, recorded: true } });
  await page.clock.install({ time: new Date(now.getTime() - 60000) });
  await page.clock.pauseAt(now);
  await page.addInitScript(() => {
    // Exercise the real click handler but never launch a bank app or navigate to QPay.
    document.addEventListener("click", event => {
      if (event.target.closest?.("a[data-qpay-app-link]")) event.preventDefault();
    });
  });
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin) {
      calls.blocked.push(request.url());
      return route.abort("blockedbyclient");
    }
    const action = url.pathname.startsWith("/.netlify/functions/") && url.pathname.split("/").pop();
    const json = (body, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (action === "meta-browser-config") return json({ enabled: false });
    if (action === "weight-session-state") return json({
      assessment: { assessmentId: payment.assessmentId, status: "complete", commercialFlowVersion: "free_assessment_postpaid_v1" },
      nextRoute: "/assessment/payment", payment, answers: {}, report: null
    });
    if (action === "qpay-check-payment") {
      const entry = responses.shift() || { body: { ...payment, status: "pending" } };
      calls.checks.push(request.postDataJSON());
      if (entry.wait) await entry.wait;
      if (entry.abort) return route.abort("failed");
      return json(entry.body, entry.status || 200);
    }
    if (action === "analytics-collect") {
      const body = request.postDataJSON();
      calls.analytics.push(body);
      const response = analyticsResponse(body);
      return json(response.body, response.status);
    }
    if (action === "weight-assessment-report") {
      calls.report.push(request.url());
      const entry = reportResponses.shift() || {};
      return json(entry.body || {
        assessmentId: payment.assessmentId, reportMode: "sufficient", entitled: true,
        fullReport: { productName: "Тест тайлан", reportDate: now.toISOString(), mode: "sufficient",
          coverage: "Тестийн тайлбар", sections: [{ title: "Тестийн тайлан", body: "Баталгаажсан тест төлбөрийн тайлан." }] }
      }, entry.status || 200);
    }
    if (action) {
      (action === "qpay-create-invoice" ? calls.invoice : calls.unexpected).push(action);
      return json({ error: "unmocked_endpoint" }, 500);
    }
    if (request.resourceType() === "document") return route.fulfill({ path: path.join(dist, "index.html"), contentType: "text/html" });
    const relative = url.pathname.replace(/^\//, "");
    const file = path.resolve(dist, relative);
    if (!file.startsWith(`${dist}${path.sep}`) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      calls.unexpected.push(url.pathname);
      return route.abort("blockedbyclient");
    }
    if (url.pathname === "/app.js") calls.app += 1;
    const types = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
    return route.fulfill({ path: file, contentType: types[path.extname(file)] || "application/octet-stream" });
  });
  await page.goto("/assessment/payment");
  await expect(page.locator(".payment-status")).toHaveText(pendingCopy);
  await expect(page.locator("[data-qpay-app-link]")).toHaveCount(24);
  expect(calls.app).toBe(1);
  return { payment, calls, responses, reportResponses, setAnalyticsResponse(callback) { analyticsResponse = callback; } };
}

async function selectExpandedBank(page) {
  const details = page.locator(".qpay-app-section details");
  await expect(details.locator("summary")).toContainText("(17)");
  await expect(details.locator("[data-qpay-app-link]")).toHaveCount(17);
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  const bank = details.locator("[data-qpay-app-link]").nth(8);
  await bank.focus();
  await expect(bank).toBeFocused();
  const nodes = await page.evaluateHandle(() => ({
    root: document.querySelector("#app > *"),
    details: document.querySelector(".qpay-app-section details"),
    bank: document.activeElement,
    qr: document.querySelector(".qpay-qr"),
    status: document.querySelector(".payment-status"),
    button: document.querySelector('[data-action="check-payment"]')
  }));
  return { bank, details, nodes };
}

async function expectCheckoutPreserved(page, nodes) {
  expect(await nodes.evaluate(saved => ({
    sameRoot: saved.root === document.querySelector("#app > *"),
    sameDetails: saved.details === document.querySelector(".qpay-app-section details"),
    open: saved.details.open,
    bankConnected: saved.bank.isConnected,
    focused: document.activeElement === saved.bank,
    sameQr: saved.qr === document.querySelector(".qpay-qr"),
    sameStatus: saved.status === document.querySelector(".payment-status"),
    sameButton: saved.button === document.querySelector('[data-action="check-payment"]')
  }))).toEqual({ sameRoot: true, sameDetails: true, open: true, bankConnected: true, focused: true, sameQr: true, sameStatus: true, sameButton: true });
  await expect(page.locator(".payment-status")).toHaveAttribute("aria-live", "polite");
}

async function visibility(page, hidden) {
  await page.evaluate(value => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => value ? "hidden" : "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

async function lifecycle(page, name) {
  await page.evaluate(type => window.dispatchEvent(new PageTransitionEvent(type, { persisted: true })), name);
}

const handoffs = calls => calls.analytics.filter(event => event.eventName === "qpay_handoff_attempted");
const returns = calls => calls.analytics.filter(event => event.eventName === "qpay_page_returned");

function expectPrivateTelemetry(event) {
  expect(Object.keys(event).sort()).toEqual(["assessmentId", "attemptId", "context", "eventId", "eventName"]);
  expect(event.eventId).toMatch(uuid);
  expect(event.attemptId).toMatch(uuid);
  expect(event.assessmentId).toBe(paymentFixture.assessmentId);
  expect(Object.keys(event.context).sort()).toEqual(["deviceClass", "sessionId", "visitorId"]);
  expect(JSON.stringify(event)).not.toMatch(/private-|fixturebank|Тест банк|qpay\.mn|qrText|qrImage|paymentId|bankName|app_opened/);
}

for (const width of [375, 1440]) {
  test(`production checkout keeps its 17-app chooser and keyboard focus through repeated 4s polls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const fixture = await openCheckout(page);
    const { bank, nodes } = await selectExpandedBank(page);
    for (let check = 1; check <= 3; check += 1) {
      await page.clock.runFor(4000);
      await expect.poll(() => fixture.calls.checks.length).toBe(check);
      await expect(page.locator(".payment-status")).toHaveText(pendingCopy);
      await expectCheckoutPreserved(page, nodes);
    }
    // One event after several status updates also catches accidentally rebound listeners.
    await bank.press("Enter");
    await expect.poll(() => handoffs(fixture.calls).length).toBe(1);
    expectPrivateTelemetry(handoffs(fixture.calls)[0]);
    expect(fixture.calls.checks.every(body => JSON.stringify(body) === JSON.stringify({ paymentId: fixture.payment.paymentId }))).toBe(true);
    expect(fixture.calls.invoice).toEqual([]);
    expect(fixture.calls.blocked).toEqual([]);
    expect(fixture.calls.unexpected).toEqual([]);
  });
}

test("slow pending, HTTP error, and network error polls preserve the chooser and never overlap", async ({ page }) => {
  const fixture = await openCheckout(page);
  const { nodes } = await selectExpandedBank(page);
  for (const response of [{ body: fixture.payment }, { status: 503, body: { error: "test_unavailable" } }, { abort: true }]) {
    const release = deferred();
    fixture.responses.push({ ...response, wait: release.promise });
    const before = fixture.calls.checks.length;
    await page.clock.runFor(4000);
    await expect.poll(() => fixture.calls.checks.length).toBe(before + 1);
    await expectCheckoutPreserved(page, nodes);
    await page.clock.runFor(12000);
    expect(fixture.calls.checks).toHaveLength(before + 1);
    await expectCheckoutPreserved(page, nodes);
    release.resolve();
    // Waiting for the live control to leave checking also synchronizes the
    // fetch when the previous and next status copy happen to be identical.
    await expect(page.locator('[data-action="check-payment"]')).toHaveAttribute("aria-disabled", "false");
    await expectCheckoutPreserved(page, nodes);
  }
  await page.clock.runFor(4000);
  await expect.poll(() => fixture.calls.checks.length).toBe(4);
  await expect(page.locator(".payment-status")).toHaveText(pendingCopy);
  await expectCheckoutPreserved(page, nodes);
});

test("manual verification still shows checking, then handles pending and paid navigation", async ({ page }) => {
  const fixture = await openCheckout(page);
  const release = deferred();
  fixture.responses.push({ body: fixture.payment, wait: release.promise });
  await page.locator('[data-action="check-payment"]').click();
  await expect.poll(() => fixture.calls.checks.length).toBe(1);
  await expect(page.locator(".payment-status")).toHaveText("Төлбөрийг шалгаж байна…");
  release.resolve();
  await expect(page.locator(".payment-status")).toHaveText(pendingCopy);
  fixture.responses.push({ body: { ...fixture.payment, status: "paid", entitlement: true, nextRoute: "/report" } });
  await page.locator('[data-action="check-payment"]').click();
  await expect(page).toHaveURL(`${origin}/report`);
  await expect.poll(() => fixture.calls.report.length).toBe(1);
  await expect(page.locator(".qpay-app-section")).toHaveCount(0);
  await page.clock.runFor(20000);
  expect(fixture.calls.checks).toHaveLength(2);
  expect(fixture.calls.invoice).toEqual([]);
});

test("automatic payment confirmation opens the report once and stops checkout polling", async ({ page }) => {
  const fixture = await openCheckout(page);
  await selectExpandedBank(page);
  fixture.responses.push({ body: { ...fixture.payment, status: "paid", entitlement: true, nextRoute: "/report" } });
  await page.clock.runFor(4000);
  await expect(page).toHaveURL(`${origin}/report`);
  await expect.poll(() => fixture.calls.report.length).toBe(1);
  await page.clock.runFor(20000);
  expect(fixture.calls.checks).toHaveLength(1);
  expect(fixture.calls.invoice).toEqual([]);
});

for (const automatic of [true, false]) {
  test(`${automatic ? "automatic" : "manual"} verification retries report loading after paid confirmation and a report 503`, async ({ page }) => {
    const fixture = await openCheckout(page);
    const { nodes } = await selectExpandedBank(page);
    const paid = { ...fixture.payment, status: "paid", entitlement: true, nextRoute: "/report" };
    fixture.responses.push({ body: paid }, { body: paid });
    fixture.reportResponses.push({ status: 503, body: { error: "report_temporarily_unavailable" } });
    if (automatic) await page.clock.runFor(4000);
    else await page.locator('[data-action="check-payment"]').click();
    await expect.poll(() => fixture.calls.report.length).toBe(1);
    await expect(page).toHaveURL(`${origin}/assessment/payment`);
    const button = page.locator('[data-action="check-payment"]');
    await expect(button).toBeVisible();
    if (automatic) {
      await expect(button).toHaveAttribute("aria-disabled", "false");
      await expectCheckoutPreserved(page, nodes);
      await page.clock.runFor(4000);
    } else {
      await button.click();
    }
    await expect(page).toHaveURL(`${origin}/report`);
    expect(fixture.calls.checks).toHaveLength(2);
    expect(fixture.calls.report).toHaveLength(2);
    expect(fixture.calls.invoice).toEqual([]);
    await page.clock.runFor(20000);
    expect(fixture.calls.checks).toHaveLength(2);
  });
}

for (const outcome of ["pending", "paid", "error"]) {
  test(`a late ${outcome} poll cannot rerender or navigate after leaving checkout`, async ({ page }) => {
    const fixture = await openCheckout(page);
    const release = deferred();
    fixture.responses.push(outcome === "error"
      ? { status: 503, body: { error: "test_unavailable" }, wait: release.promise }
      : { body: { ...fixture.payment, status: outcome, nextRoute: "/report" }, wait: release.promise });
    await page.clock.runFor(4000);
    await expect.poll(() => fixture.calls.checks.length).toBe(1);
    await page.locator('.site-nav a[href="/support"]').click();
    await expect(page).toHaveURL(`${origin}/support`);
    const heading = await page.locator("#page-title").elementHandle();
    const response = page.waitForResponse(item => item.url().endsWith("/qpay-check-payment"));
    release.resolve();
    await (await response).finished();
    await page.clock.runFor(20000);
    await expect(page).toHaveURL(`${origin}/support`);
    expect(await heading.evaluate(node => node.isConnected && document.activeElement === node)).toBe(true);
    expect(fixture.calls.report).toEqual([]);
    expect(fixture.calls.checks).toHaveLength(1);
  });
}

test("expired invoices do not restart automatic checks on page return, but manual verification is available", async ({ page }) => {
  const fixture = await openCheckout(page, { payment: { expiresAt: new Date(now.getTime() + 2000).toISOString() } });
  const { bank, nodes } = await selectExpandedBank(page);
  await bank.press("Enter");
  await expect.poll(() => handoffs(fixture.calls).length).toBe(1);
  await visibility(page, true);
  await page.clock.runFor(20000);
  await visibility(page, false);
  await lifecycle(page, "pageshow");
  await page.clock.runFor(12000);
  expect(fixture.calls.checks).toEqual([]);
  await expectCheckoutPreserved(page, nodes);
  await page.locator('[data-action="check-payment"]').click();
  await expect.poll(() => fixture.calls.checks.length).toBe(1);
});

test("handoff telemetry records attempts, correlates a single return, and contains no provider details", async ({ page }) => {
  const fixture = await openCheckout(page);
  const { bank } = await selectExpandedBank(page);
  // Returning without an attempt must not invent a handoff.
  await visibility(page, true);
  await lifecycle(page, "pagehide");
  await visibility(page, false);
  await lifecycle(page, "pageshow");
  expect(returns(fixture.calls)).toEqual([]);
  await bank.press("Enter");
  await expect.poll(() => handoffs(fixture.calls).length).toBe(1);
  await visibility(page, false);
  await lifecycle(page, "pageshow");
  expect(returns(fixture.calls)).toEqual([]);
  await visibility(page, true);
  await lifecycle(page, "pagehide");
  await visibility(page, false);
  await lifecycle(page, "pageshow");
  await expect.poll(() => returns(fixture.calls).length).toBe(1);
  await visibility(page, false);
  await lifecycle(page, "pageshow");
  expect(returns(fixture.calls)).toHaveLength(1);
  expect(returns(fixture.calls)[0].attemptId).toBe(handoffs(fixture.calls)[0].attemptId);
  expect(returns(fixture.calls)[0].eventId).not.toBe(handoffs(fixture.calls)[0].eventId);

  // Exercise the QPay short URL too; both attempts remain locally intercepted.
  await page.locator(".qpay-app-section .paywall-primary-cta").click();
  await expect.poll(() => handoffs(fixture.calls).length).toBe(2);
  await lifecycle(page, "pagehide");
  await lifecycle(page, "pageshow");
  await expect.poll(() => returns(fixture.calls).length).toBe(2);
  expect(handoffs(fixture.calls)[1].attemptId).not.toBe(handoffs(fixture.calls)[0].attemptId);
  expect(returns(fixture.calls)[1].attemptId).toBe(handoffs(fixture.calls)[1].attemptId);
  for (const event of [...handoffs(fixture.calls), ...returns(fixture.calls)]) expectPrivateTelemetry(event);
  expect(fixture.calls.blocked).toEqual([]);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: {}, session: {} });
});

test("return retries an undelivered handoff with the same event identity before recording its return", async ({ page }) => {
  const fixture = await openCheckout(page);
  fixture.setAnalyticsResponse(body => body.eventName === "qpay_handoff_attempted" && handoffs(fixture.calls).length === 1
    ? { status: 503, body: { error: "test_unavailable" } }
    : { status: 202, body: { accepted: true, recorded: true } });
  const { bank } = await selectExpandedBank(page);
  await bank.press("Enter");
  await expect.poll(() => handoffs(fixture.calls).length).toBe(1);
  await lifecycle(page, "pagehide");
  await lifecycle(page, "pageshow");
  await expect.poll(() => returns(fixture.calls).length).toBe(1);
  expect(handoffs(fixture.calls)).toHaveLength(2);
  expect(handoffs(fixture.calls)[1]).toEqual(handoffs(fixture.calls)[0]);
  expect(returns(fixture.calls)[0].attemptId).toBe(handoffs(fixture.calls)[0].attemptId);
  const sequence = fixture.calls.analytics.filter(event => event.eventName.startsWith("qpay_"));
  expect(sequence.map(event => event.eventName)).toEqual(["qpay_handoff_attempted", "qpay_handoff_attempted", "qpay_page_returned"]);
});
