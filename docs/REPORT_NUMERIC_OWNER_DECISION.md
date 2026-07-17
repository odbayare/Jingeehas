# Report Numeric Owner Decision

Decision status: `OWNER REVIEW REQUIRED`.

Prompt text that proposes a value is not owner approval. No report containing these fixed parameters may become active until the owner records an explicit decision.

| Parameter | Proposed value | Purpose | Dose or adherence tracking? | Possible risk | Product rule or source | Nonnumeric alternative | Owner decision | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Trial duration | 14 days | Bound the initial experiment. | Adherence/observation window, not an exercise dose. | May imply that the same duration suits every user. | AI-directed review prompt only; not approval. | “Эхний ажиглалтын хугацаанд” | PENDING | OWNER REVIEW REQUIRED |
| Minimum frequency | At least 4 selected days per week | Make repeatability observable. | Controls exposure frequency and therefore partly affects exercise dose. | May be too frequent or too infrequent for an individual situation. | AI-directed review prompt only; not approval. | “Урьдчилан сонгосон боломж бүрд” | PENDING | OWNER REVIEW REQUIRED |
| Planned opportunities | 8 occasions | Define the denominator for adherence review. | Adherence tracking, derived from the proposed frequency. | Can appear clinically precise without validation. | AI-directed review prompt only; not approval. | “Сонгосон боломж бүрийн дараа” | PENDING | OWNER REVIEW REQUIRED |
| Completion target | At least 6 of 8 | Define success without using weight. | Adherence threshold. | Can turn a flexible experiment into a pass/fail score. | AI-directed review prompt only; not approval. | “Ихэнх сонгосон боломжид үндсэн эсвэл богино хувилбараа давтаж чадсан бол” | PENDING | OWNER REVIEW REQUIRED |
| Busy-day fallback | 5 minutes | Preserve continuity on a constrained day. | A short movement-duration dose. | Suitability is not established and a fixed duration can imply medical precision. | AI-directed review prompt only; not approval. | “Үндсэн хувилбараасаа мэдэгдэхүйц богино, бага ачааллын хувилбар” | PENDING | OWNER REVIEW REQUIRED |

## Candidate A — numeric

- Duration: 14 days.
- Frequency: at least four selected days per week.
- Busy-day fallback: five-minute low-intensity version.
- Success: complete the main or short version on at least six of eight selected opportunities; if injury evidence exists, symptoms must not worsen.

## Candidate B — nonnumeric

- Duration: the initial observation period.
- Frequency: on preselected days that fit the person’s routine.
- Busy-day fallback: a clearly shorter low-intensity version.
- Success: the main or short version is repeatable on most selected opportunities; if injury evidence exists, symptoms do not worsen.

## Owner decision

- [ ] Approve candidate A.
- [ ] Approve candidate B.
- [ ] Request revised parameters.

Until one option is explicitly selected, status remains `OWNER REVIEW REQUIRED` and deployment is prohibited.
