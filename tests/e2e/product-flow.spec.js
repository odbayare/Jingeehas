"use strict";
const { test, expect } = require("@playwright/test");

async function completeEligibleGate(page, suffix = "") {
  await page.goto(`/assessment/start?e2e=1${suffix}`);
  await page.locator("#safety-age").fill("30");
  await page.locator('input[name="selfHarm"][value="Үгүй"]').check();
  await page.locator('input[name="acuteMedical"][value="Аль нь ч үгүй"]').check();
  await page.locator('input[name="compensatoryBehavior"][value="Үгүй"]').check();
  await page.locator('input[name="medicalSuitability"][value="Үргэлжлүүлэхэд тохиромжтой"]').check();
  await page.getByRole("button", { name: "Тохирох эсэхийг шалгах" }).click();
  await expect(page).toHaveURL(/\/assessment\/payment$/);
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
    await page.getByRole("button", { name: /Үргэлжлүүлэх|Тайлан харах/ }).click();
    await page.waitForFunction(previous => {
      if (window.location.pathname !== "/assessment/questions") return true;
      return document.querySelector("[data-question]")?.dataset.question !== previous;
    }, questionId);
  }
  await expect(page).toHaveURL(/\/assessment\/payment$/);
}

for (const width of [375, 390, 430, 1280]) {
  test(`landing has no page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Илүүдэл жингээс салах тест үнэлгээ" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
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
  await expect(page.getByRole("heading", { name: "Төлбөрөөс өмнөх аюулгүй байдлын шалгалт" })).toBeVisible();
});

test("urgent self-harm guidance is free and does not create an invoice", async ({ page, request }) => {
  await page.goto("/assessment/start?e2e=1");
  await page.locator("#safety-age").fill("30");
  await page.locator('input[name="selfHarm"][value="Одоо идэвхтэй бодогдож байна"]').check();
  await page.locator('input[name="acuteMedical"][value="Аль нь ч үгүй"]').check();
  await page.locator('input[name="compensatoryBehavior"][value="Үгүй"]').check();
  await page.locator('input[name="medicalSuitability"][value="Үргэлжлүүлэхэд тохиромжтой"]').check();
  await page.getByRole("button", { name: "Тохирох эсэхийг шалгах" }).click();
  await expect(page.getByRole("heading", { name: "Яаралтай тусламж аваарай" })).toBeVisible();
  await expect(page.getByText("Энэ зөвлөмж төлбөргүй.")).toBeVisible();
  await expect(page.getByText(/ухаан балар/)).toHaveCount(0);
  expect((await (await request.get("/__test/stats")).json()).qpayCreate).toBe(0);
});

test("questionnaire completion unlocks one payment attempt and full report", async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await completeEligibleGate(page);
  await page.locator("#contact-email").fill("invalid");
  await page.getByRole("button", { name: "Мэдээллээ хадгалаад тест рүү үргэлжлүүлэх" }).click();
  await expect(page.getByText("Имэйл хаягаа зөв оруулна уу.")).toBeVisible();
  await page.locator("#contact-email").fill("paid@example.com");
  await page.getByRole("button", { name: "Мэдээллээ хадгалаад тест рүү үргэлжлүүлэх" }).click();
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  await expect(page.getByRole("button", { name: "9,900₮-ийн QPay нэхэмжлэл үүсгэх" })).toHaveCount(0);
  await completeQuestionnaire(page);
  await expect(page.getByRole("heading", { name: "QPay нэхэмжлэл" })).toBeVisible();
  const createButton = page.getByRole("button", { name: "9,900₮-ийн QPay нэхэмжлэл үүсгэх" });
  await createButton.evaluate(button => { button.click(); button.click(); });
  await expect(page.getByText("Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.")).toBeVisible();
  expect((await (await request.get("/__test/stats")).json()).qpayCreate).toBe(1);
  await expect(page.getByText(/Нэхэмжлэлийн хугацаа/)).toBeVisible();
  await page.getByRole("button", { name: "Төлбөр шалгах" }).click();
  await expect(page.getByText("Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.")).toBeVisible();
  await page.getByRole("link", { name: "Бүрэн тайлан харах" }).click();
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
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
  await page.getByRole("button", { name: "Мэдээллээ хадгалаад тест рүү үргэлжлүүлэх" }).click();
  await expect(page.getByRole("heading", { name: "Зөвлөхийн урилга ирсэн байна" })).toBeVisible();
  await expect(page.getByText("Миний асуулт бүрд өгсөн түүхий хариултыг тусад нь харуулахгүй.")).toBeVisible();
  await page.getByLabel("Бүрэн тайлангаа хуваалцахгүй.").check();
  await page.getByRole("button", { name: "Сонголтоо баталгаажуулах" }).click();
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
