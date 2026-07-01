# Work Pack 6 Copy Risk Register

| Risk | Where it appears | Severity | Mitigation | Runtime gate |
| --- | --- | --- | --- | --- |
| Internal keys leaking | All WP4 snapshot-derived sections | High | Translate every key through approved Mongolian copy map; never render raw keys. | Block runtime until key rendering tests exist. |
| Shame language | Wrong self-explanation, body shame, restriction/rebound | High | Use body-neutral, non-blaming copy; ban "та сахилгагүй" and equivalent phrasing. | Copy QA must check forbidden phrases. |
| One-type label | Primary driver and section summaries | High | Always describe primary plus secondary drivers as a stack. | Runtime must not show type/persona labels. |
| Medical diagnosis implication | Professional-first, PCOS/body uncertainty, medication concern | High | Use "Энэ нь онош биш" and uncertainty language. | Medical-cause claims must be forbidden by tests/review. |
| Professional-first copy sounding frightening | Safety section | High | Keep tone calm, short, and practical; avoid urgent language unless safety route already requires it. | Safety copy owner approval required. |
| Experiment sounding like diet instruction | 14-day experiment, first gentle change | Medium | Use "туршилт", "шалгана", and "ажиглана"; avoid commands. | Runtime copy must frame experiment as hypothesis. |
| Body shame copy sounding exposing | `body_shame_restriction`, body uncertainty sections | High | Use private/body-neutral language and avoid appearance judgment. | Body-sensitive copy review required. |
| Social eating copy sounding moralizing | `social_weekend_alcohol_monday_restart` | Medium | Frame social eating as belonging/context, not weakness. | Owner approval for social/belonging language. |
| Hunger safety sounding alarming | `meal_gap_evening_hunger`, restriction/rebound | Medium | Explain as the body trying to prevent strong hunger, not danger. | Hunger-safety copy must be user-tested or owner-approved. |
| AI-generic tone | All generated report copy | Medium | Require specific moment, driver stack, and one concrete next step. | Reject generic motivational copy. |
| Overconfident causality | Hidden food function, medical/body uncertainty | High | Use "байж магадгүй", "харагдаж байна", and "давхардаж байна". | Runtime copy must avoid certainty claims. |
| Payment blocking safety | Professional-first route, paywall/premium paths | Critical | Safety direction must appear before payment and outside paid report depth. | Block runtime unless safety copy is visible without payment. |
