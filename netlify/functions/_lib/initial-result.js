"use strict";

const INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v1";
const LOCKED_REPORT_TITLES = Object.freeze([
  "Танд нөлөөлж буй бусад хэв маяг",
  "Хэв маягууд хоорондоо хэрхэн уялдаж байгаа",
  "Ямар нөхцөлд илүү хүчтэй болдог",
  "Хэв маяг бүрийн нөлөөг хэрхэн удирдах вэ?",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөснөөрөө явж чадаагүй үед яах вэ?",
  "Өөртөө илүү тохирсон жин хасах арга барил"
]);
const NEUTRAL_SUMMARY = "Таны хариултад хэд хэдэн хүчин зүйл зэрэг нөлөөлж байгаа зураглал харагдлаа. Бүрэн тайланд эдгээр хүчин зүйл хоорондоо хэрхэн уялдаж байгааг, юунд эхэлж анхаарах нь илүү тохиромжтойг дэлгэрүүлнэ.";

function shortSentences(values = []) {
  const text = values.filter(Boolean).map(value => String(value).trim()).filter(Boolean).join(" ");
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(value => value.trim()).filter(Boolean) || [];
  return sentences.slice(0, 3).join(" ").slice(0, 900);
}

function supportedPatterns(fullReport = {}) {
  return [
    ...(Array.isArray(fullReport.influencingPatterns) ? fullReport.influencingPatterns : []),
    ...(Array.isArray(fullReport.contextualFactors) ? fullReport.contextualFactors.filter(item => item?.isPattern) : [])
  ];
}

function buildInitialResult(fullReport = {}) {
  const patterns = supportedPatterns(fullReport);
  if (fullReport.neutralResult || !patterns.length) {
    return {
      schemaVersion: INITIAL_RESULT_SCHEMA_VERSION,
      mode: "neutral",
      primaryPattern: null,
      summary: NEUTRAL_SUMMARY,
      additionalPatternCount: 0,
      lockedSections: [...LOCKED_REPORT_TITLES]
    };
  }
  const primary = patterns[0];
  const summary = shortSentences([primary.evidenceSummary, primary.effectOnWeightLoss, primary.uncertainty]);
  return {
    schemaVersion: INITIAL_RESULT_SCHEMA_VERSION,
    mode: "pattern",
    primaryPattern: {
      title: String(primary.title || "").trim().slice(0, 180),
      summary: summary || "Таны хэд хэдэн хариултад энэ хэв маяг давтагдан ажиглагдлаа. Энэ нь таныг бүхэлд нь тодорхойлохгүй бөгөөд бүрэн тайланд бусад хүчин зүйлтэй хэрхэн уялдаж байгааг дэлгэрүүлнэ."
    },
    additionalPatternCount: Math.max(0, patterns.length - 1),
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

function publicInitialResult(initialView = {}) {
  if (initialView.schemaVersion !== INITIAL_RESULT_SCHEMA_VERSION) return null;
  const lockedSections = Array.isArray(initialView.lockedSections)
    ? initialView.lockedSections.filter(title => LOCKED_REPORT_TITLES.includes(title))
    : [];
  if (lockedSections.length !== LOCKED_REPORT_TITLES.length) return null;
  if (initialView.mode === "neutral") {
    return {
      mode: "neutral",
      primaryPattern: null,
      summary: String(initialView.summary || NEUTRAL_SUMMARY).slice(0, 900),
      additionalPatternCount: 0,
      lockedSections: [...LOCKED_REPORT_TITLES]
    };
  }
  if (initialView.mode !== "pattern" || !initialView.primaryPattern?.title || !initialView.primaryPattern?.summary) return null;
  return {
    mode: "pattern",
    primaryPattern: {
      title: String(initialView.primaryPattern.title).slice(0, 180),
      summary: String(initialView.primaryPattern.summary).slice(0, 900)
    },
    additionalPatternCount: Math.max(0, Math.min(20, Number(initialView.additionalPatternCount) || 0)),
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

module.exports = {
  INITIAL_RESULT_SCHEMA_VERSION,
  LOCKED_REPORT_TITLES,
  NEUTRAL_SUMMARY,
  shortSentences,
  supportedPatterns,
  buildInitialResult,
  publicInitialResult
};
