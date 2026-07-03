# Visible Surface Safety Copy Scan

## Purpose

This scan records WP20 safety and copy boundaries for visible prototype HTML.

## Forbidden User-Facing Text

The test scans rendered prototype HTML for:

- adapter field names;
- internal diagnostics labels;
- owner debug labels;
- fixture names;
- runtime/debug key names;
- payment mechanics terms;
- currency symbols;
- English diagnosis, treatment, and prescribing claim words.

## Evidence Areas

internal key scan: rendered prototype HTML is scanned for adapter field names, internal diagnostics labels, owner debug labels, fixture names, runtime/debug key names, and internal mode strings.

medical/cause phrase scan: rendered prototype HTML is scanned for English diagnosis, treatment, and prescribing claim words.

payment mechanics scan: rendered prototype HTML is scanned for QPay, checkout, unlock, payment terms, and currency symbols.

diet-command phrase scan: WP20 does not introduce diet-command copy, and the prototype only converts sanitized WP14 adapter payload `title` and `body` fields under explicit test/internal control.

safety guidance visible without payment: `safetyGuidanceSections` render in the unpaid/payment-failed prototype case while `paidSections` remain hidden without paid access.

## Safety Guidance Boundary

Safety guidance is not payment-gated in the prototype.

Safety guidance remains visible in the payment-failure test case.

## Professional/Urgent Boundary

Professional and urgent route modes suppress ordinary preview and paid-depth surfaces while preserving safety guidance.

Boolean safety flags `professionalFirst: true` and `urgent: true` also suppress ordinary preview and paid-depth surfaces while preserving safety guidance.

The prototype does not render ordinary paid experiments into those routes.

## Copy Source Boundary

WP20 does not rewrite report copy.

The prototype only converts WP14 adapter payload `title` and `body` fields into sanitized HTML under explicit test/internal control.

## Conclusion

Visible prototype copy passed WP20 safety scans.
