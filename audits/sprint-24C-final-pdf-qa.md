# Sprint 24C - Final PDF QA

## Source Commits

- Sprint 24 report voice rewrite: `4125b23ae574afac8a3f22c6f9aab99aaa7d8208`
- Sprint 24A question copy polish: `1fa80baa7e90e4f9c5632c2492a8a82fb0de4f14`

## Regeneration

- Regenerated at: `2026-06-28 19:44:49 +08`
- PDF path: `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf`
- Markdown path: `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md`
- Export notes path: `audits/virtual-users-10-pdf/PDF_EXPORT_NOTES.md`
- Export command used: `node scripts/export-virtual-reports-pdf.mjs`
- Raw reports included: 10
- PDF pages: 22
- PDF layout smoke: rendered to PNG with Poppler; cover, ordinary report pages, cue/restriction/self-neglect pages, and Mode 3/4 safety pages were visually checked.

## Commands Run

- `node --check app.js` - PASS
- `node --check scripts/run-virtual-user-audit.mjs` - PASS
- `node scripts/run-virtual-user-audit.mjs --assert-clean` - PASS
- `npm test` - PASS
- `node --check scripts/export-virtual-reports-pdf.mjs` - PASS
- `node scripts/export-virtual-reports-pdf.mjs` - PASS
- `pdfinfo audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf` - PASS
- PDF text extraction with `pypdf` - PASS
- PDF rendering with `pdftoppm` - PASS

## Virtual Audit Result

- Users: 10
- PASS: 10
- PARTIAL: 0
- FAIL: 0
- P0/P1/P2: 0/0/0
- Readiness score: 96
- Recommendation from audit script: READY FOR INTERNAL HUMAN TESTING

## Banned Phrase Check

Result: PASS.

The regenerated Markdown and extracted PDF text were checked against the Sprint 24C problematic phrase list. No matches were found in the regenerated package after the export presentation layer was cleaned.

Note: raw JSON remains an internal fixture format and may contain internal identifiers or source-test metadata. The PDF and Markdown package visible to reviewers is clean.

## User-Specific QA

| User | Focus | Required Evidence | Result |
| --- | --- | --- | --- |
| User 03 | Restriction-collapse | Contains "Өнөөдөр өнгөрлөө", "дараагийн хоолноос хэвийн үргэлжлүүлэх", and "хэт чанга"; report is not a generic cycle explanation. | PASS |
| User 05 | Self-neglect / reward-deficit | Contains "өөрийн хэрэгцээ", "өөрийн хоол", and "үлдэгдэл цагт найдахгүй"; does not open as only evening decision-load. | PASS |
| User 06 | Cue / environment | Contains "хоол харагдах", "орчны дохио", and "нэг дохио"; main cycle is cue/environment, not executive-load. | PASS |
| User 08 | Mode 3 safety | Ordinary report is suppressed; no payment/paywall/commercial CTA; no ordinary 14-day experiment. | PASS |
| User 09 | Mode 3 safety | Ordinary report is suppressed; no payment/paywall/commercial CTA; no ordinary 14-day experiment. | PASS |
| User 10 | Mode 4 safety | Ordinary report is suppressed; no payment/paywall/commercial CTA; no ordinary 14-day experiment. | PASS |

## Export Packaging Note

During final PDF QA, the persona setup section still showed a few English source-summary phrases. This was fixed only in `scripts/export-virtual-reports-pdf.mjs` by translating export-facing persona profile fields before writing the PDF/Markdown package. App scoring, report generation, safety routing, and QPay/payment behavior were not changed.

## Remaining Issues

- None for Sprint 24C.

## Recommendation

READY FOR HUMAN TESTING
