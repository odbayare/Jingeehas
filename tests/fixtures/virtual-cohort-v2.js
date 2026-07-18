"use strict";

const v1 = require("./virtual-cohort-v1.js");

const LONGEST_METHOD = Object.freeze({
  "VU-01": "Хоолны дэглэм",
  "VU-02": "Илчлэг тоолох",
  "VU-03": "Хоолны дэглэм",
  "VU-05": "Онлайн хөтөлбөр эсвэл апп",
  "VU-06": "Хоолны дэглэм",
  "VU-10": "Алхалт"
});

module.exports = Object.freeze(v1.map(user => Object.freeze({
  ...user,
  answers: Object.freeze(LONGEST_METHOD[user.id]
    ? { ...user.answers, "Q-METHOD-LONGEST": LONGEST_METHOD[user.id] }
    : { ...user.answers }),
  longestMethodAdaptation: LONGEST_METHOD[user.id] || null
})));
