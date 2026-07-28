#!/usr/bin/env python3
"""Verify panel coverage, blinding, provenance, immutability, and file safety."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import stat
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
STATUS = [
    "SYNTHETIC AI REVIEW ONLY",
    "NOT HUMAN EXPERT REVIEW",
    "NOT HUMAN COGNITIVE INTERVIEW DATA",
    "NOT PSYCHOMETRIC VALIDATION",
    "NOT SUITABLE FOR EFA, CFA, RELIABILITY, NORMS OR CUT-OFFS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
RAW_HASHES = {
    "AI_EXPERT_REVIEW_RAW_V2.csv": (
        "ec75e5c116b816c422671f2f6bf9dd8aa2839ff9556462483c0bbfdaa64d4cf9"
    ),
    "AI_COGNITIVE_SIMULATION_RAW_V2.csv": (
        "bf64d30bc7918ce5b88fdf0ee2291f36178622da6fb2e230bcf51434ad42747f"
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
        assert all(None not in row for row in rows), f"overflow field in {path}"
        return reader.fieldnames, rows


_, source = read_csv(REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv")
source_keys = [row["item_key"] for row in source]
assert len(source_keys) == len(set(source_keys)) == 56

csv_files = sorted(ROOT.rglob("*.csv"))
parsed = {path: read_csv(path) for path in csv_files}
assert all(rows for _, rows in parsed.values())
for path, (fields, rows) in parsed.items():
    if "synthetic_review_only" in fields:
        assert {row["synthetic_review_only"] for row in rows} == {"true"}, path

expert_fields, experts = parsed[ROOT / "AI_EXPERT_REVIEW_RAW_V2.csv"]
assert len(experts) == 1344
assert len({row["review_run_id"] for row in experts}) == 24
assert len({(row["review_run_id"], row["item_key"]) for row in experts}) == 1344
for run_id in {row["review_run_id"] for row in experts}:
    run_rows = [row for row in experts if row["review_run_id"] == run_id]
    assert len(run_rows) == 56
    assert {row["item_key"] for row in run_rows} == set(source_keys)
    assert all(1 <= int(row[field]) <= 4 for row in run_rows for field in [
        "construct_relevance",
        "facet_relevance",
        "clarity",
        "single_construct_purity",
        "response_scale_suitability",
        "recall_period_suitability",
        "mongolian_cultural_appropriateness",
        "safety_ethical_acceptability",
    ])

_, expert_plan = parsed[ROOT / "AI_EXPERT_RUN_PLAN_V2.csv"]
assert len(expert_plan) == 24
assert Counter(row["role_id"] for row in expert_plan) == {
    f"R{index}": 3 for index in range(1, 9)
}
assert len({row["item_order_hash"] for row in expert_plan}) == 24
assert {row["model_family"] for row in expert_plan} == {"GPT-5.6"}

_, matrix = parsed[ROOT / "AI_PERSONA_MATRIX_V2.csv"]
assert len(matrix) == 24
assert {row["persona_code"] for row in matrix} == {
    f"P{index:02d}" for index in range(1, 25)
}
required_dimensions = {
    "age_band",
    "gender",
    "setting",
    "education_reading_comfort",
    "work_pattern",
    "caregiving_load",
    "digital_literacy",
    "prior_weight_loss_attempt",
    "schedule_pressure",
    "cost_pressure",
    "movement_context",
    "emotional_eating_tendency",
    "body_image_concern",
    "prior_strict_diet_experience",
}
assert required_dimensions <= set(matrix[0])

_, assignments = parsed[ROOT / "AI_PERSONA_ITEM_ASSIGNMENT_V2.csv"]
assert len(assignments) == 336
assert len({(row["persona_code"], row["item_key"]) for row in assignments}) == 336
assert set(Counter(row["persona_code"] for row in assignments).values()) == {14}
assert set(Counter(row["item_key"] for row in assignments).values()) == {6}
assert {row["item_key"] for row in assignments} == set(source_keys)

_, personas = parsed[ROOT / "AI_COGNITIVE_SIMULATION_RAW_V2.csv"]
assert len(personas) == 336
assert {
    (row["persona_code"], row["item_key"]) for row in personas
} == {(row["persona_code"], row["item_key"]) for row in assignments}

allowed_item_keys = {
    "block_order",
    "item_key",
    "item_text",
    "recall_period",
    "response_scale",
    "response_options",
}
for path in sorted((ROOT / "persona-run-inputs").glob("*.json")):
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == STATUS
    assert len(payload["items"]) == 14
    assert all(set(item) == allowed_item_keys for item in payload["items"])
    assert payload["blinding"] == {
        "construct_visible": False,
        "facet_visible": False,
        "scoring_direction_visible": False,
        "reverse_status_visible": False,
        "disposition_visible": False,
        "expert_outputs_visible": False,
        "report_interpretation_visible": False,
    }

for path in sorted((ROOT / "expert-run-inputs").glob("*.json")):
    payload = json.loads(path.read_text(encoding="utf-8"))
    assert payload["status"] == STATUS
    assert len(payload["items"]) == 56
    assert payload["blinding"]["prior_dispositions_visible"] is False
    assert payload["blinding"]["other_run_outputs_visible"] is False
    assert payload["blinding"]["red_team_audit_visible"] is False

for code in ("ADJ-P", "ADJ-MN", "ADJ-E", "ADJ-S"):
    path = ROOT / f"adjudication-outputs/{code}.csv"
    fields, rows = parsed[path]
    assert len(rows) == 56
    assert {row["item_key"] for row in rows} == set(source_keys)
    assert len(fields) == (20 if code == "ADJ-S" else 18)

triage_fields, triage = parsed[ROOT / "AI_ITEM_TRIAGE_SUMMARY_V2.csv"]
assert len(triage) == 56
assert triage_fields[-1] == "synthetic_review_only"
assert {row["synthetic_review_only"] for row in triage} == {"true"}
assert {row["persona_exposure_count"] for row in triage} == {"6"}

_, revisions = parsed[ROOT / "AI_ITEM_REVISION_CANDIDATES_V2.csv"]
assert {row["item_key"] for row in revisions} <= set(source_keys)
assert all(row["original_text"] for row in revisions)
assert {row["requires_human_review"] for row in revisions} == {"true"}
assert {row["production_ready"] for row in revisions} == {"false"}

for name, expected in RAW_HASHES.items():
    path = ROOT / name
    assert sha256(path) == expected
    assert not path.stat().st_mode & (stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH)
for path in (ROOT / "expert-run-outputs").glob("*.csv"):
    assert not path.stat().st_mode & (stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH)
for path in (ROOT / "persona-run-outputs").glob("*.csv"):
    assert not path.stat().st_mode & (stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH)
for path in (ROOT / "adjudication-outputs").glob("*.csv"):
    assert not path.stat().st_mode & (stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH)

for path in ROOT.glob("*.md"):
    text = path.read_text(encoding="utf-8")
    assert all(line in text for line in STATUS), path

for path in ROOT.rglob("*.json"):
    payload = json.loads(path.read_text(encoding="utf-8"))
    if path.name != "AI_PANEL_MANIFEST_V2.json":
        assert payload["status"] == STATUS, path

manifest_path = ROOT / "AI_PANEL_MANIFEST_V2.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
assert manifest["status"] == STATUS
assert manifest["source_commit"] == "e75ee56aeed0fa3c4caa9d2b1861b7b49e16981b"
assert manifest["branch"] == "agent/psychometric-v2-ai-panel-20260728"
assert len(manifest["runs"]) == 52
assert len({run["run_id"] for run in manifest["runs"]}) == 52
assert all(run["execution_timestamp_utc"] for run in manifest["runs"])
assert all(run["item_order_hash"] for run in manifest["runs"])
for relative, expected in manifest["output_file_hashes"].items():
    assert sha256(ROOT / relative) == expected, relative
for relative, expected in manifest["input_file_hashes"].items():
    assert sha256(REPO / relative) == expected, relative

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
for fields, _ in parsed.values():
    lowered = {field.lower() for field in fields}
    assert not lowered & {
        "factor_loading",
        "cronbach_alpha",
        "mcdonald_omega",
        "item_total_correlation",
        "test_retest_reliability",
        "population_percentile",
        "clinical_threshold",
        "predictive_validity",
    }

print(
    json.dumps(
        {
            "csv_files_parsed": len(csv_files),
            "source_items": len(source),
            "expert_runs": len({row["review_run_id"] for row in experts}),
            "expert_rows": len(experts),
            "personas": len(matrix),
            "persona_rows": len(personas),
            "persona_exposures_per_item": 6,
            "adjudicators": 4,
            "triage_rows": len(triage),
            "revision_candidates": len(revisions),
            "manifest_runs": len(manifest["runs"]),
            "frozen_raw_hashes_verified": True,
        },
        ensure_ascii=False,
    )
)
