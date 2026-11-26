# AI quality log (kept across all stages) · `ux/team/ai-quality-log.md`

Every AI mistake caught, by whom, and what changed. It's the evidence that judgement over AI works, and it shows where a checker or a prompt needs sharpening. Gates ask whether it's current (Harden E3, Ship D2).

| # | Date | Stage · step | What the AI got wrong | Caught by (tool / checker / person: name) | Severity | Fixed how | Prevent next time (prompt, check, rule) |
|---|---|---|---|---|---|---|---|
| AQ-01 | | frame · 9 | Brief stated "most members double-book" from one ops call | research challenger | major | downgraded to low + open question | confidence-cap check now runs on every draft |
