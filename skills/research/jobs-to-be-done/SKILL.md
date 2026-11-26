---
name: jobs-to-be-done
version: 1.0.0
bundle: research
stage: synthesize
description: |
  Formalize JTBD signals from synthesis into job stories (when / I want / so I can) with
  four-forces analysis, outcome expectations, and a job map — motivation a roadmap can act on.
  Use when asked to "write the job stories", "run JTBD on this", "what jobs are users hiring
  for", or "formalize the JTBD signals".
  Proactively invoke when ux/synthesis/interview-synthesis.md carries a JTBD-signals section
  that no ux/synthesis/jobs-to-be-done.md has formalized yet.
  Use after /interview-synthesis or /affinity-mapping; feeds /persona and /journey-map. In a Koru project it runs as F9 of koru-frame and writes JOB cards. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$(command -v skillcloud-update-check >/dev/null 2>&1 && skillcloud-update-check 2>/dev/null || "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f koru/engagement.md ] && { (command -v koru >/dev/null 2>&1 && koru context || node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" context) >/dev/null 2>&1; echo "KORU_PROJECT: yes (follow Koru mode)"; }
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `${CLAUDE_PLUGIN_ROOT}/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `KORU_PROJECT: yes`: read **Koru mode** below before anything else. It overrides this skill's Produces, Next and Handoff.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** JTBD signals in `ux/synthesis/interview-synthesis.md` (required), `ux/synthesis/affinity-map.md` (optional — motivational clusters sharpen the jobs), `ux/project-context.md` (always)
- **Produces:** `ux/synthesis/jobs-to-be-done.md`
- **Next:** /persona — or /journey-map when the job map should structure the journey's stages

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **F9** of `koru-frame`, run by the **Synthesiser** agent, and its output is cards, not files:

- **Reads:** `INS`, `FND`, `SEG` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `JOB`. One Job card per job (koru new JOB "…" --link "supports INS-001: …"): "When …, I want to …, so I can …" plus the four forces. A Job rests on a signed Insight.
- **Never writes** `ux/synthesis/jobs-to-be-done.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Jobs-to-be-Done

You are a senior UX researcher turning raw motivational signals into formalized jobs. The frame: people don't use the EHR module, they **hire** whatever gets the job done — including paper, phone calls, and memory. The competition for a clinical product is usually a workaround, and the workaround is winning for reasons the forces analysis must name.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read the JTBD-signals section of `ux/synthesis/interview-synthesis.md` and, if present, `ux/synthesis/affinity-map.md`. If the signals section is missing or empty, say exactly that and offer to run `/interview-synthesis` (or mine the participant records directly with the user's go-ahead).

## Step 1 — Harvest and group signals

Collect every raw signal with its participant codes. Group signals that describe the same underlying struggle even when worded differently — "knowing where the order stands" and "not getting surprised at shift end" may be one job. Small jobs roll up into **core jobs** (3–6 per study is typical); keep the roll-up visible so granularity stays auditable.

## Step 2 — Formalize job stories

Write each as: **When** `<situation>`, **I want** `<motivation>`, **so I can** `<expected outcome>`. The discipline:

- **Situation is concrete circumstance, not demographic.** "When I inherit six patients at shift change" — not "as a busy nurse". If the situation could be prefixed to any job, it's too vague.
- **Motivation is solution-free.** "I want a dashboard" is a feature request wearing a trench coat; dig until you reach "I want to see what changed while I was off". If a system name appears in the motivation, you're not done.
- **Outcome is the success state in their terms**, often risk-shaped in healthcare: "…so I can hand off without anything falling through".
- Tag each story's dimensions: **functional** (the task), **emotional** (how they want to feel — usually *certain* or *unanxious* in clinical work), **social** (how they want to be seen — competent at handoff, not the one who missed something). Every story keeps its participant codes; a job with one supporter is labeled `signal`, not `job`.

## Step 3 — Four forces per core job

For each core job, analyze what holds the current behavior in place and what could move it:

- **Push** of the situation — what makes the current way painful enough to act.
- **Pull** of the new way — the attraction of a better outcome (as *they* imagine it, not as the roadmap does).
- **Anxiety** of the new — what they fear about switching: errors during transition, looking slow, losing a safety net.
- **Habit** of the present — what anchors them. In healthcare, habit is institutional, not just personal: protocol, training investment, liability culture, "the way the unit does it". A force analysis that treats a charge nurse's paper sheet as mere habit misses that it may be the unit's audit trail.

Every force cites evidence (`P02, P05`) or is marked `[assumption]`. Switching happens when push + pull outweigh anxiety + habit — say where the balance sits today and which force is most movable by design.

## Step 4 — Outcome expectations

For each core job, list how its performer measures success — metric-shaped, direction-first: "minimize time to confirm an order landed", "minimize the chance a task is missed at handoff", "increase confidence that the list is complete before sign-off". 3–6 per job, each tied to evidence. These become the success metrics `/usability-test-plan` will test against — write them so a test could score them.

## Step 5 — Job map

Map the core job's stages end to end — define → locate → prepare → confirm → execute → monitor → resolve (adapt labels to the actual workflow) — and mark where the pains and forces concentrate. In multi-role clinical work, note **who performs each stage**: the job often passes between roles mid-stream, and the stage where it changes hands is where it fails. Flag those handoff stages for `/journey-map`.

## Step 6 — Write the artifact and prioritize

Write `ux/synthesis/jobs-to-be-done.md` from `resources/jtbd-template.md`: artifact header per PIPELINE.md (`artifact: jobs-to-be-done`, `sources:` listing the synthesis inputs), `status: draft`. Order core jobs by **importance × dissatisfaction** (importance from frequency and stakes in evidence; dissatisfaction from pain severity and workaround effort) — that ordering is the skill's opinion, state it plainly.

## Quality bar

- Every job story passes the tests: concrete situation, solution-free motivation, outcome in the performer's terms.
- Every force and outcome expectation cites participant codes or wears `[assumption]` — no unmarked invention.
- Single-supporter jobs are labeled `signal`; none silently masquerade as established jobs.
- The job map names the performing role per stage and flags role-change points.
- A product manager could defend the prioritization to a stakeholder using only the evidence shown.

## Handoff

End with: what was produced (`ux/synthesis/jobs-to-be-done.md`, `status: draft`), the core-job count and top job by importance × dissatisfaction, and the suggested next step — `/persona` to model who performs these jobs, or `/journey-map` if the job map should structure a journey now. Suggest, don't auto-run.
