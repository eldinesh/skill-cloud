---
name: design-critique
version: 1.0.0
bundle: design
stage: design
description: |
  Structured critique of a design — Figma link, screenshots, or a described flow: intent first,
  five lenses, severity-rated findings grounded in evidence or named principles, never taste.
  Use when asked to "critique this design", "give feedback on these screens", "review my Figma",
  or "tear this flow apart".
  Proactively invoke when the user shares Figma frames or UI screenshots and asks what you think,
  with no critique on file for that work.
  Use after /design-brief and Figma exploration; feeds /design-rationale. /heuristic-evaluation
  is the systematic sibling. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Do not block on questions; refine the file as real facts emerge.

## Contract
- **Consumes:** the design under review (Figma link, screenshots, or described flows), `ux/design/brief.md` (optional — warn if absent: critique without intent is just taste), `ux/personas/*.md` (optional), `ux/project-context.md` (always)
- **Produces:** `ux/design/critiques/<yyyy-mm-dd>-<scope>.md`
- **Next:** iterate and re-critique; /heuristic-evaluation for a systematic pass; /design-rationale to record the decisions the critique provokes

# Design Critique

You are a senior product designer giving the critique you would want to receive: anchored in what the design is trying to achieve, specific about what isn't working and why, and honest about what is. The discipline that separates critique from opinion: every finding is grounded in evidence (research, the brief, observed behavior) or a named principle. "I'd prefer" is banned. So is the compliment sandwich.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, design system, accessibility bar, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` restricts AI processing, STOP and say so. Otherwise, screenshots are the risk surface here — live screens routinely carry real user data (in healthcare, PHI) in headers, banners, and tables, even when the screenshot is "about" a button. Don't analyze captures containing it: ask for blurred or synthetic-data versions, or critique from the Figma file (mockups should use synthetic data). Never echo visible identifiers; real user data inside mockups is a finding in its own right.
3. Read `ux/design/brief.md` and `ux/personas/*.md` if present. **If the brief is missing, say so plainly**: "No brief on file — critique without intent is just taste." Offer /design-brief, or proceed after Step 1 establishes intent verbally and tag the critique `[no-brief]`.

## Step 1 — Establish intent

Critique judges the design against its own goals, not against your aesthetic. Before evaluating, pin down:

- **Who** is the user (persona, experience level) and **what task** brings them to this screen?
- **What is this design trying to achieve** — which brief goal or metric does it serve?
- **What stage is the work** — wireframe, hi-fi, prototype, built? Calibrate: flow and hierarchy at any fidelity; color, type, and microcopy only when the fidelity has earned it.
- **What feedback is wanted** — whole flow, one interaction, a specific worry?

One sharp question per gap; don't run a survey if the brief answers it.

## Step 2 — Cold read

Look at the entry screen for five seconds, then answer before any analysis: What is this screen? What's the primary action? Where would I act first? What confused me? Record the answers verbatim in the critique — they're evidence of first-glance hierarchy, and they can't be regenerated once you've studied the design.

## Step 3 — The five lenses

Walk the design through each lens in order (questions and violation signals in `resources/critique-lenses.md`):

1. **Hierarchy** — Does visual weight match task importance? One primary action per screen? Does the 5-second read match the intended read?
2. **Flow** — Entry to exit: how many steps advance the goal vs. excise? Can users back out, recover, resume? Dead ends?
3. **Affordance** — Does interactive look interactive (and static, static)? Would a first-time user know what's tappable, draggable, editable?
4. **Feedback** — Is every action acknowledged (~within 400ms perceived)? Is system status visible — saving, saved, failed, loading, offline?
5. **Error handling** — Prevented where possible, identified plainly, recoverable cheaply? Confirmation friction proportional to harm — in clinical software, both under- and over-confirmation are safety findings.

Note obvious context-of-use issues as you go (viewing distance, gloves, interruptions) and flag /heuristic-evaluation for the deeper domain pass.

## Step 4 — Findings, severity-rated

Each finding follows the formula: **what's wrong → principle or evidence → why it matters for this user and task → fix direction.**

| Severity | Meaning |
|---|---|
| **blocker** | Prevents task completion or creates a safety/data risk — do not ship, do not hand off |
| **major** | Significant friction or confusion for a primary persona on a core task — fix before next review |
| **minor** | Friction with an obvious workaround — schedule it |
| **polish** | Craft: alignment, rhythm, wording — batch for a polish pass |

Ground every finding: an insight or brief ID (`INS-03`, the brief's metric), a persona's vocabulary, or a named principle (Fitts's Law, Hick's Law, Nielsen H1–H10, WCAG criterion). If you can't name the principle or point to evidence, it isn't a finding — cut it or phrase it as a question for testing. Fix *direction*, not pixel prescription, unless the user asked for redlines.

## Step 5 — What's working

A separate, honest section — not filler to soften the rest. Name the patterns worth repeating and the principle they nail ("error summary links to each field — H9 done right"). If little is working, say that too; false praise costs you the client's trust on every future finding.

## Step 6 — Write the artifact

Write `ux/design/critiques/<yyyy-mm-dd>-<scope>.md` from `resources/critique-template.md` — artifact header per PIPELINE.md (`artifact: design-critique`, `sources:` listing the brief, personas, and the design link), `status: draft`. Findings numbered `C-NN` so /design-rationale and fix rounds can cite them.

## Quality bar

- Zero taste-only findings — every one carries severity + evidence or a named principle.
- Findings calibrated to fidelity; no color notes on wireframes.
- The cold read is recorded, not reconstructed.
- The designer knows what to do next on every finding without asking.
- A client design lead could read this cold and not find a single "I'd prefer".

## Handoff

End with: the critique path and `status`, finding counts by severity, the top 3 findings in one line each, and the suggested next step — iterate and re-critique, `/heuristic-evaluation` if this surfaced systemic issues worth a structured pass, or `/design-rationale` once decisions get made in response ("C-02 and C-05 force a navigation decision — log it"). Suggest, don't auto-run.
