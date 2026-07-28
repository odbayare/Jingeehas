#!/usr/bin/env python3
"""Comprehensive V2.1 governance, coverage, blinding, and integrity checks."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import stat
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
STATUS = [
    "AI-REVISED CANDIDATE ITEM BANK ONLY",
    "NOT HUMAN-REVIEWED",
    "NOT PSYCHOMETRICALLY VALIDATED",
    "NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
STATUS_TEXT = " | ".join(STATUS)
CORE = {
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


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        assert reader.fieldnames
        assert None not in reader.fieldnames
        assert all(None not in row for row in rows), path
        return list(reader.fieldnames), rows


csv_files = sorted(ROOT.rglob("*.csv"))
parsed = {path: read_csv(path) for path in csv_files}
assert all(rows for _, rows in parsed.values())
for path, (fields, rows) in parsed.items():
    if "status_label" in fields:
        assert {row["status_label"] for row in rows} == {STATUS_TEXT}, path
    if "synthetic_review_only" in fields:
        assert {row["synthetic_review_only"] for row in rows} == {"true"}, path

source_path = REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv"
_, source = read_csv(source_path)
source_keys = {row["item_key"] for row in source}
assert len(source) == len(source_keys) == 56

bank_fields, bank = parsed[ROOT / "ITEM_SPECIFICATION_BANK_V2_1.csv"]
assert len(bank) == 63
assert len({row["item_key"] for row in bank}) == 63
assert {row["source_item_key"] for row in bank} == source_keys
assert all(row["construct"] and row["facet"] for row in bank)
assert all(row["requires_human_review"] == "true" for row in bank)
assert all(row["production_ready"] == "false" for row in bank)
assert all(row["reverse_coded"] == "false" for row in bank)
assert Counter(row["revision_type"] for row in bank) == {
    "unchanged": 20,
    "minor_rewrite": 28,
    "major_rewrite_alternative": 14,
    "hold": 1,
}
source_mapping = Counter(row["source_item_key"] for row in bank)
assert set(source_mapping.values()) == {1, 2}
assert sum(value == 2 for value in source_mapping.values()) == 7

trace_fields, trace = parsed[ROOT / "REVISION_TRACE_V2_1.csv"]
assert len(trace) == 63
assert {row["revised_item_key"] for row in trace} == {
    row["item_key"] for row in bank
}
assert all(row["source_item_key"] in source_keys for row in trace)

pilot_fields, pilot = parsed[ROOT / "PILOT_CANDIDATE_BANK_V2_1.csv"]
assert len(pilot) == 49
assert len({row["item_key"] for row in pilot}) == 49
assert all(row["production_ready"] == "false" for row in pilot)
assert Counter(row["pilot_role"] for row in pilot) == {
    "scored_core_candidate": 48,
    "non_scored_research_quality": 1,
}
coverage = Counter(
    row["construct"] for row in pilot if row["pilot_role"] == "scored_core_candidate"
)
assert set(coverage) == CORE
assert all(4 <= coverage[construct] <= 6 for construct in CORE)

_, held = parsed[ROOT / "HELD_ITEMS_V2_1.csv"]
assert len(held) == 14
assert {row["production_enabled"] for row in held} == {"false"}
assert not ({row["item_key"] for row in held} & {row["item_key"] for row in pilot})
assert "AC01-V21-HOLD" in {row["item_key"] for row in held}

_, comparison = parsed[ROOT / "AI_V2_VS_V2_1_COMPARISON.csv"]
assert len(comparison) == 42
assert len({row["revised_item_key"] for row in comparison}) == 42
assert all(row["source_item_key"] in source_keys for row in comparison)
assert {row["synthetic_review_only"] for row in comparison} == {"true"}

_, expert_plan = parsed[ROOT / "SECOND_PASS_EXPERT_RUN_PLAN_V2_1.csv"]
_, persona_plan = parsed[ROOT / "SECOND_PASS_PERSONA_RUN_PLAN_V2_1.csv"]
assert len(expert_plan) == 16 and len(persona_plan) == 16
assert Counter(row["role_id"] for row in expert_plan) == {
    f"R{index}": 2 for index in range(1, 9)
}
assert {row["model_family"] for row in expert_plan + persona_plan} == {"GPT-5.6"}

_, expert_raw = parsed[ROOT / "AI_SECOND_PASS_EXPERT_RAW_V2_1.csv"]
_, persona_raw = parsed[ROOT / "AI_SECOND_PASS_PERSONA_RAW_V2_1.csv"]
assert len(expert_raw) == 672
assert len({row["review_run_id"] for row in expert_raw}) == 16
assert set(Counter(row["review_run_id"] for row in expert_raw).values()) == {42}
assert len({
    (row["review_run_id"], row["blinded_item_id"]) for row in expert_raw
}) == 672
assert len(persona_raw) == 168
assert len({row["persona_code"] for row in persona_raw}) == 16

_, assignment = parsed[ROOT / "SECOND_PASS_PERSONA_ITEM_ASSIGNMENT_V2_1.csv"]
assert len(assignment) == 168
assert {
    (row["persona_code"], row["blinded_item_id"]) for row in persona_raw
} == {
    (row["persona_code"], row["blinded_item_id"]) for row in assignment
}
assert set(Counter(row["persona_code"] for row in assignment).values()) == {10, 11}
assert set(Counter(row["revised_item_key"] for row in assignment).values()) == {4}
by_persona_source = defaultdict(list)
for row in assignment:
    by_persona_source[(row["persona_code"], row["source_item_key"])].append(
        row["revised_item_key"]
    )
assert all(len(items) == 1 for items in by_persona_source.values())

allowed_persona_item_keys = {
    "block_order",
    "blinded_item_id",
    "item_text",
    "recall_period",
    "response_scale_id",
    "response_options",
}
for path in (ROOT / "second-pass-persona-inputs").glob("*.json"):
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == STATUS
    assert all(set(item) == allowed_persona_item_keys for item in payload["items"])
    assert payload["blinding"] == {
        "construct_visible": False,
        "scoring_direction_visible": False,
        "revision_status_visible": False,
        "original_wording_visible": False,
        "expert_results_visible": False,
        "other_persona_output_visible": False,
    }
for path in (ROOT / "second-pass-expert-inputs").glob("*.json"):
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == STATUS
    assert payload["blinding"] == {
        "original_disposition_visible": False,
        "revision_status_visible": False,
        "revision_rationale_visible": False,
        "original_wording_visible": False,
        "first_panel_output_visible": False,
        "other_run_output_visible": False,
    }

_, adjudication = parsed[ROOT / "SECOND_PASS_ITEM_ADJUDICATION_V2_1.csv"]
assert len(adjudication) == 42
assert Counter(row["second_pass_gate"] for row in adjudication) == {
    "pass": 35,
    "revise": 4,
    "hold": 3,
}
for row in adjudication:
    assert (
        int(row["expert_pass_count"])
        + int(row["expert_revise_count"])
        + int(row["expert_hold_count"])
        == 16
    )
    assert (
        int(row["persona_correct_paraphrase_count"])
        + int(row["persona_misinterpretation_count"])
        == 4
    )

for name, expected in RAW_HASHES.items():
    path = ROOT / name
    assert sha256(path) == expected
    assert not path.stat().st_mode & (stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH)
for directory in (
    ROOT / "second-pass-expert-outputs",
    ROOT / "second-pass-persona-outputs",
):
    for path in directory.glob("*.csv"):
        assert not path.stat().st_mode & (
            stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH
        )

for path in ROOT.glob("*.md"):
    text = path.read_text(encoding="utf-8")
    assert all(label in text for label in STATUS), path
for path in ROOT.rglob("*.json"):
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == STATUS, path

manifest_path = ROOT / "CANDIDATE_BANK_V2_1_MANIFEST.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
assert manifest["source_commit"] == "bce10c43a2ee7185bd99be81401ba37d743c863a"
assert manifest["branch"] == "agent/psychometric-v2-1-candidate-bank-20260728"
assert manifest["raw_file_freeze_hashes"] == RAW_HASHES
assert len(manifest["runs"]) == 33
assert len({run["run_id"] for run in manifest["runs"]}) == 33
for relative, expected in manifest["input_hashes"].items():
    assert sha256(REPO / relative) == expected, relative
for relative, expected in manifest["output_hashes"].items():
    assert sha256(ROOT / relative) == expected, relative

all_text = "\n".join(
    path.read_text(encoding="utf-8", errors="replace")
    for path in ROOT.rglob("*")
    if path.is_file() and path.suffix != ".py"
)
assert not re.search(r"/Users/|/private/tmp/", all_text)
assert not re.search(
    r"(?i)(api[_-]?key\\s*[:=]|access[_-]?token\\s*[:=]|bearer\\s+[A-Za-z0-9._-]{12,})",
    all_text,
)
assert "production_ready,true" not in all_text
assert "production_enabled,true" not in all_text
for fields, _ in parsed.values():
    assert not set(field.lower() for field in fields) & {
        "factor_loading",
        "cronbach_alpha",
        "mcdonald_omega",
        "item_total_correlation",
        "population_percentile",
        "clinical_cutoff",
        "diagnosis",
    }

print(json.dumps({
    "csv_files_parsed": len(csv_files),
    "source_items_accounted": len(source_keys),
    "candidate_rows": len(bank),
    "trace_rows": len(trace),
    "expert_runs": 16,
    "expert_rows": len(expert_raw),
    "persona_runs": 16,
    "persona_rows": len(persona_raw),
    "exposures_per_changed_candidate": 4,
    "adjudicated_candidates": len(adjudication),
    "pilot_rows": len(pilot),
    "scored_core_candidates": 48,
    "non_scored_research_quality": 1,
    "construct_coverage": dict(sorted(coverage.items())),
    "held_or_reserve_rows": len(held),
    "raw_hashes_verified": True,
}, ensure_ascii=False))
