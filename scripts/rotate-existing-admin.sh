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
read -r -s -p "New Jingeehas admin password: " ADMIN_PASSWORD
printf '\n'

printf '%s\n%s' "$ADMIN_EMAIL" "$ADMIN_PASSWORD" | netlify dev:exec --context production -- \
  node scripts/rotate-and-certify-admin.mjs
