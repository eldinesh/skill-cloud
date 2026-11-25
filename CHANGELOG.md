# Changelog

All notable changes to SkillCloud. Maintainers: bump `VERSION` and add an entry here in the same commit — the self-update prompt reads this file to show "what's new".

## Unreleased — Koru 3.0 plugin (alpha, branch koru-3.0)

SkillCloud becomes the Koru 3.0 plugin. Spec: Koru delivery system design spec v2. Guide: docs/KORU-3.md.

- **Plugin:** `.claude-plugin/` manifest and private marketplace; every existing skill loads inside it.
- **Engine (`koru`):** project graph of cards with fixed shapes per type, typed links pinned by version, sign-off by role, revise and supersede, stale and writeback flags with impact preview, thresholds before results, deterministic gates, health numbers.
- **Hooks:** human-only sign-off, confidence and Insights; consent and contract before AI sees research; originals and the name map never readable; exact quotes; synthetic output never evidence; client limits on Figma and Jira; Definition of Ready before Jira tickets; provenance stamps and automatic versions; session-start recap.
- **Commands:** `/koru:start`, `where`, `join`, `note`, `decide`, `gate`, `share`, `ship`, `board`.
- **Skills:** `koru-frame`, `koru-explore`, `koru-harden`, `koru-ship`, `koru-cards`, `koru-deliverables`.
- **Checkers:** research, direction, harden and spec agents: fresh context, read-only, list and never fix.
- **Board and outputs:** board, decision log, trace, client page with AI-use note, finals-only Claude project knowledge.
- **Deliverables:** HTML, Figma, front-end code or any mix; password-protected share pages and publishing to Koru's hosted service.
- **Tests:** `tests/koru/test.js` (45 checks with planted defects), run by `tools/validate.sh` with `claude plugin validate`.

## 0.10.0 — 2026-06-12

New: `sense-shape-steer` — the agency's framework for AI product UX, as a skill.

- Full framework encoded from the workbook, sprint deck, and demo: SENSE (five worksheets + AI Opportunity Statement), SHAPE (seven interaction patterns, 4-step pattern selector, storyboard grid, touchpoint swimlanes, trust & transparency checklist, three readiness checkpoints), STEER (four metric worksheets, three tracking levels, four feedback-loop types, six common mistakes), CONCLUDE (prioritize / feasibility / ownership / risks → build-ready blueprint).
- Three modes: **run** (apply the framework with Claude now — days become gates), **facilitate** (support a real team sprint with the real timeline, prep packs, and board capture), **learn** (layered tutoring).
- New `ai` skill group, installed for every role. Artifacts land in `ux/sprint/`; the blueprint feeds /design-brief, the STEER plan feeds /usability-test-plan. Routing block updated.

## 0.9.2 — 2026-06-12

- Questions policy sharpened: skills never ask administrative questions (project type, classification, permissions — defaults exist), but when something material to the work is genuinely unclear — who the participants are, what decision the output should inform — they ask that one sharp question before producing. Outputs always land as drafts with gaps flagged; humans promote them.

## 0.9.1 — 2026-06-12

A project is a project, any industry, plus a new core skill.

- **No more client/internal classification.** Skills no longer decide or ask what kind of project something is. Each project's `ux/project-context.md` carries its domain and data rules; the default is *standard* (work normally, de-identify people data on intake), and *restricted* applies only when a contract bars AI processing — then skills refuse and say why.
- **Missing context no longer interrogates you.** Skills create `ux/project-context.md` from the material at hand, state their inference in one line, and keep working — you correct the file, not answer a questionnaire.
- **Industry-adaptive, not healthcare-hardwired.** The domain in project-context drives identifier sweeps, registers, heuristics, and field logistics. The healthcare playbooks remain as the shipped worked example; skills adapt them to whatever industry the project is in.
- **New core skill: `topic-deep-dive`.** Plain-language explanations of unfamiliar technical/domain topics — analogy first, zero jargon — with working-knowledge and expert levels only on request, ready-to-ask SME questions, and a per-project `ux/domain-primer.md` that accumulates for the team.

## 0.9.0 — 2026-06-11

Initial internal release candidate.

- Core bundle: `skillcloud` (status/update/doctor), `company-handbook` (HR & policy Q&A — policy content pending from HR), `engagement-guardrails` (per-client AI tiers + healthcare data hygiene), `ux-pipeline` (orchestrator).
- Research bundle (10 skills): research-plan → interview-guide → interview-synthesis → affinity-mapping → cross-study-synthesis → jobs-to-be-done → persona → journey-map → usability-test-plan → insight-report.
- Design bundle (10 skills): design-brief → critique/heuristic-evaluation/accessibility-audit/ux-writing/component-spec → design-rationale → handoff-spec → design-qa-checklist, plus figma-hygiene.
- Pipeline artifact contracts: every skill reads `ux/project-context.md`, consumes upstream artifacts, produces standard outputs, suggests the next step (see `docs/PIPELINE.md`).
- Self-update: skills check `VERSION` against origin on invocation and prompt to upgrade (snooze and auto-upgrade supported).
- `setup` role-based install (researcher / designer / both) symlinking into `~/.claude/skills/` — works in Claude Code and Cowork from one install.
