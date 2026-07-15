(function initMongolianCopyNormalizer(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MongolianCopyNormalizer = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createMongolianCopyNormalizer() {
  "use strict";

  const CANONICAL_COPY = Object.freeze({
    assessment: "үнэлгээ",
    heroAssessment: "тест",
    firstSnapshot: "эхний зураглал",
    fullReport: "бүрэн тайлан",
    advisor: "зөвлөх",
    invoice: "нэхэмжлэл",
    trigger: "дохио",
    easyChoice: "амар сонголт",
    evidence: "нотолгоо",
    cycle: "тойрог",
    tracking: "тэмдэглэх",
    safetyHeading: "Аюулгүй ашиглах сануулга",
    safetyBody: "Энэ үнэлгээг хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр бүү ашиглаарай. Бие тавгүйрхвэл туршилтаа зогсоож, дэмжлэг аваарай.",
    urgentHeading: "Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.",
    urgentBody: "Ганцаараа бүү үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Шаардлагатай бол ойрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандаарай."
  });

  const EXACT_REPLACEMENTS = new Map([
    ["Нэг удаагийн гүн анализ", "Нэг удаагийн гүн зураглал"],
    ["7 хоногийн гүн анализ", "7 хоногийн гүн зураглал"],
    ["Таны нэг удаагийн гүн анализ бэлэн боллоо", "Таны нэг удаагийн гүн зураглал бэлэн боллоо"],
    ["7 хоногийн гүн анализаа нээх", "7 хоногийн гүн зураглалаа нээх"],
    ["Body attention discomfort болон shame avoidance feedback-ээс зугтах cycle үүсгэж байна.", "Биедээ анхаарал хандуулахад эвгүйрхэх, буруутгагдахаас зайлсхийх мэдрэмж давтагдаж, тэмдэглэхээс ухрах тойрог үүсэж байна."],
    ["Delivery, snack харагдах, үнэр, social cue идэлт эхлүүлж байгаа эсэхийг ажиглана.", "Хүргэлт, зууш харагдах, үнэр, хамтын орчны дохио идэлтийг эхлүүлж байгаа эсэхийг ажиглана."],
    ["Guilt/shame, tracking-ээс зугтах, нуух behavior cycle-г үргэлжлүүлж байгаа эсэхийг ажиглана.", "Буруутгал, ичгүүр, тэмдэглэхээс зайлсхийх, нуух зан үйлийн тойрог үргэлжилж байгаа эсэхийг ажиглана."],
    ["Reward signal байгаа ч role overload/self-neglect evidence илүү тод давтагдсан.", "Өөрийгөө баярлуулах дохио байгаа ч үүргийн хэт ачаалал, өөрийгөө орхигдуулах нотолгоо илүү тод давтагдсан."],
    ["Stress signal байсан ч diary дээр low-energy/default evidence илүү хүчтэй давтагдсан.", "Стрессийн дохио байсан ч тэмдэглэлд тэнхээ багасах, амар сонголт руу орох нотолгоо илүү хүчтэй давтагдсан."],
    ["Social pressure болон өөрөө сонгох хэрэгцээ хоорондоо мөргөлдөж байна.", "Хамтын дарамт, өөрөө сонгох хэрэгцээ хоёр хоорондоо мөргөлдөж байна."],
    ["Body-neutral, private tracking турших.", "Биеийг үнэлэхгүй, хувийн байдлаар тэмдэглэхийг туршаарай."],
    ["Social event дээр хатуу rule", "Хамтын үйл явдалд хатуу дүрэм тавих"],
    ["Cue дүүрэн орчинд зөвхөн willpower шаардах.", "Дохио ихтэй орчинд зөвхөн хүсэл зоригоор тэсэхийг шаардах."],
    ["aggressive weight-loss plan эхлэх", "огцом жин хасах хөтөлбөр эхлэх"],
    ["Undesired default-ийг нэг алхам холдуулж, desired default-ийг нэг алхам ойртуулах.", "Хүсээгүй амар сонголтыг нэг алхам холдуулж, хүссэн сонголтыг нэг алхам ойртуулаарай."],
    ["Энэ нь онош гэсэн үг биш. Харин хэт барих, хоол алгасах, огцом diet эхлүүлэхээс өмнө аюулгүй талаа шалгах сануулга юм.", "Энэ нь онош гэсэн үг биш. Харин хоолоо хэт хасах, хоол алгасах, огцом дэглэм эхлүүлэхээс өмнө аюулгүй байдлаа шалгах сануулга юм."],
    ["QPay нэхэмжлэл үүсэх нь төлбөр биш.", "QPay нэхэмжлэл үүссэнээр төлбөр төлөгдсөнд тооцохгүй."],
    ["Missed day бол failure биш", "Нэг өдөр алгассан нь бүтэлгүйтэл биш"],
    ["Calorie тоолохгүй", "Калори тоолохгүй"],
    ["Зөвхөн pattern ажиглана", "Зөвхөн давтагдах хэв маягийг ажиглана"],
    ["Preview үнэгүй", "Эхний хэсгийг үнэгүй харах"],
    ["Trigger зураглал", "Дохионы зураглал"],
    ["Demo unlock хийх", "Дотоод туршилтаар нээх"],
    ["Diary үргэлжлүүлэх", "Тэмдэглэлээ үргэлжлүүлэх"],
    ["7 хоногийн diary нээх", "7 хоногийн тэмдэглэлээ нээх"],
    ["Утас эсвэл email", "Утас эсвэл имэйл"],
    ["Coach-ийн нэр", "Зөвлөхийн нэр"],
    ["Coach-ийн авах дүн", "Зөвлөхийн авах дүн"],
    ["coach-ийн урилга", "зөвлөхийн урилга"]
  ]);

  const TOKEN_REPLACEMENTS = [
    [/\bCoach\b/gi, "Зөвлөх"],
    [/\bcoach\b/gi, "зөвлөх"],
    [/\bpattern\b/gi, "хэв маяг"],
    [/\bdiary\b/gi, "тэмдэглэл"],
    [/\btracking\b/gi, "тэмдэглэх"],
    [/\bcycle\b/gi, "тойрог"],
    [/\bloop\b/gi, "тойрог"],
    [/\bevidence\b/gi, "нотолгоо"],
    [/\bcue\b/gi, "дохио"],
    [/\bdefault\b/gi, "амар сонголт"],
    [/\breward\b/gi, "өөрийгөө баярлуулах хэрэгцээ"],
    [/\bsocial\b/gi, "хамтын"],
    [/\bwillpower\b/gi, "хүсэл зориг"],
    [/\bcraving\b/gi, "идэх хүсэл"],
    [/\bplan\b/gi, "төлөвлөгөө"],
    [/\brule\b/gi, "дүрэм"],
    [/\bsignal\b/gi, "дохио"],
    [/\bfailure\b/gi, "бүтэлгүйтэл"],
    [/\benergy\b/gi, "тэнхээ"],
    [/\bdelivery\b/gi, "хоол хүргэлт"],
    [/\bsnack\b/gi, "зууш"],
    [/\bpause\b/gi, "түр завсарлага"],
    [/\breset\b/gi, "хэвийн үргэлжлэл"],
    [/\bpunishment\b/gi, "шийтгэл"],
    [/\bbackup\b/gi, "нөөц"],
    [/\bfixed\b/gi, "тогтмол"],
    [/\boption\b/gi, "сонголт"],
    [/\breflection\b/gi, "өөрийн ажиглалт"],
    [/\bcontext\b/gi, "нөхцөл"],
    [/\bupgrade\b/gi, "нэмэлт эрх"],
    [/\bsample report\b/gi, "тайлангийн жишээ"],
    [/\bdiet plan\b/gi, "хоолны дэглэм"],
    [/\bmeal plan\b/gi, "хоолны төлөвлөгөө"],
    [/\bmeal prep\b/gi, "хоол бэлтгэх"],
    [/\bchallenge\b/gi, "сорилт"],
    [/\bbody-neutral\b/gi, "биеийг үнэлэхгүй"],
    [/\blow-energy\b/gi, "тэнхээ багасах"],
    [/\bguilt\/shame\b/gi, "гэмшил, ичгүүр"],
    [/\bshame\b/gi, "ичгүүр"],
    [/\bguilt\b/gi, "гэмшил"],
    [/\brole overload\/self-neglect\b/gi, "үүргийн хэт ачаалал, өөрийгөө орхигдуулах"],
    [/\baggressive weight-loss\b/gi, "огцом жин хасах"]
  ];

  const POLITE_ENDINGS = [
    [/\bтав\.(?=\s|$)/g, "тавиарай."],
    [/\bсонго\.(?=\s|$)/g, "сонгоорой."],
    [/\bтэмдэглэ\.(?=\s|$)/g, "тэмдэглээрэй."],
    [/\bбэлд\.(?=\s|$)/g, "бэлдээрэй."],
    [/\bялга\.(?=\s|$)/g, "ялгаарай."],
    [/\bбуц\.(?=\s|$)/g, "буцаарай."],
    [/\bашигла\.(?=\s|$)/g, "ашиглаарай."],
    [/\bанзаар\.(?=\s|$)/g, "анзаараарай."],
    [/\bтурш\.(?=\s|$)/g, "туршаарай."],
    [/\bхамгаал\.(?=\s|$)/g, "хамгаалаарай."],
    [/\bхолдуул\.(?=\s|$)/g, "холдуулаарай."],
    [/\bтогтоо\.(?=\s|$)/g, "тогтоогоорой."],
    [/\bүргэлжлүүл\.(?=\s|$)/g, "үргэлжлүүлээрэй."],
    [/\bхолбогд\.(?=\s|$)/g, "холбогдоорой."]
  ];

  const CONFIDENCE_REPLACEMENTS = [
    [/үүрэг гүйцэтгэж байж магадгүй/g, "үүрэг гүйцэтгэх магадлалтай"],
    [/шалтгаан байж магадгүй/g, "шалтгаантай байх магадлалтай"],
    [/холбоотой байж магадгүй/g, "холбоотой байх магадлалтай"],
    [/нөлөөлж байж магадгүй/g, "нөлөөлөх магадлалтай"],
    [/тохиромжгүй байж болох аргууд/g, "тохиромжгүй байх магадлалтай аргууд"],
    [/яагаад удаан ажиллаагүй байж болохыг/g, "яагаад удаан үргэлжлээгүйг"],
    [/мэргэжлийн зөвлөгөө шаардлагатай байж болох дохиог/g, "мэргэжлийн зөвлөгөө шаардлагатай дохиог"]
  ];

  const SAFETY_BODY_VARIANTS = [
    "Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна.",
    "Энэ үнэлгээг хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр бүү ашиглаарай. Бие тавгүйрхвэл туршилтаа зогсоож, дэмжлэг аваарай.",
    "Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна."
  ];

  const URGENT_HEAD_VARIANTS = [
    "Одоо жин хасах тухай биш — эхлээд таны аюулгүй байдал чухал байна",
    "Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал."
  ];

  function uppercaseSentenceStarts(text) {
    return text.replace(/([.!?])\s+([а-яөү])/g, (_, punctuation, letter) => `${punctuation} ${letter.toUpperCase()}`);
  }

  function normalizePunctuation(text) {
    return uppercaseSentenceStarts(
      text
        .replace(/[ \t]+([,.;:!?])/g, "$1")
        .replace(/([,.;:!?])(?=[А-ЯӨҮа-яөү])/g, "$1 ")
        .replace(/\s{2,}/g, " ")
        .replace(/\.\s*өдөр тутмын/g, ". Өдөр тутмын")
        .replace(/байна\s+Үүн дээр/g, "байна. Үүн дээр")
        .trim()
    );
  }

  function normalizeMongolianCopyText(value) {
    let text = String(value == null ? "" : value);
    for (const [from, to] of EXACT_REPLACEMENTS) text = text.split(from).join(to);
    for (const [pattern, replacement] of TOKEN_REPLACEMENTS) text = text.replace(pattern, replacement);
    for (const [pattern, replacement] of CONFIDENCE_REPLACEMENTS) text = text.replace(pattern, replacement);
    for (const [pattern, replacement] of POLITE_ENDINGS) text = text.replace(pattern, replacement);
    SAFETY_BODY_VARIANTS.forEach(variant => { text = text.split(variant).join(CANONICAL_COPY.safetyBody); });
    URGENT_HEAD_VARIANTS.forEach(variant => { text = text.split(variant).join(CANONICAL_COPY.urgentHeading); });
    return normalizePunctuation(text);
  }

  function normalizeTextNode(node) {
    const next = normalizeMongolianCopyText(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  function normalizeAttributes(element) {
    ["placeholder", "title", "aria-label", "alt"].forEach(name => {
      if (!element.hasAttribute || !element.hasAttribute(name)) return;
      const current = element.getAttribute(name);
      const next = normalizeMongolianCopyText(current);
      if (next !== current) element.setAttribute(name, next);
    });
  }

  function normalizeElement(rootElement) {
    if (!rootElement) return;
    const doc = rootElement.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc || !doc.createTreeWalker) return;
    const SHOW_TEXT = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
    const walker = doc.createTreeWalker(rootElement, SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(normalizeTextNode);
    if (rootElement.nodeType === 1) normalizeAttributes(rootElement);
    if (rootElement.querySelectorAll) rootElement.querySelectorAll("*").forEach(normalizeAttributes);
  }

  function installMongolianCopyNormalizer(options = {}) {
    if (typeof document === "undefined") return null;
    const target = options.target || document.getElementById("app") || document.body;
    if (!target) return null;
    let applying = false;
    const apply = () => {
      if (applying) return;
      applying = true;
      try { normalizeElement(target); } finally { applying = false; }
    };
    apply();
    if (typeof MutationObserver === "undefined") return { disconnect() {} };
    const observer = new MutationObserver(() => apply());
    observer.observe(target, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title", "aria-label", "alt"] });
    return observer;
  }

  function auditForbiddenTerms(text) {
    const forbidden = [
      "pattern", "diary", "tracking", "cycle", "loop", "evidence", " cue", "default", "reward",
      "social", "willpower", "craving", "Coach", "coach", "analysis", "preview", "sample report",
      "aggressive weight-loss", "body-neutral", "guilt", "shame", "low-energy"
    ];
    const lower = String(text || "").toLowerCase();
    return forbidden.filter(term => lower.includes(term.toLowerCase()));
  }

  return Object.freeze({
    CANONICAL_COPY,
    normalizeMongolianCopyText,
    normalizeElement,
    installMongolianCopyNormalizer,
    auditForbiddenTerms
  });
});

if (typeof window !== "undefined" && window.MongolianCopyNormalizer) {
  const install = () => window.MongolianCopyNormalizer.installMongolianCopyNormalizer();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
}
