# Pricing Consistency Report

No prices were changed. Display labels in `app.js` were compared with payment constants in `app.js` and `mockBackend.js`.

| Product | Display source | Display amount | Payment constant | Status |
| ------- | -------------- | -------------- | ---------------- | ------ |
| One-time assessment | `app.js` `PRICING.oneTime` | 9,900₮ | `WEIGHT_TEST_AMOUNT_MNT = 9900`; backend `one_time = 9900` | CONSISTENT |
| Coach one-time assessment | `app.js` `PRICING.coachOneTime` | 9,900₮ | `COACH_WEIGHT_PRICE_MNT = 9900`; backend coach price = 9900 | CONSISTENT |
| Seven-day assessment | `app.js` `PRICING.sevenDay` | 29,000₮ | product and backend `seven_day = 29000` | CONSISTENT |
| Seven-day anchor/reference price | `app.js` `PRICING.sevenDayAnchor` | 69,000₮ | No payment charge uses the anchor value | NOT_APPLICABLE |
| One-time to seven-day upgrade | `app.js` `PRICING.upgrade` | 19,900₮ | product and backend `upgrade = 19900` | CONSISTENT |
