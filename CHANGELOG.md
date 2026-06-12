# Changelog

All notable changes to SkillCloud. Maintainers: bump `VERSION` and add an entry here in the same commit — the self-update prompt reads this file to show "what's new".

## 0.9.0 — 2026-06-11

Initial internal release candidate.

- Core bundle: `skillcloud` (status/update/doctor), `company-handbook` (HR & policy Q&A — policy content pending from HR), `engagement-guardrails` (per-client AI tiers + healthcare data hygiene), `ux-pipeline` (orchestrator).
- Research bundle (10 skills): research-plan → interview-guide → interview-synthesis → affinity-mapping → cross-study-synthesis → jobs-to-be-done → persona → journey-map → usability-test-plan → insight-report.
- Design bundle (10 skills): design-brief → critique/heuristic-evaluation/accessibility-audit/ux-writing/component-spec → design-rationale → handoff-spec → design-qa-checklist, plus figma-hygiene.
- Pipeline artifact contracts: every skill reads `ux/project-context.md`, consumes upstream artifacts, produces standard outputs, suggests the next step (see `docs/PIPELINE.md`).
- gstack-style self-update: skills check `VERSION` against origin on invocation and prompt to upgrade (snooze and auto-upgrade supported).
- `setup.sh` role-based install (researcher / designer / both) symlinking into `~/.claude/skills/` — works in Claude Code and Cowork from one install.
