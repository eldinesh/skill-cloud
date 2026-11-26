---
name: sense-shape-steer
version: 1.0.0
bundle: ai
description: |
  The agency's Sense-Shape-Steer framework: take an AI opportunity from idea to build-ready
  blueprint — SENSE the right opportunity, SHAPE the experience and patterns, STEER with
  metrics and feedback loops, CONCLUDE into an owned plan.
  Use when asked to "run an AI design sprint", "sense shape steer", "scope this AI feature",
  "what should the AI do here", "is AI right for this", or "teach me the framework".
  Proactively suggest when a project involves designing an AI feature or experience and its
  role, risks, or success criteria aren't defined yet.
  Three modes: run, facilitate, learn. Feeds /design-brief; alternate entry to /ux-pipeline. In a Koru project it runs as F11 of koru-frame and writes OPP/MET cards. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$(command -v skillcloud-update-check >/dev/null 2>&1 && skillcloud-update-check 2>/dev/null || "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f koru/engagement.md ] && { (command -v koru >/dev/null 2>&1 && koru context || node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" context) >/dev/null 2>&1; echo "KORU_PROJECT: yes (follow Koru mode)"; }
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/sprint 2>/dev/null && echo "SPRINT: artifacts exist" || echo "SPRINT: none"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `${CLAUDE_PLUGIN_ROOT}/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes from `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `KORU_PROJECT: yes`: read **Koru mode** below before anything else. It overrides this skill's Produces, Next and Handoff.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** the AI opportunity as the user describes it; any existing research (`ux/insight-report.md`, `ux/synthesis/*` — optional but gold for SENSE), `ux/project-context.md` (always)
- **Produces:** `ux/sprint/` — opportunity-statement.md, pattern-decisions.md, storyboard.md, touchpoint-map.md, steer-plan.md, blueprint.md
- **Next:** /design-brief — the blueprint is its declared input when design continues in the pipeline; /usability-test-plan consumes the steer-plan's thresholds

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **F11** of `koru-frame`, run by the **Strategist** agent, and its output is cards, not files:

- **Reads:** `INS`, `JOB`, `PRB`, `FLW` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `OPP`, `MET`. Sense: AI opportunities become Opportunity cards with kind: ai and the AI opportunity statement. Shape: trust and failure behaviour become rows on state cells in Harden. Steer: the measures become Metric cards with a baseline, events and an owner.
- **Never writes** `ux/sprint/*.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Sense-Shape-Steer

You run the agency's framework for AI product UX. The full reference lives in `resources/` — read the file for the phase you're in, **follow its worksheets verbatim** (the questions, bracketed guidance, checkpoints, and templates are the method), and use its worked example (the clinical scribe) to calibrate depth, swapping examples to the project's domain.

- `resources/framework-overview.md` — the lifecycle, sprint structure, modes, four principles
- `resources/sense.md` — Day 1: prep, five parts, opportunity statement, reflection
- `resources/shape.md` — Days 2–3: patterns, storyboard, touchpoints, prototype, validation
- `resources/steer.md` — Day 4: metric worksheets, levels, feedback loops, north star
- `resources/conclude.md` — Day 5: prioritize, feasibility, ownership, risks, blueprint

## Step 0 — Context and data-rules gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary. Apply the domain to every example and worksheet (the resources ship healthcare-flavored examples — translate them).
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit.
3. Check `ux/` for existing research — synthesis, insight reports, personas feed SENSE Part 1 directly; say what you're drawing on.

## Step 1 — Pick the mode (infer it; confirm only if genuinely ambiguous)

**RUN** — "scope this AI feature", "run this through the framework", a transcript/brief plus an AI idea. The user works the framework *with you, now*. **The calendar disappears: days become gates.** Work phase by phase in sequence — SENSE → SHAPE → STEER → CONCLUDE — in one sitting or several:
- Read the phase resource. Pose its worksheet questions conversationally — one part at a time, not a form. Draft candidate answers from the material the user gave (state them as drafts to react to — people correct faster than they compose); the user confirms or rewrites.
- Enforce the checkpoints: don't pass a gate with its checklist unmet — say what's missing. Skipping is the user's call, recorded in the artifact (loud, per pipeline rules).
- Write each phase's artifact to `ux/sprint/` (standard header, `status: draft`, `sources:` trailing back) before opening the next phase.
- Pause points: after each phase, offer stop-here-or-continue. A full run is a long session; phase-per-sitting is the natural rhythm.

**FACILITATE** — a real human sprint is planned or underway ("we're running the sprint next week", "prep day 2", "here's what the wall looks like after today"). The team does the thinking; you do structure, time, and capture. **Here the real timeline applies** (resources carry it: 5 days, 90–120 min/day, CONCLUDE 1.5 h, pre-sprint ~60 min, post-SENSE reflection 20–30 min; lean-to-3 or extend-to-7 per complexity — flag these timings as framework defaults the facilitator can tune):
- *Before:* produce the day's agenda with per-part timeboxes, the prep-work assignments by role, materials list (the worksheets to have on the board).
- *During:* serve exercise prompts one at a time, keep the room on the question (not the solution), run the checkpoint at the end of each exercise.
- *After each day:* the user pastes sticky text / board exports — convert into the phase artifact in `ux/sprint/`, flag thin spots ("Part 4 has one risk sticky — revisit tomorrow's warm-up"), and produce the next day's opening recap.

**LEARN** — "teach me the framework", "what is sense-shape-steer", onboarding a new joiner. Tutor it in layers (the /topic-deep-dive discipline): start with `framework-overview.md` in plain language — the lifecycle in five sentences, why AI UX needs it — then offer depth per phase on request. Teach with the clinical-scribe example, then have them apply each worksheet to a toy problem from *their* world; correct against the checkpoints. Never dump all five resources at once.

## Working rules (all modes)

- **The worksheets are the method.** Don't paraphrase questions loosely or invent new ones mid-phase; the wording carries the craft. Adapt *examples* to the domain, not the questions.
- **Suggest, never auto-run.** SENSE's Part 1 deliberately ignores AI; respect sequence — teams that jump to patterns before the problem space produce AI theater.
- **Risk honesty.** Part 4 (risks), the touchpoint risk tiers, and STEER's must-never-happen list are where this framework earns its keep — push for specifics ("'AI might be wrong' is not a risk; '10mg becomes 100mg in the EHR' is").
- **Everything is a draft with named gaps.** Artifacts say what's unvalidated; the blueprint's section 5 exists for exactly that.

## Handoff

End every engagement with: artifacts produced (paths + status), where the project stands in the framework, and the next step — the next phase gate (run), the next day's prep (facilitate), or the next layer (learn). After CONCLUDE: suggest `/design-brief` (consumes the blueprint) for continuing design, and `/usability-test-plan` when validation runs (consumes steer-plan thresholds). Suggest, don't auto-run.
