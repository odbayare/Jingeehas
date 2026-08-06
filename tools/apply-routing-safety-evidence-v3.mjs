import fs from "node:fs";
import path from "node:path";

function listJavaScriptFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listJavaScriptFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(absolute);
  }
  return files;
}

function replaceAll(source, replacements) {
  let output = source;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

function patchFile(file, replacements) {
  if (!fs.existsSync(file)) return false;
  const before = fs.readFileSync(file, "utf8");
  const after = replaceAll(before, replacements);
  if (after === before) return false;
  fs.writeFileSync(file, after);
  return true;
}

const APP_REPLACEMENTS = Object.freeze([
  [
    'const EXCLUSIVE = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй", "Одоогоор ямар нэг арга хэрэглээгүй", "Ямар нэг арга хэрэглэж үзээгүй", "Мэргэжлийн дэмжлэг аваагүй", "Тодорхой саад байгаагүй"]);',
    'const EXCLUSIVE = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй", "Одоогоор ямар нэг арга хэрэглээгүй", "Ямар нэг арга хэрэглэж үзээгүй", "Мэргэжлийн дэмжлэг аваагүй", "Тодорхой хоол байхгүй", "Тодорхой хоол анзаараагүй", "Тодорхой саад байгаагүй"]);'
  ],
  [
    'const BRANCH_PREFIXES = Object.freeze({ "Q-SEX": ["MC-", "PREG-", "MENO-"], "MC-GATE": ["MC-"], "ALC-GATE": ["ALC-"], "TOB-GATE": ["TOB-"], "PREG-GATE": ["PREG-"], "Q-METHOD-PAST": ["Q-METHOD-LONGEST", "Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN", "Q-METHOD-SUPPORT", "Q-METHOD-MEDICATION"] });',
    'const BRANCH_PREFIXES = Object.freeze({ "Q-SEX": ["MC-", "PREG-", "MENO-"], "MC-GATE": ["MC-"], "ALC-GATE": ["ALC-"], "TOB-GATE": ["TOB-"], "PREG-GATE": ["PREG-"], "S1-S03": ["S1-S03-TYPE", "S1-S03-FREQUENCY"], "S1-S04": ["S1-S04-NOW"], "Q-METHOD-RESULT": ["Q-METHOD-REGAIN"], "Q-METHOD-PAST": ["Q-METHOD-LONGEST", "Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN", "Q-METHOD-SUPPORT", "Q-METHOD-MEDICATION", "OPEN-PAST"] });'
  ],
  [
    'const question = questionApi.questionById(input.dataset.question); if (!question) return;',
    'const question = questionApi.questionById(input.dataset.question, state.questionnaireVersion); if (!question) return;'
  ],
  [
    'Бүрэн тайлангаа нээснээр жин хасахад тань хэдэн сэтгэл зүйн болон зан үйлийн хэв маяг нөлөөлж байгааг, тэдгээр нь хоорондоо хэрхэн холбогдож, бие биеэ хүчтэй болгон жин хасах зорилгод тань хэрхэн саад болж байгааг мэдэж авна.',
    'Бүрэн тайлангаас таны хариултад тулгуурлан илэрсэн сэтгэл зүйн болон зан үйлийн хэв маяг, тэдгээрт нөлөөлж буй өдөр тутмын нөхцөл, эхэлж хэрэгжүүлэх бодит алхмуудаа харна. Хэд хэдэн хэв маяг зэрэг илэрсэн бол тэдгээрийн уялдаа холбоог мөн тайлбарлана.'
  ],
  [
    'Мөн эдгээр хэв маягийг хэрхэн удирдах, хэцүү үеийг хэрхэн даван туулах болон эхэлж хэрэгжүүлэх 3 алхмын зааварчилгааг авна.',
    'Мөн төлөвлөгөө алдагдсан үед хэрхэн хэвийн үргэлжлүүлэх, өөрөөсөө юуг хэтрүүлэн шаардахгүй байх талаар тодорхой зөвлөмж авна.'
  ],
  [
    'Даван туулах аргаа ойлгосноор сэтгэлзүй болон зуршлаа удирдахад илүү хялбар болно.',
    'Тайлан нь сэтгэл хөдлөл, дадал зуршил болон орчны нөлөөгөө илүү тод анзаарч, тохирох нэг алхмаас эхлэхэд тань тусална.'
  ],
  [
    'Ямар хэв маяг нөлөөлж байгааг мэдэх нь зөвхөн эхний алхам. Бүрэн тайлангаас эдгээр хэв маяг ямар үед хүчтэй болдог, хоорондоо хэрхэн нөлөөлдөг болон жин хасах оролдлогыг тань яаж хүндрүүлдэг байж болохыг мэдэж авна.',
    'Бүрэн тайлангаас таны хариултад тулгуурлан илэрсэн хэв маяг, өдөр тутмын нөхцөл болон эхэлж хэрэгжүүлэх бодит алхмуудаа харна. Хэд хэдэн хэв маяг зэрэг илэрсэн бол тэдгээрийн уялдаа холбоог мөн тайлбарлана.'
  ],
  [
    'Мөн тухайн үед юу хийж болох, сэтгэл хөдлөл, зуршил, идэх хүсэл болон орчны нөлөөг хэрхэн удирдах талаар таны хариултад тулгуурласан тодорхой заавар авна.',
    'Мөн сэтгэл хөдлөл, идэх хүсэл, дадал зуршил болон орчны нөлөөг хэрхэн анзаарч, удирдах талаар таны хариултад нийцсэн зөвлөмж авна.'
  ],
  [
    'Даван туулах аргаа ойлгосноор жин хасахад саад болж буй сэтгэл зүйн хэв маягаа анзаарч, удирдахад илүү хялбар болно. Ингэснээр жин хасах зорилгодоо илүү ойлгомжтой, тогтвортой ажиллах боломжтой болно.',
    'Тайлан нь танд нөлөөлж буй нөхцөлийг ойлгож, өөрт тохирох нэг алхмаас эхлэхэд тусална.'
  ],
  [
    'Хэв маягуудын нэр, уялдаа холбооноос гадна тэдгээрийн нөлөөг багасгах, сэтгэл хөдлөл болон зуршлаа удирдах, хэцүү үеийг даван туулах аргуудаа авна.',
    'Илэрсэн хэв маяг, өдөр тутмын нөхцөл болон төлөвлөгөө алдагдсан үед хэвийн үргэлжлүүлэх аргаа харна.'
  ]
]);

const FUNCTION_REPLACEMENTS = Object.freeze([
  ["Нойр дутуу эсвэл тасалдсан өдөр", "Нойрны хугацаа богино эсвэл чанар тааруу өдөр"],
  ["Нойр дутуу эсвэл тасалдсан үед", "Нойрны хугацаа богино эсвэл чанар тааруу үед"],
  ["бодож төлөвлөх тэнхээ оройдоо багасдаг", "бодож төлөвлөх, бэлтгэх тэнхээ багасч болзошгүй"],
  ["оройн ядаргаа", "ядаргаа"],
  ["оройн хоол", "хоол"],
  ["оройн яарсан сонголт", "яарсан сонголт"],
  ["маргааш ядарсан үед хамгийн ойр байгаа хоолыг яаран сонгох эрсдэлийг", "ядарсан үед бэлтгэл бага шаарддаг сонголтыг яаран хийх эрсдэлийг"],
  [
    'const noRegainAfterSuccess = answerMap["Q-METHOD-REGAIN"] === "Үгүй"',
    'const noRegainAfterSuccess = ["Үгүй", "Цааш буурсан", "Тогтвортой байсан"].includes(answerMap["Q-METHOD-REGAIN"])'
  ],
  [
    'pregnancy_followup: (evidence.contexts || []).filter(row => row.questionId === "PREG-GATE" && row.guidanceOnly && row.effect > 0),',
    'pregnancy_followup: (evidence.contexts || []).filter(row => ["PREG-GATE", "PREG-BREASTFEEDING"].includes(row.questionId) && row.guidanceOnly && row.effect > 0),'
  ],
  [
    'reproductive_followup: (evidence.contexts || []).filter(row => ["MC-01", "PREG-GATE"].includes(row.questionId) && row.guidanceOnly && row.effect > 0)',
    'reproductive_followup: (evidence.contexts || []).filter(row => ["MC-01", "PREG-GATE", "PREG-BREASTFEEDING"].includes(row.questionId) && row.guidanceOnly && row.effect > 0)'
  ]
]);

export function applyRoutingSafetyEvidenceV3(root) {
  const appTargets = [path.join(root, "app.js"), path.join(root, "site", "app.js")];
  const functionRoot = path.join(root, "netlify", "functions");
  for (const app of appTargets) patchFile(app, APP_REPLACEMENTS);
  for (const file of listJavaScriptFiles(functionRoot)) patchFile(file, FUNCTION_REPLACEMENTS);
}