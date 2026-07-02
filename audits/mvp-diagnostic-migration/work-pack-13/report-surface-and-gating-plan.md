# Report Surface And Gating Plan

## Purpose

This document answers which sections should become user-facing report copy and which content belongs in free preview, paid report, safety/professional guidance, and internal-only diagnostics.

## User-facing report sections

The following WP12 sections are candidates for future user-facing report copy after a future runtime adapter and owner approval:

| Section title | Future surface | Rationale |
| --- | --- | --- |
| `Ил харагдаж байгаа зүйл` | Free preview or paid report summary | It names the visible pattern in non-shaming language. |
| `Цаана нь ажиллаж байгаа зүйл` | Paid report | It contains the deeper driver-stack explanation and should not be reduced to a teaser. |
| `Зөөлөн мэргэжлийн гүүр` | Safety/professional guidance | It must stay visible when relevant and must not be blocked by payment. |
| `Эхний зөөлөн өөрчлөлт` | Paid report, with safety exception | It is an ordinary next step; do not show if a professional-first route suppresses ordinary experiments. |
| `14 хоногийн туршилтын таамаг` | Paid report, with safety exception | It is an experiment hypothesis, not a command; suppress when professional-first rules apply. |
| `7 хоногийн баталгаажуулах тэмдэглэл` | Paid report | It supports pattern observation and should stay non-judgmental. |

## Surface and gate matrix

| Surface | Content allowed | Gate condition | Safety override | Content forbidden |
| --- | --- | --- | --- | --- |
| Free preview | Short visible-pattern summary, gentle recognition, non-diagnostic framing, safety/professional bridge when triggered | Available before payment | Safety/professional guidance must render even when ordinary depth is locked. | Full hidden-function explanation, raw keys, fixture names, full paid experiment |
| Paid report | Ordinary report depth, stacked-driver explanation, first gentle change, 14-day experiment hypothesis, 7-day diary confirmation | Requires approved entitlement in a future implementation | Paid status cannot suppress safety/professional guidance or professional-first routing. | Diagnostic claims, treatment advice, payment mechanics in sensitive copy |
| Safety/professional guidance | Professional-first language, medical-context bridges, non-diagnostic disclaimers, severe-distress guidance, ordinary-experiment suppression notice | Never paywalled when triggered | Always wins over preview/paid allocation. | Product upsell language, delayed medical-context clarification |
| Internal-only diagnostics | Fixture names, raw driver keys, raw metadata, raw scores, owner-review flags, QA-only gate status | QA and owner artifacts only | Not applicable; never user-facing. | Any user-facing rendering |

## Exact content allocation

| Content type | Free preview | Paid report | Safety/professional guidance | Internal-only diagnostics |
| --- | --- | --- | --- | --- |
| Human-readable section title | Allowed when assigned to preview or safety | Allowed | Allowed | Allowed in artifacts |
| Polished section body | Limited summary only | Allowed for ordinary depth | Allowed and never blocked by payment | Allowed for review |
| Hidden food function explanation | Summary only | Allowed | Only if safety framing requires it | Allowed |
| First gentle change | Teaser only | Allowed unless safety suppresses it | Suppressed when professional-first applies | Allowed |
| 14-day experiment hypothesis | Not allowed in full | Allowed unless safety suppresses it | Suppressed when professional-first applies | Allowed |
| 7-day diary confirmation | Not allowed in full | Allowed | Allowed only when phrased as observation, not diagnosis | Allowed |
| Medical-context bridge | Allowed when triggered | Allowed, but not paid-only | Required when triggered | Allowed |
| Non-diagnostic disclaimer | Allowed | Allowed | Required when triggered | Allowed |
| Runtime/test keys | Not allowed | Not allowed | Not allowed | Allowed |

## Free preview

Free preview may include:

- the visible pattern summary
- one gentle, non-diagnostic recognition paragraph
- a high-level note that the full report explains the stacked drivers
- safety/professional guidance when triggered

Free preview must not include:

- raw driver keys
- raw scores
- fixture names
- internal metadata
- full hidden-function explanation
- full 14-day experiment if payment gates are active

## Paid report

Paid report may include:

- the full visible pattern
- deeper stacked-driver explanation
- hidden food function explanation in user-facing language
- wrong self-explanation correction
- first gentle change
- 14-day experiment hypothesis
- 7-day diary confirmation targets

Paid report must not include:

- safety/professional guidance as a paid-only reveal
- diagnostic claims
- treatment advice
- raw keys or debug fields
- product/payment mechanics inside body copy

## Safety/professional guidance

Safety/professional guidance includes:

- professional-first routing language
- soft medical-context bridges
- non-diagnostic clarification
- guidance to clarify body changes, medication concerns, severe distress, or medical red flags with a professional
- suppression notice for ordinary experiments when required by safety rules

Safety/professional guidance must be available before payment when triggered.

## Internal-only diagnostics

Internal-only diagnostics include:

- raw driver keys
- fixture names
- safety mode codes
- internal metadata flags
- raw scores
- evidence weighting
- owner review flags
- debug reason codes
- `runtimeGate`, `decisionStatus`, `rendererMode`, and other test-only fields

Internal-only diagnostics may appear in QA logs and owner-review artifacts, but must never appear in future user-facing report copy.

## Answer to planning questions 2 and 3

The future user-facing report should use only human-readable section titles and polished section bodies. Preview should show the visible non-shaming summary and safety guidance when relevant. Paid should contain the full ordinary report. Safety/professional guidance must sit outside payment. Raw diagnostics and internal keys remain internal only.

Runtime implementation is NOT approved by WP13.
