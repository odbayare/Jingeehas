import { createRequire } from "module";
import { makeConfirmedSummary, makeDiaryEntry } from "./driverStackTestCalculator.mjs";

const require = createRequire(import.meta.url);
const app = require("../../app.js");

function repeat(count, factory) {
  return Array.from({ length: count }, (_, index) => factory(index + 1));
}

function summary(day, structured, bullets) {
  return makeConfirmedSummary(app, { dayNumber: day, structured, bullets });
}

function entry(day, overrides = {}, bullets = []) {
  return makeDiaryEntry(app, day, overrides, bullets);
}

export const APPROVED_DRIVER_STACK_FIXTURE_NAMES = [
  "shift_work_recovery_only",
  "shift_work_loneliness_combo",
  "remote_work_visible_snacks",
  "stress_delivery_app_comfort",
  "meal_gap_evening_hunger",
  "all_or_nothing_restriction_rebound",
  "social_weekend_alcohol_monday_restart",
  "body_shame_restriction",
  "pcos_body_uncertainty_control",
  "medication_body_concern_professional_check"
];

export const driverStackFixtures = [
  {
    name: "shift_work_recovery_only",
    description: "Shift work disrupts recovery rhythm without loneliness or meal-gap dominance.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-N01": "4-6 цаг",
        "S1-N02": "Маш тод"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Шөнийн ээлжийн дараа",
        hunger_level: "3",
        food_function: ["Ядарсан", "Түр тэнхээ авах хэрэгтэй байсан"],
        emotion: "Тайван",
        energy_score: "2",
        sleep: ["Өдөр унтсан, ээлжийн ажилтай"],
        pattern_probes: { shift_recovery: "Шөнийн ажил shift дууссаны дараа recovery хэрэгтэй болдог" }
      }, ["Шөнийн shift дууссаны дараа тэнхээ багассан", "Хоол хурдан recovery мэт санагдсан"]))
    },
    expected: {
      primary: "shift_work",
      secondaryInclude: ["fatigue", "quick_recovery"],
      hiddenFoodFunction: "quick_recovery",
      interaction: "shift_work_recovery_only",
      firstGentleChange: "shift_recovery_anchor",
      safetyMode: "mode1",
      scoreAtLeast: { shift_work: 7, fatigue: 7, quick_recovery: 5 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3, loneliness: 3 }
    }
  },
  {
    name: "shift_work_loneliness_combo",
    description: "Shift work and lonely recovery windows make food a soothing/default point.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-E02": ["Ганцаардал", "Хоосон мэт мэдрэмж"],
        "S1-R02": ["Ганцаардсан үед"]
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Шөнийн ээлжийн дараа",
        hunger_level: "3",
        food_function: ["Тайвширмаар байсан", "Ганцаардсан үед"],
        emotion: "Ганцаардсан",
        energy_score: "4",
        sleep: ["Өдөр унтсан, ээлжийн ажилтай"],
        pattern_probes: { shift_recovery: "Шөнийн ажил shift дууссаны дараа ганцаарддаг" }
      }, ["Шөнийн shift дууссаны дараа ганцаардсан", "Хоол тайвшруулах, хүнтэй байгаа мэт мэдрэмж өгсөн"]))
    },
    expected: {
      primary: "shift_work",
      secondaryInclude: ["loneliness", "loneliness_soothing"],
      hiddenFoodFunction: "loneliness_soothing",
      interaction: "shift_work_loneliness_combo",
      firstGentleChange: "shift_recovery_connection_slot",
      safetyMode: "mode1",
      scoreAtLeast: { shift_work: 7, loneliness: 7, loneliness_soothing: 6 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "remote_work_visible_snacks",
    description: "Remote work desk snacks and food images create cue-based eating without hunger dominance.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-L04": "Харагдвал бараг автоматаар иддэг",
        "S1-L05": "Маш хүчтэй",
        "S1-R02": ["Хоолны зураг эсвэл захиалгын апп харахад"]
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, хоёр удаа",
        main_moment_time: "Гэрээс ажиллаж байх үед",
        hunger_level: "2",
        food_function: ["Харагдаад эсвэл үнэртээд идмээр болсон", "Амттай юм идмээр байсан"],
        emotion: "Тайван",
        pattern_probes: { remote_cue: "Remote work desk дээр зууш харагдсан" }
      }, ["Remote work үед desk дээрх зууш харагдахад идэх хүсэл нэмэгдсэн", "Food зураг cue болсон"]))
    },
    expected: {
      primary: "visible_snacks",
      secondaryInclude: ["self_reward", "low_friction_default"],
      hiddenFoodFunction: "self_reward",
      interaction: "cue_reward_low_friction_default",
      firstGentleChange: "move_one_cue",
      safetyMode: "mode1",
      scoreAtLeast: { visible_snacks: 7, self_reward: 7 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3, stress: 3 }
    }
  },
  {
    name: "stress_delivery_app_comfort",
    description: "Stress and delivery-app default make food a comfort/decompression tool.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-E01": "Ихэвчлэн тэгдэг",
        "S1-E02": ["Стресс", "Санаа зовнил"],
        "S1-L02": ["Хоол захиалах"]
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Ажлын дараа",
        hunger_level: "3",
        food_function: ["Тайвширмаар байсан", "Хамгийн амар нь delivery байсан"],
        emotion: "Стресс",
        stress_score: "8",
        energy_score: "5",
        pattern_probes: { default_app: "Стрессийн дараа delivery app нээсэн" }
      }, ["Стрессийн дараа delivery app хамгийн амар сонголт болсон", "Хоол comfort, decompression үүрэгтэй байсан"]))
    },
    expected: {
      primary: "stress",
      secondaryInclude: ["decompression", "delivery_app", "comfort"],
      hiddenFoodFunction: "decompression",
      interaction: "stress_delivery_app_comfort",
      firstGentleChange: "pre_delivery_decompression_pause",
      safetyMode: "mode1",
      scoreAtLeast: { stress: 7, decompression: 7, delivery_app: 5 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "meal_gap_evening_hunger",
    description: "Long meal gaps lead to evening hunger and low-friction default food.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-M01": "Өдөр бага идээд орой нөхдөг",
        "S1-M02": "Бараг өдөр бүр"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Хоол хоорондын зай хэтэрсэн",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "8",
        food_function: ["Дараа өлсөхөөс санаа зовсон", "Хамгийн амар нь тэр байсан"],
        emotion: "Ядарсан",
        energy_score: "2"
      }, ["Орой хоолны хооронд 5+ цагийн зай гарсан", "Оройн өлсөлт хүчтэй байсан", "Оройн energy бага байсан"]))
    },
    expected: {
      primary: "meal_gap",
      secondaryInclude: ["evening_hunger", "fatigue"],
      hiddenFoodFunction: "hunger_safety",
      interaction: "meal_gap_evening_hunger",
      firstGentleChange: "bridge_meal_before_evening",
      safetyMode: "mode1",
      scoreAtLeast: { meal_gap: 7, evening_hunger: 7, hunger_safety: 6 },
      scoreAtMost: { stress: 3, social_table: 3, loneliness: 3 }
    }
  },
  {
    name: "all_or_nothing_restriction_rebound",
    description: "All-or-nothing restriction and stricter-tomorrow restart create rebound.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-W04": ["Мацаг", "Нүүрс ус хасах"],
        "S1-W06": "Маргааш илүү чанга барина",
        "S1-X03": "Маш хүчтэй"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Нэг хоол алгассан",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "7",
        food_function: ["Дараа өлсөхөөс санаа зовсон"],
        emotion: "Санаа зовсон",
        pattern_probes: { control_collapse: "Тийм", tighten_tomorrow: "Тийм" }
      }, ["Өнөөдөр өнгөрлөө гэж бодсон", "Маргааш илүү чанга барина гэж бодсон", "Мацагийн дараа орой хүчтэй өлссөн"]))
    },
    expected: {
      primary: "all_or_nothing",
      secondaryInclude: ["monday_restart", "punishment_restriction"],
      hiddenFoodFunction: "hunger_safety",
      interaction: "all_or_nothing_punishment_restriction",
      firstGentleChange: "next_meal_reset_rule",
      safetyMode: "mode1",
      scoreAtLeast: { all_or_nothing: 7, monday_restart: 7, punishment_restriction: 6 },
      scoreAtMost: { stress: 4, social_table: 3 }
    }
  },
  {
    name: "social_weekend_alcohol_monday_restart",
    description: "Weekend social table plus alcohol leads to Monday restart thinking.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-F01": ["Татгалзах эвгүй байсан"],
        "S1-W06": "Маргааш илүү чанга барина"
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Weekend хүмүүсийн уулзалтын үед",
        hunger_level: "4",
        food_function: ["Татгалзах эвгүй байсан"],
        emotion: "Тайван",
        drinks: ["Согтууруулах ундаа"],
        pattern_probes: { monday_restart: "Даваа гарагт дахин эхэлнэ гэж бодсон" }
      }, ["Weekend social table дээр татгалзах эвгүй байсан", "Архи social context-той давхцсан", "Monday restart бодол гарсан"]))
    },
    expected: {
      primary: "social_table",
      secondaryInclude: ["belonging", "alcohol_context", "monday_restart"],
      hiddenFoodFunction: "belonging",
      interaction: "social_belonging_alcohol",
      firstGentleChange: "social_choice_script",
      safetyMode: "mode1",
      scoreAtLeast: { social_table: 7, belonging: 7, alcohol_context: 6, monday_restart: 3 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "body_shame_restriction",
    description: "Body shame links to stricter restriction and escape-from-shame function.",
    state: {
      packageType: "one-time",
      stageAnswers: {
        "S1-C06": ["Гадаад төрхөө өөрчлөх", "Хувцсандаа тухтай байх"],
        "S1-W04": ["Мацаг", "Нүүрс ус хасах"],
        "S1-W06": "Маргааш илүү чанга барина"
      },
      stageVoiceSummaries: {
        "S1-V01": makeConfirmedSummary(app, {
          kind: "stage",
          id: "S1-V01",
          structured: {},
          bullets: ["Зураг харах үед ичих, нуух хүсэл нэмэгддэг", "Ичсэн үедээ маргааш илүү чанга барина гэж боддог"]
        })
      },
      removedEntries: []
    },
    expected: {
      primary: "body_change_uncertainty",
      secondaryInclude: ["shame", "strict_diet", "punishment_restriction"],
      hiddenFoodFunction: "escape_from_shame",
      interaction: "body_shame_restriction",
      firstGentleChange: "body_neutral_private_tracking",
      safetyMode: "mode1",
      scoreAtLeast: { body_change_uncertainty: 4, shame: 4, strict_diet: 2, punishment_restriction: 2 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "pcos_body_uncertainty_control",
    description: "PCOS/body-change uncertainty creates control-regain pressure without professional-first red flags.",
    state: {
      packageType: "one-time",
      stageAnswers: {
        "S1-C06": ["Гадаад төрхөө өөрчлөх", "Хувцсандаа тухтай байх"],
        "S1-W06": "Би угаасаа чаддаггүй юм байна"
      },
      stageVoiceSummaries: {
        "S1-V01": makeConfirmedSummary(app, {
          kind: "stage",
          id: "S1-V01",
          structured: {},
          bullets: ["PCOS болон дааврын өөрчлөлтөөс болж бие өөрчлөгдөхөд эргэлзээ төрдөг", "Control буцааж авахын тулд чанга дүрэм хэрэгтэй мэт санагддаг"]
        })
      },
      removedEntries: []
    },
    expected: {
      primary: "body_change_uncertainty",
      secondaryInclude: ["control_regain"],
      hiddenFoodFunction: "control_regain",
      interaction: "pcos_body_uncertainty_control",
      firstGentleChange: "body_neutral_private_tracking",
      safetyMode: "mode1",
      scoreAtLeast: { body_change_uncertainty: 4, control_regain: 3 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "medication_body_concern_professional_check",
    description: "Medication/body concern should suppress ordinary experiment and route professional-first.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-B03": "Тийм",
        "S1-B02": "Тийм, санаа зовоосон"
      },
      removedEntries: repeat(2, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Өдөр",
        hunger_level: "5",
        food_function: ["Бие эвгүйрхэх вий гэж санаа зовсон"],
        body_signals: ["Сахар унасан мэт санагдах", "Толгой эргэх"],
        confirmedSummaryObject: summary(day, {}, ["Medication болон сахар унасан мэт санаа зовсон", "Толгой эргэх биеийн дохио байсан"])
      }))
    },
    expected: {
      primary: null,
      secondaryInclude: [],
      hiddenFoodFunction: "quick_recovery",
      interaction: "medical_first_body_signal",
      firstGentleChange: "professional_discussion_summary",
      safetyMode: "mode3",
      ordinaryAllowed: false,
      scoreAtLeast: { medical_concern: 6, medical_red_flag: 7, professional_first: 7 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  }
];

export const futureDriverStackFixtures = [
  {
    name: "sleep_disruption_circadian_reward",
    description: "Future helper fixture retained outside the approved WP3B result set.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-N01": "4-6 цаг",
        "S1-N02": "Маш тод",
        "S1-R01": "Бараг өдөр бүр"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "3",
        food_function: ["Амттай юм идмээр байсан", "Ядарсан"],
        emotion: "Ядарсан",
        energy_score: "2",
        sleep: ["4-6 цаг", "Олон сэрсэн, чанар муу"]
      }, ["Нойр муу, оройн energy бага байсан", "Амттай юм хурдан тэнхээ өгөх шиг санагдсан"]))
    }
  },
  {
    name: "stage_reward_diary_meal_gap_contradiction",
    description: "Future helper fixture retained outside the approved WP3B result set.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-R01": "Өдөрт олон удаа",
        "S1-R02": ["Амт, үнэр, мэдрэмж татах үед"]
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Хоол хоорондын зай хэтэрсэн",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "9",
        food_function: ["Өлссөндөө", "Дараа өлсөхөөс санаа зовсон"],
        emotion: "Ядарсан",
        energy_score: "2"
      }, ["Орой хоолны зай уртссан", "Өлсөлт өндөр байсан", "Амттай зүйлээс илүү дараа өлсөхөөс санаа зовсон"]))
    }
  }
];
