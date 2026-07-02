# WP17 Rollback Record

## Rollback status

WP17 shadow integration is revertible with one commit revert.

Because WP17 is not staged or committed yet, the current working-tree rollback would be:

```bash
git restore app.js tests/run-all.js
rm tests/runtime-adapter-shadow-integration.test.js
rm -rf audits/mvp-diagnostic-migration/work-pack-17
```

Do not run rollback unless the owner explicitly asks for it.

## Approval boundary

Production runtime rendering is NOT approved by WP17.
