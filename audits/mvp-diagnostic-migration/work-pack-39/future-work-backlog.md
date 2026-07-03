# WP39 Future Work Backlog

Future work is not part of WP3–WP39 closure.

Future work must be handled as separate work packs.

## Copy / Design Polish

- Continue light public copy QA after real user feedback.
- Improve paywall, preview, and safety copy only when a real comprehension issue is observed.
- Keep copy free from shame, fake urgency, fake scarcity, and medical overclaim.

## Payment / QPay Real Transaction QA

- Run controlled real-transaction QA when owner approves live payment testing scope.
- Validate QPay create/check behavior against real merchant state.
- Keep pricing, product code, endpoint, and entitlement changes in a dedicated payment work pack.

## PDF / Export

- Define whether users need a downloadable report.
- Design PDF/export scope separately from public launch monitoring.
- Keep PDF generation out of incident response unless explicitly approved.

## Admin / Ops Dashboard

- Consider a lightweight owner dashboard for issue triage and entitlement visibility.
- Keep admin functionality separate from public report rendering.
- Require explicit access control and audit logging before any admin surface goes live.

## Analytics / Conversion Tracking

- Define conversion events for preview viewed, paywall viewed, payment started, payment failed, and report unlocked.
- Add analytics only after privacy and tracking decisions are approved.
- Avoid changing conversion copy solely to optimize metrics without trust review.

## Custom Domain / Branding

- Plan custom domain setup separately from launch closure.
- Review branding, favicon, metadata, and public URL migration in one dedicated work pack.
- Validate redirects and Netlify domain status before production switch.

## Legal / Privacy / Terms

- Draft privacy, terms, medical disclaimer, and payment support language with owner review.
- Keep diagnosis/treatment claims out of public report copy.
- Treat legal/privacy additions as a separate launch-readiness work pack.

## User Feedback Loop

- Create a simple feedback intake process for launch issues.
- Record screenshot, URL, device, browser, time, user path, expected result, and actual result.
- Triage feedback into blocker, follow-up polish, payment QA, mobile issue, copy/trust issue, or future backlog.
