# Gates: AI reviews, people decide

Four gates, all in the same format: **1 Frame → Explore · 2 Explore → Harden · 3 Harden → Ship · 4 Ship → Learn**. Nothing goes to the next stage until its gate sheet is filled. The design lead copies the gate's sheet to `ux/team/gates/<project>-<stage>-gate-v<n>-<status>.md` (status: draft → review → final) next to the stage's outputs.

## The five steps (every gate)

1. **The lead calls the gate:** the team lead (Gates 1, 2, 4) or the design lead (Gate 3), once the pack is assembled.
2. **AI review:** `sc-checker` runs the gate's audit protocol (`frame-explore-readiness-audit`, `explore-harden-readiness-audit`, `harden-ship-readiness-audit`, `ship-handoff-reviewer`) in a **fresh context, read-only**, seeing **only** the handoff pack. For every question it answers **Pass** (with an evidence link), **Gap**, or **Can't tell** (which counts as a Gap). It can't pass anything without linked evidence, can't waive a Gap, and can't sign.
3. **Human review:** the person who decides gaps goes through every Gap and chooses **Fix** (back to the step named in "Fix at") or **Waive** (non-★ only, with a reason, an owner and a due date). ★ questions block and can't be waived.
4. **The next stage's lead** reads the AI verdicts and the human decisions, and **accepts or rejects the handoff** ("checked by the next team").
5. **Log it:** the outcome, every waiver and every name go in `ux/decisions-log.md` and the history (`--kind gate`).

## Outcomes

| Outcome | When | What happens |
|---|---|---|
| **Go** | Every question Pass, or a non-★ Gap the decider waived | Outputs renamed `-final` and published to project knowledge |
| **Go with conditions** | Only non-★ Gaps left, each waived with an owner and a due date | As Go; conditions tracked in the decisions log and the handoff card |
| **Back to <this stage>** | A ★ Gap we can fix ourselves | Return to the step in "Fix at", then re-run the gate |
| **Back to <earlier stage> / client** | Gate 1: a ★ Gap only the client can close (no decision owner, scope not agreed, a blocking open question). Gate 2: the direction no longer answers the brief, or scope changed. Gate 3: the direction won't hold (try the runner-up first). Gate 4: something can't be built as designed | A change request or decision card goes back; the gate waits or stops |

## Columns of every sheet

`#` · Question · ★ (blocking) · Evidence to look at · Fix at · **AI verdict + evidence link** (the auditor) · **Human decision** (Fix / Waive + reason, owner, due date) · Owner

The board pane shows a gate sheet's open Gaps with Fix and Waive buttons that send the decider's words to the session. Claude records them and never decides them.
