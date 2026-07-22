# Landing duration measurement (V2)

The consumer-facing range is **10–15 минут**. The range is shared by the hero, trust row, CTA copy, FAQ, and closing section.

The question bank currently exposes a maximum of 40 routed questions. Six route profiles were checked against `visibleQuestions()` and the production question-per-screen flow:

| Profile | Route characteristics | Routed questions |
| --- | --- | ---: |
| Shortest realistic | male, no prior method, light branching | 34 |
| Longest realistic | female, prior method, full branching | 40 |
| Male route | male, standard non-branching path | 35 |
| Female route | female, sex-specific branches | 40 |
| Prior-method light | one prior method, no extended history | 36 |
| Prior-method heavy | multiple prior methods, full history | 40 |

Active completion timing was measured from the first visible question to the final answer, excluding network waits, payment, report generation, and artificial automation delays. The observed active ranges were 10–14 minutes; the public copy rounds this conservatively to 10–15 минут.

This is an approximate consumer estimate, not a promise of completion time. The assessment saves progress so a user can pause and resume.
