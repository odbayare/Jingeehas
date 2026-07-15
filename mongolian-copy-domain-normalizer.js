(function initMongolianDomainNormalizer(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MongolianDomainNormalizer = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createMongolianDomainNormalizer() {
  "use strict";

  const EXACT = new Map([
    ["BCT — зан үйлийн өөрчлөлтийн аргачлал", "Зан үйлийн өөрчлөлтийн аргачлал"],
    ["CBT — танин мэдэхүй-зан үйлийн хандлага", "Танин мэдэхүй–зан үйлийн хандлага"],
    ["Emotional Eating — стресс ба сэтгэл хөдлөлийн идэлт", "Сэтгэл хөдлөлтэй холбоотой идэлт"],
    ["Habit Loop — дадал, өдөөгч, хариу үйлдлийн давталт", "Дадлын тойрог — өдөөгч, хариу үйлдэл, давталт"],
    ["Habit тойрог — дадал, өдөөгч, хариу үйлдлийн давталт", "Дадлын тойрог — өдөөгч, хариу үйлдэл, давталт"],
    ["Environmental Cue Analysis — орчны өдөөгч хүчин зүйлс", "Орчны дохионы шинжилгээ"],
    ["Environmental дохио Analysis — орчны өдөөгч хүчин зүйлс", "Орчны дохионы шинжилгээ"],
    ["Self-Monitoring — өөрийгөө ажиглах, хэв маягаа тэмдэглэх арга", "Өөрийгөө ажиглаж, хэв маягаа тэмдэглэх арга"],
    ["Sleep / Rhythm / Recovery — унтах хэмнэл, энерги, сэргэлтийн ажиглалт", "Нойр, хэмнэл, сэргэлтийн ажиглалт"],
    ["Safety-First Screening — мэргэжлийн зөвлөгөө шаардлагатай байж болох дохиог ялгах шалгуур", "Аюулгүй байдлыг түрүүнд тавьж, мэргэжлийн зөвлөгөө шаардлагатай дохиог ялгах шалгуур"],
    ["Safety-First Screening — мэргэжлийн зөвлөгөө шаардлагатай дохиог ялгах шалгуур", "Аюулгүй байдлыг түрүүнд тавьж, мэргэжлийн зөвлөгөө шаардлагатай дохиог ялгах шалгуур"],
    ["Executive Load Failure", "Оройн шийдвэрийн ачаалал"],
    ["Executive Load бүтэлгүйтэл", "Оройн шийдвэрийн ачаалал"],
    ["Food-as-Regulation System", "Хоолоор тайвшрах хэв маяг"],
    ["Food-as-Regulation", "Хоолоор тайвшрах хэв маяг"],
    ["Decision-Default", "Амар сонголтын хэв маяг"],
    ["Decision-Амар сонголт", "Амар сонголтын хэв маяг"],
    ["Hunger-Safety / Scarcity Protection", "Өлсөлтөөс хамгаалах хэв маяг"],
    ["Hunger-Safety", "Өлсөлтөөс хамгаалах хэв маяг"],
    ["Glucose-Safety / Hypoglycemia Risk Pattern", "Цусан дахь сахарын өөрчлөлттэй холбоотой биеийн дохио"],
    ["Glucose-Safety", "Цусан дахь сахарын өөрчлөлттэй холбоотой биеийн дохио"],
    ["Reward-Seeking / Stimulation Compensation", "Таатай мэдрэмж нөхөх хэв маяг"],
    ["Reward-Seeking", "Таатай мэдрэмж нөхөх хэв маяг"],
    ["өөрийгөө баярлуулах хэрэгцээ-Seeking / Stimulation Compensation", "Таатай мэдрэмж нөхөх хэв маяг"],
    ["өөрийгөө баярлуулах хэрэгцээ-Seeking", "Таатай мэдрэмж нөхөх хэв маяг"],
    ["Decision fatigue", "Шийдвэрийн ядаргаа"],
    ["decision fatigue", "шийдвэрийн ядаргаа"],
    ["low-friction default", "хамгийн бага хүч шаарддаг амар сонголт"],
    ["low-friction амар сонголт", "хамгийн бага хүч шаарддаг амар сонголт"],
    ["leverage point", "эхэлж өөрчлөх цэг"],
    ["meal replacement", "хоол орлуулах бүтээгдэхүүн"],
    ["Energy drink", "Эрч хүчний ундаа"],
    ["Fitness challenge", "Фитнесийн богино сорилт"],
    ["sample report", "тайлангийн жишээ"],
    ["Trigger map", "Дохионы зураглал"],
    ["trigger map", "дохионы зураглал"],
    ["Дохио map", "Дохионы зураглал"],
    ["дохио map", "дохионы зураглал"],
    ["one_time", "нэг удаагийн үнэлгээ"],
    ["seven_day", "7 хоногийн үнэлгээ"],
    ["9,900 MNT", "9,900 ₮"],
    ["29,000 MNT", "29,000 ₮"],
    ["19,900 MNT", "19,900 ₮"],
    ["Demo unlock", "Дотоод туршилтын нээлт"],
    ["fake payment", "туршилтын төлбөр"],
    ["lead capture", "сонирхлын бүртгэл"],
    ["purchase intent", "худалдан авах сонирхол"],
    ["Text reflection боломжтой", "Бичгээр өөрийн ажиглалтаа нэмэх боломжтой"],
    ["Text өөрийн ажиглалт боломжтой", "Бичгээр өөрийн ажиглалтаа нэмэх боломжтой"],
    ["Текст reflection боломжтой", "Бичгээр өөрийн ажиглалтаа нэмэх боломжтой"],
    ["Body attention discomfort", "Биедээ анхаарал хандуулахад эвгүйрхэх мэдрэмж"],
    ["role overload/self-neglect", "үүргийн хэт ачаалал, өөрийгөө орхигдуулах"],
    ["planned imperfection", "төгс бусыг урьдчилан зөвшөөрөх"],
    ["public challenge", "олон нийтийн сорилт"],
    ["private tracking", "хувийн байдлаар тэмдэглэх"],
    ["private тэмдэглэх", "хувийн байдлаар тэмдэглэх"],
    ["default dinner system", "шийдвэр шаардахгүй оройн хоолны бэлэн зам"],
    ["амар сонголт dinner system", "шийдвэр шаардахгүй оройн хоолны бэлэн зам"],
    ["anchor meal", "тулгуур хоол"],
    ["bridge snack", "гүүр зууш"],
    ["bridge зууш", "гүүр зууш"],
    ["high intensity challenge", "өндөр ачаалалтай сорилт"],
    ["social event", "хамтын үйл явдал"],
    ["хамтын event", "хамтын үйл явдал"],
    ["daily reward deficit", "өдөр тутмын таатай мэдрэмжийн дутагдал"],
    ["daily өөрийгөө баярлуулах хэрэгцээ deficit", "өдөр тутмын таатай мэдрэмжийн дутагдал"],
    ["energy rhythm", "тэнхээний хэмнэл"],
    ["тэнхээ rhythm", "тэнхээний хэмнэл"]
  ]);

  const TOKENS = [
    [/\bfeedback\b/gi, "хариу мэдээлэл"],
    [/\bbehavior\b/gi, "зан үйл"],
    [/\bpressure\b/gi, "дарамт"],
    [/\bevent\b/gi, "үйл явдал"],
    [/\bprivate\b/gi, "хувийн"],
    [/\bpublic\b/gi, "олон нийтийн"],
    [/\bscript\b/gi, "бодол"],
    [/\bintensity\b/gi, "ачаалал"],
    [/\bdaily\b/gi, "өдөр тутмын"],
    [/\bpleasure\b/gi, "таатай мэдрэмж"],
    [/\bslot\b/gi, "хугацаа"],
    [/\bproof\b/gi, "баталгаа"],
    [/\bmeal\b/gi, "хоол"],
    [/\bdetox\b/gi, "хор тайлах дэглэм"],
    [/\bemail\b/gi, "имэйл"],
    [/\bbrowser\b/gi, "хөтөч"],
    [/\bclipboard\b/gi, "түр санах ой"],
    [/\bprint\b/gi, "хэвлэх"],
    [/\bcopy\b/gi, "хуулах"],
    [/\bdemo\b/gi, "дотоод туршилт"],
    [/\bvalidation\b/gi, "баталгаажуулалт"],
    [/\banalysis\b/gi, "шинжилгээ"],
    [/\bmap\b/gi, "зураглал"],
    [/\bText\b/g, "Бичвэр"],
    [/\bAI\b/g, "хиймэл оюун"],
    [/\bMNT\b/g, "₮"]
  ];

  function normalizeMongolianDomainCopyText(value) {
    let text = String(value == null ? "" : value);
    for (const [from, to] of EXACT) text = text.split(from).join(to);
    for (const [pattern, replacement] of TOKENS) text = text.replace(pattern, replacement);
    return text.replace(/\s{2,}/g, " ").trim();
  }

  function normalizeTextNode(node) {
    const current = String(node.nodeValue || "");
    if (!current.trim()) return;
    const leading = (current.match(/^\s*/) || [""])[0];
    const trailing = (current.match(/\s*$/) || [""])[0];
    const next = `${leading}${normalizeMongolianDomainCopyText(current)}${trailing}`;
    if (next !== current) node.nodeValue = next;
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
    const elements = rootElement.querySelectorAll ? [rootElement, ...rootElement.querySelectorAll("*")] : [rootElement];
    elements.forEach(element => {
      ["placeholder", "title", "aria-label", "alt"].forEach(name => {
        if (!element.hasAttribute || !element.hasAttribute(name)) return;
        const current = element.getAttribute(name);
        const next = normalizeMongolianDomainCopyText(current);
        if (next !== current) element.setAttribute(name, next);
      });
    });
  }

  function installMongolianDomainNormalizer(options = {}) {
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
    observer.observe(target, { childList: true, subtree: true, characterData: true });
    return observer;
  }

  function remainingLatinWords(value) {
    const allowed = new Set(["QPay", "PDF"]);
    const matches = String(value || "").match(/[A-Za-z][A-Za-z-]*/g) || [];
    return [...new Set(matches.filter(word => !allowed.has(word)))];
  }

  return Object.freeze({
    normalizeMongolianDomainCopyText,
    normalizeElement,
    installMongolianDomainNormalizer,
    remainingLatinWords
  });
});

if (typeof window !== "undefined" && window.MongolianDomainNormalizer) {
  const install = () => window.MongolianDomainNormalizer.installMongolianDomainNormalizer();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
}
