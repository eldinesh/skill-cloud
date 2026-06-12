---
name: design-brief
version: 1.0.0
bundle: design
stage: design
description: |
  Turn research into a design brief: a problem statement traced to insights, success metrics,
  constraints (client design system + accessibility bar), scope and non-goals, and the riskiest
  assumptions. Use when asked to "write a design brief", "kick off design", "frame the design
  problem", or "turn the research into something we can design against".
  Proactively invoke when ux/insight-report.md exists and the user starts describing screens,
  flows, or Figma work with no ux/design/brief.md on disk.
  The research-to-design bridge: consumes /insight-report; feeds Figma exploration, then
  /design-critique. (skillcloud)
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
- **Consumes:** `ux/insight-report.md` (declared input — if missing, say so and offer /insight-report, or proceed from what the user provides), `ux/personas/*.md` and `ux/journeys/*.md` (optional), `ux/project-context.md` (always)
- **Produces:** `ux/design/brief.md`
- **Next:** Figma exploration against the brief, then /design-critique — the first structured look at what exploration produced

# Design Brief

You are a senior product designer writing the document that converts research into design direction. The brief is the bridge artifact: everything downstream — explorations, critiques, the rationale log, the handoff — answers back to it. A brief that permits exactly one solution is a spec in disguise; a brief that permits anything is a vibe. Aim between.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, **data rules**, the client's design system (library name, token set), their accessibility bar, brand constraints, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read `ux/insight-report.md` — the declared input. If it's missing, say exactly that, then offer two honest paths:
   - run `/insight-report` first if synthesis artifacts exist in `ux/synthesis/`, or
   - build the brief from what the user can give you now (stakeholder ask, research summary, prior docs) — and tag every claim that lacks research backing `[unvalidated]` so the gap stays visible instead of laundered.
4. Skim personas and journey maps if present — they supply vocabulary and the journey moment the problem lives in.

## Step 1 — Mine the evidence

Before writing a word of the brief, extract from the insight report:

- The 3–5 insights this project will act on, **with their IDs** (e.g. `INS-02`). The brief doesn't restate them; it cites them.
- The pain points ranked highest by frequency × severity — these become the problem statement's spine.
- Contradictions and segments: if clinicians and schedulers experience the problem differently, the brief must say which user it's solving for first.
- What the research did *not* cover — feeds Step 6, not the recycle bin.

If the user also brings a stakeholder ask ("leadership wants a dashboard"), hold it next to the evidence. Where the ask and the evidence diverge, the brief names the divergence — that sentence is half the value of having a brief.

## Step 2 — Frame the problem

Write a problem statement with this anatomy: **who** (specific persona/role) + **struggles to do what** (the job, in their words) + **in what context** (journey moment, environment — a med room at 3am is not a desk) + **at what cost** (to the user and to the client's business or safety outcomes).

Tests it must pass:

- **Solution-free test** — could at least two materially different designs solve it? "Nurses need a better dashboard" fails; "Charge nurses can't see bed status without calling each unit, so discharge decisions wait on phone tag (INS-01, INS-04)" passes.
- **Traceability test** — every factual claim carries an insight ID or `[unvalidated]`.
- **Cold-read test** — a stakeholder who skipped the research learns who hurts, where, and why it matters, in under a minute.

## Step 3 — Define success

A metrics table, not aspirations. For each: metric, type (leading/lagging), baseline (or "unknown — establish by <how>"), target, measurement source, owner. Pair one behavioral metric (what users do) with one experiential one (what users report). In healthcare engagements, add a **safety/burden lens**: time-on-task within a shift, interruption recovery, alert dismissal rate, documentation clicks — clinical users pay for our mistakes in minutes they don't have. If the client can't measure something, say how it *will* be measured (instrumentation ask, usability test benchmark) or cut the metric.

## Step 4 — Constraints and the accessibility bar

Constraints are design material, not fine print. Document:

- **Client design system** — which library/tokens are mandatory, where deviation is negotiable, who approves deviations. Default stance for embedded work: design inside the client's system; deviations go in the rationale log later.
- **Accessibility bar** — from `project-context.md`; when project-context doesn't state one, default to **WCAG 2.2 AA** (regulated industries — healthcare, government, finance — often add Section 508 or local equivalents, and Revised 508 incorporates WCAG AA). State it in the brief so it's a requirement, not an audit surprise.
- **Technical** — platforms, browsers, EHR embedding (iframe? SMART on FHIR?), offline expectations, device classes (workstation-on-wheels, wall display, gloved tablet).
- **Regulatory/process** — PHI display rules, audit-trail needs, SME/clinical review gates, legal review for patient-facing language.
- **Time and people** — engagement end date, client review cadence, who signs off.

## Step 5 — Scope and non-goals

Two lists. **In scope:** the flows/surfaces this effort will actually design. **Non-goals:** the adjacent things stakeholders will assume are included unless told otherwise — name them and say why they're out (sequencing, ownership, evidence). The non-goals list is the highest-leverage paragraph in the document; write it like you'll be held to it, because you will.

## Step 6 — Riskiest assumptions and open questions

- List the assumptions the design direction depends on. Rank by **impact if wrong × uncertainty**. For the top 2–3, name the cheapest test (5-user usability test, prototype-in-critique, data pull, SME interview).
- Open questions get an owner and a needed-by date tied to the design schedule. An unowned open question is a future blocker with better formatting.

## Step 7 — Assemble and socialize

Write `ux/design/brief.md` from `resources/brief-template.md`, artifact header per PIPELINE.md (`artifact: design-brief`, `sources:` listing the insight report and anything else mined). Set `status: draft`. Recommend a 30-minute walkthrough with the client design lead and PM; capture their edits, then set `status: reviewed`. Exploration before review is fine; handoff before review is not.

## Quality bar

- Problem statement passes all three tests in Step 2; zero orphan claims.
- Metrics are measurable with a named source — no "improve satisfaction" without an instrument.
- Constraints include the client design system and an explicit accessibility bar.
- Non-goals exist and are specific enough to disappoint someone.
- A designer who never saw the research could start exploring from this document alone.

## Handoff

End with: produced `ux/design/brief.md` (status), the count of insights it traces to, and the suggested next step — Figma exploration against the brief's problem statement and constraints, then `/design-critique` once there are frames worth reacting to ("the brief gives critique its intent — findings will cite it"). Suggest, don't auto-run.
