# WP14 Surface Allocation Rules

## Purpose

This document records the exact adapter surface names and allocation rules.

## Surface counts

| Field | Count | User-facing | Rule |
| --- | ---: | --- | --- |
| `previewSections` | 2 | Yes | One sanitized opening section per approved rendering. |
| `paidSections` | 7 | Yes | Ordinary report depth only; no payment implementation in WP14. |
| `safetyGuidanceSections` | 1 | Yes | Professional/safety guidance; never requires payment. |
| `internalDiagnostics` | 2 | No | Internal QA diagnostics only. |
| `ownerDebug` | 2 source records | No | Owner/admin-only source contract debug. |

## User-facing text collection

`collectAdapterUserFacingText(payload)` reads only:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

It excludes `internalDiagnostics` and `ownerDebug`.

Runtime implementation is NOT approved by WP14.
