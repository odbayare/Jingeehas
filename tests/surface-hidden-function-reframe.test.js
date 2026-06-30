const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function render(stageAnswers = {}) {
  _internal.setTestState({
    packageType: "one-time",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: true,
    upgradePaid: true,
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    diaryEntries: [],
    preliminary: []
  });
  return normalize(_internal.renderReport());
}

function assertSurfaceHidden(report) {
  assert(report.includes("Ил харагдаж байгаа зүйл"), "ordinary report should name visible context");
  assert(report.includes("Цаана нь ажиллаж байгаа зүйл"), "ordinary report should name hidden function");
}

function assertNoDeterministicMedicalCopy(report) {
  [
    "энэ бол PCOS",
    "даавраас болж байна",
    "эмээс болсон",
    "зөвхөн нойрноос",
    "зөвхөн мөчлөгөөс"
  ].forEach(phrase => assert(!report.includes(phrase), `report should not contain deterministic copy: ${phrase}`));
}

function run() {
  const medication = render({
    "S1-W02": ["Эм"],
    "S1-W04": ["Калори тоолох"],
    "S1-W06": "Маргааш илүү чанга барина",
    "S1-V01": "Эмийн хэрэглээ эхэлснээс хойш бие өөрчлөгдсөн мэт санагдаад хяналтаа алдсан юм шиг болж илүү чанга барих гэж оролддог."
  });
  assertSurfaceHidden(medication);
  assert(/эмийн хэрэглээ|эм эсвэл жирэмслэлтээс хамгаалах бэлдмэл/i.test(medication));
  assert(medication.includes("Эмийн хэрэглээ, даралт, хоолны дуршлын өөрчлөлт нь шалгаж үзэх зүйл байж болно."));
  assert(!medication.includes("PCOS сэжиг"));
  assert(/хяналтаа алдаж байна|бие өөрчлөгдөх|өөрийгөө буруутгах|хэт чанга/.test(medication));
  assert(!medication.includes("Та эмийн хэрэглээ нөлөөлж байгаа гэж анзаарсан байна. Энэ нь бодит нөлөө байж болно."));
  assert(!medication.includes("Гэхдээ энэ тайлангийн гол нь зөвхөн эмийн хэрэглээ биш."));
  assertNoDeterministicMedicalCopy(medication);

  const menstrual = render({
    "MC-GATE": "Тийм, хамаарна",
    "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
    "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг"],
    "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"]
  });
  assertSurfaceHidden(menstrual);
  assert(menstrual.includes("сарын тэмдэг ирэхийн өмнөх хэдэн өдөр"));
  assert(/зөөллөх|өөрийгөө буруутгахгүй|амрах/.test(menstrual));
  assertNoDeterministicMedicalCopy(menstrual);

  const shiftWork = render({
    "S1-W02": ["Нойр муудсан", "Ажлын цаг өөрчлөгдсөн"],
    "S1-N01": "4-6 цаг",
    "S1-F01": ["Ядарсан", "Амттай юм идмээр байсан"],
    "S1-V01": "Шөнийн ээлжийн дараа нойр тасалдаад эмнэлгийн цайны газар эсвэл ойр дэлгүүрийн бэлэн хоол амрах, өөрийгөө жаахан шагнах хамгийн ойрын арга болдог."
  });
  assertSurfaceHidden(shiftWork);
  assert(shiftWork.includes("шөнийн ээлж"));
  assert(shiftWork.includes("ээлжийн дараа"));
  assert(/ойр дэлгүүр|цайны газар|бэлэн хоол/.test(shiftWork));
  assert(/амрах|шагнах|тэнхээ/.test(shiftWork));
  assert(!shiftWork.includes("Нойр муу өдөр орой амттай юм илүү хүчтэй татдаг."));
  assertNoDeterministicMedicalCopy(shiftWork);

  const remoteCue = render({
    "S1-H02": "Ихэвчлэн үгүй",
    "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"],
    "S1-R02": ["Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад"],
    "S1-V01": "Гэрээс ажиллахад гал тогоо ойр байдаг. Ширээн дээр зууш байвал өлсөөгүй ч аваад идчихдэг."
  });
  assertSurfaceHidden(remoteCue);
  assert(remoteCue.includes("Гэрээс ажиллах үед зууш, апп, зураг нүдэнд ойр байна."));
  assert(remoteCue.includes("Гарын дор байгаа зүйлд бараг бодолгүй хүрдэг үе хүчтэй байна."));
  assert(!remoteCue.includes("толь, зураг, бусдад харагдах орчин"));
  assert(!remoteCue.includes("Та гэрээс ажиллах үед зууш, хоол, апп, зураг нүдэнд ойр байдаг нөлөөлж байгаа гэж анзаарсан байна."));

  const postpartum = render({
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
    "S1-F01": ["Өөрийгөө жаахан шагнамаар санагдсан", "Ядарсан"],
    "S1-V01": "Төрсний дараах үе, хүүхэд асрах, тасалдсан нойр давхцаад өөрийн хоол хамгийн сүүлд үлддэг. Орой надад ч гэсэн анхаарал хэрэгтэй гэж мэдрэгддэг."
  });
  assertSurfaceHidden(postpartum);
  assert(postpartum.includes("хүүхэд"));
  assert(postpartum.includes("тасалдсан нойр"));
  assert(postpartum.includes("өөрийн хоол"));
  assert(postpartum.includes("анхаарал хэрэгтэй"));
  assert(!/мацаг|огцом хязгаарлалт эхлүүлэх/.test(postpartum), "postpartum report should not recommend aggressive restriction");

  const social = render({
    "S1-V01": "Амралтын өдөр найзуудтай уулзахад архи, оройн хоол хамт орж ирдэг. Хүмүүсийн дунд татгалзах эвгүй санагддаг.",
    "S1-F01": ["Татгалзах эвгүй байсан"],
    "S1-R02": ["Ажлын дараах амралт"]
  });
  assertSurfaceHidden(social);
  assert(/татгалзах эвгүй|хүмүүсийн дунд/.test(social));
  assert(!social.includes("Зууш нүдэнд ойр"));
  assert(social.includes("Гарахаасаа өмнө хэлэх нэг богино татгалзах өгүүлбэрээ бэлд"));

  const perimenopause = render({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Тийм, хамаарна",
    "MC-01": "Заримдаа зөрдөг",
    "MC-06": "Перименопауз байж магадгүй",
    "S1-F01": ["Амттай юм идмээр байсан", "Тайвширмаар байсан"],
    "S1-V01": "Перименопауз байж магадгүй, мөчлөг зөрөөд нойр муудаж бие өөрчлөгдөж байгаа мэт санагдахаар хяналтаа алдсан юм шиг болдог."
  });
  assertSurfaceHidden(perimenopause);
  assert(/хяналтаа алдаж байна|бие өөрчлөгдөж/.test(perimenopause));
  assert(perimenopause.includes("Мөчлөг, нойр, биеийн өөрчлөлт нь шалгаж үзэх зүйл байж болно."));
  assert(perimenopause.includes("Мөчлөг тогтмол бус үед"));
  assert(!perimenopause.includes("PCOS сэжиг"));
  assert(!perimenopause.includes("Эмийн хэрэглээ, даралт"));
  assert(!perimenopause.includes("Сарын тэмдэг ирэхийн өмнөх өдрүүдэд Хэт хатуу"));
  assert(!perimenopause.includes("Стресс ихтэй үед хоол түр амрах газар шиг санагдаж байна."));

  const pcos = render({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Тийм, хамаарна",
    "MC-01": "Ихэнхдээ тогтмол биш",
    "MC-06": "PCOS оноштой эсвэл сэжигтэй",
    "S1-W06": "Маргааш илүү чанга барина",
    "S1-F01": ["Амттай юм идмээр байсан", "Ядарсан"],
    "S1-V01": "PCOS байж магадгүй гэж санаа зовдог. Мөчлөг тогтмол бус болохоор бие урьдчилж таахад хэцүү, хяналтаа буцааж авах гэж хэт чанга дэглэм эхлүүлдэг."
  });
  assertSurfaceHidden(pcos);
  assert(pcos.includes("PCOS сэжиг, мөчлөг тогтмол бус байдал нь шалгаж үзэх зүйл байж болно."));
  assert(pcos.includes("Мөчлөг тогтмол бус үед"));
  assert(!pcos.includes("Эм, даралт"));
  assert(!pcos.includes("Эмийн хэрэглээ, даралт"));
  assert(!pcos.includes("Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"));

  const gym = render({
    "S1-W04": ["Мацаг", "Орой хоол идэхгүй"],
    "S1-F01": ["Өлссөндөө идсэн", "Дараа өлсөхөөс санаа зовсон"],
    "S1-V01": "Дасгал challenge эхлээд нүүрс ус хассан. Өлсөх тусам зөв явж байна гэж бодоод орой бие хамгаалах шиг хэт өлсдөг."
  });
  assertSurfaceHidden(gym);
  assert(/Өлсөх тусам зөв явж байна|сахилга бат/.test(gym));
  assert(/бие орой|оройн өлсөлт/.test(gym));

  const collapseWithoutGym = render({
    "S1-W03": "Бараг бүх оролдлогоос хойш",
    "S1-W04": ["Калори тоолох", "Мацаг"],
    "S1-W06": "Одоо бүх юм дууссан",
    "S1-X01": "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог",
    "S1-X03": "Маш хүчтэй",
    "S1-F02": "Одоо бүх юм дууссан"
  });
  assert(!collapseWithoutGym.includes("хүчтэй дасгал"));

  const professional = render({ "S1-S03": "Одоо давтагддаг" });
  assert(professional.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(!professional.includes("Ил харагдаж байгаа зүйл"));

  const urgent = render({ "S1-S04": "Одоо идэвхтэй бодогдож байна" });
  assert(urgent.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(!urgent.includes("Ил харагдаж байгаа зүйл"));
}

run();
console.log("surface-hidden-function-reframe tests passed");
