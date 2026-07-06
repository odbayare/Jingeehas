# Developer Traceability

This appendix is for developer use only. The editor-facing files 01-05 intentionally omit code terms, variable names, line numbers, and internal logic labels.

## Production sources inspected

- app.js: question banks, report rendering text, report voice variants, safety report copy, paid report copy, public product copy.
- index.html: public title and metadata copy.
- mockBackend.js: coach-facing access/availability messages that can surface through production UI flows.

## Excluded sources

- tests/
- prior audit files
- snapshots and generated virtual-user output
- node_modules/
- .git/
- WP64/WP67 PDF packs
- audits/sprint-36-paid-depth-prototype/

## Generation notes

Questions were extracted from exported production question objects. Report text was extracted from production source strings and rendered production report samples. Dynamic JavaScript expressions were replaced with human-readable Mongolian placeholders in editor-facing files.
