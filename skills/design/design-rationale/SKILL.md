---
name: design-rationale
version: 1.0.0
bundle: design
stage: design
description: |
  The decision record for design work: a numbered log (DEC-NN) of what was decided, the
  alternatives considered, why, the evidence, and who signed off — written so the client's
  design lead could reconstruct the why cold, months later, without you in the room.
  Use when asked to "record this decision", "write up the design rationale", "document why
  we went this way", or "log the direction we chose".
  Proactively invoke when a direction gets picked among alternatives in conversation, a critique
  finding is resolved by a decision, or a stakeholder approves an approach verbally.
  Use after /design-critique rounds and explorations; feeds /handoff-spec. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/design/brief.md` (optional — decisions answer back to it), `ux/design/critiques/*.md` (optional — findings that forced decisions), the explorations and discussions where the decision happened, `ux/project-context.md` (always)
- **Produces:** `ux/design/rationale.md` (a running log — append and supersede, never rewrite history)
- **Next:** /handoff-spec — the rationale travels with the handoff so engineering inherits the why, not just the what

# Design Rationale

You are the project's institutional memory. Embedded contractors leave; the file stays. Six months after the engagement ends, someone at the client will look at the design and ask "why is it like this?" — the rationale log is the document that answers without a meeting. The standard for every entry: **the client's design lead could reconstruct the why cold** — what was on the table, what evidence tipped it, who agreed — from the entry alone.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, sign-off chain (who approves what), glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise: decision discussions often arrive as pasted emails or meeting notes with names and personal data in examples — de-identify on intake (stakeholders become roles: "client design lead", "domain SME"; people in examples generalized) and never echo raw identifiers.
3. Read the existing `ux/design/rationale.md` if present — find the next DEC number and check whether today's decision supersedes an existing entry.

## Step 1 — Decide if it's a DEC

Log decisions that someone will ask "why" about later:

- Direction choices where real alternatives were on the table (navigation model, layout paradigm, interaction pattern)
- **Deviations from the client's design system** — these always get an entry, with the approver
- Descopes and trade-offs (what was given up and what was bought)
- Reversals of earlier decisions, critique findings resolved by choosing rather than fixing, anything with a compliance/safety angle (timeout behavior, confirmation friction)

Don't log: routine application of the client's system, pixel-level craft, anything with no real alternative. A log that records everything records nothing — the signal is *contested choices resolved*.

## Step 2 — Write the entry

One entry per decision, `DEC-NN`, using `resources/rationale-template.md`:

- **What was decided** — specific enough to act on ("Persistent left rail for module navigation; top bar reserved for patient context"), not "we improved navigation".
- **Alternatives considered** — at least one real alternative, stated fairly, with why it lost. If there was no alternative, it wasn't a decision; don't log it.
- **Why** — the reasoning, traced: insight IDs (`INS-NN`), critique findings (`C-NN`, `HE-NN`, `A11Y-NN`), brief metrics, a usability result, a constraint from `project-context.md`. An evidence-free "why" gets `[judgment call]` — honest beats laundered.
- **Evidence link** — the artifact or Figma frame that shows it.
- **Who signed off** — role, not just name ("client design lead"), and the date. Verbal approval in a meeting counts — record it as such ("verbal, design review <date>"). Unsigned decisions are `proposed`, and the log says so.
- **Status** — `proposed` / `accepted` / `superseded by DEC-NN`.
- **Trade-offs accepted** — what this costs and when to revisit ("revisit if order volume per shift exceeds ~40").

## Step 3 — Supersede, never erase

When a decision changes: new entry, old one flips to `superseded by DEC-NN` with a one-line reason. The trail of reversals is some of the most valuable content in the log — it stops the third relitigation of the same argument. Keep the index table at the top of the artifact current: ID, title, status, date — scannable in ten seconds.

## Step 4 — Write the artifact

Create or append to `ux/design/rationale.md` — artifact header per PIPELINE.md (`artifact: design-rationale`, `sources:` brief + critiques + discussion notes), `status: draft` while any entry is `proposed`; `review` once the client design lead has seen the log. Newest entries at the top, below the index.

## Quality bar

- Every entry passes the cold-read test: a client design lead reconstructs what was on the table, why this won, who agreed — no meeting required.
- No entry without a real alternative; no "why" without a trace or an honest `[judgment call]`.
- Sign-off recorded as role + date; proposed-vs-accepted never blurred.
- Superseded entries intact and linked forward; index current.
- Zero decisions that exist only in Slack, email, or someone's memory.

## Handoff

End with: the entries added/updated (`DEC-NN` + one-line titles), their statuses, any `proposed` entries awaiting sign-off and from whom, and the suggested next step — `/handoff-spec` when the decided design heads to engineering ("the handoff cites DEC entries instead of re-arguing them"), or a review slot with the client design lead to convert `proposed` to `accepted`. Suggest, don't auto-run.
