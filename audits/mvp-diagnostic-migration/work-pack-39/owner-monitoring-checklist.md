# WP39 Owner Monitoring Checklist

## Daily Checklist

- Open production URL: `https://clever-souffle-1e5f74.netlify.app`.
- Complete or inspect the unpaid flow.
- Confirm the free preview is visible.
- Confirm paid depth remains locked before payment.
- Confirm safety guidance is visible.
- Check payment failed copy if a failed/retry state is reported.
- Check one mobile screen for report readability, paywall clarity, and safety guidance visibility.
- Check that no internal/debug terms are visible:
  - `internalDiagnostics`
  - `ownerDebug`
  - `fixtureName`
  - `runtimeGate`
  - `decisionStatus`
  - `rendererMode`
- Check latest Netlify deploy status for production URL.
- Record any issue with screenshot, URL, device, browser, time, and short reproduction notes.

## Weekly Checklist

- Run `npm test` locally before any follow-up release.
- Review user feedback for payment confusion, copy/trust complaints, mobile layout issues, or missing safety guidance.
- Re-check unpaid and paid report boundaries.
- Re-check professional / urgent safety-only behavior if related feedback appears.
- Confirm QPay, backend, payment, pricing, and entitlement logic have not been changed outside an approved work pack.
- Confirm no PDF/export work has been introduced into the launch path.
- Review open issues and classify each as copy/design polish, payment/QPay QA, safety boundary, mobile layout, internal leak, or future work.

## Issue Record Format

- Screenshot:
- URL:
- Device:
- Browser:
- Date/time:
- User path:
- Expected result:
- Actual result:
- Severity:
- Owner action:
