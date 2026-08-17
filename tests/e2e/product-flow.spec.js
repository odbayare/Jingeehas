"use strict";
const { test, expect } = require("@playwright/test");
test.setTimeout(120000);

test.beforeEach(async ({ request }) => {
  await request.post("/__test/reset");
});

async function openFreeAssessment(page, suffix = "") {
  await page.goto(`/assessment/start?e2e=1${suffix}`);
  await expect(page.getByRole("heading", { name: "Тестээ эхлүүлэх" })).toBeVisible();
  await expect(page.getByText("Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр санагдсан хариултаа сонгоорой.", { exact: true })).toBeVisible();
  await expect(page.getByText("Таны хариултаас шалтгаалан зарим асуулт нэмэгдэж болно.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Эхлэх" })).toBeVisible();
  await expect(page.locator("#contact-email")).toHaveCount(0);
  await expect(page.getByText("39,000₮", { exact: false })).toHaveCount(0);
  await expect(page.getByText("QPay", { exact: false })).toHaveCount(0);
  await expect(page.locator("#safety-form")).toHaveCount(0);
}

async function completeQuestionnaire(page, expectedPath = "/assessment/result") {
  await expect.poll(() => new URL(page.url()).pathname).toBe("/assessment/questions");
  for (let step = 0; step < 120 && new URL(page.url()).pathname === "/assessment/questions"; step += 1) {
    const inputs = page.locator("#question-form [data-question]");
    const first = inputs.first();
    const questionId = await first.getAttribute("data-question");
    const type = await first.getAttribute("type");
    const tagName = await first.evaluate(element => element.tagName);
    if (type === "number") await first.fill(questionId === "Q-HEIGHT" ? "170" : questionId === "Q-WEIGHT" ? "80" : "30");
    else if (tagName === "TEXTAREA") await first.fill("Өдөр тутмын хуваарьтай нийцээгүй тул тогтвортой үргэлжлээгүй.");
    else if (type === "radio") {
      const safe = page.locator('#question-form [data-question][value="Үгүй"]');
      if (await safe.count()) await safe.first().check();
      else await first.check();
    } else if (type === "checkbox") {
      const safe = page.locator('#question-form [data-question][value="Аль нь ч үгүй"]');
      if (await safe.count()) await safe.first().check();
      else await first.check();
    }
    await page.getByRole("button", { name: /Үргэлжлүүлэх|Тестийг дуусгах/ }).click();
    await page.waitForFunction(previous => {
      if (window.location.pathname !== "/assessment/questions") return true;
      return document.querySelector("[data-question]")?.dataset.question !== previous;
    }, questionId);
    if (new URL(page.url()).pathname !== "/assessment/questions") break;
  }
  await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
}

for (const [width, height] of [[375, 812], [390, 844], [430, 900], [768, 1024], [1440, 900]]) {
  test(`refreshed landing hero is usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const heading = page.getByRole("heading", { name: "ЖИН ХАСАХ АМАРХАН БОЛЛОО" });
    await expect(heading).toBeVisible();
    const headingMetrics = await heading.evaluate(element => {
      const styles = getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight);
      return { fontSize, lines: Math.round(element.getBoundingClientRect().height / lineHeight) };
    });
    expect(headingMetrics.fontSize).toBeGreaterThanOrEqual(width >= 1024 ? 48 : 38);
    expect(headingMetrics.lines).toBeLessThanOrEqual(3);
    const questions = page.locator(".hero-question");
    await expect(questions).toHaveCount(5);
    const paragraphs = page.locator(".hero-paragraph");
    await expect(paragraphs).toHaveCount(2);
    const paragraphMetrics = await paragraphs.first().evaluate(element => {
      const styles = getComputedStyle(element);
      return { width: element.getBoundingClientRect().width, fontSize: parseFloat(styles.fontSize), lineHeight: parseFloat(styles.lineHeight) / parseFloat(styles.fontSize) };
    });
    expect(paragraphMetrics.width).toBeLessThanOrEqual(700);
    expect(paragraphMetrics.lineHeight).toBeGreaterThanOrEqual(1.6);
    expect(headingMetrics.fontSize).toBeGreaterThan(paragraphMetrics.fontSize * 2);
    const questionTops = await questions.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().top));
    expect(questionTops.every((top, index) => index === 0 || top > questionTops[index - 1])).toBe(true);
    const intro = page.locator(".hero-test-intro");
    await expect(intro).toHaveText("Бүрэн тайлан тань яг үүнийг харуулна.");
    expect(await intro.evaluate(element => Number(getComputedStyle(element).fontWeight))).toBeGreaterThanOrEqual(700);
    const cta = page.getByRole("link", { name: "ТЕСТЭЭ ЭХЛҮҮЛЭХ" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/assessment/start");
    expect(await cta.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(54);
    const visualOrder = await page.locator(".landing-page").evaluate(element => [...element.querySelectorAll(".hero h1, .hero-paragraph, .hero-actions, .hero-visual, .hero-explainer")].map(node => node.matches("h1") ? "h1" : node.classList[0]));
    expect(visualOrder).toEqual(["h1", "hero-paragraph", "hero-paragraph", "hero-actions", "hero-visual", "hero-explainer"]);
    if (width >= 1024) {
      expect(await cta.evaluate(element => element.getBoundingClientRect().bottom <= window.innerHeight)).toBe(true);
      expect(await page.locator(".hero-visual").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(330);
      const columnHeights = await page.locator(".hero").evaluate(element => ({
        copy: element.querySelector(".hero-copy").getBoundingClientRect().height,
        visual: element.querySelector(".hero-visual").getBoundingClientRect().height
      }));
      expect(Math.abs(columnHeights.visual - columnHeights.copy)).toBeLessThan(1);
      const sectionLefts = await page.locator(".landing-page").evaluate(element => ({
        hero: element.querySelector(".hero").getBoundingClientRect().left,
        explainer: element.querySelector(".hero-explainer").getBoundingClientRect().left,
        sample: element.querySelector(".sample-report").getBoundingClientRect().left
      }));
      expect(Math.abs(sectionLefts.explainer - sectionLefts.hero)).toBeLessThan(1);
      expect(Math.abs(sectionLefts.explainer - sectionLefts.sample)).toBeLessThan(1);
    }
    await expect(page.locator(".hero-note")).toHaveText("Тест үнэгүй · Хувийн тайлан 39,000₮");
    await expect(page.locator(".hero-visual")).toBeVisible();
    expect(await page.locator(".hero-visual").evaluate(element => getComputedStyle(element).backgroundImage.includes("hero-woman-stretch.png"))).toBe(true);
    await expect(page.getByText("Үнэ: 39,000₮", { exact: true })).toHaveCount(0);
    await expect(page.locator(".hero")).toContainText("39,000₮");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    expect(await cta.evaluate(element => element.getBoundingClientRect().width <= window.innerWidth)).toBe(true);
  });
}

test("landing CTA retains SPA routing and analytics tracking", async ({ page }) => {
  await page.goto("/");
  const trackingRequest = page.waitForRequest(request => {
    if (!request.url().endsWith("/.netlify/functions/analytics-collect") || request.method() !== "POST") return false;
    try { return JSON.parse(request.postData() || "{}").eventName === "start_cta_clicked"; } catch { return false; }
  });
  await page.getByRole("link", { name: "ТЕСТЭЭ ЭХЛҮҮЛЭХ" }).click();
  await trackingRequest;
  await expect(page).toHaveURL(/\/assessment\/start$/);
  await expect(page.getByRole("heading", { name: "Тестээ эхлүүлэх" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Эхлэх" })).toBeVisible();
});

test("natural Mongolian report preview is complete, ordered, and responsive", async ({ page }) => {
  const lead = "Таны өгсөн хариултуудыг нэгтгэж, жин хасахад тань юу хамгийн их саад болж байгааг, тэр нь өдөр тутмын амьдралд тань хэрхэн илэрдгийг, юунаас эхэлбэл илүү бодитойг тайлбарлана.";
  const labels = ["ТАНД ХАМГИЙН ИХ СААД БОЛЖ БУЙ ЗҮЙЛ", "ЭНЭ НЬ ӨДӨР ТУТМЫН АМЬДРАЛД ХЭРХЭН ИЛЭРДЭГ ВЭ?", "ЮУНААС ЭХЭЛЭХ ВЭ?", "ДЭГЛЭМЭЭ БАРЬЖ ЧАДААГҮЙ ҮЕД ЯАХ ВЭ?", "ӨӨРТӨӨ ТОХИРСОН АРГА БАРИЛАА ХЭРХЭН СОНГОХ ВЭ?"];
  const bodies = [
    "Сэтгэл хөдлөл, хэт хатуу дэглэм, ядаргаа, орчны нөлөө, цагийн хуваарь зэрэг хүчин зүйлээс аль нь таны жин хасах оролдлогод хамгийн их нөлөөлж байгааг тодорхойлно.",
    "Та ямар үед хоолны хяналтаа алдах хандлагатай байдаг, ямар нөхцөлд дэглэмээ барихад хэцүү болдог, өмнөх оролдлогууд яагаад тогтвортой үргэлжлээгүйг таны хариулттай холбон тайлбарлана.",
    "Бүхнийг зэрэг өөрчлөхийг шаардахгүй. Танд хамгийн түрүүнд анхаарах шаардлагатай, өдөр тутамдаа хэрэгжүүлж болох цөөн алхмыг санал болгоно.",
    "Дэглэмээ барьж чадаагүй нэг өдрөөс болж бүхнээ орхихгүйгээр дараагийн хоол, дараагийн өдрөөсөө хэрхэн хэвийн үргэлжлүүлэхийг тайлбарлана.",
    "Нойр, ажил, гэр бүл, хөдөлгөөн, санхүүгийн боломж болон өдөр тутмын хуваарьтайгаа нийцүүлэн жин хасах арга барилаа хэрхэн сонгохыг ойлгоно."
  ];
  const banned = ["нэг удаа хазайх", "хазайсны дараа", "хэмнэлдээ эргэн орох", "гол саадтай ажиллах", "бодит аргуудыг авна", "танд тохирох орчин", "төлөвлөгөө тасарвал"];
  for (const [width, height] of [[375, 812], [390, 844], [430, 900], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const preview = page.locator("#sample-report");
    await expect(preview).toHaveCount(1);
    await expect(preview.getByText("Таны авах тайлан", { exact: true })).toBeVisible();
    await expect(preview.getByRole("heading", { name: "Таны тайлан ямар байх вэ?" })).toBeVisible();
    await expect(preview.locator(".report-preview-lead")).toHaveText(lead);
    await expect(preview.locator(".report-preview-item")).toHaveCount(5);
    for (const label of labels) await expect(preview.getByText(label, { exact: true })).toBeVisible();
    for (const body of bodies) await expect(preview.getByText(body, { exact: true })).toBeVisible();
    for (const phrase of banned) await expect(preview.getByText(phrase, { exact: false })).toHaveCount(0);
    await expect(preview.locator(".section-close")).toHaveText("Үнэгүй тест · Хувийн бүрэн тайлан 39,000₮");
    await expect(preview.getByText("Энэ тайлан нь эмнэлгийн болон сэтгэлзүйн онош биш.", { exact: true })).toBeVisible();
    const layout = await preview.evaluate(element => {
      const card = element.querySelector(".sample-report-card").getBoundingClientRect();
      const labelRects = [...element.querySelectorAll(".sample-kicker")].map(label => {
        const rect = label.getBoundingClientRect();
        return { left: rect.left, right: rect.right, fontSize: parseFloat(getComputedStyle(label).fontSize) };
      });
      const heading = element.querySelector("h2").getBoundingClientRect();
      const leadBox = element.querySelector(".report-preview-lead").getBoundingClientRect();
      return { card: { left: card.left, right: card.right }, labelRects, headingWidth: heading.width, leadWidth: leadBox.width, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.card.left).toBeGreaterThanOrEqual(0);
    expect(layout.card.right).toBeLessThanOrEqual(width + 1);
    expect(layout.headingWidth).toBeLessThanOrEqual(width);
    expect(layout.leadWidth).toBeLessThanOrEqual(width);
    expect(layout.labelRects.every(rect => rect.left >= 0 && rect.right <= width + 1 && rect.fontSize >= 12.8)).toBe(true);
  }
  const order = await page.locator(".landing-page").evaluate(element => [...element.querySelectorAll(".hero, #sample-report, .methodology-summary, .scientific-methods-box, .site-footer")].map(node => node.matches(".hero") ? "hero" : node.id || node.classList[0]));
  expect(order).toEqual(["hero", "sample-report", "methodology-summary", "scientific-methods-box", "site-footer"]);
});

test("landing restores trust content before the retained scientific methodology box", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  for (const restored of ["Үнэлгээний зарчим", "Арга зүй ба судалгааны үндэслэл", "Аюулгүй байдлын дохио", "Сэтгэлзүй ба зан үйлийн хэв маяг", "Өдөр тутмын саад ба орчны нөлөө", "Судалж харьцуулсан арга зүй:", "Тайлан хэрхэн гардаг вэ?", "Арга зүйг дэлгэрэнгүй унших"]) {
    await expect(page.getByText(restored, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("үндсэн тестийн явцад танина", { exact: false })).toBeVisible();
  await expect(page.getByText("анхаарах шинж байгаа эсэхийг эхэлж шалгана", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Арга зүйг дэлгэрэнгүй унших" })).toHaveAttribute("href", "/methodology");
  await expect(page.getByRole("heading", { name: "Ашигласан шинжлэх ухааны аргачлалууд" })).toBeVisible();
  await expect(page.locator(".scientific-methods-box")).toHaveCount(1);
  expect((await page.locator(".methodology-pillars").evaluate(element => getComputedStyle(element).gridTemplateColumns)).split(" ").length).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect((await page.locator(".methodology-pillars").evaluate(element => getComputedStyle(element).gridTemplateColumns)).split(" ").length).toBe(3);
  expect((await page.locator(".scientific-method-names").evaluate(element => getComputedStyle(element).gridTemplateColumns)).split(" ").length).toBe(2);
});

test("scientific methodology box is responsive and keyboard accessible", async ({ page }) => {
  for (const [width, height] of [[375, 812], [390, 844], [430, 900], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const box = page.locator(".scientific-methods-box");
    const toggle = box.locator('button[data-action="toggle-scientific-methods"]');
    const details = box.locator("#scientific-methods-details");
    await expect(box.getByRole("heading", { name: "Ашигласан шинжлэх ухааны аргачлалууд" })).toBeVisible();
    await expect(box.locator(".scientific-method-names").getByText("Dutch Eating Behavior Questionnaire — DEBQ", { exact: true })).toBeVisible();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText("Аргачлал бүрийн тайлбарыг харах");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(details).toBeHidden();
    expect(await toggle.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveText("Аргачлал бүрийн тайлбарыг хаах");
    await expect(details).toBeVisible();
    await expect(box.getByText("Энэхүү тест үнэлгээ нь дээрх асуумжуудын шууд орчуулга биш", { exact: false })).toBeVisible();
    await expect(box).not.toContainText("Weight Test");
    await expect(box.locator(".scientific-methods-grid article")).toHaveCount(6);
    expect(await box.locator(".scientific-methods-grid h4").evaluateAll(nodes => nodes.every(node => {
      const rect = node.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= window.innerWidth + 1;
    }))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveText("Аргачлал бүрийн тайлбарыг харах");
    await expect(details).toBeHidden();
    const cta = page.getByRole("link", { name: "ТЕСТЭЭ ЭХЛҮҮЛЭХ" });
    await expect(cta).toHaveAttribute("href", "/assessment/start");
  }
});

test("owner daily funnel and campaign attribution tables are responsive", async ({ page, context }) => {
  await context.addCookies([{ name: "jingeehas_admin", value: "admin-e2e", domain: "127.0.0.1", path: "/" }]);
  for (const [width, height] of [[375, 812], [390, 844], [430, 900], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/admin?e2e=1");
    await expect(page.getByRole("heading", { name: "Өдөр тутмын үзүүлэлт" })).toBeVisible();
    await expect(page.getByText("Цагийн бүс: Улаанбаатар")).toBeVisible();
    await expect(page.getByText("Одоогийн урсгал: Үнэгүй тест → тайлан бэлэн дэлгэц → бүрэн тайлан", { exact: true })).toBeVisible();
    await expect(page.locator(".metric-value", { hasText: "29,700₮" })).toBeVisible();
    const attribution = page.getByRole("region", { name: "Campaign attribution хүснэгт" });
    await expect(page.getByRole("heading", { name: "Campaign attribution" })).toBeVisible();
    await expect(attribution.getByRole("rowheader", { name: "jingeehas_traffic_lpv_reel_v1" })).toBeVisible();
    await expect(attribution.getByRole("rowheader", { name: "Unattributed" })).toBeVisible();
    await expect(attribution).toContainText("Visitor → Start: 83.3%");
    await expect(page.getByText("Owner / test traffic excluded: 4 event, 1 payment, 9,900₮", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator(".analytics-dashboard > .table-scroll")).toHaveCSS("overflow-x", "auto");
    await expect(attribution).toHaveCSS("overflow-x", "auto");
    expect(await attribution.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  }
});

test("question progress card stays compact and expands in two levels", async ({ page, context }) => {
  await context.addCookies([{ name: "jingeehas_admin", value: "admin-e2e", domain: "127.0.0.1", path: "/" }]);
  for (const [width, height] of [[375, 812], [390, 844], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height }); await page.goto("/admin?e2e=1");
    const card = page.locator(".question-progress-card"); await expect(card).toBeVisible();
    const detailsToggle = card.getByRole("button", { name: "Асуултын явцыг дэлгэрэнгүй харах" });
    await expect(detailsToggle).toHaveAttribute("aria-expanded", "false"); await expect(card.locator("table")).toHaveCount(0);
    if (width === 1440) expect(await card.evaluate(element => element.getBoundingClientRect().height)).toBeLessThanOrEqual(260);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await detailsToggle.click(); await expect(detailsToggle).toHaveAttribute("aria-expanded", "true");
    await expect(card.getByRole("heading", { name: "Хамгийн их уналттай цэгүүд" })).toBeVisible();
    await expect(card.locator("tbody").first().locator("tr")).toHaveCount(5);
    const allToggle = card.getByRole("button", { name: "Бүх асуултыг харах" }); await expect(allToggle).toHaveAttribute("aria-expanded", "false");
    await allToggle.click(); await expect(allToggle).toHaveAttribute("aria-expanded", "true"); await expect(card.locator("tbody").nth(1).locator("tr")).toHaveCount(8);
    for (const heading of ["Нийт хүрсэн", "Хариулсан", "Идэвхтэй <24ц", "Уналтад тооцсон", "24+ц зогссон", "Уналтын хувь"]) {
      await expect(card.getByRole("columnheader", { name: heading }).last()).toBeVisible();
    }
    await expect(card).toContainText("Уналтын хувь нь зөвхөн бодитоор бүртгэгдсэн бөгөөд 24 цагийн ажиглалтын хугацаа бүрдсэн тестүүдэд тооцогдоно.");
    await expect(card.locator('span[title="Хэмжихэд хараахан хангалттай live хугацаа бүрдээгүй."]')).toBeVisible();
    await expect(card.locator(".question-progress-table").last()).toHaveCSS("overflow-x", "auto");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
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

test("authenticated owner preview starts through the server gate without QPay", async ({ page, request }) => {
  await page.goto("/admin");
  await page.getByLabel("Имэйл").fill("owner@example.com");
  await page.getByLabel("Нууц үг").fill("owner-password-strong");
  await page.getByRole("button", { name: "Нэвтрэх" }).click();
  await page.getByRole("button", { name: "Бодит тестийг шалгах" }).click();
  await expect(page).toHaveURL(/\/assessment\/start$/);
  await expect(page.getByRole("heading", { name: "Тестээ эхлүүлэх" })).toBeVisible();
  await expect(page.locator("#contact-email")).toHaveCount(0);
  const beforePreview = await (await request.get("/__test/stats")).json();
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  const afterPreview = await (await request.get("/__test/stats")).json();
  expect(afterPreview.qpayCreate).toBe(beforePreview.qpayCreate);
  expect(afterPreview.paymentRows).toBe(beforePreview.paymentRows);
  expect(afterPreview.questionProgressRows).toBeGreaterThan(beforePreview.questionProgressRows);
  const ownerFirstQuestionRows = afterPreview.questionProgressRows;
  await page.reload();
  await expect(page.locator('[data-question="Q-AGE"]')).toBeVisible();
  expect((await (await request.get("/__test/stats")).json()).questionProgressRows).toBe(ownerFirstQuestionRows);
});

test("public free flow starts without contact, payment, or pre-payment safety requests", async ({ page, request }) => {
  const emittedSafetyRequests = [];
  page.on("request", outgoing => {
    if (new URL(outgoing.url()).pathname === "/.netlify/functions/weight-safety-gate") emittedSafetyRequests.push(outgoing.url());
  });
  const before = await (await request.get("/__test/stats")).json();
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).evaluate(button => { button.click(); button.click(); });
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  await expect(page.locator('[data-question="Q-AGE"]')).toBeVisible();
  expect(emittedSafetyRequests).toEqual([]);
  const after = await (await request.get("/__test/stats")).json();
  expect(after.safetyGate).toBe(before.safetyGate);
  expect(after.qpayCreate).toBe(0);
  expect(after.paymentRows).toBe(0);
  expect(after.assessmentCreate).toBe(1);
});

test("sealed result route requires an eligible completed assessment", async ({ page }) => {
  await page.goto("/assessment/result?e2e=1");
  await expect(page).toHaveURL(/\/assessment\/start$/);
  await expect(page.getByRole("heading", { name: "Таны тайлан бэлэн боллоо" })).toHaveCount(0);
});

test("free completion shows only the sealed paywall before provider-confirmed full report", async ({ page, request, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await context.addCookies([{ name: "jingeehas_cohort", value: "VU-03", domain: "127.0.0.1", path: "/" }]);
  const resultRequests = [];
  page.on("request", outgoing => {
    if (new URL(outgoing.url()).pathname.includes("weight-assessment-initial-result")) resultRequests.push(outgoing.url());
  });
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page).toHaveURL(/\/assessment\/questions$/);
  await page.locator('[data-question="Q-AGE"]').fill("30");
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
  await page.waitForFunction(() => document.querySelector("[data-question]")?.dataset.question === "Q-SEX");
  await page.reload();
  await expect(page.locator('[data-question="Q-SEX"]').first()).toBeVisible();
  await completeQuestionnaire(page);
  await expect(page.getByText("ТЕСТ ДУУСЛАА", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Бүрэн тайлангаас та:" })).toBeVisible();
  await expect(page.locator(".report-contents-preview li")).toHaveCount(3);
  await expect(page.getByText("39,000₮", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "БҮРЭН ТАЙЛАНГАА НЭЭХ" })).toBeVisible();
  await expect(page.getByText("QPay · Төлбөр баталгаажмагц бүрэн тайлан нээгдэнэ", { exact: true })).toBeVisible();
  await expect(page.getByText("Та нэг аяга кофены үнээр", { exact: false })).toHaveCount(0);
  for (const forbidden of ["Нөлөөлөх хэв маяг", "Чухал уялдаа холбоо", "Таны хариултыг нэгтгэж дууслаа", "Нэг хэв маяг бусдаасаа илт давамгай гарсангүй", "Бүрэн тайланд нээгдэх хэсгүүд", "Үр дүнгээ хадгалах", "Имэйлээ хадгалах", "Одоо алгасах"]) {
    await expect(page.getByText(forbidden, { exact: true })).toHaveCount(0);
  }
  await expect(page.locator(".result-count-card, .locked-report-preview, .result-email-card, #result-email-form")).toHaveCount(0);
  expect(resultRequests).toEqual([]);
  expect((await (await request.get("/__test/stats")).json()).initialResult).toBe(0);
  for (const [width, height] of [[375, 812], [390, 844], [430, 932], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const ctaBox = await page.getByRole("button", { name: "БҮРЭН ТАЙЛАНГАА НЭЭХ" }).evaluate(element => {
      const box = element.getBoundingClientRect(); return { top: box.top, height: box.height };
    });
    expect(ctaBox.height).toBeGreaterThanOrEqual(44);
    expect(ctaBox.top).toBeLessThanOrEqual(height + 100);
  }
  await page.reload();
  await expect(page.getByRole("heading", { name: "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо" })).toBeVisible();
  await expect(page.locator(".report-contents-preview li")).toHaveCount(3);
  expect(resultRequests).toEqual([]);
  expect((await (await request.get("/__test/stats")).json()).resultEmailSave).toBe(0);
  await page.getByRole("button", { name: "БҮРЭН ТАЙЛАНГАА НЭЭХ" }).evaluate(button => { button.click(); button.click(); });
  await expect(page).toHaveURL(/\/assessment\/payment$/);
  await expect(page.getByRole("heading", { name: "Бүрэн тайлангаа нээх" })).toBeVisible();
  await expect(page.getByText("Үнэ: 39,000₮", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Банкны апп" })).toBeVisible();
  let stats = await (await request.get("/__test/stats")).json();
  expect(stats.qpayCreate).toBe(1);
  expect(stats.paymentRows).toBe(1);
  await page.reload();
  await expect(page.getByRole("button", { name: "Төлбөр шалгах" })).toBeVisible();
  await page.getByRole("button", { name: "Төлбөр шалгах" }).click();
  await expect(page).toHaveURL(/\/report$/);
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ" })).toBeVisible();
  await expect(page.locator(".initial-action-list li")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Хэцүү үеийг хэрхэн даван туулах вэ?" })).toBeVisible();
  await expect(page.locator(".difficult-moment-plan li")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Бүрэн тайлан" })).toBeVisible();
  stats = await (await request.get("/__test/stats")).json();
  expect(stats.qpayCheck).toBe(1);
});

test("neutral completion shows the same sealed paywall", async ({ page, request }) => {
  await request.get("/__test/mode?value=neutral");
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await completeQuestionnaire(page);
  await expect(page.getByRole("heading", { name: "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо" })).toBeVisible();
  await expect(page.locator(".report-contents-preview li")).toHaveCount(3);
  await expect(page.getByText("Нэг хэв маяг бусдаасаа илт давамгай гарсангүй", { exact: true })).toHaveCount(0);
  await expect(page.locator(".result-count-card, .locked-report-preview, .result-email-card")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "БҮРЭН ТАЙЛАНГАА НЭЭХ" })).toBeVisible();
});

test("single-pattern completion also shows the same sealed paywall", async ({ page, request }) => {
  await request.get("/__test/mode?value=single");
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await completeQuestionnaire(page);
  await expect(page.getByRole("heading", { name: "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо" })).toBeVisible();
  await expect(page.locator(".result-count-card, .locked-report-preview, .result-email-card")).toHaveCount(0);
  await expect(page.getByText("Чухал уялдаа холбоо", { exact: true })).toHaveCount(0);
});

test("safety completion bypasses ordinary result, paywall, and invoice creation", async ({ page, request }) => {
  await request.get("/__test/mode?value=safety");
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await completeQuestionnaire(page, "/report");
  await expect(page).toHaveURL(/\/report$/);
  await expect(page.getByRole("heading", { name: "Мэргэжлийн хүнтэй ярилцахыг зөвлөж байна" })).toBeVisible();
  await expect(page.locator(".locked-report-preview")).toHaveCount(0);
  await expect(page.locator(".report-contents-preview")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "БҮРЭН ТАЙЛАНГАА НЭЭХ" })).toHaveCount(0);
  const stats = await (await request.get("/__test/stats")).json();
  expect(stats.qpayCreate).toBe(0);
  expect(stats.paymentRows).toBe(0);
});

test("question transition gives immediate feedback and ignores duplicate submit", async ({ page, request }) => {
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
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

test("HFE back navigation prunes household context after changing to lives alone", async ({ page }) => {
  await openFreeAssessment(page);
  await page.getByRole("button", { name: "Эхлэх" }).click();
  for (let step = 0; step < 30; step += 1) {
    const first = page.locator("#question-form [data-question]").first();
    const questionId = await first.getAttribute("data-question");
    if (questionId === "HFE-HOUSEHOLD") break;
    const type = await first.getAttribute("type");
    const tagName = await first.evaluate(element => element.tagName);
    if (type === "number") await first.fill(questionId === "Q-HEIGHT" ? "170" : questionId === "Q-WEIGHT" ? "80" : "30");
    else if (tagName === "TEXTAREA") await first.fill("Өдөр тутмын хуваарьтай нийцээгүй.");
    else if (type === "radio") await first.check();
    else if (type === "checkbox") {
      const none = page.locator('#question-form [data-question][value="Аль нь ч үгүй"]');
      if (await none.count()) await none.first().check(); else await first.check();
    }
    await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
    await page.waitForFunction(previous => document.querySelector("[data-question]")?.dataset.question !== previous, questionId);
  }
  await expect(page.locator('[data-question="HFE-HOUSEHOLD"]').first()).toBeVisible();
  await page.locator('[data-question="HFE-HOUSEHOLD"][value="Хүүхэдтэй"]').check();
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
  await expect(page.locator('[data-question="HFE-CONTEXT"]').first()).toBeVisible();
  await page.locator('[data-question="HFE-CONTEXT"]').first().check();
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
  await expect(page.locator('[data-question="Q-SLEEP-DURATION"]').first()).toBeVisible();
  await page.getByRole("button", { name: "Буцах" }).click();
  await expect(page.locator('[data-question="HFE-CONTEXT"]').first()).toBeVisible();
  await page.getByRole("button", { name: "Буцах" }).click();
  await page.locator('[data-question="HFE-HOUSEHOLD"][value="Ганцаараа"]').check();
  await expect(page.locator('[data-question="HFE-HOUSEHOLD"][value="Хүүхэдтэй"]')).not.toBeChecked();
  await page.getByRole("button", { name: "Үргэлжлүүлэх" }).click();
  await expect(page.locator('[data-question="Q-SLEEP-DURATION"]').first()).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-question="Q-SLEEP-DURATION"]').first()).toBeVisible();
  await page.getByRole("button", { name: "Буцах" }).click();
  await expect(page.locator('[data-question="HFE-HOUSEHOLD"]').first()).toBeVisible();
  await expect(page.locator('[data-question="HFE-CONTEXT"]')).toHaveCount(0);
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
  await openFreeAssessment(page, "&invite=invite-e2e");
  expect(page.url()).not.toContain("invite=");
  await expect(page.getByRole("heading", { name: "Зөвлөхийн урилга ирсэн байна" })).toBeVisible();
  await expect(page.getByText("Асуулт бүрийн түүхий хариултыг зөвлөхөд харуулахгүй.")).toBeVisible();
  await page.getByLabel("Бүрэн тайлангаа хуваалцахгүй.").check();
  await page.getByRole("button", { name: "Эхлэх" }).click();
  await expect(page.getByRole("heading", { name: "Суурь мэдээлэл" })).toBeVisible();
  await expect(page.getByText(/хөнгөлөлт/i)).toHaveCount(0);
});

test("free start is responsive with accessible touch targets", async ({ page }) => {
  for (const [width, height] of [[375, 812], [390, 844], [430, 900]]) {
    await page.setViewportSize({ width, height });
    await openFreeAssessment(page);
    const submit = page.getByRole("button", { name: "Эхлэх" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(await submit.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
});

test("legacy assessment contact URL has no extra step", async ({ page }) => {
  await page.goto("/assessment/contact?e2e=1");
  await expect(page.getByRole("heading", { name: "Тест үнэлгээ болон бүрэн тайлангаа нээх" })).toBeVisible();
  await expect(page.locator("#contact-email")).toBeVisible();
  await expect(page.locator("#safety-form")).toHaveCount(0);
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
    await expect(page.getByRole("heading", { name: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Хэцүү үеийг хэрхэн даван туулах вэ?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?" })).toBeVisible();
    await expect(page.locator(".initial-action-list li")).toHaveCount(3);
    await expect(page.locator(".management-module").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    const paragraphSentenceCounts = await page.locator("#report-content p").evaluateAll(paragraphs => paragraphs.map(paragraph => paragraph.textContent.split(/[.!?](?:\s|$)/u).filter(Boolean).length));
    expect(Math.max(...paragraphSentenceCounts)).toBeLessThanOrEqual(3);
    const sectionCount = await page.locator("#report-content .report-section").count();
    expect(sectionCount).toBeGreaterThanOrEqual(8);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("#report-content")).toBeVisible();
    await expect(page.getByRole("heading", { name: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Хэвлэх эсвэл PDF-ээр хадгалах" })).toBeHidden();
    expect(await page.locator("#report-content .report-section").count()).toBe(sectionCount);
  });
}
