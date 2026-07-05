const assert = require("assert");
const { readFileSync } = require("fs");
const { spawnSync } = require("child_process");

const audit = spawnSync(process.execPath, ["scripts/run-virtual-user-audit.mjs", "--assert-clean"], {
  encoding: "utf8"
});

if (audit.status !== 0) {
  process.stdout.write(audit.stdout || "");
  process.stderr.write(audit.stderr || "");
  process.exit(audit.status || 1);
}

function report(id) {
  return JSON.parse(readFileSync(`audits/virtual-users-10/raw/${id}.json`, "utf8")).generatedReportText;
}

const reports = Array.from({ length: 10 }, (_, index) => report(`user-${String(index + 1).padStart(2, "0")}`));
const publicText = reports.join("\n\n");

[
  "давтамж гэх давтамж",
  "гэх давтамжтай нийцэж байна",
  "хүчтэй нийцэж байна",
  "дунд зэрэг нийцэж байна",
  "Таны идэлт дараах үүргүүдийг гүйцэтгэж байна",
  "Хэрвээ тасалдвал",
  "шийдвэрийн ачаалал",
  "тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж байсан байж магадгүй",
  "харагдаж байна",
  "энэ эхний зураглал",
  "давтагддагийг харна",
  "давтагдаж байна",
  "нөхцөлд давтагддаг",
  "орчин өөрөө идэх шийдвэрийг",
  "Дэлгэрэнгүй тайлан харах",
  "Нурах давтамж"
].forEach((phrase) => {
  assert(!publicText.includes(phrase), `public report voice should not contain: ${phrase}`);
});

const user03 = report("user-03");
assert(user03.includes("Өлсөхийг сахилга бат гэж ойлгох"));
assert(user03.includes("Нүүрс ус багасч, хоолны хэмжээ хасагдана"));
assert(user03.includes("буцаад хүчтэй идэх тойрог"));
assert(!user03.includes("дараагийн хоолноос хэвийн үргэлжлүүлэх замгүй болох үүрэг"));

const user05 = report("user-05");
assert(user05.includes("Өөрийн хоол, амралт өдөржин хойшлогдохоор"));
assert(user05.includes("өөрийн хоол"));
assert(user05.includes("үлдэгдэл цагт найдахгүй"));
assert(!user05.includes("Өдөр олон зүйл шийдэж өнгөрнө"));

const user06 = report("user-06");
assert(user06.includes("хоол харагдах") || user06.includes("Хоол нүдэнд өртөх"));
assert(user06.includes("нүдэнд ойр") || user06.includes("гарын дор"));
assert(user06.includes("нэг зүйлийг"));
assert(!user06.includes("Өдөр олон шийдвэрийн ачаалал өндөр байна"));
assert(!user06.includes("Өдөр олон зүйл шийдэж өнгөрнө"));

console.log("report-voice-rewrite tests passed");
