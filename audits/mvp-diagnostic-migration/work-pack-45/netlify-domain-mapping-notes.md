# WP45 Netlify Domain Mapping Notes

## Current Netlify Context

- Netlify site name: `clever-souffle-1e5f74`
- Current production URL: `https://clever-souffle-1e5f74.netlify.app`

## Mapping Boundary

- No Netlify config file changes approved.
- Domain mapping should be done through Netlify UI unless owner explicitly approves config change.
- DNS/domain mapping should not be modified automatically in WP45.

WP45 does not deploy.

## Expected Checks After Owner Action

- Domain assigned to correct Netlify site.
- SSL active.
- Production deploy remains latest valid deploy.
- App still loads public files:
  - `index.html`
  - `styles.css`
  - `mockBackend.js`
  - `app.js`
- Current metadata remains domain-neutral until owner approves canonical URL / `og:url`.

## Rollback / Hold Condition

If mapping, DNS, SSL, or redirect behavior is unclear, hold custom domain activation and continue using `https://clever-souffle-1e5f74.netlify.app` until owner confirms next action.
