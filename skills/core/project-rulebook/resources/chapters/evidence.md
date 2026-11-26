---
artifact: rulebook-chapter
id: EVD
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: frame
applies_to: [researcher, synthesiser, strategist, checker]
sources: [delivery-system.md §5, team-charter.md Art. 3, UX research training: gathering clues and connecting dots]
status: final
owner: SkillCloud maintainers (project copy: the research owner)
version: 1
updated: 2026-11-26
---

# Evidence

## Purpose
Every claim the project builds on can be traced to what was recorded, labelled for how sure we are, and placed at the right layer. That is how "why did you design it this way?" gets answered with "here's what we heard, here's what we know, and here's how it traces."

## Rules

**Layers**
- **EVD-R01** MUST label evidence at one of three layers:
  - **Data** records one thing that happened, for example a quote, a log line or an observation.
  - **Finding** is a pattern across data. It says what happened, not why.
  - **Insight** is why it happens and so what: it has a *because* and a *which means*, tied to a user need **and** a business goal.
- **EVD-R02** MUST NOT present a single quote or a single observation as a pattern. One data point is data, even when it is vivid.
- **EVD-R03** MUST NOT call something an insight unless it has the *because* and the *so what*. Without them it is a finding, and it is labelled that way.
- **EVD-R04** Data and findings say what is true. Insights say what to do about it. AI MAY draft all three, but deciding what to do stays with people. Insights stay `draft` until the research owner accepts them.

**Confidence**
- **EVD-R05** MUST give every claim in Frame artifacts a confidence level:
  - **high** needs two or more independent sources, including direct user or client evidence.
  - **medium** is one direct source.
  - **low** is anecdote, one stakeholder's belief, or anything AI inferred.
- **EVD-R06** MUST keep AI-inferred claims at **low** and tagged `[inferred]` until a person confirms them. The person's confirmation is recorded where it happened.
- **EVD-R07** MUST NOT count sources as independent when they share an origin, for example two people repeating the same all-hands slide, or a support ticket that quotes the PRD.
- **EVD-R08** MUST tag claims with no research behind them `[unvalidated]` and keep them visible. They are never laundered into "we know".

**Traceability**
- **EVD-R09** MUST quote verbatim from the de-identified record, with the participant code: *"…" — P03*. Cleaning means de-identifying, not paraphrasing inside quote marks.
- **EVD-R10** MUST cite upstream claims by ID: `INS-nn`, `JOB-nn`, theme names with P-codes, `OPP-nn`.
- **EVD-R11** MUST give every design decision a trace to an insight or job, or label it as the team's judgment (`[judgment: <who>]`).
- **EVD-R12** MUST report contradictions between participants, sources or stakeholders. They are never averaged away.

**Questions and calls**
- **EVD-R13** MUST NOT count answers to leading questions ("wouldn't it help if…") as support for the thing they led toward.
- **EVD-R14** For requirement calls, MUST capture all six TRACES clues (Trigger, Result, Audience, Confidence, Edges, Say-so), or record which were left empty and why. An empty letter is an open question, not an omission.
- **EVD-R15** The less context a call had, the more it was for listening. Commitments recorded from an ad-hoc call are limited to a recap and a follow-up. No scope, timeline or solution goes into the brief from an ad-hoc call.

**Limits**
- **EVD-R16** Research pack limits: 1–2 personas, 5–8 jobs, competitive scan of 3–5 products. Exceeding a limit needs the research owner's recorded reason. A pack nobody can review in 30 minutes doesn't get reviewed.

## Patterns

### The insight anatomy
| Part | Example |
|---|---|
| What | Managers stall, or approve blind. |
| Why | The approval screen shows an amount and a receipt, but no policy or norm context. |
| So what | Reimbursement slows. Compliance risk lands on finance. |
| Opportunity | Bring decision context to the point of approval. |

### The insight-to-direction path
Insight (the why) → **Job** (the goal) → **Problem** (the obstacle, its impact and the measure) → **HMW** (an open question) → **UX opportunity** (directions out of ideation) → **AI opportunity** (spotted inside the workflow from the start, not bolted on). `/experience-strategy` runs this path, and each step cites the one before it.

### Classifying a line
| The line… | Layer |
|---|---|
| records one thing that happened | Data |
| summarises a pattern but has no "because" | Finding |
| has "because" and "which means", tied to a user need and business goal | Insight |

Examples (synthetic, healthcare-flavoured):
- *"If the tray's not back from sterile processing, I just borrow one from the next room." — P06, OR nurse* → **Data**
- "Sterile processing techs track tray status on a paper whiteboard, even though the system has a status field." → **Finding**
- "Nobody in the OR trusts the tray status in the system, **because** it's updated after the fact, so people walk over and check. The gap is trust in real-time status, not missing data, **which means** a better field won't fix it, but a live signal might." → **Insight**

### Confidence line
`Monday clashes are frequent. medium · ops call 2026-11-03 (one direct source)`

## Decisions
| Decision | Why | Log |
|---|---|---|
| *(project decisions go here, for example "support tickets count as direct evidence for this project")* | | |

## Checks
| Check | Verifies | How |
|---|---|---|
| **EVD-C01** | R09 quotes verbatim | tool: `skillcloud-check trace <file>`. QUOTE-MISSING is a blocker. |
| **EVD-C02** | R10 IDs resolve | tool: `skillcloud-check trace <file>`. UNRESOLVED-ID |
| **EVD-C03** | R01–R03 layer labels | checker H1 q2 · person: research owner |
| **EVD-C04** | R05–R07 confidence honest | checker H1 q1, q5 |
| **EVD-C05** | R13 no leading evidence | checker H1 q3 (reads the guide) |
| **EVD-C06** | R16 limits | checker H1 q6 |
| **EVD-C07** | identifiers stripped | tool: `skillcloud-check pii ux` |

## Instructions for AI tools
- Before writing any claim, decide its layer and its confidence. If you can't name the source, it's `[unvalidated]` or `[inferred]`, never plain prose.
- When you're about to write "users want…", "users struggle…" or "most…", count the P-codes behind it first. Fewer than two means signal language: "one participant…", "P04 described…".
- Never fix a quote to read better. If a quote is too long, cut with "…" at a clause boundary and keep the rest verbatim.
- If the first draft sounds certain about everything, it's wrong. Re-read every **high** and every claim with no confidence tag, and justify each one or downgrade it.
- Gaps are output: every empty TRACES letter, missing segment or unanswered research question becomes an open question with who could answer it.

## Owner
Project copy: the research owner · reviewed at every Frame gate.
