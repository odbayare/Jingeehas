# Sprint 29 — Result Comprehension / Simple Answer Layer

## Human Feedback Source

Three internal human testers completed the Weight Test. All 3 said the result/report was not clear enough. One tester liked the questions, but another was frustrated by unclear wording such as `дэглэм тасалдал / тасалдал`.

Decision: pause broader human testing until users can understand the core result quickly.

## Problem Summary

The previous report opened like a detailed analysis note. Users had to read several sections before understanding:

- what their main stuck moment is
- what it means in plain language
- what to try first
- what to avoid for now

## Changes Made

Added a new ordinary-report top section:

- `Товч хариу`
- `Таны гол гацдаг мөч`
- `Энэ юу гэсэн үг вэ?`
- `Эхлээд хийх нэг жижиг зүйл`
- `Одоогоор түр болгоомжлох зүйл`

The long report now starts after:

`Дэлгэрэнгүй тайлан харах`

and includes the note:

`Доорх нь дэлгэрэнгүй тайлбар. Эхний хэсгийг ойлгосон бол бүгдийг нь унших албагүй.`

## Simple Result Layer Design

Implemented mechanism-aware plain-language summaries through `getSimpleResultSummary(primaryKey, context)`.

Covered result types:

- executive load
- stress regulation
- restriction-collapse
- hunger safety
- self-neglect / reward deficit
- cue/environment
- sleep/energy
- menstrual-cycle context modifier

The summary layer uses existing scoring output only. Scoring, tags, safety thresholds, and routing were not changed.

## Banned Wording Removed / Guarded

Public ordinary report tests now guard against:

- `тасалдал`
- `дэглэм тасалдал`
- `тасарсан`
- `тасардаг`
- `тасалдах`
- `тасалдвал`
- `давтамж гэх давтамж`
- `гэх давтамжтай нийцэж байна`
- `хүчтэй нийцэж байна`
- `дунд зэрэг нийцэж байна`
- `механизм`

## Feedback Survey Update

Added comprehension question:

`Тайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?`

Fields added:

- `simpleResultClarity`
- `simpleResultClarityDetail`

## PDF / Virtual Audit

Regenerated virtual-user audit outputs and combined PDF package after the report change.

PDF export result:

- PDF: `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf`
- Markdown: `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md`
- banned terms found: 0
- Mode 3/4 reports: user-08, user-09, user-10

## Validation Results

Passed:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
  - users: 10
  - pass: 10
  - partial: 0
  - fail: 0
  - P0/P1/P2: 0/0/0
  - readiness score: 96
- `node --check scripts/export-virtual-reports-pdf.mjs`
- `node scripts/export-virtual-reports-pdf.mjs`
  - raw reports: 10
  - banned terms found: 0
- `npm test`
  - all tests passed
- `git diff --check`

## Recommendation

READY FOR INTERNAL HUMAN RETESTING.

Next testers should be asked first whether they understand the `Товч хариу` section in under 10 seconds, before reading the detailed report.
