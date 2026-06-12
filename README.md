# SkillCloud

The company's curated Claude skills — one install, the same high-quality setup for everyone. Built for how we actually work: UX research and design as a pipeline, where each step's output feeds the next step's input.

**Internal company asset. Private — not for external distribution.**

## Install (2 minutes, once)

```bash
git clone <org-remote-url> ~/SkillCloud
cd ~/SkillCloud && ./setup.sh
```

Pick your role (researcher / designer / both). That's it — skills are live in **Claude Code and Cowork** immediately. Updates announce themselves: when a new version ships, the next skill you use will offer to upgrade (or set it to auto-update and never think about it again).

For claude.ai web chat, grab per-skill zips from the repo's Releases page and upload via Settings → Capabilities → Skills.

Coming from a personal skill-pack setup? See [docs/CLEANUP.md](docs/CLEANUP.md) to retire old installs first.

## What's inside

| Bundle | Skills |
|---|---|
| **core** (everyone) | `skillcloud` (status/update/doctor), `company-handbook` (HR & policy questions), `engagement-guardrails` (client AI tiers + healthcare data hygiene), `ux-pipeline` (the orchestrator) |
| **research** | research-plan, interview-guide, interview-synthesis, affinity-mapping, cross-study-synthesis, jobs-to-be-done, persona, journey-map, usability-test-plan, insight-report |
| **design** | design-brief, design-critique, heuristic-evaluation, accessibility-audit, component-spec, ux-writing, design-rationale, handoff-spec, design-qa-checklist, figma-hygiene |

The skills are wired together: every one reads the project's `ux/project-context.md`, consumes the previous step's artifact, produces the next step's input, and tells you what comes next. Run `/ux-pipeline` on any project to see where you are and what to do next. The full map lives in [docs/PIPELINE.md](docs/PIPELINE.md).

## Working with client material

We work embedded in client organizations — many in healthcare. Every skill that touches client material enforces the engagement's AI tier (prohibited / limited / permitted) and de-identifies people data on intake. Read `engagement-guardrails` once; it's short and it's the rule.

## Maintaining SkillCloud

- **Request or propose a skill:** open an issue or PR — see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Your role champion reviews against [docs/CURATION.md](docs/CURATION.md).
- **Release:** maintainers bump `VERSION` + `CHANGELOG.md` in the same commit; everyone gets the upgrade prompt within a day.
- **Quality gate:** `tools/validate.sh` must pass (CI runs it on every push).
