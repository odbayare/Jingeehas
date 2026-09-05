import fs from "node:fs";
import path from "node:path";

const HELPER = `function questionOptionLabel(question, option) {
  const common = {
    "Хариулахгүй байхыг хүсэж байна": "Хариулахгүй",
    "Тодорхой биш": "Тодорхойгүй",
    "Будилах": "Ухаан санаа будилах"
  };
  if (question.id === "Q-HUNGER") return ({
    "Амар": "Өлсөж эхлэх үедээ",
    "Заримдаа анзаардаг": "Заримдаа оройтож",
    "Хэт өлссөний дараа анзаардаг": "Ихэвчлэн хэт өлссөний дараа"
  })[option] || common[option] || option;
  if (question.id === "Q-SLEEP-DURATION") return ({
    "4–6 цаг": "4 цагаас 6 цаг хүрэхгүй"
  })[option] || common[option] || option;
  if (question.id === "Q-SLEEP-QUALITY") return ({
    "Сайн амардаг": "Сайн",
    "Заримдаа тасалддаг": "Дунд зэрэг",
    "Олон сэрдэг": "Тааруу",
    "Өглөө ядарсан хэвээр байдаг": "Маш тааруу"
  })[option] || common[option] || option;
  if (question.id === "Q-METHOD-REGAIN") return ({
    "Үгүй": "Нэмэгдээгүй",
    "Хэсэгчлэн нэмэгдсэн": "Бага зэрэг нэмэгдсэн",
    "Ихэнх нь эргэн нэмэгдсэн": "Нэлээд нэмэгдсэн"
  })[option] || common[option] || option;
  return common[option] || option;
}
`;

export function restoreQuestionOptionLabelHelper(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes("function questionOptionLabel(question, option)")) continue;
    const marker = "function renderQuestionInput(question, value) {";
    if (!source.includes(marker)) throw new Error(`Question option label restoration point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(marker, `${HELPER}${marker}`));
  }
}
