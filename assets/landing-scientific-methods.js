"use strict";

(() => {
  const BOX_ID = "scientific-methods-box";
  const markup = `<section id="${BOX_ID}" class="methodology-summary scientific-methods-box" aria-labelledby="scientific-methods-title">
    <p class="eyebrow">Судалгааны үндэс</p>
    <h2 id="scientific-methods-title">Ашигласан шинжлэх ухааны аргачлалууд</h2>
    <p>Weight Test-ийн бүтэц, хэмжээс болон үр дүнгийн тайлбарыг боловсруулахдаа идэх зан үйл, сэтгэлзүйн хүчин зүйлсийг судалдаг дараах олон улсын аргачлал, онолын хүрээнд ашиглагддаг концепцуудыг харгалзан үзсэн.</p>
    <div class="methodology-pillars">
      <article><h3>Биопсихосоциал загвар</h3><p>Жинтэй холбоотой асуудлыг бие махбод, сэтгэлзүй, зан үйл, амьдралын хэв маяг болон орчны харилцан нөлөөллөөр авч үздэг.</p></article>
      <article><h3>Dutch Eating Behavior Questionnaire — DEBQ</h3><p>Сэтгэл хөдлөлөөр идэх, гаднын өдөөлтөд хариу үйлдэл үзүүлж идэх, хоолоо хэт хязгаарлах хэв маягийг судалдаг.</p></article>
      <article><h3>Three-Factor Eating Questionnaire — TFEQ</h3><p>Хооллолтын танин мэдэхүйн хяналт, хяналт алдагдсан идэлт, өлсгөлөн болон идэх хүчтэй хүслийг авч үздэг.</p></article>
      <article><h3>Binge Eating Scale — BES</h3><p>Хяналтгүй болон хэтрүүлэн идэх үеийн зан үйл, хяналт алдсан мэдрэмж, гэмшил, ичгүүр зэрэг шинжийг судалдаг.</p></article>
      <article><h3>Night Eating Questionnaire — NEQ</h3><p>Орой болон шөнийн хооллолт, өглөөний хоолны дуршил, нойр ба хооллолтын хэмнэлийн холбоог авч үздэг.</p></article>
      <article><h3>Когнитив-зан үйлийн функциональ шинжилгээ</h3><p>Өдөөгч нөхцөл, бодол, сэтгэл хөдлөл, идэх зан үйл болон үр дагаврын хоорондын давтагддаг холбоог тодорхойлдог.</p></article>
    </div>
    <p class="methodology-limitation">Weight Test нь дээрх асуумжуудын шууд орчуулга биш бөгөөд сэтгэлзүйн болон эмнэлзүйн онош тавихгүй. Эдгээр аргачлалд судлагддаг концепцуудыг ашиглан жин хасахад саад болж болзошгүй сэтгэлзүйн болон идэх зан үйлийн хэв маягийг танихад тусална.</p>
    <a class="text-link" href="/methodology" data-route>Арга зүйн дэлгэрэнгүйг унших</a>
  </section>`;

  function insertScientificMethodsBox() {
    const landingMain = document.querySelector(".landing-page main");
    if (!landingMain || document.getElementById(BOX_ID)) return;
    const anchor = landingMain.querySelector(".faq-section") || landingMain.querySelector(".closing-section");
    if (anchor) anchor.insertAdjacentHTML("beforebegin", markup);
  }

  const app = document.getElementById("app");
  if (app) new MutationObserver(insertScientificMethodsBox).observe(app, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", insertScientificMethodsBox, { once: true });
  else insertScientificMethodsBox();
})();
