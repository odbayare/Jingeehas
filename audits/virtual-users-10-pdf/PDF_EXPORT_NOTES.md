# PDF Export Notes

Generated: 2026-06-28T09:29:23.999Z
Commit: 594b9899a98b6974f8f9a94a3e6da7ed0289717c
Source script: scripts/run-virtual-user-audit.mjs
Export script: scripts/export-virtual-reports-pdf.mjs

## Output

- PDF: audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf
- Markdown: audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md
- Raw JSON: audits/virtual-users-10-pdf/raw/user-01.json ... user-10.json

## Validation

- Virtual audit was regenerated with `node scripts/run-virtual-user-audit.mjs --assert-clean`.
- 10 virtual reports included.
- Public generated report text was checked against the banned English/engine term list before PDF rendering.
- Хориглосон public report үг илрээгүй.
- PDF-д орсон Mode 3/4 тайлан: user-08, user-09, user-10.

## Scope

- QPay remains disabled.
- No deploy was performed by this export script.
- Scoring and safety routing are not changed by this packaging step.
