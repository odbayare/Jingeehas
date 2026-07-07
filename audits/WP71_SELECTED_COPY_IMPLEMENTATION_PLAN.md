# WP71 Selected Copy Implementation Plan

## 1. IDs updated in the copy review files
- А-001
- А-012
- А-013
- А-022
- А-038
- А-088
- Т-026
- Т-029
- Т-033
- Т-038
- Т-047
- Т-049
- Т-051
- Т-053
- Т-055
- Т-058
- Т-071
- Т-116
- Т-185
- Т-195
- Т-315
- Т-356
- Т-381

## 2. IDs not found
- None

## 3. Semantic drift warnings
- A-038 / A-088: The editor revision narrows the question toward evening-specific fatigue and self-control. Confirm this is intended before app.js implementation, because the original question can describe general fatigue or decision depletion.
- T-185: “амттан” may be narrower than “амттай зүйл”; the source can include sweet, salty, fatty, flour-based, or delivery-food cravings.
- T-315: “гүнээ гэмшиж” may be too heavy for a non-judgmental app tone. Consider a softer phrasing before production use.
- “билээ” may be too literary if repeated across app copy. Review repetition before implementation.

## 4. Recommended final wording for A-038/A-088
- А-038: Юу хийхээ мэдэж байсан ч, хийх эрч хүч хүрэлцэхгүй үе танд хэр олон тохиолддог вэ?
- А-088: Юу хийхээ мэдэж байсан ч, хийх эрч хүч хүрэлцэхгүй үе танд тохиолдож байсан уу?
- Decision: The selected review-pack fields use these safer general-fatigue versions instead of adding “оройн цагаар”, because the source questions are not explicitly evening-only.

## 5. Recommended final wording for T-185
- Keep the broader “амттай зүйл” meaning unless product review confirms the context only means sweets.
- Decision: The selected review-pack field uses this broader version instead of narrowing “амттай зүйл” to only “амттан”.
- Recommended wording: Асуудлын гол нь та амттай зүйлд дуртайдаа биш байж болох юм. Сэтгэлээ баярлуулах хэрэгцээгээ урьдчилж төлөвлөөгүй үед орчны нөлөөлөл, уйдамтгай байдал болон өдрийн төгсгөлд илрэх алжаал ядаргаа нийлж, бэлэн хоол сонгох хамгийн хурдан шалтгаан болдог. Тиймээс авч хэрэгжүүлж болох эхний алхам бол амттай бүхнийг бүрэн хорих биш, харин таатай мэдрэмж өгөх жижиг сонголтуудаа урьдчилж төлөвлөх явдал юм.

## 6. Recommended final wording for T-315
- Avoid “гүнээ гэмшиж” unless owner review accepts the stronger emotional framing.
- Decision: The selected review-pack field uses this softer version instead of “гүнээ гэмшиж”.
- Recommended wording: Төлөвлөгөө тань бага зэрэг зөрчихөд гэмшиж, өөртөө хатуу хандах хандлага илэрч байгаа нь дараагийн сонголтоо зөв хийхэд саад болдог.

## 7. Recommendation
- Do not implement into app.js until these warnings are accepted or adjusted.
- Treat this as a selected review-pack update only, not full app-wide replacement copy.

## 8. Exact files in app.js/source that will need updating later
Based on audits/WP70_MONGOLIAN_COPY_REVIEW_PACK/99_DEVELOPER_TRACEABILITY.md, later implementation will need targeted source mapping in:
- app.js: question banks, report rendering text, report voice variants, safety report copy, paid report copy, public product copy.
- index.html: only if selected public title or metadata copy maps there later.
- mockBackend.js: only if coach-facing access or availability messages map there later.

No source files were changed in this WP71 planning step.

## 9. Tests needed before app.js implementation
- node --check app.js
- npm test
- Targeted copy tests covering selected IDs once source mappings are applied.
- Existing safety, QPay/payment, coming-soon, report voice, and Mongolian copy guard tests should remain green.
- Manual review for A-038/A-088, T-185, and T-315 before implementation.

## 10. Do-not-change guard list
- Keep WEIGHT_TEST_COMING_SOON_MODE = true.
- Keep 9,900₮ unchanged.
- Keep WEIGHT_TEST_ONE_TIME unchanged.
- Keep QPay create/check endpoint strings unchanged.
- No Netlify, DNS, or deploy changes.
- Do not touch payment flow or QPay behavior.
- Do not touch WP64/WP67 PDF packs.
- Do not touch audits/sprint-36-paid-depth-prototype/.
