"use strict";

const { test, expect } = require("@playwright/test");
const questions = require("../../questions.js");
const profiles = require("../fixtures/v5-virtual-users.js");
const V5 = questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;
const attr = value => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

test("V5 exact 15 virtual users complete through real sequential browser UI", async ({ page, request }) => {
  test.setTimeout(600000);
  const results = [];
  const browserErrors = [];
  const httpErrors = [];
  page.on("console", message => { if (message.type() === "error") browserErrors.push(message.text()); });
  page.on("response", async response => { if (response.status() >= 400 && /weight-assessment-(save|complete)/.test(response.url())) httpErrors.push({ url: response.url(), status: response.status(), body: await response.text().catch(() => "") }); });

  const selectedProfiles = process.env.V5_PROFILE ? profiles.filter(profile => profile.id === process.env.V5_PROFILE) : profiles;
  for (const profile of selectedProfiles) {
    console.log(`V5_BROWSER_PROFILE=${profile.id}`);
    await page.goto("/__test/v5-start");
    await expect.poll(() => new URL(page.url()).pathname).toBe("/assessment/questions");
    const visited = [];
    for (let step = 0; step < 80 && new URL(page.url()).pathname === "/assessment/questions"; step += 1) {
      const first = page.locator("#question-form [data-question]").first();
      await expect(first).toBeVisible();
      const questionId = await first.getAttribute("data-question");
      visited.push(questionId);
      const value = profile.answers[questionId];
      if (!profile.blank.includes(questionId)) {
        expect(value, `${profile.id} needs an exact answer for ${questionId}`).not.toBeUndefined();
        const type = await first.getAttribute("type");
        const tagName = await first.evaluate(element => element.tagName);
        if (type === "number") await first.fill(String(value));
        else if (tagName === "TEXTAREA") await first.fill(value);
        else if (type === "radio") await page.locator(`#question-form [data-question="${attr(questionId)}"][value="${attr(value)}"]`).check();
        else for (const selected of value) await page.locator(`#question-form [data-question="${attr(questionId)}"][value="${attr(selected)}"]`).check();
      }
      await page.getByRole("button", { name: /Үргэлжлүүлэх|Тестийг дуусгах/ }).click();
      await page.waitForFunction(previous => window.location.pathname !== "/assessment/questions" || document.querySelector("[data-question]")?.dataset.question !== previous, questionId, { timeout: 10000 });
    }
    const expectedRoute = questions.visibleQuestions(profile.answers, V5).map(question => question.id);
    expect(visited, `${profile.id} actual browser route`).toEqual(expectedRoute);
    const state = await request.get("/__test/v5-state").then(response => response.json());
    expect(state.assessment.safetyRoute || null).toBe(profile.expectedSafetyRoute || null);
    expect(new URL(page.url()).pathname).toBe(profile.expectedSafetyRoute ? "/report" : "/assessment/result");
    for (const id of profile.blank) {
      expect(Object.prototype.hasOwnProperty.call(state.answers, id), `${profile.id} ${id} stays unpersisted`).toBe(false);
      expect(state.mutations.some(mutation => mutation.processedQuestionIds.includes(id) && mutation.clearedQuestionIds.includes(id)), `${profile.id} ${id} receives processed clear ack`).toBe(true);
    }
    if (profile.expectedSafetyRoute) {
      expect(visited.some(id => id.startsWith("Q-METHOD-"))).toBe(false);
      await expect(page.getByText("19,900₮", { exact: false })).toHaveCount(0);
      await expect(page.getByText("QPay", { exact: false })).toHaveCount(0);
    }
    results.push({ id: profile.id, visitedCount: visited.length, safetyRoute: state.assessment.safetyRoute || null, path: new URL(page.url()).pathname,
      blankProcessed: profile.blank.every(id => state.mutations.some(mutation => mutation.processedQuestionIds.includes(id) && mutation.clearedQuestionIds.includes(id))) });
  }

  if (!process.env.V5_PROFILE) {
    expect(results.filter(result => !result.safetyRoute)).toHaveLength(12);
    expect(results.filter(result => result.safetyRoute)).toHaveLength(3);
    expect(results.find(result => result.id === "U01").blankProcessed).toBe(true);
    expect(results.find(result => result.id === "U02").blankProcessed).toBe(true);
    expect(results.find(result => result.id === "U01").visitedCount).toBeGreaterThan(0);
  }
  expect(browserErrors.filter(message => message.includes("answer_not_confirmed"))).toEqual([]);
  expect(httpErrors, JSON.stringify(httpErrors)).toEqual([]);
  console.log(`V5_BROWSER_15_RESULTS=${JSON.stringify(results)}`);
});
