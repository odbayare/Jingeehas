"use strict";
const { test, expect } = require("@playwright/test");
test.setTimeout(120000);

async function completeEligibleGate(page, suffix = "") {
  await page.goto(`/assessment/start?e2e=1${suffix}`);
  await page.locator('input[name="age"]').fill("30");
  await page.locator('input[name="selfHarm"][value="Үгүй"]').check();
  await page.locator('input[name="acuteMedical"][value="Аль нь ч үгүй"]').check();
  await page.locator('input[name="compensatoryBehavior"][value="Үгүй"]').check();
  await page.locator('input[name="medicalSuitability"][value="Үргэлжлүүлэхэд тохиромжтой"]').check();
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
  await expect(page.locator("#contact-email")).toBeVisible();
}

async function completeQuestionnaire(page) {
  for (let step = 0; step < 80 && new URL(page.url()).pathname === "/assessment/questions"; step += 1) {
    const questionId = await page.locator("#question-form").evaluate(form => {
      const inputs = [...form.querySelectorAll("input, textarea")];
      const required = inputs.filter(input => input.required);
      const questionId = inputs.find(input => input.dataset.question)?.dataset.question || "";
      for (const input of inputs) {
        if (input.type === "number") {
          input.value = questionId === "Q-HEIGHT" ? "170" : questionId === "Q-WEIGHT" ? "80" : "30";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (input.tagName === "TEXTAREA") {
          input.value = "Өдөр тутмын хуваарьтай нийцээгүй тул тогтвортой үргэлжлээгүй.";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
      const requiredRadio = inputs.find(input => input.type === "radio");
      if (requiredRadio) {
        const safe = inputs.find(input => input.type === "radio" && input.value === "Үгүй") || requiredRadio;
        safe.checked = true; safe.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const requiredCheckbox = inputs.find(input => input.type === "checkbox");
      if (requiredCheckbox) {
        const safe = inputs.find(input => input.type === "checkbox" && input.value === "Аль нь ч үгүй") || requiredCheckbox;
        safe.checked = true; safe.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return questionId;
    });
    await page.getByRole("button", { name: /Үргэлжлүүлэх|Тестийг дуусгах/ }).click();
    await page.waitForFunction(previous => {
      if (window.location.pathname !== "/assessment/questions") return true;
      return document.querySelector("[data-question]")?.dataset.question !== previous;
    }, questionId);
    if (new URL(page.url()).pathname !== "/assessment/questions") break;
  }
  await expect(page).toHaveURL(/\/report(?:\?e2e=1)?$/);
}

for (const [width, height] of [[375, 812], [390, 844], [768, 1024], [1440, 900]]) {
  test(`refreshed landing hero is usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?" })).toBeVisible();
    const questions = page.locator(".hero-question");
    await expect(questions).toHaveCount(3);
    await expect(page.locator(".hero-highlight")).toBeVisible();
    const cta = page.getByRole("link", { name: "Сэтгэлзүйн хэв маягаа тодорхойлох" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/assessment/start");
    await expect(page.locator(".hero-note")).toBeVisible();
    await expect(page.locator(".hero-visual")).toBeVisible();
    expect(await page.locator(".hero-visual").evaluate(element => getComputedStyle(element).backgroundImage.includes("hero-woman-stretch.png"))).toBe(true);
    await expect(page.getByText("Үнэ: 9,900₮", { exact: true })).toHaveCount(0);
    await expect(page.locator(".hero")).not.toContainText("9,900₮");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(await cta.evaluate(element => element.getBoundingClientRect().width <= window.innerWidth)).toBe(true);
  });
}

test("methodology trust content stacks without mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Арга зүй ба судалгааны үндэслэл" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Аюулгүй байдлын дохио" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Сэтгэлзүй ба зан үйлийн хэв маяг" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Өдөр тутмын саад ба орчны нөлөө" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("owner daily funnel dashboard is readable at 375px", async ({ page, context }) => {
  await context.addCookies([{ name: "jingeehas_admin", value: "admin-e2e", domain: "127.0.0.1", path: "/" }]);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/admin?e2e=1");
  await expect(page.getByRole("heading", { name: "Өдөр тутмын үзүүлэлт" })).toBeVisible();
  await expect(page.getByText("Цагийн бүс: Улаанбаатар")).toBeVisible();
  await expect(page.getByText("Одоогийн урсгал: Төлбөр эхэнд", { exact: true })).toBeVisible();
  await expect(page.getByText("Paywall", { exact: false })).toHaveCount(0);
  await expect(page.locator(".metric-value", { hasText: "29,700₮" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator(".table-scroll")).toHaveCSS("overflow-x", "auto");
});

test("detailed methodology route returns its conservative evidence disclosure", async ({ page, request }) => {
  const response = await request.get("/methodology");
  expect(response.status()).toBe(200);
  await page.goto("/methodology");
  await expect(page.getByRole("heading", { name: "Арга зүй ба судалгааны үндэслэл" })).toBeVisible();
  for (const name of ["TFEQ / TFEQ-R18", "DEBQ", "AEBQ", "EEQ", "BEDS-7", "SCOFF", "PHQ-9", "STOP-Bang", "WEL / WEL-SF", "IPAQ", "IWQOL-Lite", "Obesity Canada 5As", "Obesity Canada 4Ms", "AACE", "NICE", "Noom", "WeightWatchers", "Calibrate", "Wegovy consumer quiz"]) await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("coming-soon cannot be bypassed by a public query", async ({ page }) => {
  await page.goto("/assessment/start?internalTest=1");
  await expect(page.getByRole("heading", { name: "Тун удахгүй" })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).length)).toBe(0);
});

test("authenticated owner can establish a production-mode preview", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel("Имэйл").fill("owner@example.com");
  await page.getByLabel("Нууц үг").fill("owner-password-strong");
  await page.getByRole("button", { name: "Нэвтрэх" }).click();
  await page.getByRole("button", { name: "Бодит тестийг шалгах" }).click();
  await expect(page).toHaveURL(/\/assessment\/start$/);
  await expect(page.getByRole("heading", { name: "Үргэлжлүүлэхэд тохиромжтой эсэхийг шалгах" })).toBeVisible();
});

test("assessment starts with the short free safety gate", async ({ page, request }) => {
  await page.goto("/assessment/start?e2e=1");
  await expect(page.locator("#safety-form")).toBeVisible();
  expect((await (await request.get("/__test/stats")).json()).qpayCreate).toBe(0);
});

test("paid-first checkout creates one invoice and completion opens the full report", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await completeEligibleGate(page);
  await page.locator("#contact-email").fill("invalid");
  await page.getByRole("button", { name: "QPay-аар төлөөд тестээ эхлүүлэх" }).click();
  await expect(page.getByText("Имэйл хаягаа зөв оруулна уу.")).toBeVisible();
  await page.locator("#contact-email").fill("paid@example.com");
  await page.getByRole("button", { name: "QPay-аар төлөөд тестээ эхлүүлэх" }).evaluate(button => { button.click(); button.click(); });
  await expect(page).toHaveURL(/\/assessment\/payment$/);
  await expect(page.getByText("Үнэ: 9,900₮", { exact: true })).toBeVisible();
  const beforeCompletion = await (await request.get("/__test/stats")).json();
  await page.getByRole("button", { name: "Төлбөр шалгах" }).click();
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  await completeQuestionnaire(page);
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
  await expect(page.getByText("QPay нэхэмжлэл", { exact: true })).toHaveCount(0);
  const afterCompletion = await (await request.get("/__test/stats")).json();
  expect(afterCompletion.qpayCreate).toBe(beforeCompletion.qpayCreate);
  expect(afterCompletion.paymentRows).toBe(beforeCompletion.paymentRows);
});

test("question transition gives immediate feedback and ignores duplicate submit", async ({ page, request }) => {
  await completeEligibleGate(page);
  await page.locator("#contact-email").fill("transition@example.com");
  await page.getByRole("button", { name: "QPay-аар төлөөд тестээ эхлүүлэх" }).click();
  await page.getByRole("button", { name: "Төлбөр шалгах" }).click();
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  await page.locator('[data-question="Q-AGE"]').fill("30");
  await page.locator('[data-question="Q-AGE"]').dispatchEvent("change");
  const before = (await (await request.get("/__test/stats")).json()).assessmentSave;
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).evaluate(button => { button.click(); button.click(); });
  await expect(page.getByRole("button", { name: "Хадгалж байна..." })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Хадгалж байна...");
  await page.waitForFunction(() => document.querySelector("[data-question]")?.dataset.question === "Q-SEX");
  const after = (await (await request.get("/__test/stats")).json()).assessmentSave;
  expect(after - before).toBe(1);
});

test("recovery succeeds in a new browser context", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 430, height: 820 } });
  const page = await context.newPage();
  await page.goto("/recovery?e2e=1");
  await page.getByLabel("Имэйл").fill("paid@example.com");
  await page.getByRole("button", { name: "Баталгаажуулах код авах" }).click();
  await page.getByLabel("Баталгаажуулах код").fill("123456");
  await page.getByRole("button", { name: "Тайлан сэргээх" }).click();
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
  await context.close();
});

test("invitation token is removed and consent decline is explicit", async ({ page }) => {
  await completeEligibleGate(page, "&invite=invite-e2e");
  expect(page.url()).not.toContain("invite=");
  await page.locator("#contact-email").fill("client@example.com");
  await expect(page.getByRole("heading", { name: "Зөвлөхийн урилга ирсэн байна" })).toBeVisible();
  await expect(page.getByText("Асуулт бүрийн түүхий хариултыг зөвлөхөд харуулахгүй.")).toBeVisible();
  await page.getByLabel("Бүрэн тайлангаа хуваалцахгүй.").check();
  await page.getByRole("button", { name: "QPay-аар төлөөд тестээ эхлүүлэх" }).click();
  await page.getByRole("button", { name: "Төлбөр шалгах" }).click();
  await expect(page.getByRole("heading", { name: "Суурь мэдээлэл" })).toBeVisible();
  await expect(page.getByText(/хөнгөлөлт/i)).toHaveCount(0);
});

test("advisor dashboard uses Mongolian statuses and accessible table overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/advisor/login?e2e=1");
  await page.getByLabel("Имэйл").fill("advisor@example.com");
  await page.getByLabel("Нууц үг").fill("a-secure-password");
  await page.getByRole("button", { name: "Нэвтрэх" }).click();
  await expect(page.getByRole("heading", { name: "Зөвлөхийн самбар" })).toBeVisible();
  await expect(page.getByText("9,900₮")).toBeVisible();
  await expect(page.getByText("4,000₮").first()).toBeVisible();
  await expect(page.getByText("Зөвшөөрсөн")).toBeVisible();
  expect(await page.locator(".table-scroll").getAttribute("tabindex")).toBe("0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("print mode hides controls and keeps report", async ({ page }) => {
  await page.goto("/report?e2e=1");
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#report-content")).toBeVisible();
  await expect(page.getByRole("button", { name: "Хэвлэх эсвэл PDF-ээр хадгалах" })).toBeHidden();
});

for (const id of ["VU-03", "VU-06"]) {
  test(`${id} report remains readable at 375px and complete in print`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(`/__test/select-report?id=${id}`);
    await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Эхний туршилт" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const paragraphSentenceCounts = await page.locator("#report-content p").evaluateAll(paragraphs => paragraphs.map(paragraph => paragraph.textContent.split(/[.!?](?:\s|$)/u).filter(Boolean).length));
    expect(Math.max(...paragraphSentenceCounts)).toBeLessThanOrEqual(3);
    const sectionCount = await page.locator("#report-content .report-section").count();
    expect(sectionCount).toBeGreaterThanOrEqual(8);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("#report-content")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Эхний туршилт" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Хэвлэх эсвэл PDF-ээр хадгалах" })).toBeHidden();
    expect(await page.locator("#report-content .report-section").count()).toBe(sectionCount);
  });
}
