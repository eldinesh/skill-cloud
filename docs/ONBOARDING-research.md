# SkillCloud for researchers — day one

Everything you need to start working with SkillCloud today. Ten minutes, once.

## Install

```bash
git clone --single-branch --depth 1 git@github.com:eldinesh/skill-cloud.git ~/.claude/skills/skill-cloud
cd ~/.claude/skills/skill-cloud && ./setup
```

Pick **1) Researcher**. That links 14 skills (4 core + 10 research) into `~/.claude/skills/` and they're live in Claude Code immediately. Coming from a personal skill-pack setup? Do [CLEANUP.md](CLEANUP.md) right after — fifteen minutes, once, and your setup stays boring.

## Your skills are a pipeline, not a list

Research here moves through stages, and the skills mirror them:

```
/research-plan → /interview-guide → [you run the sessions] → /interview-synthesis
→ /affinity-mapping → /cross-study-synthesis → /jobs-to-be-done
→ /persona + /journey-map → /insight-report → /usability-test-plan
```

Each skill consumes the previous one's output and ends by telling you what's next. `/insight-report` is your finish line — it's the declared input to design's `/design-brief`, which is how your research actually drives what gets built instead of dying in a deck.

Two ways to start:

- **`/ux-pipeline`** — on any project, any time. It reads what already exists in `ux/`, tells you where the project stands, and offers to run the next step (with your approval at each gate). When in doubt, start here.
- **`/research-plan`** — when you're scoping a new study from zero.

You don't have to memorize names. Paste an interview transcript into a session and `/interview-synthesis` offers itself. Describe a study you need to scope and `/research-plan` shows up. The skill descriptions are the router — just describe the work.

## The ux/ folder

Every artifact lands at a standard path in the project's `ux/` folder: `ux/research-plan.md`, `ux/interviews/P01.md`, `ux/synthesis/interview-synthesis.md`, and so on (full tree in [PIPELINE.md](PIPELINE.md)). Standard paths are why the chain works — each skill knows exactly where upstream evidence lives, and every claim in your insight report traces back through `sources:` headers to de-identified interview records. Treat `ux/` as the project's research record. It lives with the client project, not loose on your desktop.

## Guardrails, in five lines

1. Every engagement has an AI tier — **prohibited / limited / permitted** — recorded in `ux/project-context.md`.
2. Skills check the tier before touching any client material. On a prohibited engagement they refuse. That's correct behavior, not a bug.
3. **Limited** is the healthcare default: de-identified material only, never live PHI/PII.
4. De-identification is not a step you run — it's automatic on intake. Names become P-numbers, identifiers get stripped, and the raw versions are never echoed back.
5. No tier on file? Skills treat the engagement as limited and offer to set up `project-context.md`. Read the `engagement-guardrails` skill once; it's short and it's the rule.

## Cowork

Same skills, zero extra setup. Cowork reads the same `~/.claude/skills/` folder Claude Code does. One install covers both.

## Updates

Updates announce themselves. When a new version ships, the next skill you use offers the upgrade — take it, snooze it, or switch on auto-update and never think about it again. You'll never be more than a day behind the team.

## Help and requests

- Stuck, unsure about a tier call, or a skill behaves oddly? Ask the **research champion** — that's their job.
- Want a skill that doesn't exist, or want to sharpen one that does? Open an issue or PR in the SkillCloud repo — see [CONTRIBUTING.md](CONTRIBUTING.md). Requests grounded in a real project are exactly what shapes the next release.
