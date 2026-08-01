# Jingeehas Tracking and CAPI

Updated: 2026-08-01
Status: IMPLEMENTED ON DRAFT BRANCH; NOT DEPLOYED; DISABLED BY DEFAULT

## Runtime path

1. `meta-pixel.js` requests safe browser configuration.
2. Pixel loads only when `META_BROWSER_PIXEL_ENABLED=true` and a valid numeric Pixel ID is present.
3. Browser events send PageView, ViewContent and InitiateCheckout.
4. `qpay-check-payment` confirms payment through the existing provider authority contract.
5. The server rereads the paid payment row and sends CAPI Purchase only when status, amount, product and provider payment ID are authoritative.
6. The same deterministic event ID is returned to the browser for Pixel Purchase deduplication.
7. Successful CAPI delivery metadata is stored on the payment row; retries use the same event ID.

## Environment controls

- `META_CAPI_ENABLED=false`
- `META_BROWSER_PIXEL_ENABLED=false`
- `META_GRAPH_API_VERSION=v25.0`
- `META_DATASET_ID`
- `META_PIXEL_ID`
- `META_CAPI_ACCESS_TOKEN` — server secret only
- `META_CAPI_TEST_EVENT_CODE` — staging Test Events only; remove before production

## Failure behaviour

Meta delivery failure must not reverse a confirmed payment, block entitlement, expose secrets or make the customer retry payment. Failure is logged with a generic code and must be reconciled separately.

## Activation sequence

1. Apply forward-only database migration.
2. Configure a dedicated Jingeehas dataset/pixel and least-privilege CAPI token in staging.
3. Set a Test Events code and enable browser/CAPI flags in staging only.
4. Confirm PageView, ViewContent, InitiateCheckout and one controlled Purchase.
5. Confirm browser/server Purchase share event name and event ID and appear deduplicated.
6. Confirm value 9,900 MNT and product code are exact.
7. Remove Test Events code.
8. Enable production flags and run a read-only smoke check.
9. Only then create/activate a Purchase-optimized paid campaign.
