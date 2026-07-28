#!/usr/bin/env python3
"""Build descriptive synthetic-panel deliverables from frozen structured outputs."""

from __future__ import annotations

import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
SOURCE = REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv"
SOURCE_COMMIT = "e75ee56aeed0fa3c4caa9d2b1861b7b49e16981b"
BRANCH = "agent/psychometric-v2-ai-panel-20260728"
STATUS = [
    "SYNTHETIC AI REVIEW ONLY",
    "NOT HUMAN EXPERT REVIEW",
    "NOT HUMAN COGNITIVE INTERVIEW DATA",
    "NOT PSYCHOMETRIC VALIDATION",
    "NOT SUITABLE FOR EFA, CFA, RELIABILITY, NORMS OR CUT-OFFS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
STATUS_MD = "\n".join(f"> **{line}**\n>" for line in STATUS).rstrip(">")
RATING_FIELDS = [
    "construct_relevance",
    "facet_relevance",
    "clarity",
    "single_construct_purity",
    "response_scale_suitability",
    "recall_period_suitability",
    "mongolian_cultural_appropriateness",
    "safety_ethical_acceptability",
]
DISPOSITIONS = ["retain", "minor_rewrite", "major_rewrite", "remove", "hold"]


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, fields: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def iso_mtime(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()


def true(value: str) -> bool:
    return value.strip().lower() == "true"


def mode(values: list[str]) -> tuple[str, int]:
    counts = Counter(values)
    max_count = max(counts.values())
    # Stable tie-break: more cautious dispositions precede retain.
    caution_order = ["remove", "hold", "major_rewrite", "minor_rewrite", "retain"]
    winners = {value for value, count in counts.items() if count == max_count}
    return next(value for value in caution_order if value in winners), max_count


def item_text(source_row: dict[str, str]) -> str:
    rationale = source_row["rationale"].strip()
    if ": " in rationale:
        return rationale.rsplit(": ", 1)[1].strip()
    assignment = next(row for row in assignments if row["item_key"] == source_row["item_key"])
    return assignment["item_text"].strip()


items = read_csv(SOURCE)
experts = read_csv(ROOT / "AI_EXPERT_REVIEW_RAW_V2.csv")
personas = read_csv(ROOT / "AI_COGNITIVE_SIMULATION_RAW_V2.csv")
assignments = read_csv(ROOT / "AI_PERSONA_ITEM_ASSIGNMENT_V2.csv")
adjudications = {
    code: read_csv(ROOT / f"adjudication-outputs/{code}.csv")
    for code in ("ADJ-P", "ADJ-MN", "ADJ-E", "ADJ-S")
}
expert_by_item: dict[str, list[dict[str, str]]] = defaultdict(list)
persona_by_item: dict[str, list[dict[str, str]]] = defaultdict(list)
for row in experts:
    expert_by_item[row["item_key"]].append(row)
for row in personas:
    persona_by_item[row["item_key"]].append(row)
adj_by_code_item = {
    code: {row["item_key"]: row for row in rows} for code, rows in adjudications.items()
}


metric_fields = [
    "item_key",
    "construct",
    "exact_disposition_agreement_rate",
    "construct_relevance_spread",
    "maximum_rating_spread",
    "role_disagreement_count",
    "persona_exposure_count",
    "persona_paraphrase_mismatch_count",
    "response_option_mismatch_rate",
    "recall_period_difficulty_rate",
    "judgment_shame_flag_rate",
    "reverse_item_confusion_proxy_rate",
    "synthetic_review_only",
]
metric_rows: list[dict[str, object]] = []
triage_rows: list[dict[str, object]] = []
for source_row in items:
    key = source_row["item_key"]
    erows = expert_by_item[key]
    prows = persona_by_item[key]
    synth = adj_by_code_item["ADJ-S"][key]
    disposition_mode, modal_count = mode([row["suggested_disposition"] for row in erows])
    relevance = [int(row["construct_relevance"]) for row in erows]
    rating_spreads = [
        max(int(row[field]) for row in erows) - min(int(row[field]) for row in erows)
        for field in RATING_FIELDS
    ]
    response_mismatch = sum(not true(row["response_options_fit"]) for row in prows)
    recall_problem = sum(not true(row["recall_period_usable"]) for row in prows)
    judgment = sum(true(row["judgmental_or_shaming"]) for row in prows)
    social = sum(true(row["socially_desirable_answer_obvious"]) for row in prows)
    reverse_confusion = (
        response_mismatch if true(source_row["reverse_coded"]) else 0
    )
    overlap_count = sum(
        row["adjacent_construct_overlap"] in {"moderate", "high"} for row in erows
    )
    overlap_flags = (
        f"expert_moderate_or_high={overlap_count}/24;"
        f"synthesis={synth['construct_overlap_concern']}"
    )
    metric_rows.append(
        {
            "item_key": key,
            "construct": source_row["construct"],
            "exact_disposition_agreement_rate": f"{modal_count / 24:.3f}",
            "construct_relevance_spread": max(relevance) - min(relevance),
            "maximum_rating_spread": max(rating_spreads),
            "role_disagreement_count": 24 - modal_count,
            "persona_exposure_count": len(prows),
            "persona_paraphrase_mismatch_count": synth[
                "persona_misinterpretation_count"
            ],
            "response_option_mismatch_rate": f"{response_mismatch / 6:.3f}",
            "recall_period_difficulty_rate": f"{recall_problem / 6:.3f}",
            "judgment_shame_flag_rate": f"{judgment / 6:.3f}",
            "reverse_item_confusion_proxy_rate": f"{reverse_confusion / 6:.3f}",
            "synthetic_review_only": "true",
        }
    )
    triage_rows.append(
        {
            "item_key": key,
            "construct": source_row["construct"],
            "expert_mean_relevance": f"{sum(relevance) / 24:.2f}",
            "expert_rating_range": f"{min(relevance)}-{max(relevance)}",
            "expert_disposition_mode": disposition_mode,
            "expert_disagreement_count": 24 - modal_count,
            "persona_exposure_count": len(prows),
            "persona_correct_paraphrase_count": synth[
                "persona_correct_paraphrase_count"
            ],
            "persona_misinterpretation_count": synth[
                "persona_misinterpretation_count"
            ],
            "response_scale_mismatch_count": response_mismatch,
            "recall_problem_count": recall_problem,
            "judgment_flag_count": judgment,
            "social_desirability_flag_count": social,
            "reverse_confusion_count": reverse_confusion,
            "overlap_flags": overlap_flags,
            "proposed_disposition": synth["proposed_disposition"],
            "revision_priority": synth["revision_priority"],
            "unresolved_decision": synth["unresolved_scientific_decision"],
            "synthetic_review_only": "true",
        }
    )

write_csv(ROOT / "AI_SYNTHETIC_CONSISTENCY_METRICS_V2.csv", metric_fields, metric_rows)
triage_fields = [
    "item_key",
    "construct",
    "expert_mean_relevance",
    "expert_rating_range",
    "expert_disposition_mode",
    "expert_disagreement_count",
    "persona_exposure_count",
    "persona_correct_paraphrase_count",
    "persona_misinterpretation_count",
    "response_scale_mismatch_count",
    "recall_problem_count",
    "judgment_flag_count",
    "social_desirability_flag_count",
    "reverse_confusion_count",
    "overlap_flags",
    "proposed_disposition",
    "revision_priority",
    "unresolved_decision",
    "synthetic_review_only",
]
write_csv(ROOT / "AI_ITEM_TRIAGE_SUMMARY_V2.csv", triage_fields, triage_rows)


revision_fields = [
    "item_key",
    "original_text",
    "proposed_text",
    "change_type",
    "issue_addressed",
    "construct_preserved",
    "response_scale_change",
    "recall_period_change",
    "adjudicator_agreement",
    "requires_human_review",
    "production_ready",
]
revision_rows: list[dict[str, object]] = []
for source_row in items:
    key = source_row["item_key"]
    synth = adj_by_code_item["ADJ-S"][key]
    if synth["proposed_disposition"] == "retain" and not synth[
        "candidate_revised_wording"
    ].strip():
        continue
    all_adj = [adj_by_code_item[code][key] for code in adjudications]
    matching = sum(
        row["proposed_disposition"] == synth["proposed_disposition"] for row in all_adj
    )
    proposed = synth["candidate_revised_wording"].strip()
    if not proposed:
        candidate_counts = Counter(
            row["candidate_revised_wording"].strip()
            for row in all_adj
            if row["candidate_revised_wording"].strip()
        )
        proposed = candidate_counts.most_common(1)[0][0] if candidate_counts else ""
    concerns = []
    if synth["dominant_misunderstanding"]:
        concerns.append(synth["dominant_misunderstanding"])
    for field, label in [
        ("response_scale_mismatch", "response-scale mismatch"),
        ("recall_period_mismatch", "recall-period mismatch"),
        ("social_desirability_concern", "social-desirability cue"),
        ("shame_concern", "judgment/shame cue"),
        ("construct_overlap_concern", "construct overlap"),
        ("reverse_item_concern", "reverse wording"),
    ]:
        if synth[field] in {"moderate", "high"}:
            concerns.append(label)
    revision_rows.append(
        {
            "item_key": key,
            "original_text": item_text(source_row),
            "proposed_text": proposed,
            "change_type": synth["proposed_disposition"],
            "issue_addressed": "; ".join(dict.fromkeys(concerns)) or "human review required",
            "construct_preserved": "requires_human_confirmation",
            "response_scale_change": (
                "evaluate_alternative"
                if synth["response_scale_mismatch"] in {"moderate", "high"}
                else "none_proposed"
            ),
            "recall_period_change": (
                "evaluate_alternative"
                if synth["recall_period_mismatch"] in {"moderate", "high"}
                else "none_proposed"
            ),
            "adjudicator_agreement": f"{matching}/4_same_disposition",
            "requires_human_review": "true",
            "production_ready": "false",
        }
    )
write_csv(
    ROOT / "AI_ITEM_REVISION_CANDIDATES_V2.csv", revision_fields, revision_rows
)


metrics_doc = f"""# Synthetic review consistency metrics V2

{STATUS_MD}

## Scope

These are descriptive **SYNTHETIC REVIEW CONSISTENCY** measures among AI review runs. They are not human agreement, inter-rater reliability, content validity, or any psychometric property. Synthetic selected responses are not scored or analyzed as a sample.

## Operational definitions

- `exact_disposition_agreement_rate`: modal expert-role disposition count divided by 24. Ties use the more cautious disposition only for deterministic reporting.
- `construct_relevance_spread`: maximum minus minimum 1–4 construct-relevance rating.
- `maximum_rating_spread`: largest max-minus-min spread across the eight required 1–4 ratings.
- `role_disagreement_count`: expert-role runs outside the modal disposition.
- `persona_paraphrase_mismatch_count`: synthesis-adjudicator structured classification among six blinded persona exposures.
- mismatch/difficulty/flag rates: corresponding Boolean persona flags divided by six exposures.
- `reverse_item_confusion_proxy_rate`: response-option mismatch rate for source-marked reverse items; zero for non-reverse items. Because persona agents were blinded to reverse status, this is a conservative proxy, not proof of reverse-wording confusion.

The item-triage `expert_mean_relevance` is the arithmetic mean of 24 construct-relevance ratings. `overlap_flags` reports the count of expert-role runs with moderate/high adjacent-overlap risk plus the synthesis concern category.
"""
(ROOT / "AI_SYNTHETIC_CONSISTENCY_METHOD_V2.md").write_text(
    metrics_doc, encoding="utf-8"
)


def keys_matching(predicate) -> list[str]:
    return [row["item_key"] for row in triage_rows if predicate(row)]


major_role = keys_matching(lambda row: int(row["expert_disagreement_count"]) >= 12)
persona_diff = keys_matching(lambda row: int(row["persona_misinterpretation_count"]) >= 2)
boundary = keys_matching(
    lambda row: "synthesis=moderate" in row["overlap_flags"]
    or "synthesis=high" in row["overlap_flags"]
)
scale_disputes = keys_matching(lambda row: int(row["response_scale_mismatch_count"]) >= 2)
recall_disputes = keys_matching(lambda row: int(row["recall_problem_count"]) >= 1)
ethics_disputes = keys_matching(
    lambda row: int(row["judgment_flag_count"]) >= 2
    or adj_by_code_item["ADJ-S"][row["item_key"]]["shame_concern"]
    in {"moderate", "high"}
)
construct_shift = [
    row["item_key"]
    for row in revision_rows
    if row["construct_preserved"] == "requires_human_confirmation"
]
unresolved = keys_matching(lambda row: bool(str(row["unresolved_decision"]).strip()))


def key_list(keys: list[str]) -> str:
    return ", ".join(keys) if keys else "None under the stated descriptive rule."


disagreement_doc = f"""# AI disagreement register V2

{STATUS_MD}

## Interpretation rule

This register exposes differences among synthetic AI runs. Thresholds prioritize review; they do not establish defects, agreement, validity, or item quality.

## Items with major role disagreement

Rule: at least 12 of 24 expert-role runs differ from the modal disposition.

{key_list(major_role)}

## Items understood differently by personas

Rule: synthesis adjudication identifies at least two of six blinded paraphrases as mismatched.

{key_list(persona_diff)}

## Construct-boundary disputes

Rule: synthesis adjudication marks moderate/high construct-overlap concern.

{key_list(boundary)}

## Response-scale disputes

Rule: at least two of six persona exposures flag response-option mismatch.

{key_list(scale_disputes)}

## Recall-period disputes

Rule: at least one of six persona exposures cannot use the recall period.

{key_list(recall_disputes)}

## Ethical/safety disputes

Rule: at least two judgment/shame flags or moderate/high synthesis shame concern.

{key_list(ethics_disputes)}

## Revisions that might create a different construct

Every candidate rewrite requires human confirmation of construct preservation:

{key_list(construct_shift)}

## Decisions AI review cannot resolve

Items with a non-empty synthesis scientific-decision field:

{key_list(unresolved)}

Human construct specialists, Mongolian-language reviewers, lived-experience review, cognitive interviews, ethics review, and empirical validation must resolve these decisions.
"""
(ROOT / "AI_DISAGREEMENT_REGISTER_V2.md").write_text(
    disagreement_doc, encoding="utf-8"
)


disposition_counts = Counter(row["proposed_disposition"] for row in triage_rows)
high_confidence = keys_matching(
    lambda row: int(row["persona_misinterpretation_count"]) >= 3
    or int(row["response_scale_mismatch_count"]) >= 3
    or int(row["judgment_flag_count"]) >= 3
)
human_review = keys_matching(
    lambda row: row["proposed_disposition"] != "retain"
    or bool(str(row["unresolved_decision"]).strip())
)
reverse_risks = keys_matching(lambda row: int(row["reverse_confusion_count"]) >= 2)
shame_risks = keys_matching(
    lambda row: int(row["judgment_flag_count"]) >= 2
    or int(row["social_desirability_flag_count"]) >= 4
)
synthesis_doc = f"""# Synthetic AI panel synthesis V2

{STATUS_MD}

## STATUS

Completed as a documentation/research-only AI pretest. The original 56-item bank remains unchanged.

## PANEL DESIGN

The governed panel used 24 independent synthetic expert-role contexts, 24 blinded synthetic target-user persona contexts, and four separate adjudication contexts. Raw outputs were frozen before adjudication.

## MODEL / CONTEXT DIVERSITY

All runs used one model family, GPT-5.6, across `gpt-5.6-sol` and `gpt-5.6-terra` runtime variants. This is context, order, prompt, and runtime-variant diversity—not model-family diversity and not independent human review.

## EXPERT-ROLE RUNS

Eight prompt-defined roles ran three times each. Every run reviewed all 56 items in its own shuffled order, producing 1,344 structured rows. Runs could not see one another's outputs or prior AI dispositions.

## PERSONA DESIGN

Twenty-four non-identifying persona codes cover balanced prompt-defined dimensions and adversarial interpretation contexts without diagnoses, names, or fabricated histories. Persona diversity does not represent lived experience.

## ITEM EXPOSURE COVERAGE

The assignment contains 336 exposures: 14 items per persona and exactly six persona exposures per item. Persona inputs exclude construct, facet, scoring direction, reverse status, disposition, prior review, and reporting metadata.

## HIGH-CONFIDENCE WORDING DEFECTS

Operational review rule: at least three of six persona paraphrase mismatches, response-option mismatches, or judgment/shame flags. Items prioritized under that synthetic rule: {key_list(high_confidence)}

## CONSTRUCT-BOUNDARY RISKS

Moderate/high synthesis overlap concerns: {key_list(boundary)}

## RESPONSE-SCALE RISKS

At least two of six response-option mismatches: {key_list(scale_disputes)}

## RECALL-PERIOD RISKS

At least one of six recall-period difficulty flags: {key_list(recall_disputes)}

## REVERSE-ITEM RISKS

At least two response-option mismatch flags on source-marked reverse items: {key_list(reverse_risks)} This is a blinded proxy, not proof of reverse-wording confusion.

## ETHICS / SHAME RISKS

At least two judgment/shame flags or at least four obvious-social-desirability flags: {key_list(shame_risks)}

## RETAIN / REWRITE / REMOVE / HOLD COUNTS

- Retain: {disposition_counts.get("retain", 0)}
- Minor rewrite: {disposition_counts.get("minor_rewrite", 0)}
- Major rewrite: {disposition_counts.get("major_rewrite", 0)}
- Remove: {disposition_counts.get("remove", 0)}
- Hold: {disposition_counts.get("hold", 0)}

These are synthesis-adjudicator proposals, not item-bank decisions.

## ITEMS REQUIRING HUMAN REVIEW

All items require the planned human and empirical gates. The following receive explicit priority because the synthetic proposal is not retain or an unresolved scientific decision remains: {key_list(human_review)}

## UNRESOLVED SCIENTIFIC DECISIONS

{key_list(unresolved)}

Item-level decision text is retained in `AI_ITEM_TRIAGE_SUMMARY_V2.csv`; AI review cannot resolve construct boundaries, response processes, cultural fit, safety acceptability, or psychometric behavior.

## WHAT THE AI PANEL CAN SUPPORT

It can prioritize candidate wording for human review, stress-test blinding and assignment procedures, identify recurring textual concerns, refine interview probes, and document reproducible AI-run consistency.

## WHAT THE AI PANEL CANNOT SUPPORT

It cannot support human-expert, user, cultural, clinical, population, factor-structure, reliability, validity, norm, threshold, treatment, or production claims. Synthetic selected responses are not evidence and were not used for prohibited analyses.

## RECOMMENDED NEXT GATE

Conduct independent Mongolian human expert review and ethics review; run consented cognitive interviews with varied target users; revise under version control; then preregister and collect real validation data before any psychometric or production claim.

## FINAL VERDICT

**AI-PRETESTED CANDIDATE ITEM BANK ONLY —<br>
NOT HUMAN-REVIEWED —<br>
NOT PSYCHOMETRICALLY VALIDATED —<br>
NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS.**
"""
(ROOT / "AI_PANEL_SYNTHESIS_V2.md").write_text(synthesis_doc, encoding="utf-8")


input_paths = [
    REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv",
    REPO / "docs/psychometrics/CONSTRUCT_FRAMEWORK_V2.md",
    REPO / "docs/psychometrics/ITEM_BANK_RED_TEAM_AUDIT_V2.md",
    REPO / "docs/psychometrics/CONSTRUCT_OVERLAP_MATRIX_V2.csv",
    REPO / "docs/psychometrics/RESPONSE_SCALE_RECALL_AUDIT_V2.md",
    REPO / "docs/psychometrics/REVERSE_ITEM_AUDIT_V2.md",
    REPO / "docs/psychometrics/EXPERT_REVIEW_PACKET_V2.md",
    REPO / "docs/psychometrics/COGNITIVE_INTERVIEW_GUIDE_V2.md",
    REPO / "docs/psychometrics/SCIENTIFIC_DECISION_REGISTER_V2.md",
    REPO / "docs/psychometrics/PREVALIDATION_CLAIMS_REGISTER_V2.md",
]
expert_plan = read_csv(ROOT / "AI_EXPERT_RUN_PLAN_V2.csv")
persona_plan = read_csv(ROOT / "AI_PERSONA_RUN_PLAN_V2.csv")
adj_plan = read_csv(ROOT / "AI_ADJUDICATION_RUN_PLAN_V2.csv")
assignment_file_hash = sha256(ROOT / "AI_PERSONA_ITEM_ASSIGNMENT_V2.csv")
runs = []
for row in expert_plan:
    output = ROOT / row["output_file"]
    runs.append(
        {
            "run_id": row["review_run_id"],
            "run_type": "synthetic_expert_role",
            "role": row["role_name"],
            "prompt_variant": row["prompt_variant"],
            "model_family": row["model_family"],
            "model_variant": row["model_variant"],
            "execution_timestamp_utc": iso_mtime(output),
            "item_order_hash": row["item_order_hash"],
            "persona_assignment_hash": None,
            "output_sha256": sha256(output),
        }
    )
for row in persona_plan:
    output = ROOT / row["output_file"]
    runs.append(
        {
            "run_id": row["persona_run_id"],
            "run_type": "synthetic_target_user_persona",
            "role": row["persona_code"],
            "prompt_variant": row["prompt_variant"],
            "model_family": row["model_family"],
            "model_variant": row["model_variant"],
            "execution_timestamp_utc": iso_mtime(output),
            "item_order_hash": row["item_order_hash"],
            "persona_assignment_hash": assignment_file_hash,
            "output_sha256": sha256(output),
        }
    )
for row in adj_plan:
    output = ROOT / row["output_file"]
    ordered_keys_hash = hashlib.sha256(
        "\n".join(record["item_key"] for record in read_csv(output)).encode("utf-8")
    ).hexdigest()
    runs.append(
        {
            "run_id": row["adjudicator_id"],
            "run_type": "synthetic_adjudication",
            "role": row["adjudicator_lens"],
            "prompt_variant": "adjudication-base-v2",
            "model_family": row["model_family"],
            "model_variant": row["model_variant"],
            "execution_timestamp_utc": iso_mtime(output),
            "item_order_hash": ordered_keys_hash,
            "persona_assignment_hash": assignment_file_hash,
            "output_sha256": sha256(output),
        }
    )

output_files = sorted(
    path
    for path in ROOT.rglob("*")
    if path.is_file()
    and path.name
    not in {
        "AI_PANEL_MANIFEST_V2.json",
        "build_panel_deliverables.py",
        "verify_panel_deliverables.py",
    }
)
manifest = {
    "status": STATUS,
    "source_commit": SOURCE_COMMIT,
    "branch": BRANCH,
    "base_branch": "agent/psychometric-v2-blueprint-20260728",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "model_diversity_statement": (
        "One model family (GPT-5.6); independent contexts, shuffled orders, prompt "
        "variants, and two runtime variants do not constitute model-family diversity."
    ),
    "input_file_hashes": {
        path.relative_to(REPO).as_posix(): sha256(path) for path in input_paths
    },
    "prompt_version_hashes": {
        "AI_PANEL_PROMPTS_V2.md": sha256(ROOT / "AI_PANEL_PROMPTS_V2.md"),
        "AI_PANEL_ROLE_DEFINITIONS_V2.md": sha256(
            ROOT / "AI_PANEL_ROLE_DEFINITIONS_V2.md"
        ),
        "expert-base-v2": sha256(ROOT / "AI_PANEL_PROMPTS_V2.md"),
        "persona-base-v2": sha256(ROOT / "AI_PANEL_PROMPTS_V2.md"),
        "adjudication-base-v2": sha256(ROOT / "AI_PANEL_PROMPTS_V2.md"),
    },
    "persona_assignment_hash": assignment_file_hash,
    "frozen_raw_output_hashes": {
        "AI_EXPERT_REVIEW_RAW_V2.csv": sha256(
            ROOT / "AI_EXPERT_REVIEW_RAW_V2.csv"
        ),
        "AI_COGNITIVE_SIMULATION_RAW_V2.csv": sha256(
            ROOT / "AI_COGNITIVE_SIMULATION_RAW_V2.csv"
        ),
    },
    "runs": runs,
    "output_file_hashes": {
        path.relative_to(ROOT).as_posix(): sha256(path) for path in output_files
    },
    "manifest_self_hash": None,
    "manifest_self_hash_note": "Excluded to avoid a circular hash.",
    "private_reasoning_stored": False,
    "credentials_stored": False,
}
(ROOT / "AI_PANEL_MANIFEST_V2.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)


assert len(items) == 56 and len({row["item_key"] for row in items}) == 56
assert len({row["review_run_id"] for row in experts}) == 24
assert len(experts) == 1344
assert len(read_csv(ROOT / "AI_PERSONA_MATRIX_V2.csv")) == 24
assert len(personas) == 336
assert {len(rows) for rows in persona_by_item.values()} == {6}
assert len(triage_rows) == 56
assert all(row["synthetic_review_only"] == "true" for row in triage_rows)
assert all(row["requires_human_review"] == "true" for row in revision_rows)
assert all(row["production_ready"] == "false" for row in revision_rows)
assert sha256(ROOT / "AI_EXPERT_REVIEW_RAW_V2.csv") == (
    "ec75e5c116b816c422671f2f6bf9dd8aa2839ff9556462483c0bbfdaa64d4cf9"
)
assert sha256(ROOT / "AI_COGNITIVE_SIMULATION_RAW_V2.csv") == (
    "bf64d30bc7918ce5b88fdf0ee2291f36178622da6fb2e230bcf51434ad42747f"
)
json.loads((ROOT / "AI_PANEL_MANIFEST_V2.json").read_text(encoding="utf-8"))
print(
    json.dumps(
        {
            "triage_rows": len(triage_rows),
            "revision_candidates": len(revision_rows),
            "disposition_counts": dict(disposition_counts),
            "human_review_priority_items": len(human_review),
        },
        ensure_ascii=False,
    )
)
