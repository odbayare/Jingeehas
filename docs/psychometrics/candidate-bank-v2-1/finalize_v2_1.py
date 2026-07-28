#!/usr/bin/env python3
"""Finalize pilot selection, comparison, synthesis, held register, and manifest."""

from __future__ import annotations

import csv
import hashlib
import json
import os
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
SYNTH = REPO / "docs/psychometrics/synthetic-ai-review"
STATUS = [
    "AI-REVISED CANDIDATE ITEM BANK ONLY",
    "NOT HUMAN-REVIEWED",
    "NOT PSYCHOMETRICALLY VALIDATED",
    "NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
STATUS_TEXT = " | ".join(STATUS)
STATUS_MD = "\n>\n".join(f"> **{line}**" for line in STATUS)
CORE_CONSTRUCTS = {
    "emotional_eating",
    "external_cue_reactivity",
    "uncontrolled_eating",
    "restrictive_rebound",
    "hunger_satiety_awareness",
    "eating_self_efficacy",
    "habit_automaticity",
    "body_image_avoidance",
    "implementation_maintenance_friction",
}
RAW_HASHES = {
    "AI_SECOND_PASS_EXPERT_RAW_V2_1.csv": (
        "c2e065f4beb149e69e403886a93674f90cd25dc3047bf10f43cd816fa2d08d18"
    ),
    "AI_SECOND_PASS_PERSONA_RAW_V2_1.csv": (
        "12818f3b5797c34ef134b12fa8ce6011c4e3b13882179f2d5f835b097de184af"
    ),
}


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, fields: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def iso_mtime(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()


bank_fields, bank = read_csv(ROOT / "ITEM_SPECIFICATION_BANK_V2_1.csv")
trace_fields, trace = read_csv(ROOT / "REVISION_TRACE_V2_1.csv")
_, adjudication = read_csv(ROOT / "SECOND_PASS_ITEM_ADJUDICATION_V2_1.csv")
adj_by_key = {row["revised_item_key"]: row for row in adjudication}
_, first_triage = read_csv(SYNTH / "AI_ITEM_TRIAGE_SUMMARY_V2.csv")
first_by_key = {row["item_key"]: row for row in first_triage}

# Select at most one passing alternative per major-rewrite source on structured evidence.
major_by_source = defaultdict(list)
for row in bank:
    if row["revision_type"] == "major_rewrite_alternative":
        major_by_source[row["source_item_key"]].append(row)


def alternative_score(row: dict[str, str]) -> float:
    adj = adj_by_key[row["item_key"]]
    if adj["second_pass_gate"] != "pass":
        return -1000
    penalty = (
        int(adj["response_scale_mismatch_count"])
        + int(adj["recall_problem_count"])
        + int(adj["judgment_flag_count"])
    )
    return (
        int(adj["expert_pass_count"])
        + 2 * int(adj["persona_correct_paraphrase_count"])
        - 2 * penalty
        - int(adj["expert_moderate_high_overlap_count"]) / 4
    )


selected_major = {}
ab_decisions = {}
for source_key, alternatives in major_by_source.items():
    passing = [row for row in alternatives if adj_by_key[row["item_key"]]["second_pass_gate"] == "pass"]
    if not passing:
        ab_decisions[source_key] = "neither_passed"
        continue
    ranked = sorted(
        passing,
        key=lambda row: (alternative_score(row), row["item_key"]),
        reverse=True,
    )
    selected_major[source_key] = ranked[0]["item_key"]
    ab_decisions[source_key] = (
        f"selected={ranked[0]['item_key']}; structured_score={alternative_score(ranked[0]):.2f}; "
        "selection remains provisional and requires human review"
    )

pilot_keys = set()
for row in bank:
    revision_type = row["revision_type"]
    if revision_type == "unchanged":
        pilot_keys.add(row["item_key"])
    elif revision_type == "minor_rewrite":
        if adj_by_key[row["item_key"]]["second_pass_gate"] == "pass":
            pilot_keys.add(row["item_key"])
    elif revision_type == "major_rewrite_alternative":
        if selected_major.get(row["source_item_key"]) == row["item_key"]:
            pilot_keys.add(row["item_key"])

for row in bank:
    key = row["item_key"]
    if key in pilot_keys:
        row["status"] = (
            "pilot_non_scored_research_candidate"
            if row["construct"] == "response_quality"
            else "pilot_scored_candidate"
        )
    elif row["revision_type"] == "hold":
        row["status"] = "held_excluded"
    elif row["revision_type"] == "major_rewrite_alternative" and (
        adj_by_key[key]["second_pass_gate"] == "pass"
    ):
        row["status"] = "reserve_alternative_human_selection"
    else:
        row["status"] = f"second_pass_{adj_by_key[key]['second_pass_gate']}"
    row["requires_human_review"] = "true"
    row["production_ready"] = "false"
write_csv(ROOT / "ITEM_SPECIFICATION_BANK_V2_1.csv", bank_fields, bank)

for row in trace:
    revised_key = row["revised_item_key"]
    bank_row = next(item for item in bank if item["item_key"] == revised_key)
    row["decision_status"] = bank_row["status"]
    if revised_key in adj_by_key:
        row["construct_preserved"] = adj_by_key[revised_key]["construct_preserved"]
write_csv(ROOT / "REVISION_TRACE_V2_1.csv", trace_fields, trace)

pilot_fields = bank_fields + [
    "pilot_role",
    "second_pass_gate",
    "adjudication_rationale",
]
pilot_rows = []
for row in bank:
    if row["item_key"] not in pilot_keys:
        continue
    copy = dict(row)
    copy["pilot_role"] = (
        "scored_core_candidate"
        if row["construct"] in CORE_CONSTRUCTS
        else "non_scored_research_quality"
    )
    copy["second_pass_gate"] = (
        "not_required_unchanged"
        if row["revision_type"] == "unchanged"
        else adj_by_key[row["item_key"]]["second_pass_gate"]
    )
    copy["adjudication_rationale"] = (
        "Unchanged candidate retained for human review; first-panel retain proposal is not validity evidence."
        if row["revision_type"] == "unchanged"
        else adj_by_key[row["item_key"]]["adjudication_rationale"]
    )
    pilot_rows.append(copy)
write_csv(ROOT / "PILOT_CANDIDATE_BANK_V2_1.csv", pilot_fields, pilot_rows)

held_fields = [
    "item_key",
    "construct",
    "unresolved_issue",
    "evidence_needed",
    "possible_alternatives",
    "decision_owner",
    "next_gate",
    "production_enabled",
    "status_label",
]
held_rows = []
for row in bank:
    if row["item_key"] in pilot_keys:
        continue
    if row["revision_type"] == "hold":
        unresolved = first_by_key[row["source_item_key"]]["unresolved_decision"]
        evidence = "Human methods and ethics review of non-scored instructional-check purpose and burden."
        alternatives = "Move outside scored bank; transparent non-scored instruction check; omit."
    else:
        adj = adj_by_key[row["item_key"]]
        unresolved = adj["remaining_issue"]
        evidence = (
            "Human Mongolian expert review, cognitive interviews, ethics review, and empirical pilot evidence."
        )
        alternatives = (
            "Retain as a reserve A/B candidate for human selection."
            if adj["second_pass_gate"] == "pass"
            else "Revise wording/format and repeat blinded response-process review."
        )
    held_rows.append({
        "item_key": row["item_key"],
        "construct": row["construct"],
        "unresolved_issue": unresolved,
        "evidence_needed": evidence,
        "possible_alternatives": alternatives,
        "decision_owner": "human_scientific_language_ethics_panel",
        "next_gate": "human_review_and_cognitive_interview",
        "production_enabled": "false",
        "status_label": STATUS_TEXT,
    })
write_csv(ROOT / "HELD_ITEMS_V2_1.csv", held_fields, held_rows)

comparison_fields = [
    "source_item_key",
    "revised_item_key",
    "original_misinterpretation_count",
    "revised_misinterpretation_count",
    "original_scale_mismatch_count",
    "revised_scale_mismatch_count",
    "original_recall_problem_count",
    "revised_recall_problem_count",
    "original_judgment_flag_count",
    "revised_judgment_flag_count",
    "original_overlap_flags",
    "revised_overlap_flags",
    "construct_preserved",
    "synthetic_improvement",
    "remaining_issue",
    "pilot_candidate",
    "synthetic_review_only",
    "status_label",
]
comparison_rows = []
for bank_row in bank:
    key = bank_row["item_key"]
    if key not in adj_by_key:
        continue
    source = first_by_key[bank_row["source_item_key"]]
    adj = adj_by_key[key]
    original_rates = [
        int(source["persona_misinterpretation_count"]) / 6,
        int(source["response_scale_mismatch_count"]) / 6,
        int(source["recall_problem_count"]) / 6,
        int(source["judgment_flag_count"]) / 6,
    ]
    revised_rates = [
        int(adj["persona_misinterpretation_count"]) / 4,
        int(adj["response_scale_mismatch_count"]) / 4,
        int(adj["recall_problem_count"]) / 4,
        int(adj["judgment_flag_count"]) / 4,
    ]
    improved = sum(new < old for old, new in zip(original_rates, revised_rates))
    worsened = sum(new > old for old, new in zip(original_rates, revised_rates))
    if improved >= 2 and worsened == 0:
        improvement = "synthetic_rate_improved"
    elif improved and worsened:
        improvement = "mixed_synthetic_change"
    elif worsened and not improved:
        improvement = "synthetic_rate_not_improved"
    else:
        improvement = "no_clear_synthetic_change"
    comparison_rows.append({
        "source_item_key": bank_row["source_item_key"],
        "revised_item_key": key,
        "original_misinterpretation_count": source["persona_misinterpretation_count"],
        "revised_misinterpretation_count": adj["persona_misinterpretation_count"],
        "original_scale_mismatch_count": source["response_scale_mismatch_count"],
        "revised_scale_mismatch_count": adj["response_scale_mismatch_count"],
        "original_recall_problem_count": source["recall_problem_count"],
        "revised_recall_problem_count": adj["recall_problem_count"],
        "original_judgment_flag_count": source["judgment_flag_count"],
        "revised_judgment_flag_count": adj["judgment_flag_count"],
        "original_overlap_flags": source["overlap_flags"],
        "revised_overlap_flags": (
            f"expert_moderate_or_high={adj['expert_moderate_high_overlap_count']}/16"
        ),
        "construct_preserved": adj["construct_preserved"],
        "synthetic_improvement": improvement,
        "remaining_issue": adj["remaining_issue"],
        "pilot_candidate": "true" if key in pilot_keys else "false",
        "synthetic_review_only": "true",
        "status_label": STATUS_TEXT,
    })
write_csv(ROOT / "AI_V2_VS_V2_1_COMPARISON.csv", comparison_fields, comparison_rows)

construct_counts = Counter(
    row["construct"] for row in pilot_rows if row["construct"] in CORE_CONSTRUCTS
)
revision_counts = Counter(row["revision_type"] for row in bank)
pilot_revision_counts = Counter(row["revision_type"] for row in pilot_rows)
scale_changes = Counter(row["response_scale_id"] for row in bank)
recall_changes = Counter(row["recall_period"] for row in bank)
gate_counts = Counter(row["second_pass_gate"] for row in adjudication)
comparison_counts = Counter(row["synthetic_improvement"] for row in comparison_rows)
major_lines = "\n".join(
    f"- `{source}`: {decision}" for source, decision in sorted(ab_decisions.items())
)
coverage_lines = "\n".join(
    f"- `{construct}`: {construct_counts[construct]} scored pilot candidates"
    for construct in sorted(CORE_CONSTRUCTS)
)
held_keys = ", ".join(row["item_key"] for row in held_rows)

synthesis = f"""# Candidate bank V2.1 synthesis

{STATUS_MD}

## STATUS

Documentation/research-only AI-assisted candidate-item development. No item, scale, score, or claim is production-enabled.

## SOURCE BANK

The immutable V2 source contains 56 items at commit `bce10c43a2ee7185bd99be81401ba37d743c863a`. V2.1 accounts for every source item through `source_item_key`; major rewrites have two explicit alternatives and the original held item remains documented.

## REVISION RULES

Minor rewrites preserve the stated primary construct and address repeated synthetic wording concerns. Major rewrites remain A/B candidates until the blinded gate and human review. Removal was not inferred from AI agreement. Non-pilot rows remain traceable in the full candidate bank and held register.

## ITEM COUNTS

- Source items accounted for: 56
- Full V2.1 candidate rows: {len(bank)}
- Unchanged candidates: {revision_counts['unchanged']}
- Minor rewrites: {revision_counts['minor_rewrite']}
- Major-rewrite alternatives: {revision_counts['major_rewrite_alternative']}
- Original held item: {revision_counts['hold']}

## UNCHANGED ITEMS

All {revision_counts['unchanged']} first-panel retain candidates remain in the pilot only as provisional candidates requiring human and empirical gates.

## MINOR REWRITES

{pilot_revision_counts['minor_rewrite']} of {revision_counts['minor_rewrite']} minor rewrites passed the structured second-pass gate. Failed candidates remain documented and are not in the pilot.

## MAJOR REWRITE A/B RESULTS

{major_lines}

Selection uses construct retention, paraphrase accuracy, scale/recall fit, safety flags, and overlap—not stylistic preference. Every selection remains provisional.

## HELD ITEMS

{len(held_rows)} held/reserve rows are excluded from the pilot: {held_keys}

## RESPONSE SCALE CHANGES

Candidate-row distribution: {dict(scale_changes)}. Recent episodic items use opportunity-aware frequency; self-efficacy uses confidence; automaticity uses typicality; body-image uses 30-day opportunity-aware frequency; response-quality items are non-scored agreement candidates. No-opportunity responses are missing, never zero.

## RECALL PERIOD CHANGES

Candidate-row distribution: {dict(recall_changes)}. Fourteen days remains for recent episodic behavior and implementation opportunities. It is not forced onto generalized confidence, typicality, enduring body-image avoidance, or current-questionnaire research-quality items.

## REVERSE-WORDING CHANGES

Construct direction, scoring direction, and wording polarity are separate. All V2.1 candidates set `reverse_coded=false`; favorable capability/flexibility items retain natural `higher_capability` direction pending human-approved scoring design.

## CONSTRUCT COVERAGE

{coverage_lines}

Restrictive rebound has four scored candidates after five minor/major candidates failed second-pass gates across the bank. This meets the documented minimum of four but remains below the 5–6 design target and needs human coverage review.

## CONSTRUCT-OVERLAP RISKS

Item-level adjacent overlap remains explicit in the full bank, adjudication, and comparison files. High overlap especially remains a decision risk for emotional-coping capability, recovery/implementation, hunger/satiety use, and response-quality alternatives.

## SECOND-PASS PANEL

Sixteen independent synthetic expert-role contexts produced 672 rows. Sixteen blinded synthetic target-user persona contexts produced 168 rows, four exposures per changed candidate. No persona saw both alternatives for one source. All runs use one GPT-5.6 model family across two runtime variants; this is not model-family or human-rater diversity.

## BEFORE/AFTER SYNTHETIC RESULTS

Comparison labels: {dict(comparison_counts)}. Counts use six first-pass versus four second-pass persona exposures, so the comparison file labels changes from rates and does not treat raw counts as directly equivalent or as validation evidence.

## PILOT CANDIDATE BANK

The pilot contains {len(pilot_rows)} rows: {sum(r['pilot_role'] == 'scored_core_candidate' for r in pilot_rows)} scored core candidates and {sum(r['pilot_role'] == 'non_scored_research_quality' for r in pilot_rows)} non-scored research-quality candidate. Every row requires human review and has `production_ready=false`.

## REMAINING SCIENTIFIC DECISIONS

Human review must resolve the 14 held/reserve decisions, restrictive-rebound coverage, high-overlap favorable items, automaticity response mode, body-image recall/opportunity handling, non-scored response-quality design, and the scoring treatment of favorable capability items.

## WHAT THIS SUPPORTS

Prioritizing wording and response-mode candidates for human Mongolian review, cognitive interviews, ethics review, and a governed real-data pilot protocol.

## WHAT THIS DOES NOT SUPPORT

Human agreement, lived experience, response-process evidence, clinical inference, factor structure, reliability, validity, norms, percentiles, cut-offs, diagnosis, production scoring, or consumer-facing psychometric claims.

## NEXT GATE

Independent human construct and Mongolian-language review; lived-experience and ethics review; consented cognitive interviews comparing A/B and response modes; then preregistered real-data pilot work with opportunity/missingness analysis.

## FINAL VERDICT

**AI-REVISED AND AI-PRETESTED PILOT CANDIDATE BANK —<br>
NOT HUMAN-REVIEWED —<br>
NOT PSYCHOMETRICALLY VALIDATED —<br>
NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS.**
"""
(ROOT / "CANDIDATE_BANK_V2_1_SYNTHESIS.md").write_text(
    synthesis, encoding="utf-8"
)

authoritative_inputs = [
    REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv",
    REPO / "docs/psychometrics/CONSTRUCT_FRAMEWORK_V2.md",
    REPO / "docs/psychometrics/SCORING_SPECIFICATION_V2.md",
    REPO / "docs/psychometrics/RESPONSE_SCALE_RECALL_AUDIT_V2.md",
    REPO / "docs/psychometrics/REVERSE_ITEM_AUDIT_V2.md",
    REPO / "docs/psychometrics/SCIENTIFIC_DECISION_REGISTER_V2.md",
    SYNTH / "AI_ITEM_TRIAGE_SUMMARY_V2.csv",
    SYNTH / "AI_ITEM_REVISION_CANDIDATES_V2.csv",
    SYNTH / "AI_DISAGREEMENT_REGISTER_V2.md",
    SYNTH / "AI_PANEL_SYNTHESIS_V2.md",
    SYNTH / "AI_EXPERT_REVIEW_RAW_V2.csv",
    SYNTH / "AI_COGNITIVE_SIMULATION_RAW_V2.csv",
]
_, expert_plan = read_csv(ROOT / "SECOND_PASS_EXPERT_RUN_PLAN_V2_1.csv")
_, persona_plan = read_csv(ROOT / "SECOND_PASS_PERSONA_RUN_PLAN_V2_1.csv")
runs = []
for run in expert_plan:
    output = ROOT / run["output_file"]
    runs.append({
        "run_id": run["review_run_id"],
        "run_type": "synthetic_expert_role",
        "role": run["role_name"],
        "model_family": run["model_family"],
        "runtime": run["model_variant"],
        "randomized_order_hash": run["block_order_hash"],
        "execution_timestamp_utc": iso_mtime(output),
        "output_sha256": sha256(output),
    })
for run in persona_plan:
    output = ROOT / run["output_file"]
    runs.append({
        "run_id": run["persona_run_id"],
        "run_type": "synthetic_target_user_persona",
        "role": run["persona_code"],
        "model_family": run["model_family"],
        "runtime": run["model_variant"],
        "randomized_order_hash": run["item_order_hash"],
        "execution_timestamp_utc": iso_mtime(output),
        "output_sha256": sha256(output),
    })
runs.append({
    "run_id": "SP-ADJ-S",
    "run_type": "synthetic_synthesis_adjudication",
    "role": "synthesis",
    "model_family": "GPT-5.6",
    "runtime": "gpt-5.6-sol",
    "randomized_order_hash": hashlib.sha256(
        "\n".join(row["revised_item_key"] for row in adjudication).encode("utf-8")
    ).hexdigest(),
    "execution_timestamp_utc": iso_mtime(
        ROOT / "SECOND_PASS_ITEM_ADJUDICATION_V2_1.csv"
    ),
    "output_sha256": sha256(ROOT / "SECOND_PASS_ITEM_ADJUDICATION_V2_1.csv"),
})

excluded = {
    "CANDIDATE_BANK_V2_1_MANIFEST.json",
    "build_v2_1_inputs.py",
    "validate_second_pass_runs.py",
    "freeze_second_pass_raw.py",
    "finalize_v2_1.py",
    "verify_v2_1.py",
}
output_files = sorted(
    path for path in ROOT.rglob("*")
    if path.is_file() and path.name not in excluded
)
manifest = {
    "status": STATUS,
    "source_commit": "bce10c43a2ee7185bd99be81401ba37d743c863a",
    "branch": "agent/psychometric-v2-1-candidate-bank-20260728",
    "base_branch": "agent/psychometric-v2-ai-panel-20260728",
    "generated_at_utc": datetime.now(timezone.utc).isoformat(),
    "input_hashes": {
        path.relative_to(REPO).as_posix(): sha256(path)
        for path in authoritative_inputs
    },
    "prompt_hashes": {
        "SECOND_PASS_REVIEW_PROTOCOL_V2_1.md": sha256(
            ROOT / "SECOND_PASS_REVIEW_PROTOCOL_V2_1.md"
        ),
        "SECOND_PASS_ADJUDICATION_INPUT_V2_1.json": sha256(
            ROOT / "SECOND_PASS_ADJUDICATION_INPUT_V2_1.json"
        ),
    },
    "model_diversity_statement": (
        "One GPT-5.6 model family; fresh contexts, randomized orders, prompt variants, "
        "and two runtimes do not establish model-family or human-rater diversity."
    ),
    "runs": runs,
    "raw_file_freeze_hashes": RAW_HASHES,
    "output_hashes": {
        path.relative_to(ROOT).as_posix(): sha256(path) for path in output_files
    },
    "manifest_self_hash": None,
    "manifest_self_hash_note": "Excluded to avoid circular hashing.",
    "private_reasoning_stored": False,
    "credentials_stored": False,
    "personal_data_stored": False,
}
(ROOT / "CANDIDATE_BANK_V2_1_MANIFEST.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

for name, expected in RAW_HASHES.items():
    assert sha256(ROOT / name) == expected
print(json.dumps({
    "pilot_rows": len(pilot_rows),
    "scored_core_candidates": sum(
        row["pilot_role"] == "scored_core_candidate" for row in pilot_rows
    ),
    "non_scored_research_quality": sum(
        row["pilot_role"] == "non_scored_research_quality" for row in pilot_rows
    ),
    "construct_counts": dict(sorted(construct_counts.items())),
    "held_or_reserve_rows": len(held_rows),
    "selected_major": selected_major,
    "gate_counts": dict(gate_counts),
}, ensure_ascii=False))
