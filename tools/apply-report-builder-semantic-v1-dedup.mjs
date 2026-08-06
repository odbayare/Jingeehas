import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Semantic dedup function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Semantic dedup function end missing: ${name}`);
}

const COMBINED_MANAGEMENT_PLAN = `function combinedManagementPlan(patternIds, prioritized, modules) {
  const pair = Array.isArray(patternIds) ? [...new Set(patternIds)] : [];
  if (pair.length !== 2 || modules.length < 2) return null;
  const pairModules = pair.map(id => modules.find(item => item.patternId === id)).filter(Boolean);
  if (pairModules.length !== 2) return null;
  const primary = pairModules.find(item => item.patternId === prioritized?.id) || pairModules[0];
  const secondary = pairModules.find(item => item.patternId !== primary.patternId);
  if (!secondary) return null;
  const reasonByPattern = {
    irregular_meals_late_hunger: "Хоолны зай болон өлсөх мэдрэмжийг нэг өдрийн дотор шууд ажиглаж, нэг тогтвортой хоолны цагаар шалгаж болох тул үүнээс эхэлнэ.",
    hunger_satiety: "Өлсөх, цадах мэдрэмжийг нэг хоолны үеэр шууд ажиглаж, жижиг завсарлагаар шалгаж болох тул үүнээс эхэлнэ.",
    emotional_regulation: "Идэх хүсэл нэмэгдэх мөчийг өдөр тутмын нөхцөлд шууд ажиглаж, нэг богино завсарлагаар шалгаж болох тул үүнээс эхэлнэ.",
    environmental_cues: "Нэг тодорхой орчны дохиог өөрчлөөд нөлөөг нь тусад нь ажиглаж болох тул үүнээс эхэлнэ.",
    sleep_fatigue: "Ядарсан үед хэрэгжих хялбар хувилбарыг урьдчилан бэлдэх нь шууд туршиж болох алхам тул үүнээс эхэлнэ.",
    restrictive_rebound: "Нэг хатуу дүрмийг уян болгох нь бүх төлөвлөгөөг зэрэг өөрчлөхгүйгээр нөлөөг нь шалгах боломжтой тул үүнээс эхэлнэ.",
    plan_daily_life_mismatch: "Өдөр тутамд багтах хамгийн хялбар хувилбарыг сонгох нь шууд хэрэгжүүлж болох алхам тул үүнээс эхэлнэ.",
    previous_attempt_sustainability: "Өмнөх арга боломжгүй үед хэрэглэх орлуулах хувилбарыг бэлдэх нь үр дүнгээ хадгалах хамгийн шууд алхам тул үүнээс эхэлнэ."
  };
  return {
    patternIds: [primary.patternId, secondary.patternId],
    startWith: { title: primary.title, body: "Эхний хэв маяг илрэх нэг давтагддаг мөчийг сонгож ажиглаарай." },
    why: \`\${reasonByPattern[primary.patternId] || "Эхний нөлөөг богино хугацаанд шууд ажиглаж, нэг жижиг өөрчлөлтөөр шалгаж болох тул үүнээс эхэлнэ."} Дараа нь хоёр дахь нөлөө мөн тэр үед давхцаж байгаа эсэхийг шалгана.\`,
    nextStep: { title: secondary.title, body: "Дараа нь хоёр дахь хэв маягт тохирох нэг бэлтгэсэн үйлдлийг сонгоорой." },
    combinedAction: { title: "Хоёр хэв маягийг зэрэг удирдах арга", body: combinedManagementAction(primary.patternId, secondary.patternId) }
  };
}`;

const NEUTRAL_ACTIONABLE_PLAN = `function neutralActionablePlan(neutral) {
  const observation = neutral?.observation;
  if (!observation) return null;
  return {
    neutralActionPlan: {
      title: "Одоо танд тохирч байгаа хэвшлээ хадгалах",
      directionSummary: "Одоогийн тогтвортой хэвшлээ өөрчлөхгүйгээр нэг зүйл ажиглана.",
      observation: {
        variable: observation.variable,
        action: observation.action,
        keepConstant: observation.keepConstant,
        decisionRule: observation.decisionRule
      }
    },
    firstActions: [
      { order: 1, patternTitle: "Ажиглах зүйл", action: \`\${observation.variable}-ийг сонгоорой.\` },
      { order: 2, patternTitle: "Нэг ажиглалт", action: "Сонгосон мөчид нэг ажиглалт хийж, нөлөөлсөн нөхцөлийг тэмдэглээрэй." },
      { order: 3, patternTitle: "Дараагийн шийдвэр", action: "Тэмдэглэлээ эргэн хараад одоогийн хэвшлээ хадгалах эсэхээ нэг удаа шийдээрэй." }
    ],
    recoveryPlan: {
      introduction: "Ажиглалт өдөр бүр яг ижил хэрэгжихгүй байж болно. Нэг удаа тэмдэглэж чадаагүй нь бүх ажиглалт хэрэггүй болсон гэсэн үг биш.",
      steps: [
        { key: "notice", label: "Юу саад болсныг анзаарах", body: "Ажиглалтад ямар бодит нөхцөл саад болсныг нэг өгүүлбэрээр тэмдэглээрэй." },
        { key: "resume", label: "Дараагийн мөчөөс үргэлжлүүлэх", body: "Алгассан ажиглалтыг нөхөхгүйгээр дараагийн сонгосон мөчөөс үргэлжлүүлээрэй." },
        { key: "fit", label: "Бодит амьдралдаа тохируулах", body: "Сонгосон мөч тохирохгүй байвал ажиглах зүйлээ бус, хийх мөчийг нэг удаа солиорой." }
      ],
      rules: ["Шинэ хориг эсвэл шаардлагагүй засах дүрэм нэмэхгүй байгаарай."]
    }
  };
}`;

const RECOVERY_PLAN = `function recoveryPlan(modules, combinedPlan, planFallback) {
  const primary = Array.isArray(modules) ? modules[0] : null;
  if (!primary || !planFallback) return null;
  return {
    introduction: planFallback.introduction,
    steps: [
      { key: "notice", label: "Юу болж байгааг анзаарах", body: "Төлөвлөгөө алдагдсан мөчид ямар нөхцөл давтагдсаныг нэг өгүүлбэрээр тэмдэглээрэй." },
      { key: "inMoment", label: "Тухайн мөчид хийх нэг үйлдэл", body: "Нөхцөл хүндрэхэд урьдчилан сонгосон хамгийн хялбар үйлдлээ хэрэглээрэй." },
      { key: "prepare", label: "Урьдчилан бэлдэх зүйл", body: "Ийм мөчид ашиглах нэг богино хувилбарыг урьдчилан бэлдээрэй." },
      { key: "resume", label: "Дараагийн боломжит мөчөөс үргэлжлүүлэх", body: planFallback.resume }
    ],
    combinedAction: combinedPlan?.combinedAction?.body || null,
    rules: [planFallback.softenRule, planFallback.recheckTrigger, planFallback.fitDailyLife].filter(Boolean)
  };
}`;

export function applyReportBuilderSemanticV1Dedup(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  if (!fs.existsSync(reportPath)) throw new Error("Semantic report source is missing for deduplication");
  let source = fs.readFileSync(reportPath, "utf8");
  source = replaceNamedFunction(source, "combinedManagementPlan", COMBINED_MANAGEMENT_PLAN);
  source = replaceNamedFunction(source, "neutralActionablePlan", NEUTRAL_ACTIONABLE_PLAN);
  source = replaceNamedFunction(source, "recoveryPlan", RECOVERY_PLAN);
  fs.writeFileSync(reportPath, source);
}