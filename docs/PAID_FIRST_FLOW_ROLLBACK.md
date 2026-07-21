# Paid-first flow rollback

Application rollback is safe before any prepaid customer assessment exists: redeploy the prior application commit. Legacy rows remain readable because the new columns have backward-compatible defaults.

After prepaid rows exist, do not drop columns or narrow the status constraint. Disable new prepaid shell creation server-side, keep the version-aware resolver, and let existing prepaid users finish or recover. A later owner-authorized cleanup migration may remove the indexes and columns only after proving that zero `prepaid_v2` rows remain.

If migration application fails, the surrounding transaction rolls back all DDL and the legacy application remains active. If deployment validation fails after a successful migration, redeploy the previous application; do not delete payments, entitlements, answers, reports, or assessment rows.
