import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_CANONICAL = "https://jingeehas.fit/";
function attribute(source, tagPattern, name) { return source.match(new RegExp(`<${tagPattern}[^>]*${name}=["']([^"']+)["']`, "i"))?.[1] || ""; }

export function verifyDomainConfig({ env = process.env, rootDirectory = root } = {}) {
  const index = fs.readFileSync(path.join(rootDirectory, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(rootDirectory, "app.js"), "utf8");
  const qpay = fs.readFileSync(path.join(rootDirectory, "netlify", "functions", "_lib", "qpay.js"), "utf8");
  const canonical = attribute(index, "link", "href");
  const ogUrl = index.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)/i)?.[1] || "";
  const ogImage = index.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)/i)?.[1] || "";
  const twitterImage = index.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)/i)?.[1] || "";
  const failures = [];
  let canonicalUrl;
  try { canonicalUrl = new URL(canonical); } catch { failures.push("canonical URL is missing or invalid"); }
  if (canonicalUrl?.protocol !== "https:") failures.push("canonical URL must use HTTPS");
  if (canonical !== EXPECTED_CANONICAL) failures.push(`canonical URL must equal ${EXPECTED_CANONICAL}`);
  if (ogUrl !== canonical) failures.push("og:url must equal canonical URL");
  for (const [name, value] of [["og:image", ogImage], ["twitter:image", twitterImage]]) {
    try { const parsed = new URL(value); if (parsed.protocol !== "https:" || parsed.origin !== canonicalUrl?.origin) failures.push(`${name} must use the canonical HTTPS origin`); }
    catch { failures.push(`${name} is missing or invalid`); }
  }
  for (const route of ["/recovery", "/privacy", "/terms", "/support"]) if (!app.includes(`href="${route}"`)) failures.push(`missing same-origin public route: ${route}`);
  if (!qpay.includes("this.config.callbackOrigin") || /callback_url:\s*["']https?:/i.test(qpay)) failures.push("QPay callback must derive from configured origin");
  const callback = String(env.QPAY_CALLBACK_ORIGIN || "");
  if (callback) { try { if (new URL(callback).protocol !== "https:") failures.push("QPAY_CALLBACK_ORIGIN must use HTTPS"); } catch { failures.push("QPAY_CALLBACK_ORIGIN is invalid"); } }
  const publicSources = `${index}\n${app}`;
  if (/http:\/\//i.test(publicSources)) failures.push("public source contains a non-HTTPS absolute URL");
  const forbidden = String(env.CROSS_PROJECT_FORBIDDEN_TOKEN || "").trim().toLowerCase();
  if (forbidden && publicSources.toLowerCase().includes(forbidden)) failures.push("cross-project name found in public source");
  return failures.length ? { status: "FAIL", failures } : { status: "PASS", scope: "repository-consistency-only", canonical, ogUrl, socialPreview: ogImage, publicRoutes: ["/recovery", "/privacy", "/terms", "/support"], qpayCallback: callback ? "HTTPS configuration present" : "BLOCKED: QPAY_CALLBACK_ORIGIN not supplied", ownerDomainVerification: "PENDING", dnsChanged: false };
}

function main() {
  const result = verifyDomainConfig();
  console.log(`DOMAIN_CONFIG_STATUS=${result.status}`);
  console.log(JSON.stringify(result, null, 2));
  if (result.status === "FAIL") process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
