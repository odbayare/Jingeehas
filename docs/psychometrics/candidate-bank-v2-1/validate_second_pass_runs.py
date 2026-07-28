#!/usr/bin/env python3
"""Validate completed blinded second-pass run outputs without changing them."""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
STATUS = [
    "AI-REVISED CANDIDATE ITEM BANK ONLY",
    "NOT HUMAN-REVIEWED",
    "NOT PSYCHOMETRICALLY VALIDATED",
    "NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
STATUS_TEXT = " | ".join(STATUS)


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        assert reader.fieldnames
        assert all(None not in row for row in rows)
        return reader.fieldnames, rows


expert_plan = list(csv.DictReader(
    (ROOT / "SECOND_PASS_EXPERT_RUN_PLAN_V2_1.csv").open(encoding="utf-8")
))
persona_plan = list(csv.DictReader(
    (ROOT / "SECOND_PASS_PERSONA_RUN_PLAN_V2_1.csv").open(encoding="utf-8")
))
completed_experts = 0
completed_personas = 0
for run in expert_plan:
    output = ROOT / run["output_file"]
    if not output.exists():
        continue
    payload = json.loads((ROOT / run["input_file"]).read_text(encoding="utf-8"))
    expected_columns = payload["contract"]["output_columns"]
    fields, rows = read_csv(output)
    assert fields == expected_columns, output
    expected = [
        (block["block_id"], str(item["item_order_index"]), item["blinded_item_id"])
        for block in payload["blocks"] for item in block["items"]
    ]
    actual = [
        (row["block_id"], row["item_order_index"], row["blinded_item_id"])
        for row in rows
    ]
    assert actual == expected, output
    assert len(rows) == 42
    for row in rows:
        assert row["review_run_id"] == run["review_run_id"]
        assert row["role_id"] == run["role_id"]
        assert row["role_name"] == run["role_name"]
        assert row["model_family"] == run["model_family"]
        assert row["model_variant"] == run["model_variant"]
        assert row["prompt_variant"] == run["prompt_variant"]
        for field in [
            "intended_meaning_retention", "clarity", "single_construct_purity",
            "response_scale_suitability", "recall_period_suitability",
            "mongolian_appropriateness", "safety_acceptability",
        ]:
            assert 1 <= int(row[field]) <= 4
        for field in [
            "construct_overlap_risk", "shame_judgment_risk",
            "social_desirability_risk",
        ]:
            assert row[field] in {"none", "low", "moderate", "high"}
        assert row["suggested_gate"] in {"pass", "revise", "hold"}
        assert row["observable_rationale"].strip()
        assert row["synthetic_review_only"] == "true"
        assert row["status_label"] == STATUS_TEXT
    completed_experts += 1

for run in persona_plan:
    output = ROOT / run["output_file"]
    if not output.exists():
        continue
    payload = json.loads((ROOT / run["input_file"]).read_text(encoding="utf-8"))
    expected_columns = payload["contract"]["output_columns"]
    fields, rows = read_csv(output)
    assert fields == expected_columns, output
    expected = [
        (str(item["block_order"]), item["blinded_item_id"])
        for item in payload["items"]
    ]
    actual = [(row["block_order"], row["blinded_item_id"]) for row in rows]
    assert actual == expected, output
    assert len(rows) == int(run["item_count"])
    for row in rows:
        assert row["persona_run_id"] == run["persona_run_id"]
        assert row["persona_code"] == run["persona_code"]
        for field in [
            "recall_period_usable", "response_options_fit",
            "asks_more_than_one_thing", "judgmental_or_shaming",
            "socially_desirable_answer_obvious", "missing_not_applicable_option",
        ]:
            assert row[field] in {"true", "false"}
        assert 1 <= int(row["response_confidence_1_5"]) <= 5
        assert row["paraphrase_mn"].strip()
        assert row["observable_decision_summary"].strip()
        assert row["synthetic_review_only"] == "true"
        assert row["status_label"] == STATUS_TEXT
    completed_personas += 1

print(json.dumps({
    "completed_expert_runs": completed_experts,
    "completed_persona_runs": completed_personas,
}, ensure_ascii=False))
