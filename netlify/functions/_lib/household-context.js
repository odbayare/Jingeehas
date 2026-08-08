"use strict";

const { QUESTIONNAIRE_VERSION } = require("../../../questions.js");

const HOUSEHOLD_OPTIONS = Object.freeze({
  alone: "Ганцаараа",
  partner: "Хань эсвэл хамтрагчтай",
  children: "Хүүхэдтэй",
  otherFamily: "Эцэг эх, төрөл садантай",
  otherMembers: "Бусад хүнтэй"
});

const CONTEXT_OPTION_FLAGS = Object.freeze({
  "Гэрийн бусад хүмүүсийн хоолыг би тогтмол бэлтгэж эсвэл зохицуулдаг": "household_meal_responsibility",
  "Гэрийн үндсэн хоолыг ихэвчлэн өөр хүн бэлтгэдэг": "household_other_primary_meal_preparer",
  "Гэрийн бусад хүний хоолны цаг, хэрэгцээнд тааруулахын тулд өөрийн хоол хойшилдог": "household_meal_delay",
  "Гэрийнхэндээ хоол бэлтгэх эсвэл өгөх үед төлөвлөөгүйгээр амсах, бага багаар идэх эсвэл үлдсэн хоолноос идэх тохиолдол гардаг": "household_incidental_eating",
  "Өөрийн порц, хачир эсвэл идэх зүйлээ гэрийн бусад хүнээс өөрөөр тохируулахад хэцүү байдаг": "household_food_autonomy_constraint",
  "Надад идэх хүсэл төрүүлдэг хүнс гэрийн бусад хүнд зориулж гэрт тогтмол бэлэн байдаг": "household_food_exposure",
  "Гэрийн бусад хүн идэж байх үед өлсөөгүй байсан ч өөрөө идэх хүсэл төрөх тохиолдол байдаг": "household_social_eating_cue",
  "Хооллолтоо өөрчлөхийг хичээх үед гэрийн хүмүүсийн хандлага эсвэл дэмжлэг заримдаа хэрэгжүүлэхэд хүндрэл болдог": "household_support_constraint"
});

const CONTEXT_FLAG_COPY = Object.freeze({
  household_meal_responsibility: "Гэрийн бусад хүмүүсийн хоолыг тогтмол бэлтгэх эсвэл зохицуулах нөхцөл байна.",
  household_other_primary_meal_preparer: "Гэрийн үндсэн хоолыг ихэвчлэн өөр хүн бэлтгэдэг тул хэрэгжүүлэх алхам нь өөрийн шууд хянаж болох сонголтод төвлөрөх шаардлагатай.",
  household_meal_delay: "Гэрийн бусад хүний хоолны цаг, хэрэгцээнд тааруулах үед өөрийн хоол хойшлох нөхцөл давтагддаг байна.",
  household_incidental_eating: "Гэрийнхэндээ хоол бэлтгэх эсвэл өгөх үед төлөвлөөгүйгээр амсах, бага багаар идэх эсвэл үлдсэн хоолноос идэх нөхцөл давтагддаг байна.",
  household_food_autonomy_constraint: "Өөрийн порц, хачир эсвэл идэх зүйлээ тусад нь тохируулахад хүндрэлтэй нөхцөл байна.",
  household_food_exposure: "Идэх хүсэл төрүүлдэг хүнс гэрийн бусад хүнд зориулан гэрт тогтмол бэлэн байдаг нөхцөл байна.",
  household_social_eating_cue: "Гэрийн бусад хүн идэж байх үед өлсөөгүй ч идэх хүсэл төрөх нөхцөл давтагддаг байна.",
  household_support_constraint: "Хооллолтын өөрчлөлтийг хэрэгжүүлэх үед гэрийн хүмүүсийн хандлага эсвэл дэмжлэгийн нөхцөлийг бодитоор харгалзах шаардлагатай."
});

const LINK_RULES = Object.freeze([
  { id: "HFE-LINK-01", patternId: "irregular_meals_late_hunger", flag: "household_meal_delay", summary: "Дэмжигдсэн хоолны хэмнэлийн хэв маяг нь гэрийн хоолны цаг өөрийн хоолыг хойшлуулдаг нөхцөлд мөн илэрч байна." },
  { id: "HFE-LINK-02", patternId: "environmental_cues", flag: "household_food_exposure", summary: "Дэмжигдсэн орчны хоолны дохио гэрийн орчинд тогтмол бэлэн байдаг хүнстэй мөн давхцаж байна." },
  { id: "HFE-LINK-03", patternId: "environmental_cues", flag: "household_social_eating_cue", summary: "Дэмжигдсэн нийгмийн идэх дохио гэрийн бусад хүн идэж байх нөхцөлд мөн тохиолддог байна." },
  { id: "HFE-LINK-04", patternId: "plan_daily_life_mismatch", flag: "household_food_autonomy_constraint", summary: "Дэмжигдсэн төлөвлөгөө, өдөр тутмын амьдралын нийцлийн саад нь тусдаа порц эсвэл сонголт хийхэд хүндрэлтэй гэрийн нөхцөлтэй давхцаж байна." },
  { id: "HFE-LINK-05", patternId: "plan_daily_life_mismatch", flag: "household_support_constraint", summary: "Дэмжигдсэн төлөвлөгөө, өдөр тутмын амьдралын нийцлийн саадыг удирдахдаа гэрийн хэрэгжүүлэх орчныг бодитоор харгалзах шаардлагатай байна." }
]);

const MODIFIER_FLAGS = new Set([
  "household_meal_responsibility", "household_other_primary_meal_preparer", "household_meal_delay",
  "household_food_autonomy_constraint", "household_food_exposure", "household_social_eating_cue",
  "household_support_constraint"
]);

function deriveHouseholdContext(answerMap = {}, questionnaireVersion) {
  if (questionnaireVersion !== QUESTIONNAIRE_VERSION) return Object.freeze({ status: "not_assessed", profile: null, flags: [], evidence: [] });
  const household = Array.isArray(answerMap["HFE-HOUSEHOLD"]) ? answerMap["HFE-HOUSEHOLD"] : [];
  if (!household.length) return Object.freeze({ status: "not_assessed", profile: null, flags: [], evidence: [] });
  const livesAlone = household.includes(HOUSEHOLD_OPTIONS.alone);
  const profile = Object.freeze({
    livesAlone,
    partnerPresent: !livesAlone && household.includes(HOUSEHOLD_OPTIONS.partner),
    childrenPresent: !livesAlone && household.includes(HOUSEHOLD_OPTIONS.children),
    otherFamilyPresent: !livesAlone && household.includes(HOUSEHOLD_OPTIONS.otherFamily),
    otherHouseholdMembersPresent: !livesAlone && household.includes(HOUSEHOLD_OPTIONS.otherMembers)
  });
  const selected = !livesAlone && Array.isArray(answerMap["HFE-CONTEXT"]) ? answerMap["HFE-CONTEXT"] : [];
  const evidence = selected.flatMap(option => CONTEXT_OPTION_FLAGS[option]
    ? [{ flag: CONTEXT_OPTION_FLAGS[option], sourceQuestionIds: ["HFE-CONTEXT"], sourceAnswerValues: [option], certainty: "direct" }]
    : []);
  return Object.freeze({ status: "assessed", profile, flags: Object.freeze(evidence.map(item => item.flag)), evidence: Object.freeze(evidence) });
}

function householdContextLinks(context, activePatternIds = []) {
  const flags = new Set(context?.flags || []);
  const patterns = new Set(activePatternIds || []);
  return LINK_RULES.filter(rule => flags.has(rule.flag) && patterns.has(rule.patternId)).map(rule => Object.freeze({
    id: rule.id, corePatternId: rule.patternId, householdFlag: rule.flag, summary: rule.summary,
    sourceQuestionIds: ["HFE-CONTEXT"], sourceAnswerValues: context.evidence.find(item => item.flag === rule.flag)?.sourceAnswerValues || [],
    certainty: "direct_context_non_causal", counted: false
  }));
}

function recommendationFeasibilityModifiers(context) {
  return (context?.flags || []).filter(flag => MODIFIER_FLAGS.has(flag)).map(flag => Object.freeze({
    id: `HFE-MOD-${flag.replace(/^household_/, "").replaceAll("_", "-").toUpperCase()}`,
    householdFlag: flag, sourceQuestionIds: ["HFE-CONTEXT"], sourceAnswerValues: context.evidence.find(item => item.flag === flag)?.sourceAnswerValues || [],
    certainty: "direct", changesCoreRecommendation: false
  }));
}

function householdContextFactors(context, links = []) {
  if (context?.status !== "assessed" || context.profile?.livesAlone) return [];
  const linkedFlags = new Set(links.map(link => link.householdFlag));
  const linkByFlag = new Map(links.map(link => [link.householdFlag, link]));
  return (context.flags || []).map(flag => {
    const link = linkByFlag.get(flag);
    return Object.freeze({
      id: flag, title: "Гэрийн хоолны орчин", summary: link?.summary || CONTEXT_FLAG_COPY[flag],
      householdContext: true, contextualLinkId: link?.id || null, corePatternId: link?.corePatternId || null,
      sourceQuestionIds: ["HFE-CONTEXT"], sourceAnswerValues: context.evidence.find(item => item.flag === flag)?.sourceAnswerValues || [],
      certainty: "direct", counted: false, linked: linkedFlags.has(flag)
    });
  });
}

module.exports = {
  CONTEXT_OPTION_FLAGS,
  deriveHouseholdContext,
  householdContextLinks,
  recommendationFeasibilityModifiers,
  householdContextFactors
};
