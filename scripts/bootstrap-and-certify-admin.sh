#!/usr/bin/env bash
set -euo pipefail
set +x

ADMIN_EMAIL=""
ADMIN_PASSWORD=""
cleanup() {
  unset ADMIN_EMAIL ADMIN_PASSWORD
}
trap cleanup EXIT HUP INT TERM

read -r -p "Owner admin email: " ADMIN_EMAIL
read -r -s -p "New Jingeehas admin password: " ADMIN_PASSWORD
printf '\n'

printf '%s' "$ADMIN_PASSWORD" | netlify dev:exec --context production -- \
  env ADMIN_BOOTSTRAP_SAFETY_CONFIRMATION='CREATE FIRST JINGEEHAS ADMIN' \
  node scripts/bootstrap-admin.mjs --email "$ADMIN_EMAIL" --password-stdin --apply

printf '%s' "$ADMIN_PASSWORD" | netlify dev:exec --context production -- \
  node scripts/certify-admin-live.mjs --email "$ADMIN_EMAIL" --password-stdin

printf 'ADMIN_OWNER_WORKFLOW_STATUS=PASS\n'
