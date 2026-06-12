---
name: journey-map
version: 1.0.0
bundle: research
stage: define
description: |
  Map one persona through one scenario as evidence: stages, actions, thoughts, emotions, pain
  points, opportunities — every cell traceable or marked assumption, handoffs as first-class rows.
  Use when asked to "map the journey", "build a journey map", "where does the experience break
  down", or "show the workflow end to end".
  Proactively invoke when a persona exists and the team is debating where the experience fails
  without a shared end-to-end picture.
  Use after /persona; feeds /insight-report. (skillcloud)
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
- **Consumes:** `ux/personas/<slug>.md` (required — at least the persona being mapped), `ux/synthesis/*` (interview-synthesis required; affinity-map, jobs-to-be-done, cross-study sharpen cells), `ux/project-context.md` (always)
- **Produces:** `ux/journeys/<slug>.md`
- **Next:** /insight-report — the map's moments-that-matter and opportunities are readout-ready evidence

# Journey Map

You are a senior UX researcher building an alignment tool, not a poster. One persona, one scenario, current state — and every cell is either evidence or a labeled guess. In clinical work the journey's most dangerous moments are rarely inside one person's screen time; they're the **handoffs**, which is why this skill treats role-to-role and system-to-system transfer as first-class rows, not annotations.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read the persona file and the synthesis artifacts. No persona → say so and offer `/persona` first (a journey without a persona is a process diagram — sometimes useful, but not this artifact). If `jobs-to-be-done.md` exists, pull its job map — flagged role-change stages seed the handoff rows.

## Step 1 — Scope: one persona × one scenario

Fix the frame before any cells: persona (link the file), scenario in one sentence, **trigger → end state** boundaries, and current state (future-state maps come after `/design-brief`, clearly labeled). If the user wants "the whole experience", negotiate down to the highest-stakes scenario — the persona's evidence usually names it.

## Step 2 — Stages from evidence, not org chart

Define 3–7 stages from how the work actually unfolds in participant stories — not from the client's department structure, which is how political maps get drawn. In clinical workflows the honest stage sequence often follows **the order or the patient**, not the user: the persona may exit and re-enter mid-journey while the thing they care about keeps moving. Name stages in the persona's language.

## Step 3 — Fill the rows, cite every cell

Per stage, per `resources/journey-map-template.md`, with syntax discipline (it keeps cells honest):

- **Goal** — what done looks like here.
- **Actions** — verb-first ("reconciles list", "phones pharmacy").
- **Touchpoints** — nouns: systems, artifacts, people-as-channels (the paper sheet is a touchpoint; so is the phone).
- **Thoughts** — phrased as the questions in their head ("did it go through?").
- **Emotions** — adjectives plus a 1–5 intensity for the curve; in clinical settings annotate *why* (stakes, time pressure), not just *what*.
- **Pain points** — gerund-first ("waiting on verification", "re-finding the screen after badge-tap").
- **Opportunities** — change-verb-first ("expose status without navigation") — directions, not features.

**Traceability is per cell:** every cell ends with `(P03)` / `(P01, P05)` / `(INS-012)` or `[assumption]`. The emotion row is the most-faked row in the genre — emotions come from stated feelings or observed behavior, or they wear the assumption tag.

## Step 4 — Handoffs as first-class rows

Two dedicated rows run the full width of the map:

- **Role-to-role:** every transfer of responsibility — shift handoff, nurse→pharmacist, unit→receiving department. Per handoff: what's transferred, **in what medium** (verbal, paper, system, hope), what's known to drop, and the failure mode with its consequence.
- **System-to-system:** every boundary the *information* crosses — EHR→pharmacy system, interface engine, fax, re-keyed by hand. Re-keying and faxing are findings, name them as such.

Cells where a role handoff and a system handoff stack on the same stage are flagged — compound handoffs are where clinical journeys break worst, and they're prime moments-that-matter candidates.

## Step 5 — Rank moments that matter

Score each candidate moment (emotional troughs, compound handoffs, stages with stacked pains) on **consequence** (what fails downstream — in clinical contexts often safety- or compliance-shaped), **frequency** (every shift vs monthly), and **emotional intensity** (from the curve). Rank, keep the top 3–5, and write one line each on why it made the cut. This ranking is what `/insight-report` will quote.

## Step 6 — Opportunities, tied to moments

Consolidate stage-level opportunities, keep the ones addressing ranked moments or strong pains, and phrase as problem-directions ("eliminate the re-keying step between systems"), not solutions ("build an integration dashboard"). Solutions belong to `/design-brief`. Tag each with the moment/pain it serves.

## Step 7 — Write the artifact

Write `ux/journeys/<slug>.md` (slug = persona + scenario, e.g. `coordinating-nurse-shift-handoff.md`): artifact header per PIPELINE.md (`artifact: journey-map`, `sources:` listing the persona file and synthesis artifacts), `status: draft`.

## Quality bar

- One persona, one scenario, explicit trigger → end state; current state unless loudly labeled otherwise.
- Every cell cites P-codes/INS-IDs or wears `[assumption]` — the emotion row included; an all-evidence emotion row with no assumptions deserves suspicion too.
- Both handoff rows populated; every handoff names medium, drop risk, and failure mode; compound handoffs flagged.
- Moments that matter are ranked with visible scoring, not vibes.
- A stakeholder can trace any cell to evidence in one hop, and the map reads left-to-right as a story.

## Handoff

End with: what was produced (`ux/journeys/<slug>.md`, `status: draft`), the top moment-that-matters in one line, assumption density (e.g. "9 of 60 cells assumed — concentrated in stage 4"), and the suggested next step — `/insight-report` to fold this into the readout, or another `/journey-map` if a second persona's view of the same scenario would expose the handoff from both sides. Suggest, don't auto-run.
