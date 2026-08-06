import fs from "node:fs";
import path from "node:path";

const OLD_SLEEP_EMOTION = "Ядарсан үед төлөвлөсөн сонголтоо барихад хэцүү болж болно. Хэрэв хоол тухайн мөчид түр амсхийх мэт мэдрэмж өгдөг бол стрессийн шалтгаан хэвээр үлдэхэд идэх хүсэл дахин төрж болно.";
const NEW_SLEEP_EMOTION = "Ядаргаа болон стрессийн үеийн идэх хүсэл давхцвал төлөвлөсөн сонголтоо барихад хэцүү болж, хоолыг түр амсхийх арга болгон сонгох магадлал нэмэгдэж болзошгүй.";

export function applyReportBuilderSemanticV1InteractionCopy(root) {
  const reportCopyPath = path.join(root, "netlify", "functions", "_lib", "report-copy.js");
  const source = fs.readFileSync(reportCopyPath, "utf8");
  if (source.includes(NEW_SLEEP_EMOTION)) return;
  if (!source.includes(OLD_SLEEP_EMOTION)) throw new Error("Sleep-emotion interaction copy insertion point missing");
  fs.writeFileSync(reportCopyPath, source.replace(OLD_SLEEP_EMOTION, NEW_SLEEP_EMOTION));
}
