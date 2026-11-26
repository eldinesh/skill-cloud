# SkillCloud

Internal skill system for UX work. One repo, versioned, curated — research and design skills wired as a pipeline, where each step's output feeds the next step's input. Private; not for distribution.

## Install

**As a Claude Code plugin (recommended):** skills, the 8 agents, the team guard hooks and the `/board`, `/signoff` and `/decide` commands, all in one install:

```
/plugin marketplace add eldinesh/skill-cloud        # private repo: uses your GitHub access
/plugin install skillcloud@skill-cloud
```

Then open (or create) a folder for the project, start Claude Code in it, and run `/skillcloud:start`. It sets everything up from whatever material is in the folder and proposes the first plan.

Trying a branch or a local checkout: `/plugin marketplace add ~/Developer/SkillCloud`, then the same install. Update with `/plugin update skillcloud`.

**As a clone + setup** (Cowork, claude.ai skill uploads, or no plugin support): use one install method, not both, or every skill appears twice.

```bash
git clone --single-branch --depth 1 git@github.com:eldinesh/skill-cloud.git ~/.claude/skills/skill-cloud
cd ~/.claude/skills/skill-cloud && ./setup
```

Pick your role (researcher / designer / engineer / both). Setup links the skills into `~/.claude/skills/` (Claude Code and Cowork both read it), offers to install the **design team** (8 agents in `~/.claude/agents/`; `./setup --agents`), and offers to add a `skillcloud` section to your `~/.claude/CLAUDE.md` so Claude routes to the skills on its own. Per-project routing rules: [docs/ROUTING.md](docs/ROUTING.md).

Updates: when a new version ships, the next skill you use offers the upgrade (snooze, or enable auto-update in `~/.skillcloud/config.yaml`). Manual: `/skillcloud` → update.

claude.ai web chat: per-skill zips are on the Releases page; upload via Settings → Capabilities → Skills.

Migrating from personal skill packs: [docs/CLEANUP.md](docs/CLEANUP.md).

## What's inside

A design team made of agents, with Claude at its core and people in charge. `/design-lead` runs a project through **Frame → Explore → Harden → Ship** (→ Learn): it plans each stage as tickets on a local board, routes each job to a specialist agent, has an independent checker and real tools challenge every handoff, and stops at every gate for a named person to sign off, overrule or send back. Claude never signs. How it works: [docs/TEAM.md](docs/TEAM.md).

| Bundle | Skills |
|---|---|
| **core** (everyone) | `design-lead` (the orchestrator), `project-rulebook` (the project's rules: the brain), `engagement-guardrails` (data rules + de-identification), `topic-deep-dive`, `company-handbook`, `skillcloud` (status/update/doctor) |
| **research** | requirement-call (TRACES), research-plan, interview-guide, interview-synthesis, affinity-mapping, cross-study-synthesis, jobs-to-be-done, persona, journey-map, insight-report, experience-strategy, usability-test-plan |
| **design** | design-brief (framed brief), information-architecture, explore-directions, design-critique, heuristic-evaluation, accessibility-audit, component-spec, ux-writing, design-rationale, handoff-spec, design-qa-checklist, figma-hygiene |
| **build** (designers + engineers) | harden-review, ship-code (coded deliverable under the code constitution), ship-tickets |
| **ai** (every role) | sense-shape-steer: AI opportunity → patterns & storyboard → metrics & feedback loops → build-ready blueprint |
| **agents** (opt-in) | sc-researcher, sc-synthesiser, sc-strategist, sc-information-architect, sc-designer, sc-quality-reviewer, sc-engineer, sc-checker |

Every skill reads the project's `ux/project-context.md`, consumes signed-off upstream artifacts, produces the next step's input, and names the next step. Tools under `bin/` prove what they can: `skillcloud-check` (quotes verbatim, IDs resolve, no identifiers, sign-offs human, lanes, IA, contrast, tokens) and `skillcloud-board` (the ticket board). The full map and authoring standard: [docs/PIPELINE.md](docs/PIPELINE.md).

## Working with project material

A project is a project — internal, client, whatever. Every skill reads the project's `ux/project-context.md` (domain + data rules) and de-identifies people data on intake as a standing habit. Restrictions apply only when a contract imposes them — then skills refuse and say why. Read `engagement-guardrails` once; it's short and it's the rule.

## Maintaining SkillCloud

- **Request or propose a skill:** open an issue or PR — see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Your role champion reviews against [docs/CURATION.md](docs/CURATION.md).
- **Release:** maintainers bump `VERSION` + `CHANGELOG.md` in the same commit; everyone gets the upgrade prompt within a day.
- **Quality gate:** `tools/validate.sh` must pass (CI runs it on every push). It checks skills, agents and rulebook chapters, and runs the tool self-tests in `tests/team/` (a fixture project with planted defects every check must catch).
