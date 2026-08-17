import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Paywall V2a function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (["\"", "'", "`"].includes(character)) { quote = character; continue; }
    if (character === "{") depth += 1;
    if (character === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Paywall V2a function end missing: ${name}`);
}

const REPORT_PAYWALL = `function reportPaywallContent(embedded = false) {
  const completed = state.assessmentStatus === "complete";
  const heading = embedded
    ? \`<h2 id="full-report-value-title">Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо</h2>\`
    : \`<h1 id="page-title" tabindex="-1">Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо</h1>\`;
  return \`<section class="report-paywall sealed-paywall" aria-labelledby="\${embedded ? "full-report-value-title" : "page-title"}"><p class="eyebrow">ТЕСТ ДУУСЛАА</p>
    \${heading}
    <p class="paywall-lead">Тестийн хариултуудыг тань нэгтгэн, жин хасах төлөвлөгөөгөө дагахад ямар нөхцөл хүндрэл үүсгэж болох, өөр дээрээ юуг анзаарах, юунаас эхлэхийг бүрэн тайланд харуулна.</p>
    <section class="report-contents-preview" aria-labelledby="report-contents-title"><h2 id="report-contents-title">Бүрэн тайлангаас та:</h2>
      <ul><li>Таны хариултаас юу хамгийн тод ажиглагдсаныг</li><li>Ямар нөхцөлд хүндрэл нэмэгдэж болох, хэд хэдэн хэв маяг зэрэг ажиглагдсан бол тэдгээрийн уялдаа холбоог</li><li>Өөр дээрээ юу ажиглаж, ямар алхмаас эхэлж болохыг харна</li></ul>
    </section>
    <section class="premium-price-block" aria-label="Бүрэн тайлангийн үнэ ба төлбөр"><p class="premium-price-label">ТАНЫ ХУВИЙН БҮРЭН ТАЙЛАН</p><p class="premium-price">\${PRODUCT.displayPrice}</p><p class="premium-price-support">Нэг удаагийн төлбөр</p>
      \${completed ? \`<button class="button paywall-primary-cta" type="button" data-action="continue-to-payment" \${state.busy ? "disabled" : ""}>\${state.busy ? "НЭХЭМЖЛЭЛ ҮҮСГЭЖ БАЙНА…" : "БҮРЭН ТАЙЛАНГАА НЭЭХ"}</button>\` : \`<p class="notice">Тестийг бүрэн дуусгасны дараа тайлангаа нээх сонголт гарна.</p>\`}
      <p class="paywall-payment-note">QPay · Төлбөр баталгаажмагц бүрэн тайлан нээгдэнэ</p>
    </section>
    <p class="paywall-trust-copy">Тайлангийн агуулгыг таны өгсөн хариултад тулгуурлан бүрдүүлнэ. Тод хэв маяг ажиглагдаагүй бол зохиомол дүгнэлт нэмэхгүй.</p>
    <p class="muted paywall-boundary">Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.</p>
  </section>\`;
}`;

const INITIAL_RESULT = `function renderInitialResult() {
  return \`<div class="page paywall-page">\${paywallNavigation()}<main class="content-card result-page">\${reportPaywallContent()}</main>\${footer()}</div>\`;
}`;

export function applyPaywallV2a39000(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    source = replaceNamedFunction(source, "reportPaywallContent", REPORT_PAYWALL);
    source = replaceNamedFunction(source, "renderInitialResult", INITIAL_RESULT);
    fs.writeFileSync(appPath, source);
  }
}
