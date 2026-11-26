# Designer onboarding — day one

## Install (2 minutes)

```bash
git clone --single-branch --depth 1 git@github.com:eldinesh/skill-cloud.git ~/.claude/skills/skill-cloud
cd ~/.claude/skills/skill-cloud && ./setup    # pick: 2) Designer
```

Skills are now live in **Claude Code and Cowork** — same install, both surfaces. Updates announce themselves the next time you use a skill; pick "Always keep me up to date" once and never think about it again.

## How your skills fit together

Design work in SkillCloud starts where research ends: **`/design-brief` consumes `ux/insight-report.md`** — the researcher's readout is your declared input. From there:

- **Quality loop:** `/design-critique` (intent-first, severity-rated), `/heuristic-evaluation` (Nielsen + healthcare heuristics), `/accessibility-audit` (WCAG 2.2 AA / 508) — run them on explorations early, not at the end.
- **Build the record as you go:** `/component-spec` for anything reusable, `/ux-writing` for copy (registers matter: patient-facing vs clinician-facing), `/design-rationale` so "why did we do X" survives you rolling off.
- **Delivery:** `/handoff-spec` (Figma-fluent, states enumerated, a11y annotations) → after the build, `/design-qa-checklist` against the spec, not memory.
- **File discipline:** `/figma-hygiene` sets up or cleans up the Figma file — run it when a project starts and before any handoff.

Lost? `/design-lead` shows where the project stands and what's next. Every skill ends by telling you the next step anyway.

## The ux/ folder

Everything skills produce lands in the project's `ux/` folder in standard formats, each artifact tracing its sources. That's what makes the next skill — and the next person — able to pick up where you left off.

## Guardrails (read this twice)

- Every project has `ux/project-context.md` with its **domain** and **data rules** (standard by default; restricted only when a contract says so). Skills read it first; if it's missing they create it from the material and keep moving — no questionnaire.
- **Screenshots are the designer's PHI trap:** healthcare UIs — including staging environments — routinely show live patient data. Blur, crop, or rebuild with synthetic data before any AI processing or pasting into artifacts.
- One project per folder and per session. Project A's material never appears in Project B's context.

## Unfamiliar territory

Dropped into IoT, fintech, clinical workflows — anything you don't know? `/topic-deep-dive`: plain-language explanation first (analogy, no jargon), working knowledge and expert depth only when you ask, plus the exact questions to take to the engineers. Saves to the project's `ux/domain-primer.md` so the team's understanding accumulates.

## Help & requests

Your design champion: [TO FILL]. Want a new skill or a fix? `docs/CONTRIBUTING.md` — proposals are welcome and reviewed against `docs/CURATION.md`.
