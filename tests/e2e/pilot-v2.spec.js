"use strict";
const { test, expect } = require("@playwright/test");
const INVITE = "aaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbb";

test("private pilot denies ordinary visitors and is noindex", async ({ page }) => {
  await page.goto("/pilot-v2");
  await expect(page.locator("h1")).toContainText("Хандах эрхгүй");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex,nofollow/);
  await expect(page.locator("a[href*='qpay'], a[href*='signup']")).toHaveCount(0);
});

test("fragment invite is removed before API requests", async ({ page }) => {
  const requests = [];
  page.on("request", request => { if (request.url().includes("/.netlify/functions/pilot-v2")) requests.push({ url: request.url(), referer: request.headers().referer || "" }); });
  await page.goto(`/pilot-v2#pilot_invite=${INVITE}`);
  await expect(page.getByRole("button", { name: "Эхлэх" })).toBeVisible();
  await expect(page).toHaveURL(/\/pilot-v2$/);
  expect(requests.length).toBeGreaterThan(0);
  for (const request of requests) {
    expect(request.url).not.toContain(INVITE);
    expect(request.referer).not.toContain(INVITE);
    expect(request.url).not.toContain("pilot_invite");
  }
});

test("section save failure is visible and retryable", async ({ page }) => {
  await page.goto(`/pilot-v2#pilot_invite=${INVITE}`);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page).toHaveURL(/pilot-v2\/questions/);
  let aborted = false;
  await page.route("**/.netlify/functions/pilot-v2-assessment", async route => {
    const body = route.request().postDataJSON();
    if (!aborted && body?.action === "save") { aborted = true; return route.abort(); }
    return route.continue();
  });
  await page.locator(".question").first().locator('input[type="radio"]').first().check();
  await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
  await expect(page.getByText("Хадгалж чадсангүй. Дахин оролдоно уу.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" })).toBeEnabled();
});

test("progressive pilot saves, resumes, emits idempotent sections, and renders a 390px report", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/pilot-v2#pilot_invite=${INVITE}`);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page).toHaveURL(/pilot-v2\/questions/);

  await page.locator(".question").first().locator('input[type="radio"][value="2"]').check();
  await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
  await expect(page.getByText("Хэсэг 2 / 12")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Хэсэг 2 / 12")).toBeVisible();

  for (let sectionIndex = 1; sectionIndex < 12; sectionIndex += 1) {
    const fieldsets = page.locator(".question");
    const count = await fieldsets.count();
    for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
      const inputs = fieldsets.nth(itemIndex).locator('input[type="radio"]');
      const choice = sectionIndex === 11 ? 0 : sectionIndex === 10 ? Math.min(1, (await inputs.count()) - 1)
        : Math.min(2, (await inputs.count()) - 1);
      await inputs.nth(choice).check();
    }
    await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
    if (sectionIndex < 11) await expect(page.getByText(`Хэсэг ${sectionIndex + 2} / 12`)).toBeVisible();
  }
  await expect(page).toHaveURL(/pilot-v2\/report/);
  await expect(page.getByText("jingeehas-ai-pilot-v2.1")).toBeVisible();
  await expect(page.getByText("jingeehas-ai-pilot-scoring-v2.1-equal-weight")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Нэмэлт нөхцөл/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const events = await (await page.request.get("/__test/pilot-events")).json();
  const sections = events.keys.filter(key => key.includes(":section_reached:"));
  expect(new Set(sections).size).toBe(12);
  expect(sections.length).toBe(12);
});
