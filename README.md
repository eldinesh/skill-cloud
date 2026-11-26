# SkillCloud

Internal skill system for UX work. One repo, versioned, curated — research and design skills wired as a pipeline, where each step's output feeds the next step's input. Private; not for distribution.

## Koru 3.0 plugin (this branch)

SkillCloud is becoming **Koru 3.0**: one Claude Code plugin that runs the Koru playbook (Frame, Explore, Harden, Ship) on a project graph of evidence cards. An orchestrator (`/koru:run`) hands each step to a specialist agent that uses these skills; four independent checkers review every gate; hooks enforce the never-break rules; a visual board shows it all. All the skills below ship inside it. Guide: [docs/KORU-3.md](docs/KORU-3.md).

```bash
git clone -b koru-3.0 git@github.com:eldinesh/skill-cloud.git ~/koru-plugin
claude plugin marketplace add ~/koru-plugin
claude plugin install koru@koru
```

Then, in a project folder: `/koru:start`.

## Install (skills only, without the Koru plugin)

```bash
git clone --single-branch --depth 1 git@github.com:eldinesh/skill-cloud.git ~/.claude/skills/skill-cloud
cd ~/.claude/skills/skill-cloud && ./setup
```

Pick your role (researcher / designer / both). Setup links the skills into `~/.claude/skills/` — Claude Code and Cowork both read it — and offers to add a `skillcloud` section to your `~/.claude/CLAUDE.md` so Claude routes to the skills on its own. Per-project routing rules: [docs/ROUTING.md](docs/ROUTING.md).

Updates: when a new version ships, the next skill you use offers the upgrade (snooze, or enable auto-update in `~/.skillcloud/config.yaml`). Manual: `/skillcloud` → update.

claude.ai web chat: per-skill zips are on the Releases page; upload via Settings → Capabilities → Skills.

Migrating from personal skill packs: [docs/CLEANUP.md](docs/CLEANUP.md).

## What's inside

| Bundle | Skills |
|---|---|
| **core** (everyone) | `skillcloud` (status/update/doctor), `company-handbook` (HR & policy questions), `engagement-guardrails` (data rules + de-identification habits), `ux-pipeline` (the orchestrator), `topic-deep-dive` (plain-language explanations of unfamiliar topics) |
| **research** | research-plan, interview-guide, interview-synthesis, affinity-mapping, cross-study-synthesis, jobs-to-be-done, persona, journey-map, usability-test-plan, insight-report |
| **design** | design-brief, design-critique, heuristic-evaluation, accessibility-audit, component-spec, ux-writing, design-rationale, handoff-spec, design-qa-checklist, figma-hygiene |
| **ai** (every role) | sense-shape-steer — the Sense-Shape-Steer framework: AI opportunity → patterns & storyboard → metrics & feedback loops → build-ready blueprint. Modes: run / facilitate / learn |

Every skill reads the project's `ux/project-context.md`, consumes the previous step's artifact, produces the next step's input, and names the next step. `/ux-pipeline` shows where a project stands and runs steps with approval gates. The full map and authoring standard: [docs/PIPELINE.md](docs/PIPELINE.md).

## Working with project material

A project is a project — internal, client, whatever. Every skill reads the project's `ux/project-context.md` (domain + data rules) and de-identifies people data on intake as a standing habit. Restrictions apply only when a contract imposes them — then skills refuse and say why. Read `engagement-guardrails` once; it's short and it's the rule.

## Maintaining SkillCloud

- **Request or propose a skill:** open an issue or PR — see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Your role champion reviews against [docs/CURATION.md](docs/CURATION.md).
- **Release:** maintainers bump `VERSION` + `CHANGELOG.md` in the same commit; everyone gets the upgrade prompt within a day.
- **Quality gate:** `tools/validate.sh` must pass (CI runs it on every push).
