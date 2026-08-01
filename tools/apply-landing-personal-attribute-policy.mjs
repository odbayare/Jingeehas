import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dedicatedRegression = path.join(root, "tests", "landing-personal-attribute-policy.test.js");

const replacements = Object.freeze([
  [
    'Жин хасахад саад болж буй шалтгаанаа тань',
    'Жин хасах оролдлогод нөлөөлдөг хэв маягаа таних'
  ],
  [
    'Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?',
    'Жин хасах оролдлого яагаад тогтвортой үргэлжлэхгүй байдгийг ойлгоход туслах тест үнэлгээ'
  ],
  [
    'aria-label="Танд танил байж болох нөхцөлүүд"',
    'aria-label="Жин хасах оролдлогод нөлөөлж болох нийтлэг хүчин зүйлс"'
  ],
  [
    'Илүүдэл жин тань таны санааг байнга зовоодог уу?',
    'Стресс, ядаргаа, нойрны хэмнэл хооллолтын шийдвэрт нөлөөлж болно.'
  ],
  [
    'Янз бүрийн дасгал хөдөлгөөн туршсан ч өөрчлөлт бага байна уу?',
    'Хэт хатуу дэглэмийг удаан хугацаанд тогтвортой үргэлжлүүлэхэд хэцүү байж болно.'
  ],
  [
    'Тураах бэлдмэл, хоолны дэглэм хэрэглэсэн ч үр дүн нь хангалтгүй эсвэл удаан тогтдоггүй юу?',
    'Орчин, цагийн хуваарь болон автомат зуршил давтагдсан саад үүсгэж болно.'
  ],
  [
    'Жин хасахад зөвхөн хоол, дасгал биш — таны сэтгэлзүйн хэв маяг, далд зуршил хүчтэй нөлөөлдөг.',
    'Жин хасах оролдлогод хоол, хөдөлгөөнөөс гадна сэтгэлзүйн хэв маяг, өдөр тутмын зуршил болон орчин нөлөөлж болно.'
  ],
  [
    'Өөрт тань саад болж буй сэтгэлзүйн шалтгааныг эхлээд ойлгож чадвал жин хасах арга барилаа илүү бодитой, өөртөө тохирсон, тогтвортой сонгоход хялбар болно.',
    'Энэхүү үнэлгээ нь давтагддаг хэв маяг, өдөр тутмын нөхцөл болон орчны нөлөөг эргэцүүлж, өөрт тохирсон тогтвортой арга барилаа сонгоход тусална.'
  ],
  [
    'Эмнэлгийн онош тавихгүй. Таны хариултаас давтагдаж буй хэв маягийг таньж ойлгоход тусална.',
    'Эмнэлгийн болон сэтгэлзүйн онош тавихгүй. Хариултад тулгуурласан өөрийгөө ойлгох үнэлгээ.'
  ]
]);

function replaceExact(source, file, requireEveryReplacement = false) {
  let output = source;
  for (const [before, after] of replacements) {
    const count = output.split(before).length - 1;
    if (requireEveryReplacement && count !== 1) {
      throw new Error(`LANDING_POLICY_SOURCE_MATCH_INVALID:${path.relative(root, file)}:${before}:${count}`);
    }
    if (count > 0) output = output.split(before).join(after);
  }
  return output;
}

function testFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...testFiles(absolute));
    else if (/\.(?:js|mjs)$/.test(entry.name) && absolute !== dedicatedRegression) files.push(absolute);
  }
  return files;
}

const appPath = path.join(root, "app.js");
const appBefore = fs.readFileSync(appPath, "utf8");
const alreadyApplied = replacements.every(([, after]) => appBefore.includes(after));
const oldCopyRemaining = replacements.some(([before]) => appBefore.includes(before));

if (alreadyApplied && !oldCopyRemaining) {
  console.log("Landing personal-attribute policy copy already applied");
  process.exit(0);
}

const appAfter = replaceExact(appBefore, appPath, true);
fs.writeFileSync(appPath, appAfter);

let updatedTests = 0;
for (const file of testFiles(path.join(root, "tests"))) {
  const before = fs.readFileSync(file, "utf8");
  const after = replaceExact(before, file, false);
  if (after !== before) {
    fs.writeFileSync(file, after);
    updatedTests += 1;
  }
}

for (const [before, after] of replacements) {
  if (appAfter.includes(before)) throw new Error(`LANDING_POLICY_OLD_COPY_REMAINS:${before}`);
  if (!appAfter.includes(after)) throw new Error(`LANDING_POLICY_NEW_COPY_MISSING:${after}`);
}

console.log(JSON.stringify({ status: "APPLIED", appReplacements: replacements.length, updatedTests }));
