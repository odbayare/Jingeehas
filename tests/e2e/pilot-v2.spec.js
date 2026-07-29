"use strict";
const { test, expect } = require("@playwright/test");

test("private pilot denies ordinary visitors and is noindex", async ({ page }) => {
  await page.goto("/pilot-v2");
  await expect(page.locator("h1")).toContainText("Хандах эрхгүй");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex,nofollow/);
  await expect(page.locator("a[href*='qpay'], a[href*='signup']")).toHaveCount(0);
});

test("390px pilot report does not overflow and renders provenance", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pilot-v2?pilot_invite=e2e");
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page).toHaveURL(/pilot-v2\/questions/);
  const radios = page.locator('input[type="radio"][value="2"]');
  for (let index = 0; index < await radios.count(); index += 1) await radios.nth(index).check();
  await page.getByRole("button", { name: "Хадгалж, үр дүн харах" }).click();
  await expect(page).toHaveURL(/pilot-v2\/report/);
  await expect(page.getByText("jingeehas-ai-pilot-v2.1")).toBeVisible();
  await expect(page.getByText("jingeehas-ai-pilot-scoring-v2.1-equal-weight")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
