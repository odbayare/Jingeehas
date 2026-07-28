#!/usr/bin/env python3
"""Combine validated run files, record SHA-256 hashes, and freeze raw outputs."""

from __future__ import annotations

import csv
import hashlib
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
STATUS = [
    "AI-REVISED CANDIDATE ITEM BANK ONLY",
    "NOT HUMAN-REVIEWED",
    "NOT PSYCHOMETRICALLY VALIDATED",
    "NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


validation = subprocess.run(
    ["python3", str(ROOT / "validate_second_pass_runs.py")],
    check=True,
    capture_output=True,
    text=True,
)
counts = json.loads(validation.stdout)
assert counts == {"completed_expert_runs": 16, "completed_persona_runs": 16}

expert_plan = read_csv(ROOT / "SECOND_PASS_EXPERT_RUN_PLAN_V2_1.csv")[1]
persona_plan = read_csv(ROOT / "SECOND_PASS_PERSONA_RUN_PLAN_V2_1.csv")[1]
expert_rows = []
persona_rows = []
expert_fields = None
persona_fields = None
run_hashes = {}
for run in expert_plan:
    path = ROOT / run["output_file"]
    fields, rows = read_csv(path)
    expert_fields = expert_fields or fields
    assert fields == expert_fields and len(rows) == 42
    expert_rows.extend(rows)
    run_hashes[run["review_run_id"]] = sha256(path)
for run in persona_plan:
    path = ROOT / run["output_file"]
    fields, rows = read_csv(path)
    persona_fields = persona_fields or fields
    assert fields == persona_fields and len(rows) == int(run["item_count"])
    persona_rows.extend(rows)
    run_hashes[run["persona_run_id"]] = sha256(path)
assert len(expert_rows) == 672
assert len(persona_rows) == 168

expert_raw = ROOT / "AI_SECOND_PASS_EXPERT_RAW_V2_1.csv"
persona_raw = ROOT / "AI_SECOND_PASS_PERSONA_RAW_V2_1.csv"
write_csv(expert_raw, expert_fields or [], expert_rows)
write_csv(persona_raw, persona_fields or [], persona_rows)
freeze_hashes = {
    "status": STATUS,
    "frozen_at_utc": datetime.now(timezone.utc).isoformat(),
    "AI_SECOND_PASS_EXPERT_RAW_V2_1.csv": sha256(expert_raw),
    "AI_SECOND_PASS_PERSONA_RAW_V2_1.csv": sha256(persona_raw),
    "run_output_hashes": run_hashes,
    "raw_files_immutable_after_this_record": True,
}
(ROOT / "RAW_FREEZE_HASHES_V2_1.json").write_text(
    json.dumps(freeze_hashes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
for directory in (
    ROOT / "second-pass-expert-outputs",
    ROOT / "second-pass-persona-outputs",
):
    for path in directory.glob("*.csv"):
        os.chmod(path, 0o444)
os.chmod(expert_raw, 0o444)
os.chmod(persona_raw, 0o444)
print(json.dumps({
    "expert_rows": len(expert_rows),
    "persona_rows": len(persona_rows),
    "expert_raw_sha256": freeze_hashes[expert_raw.name],
    "persona_raw_sha256": freeze_hashes[persona_raw.name],
}, ensure_ascii=False))
