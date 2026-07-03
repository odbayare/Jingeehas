# WP28 Rollback Notes

## Current Deploy

- Deploy ID: `6a47773c43a1b7fed95d0b25`
- Production URL: `https://clever-souffle-1e5f74.netlify.app`
- Unique deploy URL: `https://6a47773c43a1b7fed95d0b25--clever-souffle-1e5f74.netlify.app`

## Rollback Option

If rollback is required, restore the previous known-good Netlify deploy from the Netlify deploy UI or redeploy the previous safe state.

## Guard Rollback

The code rollback for disabling public runtime visible surfaces is:

```js
const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false;
```

Keep:

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

## Post-Rollback Checks

Run:

```bash
curl -I https://clever-souffle-1e5f74.netlify.app
curl -s https://clever-souffle-1e5f74.netlify.app/app.js | grep -F "const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"
curl -s https://clever-souffle-1e5f74.netlify.app/app.js | grep -F "const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false;"
```
