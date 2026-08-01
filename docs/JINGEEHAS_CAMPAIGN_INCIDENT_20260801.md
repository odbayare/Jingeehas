# Jingeehas Paid Campaign Incident — 2026-08-01

Updated: 2026-08-01
Timezone: Asia/Ulaanbaatar
Mode: READ_ONLY evidence / no Meta mutation

## Status

```text
campaign ID = 52503252094202
status = FAIL
recommendation = PAUSE_OR_INVESTIGATE_IMMEDIATELY
pause performed = NO
pause capability = BLOCKED by missing Meta credential
```

## Production authority

Production database remains the conversion source of truth:

```text
total payment rows = 9
authoritative paid rows = 5
authoritative paid revenue = 49,500 MNT
malformed paid rows = 0
duplicate provider payment groups = 0
active entitlements = 5
August confirmed purchases = 0
August confirmed revenue = 0 MNT
Meta Purchase deliveries = 0
```

The five historical paid rows predate the current paid campaign cohort. No confirmed purchase is attributable to campaign `52503252094202` in the observed campaign sessions.

## Observed campaign funnel

```text
first paid landing = 2026-07-28T08:25:07.898Z
last observed paid landing = 2026-08-01T08:18:45.958Z
paid landing sessions = 1,365
unique paid visitors = 1,279
start CTA sessions = 61
free assessment starts = 15
free assessment completions = 8
initial result views = 4
payment CTA sessions = 0
invoice sessions = 0
confirmed purchase sessions = 0
confirmed revenue = 0 MNT
```

Rates:

```text
landing → start = 4.47%
landing → free assessment start = 1.10%
free start → complete = 53.33%
complete → initial result = 50.00%
landing → confirmed purchase = 0.00%
```

## Free-funnel-live cohort

From the free-funnel production deployment at `2026-07-31T13:22:53Z`:

```text
paid landing sessions = 157
start CTA sessions = 13
free assessment starts = 11
free assessment completions = 6
initial result views = 3
payment CTA sessions = 0
invoice sessions = 0
confirmed purchases = 0
```

Rates:

```text
landing → start = 8.28%
landing → free start = 7.01%
free start → complete = 54.55%
complete → initial result = 50.00%
landing → confirmed purchase = 0.00%
```

## Findings

- `ZERO_CONFIRMED_PURCHASES` — FAIL
- `HIGH_PAID_TRAFFIC_WITHOUT_PURCHASE` — FAIL
- `FREE_FUNNEL_HIGH_TRAFFIC_WITHOUT_PURCHASE` — FAIL
- `COMPLETION_TO_RESULT_DROPOFF` — WARNING
- `TRACKING_NOT_PASS` — FAIL
- `META_SPEND_UNKNOWN` — UNKNOWN
- `CAMPAIGN_EFFECTIVE_STATUS_UNKNOWN` — UNKNOWN
- `LIVE_META_READ_NOT_PERFORMED` — UNKNOWN

The completion-to-result loss is observed in three mobile Facebook sessions. Source and regression contracts correctly request `/assessment/result`; current evidence is insufficient to classify this as a confirmed application defect rather than user exit or network interruption.

## Stop-loss boundary

The configured daily budget evidence is USD 3.00. Exact spend-based stop-loss requires a current Meta spend read:

```text
Meta spend observed = NO
spend ≥ USD 3 confirmed = UNKNOWN
exact spend stop-loss triggered = NOT CERTIFIED
high-traffic pause recommendation = YES
```

The campaign must not be described as healthy or successful. Reach, visits and assessment starts are not confirmed purchases.

## Required response

1. Obtain read-only Meta access and read current campaign status, spend and account state.
2. If the campaign is ACTIVE or delivering, pause it before creating or activating any replacement campaign.
3. Preserve the campaign/ad set/ad IDs, current spend and effective status.
4. Do not increase another product budget to compensate.
5. Certify dedicated Jingeehas Pixel/CAPI Test Events and deduplication.
6. Reconcile confirmed QPay payments, production payment rows and Meta Purchase attribution.
7. Resume or replace delivery only after tracking, assets, economics and exact approved payload all PASS.

## Safety boundary

```text
Meta API reads performed = 0
Meta API writes performed = 0
campaign pause performed = 0
new campaigns created = 0
budget mutations = 0
ad spend authorized = 0
```
