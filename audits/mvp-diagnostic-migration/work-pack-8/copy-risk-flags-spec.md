# Work Pack 8 Copy Risk Flags Spec

This spec defines future copy risk flags for a test-only copy decision prototype. It does not implement flags in runtime code.

| Flag | Meaning | When triggered | Required copy guardrail | Runtime gate implication |
| --- | --- | --- | --- | --- |
| `restriction_rebound_shame_risk` | Copy could make the user feel weak, failed, or morally judged after restriction/rebound. | Trigger for `all_or_nothing_restriction_rebound` and any future punishment/restriction fixture. | Use non-shaming language; say rebound is not discipline failure. | Runtime copy blocked until shame-language checks pass. |
| `hunger_safety_underexplains_rebound` | `hunger_safety` explains body-state rebound but not emotional relief/restart pressure. | Trigger when hidden function is `hunger_safety` and interaction includes all-or-nothing or punishment restriction. | Include supplementary relief/restart-pressure narrative. | Runtime copy blocked until both hunger-safety and relief narrative are present. |
| `punishment_restart_pressure` | Copy must address the pressure to punish oneself or restart stricter tomorrow. | Trigger for `all_or_nothing_restriction_rebound`. | Frame next-meal reset as gentleness, not compensation or stricter dieting. | Runtime copy blocked if it recommends stricter dieting or compensate-tomorrow framing. |
| `medical_cause_implication_risk` | Copy could imply PCOS, hormones, medication, glucose, or medical cause as fact. | Trigger for `pcos_body_uncertainty_control`, professional-first fixtures, and future body-state uncertainty cases. | Include "Энэ нь онош биш" and uncertainty language. | Runtime copy blocked until medical-cause claims are absent. |
| `body_uncertainty_sensitivity` | Body uncertainty copy can become exposing, body-blaming, or too medical. | Trigger when primary driver is `body_change_uncertainty`. | Use body-neutral wording and avoid appearance judgment. | Runtime copy blocked until body-neutral review passes. |
| `soft_professional_context_needed` | Ordinary-mode copy needs a soft bridge to professional clarification without safety escalation. | Trigger for `pcos_body_uncertainty_control`. | Use "тодруулах хэрэгтэй байж магадгүй" without changing mode or diagnosing. | Runtime copy blocked until non-blocking bridge is present. |
| `ordinary_experiment_allowed_with_medical_bridge` | Ordinary observation remains allowed even with a soft medical-context bridge. | Trigger for `pcos_body_uncertainty_control` while safety mode remains `mode1`. | Keep the 14-day experiment as observation, not treatment. | Runtime copy blocked if the bridge suppresses ordinary observation without professional-first trigger. |
| `internal_key_leak_risk` | Internal keys could leak into user-facing copy. | Trigger for every fixture until a copy translation layer exists. | Translate all keys into approved Mongolian copy. | Runtime copy blocked until internal key leak tests pass. |
| `payment_blocking_safety_risk` | Safety or professional-context guidance could be hidden behind payment. | Trigger for safety, professional-first, and medical-context copy. | Safety and professional-context copy must be visible before payment. | Runtime copy blocked until payment-boundary checks pass. |

## Flag usage rules

- Flags are future QA metadata, not user-facing copy.
- Flags should be generated in test-only artifacts before runtime implementation.
- Flags should not change WP3 scoring, WP3 fixtures, or WP4 report object fields.
- Flags should not render in production reports.
- Flags should drive future tests and owner review.
