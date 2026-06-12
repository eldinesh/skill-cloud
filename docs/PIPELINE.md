# PIPELINE.md — Artifact Contracts & Skill Authoring Standard

This is the spec that makes 24 skills behave like one system. Every skill — adapted or written from scratch — follows it exactly. `tools/validate.sh` enforces the mechanical parts.

## 1. The map

```
ux/project-context.md  ← keystone. Created on first use. EVERY skill reads it first.

DISCOVER     /research-plan → /interview-guide → [fieldwork] → /interview-synthesis
SYNTHESIZE   /affinity-mapping → /cross-study-synthesis → /jobs-to-be-done
DEFINE       /persona + /journey-map → /insight-report
                                          │ bridge: insight-report is design-brief's declared input
DESIGN       /design-brief → [Figma work] → /design-critique · /heuristic-evaluation ·
             /accessibility-audit · /ux-writing · /component-spec → /design-rationale
VALIDATE     /usability-test-plan → findings loop back into /interview-synthesis
DELIVER      /handoff-spec → /design-qa-checklist
```

`/ux-pipeline` reads this map, inspects which artifacts exist in the project's `ux/` folder, reports where the project stands, and runs the next step (or a whole phase) with approval gates.

## 2. The artifact tree

All pipeline outputs live in the project's `ux/` folder:

```
ux/
├── project-context.md            # keystone (template in engagement-guardrails/resources/)
├── research-plan.md
├── interviews/
│   ├── guide.md
│   └── P01.md, P02.md, ...       # de-identified per-participant notes (NEVER raw names)
├── synthesis/
│   ├── interview-synthesis.md
│   ├── affinity-map.md
│   ├── cross-study.md
│   └── jobs-to-be-done.md
├── personas/<slug>.md
├── journeys/<slug>.md
├── insight-report.md
├── design/
│   ├── brief.md
│   ├── critiques/<yyyy-mm-dd>-<scope>.md
│   ├── heuristic-eval.md
│   ├── accessibility-audit.md
│   ├── components/<name>.md
│   ├── copy/<scope>.md
│   └── rationale.md
├── validation/usability-test-plan.md
└── delivery/
    ├── handoff-<scope>.md
    └── qa-checklist.md
```

## 3. Artifact header (every produced file starts with this)

```yaml
---
artifact: <kind>                  # e.g. persona, insight-report
project: <client codename>        # from project-context.md — codename, never the real name on limited-tier engagements
created_by: skillcloud/<skill> v<VERSION>
sources: [ux/synthesis/interview-synthesis.md, ...]   # upstream artifacts this was built from
status: draft                     # draft | reviewed | final
updated: <yyyy-mm-dd>
---
```

`sources:` is what makes insights evidence-linked end to end — a persona traces to the synthesis, the synthesis traces to the de-identified interviews.

## 4. SKILL.md authoring standard

### 4.1 Frontmatter

```yaml
---
name: <folder-name>               # must match the folder exactly
version: 1.0.0
bundle: core | research | design
stage: discover | synthesize | define | design | validate | deliver   # pipeline skills only
description: |
  <One-liner: what it does and what it produces.>
  Use when asked to "<phrase>", "<phrase>", "<phrase>".
  Proactively invoke when <observable condition in the conversation>.
  <Chain note: Use after /x; feeds /y.> (skillcloud)
---
```

Description rules: ≤ 8 lines, must contain `Use when`, must end with `(skillcloud)`. The description is the router — write trigger phrases people actually say, and make the proactive condition observable ("the user pastes an interview transcript"), not vague ("when relevant").

### 4.2 Standard preamble (immediately after frontmatter, verbatim)

````markdown
## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing` and this skill touches client material: offer to create `ux/project-context.md` from the template in `engagement-guardrails` before processing anything. If the user declines, ask for the engagement AI tier verbally and proceed accordingly.
````

Everything is failure-safe (`|| true`) — offline, Cowork, or a missing install must never break the skill.

### 4.3 Step 0 — context and guardrails gate (pipeline skills)

Every research/design skill starts its workflow with:

1. Read `ux/project-context.md` — client codename, **engagement AI tier**, brand, constraints, glossary.
2. Apply the tier (full rules in `engagement-guardrails`):
   - **prohibited** → STOP. Do not process client material. Explain and point to `engagement-guardrails`.
   - **limited** → operate only on de-identified input; if input contains live PII/PHI, de-identify on intake before any analysis and never echo the raw identifiers back.
   - **permitted** → still de-identify people data by default (Safe Harbor habits).
3. Read this skill's **Consumes** artifacts if present; if missing, say exactly what's missing and offer to either run the upstream skill or proceed with what the user provides.

### 4.4 Contract block (pipeline skills, required — validate.sh checks it)

```markdown
## Contract
- **Consumes:** `ux/<path>` (required|optional), `ux/project-context.md` (always)
- **Produces:** `ux/<path>`
- **Next:** /<skill> — <why that's the natural next step>
```

### 4.5 Next-step handoff (how chains happen)

End every pipeline-skill run by stating, in one short block: what was produced and where, its `status`, and the suggested next skill with a one-line reason ("Inputs for /persona are ready — synthesis has 6 themes across 8 participants"). **Suggest, never auto-run** — only `/ux-pipeline` chains skills, behind its own approval gates.

### 4.6 Resources

Templates, checklists, and worked examples live in the skill's `resources/` folder and are referenced by relative path from the SKILL.md. Examples must be fully synthetic — fictitious org names, P-numbers for people, no real client material. (validate.sh tripwires SSN/MRN-shaped strings.)

### 4.7 Voice

Skills write like a senior practitioner: direct, concrete, no filler. Outputs are scannable documents a stakeholder could read cold. When a skill asks the user something, it asks one sharp question, not a survey.

## 5. Compatibility rules (the whole point)

A skill belongs in SkillCloud only if it:
1. reads `project-context.md` first,
2. consumes upstream artifacts when they exist and names what's missing when they don't,
3. produces its output at the standard path in the standard format with the artifact header,
4. ends with the next-step handoff.

That's what turns isolated intelligence into a streamlined system.
