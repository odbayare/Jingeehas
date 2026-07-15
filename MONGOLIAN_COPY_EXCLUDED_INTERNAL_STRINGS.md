# Mongolian Copy Excluded Internal Strings

These raw literals are excluded from the review catalog because render visibility was not proven. Unknown items remain auditable rather than being mislabeled as user-visible copy.

## API and URLs

- Count: 5
- Reason excluded: Classified as API_OR_URL, not application-owned rendered copy.
- Representative examples: `https://www.lifepattern.live/.netlify/functions/qpay-create-invoice`, `https://www.lifepattern.live/.netlify/functions/qpay-check-payment`, `https://www.lifepattern.live/.netlify/functions/track-funnel-event`, `http://`, `https://`

## analytics events

- Count: 1
- Reason excluded: Classified as ANALYTICS_OR_EVENT, not application-owned rendered copy.
- Representative examples: `${eventName}:${dedupeKey}`

## internal keys

- Count: 1385
- Reason excluded: Classified as INTERNAL_IDENTIFIER, not application-owned rendered copy.
- Representative examples: `function`, `weight_test_visitor_id_v1`, `weight_test_session_id_v1`, `weight_test_funnel_events_v1`, `one_time`, `seven_day`, `upgrade`, `reward`

## storage keys

- Count: 1
- Reason excluded: Classified as DATABASE_OR_STORAGE, not application-owned rendered copy.
- Representative examples: `WEIGHT_TEST_ONE_TIME`

## source paths and module imports

- Count: 1
- Reason excluded: Classified as CODE_OR_MODULE_REFERENCE, not application-owned rendered copy.
- Representative examples: `./mockBackend.js`

## test fixtures

- Count: 0
- Reason excluded: Classified as TEST_ONLY, not application-owned rendered copy.
- Representative examples: None found in app.js raw extraction.

## documentation

- Count: 0
- Reason excluded: Classified as DOCUMENTATION_ONLY, not application-owned rendered copy.
- Representative examples: None found in app.js raw extraction.

## untraced internal candidates

- Count: 3359
- Reason excluded: No render path was proven.
- Representative examples: `weightLossDeepPatternMvp`, `Ерөнхийдөө ойлгомжтой`, `8`, `Ерөнхийдөө ойлгосон`, `Зарим хэсэг дээр`, `Байгалийн монгол хэлтэй`, `Магадгүй`, `one-time`
