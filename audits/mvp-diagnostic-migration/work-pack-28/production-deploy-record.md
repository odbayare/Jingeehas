# WP28 Production Deploy Record

## Deploy Command

```bash
netlify deploy --prod --dir /tmp/wp28-weight-loss-visible-enable-deploy --message "WP28 public visible surface enable"
```

## Deploy Payload

The deploy used a clean temporary directory containing only:

- `index.html`
- `app.js`
- `styles.css`
- `mockBackend.js`
- `_redirects`

The protected untracked folder `audits/sprint-36-paid-depth-prototype/` was not included in the deploy payload.

## Netlify Result

- Deploy status: live
- Deploy ID: `6a47773c43a1b7fed95d0b25`
- Production URL: `https://clever-souffle-1e5f74.netlify.app`
- Unique deploy URL: `https://6a47773c43a1b7fed95d0b25--clever-souffle-1e5f74.netlify.app`
- Build logs: `https://app.netlify.com/projects/clever-souffle-1e5f74/deploys/6a47773c43a1b7fed95d0b25`

## Boundary Confirmation

- No QPay/backend/payment/pricing/entitlement change.
- No PDF generation.
- No deploy config change.
- No WP14 adapter change.
