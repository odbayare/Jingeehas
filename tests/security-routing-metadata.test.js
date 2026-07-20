"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
for (const header of ["Content-Security-Policy", "Referrer-Policy", "X-Content-Type-Options", "X-Frame-Options", "Permissions-Policy", "Strict-Transport-Security"]) assert(headers.includes(header));
assert(headers.includes("frame-ancestors 'none'"));
assert(!headers.includes("unsafe-inline"));
assert.equal(fs.readFileSync(path.join(root, "_redirects"), "utf8").trim(), "/* /index.html 200");

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const metadata of ["canonical", "og:image", "twitter:image", "favicon.svg", "social-preview.png"]) assert(html.includes(metadata));
assert(fs.statSync(path.join(root, "assets", "social-preview.png")).size > 10000);
assert.equal(fs.readFileSync(path.join(root, "assets", "social-preview.png")).subarray(1, 4).toString(), "PNG");

for (const route of ["/", "/methodology", "/assessment/start", "/assessment/contact", "/assessment/questions", "/assessment/completed", "/assessment/payment", "/report", "/recovery", "/advisor/login", "/advisor/dashboard", "/admin", "/privacy", "/terms", "/support", "/data-deletion"]) assert.notEqual(app.routeName(route), "notFound", route);
app._test.setComingSoon(false);
assert(app.renderForPath("/privacy").includes("нууцлагдсан зочин болон сессийн танигчаар өдрийн нийлбэр үзүүлэлт хэмжинэ"));
assert(app.renderForPath("/privacy").includes("түүхий IP хаяг хадгалахгүй"));
assert(app.renderForPath("/terms").includes("9,900₮"));
assert(app.renderForPath("/support").includes("Төлбөр шалгах"));
assert(app.renderForPath("/data-deletion").includes("тайлангаа сэргээнэ үү"));
for (const route of ["/privacy", "/terms", "/support", "/recovery", "/data-deletion"]) assert.match(app.renderForPath(route), /href="mailto:[^"]+">[^<]+<\/a>/, route);
app._test.resetComingSoon();

const publicSource = ["app.js", "index.html", "questions.js"].map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
assert(!/\son(?:click|input|change)=/i.test(publicSource));
assert(!publicSource.includes("localStorage"));
assert(!publicSource.includes("support@jingeehas.fit"));
assert.match(publicSource, /const SUPPORT_EMAIL = "[^"\s]+@[^"\s]+";/);
console.log("security headers, routing, privacy, and metadata tests passed");
