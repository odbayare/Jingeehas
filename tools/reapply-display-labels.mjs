import fs from "node:fs";
import path from "node:path";

const DISPLAY_LABEL_FROM = '"Будилах": "Ухаан санаа будилах"\n  };';
const DISPLAY_LABEL_TO = '"Будилах": "Ухаан санаа будилах",\n    "Мэргэжлийн хоолзүйчийн зөвлөгөө": "Мэргэжлийн хоол зүйчийн зөвлөгөө",\n    "Сэтгэлзүйн зөвлөгөө": "Сэтгэл зүйн зөвлөгөө",\n    "Хоолзүйч": "Хоол зүйч",\n    "Сэтгэлзүйч": "Сэтгэл зүйч"\n  };';

export function reapplyDisplayOnlyLabels(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes('"Мэргэжлийн хоолзүйчийн зөвлөгөө": "Мэргэжлийн хоол зүйчийн зөвлөгөө"')) continue;
    if (!source.includes(DISPLAY_LABEL_FROM)) throw new Error(`Display-only label restoration point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(DISPLAY_LABEL_FROM, DISPLAY_LABEL_TO));
  }
}
