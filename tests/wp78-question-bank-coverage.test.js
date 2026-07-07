const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { stageOneQuestions, _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

function question(id) {
  const found = stageOneQuestions.find(item => item.id === id);
  assert(found, `missing question ${id}`);
  return found;
}

function assertOptions(id, expected) {
  const options = question(id).options || [];
  expected.forEach(option => {
    assert(options.includes(option), `${id} should include option: ${option}`);
  });
}

function run() {
  assert.strictEqual(
    question("S1-W04").text,
    "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?"
  );
  assertOptions("S1-W04", [
    "Алхалт нэмэх",
    "Фитнес / хүчний дасгал",
    "Иог / сунгалтын дасгал",
    "Усанд сэлэх",
    "Дугуй / спиннинг",
    "Бүжиг / хөдөлгөөнтэй хичээл",
    "Гэрийн дасгал"
  ]);

  assert.strictEqual(
    question("S1-W06").text,
    "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?"
  );
  assert.strictEqual(
    question("S1-F01").text,
    "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?"
  );
  assert.strictEqual(
    question("S1-B01").text,
    "Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?"
  );

  assert.strictEqual(question("S1-A01").text, "Та согтууруулах ундааг хэр ойр хэрэглэдэг вэ?");
  assert.strictEqual(
    question("S1-A02").text,
    "Согтууруулах ундаа хэрэглэсэн үед таны хоолны сонголт ихэвчлэн яаж өөрчлөгддөг вэ?"
  );
  assert.strictEqual(
    question("S1-A03").text,
    "Согтууруулах ундаа хэрэглэсний маргааш танд аль нь илүү ойр тохиолддог вэ?"
  );
  assertOptions("S1-A02", [
    "Маргааш нь биеийн тавгүйрхлээ намдаах гэж их иддэг",
    "Нойр муудаж, маргааш хоолны хэмнэл алдагддаг"
  ]);

  assert.strictEqual(question("S1-T01").text, "Та одоогоор тамхи татдаг уу?");
  assert.strictEqual(
    question("S1-T02").text,
    "Тамхи таны хоолны дуршил, зууш идэх хүсэл, кофе эсвэл стрессийн хэмнэлтэй холбоотой санагддаг уу?"
  );
  assert(appSource.includes("Энэ нь тамхийг жин барих арга болго гэсэн зөвлөгөө огт биш."), "report must explicitly avoid smoking-as-control advice");

  assert.strictEqual(question("S1-MV01").text, "Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?");
  assert.strictEqual(question("S1-MV02").text, "Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?");

  [
    ["согтууруулах ундаа", "орж ир"].join(" "),
    ["архи", "уусан"].join(" "),
    ["архи", "уусны"].join(" "),
    ["архи", ", "].join("")
  ].forEach(forbidden => {
    assert(!appSource.includes(forbidden), `user-facing source must not contain forbidden phrase: ${forbidden}`);
  });

  _internal.setTestState({ packageType: "one-time", view: "stage1", internalTest: true });
  const stageHtml = _internal.renderStageOne();
  assert(stageHtml.includes("Таны хариултаас одоогоор тодорч буй зүйл"));
  assert(stageHtml.includes("Энэ үнэлгээний хүрээ"));

  assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "repo source coming-soon guard must remain true");
  assert(appSource.includes('oneTime: "9,900₮"'), "price copy must remain 9,900₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoints must remain present");
}

run();
console.log("wp78 question bank coverage tests passed");
