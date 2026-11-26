# Eval: research checker on Meridian Frame

A Frame stage from the Meridian Health simulation (synthetic client, pseudonymised interviews) with eight planted defects, one per research-checker rule family. `planted.json` lists them: the card, the rule the checker should cite, and what was planted. Nothing in the project marks them.

| Card | Rule | Planted defect |
| --- | --- | --- |
| FND-002 | RC-02 | causal words in a Finding ("because they do not trust UnitDesk") |
| INS-004 | RC-05 | confidence raised to high on two prompted participants |
| PRB-002 | RC-06 | a stakeholder belief (ASM-001) cited as proof of the problem size |
| HMW-005 | RC-10 | How-might-we with its Problem links removed |
| IDE-002 | RC-12 | client idea with an empty reverse trace |
| CON-008 | RC-08 | conflict settled by majority |
| INS-002 | RC-04 | contradicting Finding unlinked, no "none found" statement |
| CTX-001 | RC-11 | Users question left blank |

Run: `tools/eval-checker.sh frame-meridian` (live, needs Claude Code) or `tools/eval-checker.sh frame-meridian findings.md` (score only).

## Results (2026-11-26)

| Run | Recall | Precision | Note |
| --- | --- | --- | --- |
| 1 (`result-run1.md`) | 0.88, 7 of 8 | 0.67, 14 of 21 | Missed CON-008: the condensed pack cut each section at 160 characters, and the verdict sat at the end. |
| 2 (`result-run2.md`) | 1.00, 8 of 8 | 0.89, 16 of 18 | After the pack kept each section's closing sentence. |

Precision counts only findings on planted cards, so it is a lower bound: the unplanted findings in both runs (a mislabelled contradicts link, unused satisfaction data, a "4 of 4" count resting on second-hand speech) are real defects in the original simulation.
