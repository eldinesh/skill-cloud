# Koru Studio: the design team

## The Koru framework, baked in

- **Five designer moments per stage.** Claude proposes with sources and confidence, and the designer decides. The orange calls on the boards are the designer's: confirming type and scope, deciding conflicts, writing the problem, giving each direction, choosing with evidence, cutting edge cases, AI and craft calls, writing ticket intent. The design lead stops at each moment with one proposal and the one decision needed.
- **Every stage's playbook is a skill:** `/koru-studio:frame`, `/koru-studio:explore`, `/koru-studio:harden`, `/koru-studio:ship`, each with its steps, "only if it applies", "Claude handles it, designer checks", the checks table (judgement checks only a designer can pass), the outputs and who signs.
- **Four gates, all in the same format:** the lead calls the gate → an AI audit in a fresh context fills every question (Pass with evidence / Gap / Can't tell) → the decider marks every Gap Fix or Waive (★ can't be waived; a waiver needs a reason, an owner and a due date) → the next stage's lead accepts the handoff → it's logged. The board pane shows each open Gap with Fix and Waive buttons.
- **Standing logs:** parking lot · conflict log (every conflict leaves Frame with a status) · decision cards · feedback log (one row per point, every source) · AI quality log (every AI mistake caught, all stages) · design change log.



SkillCloud runs a project as a design team made of agents, with Claude at its core and people in charge. Claude does the depth and the volume: every state, every source line, every rule checked on every screen. People keep the judgement: framing, accepting evidence, choosing a direction, passing the rules, agreeing feasibility, signing off.

```
/koru-studio:start     in any folder: sets it up from whatever material is there and proposes the first plan
/design-lead          "where are we?" · "take this to the brief" · "run Explore" · "sign off the pack as Ben Ito"
```

## How a project runs

Every project follows the same four stages, with a fifth after release. Each stage starts only from the previous stage's signed-off output.

| Stage | Hands on | Who signs |
|---|---|---|
| **Frame** | a one-page framed brief (every fact with a confidence level and a source) + research pack (1–2 personas, 5–8 jobs, 3–5 product competitive scan) + experience strategy | senior (framing) · research owner (pack) |
| **Explore** | IA and the in-scope flow · two direction cards · one realistic HTML prototype per direction · user evidence in the feedback log | team lead (chooses the direction, with user evidence) |
| **Harden** | role × action × state matrix filled · rulebook checks · feasibility · accessibility scans · the hardened prototype and tokens | engineer (feasibility) · rulebook owner (rules) · design lead (design) |
| **Ship** | coded deliverable (typed, tokenised, every state, tested) + build report · tickets · half-page handoff note | engineer (reviews the handoff) |
| **Learn** | after release: where people overrule the AI, where it fails. This feeds the next Frame. | — |

Full reference: `skills/core/design-lead/resources/delivery-system.md`.

## The team

| Agent | Does | Never |
|---|---|---|
| researcher | requirement-call prep and recaps (TRACES), research plans, guides, test scripts | plays a participant or invents a quote |
| synthesiser | clean intake, synthesis, jobs, personas, journeys, insights, feedback log | inflates confidence or treats one quote as a pattern |
| strategist | insight-to-direction path, opportunities, principles, metrics, competitive scan, the framed brief | writes a full PRD or frames the problem as decided |
| information architect | object model, sitemap, navigation, labels, task flows | designs screens |
| designer | direction cards, realistic prototypes, harden fixes, components, copy, tokens | chooses the direction or writes production code |
| quality reviewer | hardening matrix, rulebook check, heuristic and accessibility reviews, build QA | edits the design or passes a rule for a person |
| engineer | feasibility, the coded deliverable, tickets, handoff note | weakens a check, calls the network, or fixes design gaps in code |
| checker | challenges every handoff, cold, with tools first | fixes anything or signs anything |

The **design lead** (`/design-lead`, in your session) is the orchestrator. It reads `ux/`, plans the stage as tickets, gets your one "yes" for the plan, dispatches each job to its agent, has the checker and the tools challenge every handoff, and stops at every gate for the named person.

Each agent writes only in its own lane (`lanes.txt`). After every job, `skillcloud-check lanes` proves it. A problem an agent finds in someone else's lane is reported and routed, never quietly patched.

## The board

Every job, gate and human task is a ticket: one markdown file in `ux/team/board/`. Tickets are proposed until you say yes to the plan. The **frontier** (ready, unblocked, nothing it needs is held) is what runs next. Gates and fieldwork are `hitl` (they need a person) and are never dispatched. Anything waiting on you carries a **For you** section: the question, why now, options with what each gets and costs, the recommendation, and what happens if nobody answers.

```bash
~/.skillcloud/repo/bin/skillcloud-board summary     # counts, waits-on-you, frontier, running
~/.skillcloud/repo/bin/skillcloud-board html        # ux/team/board.html: open it, it stays live
```

Edit ticket files by hand whenever you like. The design lead reads the board before every move.

Each role runs on a set model and effort level (`routing.txt`: judgment-heavy roles run deep, volume roles run standard). Override per project in `ux/team/routing.txt`.

## History: version control without git

Every project keeps its own history in `ux/.history`: every version of everything in `ux/` and `deliverable/`, and an event for every move. It covers the plan approved, each job and who did it, each check and its verdict, each sign-off by name, each decision with the option taken and the one dropped, writebacks and restores. Anything nobody named gets saved as a "changes" checkpoint at the end of each turn, so nothing is lost. Nothing is ever rewritten. Restoring a file brings the old version back as a new event, and the replaced version stays in the history.

The board page's **History** tab draws it as the project's lifecycle tree, from day one to today: grouped by day and stage, decisions as forks, and every event with when, who, what, how and which files changed. Ask the design lead "restore the brief to version 3766b2e", "who changed the persona?" or "when did we choose direction A?".

```bash
~/.skillcloud/repo/bin/skillcloud-history log        # every event
~/.skillcloud/repo/bin/skillcloud-history versions ux/design/brief.md
```

## Signing off, overruling, deciding

At a gate you get a packet: what was produced, checker verdicts, the literal tool output, open findings, what got caught, and a recommendation. Reply in plain words:

```
sign off all as Asha Rao
sign off ux/design/brief.md as Asha Rao with conditions: JOB-06 stays low until the ops interview
send back ux/personas/member.md to synthesiser: the night-shift segment is missing
overrule J-014-C F3 as Dee because disabled text is exempt from 1.4.3
```

It all goes into `ux/decisions-log.md` with your name, and into the artifact header. **Claude never signs.** No agent can write `final` or `signed_off_by`, and `skillcloud-check signoffs` audits it. Final artifacts are never edited in place: a change makes the next version, re-signed.

A decision at any later stage (say an engineer finds the calendar syncs every 5 minutes) is logged as a **writeback**. It marks the screens, directions and jobs it touches as stale until their owners accept or reject it.

## The rulebook: the brain

Each project has `ux/rulebook/`, seeded by `/project-rulebook` from nine default chapters: evidence, AI experience, states and roles, accessibility, design system, content, **code**, testing, handoff. Every chapter has the same parts: purpose, rules (`CODE-R16`), patterns, decisions, checks (each with a tool command or a named person), instructions for AI tools, and an owner. Agents load only the chapters their job needs. Checkers cite rule IDs. The rulebook owner signs changes.

The code chapter is the engineering constitution for the coded deliverable: stack and versions, structure, strict TypeScript, state as discriminated unions, tokens only, accessibility build rules, synthetic data, no network, no secrets, CSP, performance budget, honest reports. The `/ship-code` scaffold implements all of it, and its checks enforce it.

## Real tools, not trust

| Tool | Proves |
|---|---|
| `skillcloud-check trace` | headers complete, sources exist and are final, cited IDs resolve, **quotes are verbatim** in the participant record |
| `skillcloud-check pii` | no emails, phones, SSN/MRN shapes, DOBs, card numbers, IPs |
| `skillcloud-check signoffs` / `stale` | every final has a named human signer and a log line, and nothing final rests on a source that changed after |
| `skillcloud-check lanes` | the agent wrote only in its lane |
| `skillcloud-check ia` | flow steps resolve to IA nodes, depth, duplicate steps |
| `skillcloud-check contrast` / `tokens` | WCAG ratios per pair, no raw values or placeholder copy |
| deliverable `npm run check` + `test:e2e` | types, lint (incl. jsx-a11y), tokens, secrets, network, units, build size, every matrix state visited, axe per state, keyboard path, 320px reflow, no external requests |

Checkers re-run the tools themselves. A self-check that was reported green but fails now is a blocker.

## Two situations

Every stage works whether the client has a design system or not: **library in code** (use it, and log new components as candidates), **Figma library only** (read variables through the connector), or **none yet** (explore on the neutral starter tokens, then promote the chosen direction's tokens with an owner). Either way, explorations look like the real product. Never wireframes.

## Install and surfaces

```
/plugin marketplace add eldinesh/skill-cloud     # or a local checkout: /plugin marketplace add ~/Developer/SkillCloud
/plugin install koru-studio@koru
```

The plugin brings the skills, the 8 agents (named `skillcloud:sc-<role>`), the `/board`, `/signoff` and `/decide` commands, and two hooks:
- **SessionStart** wires `~/.skillcloud/repo` to the plugin, so every skill finds its tools. In a project folder it prints what waits on people and what's ready.
- **Team guard** (before any file write by a `sc-*` agent): refuses a sign-off (`status: final`, `signed_off_by:`) and any write outside the agent's lane. "Claude never signs" and "each agent produces only its own kind of work" are enforced, not just asked for. The main session, recording a person's typed sign-off, is never blocked.

Without the plugin, `./setup --agents` installs the same skills and agents from a clone (no hooks; lanes are then checked after each job only).

- **Claude Code**: full team mode.
- **Cowork, claude.ai, or no agents**: `/design-lead` runs inline. It works each role itself, from the same agent files, in lane, and runs the checker as a separate cold pass. Gate packets say the check wasn't independent.
- **sidequest, built in when present.** With sidequest 7.x installed and enabled, the design lead hands big Ship builds to sidequest's plan, run and land loop: parallel workers in their own worktrees, one landed change, with our lane check, checker and Ship gate on the result. Sidequest leaves the `sc-*` agents on the models `/design-lead` gives them. Without it, nothing breaks: the engineer builds in one job.
