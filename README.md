# Jingeehas

`Илүүдэл жингээс салах тест үнэлгээ` нь нэг удаагийн, `9,900₮`-ийн тест үнэлгээ. Controlled production QPay smoke test амжилттай баталгаажсаны дараа `WEIGHT_TEST_COMING_SOON_MODE`-ийг унтрааж, олон нийтийн урсгалыг нээсэн.

## Хамгаалагдсан бүтээгдэхүүн

- Бүтээгдэхүүний код: `WEIGHT_TEST_ONE_TIME`
- Дүн: `9900`
- Харагдах үнэ: `9,900₮`
- Нэхэмжлэл үүсгэх: `/.netlify/functions/qpay-create-invoice`
- Төлбөр шалгах: `/.netlify/functions/qpay-check-payment`

Өөр арилжааны бүтээгдэхүүн, нэмэлт шат, тэмдэглэлийн бүтээгдэхүүн байхгүй.

## Архитектур

Статик клиент нь Netlify Functions-тэй зөвхөн ижил домэйноор харилцана. Сервер HTTP-only cookie session үүсгэж, assessment, payment, entitlement, recovery, advisor/admin authorization-ыг сервер талд шийднэ. Browser storage-д эрүүл мэндийн хариулт, тайлан, төлбөрийн эрх, нууц үг, session эсвэл урилгын token хадгалахгүй.

Production database нь `netlify/functions/_lib/store.js` дахь adapter boundary-аар Enneagram test Supabase төслийн private `jingeehas` schema-д зориулсан dedicated-secret Edge Function gateway-тай ажиллана. Gateway нь Netlify-гээс ирэх хүсэлтийг `JINGEEHAS_GATEWAY_SECRET`-ээр шалгаад, Supabase-ийн service-role түлхүүрийг зөвхөн Edge Function дотроос RPC руу ашиглана. Gateway base URL нь `https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway`; adapter `/transaction` нэмнэ. Environment байхгүй үед production endpoint `503` буцааж, memory/localStorage fallback хийхгүй. Memory adapter зөвхөн `tests/support` дотор байна.

QPay integration нь [албан ёсны Merchant V2 урсгал](https://developer.qpay.mn/mn/docs/merchant?version=2.0.0)-ын `POST /v2/auth/token`, `POST /v2/invoice`, `POST /v2/payment/check` contract-ыг ашиглана. Автомат тест provider HTTP-г mock хийдэг бөгөөд бодит нэхэмжлэл үүсгэдэггүй.

## Environment variables

Production launch-аас өмнө:

- `JINGEEHAS_DATABASE_API_URL`
- `JINGEEHAS_DATABASE_API_KEY`
- `QPAY_API_BASE_URL`
- `QPAY_CLIENT_ID`
- `QPAY_CLIENT_SECRET`
- `QPAY_INVOICE_CODE`
- `QPAY_CALLBACK_ORIGIN`
- `QPAY_ALLOWED_APP_SCHEMES`
- `QPAY_ALLOWED_HTTPS_HOSTS`
- `RECOVERY_ENCRYPTION_KEY` — 32-byte key, base64
- `RECOVERY_HASH_PEPPER` — 32+ character secret
- `RECOVERY_DELIVERY_API_URL`
- `RECOVERY_DELIVERY_API_KEY`
- `RECOVERY_SENDER_EMAIL`
- `RECOVERY_SENDER_NAME`
- `RECOVERY_CHANNEL=email`
- `RECOVERY_RATE_LIMIT_STORE=database`
- `CROSS_PROJECT_FORBIDDEN_TOKEN` — CI contamination guard secret

Admin account-ыг `admin_accounts` хүснэгтэд scrypt password hash-тайгаар аюулгүй bootstrap хийнэ. Нууц үгийг repository эсвэл browser storage-д оруулахгүй.

## Local development

```bash
npm ci
npm test
npm run test:contracts
npx playwright install chromium
npm run test:e2e
npm run verify:production-package
npm run verify:database-config
npm run verify:database-gateway-auth
npm run verify:recovery-config
npm run verify:qpay-config
npm run verify:domain-config
npm run build:staging
npm run verify:staging-package
```

`npm run build:production` зөвхөн `index.html`, client JS/CSS, security files, local assets-ыг `dist/` рүү хуулна. Tests, fixtures, E2E mock server, source documentation publish package-д орохгүй.

## Mock дүрэм

- Production HTML mock backend ачаалахгүй.
- Memory database, QPay provider, recovery delivery injection зөвхөн test process-д нээгдэнэ.
- Automated tests бодит QPay HTTP хүсэлт, бодит нэхэмжлэл, бодит төлбөр хийхгүй.
- URL query, localStorage, raw advisor ID нь entitlement эсвэл privileged access болохгүй.

## Launch checklist

- [x] Database API-г schema contract-аар provision хийж, backup/restore турших
- [ ] Recovery delivery provider болон rate limit-ийг staging-д баталгаажуулах
- [ ] QPay callback origin, app scheme, HTTPS host allowlist-ийг owner/provider-оор баталгаажуулах
- [ ] Admin account-ыг secure bootstrap хийх
- [ ] Privacy/terms/support copy-г owner/legal review хийх
- [x] Canonical domain болон social preview URL-г `https://jingeehas.fit/` гэж owner баталгаажуулсан
- [ ] Staging дээр owner-assisted sandbox payment хийх
- [ ] CI бүх алхам ногоон болох
- [ ] Дээрх blocker-ууд хаагдсаны дараа л coming-soon mode-г тусдаа owner-approved өөрчлөлтөөр нээх

Энэ repository-ийн CI deploy хийдэггүй. Энэ ажлын хүрээнд deploy, merge, бодит нэхэмжлэл эсвэл бодит төлбөр хийх ёсгүй.

## External launch certification status

- Database schema: **PASS** — private Supabase schema, constraints, RLS and database-side transaction/rollback are verified.
- Supabase gateway: **PASS / ACTIVE** — dedicated-secret authentication and insert/get/update/find/delete/rollback/cleanup pass with no residual certification rows.
- Database application injection: **PASS** — `JINGEEHAS_DATABASE_API_KEY` contains only the dedicated gateway secret; the shared Supabase service-role credential is absent from Netlify.
- Database backup/restore: **PASS** — access-controlled logical artifacts were restored into a disposable PostgreSQL 17 instance with 22 tables and zero `public` tables.
- Recovery delivery: **PASS** — the verified Resend sender delivered to the monitored owner inbox; live expiry, one-minute cooldown, five-attempt lockout, one-time use, anti-enumeration, clean-context report recovery, and cleanup all pass. No test address, API key, or code is recorded.
- QPay configuration: **PASS / LIVE MERCHANT** — reusable TIAS merchant configuration is installed server-side and a live no-provider-request probe passes. The provider configuration is production-only, so no invoice or payment was created.
- QPay sandbox: **OWNER BLOCKED** — the verified merchant configuration is production-only and no isolated sandbox/test endpoint exists. A controlled owner-approved real-payment smoke test remains required before launch.
- Admin bootstrap: **OWNER ACTION REQUIRED** — tooling passes, but the existing TIAS password does not meet the Jingeehas password policy; no real administrator or audit row was created.
- Support inbox: **OWNER BLOCKED** — the live delivery retry was rejected and the available Namecheap session requires owner sign-in before the alias can be repaired and retested.
- Owner/legal: **PENDING** — see `docs/OWNER_LAUNCH_REVIEW.md`.
- Domain/live site: **PASS** — HTTPS, canonical, apex/www routing, public routes, security headers, and coming-soon enforcement pass.
- Pre-launch deployment: **PASS** — production deploy `6a593860da8604112e80ab38` is live with coming-soon mode enabled.

Engineering preparation and the staging package can pass while external certification and public launch remain blocked. Configuration verifiers report missing dependencies as `BLOCKED`; this is not a launch PASS.

Certification procedures:

- `docs/STAGING_DATABASE_CERTIFICATION.md`
- `docs/STAGING_RECOVERY_CERTIFICATION.md`
- `docs/QPAY_SANDBOX_CERTIFICATION.md`
- `docs/ADMIN_BOOTSTRAP_AND_ROTATION.md`
- `docs/OWNER_LAUNCH_REVIEW.md`
