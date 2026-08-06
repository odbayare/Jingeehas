import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const asyncMarker = `async function ${name}(`;
  let start = source.indexOf(asyncMarker);
  if (start < 0) start = source.indexOf(marker);
  if (start < 0) throw new Error(`Approved paywall function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Approved paywall body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Approved paywall function end missing: ${name}`);
}

const TRUST_PAYWALL = `function reportPaywallContent(embedded = false) {
  const completed = state.assessmentStatus === "complete";
  const heading = embedded
    ? \`<h2 id="full-report-value-title">Бүрэн тайлангаас авах зүйлс</h2>\`
    : \`<h1 id="page-title" tabindex="-1">Бүрэн тайлангаас авах зүйлс</h1>\`;
  return \`<section class="report-paywall personalized-result-paywall" aria-labelledby="\${embedded ? "full-report-value-title" : "page-title"}"><p class="eyebrow">Бүрэн тайлан</p>
    \${heading}
    <section class="locked-report-preview" aria-labelledby="locked-report-title"><h2 id="locked-report-title">Тайланд дэлгэрэнгүй нээгдэх хэсгүүд</h2>
      <ol aria-label="Төлбөрийн дараа нээгдэх долоон хэсэг">\${LOCKED_REPORT_TITLES.map(title => \`<li><span>\${escapeHtml(title)}</span></li>\`).join("")}</ol>
    </section>
    <section class="paywall-trust" aria-labelledby="paywall-trust-title"><h2 id="paywall-trust-title">Төлбөр хийхээс өмнө мэдэх зүйлс</h2>
      <ul>
        <li>Тайлан зөвхөн таны тестийн хариултаар дэмжигдсэн мэдээлэлд тулгуурлана.</li>
        <li>\${PRODUCT.displayPrice} нь нэг удаагийн төлбөр. Захиалга болон автоматаар сунгалт байхгүй.</li>
        <li>QPay төлбөр баталгаажмагц бүрэн тайлан шууд нээгдэнэ.</li>
        <li>Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.</li>
      </ul>
    </section>
    \${completed ? \`<button class="button paywall-primary-cta" type="button" data-action="continue-to-payment" \${state.busy ? "disabled" : ""}>\${state.busy ? "Нэхэмжлэл үүсгэж байна…" : \`Бүрэн тайлангаа нээх — \${PRODUCT.displayPrice}\`}</button>\` : \`<p class="notice">Тестийг бүрэн дуусгасны дараа тайлангаа нээх сонголт гарна.</p>\`}
    <p class="muted paywall-note">Төлбөртэй холбоотой тусламж хэрэгтэй бол \${supportContactLink()} хаягаар холбогдоно уу.</p>
  </section>\`;
}`;

const INITIAL_RESULT = `function renderInitialResult() {
  const result = state.initialResult;
  if (!result) return \`<div class="page">\${navigation()}<main class="content-card initial-result-loading"><h1 id="page-title" tabindex="-1">Таны хариултыг нэгтгэж байна…</h1><p role="status">Тайлангийн тоон үр дүнг ачаалж байна.</p></main>\${footer()}</div>\`;
  const neutral = result.mode === "neutral";
  const patternCount = neutral ? 0 : Math.max(1, Math.trunc(Number(result.patternCount) || 0));
  const interactionCount = neutral ? 0 : Math.max(0, Math.trunc(Number(result.interactionCount) || 0));
  let resultBlock;
  if (neutral) {
    resultBlock = \`<section class="initial-result-summary neutral-result-summary" aria-labelledby="page-title"><p class="eyebrow">Таны үр дүн</p><h1 id="page-title" tabindex="-1">Таны тайланд хүчтэй давамгай нэг хэв маяг илрээгүй</h1>
      <p>Таны хариултад тулгуурлан хүчтэй саад болж буй сэтгэл зүйн хэв маяг гэж зохиомлоор дүгнэсэнгүй.</p>
      <p class="paywall-closing">Бүрэн тайлангаас одоо танд түшиг болж буй давуу тал, өдөр тутам ажиглах нөхцөл болон тогтвортой байдлаа хадгалах алхмуудыг харна.</p></section>\`;
  } else {
    const interactionCopy = interactionCount > 0
      ? "<p>Эдгээрийн дундаас <strong>" + escapeHtml(interactionCount) + " чухал уялдаа холбоо</strong> илэрсэн. Эдгээр хэв маяг давхцах үедээ бие биеийнхээ нөлөөг нэмэгдүүлж, жин хасах зорилгод тань хүчтэй саад болж байж болохыг таны хариултууд харууллаа.</p><p>Түүнчлэн эдгээр сэтгэл зүйн хэв маяг давхцсан үед хэрхэн удирдахаа сайн мэдэхгүй байгаа зураглал таны хариултаас гарлаа.</p>"
      : "<p>Эдгээр хэв маягийн хооронд батлагдсан хүчтэй давхцал илрээгүй. Гэхдээ хэв маяг тус бүр өөр өөр нөхцөлд жин хасах оролдлогыг тань хүндрүүлж байж болохыг таны хариултууд харууллаа.</p>";
    resultBlock = \`<section class="initial-result-summary personalized-result-summary" aria-labelledby="page-title"><p class="eyebrow">Таны үр дүн</p><h1 id="page-title" tabindex="-1">Таны тайланд \${escapeHtml(patternCount)} хэв маяг илэрлээ</h1>
      \${interactionCopy}
      <p class="paywall-closing">Бүрэн тайлангаас танд ямар хэв маягууд байгааг, тэдгээр нь ямар үед давхцаж хүчтэй нөлөөлдгийг, мөн тэдгээрийг хэрхэн удирдаж жин хасах зорилгодоо илүү хялбар, тогтвортой хүрч болохыг ойлгож аваарай.</p></section>\`;
  }
  const resultEmail = state.resultEmail;
  const emailCard = resultEmail && !resultEmail.skipped ? \`<section class="result-email-card" aria-labelledby="result-email-title"><h2 id="result-email-title">Үр дүнгээ хадгалах</h2><p>Имэйлээ хадгалбал тестийн үр дүн болон бүрэн тайлангаа өөр төхөөрөмжөөс сэргээж болно.</p>
    \${resultEmail.saved ? \`<p class="notice" role="status">Имэйл хадгалагдлаа.</p>\` : \`<form id="result-email-form" novalidate><label class="field" for="result-email"><span>Имэйл</span><input id="result-email" name="email" type="email" autocomplete="email" required></label><p class="error" role="alert">\${escapeHtml(resultEmail.error || "")}</p><div class="actions"><button class="button" type="submit" \${state.busy ? "disabled" : ""}>Имэйлээ хадгалах</button><button class="button secondary" type="button" data-action="skip-result-email">Одоо алгасах</button></div></form>\`}
  </section>\` : "";
  return \`<div class="page">\${navigation()}<main class="content-card result-page">\${resultBlock}\${reportPaywallContent(true)}\${emailCard}</main>\${footer()}</div>\`;
}`;

export function applyPostAssessmentPaywallApprovedCopyV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    source = replaceNamedFunction(source, "reportPaywallContent", TRUST_PAYWALL);
    source = replaceNamedFunction(source, "renderInitialResult", INITIAL_RESULT);
    fs.writeFileSync(appPath, source);
  }
}
