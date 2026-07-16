"use strict";

const PRODUCT = Object.freeze({
  name: "Илүүдэл жингээс салах тест үнэлгээ",
  code: "WEIGHT_TEST_ONE_TIME",
  amount: 9900,
  displayPrice: "9,900₮"
});
const WEIGHT_TEST_COMING_SOON_MODE = true;
const ROUTES = Object.freeze({
  "/": "landing",
  "/about": "about",
  "/assessment/start": "assessmentStart"
});

let testComingSoonOverride = null;

function isComingSoon() {
  return testComingSoonOverride === null ? WEIGHT_TEST_COMING_SOON_MODE : testComingSoonOverride;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);
}

function footer() {
  return `<footer class="site-footer"><p>${PRODUCT.name}</p></footer>`;
}

function renderLanding() {
  return `<div class="page landing-page">
    <nav class="site-nav" aria-label="Үндсэн цэс"><a href="/" data-route>Нүүр</a><a href="/about" data-route>Тестийн тухай</a></nav>
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Сэтгэлзүйн хэв маяг, далд зуршлын үнэлгээ</p>
        <h1 id="page-title" tabindex="-1">${PRODUCT.name}</h1>
        <div class="approved-copy">
          <p>Илүүдэл жин үүсгэж буй сэтгэлзүйн шалтгаанаа илрүүл.</p>
          <p>Ямар далд зуршлууд илүүдэл жин үүсэхэд нөлөөлж буйг тайлж мэд.</p>
          <p>Жин хасахад тань тохирох дөт хэв маяг, дасгал сургуулилтын чиглэлээ мэдэж ав.</p>
        </div>
        <p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        <a class="button" href="/assessment/start" data-route>Тест бөглөх</a>
      </div>
      <div class="hero-visual" aria-hidden="true"></div>
    </section>
    ${footer()}
  </div>`;
}

function renderAbout() {
  return `<div class="page"><nav class="site-nav" aria-label="Үндсэн цэс"><a href="/" data-route>Нүүр</a></nav>
    <main class="content-card"><h1 id="page-title" tabindex="-1">Тест үнэлгээний тухай</h1>
      <p>Таны өгсөн хариултаас давтагдсан хэв маяг болон ажиглалтыг ялгаж, эхний зураглал гаргана. Төлбөр баталгаажсаны дараа тест бөглөж, бүрэн тайлангаа авна.</p>
      <p>Энэ нь эмнэлгийн онош, эмчилгээний зөвлөгөө биш.</p>
      <a class="button" href="/assessment/start" data-route>Тест бөглөх</a>
    </main>${footer()}</div>`;
}

function renderAssessmentStart() {
  if (isComingSoon()) {
    return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Тун удахгүй</h1>
      <p>Тест үнэлгээний сервер талын хамгаалалт, төлбөр болон тайлан сэргээх үйлдэл бүрэн баталгаажсаны дараа нээгдэнэ.</p>
      <a class="button secondary" href="/" data-route>Нүүр рүү буцах</a>
    </main>${footer()}</div>`;
  }
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Тест эхлэх</h1></main>${footer()}</div>`;
}

function routeName(pathname) {
  const normalized = String(pathname || "/").replace(/\/+$/, "") || "/";
  return ROUTES[normalized] || "notFound";
}

function renderForPath(pathname) {
  const route = routeName(pathname);
  if (route === "landing") return renderLanding();
  if (route === "about") return renderAbout();
  if (route === "assessmentStart") return renderAssessmentStart();
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Хуудас олдсонгүй</h1><a class="button" href="/" data-route>Нүүр рүү буцах</a></main>${footer()}</div>`;
}

function bindRouteLinks(root) {
  root.querySelectorAll("a[data-route]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });
}

function render(options = {}) {
  if (typeof document === "undefined") return "";
  const root = document.getElementById("app");
  if (!root) return "";
  root.innerHTML = renderForPath(window.location.pathname);
  bindRouteLinks(root);
  const heading = document.getElementById("page-title");
  if (options.focus !== false && heading) heading.focus();
  return root.innerHTML;
}

function navigate(pathname, options = {}) {
  if (typeof window === "undefined") return;
  if (options.replace) window.history.replaceState({}, "", pathname);
  else window.history.pushState({}, "", pathname);
  render();
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => render());
  window.addEventListener("DOMContentLoaded", () => render({ focus: false }));
}

if (typeof module !== "undefined") {
  module.exports = {
    PRODUCT,
    WEIGHT_TEST_COMING_SOON_MODE,
    isComingSoon,
    routeName,
    renderForPath,
    escapeHtml,
    _test: {
      setComingSoon(value) { testComingSoonOverride = Boolean(value); },
      resetComingSoon() { testComingSoonOverride = null; }
    }
  };
}
