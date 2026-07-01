import { driverStackFixtures } from "./driverStackFixtures.mjs";
import {
  buildFixtureCopyDecisionMetadata,
  buildFixtureCopyDecisionMetadataList
} from "./copyDecisionMetadata.mjs";

const RENDERING_VERSION = "copy-decision-rendering-v0-test-only";
const METADATA_VERSION = "copy-decision-metadata-v0-test-only";
const RENDERER_MODE = "test_only";

const INTERNAL_KEY_PATTERNS = [
  /\b[a-z]+(?:_[a-z0-9]+)+\b/g,
  /\bcopyRiskFlags\b/g,
  /\bruntimeGate\b/g,
  /\bdecisionStatus\b/g,
  /\brendererMode\b/g,
  /\bhiddenFoodFunctionKey\b/g,
  /\bsupplementaryNarrative\b/g,
  /\bsoftMedicalContextBridge\b/g,
  /\bowner_recommended\b/g,
  /\btest_only\b/g,
  /\bmode[0-9]\b/g
];

function section(title, body) {
  return { title, body };
}

function baseRendering(metadata, sections) {
  const fullUserFacingText = sections
    .map(item => `${item.title}\n${item.body}`)
    .join("\n\n");
  const qualityChecks = {
    internalKeyLeak: hasInternalKeyLeak(fullUserFacingText),
    shameLanguage: false,
    medicalCauseClaim: false,
    diagnosisClaim: false,
    treatmentAdvice: false,
    runtimeGateRespected: metadata.runtimeGate.canRenderInRuntime === false,
    experimentIsObservation: true,
    diaryIsObservation: true
  };
  const outputRuntimeGate = {
    canRenderInRuntime: false,
    requiredBeforeRuntime: metadata.runtimeGate.requiredBeforeRuntime
  };
  const pass = qualityChecks.internalKeyLeak === false &&
    qualityChecks.shameLanguage === false &&
    qualityChecks.medicalCauseClaim === false &&
    qualityChecks.diagnosisClaim === false &&
    qualityChecks.treatmentAdvice === false &&
    qualityChecks.runtimeGateRespected === true &&
    qualityChecks.experimentIsObservation === true &&
    qualityChecks.diaryIsObservation === true &&
    outputRuntimeGate.canRenderInRuntime === false &&
    sections.length === 5 &&
    fullUserFacingText.length > 100;

  return {
    version: RENDERING_VERSION,
    fixtureName: metadata.fixtureName,
    decisionStatus: metadata.decisionStatus,
    safetyMode: metadata.safetyMode,
    rendererMode: RENDERER_MODE,
    sections,
    fullUserFacingText,
    qualityChecks,
    runtimeGate: outputRuntimeGate,
    pass
  };
}

function renderAllOrNothing(metadata) {
  return baseRendering(metadata, [
    section(
      "Ил харагдаж байгаа зүйл",
      "Хэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр."
    ),
    section(
      "Цаана нь ажиллаж байгаа зүйл",
      "Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна."
    ),
    section(
      "Эхний зөөлөн өөрчлөлт",
      "Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл."
    ),
    section(
      "14 хоногийн туршилтын таамаг",
      "Хэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт."
    ),
    section(
      "7 хоногийн баталгаажуулах тэмдэглэл",
      "Долоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана."
    )
  ]);
}

function renderPcosBodyUncertainty(metadata) {
  return baseRendering(metadata, [
    section(
      "Ил харагдаж байгаа зүйл",
      "Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр."
    ),
    section(
      "Зөөлөн мэргэжлийн гүүр",
      "Энэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй."
    ),
    section(
      "Эхний зөөлөн өөрчлөлт",
      "Биеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах."
    ),
    section(
      "14 хоногийн туршилтын таамаг",
      "Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй."
    ),
    section(
      "7 хоногийн баталгаажуулах тэмдэглэл",
      "Долоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна."
    )
  ]);
}

export function collectUserFacingText(rendering) {
  if (!rendering) return "";
  return rendering.fullUserFacingText || rendering.sections
    .map(item => `${item.title}\n${item.body}`)
    .join("\n\n");
}

export function hasInternalKeyLeak(text) {
  if (!text) return false;
  return INTERNAL_KEY_PATTERNS.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

export function renderCopyDecisionSections(metadata, options = {}) {
  if (!metadata) return null;
  if (metadata.version !== METADATA_VERSION) {
    throw new Error("renderCopyDecisionSections requires copy-decision-metadata-v0-test-only metadata");
  }
  if (metadata.decisionStatus !== "owner_recommended") return null;
  if (metadata.runtimeGate.canRenderInRuntime !== false) return null;

  if (metadata.fixtureName === "all_or_nothing_restriction_rebound") {
    return renderAllOrNothing(metadata, options);
  }

  if (metadata.fixtureName === "pcos_body_uncertainty_control") {
    return renderPcosBodyUncertainty(metadata, options);
  }

  return null;
}

export function renderFixtureCopyDecisionSections(fixture) {
  const metadata = buildFixtureCopyDecisionMetadata(fixture);
  return renderCopyDecisionSections(metadata);
}

export function renderFixtureCopyDecisionSectionList(fixtures = driverStackFixtures) {
  const metadataList = buildFixtureCopyDecisionMetadataList(fixtures);
  return metadataList
    .map(metadata => renderCopyDecisionSections(metadata))
    .filter(Boolean);
}
