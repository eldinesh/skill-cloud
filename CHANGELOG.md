# Changelog

All notable changes to SkillCloud. Maintainers: bump `VERSION` and add an entry here in the same commit — the self-update prompt reads this file to show "what's new".

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
