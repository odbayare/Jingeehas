"use strict";

const EXCLUSIVE_OPTIONS = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй"]);
const BRANCHES = Object.freeze({
  "CTX-GENDER": ["MC-", "PREG-"],
  "MC-GATE": ["MC-"],
  "ALC-GATE": ["ALC-"],
  "TOB-GATE": ["TOB-"],
  "PREG-GATE": ["PREG-"]
});

function normalizeMultiSelection(current, selected, maximum = 3) {
  const values = Array.isArray(current) ? [...current] : [];
  if (EXCLUSIVE_OPTIONS.has(selected)) return { values: [selected], error: null };
  const withoutExclusive = values.filter(value => !EXCLUSIVE_OPTIONS.has(value));
  if (withoutExclusive.includes(selected)) return { values: withoutExclusive.filter(value => value !== selected), error: null };
  if (withoutExclusive.length >= maximum) return { values: withoutExclusive, error: "Та хамгийн ихдээ 3 хариулт сонгох боломжтой." };
  return { values: [...withoutExclusive, selected], error: null };
}

function cleanupBranchState(state, changedQuestionId, nextValue) {
  const prefixes = BRANCHES[changedQuestionId] || [];
  if (!prefixes.length || state.answers?.[changedQuestionId] === nextValue) {
    return { ...state, answers: { ...(state.answers || {}), [changedQuestionId]: nextValue } };
  }
  const keep = key => key === changedQuestionId || !prefixes.some(prefix => key.startsWith(prefix));
  const filterObject = source => Object.fromEntries(Object.entries(source || {}).filter(([key]) => keep(key)));
  return {
    ...state,
    answers: { ...filterObject(state.answers), [changedQuestionId]: nextValue },
    summaries: filterObject(state.summaries),
    tags: filterObject(state.tags),
    safetyFlags: (state.safetyFlags || []).filter(flag => (flag.triggerQuestionIds || []).every(keep))
  };
}

module.exports = { EXCLUSIVE_OPTIONS, BRANCHES, normalizeMultiSelection, cleanupBranchState };
