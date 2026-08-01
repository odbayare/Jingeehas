"use strict";

const { test, expect } = require("@playwright/test");

test("completed free assessment stays on a recoverable result route when initial result loading fails", async ({ page }) => {
  const analyticsBodies = [];
  let initialResultCalls = 0;

  await page.route("**/.netlify/functions/analytics-collect", async route => {
    analyticsBodies.push(JSON.parse(route.request().postData() || "{}"));
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ accepted: true, recorded: true }) });
  });

  await page.route("**/.netlify/functions/weight-session-state", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        assessment: {
          assessmentId: "assessment_safe_123",
          status: "complete",
          commercialFlowVersion: "free_initial_result_v1",
          questionnaireVersion: "jingeehas-questionnaire-v2"
        },
        answers: {},
        payment: { status: "idle" },
        report: null,
        nextRoute: "/assessment/result"
      })
    });
  });

  await page.route("**/.netlify/functions/weight-assessment-initial-result?*", async route => {
    initialResultCalls += 1;
    if (initialResultCalls === 1) {
      await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "temporarily_unavailable" }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ mode: "neutral", patternCount: 0, interactionCount: 0 })
    });
  });

  await page.goto("/assessment/result");

  await expect(page).toHaveURL(/\/assessment\/result$/);
  await expect(page.getByRole("heading", { name: "Эхний үр дүнг ачаалж чадсангүй" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Дахин оролдох" })).toBeVisible();
  await expect(page.getByText("Хариулт хадгалагдсан бөгөөд тест дууссан хэвээр байна.")).toBeVisible();

  await expect.poll(() => analyticsBodies.filter(body => body.eventName === "initial_result_load_failed").length).toBe(1);
  const failureEvent = analyticsBodies.find(body => body.eventName === "initial_result_load_failed");
  expect(failureEvent.assessmentId).toBe("assessment_safe_123");
  expect(failureEvent).not.toHaveProperty("error");
  expect(failureEvent).not.toHaveProperty("metadata");
  expect(JSON.stringify(failureEvent)).not.toMatch(/temporarily_unavailable|answer|result_payload|email|phone/i);

  await page.getByRole("button", { name: "Дахин оролдох" }).click();

  await expect(page.getByRole("heading", { name: "Нэг хэв маяг бусдаасаа илт давамгай гарсангүй" })).toBeVisible();
  await expect(page).toHaveURL(/\/assessment\/result$/);
  expect(initialResultCalls).toBe(2);
  expect(analyticsBodies.filter(body => body.eventName === "initial_result_load_failed")).toHaveLength(1);
});
