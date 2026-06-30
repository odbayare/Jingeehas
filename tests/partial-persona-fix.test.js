const assert = require("assert");
const app = require("../app.js");
const { personas, runPersona } = require("./ten-person-simulation-audit.test.js");

const M = app.mechanismNamesByKey;

function personaById(id) {
  return personas.find(persona => persona.id === id);
}

function run() {
  const mother = runPersona(personaById("36f-mother-role-overload"));
  assert.strictEqual(mother.mode, "deep");
  assert(
    [M.roleOverload, M.rewardDeficit].includes(mother.evidence.primaryMechanism) ||
      mother.evidence.secondaryMechanisms.includes(M.roleOverload) ||
      mother.evidence.secondaryMechanisms.includes(M.rewardDeficit),
    "mother persona should surface Role Overload or Reward Deficit strongly"
  );
  assert.notStrictEqual(mother.evidence.primaryMechanism, M.reward, "mother persona should not remain generic Reward-Seeking primary");
  assert(/өөрийн хэрэгцээ хамгийн сүүлд|өөрийгөө хойш тавьсны дараа|өөрийгөө хойш тавьсан|өөрийн цаг|өөрийн хоол, амралт хамгийн сүүлд/i.test(mother.text), "mother report copy should mention self-neglect or self-time compensation");
  assert(/өөрийн хоол|амралтын 10 минут|үлдэгдэл цагт найдахгүй/i.test(mother.text), "mother leverage should include protected self-feeding or protected rest");
  assert(mother.text.includes("Оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих") || mother.text.includes("өөрийн хоолыг үлдэгдэл цагт найдах"), "mother avoid list should include self-neglect-specific avoid");

  const bodySafety = runPersona(personaById("24f-body-safety-shame"));
  assert.strictEqual(bodySafety.mode, "professional");
  assert(bodySafety.text.includes("Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ?"), "body-safety route should explain why ordinary report is paused");
  assert(bodySafety.text.includes("өөрийгөө харах, бусдад харагдах, ичгүүртэй"), "body-safety explanation should name visibility/shame trigger carefully");
  assert(bodySafety.text.includes("Олон нийтэд өмнө/дараах зураг харуулах сорил"), "body-safety avoid list should include public challenge");
  assert(bodySafety.text.includes("өдөр бүр жингээ үзэж өөрийгөө шийтгэх"), "body-safety avoid list should include shame weighing");
  assert(bodySafety.text.includes("Биеэ ичээх үг хэллэг"), "body-safety avoid list should include body-shaming");
  assert(!bodySafety.text.includes("<h3>14 хоногийн эхний туршилт</h3>"));
  assert(!bodySafety.text.includes("<h3>14 хоногийн туршилт</h3>"));

  const circadian = runPersona(personaById("42f-sleep-circadian"));
  assert.strictEqual(circadian.mode, "deep");
  assert([M.circadian, M.executive].includes(circadian.evidence.primaryMechanism), "circadian persona should be Circadian or Executive primary");
  assert.notStrictEqual(circadian.evidence.primaryMechanism, M.reward, "circadian persona should not be generic Reward-Seeking primary");
  assert(circadian.text.includes("Нойр муу") && circadian.text.includes("кофе"), "circadian report should explain sleep/energy rhythm");
  assert(/орой кофе уух/i.test(circadian.text), "circadian avoid list should mention coffee timing");
  assert(/нойр (дутуу|муу) үед хатуу хоолны дэглэм эхлүүлэх/i.test(circadian.text), "circadian avoid list should mention sleep-specific strict diet avoid");
  assert(/Өдрийн эхний хоолоо тогтмол болго|Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо|Орой 10 минут тайвшрах хугацаа гарга/.test(circadian.text), "circadian leverage should be sleep/energy-aware");
  assert(circadian.text.includes("14 хоногийн туршилт"));
}

run();
console.log("partial-persona-fix tests passed");
