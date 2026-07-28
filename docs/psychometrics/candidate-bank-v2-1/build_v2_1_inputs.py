#!/usr/bin/env python3
"""Build the V2.1 candidate bank and blinded second-pass input packets."""

from __future__ import annotations

import csv
import hashlib
import json
import random
from collections import Counter, defaultdict
from pathlib import Path


OUT = Path(__file__).resolve().parent
REPO = OUT.parents[2]
SOURCE = REPO / "docs/psychometrics/ITEM_SPECIFICATION_BANK_V2.csv"
SYNTH = REPO / "docs/psychometrics/synthetic-ai-review"
STATUS = [
    "AI-REVISED CANDIDATE ITEM BANK ONLY",
    "NOT HUMAN-REVIEWED",
    "NOT PSYCHOMETRICALLY VALIDATED",
    "NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS",
    "NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS",
]
STATUS_TEXT = " | ".join(STATUS)
FREQ_OPTIONS = (
    "Огт байгаагүй | Ховор | Заримдаа | Олон удаа | Бараг үргэлж | "
    "Ийм нөхцөл тохиолдоогүй"
)
CONF_OPTIONS = (
    "Огт итгэлгүй | Бага зэрэг итгэлтэй | Дунд зэрэг итгэлтэй | "
    "Их итгэлтэй | Маш их итгэлтэй | Ийм нөхцөл тохиолдоогүй"
)
TYPICAL_OPTIONS = (
    "Огт тохирохгүй | Бага зэрэг тохирно | Дунд зэрэг тохирно | "
    "Ихэнхдээ тохирно | Бүрэн тохирно | Ийм давтагддаг нөхцөл байхгүй"
)
AGREE_OPTIONS = (
    "Огт санал нийлэхгүй | Бага зэрэг санал нийлнэ | Дунд зэрэг санал нийлнэ | "
    "Ихэнхдээ санал нийлнэ | Бүрэн санал нийлнэ | Хариулах боломжгүй"
)


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, fields: list[str], rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def digest_text(values: list[str]) -> str:
    return hashlib.sha256("\n".join(values).encode("utf-8")).hexdigest()


source_rows = read_csv(SOURCE)
source_by_key = {row["item_key"]: row for row in source_rows}
triage = {
    row["item_key"]: row
    for row in read_csv(SYNTH / "AI_ITEM_TRIAGE_SUMMARY_V2.csv")
}
revisions = {
    row["item_key"]: row
    for row in read_csv(SYNTH / "AI_ITEM_REVISION_CANDIDATES_V2.csv")
}
assignment_v2 = read_csv(SYNTH / "AI_PERSONA_ITEM_ASSIGNMENT_V2.csv")
original_text = {}
for row in assignment_v2:
    original_text.setdefault(row["item_key"], row["item_text"])

major_b = {
    "EE06": "Таагүй мэдрэмж төрөхөд идэхийн оронд мэдрэмжээ хэсэг хугацаанд тэсвэрлэсэн.",
    "RR04": "Нэг удаа төлөвлөснөөс өөр идсэний дараа дараагийн хоолондоо төлөвлөгөөгөө үргэлжлүүлээгүй.",
    "HS06": "Цадсанаа анзаарсан ч идэхээ зогсоох эсэхээ шийдэхэд хэцүү байсан.",
    "SE06": "Ядарсан үедээ хооллолтын төлөвлөгөөгөө бүрэн биш ч хэсэгчлэн хэрэгжүүлж чадна гэдэгтээ хэр итгэлтэй вэ?",
    "HA02": "Тогтмол хийдэг нэг зүйл дуусмагц юм идэх үйлдэл өөрөө эхэлдэг.",
    "IM03": "Завгүй болсон үедээ урьдчилан сонгосон энгийн хоолны хувилбараа ашигласан.",
    "AC02": "Асуултууд хоорондоо хэт төстэй санагдсан.",
}
major_a_override = {
    "EE06": "Таагүй мэдрэмж төрөхөд хоол идэхээс өөр аргаар өөрийгөө тайвшруулсан.",
    "RR04": "Төлөвлөснөөс өөр идсэний дараа тэр өдрийн хоолны төлөвлөгөөгөө орхисон.",
    "HS06": "Өлсөж эхэлснээ анзаарсан ч идэж эхлэх эсэхээ шийдэхэд хэцүү байсан.",
    "SE06": "Ядарсан үедээ хийхээр сонгосон хооллолтын нэг энгийн алхмыг хийж чадна гэдэгтээ хэр итгэлтэй вэ?",
    "HA02": "Өдөр бүр давтагддаг нэг үйлдлийнхээ дараа бодолгүйгээр юм иддэг.",
    "IM03": "Завгүй өдөр хэрэглэхээр хооллолтын төлөвлөгөөнийхөө энгийн хувилбарыг урьдчилж бэлдсэн.",
    "AC02": "Эдгээр асуултад хариулахдаа өмнөх хариулттайгаа адил сонголт хийх ёстой мэт санагдсан.",
}


def response_contract(construct: str) -> tuple[str, str, str]:
    if construct == "eating_self_efficacy":
        return "Нөхцөлийг төсөөлөн хариулна", "confidence_0_4_na", CONF_OPTIONS
    if construct == "habit_automaticity":
        return "Ерөнхийдөө", "typicality_0_4_na", TYPICAL_OPTIONS
    if construct == "body_image_avoidance":
        return "Сүүлийн 30 хоног", "frequency_30d_opportunity_0_4_na", FREQ_OPTIONS
    if construct == "response_quality":
        return "Одоогийн асуулгын үеэр", "agreement_research_0_4_na", AGREE_OPTIONS
    return "Сүүлийн 14 хоног", "frequency_14d_opportunity_0_4_na", FREQ_OPTIONS


candidate_rows: list[dict[str, object]] = []
trace_rows: list[dict[str, object]] = []
changed_rows: list[dict[str, object]] = []
for source in source_rows:
    key = source["item_key"]
    disposition = triage[key]["proposed_disposition"]
    if disposition == "major_rewrite":
        variants = [
            ("A", major_a_override[key]),
            ("B", major_b[key]),
        ]
    elif disposition == "minor_rewrite":
        variants = [("", revisions[key]["proposed_text"])]
    elif disposition == "hold":
        variants = [("HOLD", original_text[key])]
    else:
        variants = [("", original_text[key])]
    for suffix, text in variants:
        if suffix in {"A", "B"}:
            revised_key = f"{key}-V21-{suffix}"
            revision_type = "major_rewrite_alternative"
            status = "pending_second_pass_ab"
        elif suffix == "HOLD":
            revised_key = f"{key}-V21-HOLD"
            revision_type = "hold"
            status = "held_excluded"
        elif disposition == "minor_rewrite":
            revised_key = f"{key}-V21"
            revision_type = "minor_rewrite"
            status = "pending_second_pass"
        else:
            revised_key = f"{key}-V21"
            revision_type = "unchanged"
            status = "provisional_unchanged_candidate"
        recall, scale_id, options = response_contract(source["construct"])
        favorable = source["reverse_coded"].lower() == "true"
        polarity = "favorable_capability" if favorable else "barrier_or_difficulty"
        scoring_direction = "higher_capability" if favorable else "higher_barrier"
        if source["construct"] == "eating_self_efficacy":
            polarity = "favorable_capability"
            scoring_direction = "higher_capability"
        if source["construct"] == "response_quality":
            scoring_direction = "not_scored"
        overlap = triage[key]["overlap_flags"]
        if key in {"EE06"}:
            overlap += ";emotional_eating_vs_self_efficacy"
        elif key in {"EC06", "HA01", "HA02", "HA04"}:
            overlap += ";external_cue_reactivity_vs_habit_automaticity"
        elif key in {"UC03", "UC06", "HS06"}:
            overlap += ";uncontrolled_eating_vs_hunger_satiety_awareness"
        elif key in {"RR04", "RR06", "IM03", "IM05"}:
            overlap += ";restrictive_rebound_vs_implementation_friction"
        elif key in {"SE05", "RR06"}:
            overlap += ";restrictive_rebound_vs_eating_self_efficacy"
        elif key in {"BI04", "BI06"}:
            overlap += ";body_image_avoidance_vs_restrictive_rebound"
        row = {
            "item_key": revised_key,
            "source_item_key": key,
            "construct": source["construct"],
            "facet": source["facet"],
            "version": "2.1",
            "item_text": text,
            "behavioral_context": source["behavioral_context"],
            "recall_period": recall,
            "response_scale_id": scale_id,
            "response_options": options,
            "wording_polarity": polarity,
            "scoring_direction": scoring_direction,
            "reverse_coded": "false",
            "sensitive": source["sensitive"],
            "status": status,
            "revision_type": revision_type,
            "synthetic_issue_addressed": (
                revisions.get(key, {}).get("issue_addressed", "")
                or triage[key]["unresolved_decision"]
            ),
            "adjacent_overlap": overlap,
            "rationale": (
                "Wording and response mode are candidates for blinded AI pretesting; "
                "construct preservation remains a human and empirical decision."
            ),
            "requires_human_review": "true",
            "production_ready": "false",
            "status_label": STATUS_TEXT,
        }
        candidate_rows.append(row)
        trace_rows.append(
            {
                "source_item_key": key,
                "revised_item_key": revised_key,
                "original_text": original_text[key],
                "revised_text": text,
                "original_response_scale": source["response_scale"],
                "revised_response_scale": scale_id,
                "original_recall_period": source["recall_period"],
                "revised_recall_period": recall,
                "change_type": revision_type,
                "issue_source": "synthetic_panel_v2_and_authoritative_audits",
                "adjudication_support": triage[key]["proposed_disposition"],
                "construct_preserved": "pending_human_confirmation",
                "new_overlap_risk": overlap,
                "decision_status": status,
                "rationale": triage[key]["unresolved_decision"],
                "status_label": STATUS_TEXT,
            }
        )
        if revision_type in {"minor_rewrite", "major_rewrite_alternative"}:
            changed_rows.append(row)

bank_fields = [
    "item_key", "source_item_key", "construct", "facet", "version", "item_text",
    "behavioral_context", "recall_period", "response_scale_id", "response_options",
    "wording_polarity", "scoring_direction", "reverse_coded", "sensitive", "status",
    "revision_type", "synthetic_issue_addressed", "adjacent_overlap", "rationale",
    "requires_human_review", "production_ready", "status_label",
]
trace_fields = [
    "source_item_key", "revised_item_key", "original_text", "revised_text",
    "original_response_scale", "revised_response_scale", "original_recall_period",
    "revised_recall_period", "change_type", "issue_source", "adjudication_support",
    "construct_preserved", "new_overlap_risk", "decision_status", "rationale",
    "status_label",
]
write_csv(OUT / "ITEM_SPECIFICATION_BANK_V2_1.csv", bank_fields, candidate_rows)
write_csv(OUT / "REVISION_TRACE_V2_1.csv", trace_fields, trace_rows)

held_fields = [
    "item_key", "construct", "unresolved_issue", "evidence_needed",
    "possible_alternatives", "decision_owner", "next_gate", "production_enabled",
    "status_label",
]
write_csv(
    OUT / "HELD_ITEMS_V2_1.csv",
    held_fields,
    [{
        "item_key": "AC01-V21-HOLD",
        "construct": "response_quality",
        "unresolved_issue": triage["AC01"]["unresolved_decision"],
        "evidence_needed": "Human methods review of instructional-check purpose, burden, ethics, and non-scored administration.",
        "possible_alternatives": "Move outside scored bank; replace with a transparent non-scored instruction check; omit.",
        "decision_owner": "questionnaire_methods_and_ethics_leads",
        "next_gate": "human_protocol_review",
        "production_enabled": "false",
        "status_label": STATUS_TEXT,
    }],
)

# Blinded identifiers deliberately contain no source or revision information.
rng = random.Random(2026072811)
shuffled_changed = list(changed_rows)
rng.shuffle(shuffled_changed)
blind_map = {}
for index, row in enumerate(shuffled_changed, 1):
    blind_map[row["item_key"]] = f"B{index:03d}"
map_fields = [
    "blinded_item_id", "revised_item_key", "source_item_key", "construct",
    "revision_type", "status_label",
]
write_csv(
    OUT / "SECOND_PASS_BLIND_ITEM_MAP_V2_1.csv",
    map_fields,
    [{
        "blinded_item_id": blind_map[row["item_key"]],
        "revised_item_key": row["item_key"],
        "source_item_key": row["source_item_key"],
        "construct": row["construct"],
        "revision_type": row["revision_type"],
        "status_label": STATUS_TEXT,
    } for row in changed_rows],
)

roles = [
    ("R1", "psychometrician"),
    ("R2", "health_psychology"),
    ("R3", "behavioral_science"),
    ("R4", "dietitian_weight_management"),
    ("R5", "mongolian_language_culture"),
    ("R6", "cognitive_interview_method"),
    ("R7", "ethics_safety"),
    ("R8", "measurement_data_science"),
]
expert_fields = [
    "review_run_id", "role_id", "role_name", "model_family", "model_variant",
    "prompt_variant", "block_order_hash", "input_file", "output_file",
    "synthetic_review_only", "status_label",
]
expert_plan = []
for role_index, (role_id, role_name) in enumerate(roles):
    for variant_index, variant in enumerate(("literal-v2-1", "boundary-v2-1")):
        run_id = f"SP-{role_id}-{'A' if variant_index == 0 else 'B'}"
        local_rng = random.Random(f"expert-{run_id}-20260728")
        major_by_source = defaultdict(dict)
        minor = []
        for row in changed_rows:
            if row["revision_type"] == "major_rewrite_alternative":
                suffix = row["item_key"].rsplit("-", 1)[1]
                major_by_source[row["source_item_key"]][suffix] = row
            else:
                minor.append(row)
        local_rng.shuffle(minor)
        blocks = [[], [], []]
        for index, row in enumerate(minor):
            blocks[index % 3].append(row)
        for source_key, pair in sorted(major_by_source.items()):
            a_block = local_rng.randrange(3)
            b_block = (a_block + local_rng.choice((1, 2))) % 3
            blocks[a_block].append(pair["A"])
            blocks[b_block].append(pair["B"])
        local_rng.shuffle(blocks)
        input_blocks = []
        flat_ids = []
        for block_index, rows in enumerate(blocks, 1):
            local_rng.shuffle(rows)
            block_items = []
            for order_index, row in enumerate(rows, 1):
                flat_ids.append(blind_map[row["item_key"]])
                block_items.append({
                    "item_order_index": order_index,
                    "blinded_item_id": blind_map[row["item_key"]],
                    "construct": row["construct"],
                    "facet": row["facet"],
                    "item_text": row["item_text"],
                    "recall_period": row["recall_period"],
                    "response_scale_id": row["response_scale_id"],
                    "response_options": row["response_options"].split(" | "),
                    "sensitive": row["sensitive"],
                })
            input_blocks.append({"block_id": f"block_{block_index}", "items": block_items})
        model_variant = "gpt-5.6-sol" if (role_index + variant_index) % 2 == 0 else "gpt-5.6-terra"
        payload = {
            "status": STATUS,
            "run": {
                "review_run_id": run_id,
                "role_id": role_id,
                "role_name": role_name,
                "model_family": "GPT-5.6",
                "model_variant": model_variant,
                "prompt_variant": variant,
                "block_order_hash": digest_text(flat_ids),
            },
            "blinding": {
                "original_disposition_visible": False,
                "revision_status_visible": False,
                "revision_rationale_visible": False,
                "original_wording_visible": False,
                "first_panel_output_visible": False,
                "other_run_output_visible": False,
            },
            "contract": {
                "ratings": "integers 1-4",
                "risk_values": ["none", "low", "moderate", "high"],
                "gate_values": ["pass", "revise", "hold"],
                "observable_rationale_only": True,
                "output_columns": [
                    "review_run_id", "role_id", "role_name", "model_family",
                    "model_variant", "prompt_variant", "block_id",
                    "item_order_index", "blinded_item_id",
                    "intended_meaning_retention", "clarity",
                    "single_construct_purity", "response_scale_suitability",
                    "recall_period_suitability", "mongolian_appropriateness",
                    "safety_acceptability", "construct_overlap_risk",
                    "shame_judgment_risk", "social_desirability_risk",
                    "suggested_gate", "observable_rationale",
                    "synthetic_review_only", "status_label",
                ],
            },
            "blocks": input_blocks,
        }
        input_rel = f"second-pass-expert-inputs/{run_id}.json"
        output_rel = f"second-pass-expert-outputs/{run_id}.csv"
        write_json(OUT / input_rel, payload)
        expert_plan.append({
            "review_run_id": run_id,
            "role_id": role_id,
            "role_name": role_name,
            "model_family": "GPT-5.6",
            "model_variant": model_variant,
            "prompt_variant": variant,
            "block_order_hash": digest_text(flat_ids),
            "input_file": input_rel,
            "output_file": output_rel,
            "synthetic_review_only": "true",
            "status_label": STATUS_TEXT,
        })
write_csv(OUT / "SECOND_PASS_EXPERT_RUN_PLAN_V2_1.csv", expert_fields, expert_plan)

# Sixteen new codes reuse balanced, non-identifying descriptor combinations only.
old_matrix = read_csv(SYNTH / "AI_PERSONA_MATRIX_V2.csv")[:16]
persona_matrix = []
for index, row in enumerate(old_matrix, 1):
    copy = dict(row)
    copy["persona_code"] = f"SP{index:02d}"
    copy["status_label"] = STATUS_TEXT
    persona_matrix.append(copy)
persona_fields = list(old_matrix[0].keys())
if "status_label" not in persona_fields:
    persona_fields.append("status_label")
write_csv(OUT / "SECOND_PASS_PERSONA_MATRIX_V2_1.csv", persona_fields, persona_matrix)

# Four exposures per changed candidate; paired alternatives never share a persona.
persona_codes = [row["persona_code"] for row in persona_matrix]
counts = Counter()
construct_counts = defaultdict(Counter)
exposure_sets: dict[str, list[str]] = {}
major_sources = sorted({
    row["source_item_key"] for row in changed_rows
    if row["revision_type"] == "major_rewrite_alternative"
})
row_by_key = {row["item_key"]: row for row in changed_rows}
for source_key in major_sources:
    ranked = sorted(persona_codes, key=lambda code: (counts[code], rng.random()))
    a_people = ranked[:4]
    remaining = [code for code in ranked if code not in a_people]
    b_people = remaining[:4]
    for suffix, people in (("A", a_people), ("B", b_people)):
        key = f"{source_key}-V21-{suffix}"
        exposure_sets[key] = people
        for code in people:
            counts[code] += 1
            construct_counts[code][row_by_key[key]["construct"]] += 1
minor_rows = [row for row in changed_rows if row["revision_type"] == "minor_rewrite"]
rng.shuffle(minor_rows)
for row in minor_rows:
    ranked = sorted(
        persona_codes,
        key=lambda code: (
            counts[code],
            construct_counts[code][row["construct"]],
            rng.random(),
        ),
    )
    people = ranked[:4]
    exposure_sets[row["item_key"]] = people
    for code in people:
        counts[code] += 1
        construct_counts[code][row["construct"]] += 1
assert sum(counts.values()) == len(changed_rows) * 4 == 168
assert max(counts.values()) - min(counts.values()) <= 1
for source_key in major_sources:
    assert not (
        set(exposure_sets[f"{source_key}-V21-A"])
        & set(exposure_sets[f"{source_key}-V21-B"])
    )

assignments = []
persona_items = defaultdict(list)
for row in changed_rows:
    for code in exposure_sets[row["item_key"]]:
        persona_items[code].append(row)
for code in persona_codes:
    local_rng = random.Random(f"persona-{code}-20260728")
    local_rng.shuffle(persona_items[code])
    for order, row in enumerate(persona_items[code], 1):
        assignments.append({
            "persona_code": code,
            "block_order": order,
            "blinded_item_id": blind_map[row["item_key"]],
            "revised_item_key": row["item_key"],
            "source_item_key": row["source_item_key"],
            "assignment_hash": digest_text([
                blind_map[item["item_key"]] for item in persona_items[code]
            ]),
            "synthetic_review_only": "true",
            "status_label": STATUS_TEXT,
        })
persona_assignment_fields = [
    "persona_code", "block_order", "blinded_item_id", "revised_item_key",
    "source_item_key", "assignment_hash", "synthetic_review_only", "status_label",
]
write_csv(
    OUT / "SECOND_PASS_PERSONA_ITEM_ASSIGNMENT_V2_1.csv",
    persona_assignment_fields,
    assignments,
)

persona_plan = []
for persona in persona_matrix:
    code = persona["persona_code"]
    ordered = persona_items[code]
    items_payload = [{
        "block_order": index,
        "blinded_item_id": blind_map[row["item_key"]],
        "item_text": row["item_text"],
        "recall_period": row["recall_period"],
        "response_scale_id": row["response_scale_id"],
        "response_options": row["response_options"].split(" | "),
    } for index, row in enumerate(ordered, 1)]
    model_variant = "gpt-5.6-terra" if int(code[-2:]) % 2 else "gpt-5.6-sol"
    input_rel = f"second-pass-persona-inputs/{code}.json"
    output_rel = f"second-pass-persona-outputs/{code}.csv"
    write_json(OUT / input_rel, {
        "status": STATUS,
        "persona_run_id": f"SPR-{code}",
        "persona_code": code,
        "model_family": "GPT-5.6",
        "model_variant": model_variant,
        "synthetic_persona": {
            key: value for key, value in persona.items()
            if key not in {"persona_code", "synthetic_review_only", "status_label"}
        },
        "blinding": {
            "construct_visible": False,
            "scoring_direction_visible": False,
            "revision_status_visible": False,
            "original_wording_visible": False,
            "expert_results_visible": False,
            "other_persona_output_visible": False,
        },
        "contract": {
            "observable_summary_only": True,
            "output_columns": [
                "persona_run_id", "persona_code", "block_order",
                "blinded_item_id", "paraphrase_mn", "example_situation_mn",
                "recall_period_usable", "selected_response",
                "response_options_fit", "ambiguous_word_or_phrase",
                "asks_more_than_one_thing", "judgmental_or_shaming",
                "socially_desirable_answer_obvious",
                "missing_not_applicable_option", "response_confidence_1_5",
                "observable_decision_summary", "synthetic_review_only",
                "status_label",
            ],
        },
        "items": items_payload,
    })
    persona_plan.append({
        "persona_run_id": f"SPR-{code}",
        "persona_code": code,
        "model_family": "GPT-5.6",
        "model_variant": model_variant,
        "item_order_hash": digest_text([item["blinded_item_id"] for item in items_payload]),
        "input_file": input_rel,
        "output_file": output_rel,
        "item_count": len(items_payload),
        "synthetic_review_only": "true",
        "status_label": STATUS_TEXT,
    })
write_csv(
    OUT / "SECOND_PASS_PERSONA_RUN_PLAN_V2_1.csv",
    [
        "persona_run_id", "persona_code", "model_family", "model_variant",
        "item_order_hash", "input_file", "output_file", "item_count",
        "synthetic_review_only", "status_label",
    ],
    persona_plan,
)

protocol = f"""# V2.1 blinded second-pass AI review protocol

> **{STATUS[0]}**
>
> **{STATUS[1]}**
>
> **{STATUS[2]}**
>
> **{STATUS[3]}**
>
> **{STATUS[4]}**

## Design

The changed candidates are reviewed by eight synthetic expert-role lenses in two fresh contexts each (16 runs) and 16 fresh synthetic target-user persona contexts. All runs use one GPT-5.6 model family across two runtime variants; this is not model-family diversity or human independence.

Expert inputs contain blinded item identifiers, candidate wording, primary construct/facet, recall frame, response mode, options, and sensitivity only. They omit original wording, first-panel disposition, revision status/rationale, first-panel output, and other second-pass output.

Persona inputs contain only the prompt-defined non-identifying persona, blinded identifier, wording, recall frame, response mode, and options. They omit construct, scoring direction, revision status, original wording, and all review results.

Major-rewrite alternatives occur in separate randomized expert blocks. Persona assignment is disjoint within every A/B source pair, so no persona context sees both alternatives.

Only brief structured observable rationales are requested. No hidden reasoning, human evidence, validation statistic, or diagnostic inference is requested or stored.
"""
(OUT / "SECOND_PASS_REVIEW_PROTOCOL_V2_1.md").write_text(protocol, encoding="utf-8")

scale_doc = f"""# V2.1 response-scale, recall, and missing-item rules

> **{STATUS[0]}**
>
> **{STATUS[1]}**
>
> **{STATUS[2]}**
>
> **{STATUS[3]}**
>
> **{STATUS[4]}**

## Candidate response modes

- Recent episodic behavior and implementation opportunity: 14-day occurrence frequency with an explicit no-opportunity category.
- Eating self-efficacy: situational confidence without forcing retrospective 14-day frequency.
- Habit automaticity: general typicality, pending human cognitive comparison against conditional frequency.
- Body-image avoidance: 30-day opportunity-aware frequency, pending ethics and cognitive review.
- Response-quality candidates: current-questionnaire agreement and never included in a construct score.

The no-opportunity/not-applicable category is missing, never zero. A provisional research subscale requires at least 80% valid candidates and at least four valid items. No single imputation is permitted for individual scoring. These candidate rules are not validated and are not production-enabled.

## Wording and scoring direction

Construct direction, scoring direction, and wording polarity are recorded separately. Favorable capability/flexibility wording is not labeled reverse-coded merely to balance numerical direction. All V2.1 candidates currently set `reverse_coded=false`; any future barrier transformation requires an explicit human-approved scoring-version decision after response-process and empirical review.
"""
(OUT / "RESPONSE_SCALE_RULES_V2_1.md").write_text(scale_doc, encoding="utf-8")

print(json.dumps({
    "source_items": len(source_rows),
    "candidate_rows": len(candidate_rows),
    "changed_candidates": len(changed_rows),
    "minor_rewrites": sum(r["revision_type"] == "minor_rewrite" for r in changed_rows),
    "major_alternatives": sum(r["revision_type"] == "major_rewrite_alternative" for r in changed_rows),
    "held": sum(r["revision_type"] == "hold" for r in candidate_rows),
    "expert_runs": len(expert_plan),
    "persona_runs": len(persona_plan),
    "persona_exposures": len(assignments),
    "persona_item_counts": dict(sorted(counts.items())),
}, ensure_ascii=False))
