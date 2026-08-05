import nodeCrypto from "node:crypto";
import { REQUIRED_PRODUCTION_FUNCTIONS } from "./required-production-functions.mjs";

const origin = String(process.env.JINGEEHAS_LIVE_ORIGIN || "https://jingeehas.fit").replace(/\/+$/, "");
const expectedVersion = "jingeehas-production-2026-07-v2-method-link";
const attempts = Math.max(1, Number(process.env.LIVE_SMOKE_ATTEMPTS || 20));
const delayMs = Math.max(1000, Number(process.env.LIVE_SMOKE_DELAY_MS || 15000));
const requestTimeoutMs = Math.max(1000, Number(process.env.LIVE_SMOKE_REQUEST_TIMEOUT_MS || 10000));

const sha256 = value => nodeCrypto.createHash("sha256").update(value).digest("hex");
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function request(pathname, expectedType = "text") {
  let response;
  try {
    response = await fetch(`${origin}${pathname}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(requestTimeoutMs),
      headers: { "cache-control": "no-cache", "user-agent": "JingeehasProductionSmoke/1.0" }
    });
  } catch (error) {
    throw new Error(`${pathname} request failed: ${error?.message || error}`);
  }
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  const body = await response.text();
  if (!body.trim()) throw new Error(`${pathname} returned an empty body`);
  if (expectedType === "json") {
    try { return { response, body, value: JSON.parse(body) }; }
    catch { throw new Error(`${pathname} did not return valid JSON`); }
  }
  return { response, body, value: body };
}

function includes(source, phrase, label) {
  if (!source.includes(phrase)) throw new Error(`${label} missing: ${phrase}`);
}
function excludes(source, phrase, label) {
  if (source.includes(phrase)) throw new Error(`${label} remains: ${phrase}`);
}

async function smokeOnce() {
  const [home, manifestResult, appResult, questionsResult, about, methodology, assessmentStart, metaConfig] = await Promise.all([
    request("/"),
    request("/production-package-manifest.json", "json"),
    request("/app.js"),
    request("/questions.js"),
    request("/about"),
    request("/methodology"),
    request("/assessment/start"),
    request("/.netlify/functions/meta-browser-config", "json")
  ]);

  const manifest = manifestResult.value;
  const app = appResult.body;
  const questions = questionsResult.body;
  if (manifest.schemaVersion !== 2) throw new Error(`live manifest schema is ${manifest.schemaVersion}, expected 2`);
  if (manifest.product?.comingSoon !== false) throw new Error("live manifest still marks the product as coming soon");
  if (manifest.packageRoot !== "dist") throw new Error(`unexpected packageRoot: ${manifest.packageRoot}`);
  if (manifest.functionsRoot !== ".generated-copy-hotfix/netlify/functions") throw new Error(`unexpected functionsRoot: ${manifest.functionsRoot}`);

  const staticMap = new Map((manifest.staticFiles || []).map(item => [item.file, item.sha256]));
  if (staticMap.get("app.js") !== sha256(app)) throw new Error("live app.js hash does not match the deployed manifest");
  if (staticMap.get("questions.js") !== sha256(questions)) throw new Error("live questions.js hash does not match the deployed manifest");
  if (!(manifest.functionFiles || []).length) throw new Error("live manifest contains no generated function hashes");

  const serverFunctions = new Set(manifest.serverFunctions || []);
  for (const name of REQUIRED_PRODUCTION_FUNCTIONS) {
    if (!serverFunctions.has(name)) throw new Error(`required live function absent from manifest: ${name}`);
  }

  includes(home.body, "app.js", "Homepage application bundle");
  includes(home.body, "questions.js", "Homepage question bundle");
  includes(about.body, "app.js", "About route application shell");
  includes(methodology.body, "app.js", "Methodology route application shell");
  includes(assessmentStart.body, "app.js", "Assessment-start application shell");

  includes(app, "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.", "Post-assessment payment copy");
  includes(app, "questionOptionLabel(question, option)", "Display-only option normalization");
  includes(app, "\"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\"", "Professional display label");
  excludes(app, "prepaid ? `<p class=\"notice\">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>`", "Duplicate paid notice");
  excludes(app, "тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн", "Commercial wording in safety copy");

  includes(questions, `const QUESTIONNAIRE_VERSION = \"${expectedVersion}\"`, "Questionnaire version");
  for (const canonical of [
    "Мэргэжлийн хоолзүйчийн зөвлөгөө",
    "Сэтгэлзүйн зөвлөгөө",
    "Хоолзүйч",
    "Сэтгэлзүйч"
  ]) includes(questions, canonical, "Canonical answer value");
  includes(questions, "Та өлсөх мэдрэмжээ ихэвчлэн хэзээ анзаардаг вэ?", "Revised hunger prompt");
  includes(questions, "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?", "Revised regain prompt");

  if (!metaConfig.value || typeof metaConfig.value !== "object") throw new Error("meta-browser-config returned an invalid payload");
  return {
    manifestStaticFiles: manifest.staticFiles.length,
    manifestFunctionFiles: manifest.functionFiles.length,
    serverFunctions: serverFunctions.size,
    appSha256: sha256(app),
    questionsSha256: sha256(questions)
  };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const result = await smokeOnce();
    console.log(`LIVE_PRODUCTION_SMOKE=PASS origin=${origin} attempt=${attempt}/${attempts} static=${result.manifestStaticFiles} functionFiles=${result.manifestFunctionFiles} functions=${result.serverFunctions} appSha256=${result.appSha256} questionsSha256=${result.questionsSha256}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`LIVE_PRODUCTION_SMOKE_RETRY attempt=${attempt}/${attempts}: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}
throw new Error(`LIVE_PRODUCTION_SMOKE=FAIL origin=${origin}: ${lastError?.message || lastError}`);
