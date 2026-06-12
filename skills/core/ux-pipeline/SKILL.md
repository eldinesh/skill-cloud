---
name: ux-pipeline
version: 1.0.0
bundle: core
description: |
  The orchestrator: shows where this project stands in the UX pipeline (discover →
  synthesize → define → design → validate → deliver) and runs the next step — or a whole
  phase — with approval gates between steps.
  Use when asked "where are we", "what's next", "pipeline status", "run the pipeline",
  "start a new ux project", or "take this through to <artifact>".
  Proactively invoke when someone is unsure what to do next on a UX project, or asks to
  run several research/design steps end to end. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls -R ux 2>/dev/null | head -60 || echo "UX_FOLDER: none"
grep -h '^status:' ux/*.md ux/*/*.md 2>/dev/null | sort | uniq -c || true
"${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-config" get role 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: this is step zero — run the **engagement-guardrails** setup (read `~/.skillcloud/repo/skills/core/engagement-guardrails/SKILL.md` and follow "Setting up a project") before anything else.

# UX Pipeline

You orchestrate the SkillCloud pipeline. You never invent work — you read what exists in `ux/`, place the project on the map, and run sibling skills as the user approves. The full artifact spec lives in `~/.skillcloud/repo/docs/PIPELINE.md`.

## The map

| Stage | Skills | Key artifacts in `ux/` |
|---|---|---|
| discover | research-plan → interview-guide → interview-synthesis | research-plan.md, interviews/guide.md, interviews/P*.md, synthesis/interview-synthesis.md |
| synthesize | affinity-mapping → cross-study-synthesis → jobs-to-be-done | synthesis/affinity-map.md, synthesis/cross-study.md, synthesis/jobs-to-be-done.md |
| define | persona, journey-map → insight-report | personas/*.md, journeys/*.md, insight-report.md |
| design | design-brief → critique · heuristic-evaluation · accessibility-audit · ux-writing · component-spec → design-rationale | design/brief.md, design/critiques/*, design/heuristic-eval.md, design/accessibility-audit.md, design/copy/*, design/components/*, design/rationale.md |
| validate | usability-test-plan → (findings loop back via interview-synthesis) | validation/usability-test-plan.md |
| deliver | handoff-spec → design-qa-checklist | delivery/handoff-*.md, delivery/qa-checklist.md |

## Step 1 — Place the project

From the preamble's `ux/` listing and `status:` counts, build the standing report:

```
PROJECT: <name> — domain: <domain>
discover    ✓ research-plan (final)   ✓ guide   ✓ synthesis (draft, 6 participants)
synthesize  ✓ affinity-map (draft)    ◯ cross-study   ◯ jtbd
define      ◯ personas   ◯ journeys   ◯ insight-report
design      —   (blocked: needs insight-report)
validate    —
deliver     —
NEXT UP: /cross-study-synthesis (you have two studies' synthesis on disk) or /jobs-to-be-done
```

Mark each artifact ✓/◯ with its `status:` value. Call out anything stale (artifact's `sources:` newer than itself) and anything skipped (a later artifact exists while an earlier required one doesn't — flag it, don't silently accept it).

## Step 2 — Pick the mode

Ask (or infer from the request):

- **STATUS** — report only. Default when the user asked "where are we". Stop after Step 1.
- **NEXT** — run the single next skill.
- **PHASE** — run the remaining steps of the current stage, gating between skills.
- **TO <artifact>** — run everything between here and a named target (e.g. "take this to the insight report"), gating at stage boundaries.

## Step 3 — Run sibling skills (the autoplan pattern)

To run a skill: read `~/.skillcloud/repo/skills/<bundle>/<skill-name>/SKILL.md` and **treat it as executable instructions** — run its workflow fully inside this session (its Step 0 gate, its de-identification rules, its artifact format). Its Handoff returns control here instead of stopping.

Gates: after each skill completes, show a 3-line summary (artifact produced, status, what it feeds) and ask: **approve & continue / revise this / stop here**. In TO-mode, gate at stage boundaries instead of every skill.

## Decision principles (when running multi-step)

1. **Data rules are absolute.** The engagement-guardrails gate runs inside every skill; explicitly restricted material stops the pipeline, full stop.
2. **Evidence over momentum.** Never fabricate an upstream input to keep moving. Missing input → stop, name it, offer the upstream skill.
3. **Drafts, not finals.** Everything you produce lands as `status: draft`; humans promote to reviewed/final.
4. **Skips are loud.** The user may skip a stage deliberately — record "skipped <skill> by choice <date>" in the produced artifact's header notes rather than pretending the input existed.
5. **Small batches.** Synthesis after every 2–3 sessions beats one heroic batch; suggest the loop, don't hoard.

## Role awareness

If the installed role is `researcher` and the next step is a design-stage skill (or vice versa), say so plainly: "insight-report is ready — this is the handoff point; your designer picks it up with /design-brief" — and stop there unless the user has both bundles.

## Handoff

In every mode, end with the standing report delta (what changed this run) and the single next suggested step with its one-line reason.
