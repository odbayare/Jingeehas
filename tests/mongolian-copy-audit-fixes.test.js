const assert = require("assert");
const app = require("../app.js");
const normalizer = require("../mongolian-copy-normalizer.js");
const domainNormalizer = require("../mongolian-copy-domain-normalizer.js");

const { _internal } = app;
const { CANONICAL_COPY, normalizeMongolianCopyText, auditForbiddenTerms } = normalizer;
const { normalizeMongolianDomainCopyText, remainingLatinWords } = domainNormalizer;

function normalizeCopy(value) {
  return normalizeMongolianDomainCopyText(normalizeMongolianCopyText(value));
}

function normalizeHtml(html) {
  return normalizeCopy(
    String(html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function assertClean(input, expected) {
  const output = normalizeCopy(input);
  assert.strictEqual(output, expected);
  assert.deepStrictEqual(auditForbiddenTerms(output), [], `mixed-language term remained in: ${output}`);
  assert.deepStrictEqual(remainingLatinWords(output), [], `Latin term remained in: ${output}`);
}

function run() {
  assertClean(
    "Body attention discomfort болон shame avoidance feedback-ээс зугтах cycle үүсгэж байна.",
    "Биедээ анхаарал хандуулахад эвгүйрхэх, буруутгагдахаас зайлсхийх мэдрэмж давтагдаж, тэмдэглэхээс ухрах тойрог үүсэж байна."
  );
  assertClean(
    "Delivery, snack харагдах, үнэр, social cue идэлт эхлүүлж байгаа эсэхийг ажиглана.",
    "Хүргэлт, зууш харагдах, үнэр, хамтын орчны дохио идэлтийг эхлүүлж байгаа эсэхийг ажиглана."
  );
  assertClean(
    "Guilt/shame, tracking-ээс зугтах, нуух behavior cycle-г үргэлжлүүлж байгаа эсэхийг ажиглана.",
    "Буруутгал, ичгүүр, тэмдэглэхээс зайлсхийх, нуух зан үйлийн тойрог үргэлжилж байгаа эсэхийг ажиглана."
  );
  assertClean(
    "Reward signal байгаа ч role overload/self-neglect evidence илүү тод давтагдсан.",
    "Өөрийгөө баярлуулах дохио байгаа ч үүргийн хэт ачаалал, өөрийгөө орхигдуулах нотолгоо илүү тод давтагдсан."
  );
  assertClean(
    "Stress signal байсан ч diary дээр low-energy/default evidence илүү хүчтэй давтагдсан.",
    "Стрессийн дохио байсан ч тэмдэглэлд тэнхээ багасах, амар сонголт руу орох нотолгоо илүү хүчтэй давтагдсан."
  );
  assertClean(
    "Social pressure болон өөрөө сонгох хэрэгцээ хоорондоо мөргөлдөж байна.",
    "Хамтын дарамт, өөрөө сонгох хэрэгцээ хоёр хоорондоо мөргөлдөж байна."
  );
  assertClean(
    "Body-neutral, private tracking турших.",
    "Биеийг үнэлэхгүй, хувийн байдлаар тэмдэглэхийг туршаарай."
  );
  assertClean(
    "Cue дүүрэн орчинд зөвхөн willpower шаардах.",
    "Дохио ихтэй орчинд зөвхөн хүсэл зоригоор тэсэхийг шаардах."
  );
  assertClean(
    "aggressive weight-loss plan эхлэх",
    "огцом жин хасах хөтөлбөр эхлэх"
  );
  assertClean(
    "Undesired default-ийг нэг алхам холдуулж, desired default-ийг нэг алхам ойртуулах.",
    "Хүсээгүй амар сонголтыг нэг алхам холдуулж, хүссэн сонголтыг нэг алхам ойртуулаарай."
  );

  assert.strictEqual(normalizeCopy("Нэг удаагийн гүн анализ"), "Нэг удаагийн гүн зураглал");
  assert.strictEqual(normalizeCopy("7 хоногийн гүн анализ"), "7 хоногийн гүн зураглал");
  assert.strictEqual(normalizeCopy("Coach-ийн нэр"), "Зөвлөхийн нэр");
  assert.strictEqual(normalizeCopy("coach-ийн урилга"), "зөвлөхийн урилга");
  assert.strictEqual(normalizeCopy("QPay нэхэмжлэл үүсэх нь төлбөр биш."), "QPay нэхэмжлэл үүссэнээр төлбөр төлөгдсөнд тооцохгүй.");

  const researchCopy = normalizeCopy([
    "BCT — зан үйлийн өөрчлөлтийн аргачлал",
    "CBT — танин мэдэхүй-зан үйлийн хандлага",
    "Emotional Eating — стресс ба сэтгэл хөдлөлийн идэлт",
    "Habit Loop — дадал, өдөөгч, хариу үйлдлийн давталт",
    "Environmental Cue Analysis — орчны өдөөгч хүчин зүйлс",
    "Self-Monitoring — өөрийгөө ажиглах, хэв маягаа тэмдэглэх арга",
    "Sleep / Rhythm / Recovery — унтах хэмнэл, энерги, сэргэлтийн ажиглалт",
    "Safety-First Screening — мэргэжлийн зөвлөгөө шаардлагатай байж болох дохиог ялгах шалгуур"
  ].join("\n"));
  assert.deepStrictEqual(remainingLatinWords(researchCopy), []);

  const polite = normalizeCopy("Энд тав. Нэгийг сонго. Өдөр бүр тэмдэглэ.");
  assert.strictEqual(polite, "Энд тавиарай. Нэгийг сонгоорой. Өдөр бүр тэмдэглээрэй.");

  const punctuation = normalizeCopy(
    "хугацаа амлахад хангалтгүй байна. өдөр тутмын мэдээлэл бага байна Үүн дээр Хоол харагдах нөхцөл давтагдаж байна;дараа нь тэмдэглэнэ."
  );
  assert(punctuation.includes("байна. Өдөр тутмын"));
  assert(punctuation.includes("байна. Үүн дээр"));
  assert(punctuation.includes("байна; дараа"));

  const safety = normalizeCopy(
    "Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна."
  );
  assert.strictEqual(safety, CANONICAL_COPY.safetyBody);

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-C02": "Эмэгтэй",
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {}
  });

  assert.strictEqual(_internal.reportMode().mode, "urgent", "S1-S04 active answer must route to urgent Mode 4");
  const urgentReport = normalizeHtml(_internal.renderReport());
  assert(urgentReport.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(urgentReport.includes(CANONICAL_COPY.urgentHeading));
  assert(urgentReport.includes("Ганцаараа бүү үлдээрэй"));
  assert(!urgentReport.includes("14 хоногийн туршилт"));

  const visibleSamples = [
    _internal.renderLanding(),
    _internal.renderAbout(),
    _internal.renderChoice(),
    _internal.renderOneTimeStart(),
    _internal.renderReport()
  ].map(normalizeHtml).join("\n");

  assert.deepStrictEqual(
    auditForbiddenTerms(visibleSamples),
    [],
    "normalized rendered surfaces must not retain audited English or mixed terminology"
  );
  assert.deepStrictEqual(
    remainingLatinWords(visibleSamples),
    [],
    "normalized rendered surfaces must not retain Latin words except the QPay and PDF brand/format names"
  );
}

run();
console.log("mongolian-copy-audit-fixes tests passed");
