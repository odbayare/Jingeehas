#!/usr/bin/env bash
set -euo pipefail
set +x

ADMIN_EMAIL=""
ADMIN_PASSWORD=""
cleanup() {
  unset ADMIN_EMAIL ADMIN_PASSWORD
}
trap cleanup EXIT HUP INT TERM

read -r -p "Existing owner admin email: " ADMIN_EMAIL
read -r -s -p "Jingeehas admin password: " ADMIN_PASSWORD
printf '\n'

printf '%s' "$ADMIN_PASSWORD" | netlify dev:exec --context production -- \
  node scripts/certify-admin-live.mjs --email "$ADMIN_EMAIL" --password-stdin

printf 'ADMIN_EXISTING_OWNER_CERTIFICATION_STATUS=PASS\n'
