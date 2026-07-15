# Mongolian Copy Excluded Internal Strings

Raw literals excluded because role-facing render visibility was not proven.

## API and URLs

- Count: 5
- Reason excluded: Classified as API_OR_URL.
- Representative examples: `https://www.lifepattern.live/.netlify/functions/qpay-create-invoice`, `https://www.lifepattern.live/.netlify/functions/qpay-check-payment`, `https://www.lifepattern.live/.netlify/functions/track-funnel-event`, `http://`, `https://`

## analytics events

- Count: 1
- Reason excluded: Classified as ANALYTICS_OR_EVENT.
- Representative examples: `${eventName}:${dedupeKey}`

## internal keys

- Count: 1378
- Reason excluded: Classified as INTERNAL_IDENTIFIER.
- Representative examples: `function`, `one_time`, `seven_day`, `upgrade`, `reward`, `planned_evening_reward`, `regulation`, `pre_eating_regulation_pause`

## storage keys

- Count: 4
- Reason excluded: Classified as DATABASE_OR_STORAGE.
- Representative examples: `WEIGHT_TEST_ONE_TIME`, `weight_test_visitor_id_v1`, `weight_test_session_id_v1`, `weight_test_funnel_events_v1`

## source paths and module imports

- Count: 1
- Reason excluded: Classified as CODE_OR_MODULE_REFERENCE.
- Representative examples: `./mockBackend.js`

## test fixtures

- Count: 0
- Reason excluded: Classified as TEST_ONLY.
- Representative examples: None.

## documentation

- Count: 0
- Reason excluded: Classified as DOCUMENTATION_ONLY.
- Representative examples: None.

## untraced internal candidates

- Count: 3327
- Reason excluded: No render path was proven.
- Representative examples: `weightLossDeepPatternMvp`, `one-time`, `seven-day`, `7 хоногоор нарийвчлах эрх`, `Өөртөө нэг таатай зүйл өгөх үе`, `Сэтгэл санаагаа баярлуулахыг хүсэх үе`, `Стресс үед хоолоор амсхийх үе`, `Стрессийн дараа хоолоор тайвшрах хандлага`
