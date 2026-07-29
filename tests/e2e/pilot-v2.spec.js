"use strict";
const { test, expect } = require("@playwright/test");
const INVITE = "aaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbb";
async function beginPilot(page) {
  await page.goto(`/pilot-v2#pilot_invite=${INVITE}`);
  await page.locator("#pilot-acknowledgment").check();
  await page.getByRole("button", { name: "Танилцаж, эхлэх" }).click();
  await expect(page).toHaveURL(/pilot-v2\/questions/);
}

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
  await expect(page.getByRole("button", { name: "Танилцаж, эхлэх" })).toBeVisible();
  await expect(page).toHaveURL(/\/pilot-v2$/);
  expect(requests.length).toBeGreaterThan(0);
  for (const request of requests) {
    expect(request.url).not.toContain(INVITE);
    expect(request.referer).not.toContain(INVITE);
    expect(request.url).not.toContain("pilot_invite");
  }
});

test("section save failure is visible and retryable", async ({ page }) => {
  await beginPilot(page);
  let aborted = false;
  await page.route("**/.netlify/functions/pilot-v2-assessment", async route => {
    const body = route.request().postDataJSON();
    if (!aborted && body?.action === "save") { aborted = true; return route.abort(); }
    return route.continue();
  });
  const safetyQuestions = page.locator(".question");
  for (let index = 0; index < await safetyQuestions.count(); index += 1) await safetyQuestions.nth(index).locator('input[type="radio"]').first().check();
  await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
  await expect(page.getByText("Хадгалж чадсангүй. Дахин оролдоно уу.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" })).toBeEnabled();
});

test("acknowledgment is required and safety routing stops profile sections", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/pilot-v2#pilot_invite=${INVITE}`);
  await page.getByRole("button", { name: "Танилцаж, эхлэх" }).click();
  await expect(page.getByText("Үргэлжлүүлэхийн өмнө танилцсанаа баталгаажуулна уу.")).toBeVisible();
  await page.locator("#pilot-acknowledgment").check();
  await page.getByRole("button", { name: "Танилцаж, эхлэх" }).click();
  await expect(page.getByRole("heading", { name: "Аюулгүй байдлын урьдчилсан шалгалт" })).toBeVisible();
  const safetyQuestions = page.locator(".question");
  for (let index = 0; index < await safetyQuestions.count(); index += 1) await safetyQuestions.nth(index).locator('input[value="none"]').check();
  await safetyQuestions.nth(1).locator('input[value="present"]').check();
  await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
  await expect(page).toHaveURL(/pilot-v2\/report/);
  await expect(page.getByRole("heading", { name: "Өөрийгөө гэмтээх бодлын үед" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Таны 9 хэмжээст профайл" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Харьцангуй илүү дэмжигдсэн/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Ажиглаж болох эхний чиглэл/ })).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("progressive pilot saves, resumes, emits idempotent sections, and renders a 390px report", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await beginPilot(page);

  const safetyQuestions = page.locator(".question");
  for (let index = 0; index < await safetyQuestions.count(); index += 1) await safetyQuestions.nth(index).locator('input[value="none"]').check();
  await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
  await expect(page.getByText("Хэсэг 2 / 12")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Сэтгэл хөдлөлтэй холбоотой идэлт" })).toBeVisible();
  expect(await page.locator("body").innerText()).not.toContain("emotional_eating");
  await page.reload();
  await expect(page.getByText("Хэсэг 2 / 12")).toBeVisible();

  for (let sectionIndex = 1; sectionIndex < 12; sectionIndex += 1) {
    const fieldsets = page.locator(".question");
    const count = await fieldsets.count();
    for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
      const inputs = fieldsets.nth(itemIndex).locator('input[type="radio"]');
      const choice = sectionIndex === 11 ? Math.min(1, (await inputs.count()) - 1)
        : Math.min(2, (await inputs.count()) - 1);
      await inputs.nth(choice).check();
    }
    await page.getByRole("button", { name: "Хадгалж үргэлжлүүлэх" }).click();
    if (sectionIndex < 11) await expect(page.getByText(`Хэсэг ${sectionIndex + 2} / 12`)).toBeVisible();
  }
  await expect(page).toHaveURL(/pilot-v2\/report/);
  await expect(page.getByRole("heading", { name: /Нэмэлт нөхцөл/ })).toBeVisible();
  await expect(page.locator("details")).not.toHaveAttribute("open", "");
  await expect(page.locator("summary")).toHaveText("Хувилбарын техникийн мэдээлэл");
  const visibleText = await page.locator("body").innerText();
  for (const internal of ["emotional_eating", "partial_scorable", "insufficient_data", "complete", "barrier", "capability", "aggregate nativeScore", "Cross-construct metric equivalence", "\nInstrument\n", "\nScoring\n", "\nReport\n"]) expect(visibleText).not.toContain(internal);
  expect(visibleText).toContain("Бүрэн хариулсан");
  expect(visibleText).toContain("Саадын чиглэл");
  expect(visibleText).toContain("Дэмжих чадварын чиглэл");
  for (const heading of ["Сэтгэл хөдлөлтэй холбоотой идэлт", "Гадаад өдөөлтийн нөлөө", "Хяналт алдагдсан мэт идэлт", "Хооллолтын өөртөө итгэх итгэл", "Өлсгөлөн, цадалтын мэдрэмж", "Дадлын автомат байдал", "Биеийн дүр төрхөөс зайлсхийх", "Төлөвлөгөөг хэрэгжүүлэх саад", "Хэт хязгаарлалтын буцалт"]) expect(visibleText).toContain(heading);
  await page.locator("summary").click();
  await expect(page.getByText("jingeehas-ai-pilot-v2.1")).toBeVisible();
  await expect(page.getByText("jingeehas-ai-pilot-scoring-v2.1-equal-weight")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const events = await (await page.request.get("/__test/pilot-events")).json();
  const sections = events.keys.filter(key => key.includes(":section_reached:"));
  expect(new Set(sections).size).toBe(12);
  expect(sections.length).toBe(12);
});
