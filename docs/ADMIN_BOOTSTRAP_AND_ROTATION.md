# Initial administrator bootstrap and rotation

Status: **OWNER ACTION REQUIRED**. The TIAS owner identity was identified securely, but its existing password does not meet Jingeehas's 16-character mixed-class password policy. No administrator, session, password hash, or audit row was created. The owner must provide a new password through the documented hidden interactive input; it must not be sent through chat, email, a command argument, or a repository file.

The bootstrap runs only against the configured HTTPS database adapter. It has no default account, password, hash, or local fallback. The default is a read-only dry run; `--apply` is mandatory for writes. Passwords passed as command-line arguments are rejected.

For the initial owner bootstrap and complete live session-security certification, run `./scripts/bootstrap-and-certify-admin.sh`. It prompts locally for the owner email and hides the password, creates exactly one account through the existing bootstrap, then verifies login, logout, expired-session rejection, disabled-account rejection, unauthenticated-route rejection, audit creation, uniqueness, and session cleanup. Neither value is embedded in the shell command.

## Prerequisites

1. Complete staging database health/schema/transaction certification.
2. Inject `JINGEEHAS_DATABASE_API_URL` and `JINGEEHAS_DATABASE_API_KEY` through the privileged server environment.
3. Choose a named owner-controlled email and generate a unique password of 16-200 characters containing uppercase, lowercase, number, and symbol.
4. Ensure terminal recording, shell tracing, and command-output collection are disabled for the privileged operation.

## Dry run

Use a hidden shell variable or secret-manager pipe; do not put the password in a command argument:

```bash
read -r -s ADMIN_PASSWORD
printf '%s' "$ADMIN_PASSWORD" | node scripts/bootstrap-admin.mjs --email owner@example.com --password-stdin
unset ADMIN_PASSWORD
```

Expected result is `ADMIN_BOOTSTRAP_STATUS=PREPARED`, `dryRun: true`, and `writes: 0`. The password and hash are never printed.

## Apply first administrator

The owner must separately authorize the write. In the same privileged environment set `ADMIN_BOOTSTRAP_SAFETY_CONFIRMATION` to the exact internal confirmation documented below, rerun the command with `--apply`, then unset all transient values:

```text
CREATE FIRST JINGEEHAS ADMIN
```

The script atomically creates the active administrator and an `initial_admin_created` audit entry. It refuses if any active administrator already exists.

From the linked repository, the owner can perform the production bootstrap with one interactive shell line after replacing the email. The password is read silently, passed only on stdin, and unset immediately:

```bash
read -r -s ADMIN_PASSWORD; printf '%s' "$ADMIN_PASSWORD" | netlify dev:exec --context production -- env ADMIN_BOOTSTRAP_SAFETY_CONFIRMATION='CREATE FIRST JINGEEHAS ADMIN' node scripts/bootstrap-admin.mjs --email owner@example.com --password-stdin --apply; unset ADMIN_PASSWORD
```

## Immediate rotation

Generate a new unique password, repeat the secure stdin procedure with the same email, `--rotate --apply`, and the safety confirmation. Rotation is allowed only for the matching existing active administrator. It atomically changes the scrypt hash and creates an `admin_password_rotated` audit entry. Verify login with the new credential, revoke existing admin sessions, and remove the old credential from the secret manager.

## Failure handling and evidence

On any error, stop; do not weaken HTTPS, transaction, password, existing-admin, or confirmation checks. Confirm transaction rollback and inspect audit records through an approved privileged interface. Record only commit SHA, database deployment ID, masked admin email, action, audit-log ID, timestamp, operator, and result. Never record the password, hash, session cookie, API key, or full database URL.
