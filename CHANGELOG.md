# Changelog

All notable changes to SkillCloud. Maintainers: bump `VERSION` and add an entry here in the same commit — the self-update prompt reads this file to show "what's new".

## 0.12.3 — 2026-11-26

- `skillcloud-board` and `skillcloud-check` work in folders with spaces in their names. The self-tests now run in such a folder.
- After the plan's yes, `/design-lead` runs the stage through to its gate. It stops only for gates and things that need a person, not between jobs.

## 0.12.2 — 2026-11-26

- **Partial yes:** approve some tickets and decline others. Before acting, `/design-lead` shows what a declined ticket strands (tickets and gates that need its output) and offers: drop those too, supply the input yourself, run on raw material at low confidence, or keep it. Dropped tickets stay on the board with the reason.
- `skillcloud-board stranded`: tickets whose blocker was dropped. They show under Waits on you, and are never dispatched.
- Board page: empty fields no longer show as `""` chips, and there is a Dropped column.

## 0.12.1 — 2026-11-26

- The sidequest check reads the installed version. An old 3.x copy left in the plugin cache no longer triggers a false "agents may be refused" warning.

## 0.12.0 — 2026-11-26

SkillCloud is a Claude Code plugin.

- **Install:** `/plugin marketplace add eldinesh/skill-cloud` then `/plugin install skillcloud@skill-cloud`. Skills, the 8 design-team agents, hooks and commands in one install. Clone + `./setup` still works for surfaces without plugins.
- **Team guard hook:** a team agent can't write a sign-off (`status: final`, `signed_off_by:`) or a file outside its lane. The write is refused at the tool call, with the reason.
- **Session hook:** wires the tools to the plugin and, in a project, shows what waits on people and what's ready to run.
- **One-step start:** open any folder and run `/skillcloud:start`. It builds `ux/`, copies your material into `ux/intake/raw/` (originals untouched, kept out of git), seeds the rulebook, infers the project context from the material, and proposes the first plan for one yes. A folder with material but no setup gets a one-line hint at session start.
- **Commands:** `/start`, `/board` (summary + live board page), `/signoff`, `/decide`.
- **User guide** for the plugin: what it is, how a project runs, how to sign off.

## 0.11.0 — 2026-11-26

SkillCloud becomes a design team made of agents, with Claude at its core and people in charge.

- **`/design-lead`** (was `/ux-pipeline`) runs a project through **Frame → Explore → Harden → Ship** (→ Learn). It plans each stage as tickets for one "yes", routes each job to a specialist agent, has an independent checker and real tools challenge every handoff, and stops at every gate for the named person to sign off, overrule or send back. Claude never signs. Every sign-off, overrule and later-stage decision lands in `ux/decisions-log.md`.
- **The team:** 8 agents (`./setup --agents`): researcher, synthesiser, strategist, information architect, designer, quality reviewer, engineer, checker. Each writes only in its own lane, and the lane is proven after every job.
- **The board:** every job, gate and human task is a markdown ticket in `ux/team/board/`. Run the frontier, see what waits on you with its question and a recommendation, and open `ux/team/board.html` for a live local board. Each role runs on its own model and effort (`routing.txt`).
- **The rulebook** (`/project-rulebook`): nine default chapters (evidence, AI experience, states and roles, accessibility, design system, content, code, testing, handoff), each with rules, patterns, decisions, checks, AI instructions and an owner. The code chapter is the engineering constitution for coded deliverables.
- **New skills:** requirement-call (TRACES), experience-strategy (insight → job → problem → HMW → UX and AI opportunity, plus competitive scan), information-architecture, explore-directions (two directions, realistic offline prototypes with a review bar, with or without a design system), harden-review (role × action × state matrix, rulebook check, feasibility, scans), ship-code (React + TS scaffold with every check, or the client's stack), ship-tickets.
- **Real tools, not trust:** `skillcloud-check` (verbatim quotes, IDs resolve, identifier sweep, human sign-offs, stale finals, lanes, IA, contrast, tokens) and `skillcloud-board`. Self-tested in CI against a fixture project with planted defects.
- **Changed:** the framed brief is page one of `/design-brief` (one page, every fact with confidence and source). Status is `draft | review | final`, and only a named person makes something final. `/usability-test-plan` gains a 10-minute direction-test mode. Research pack limits: 1–2 personas, 5–8 jobs. New roles: `engineer`, and a `build` bundle for designers and engineers.

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
