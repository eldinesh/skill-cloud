---
name: project-rulebook
version: 1.0.0
bundle: core
description: |
  The project's rulebook, the brain every agent and person works from. It seeds ux/rulebook/
  from SkillCloud's default chapters (evidence, AI experience, states and roles,
  accessibility, design system, content, code, testing, handoff), adapts them to the project,
  adds project chapters, gives each chapter a named owner, and keeps it current.
  Use when asked to "set up the rulebook", "add a rule", "what are the rules for X",
  "write a rulebook chapter", "is the rulebook out of date", or "change this rule".
  Proactively invoke when a project reaches Harden with no ux/rulebook/, or when the same
  design argument comes up twice and no rule settles it. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/rulebook 2>/dev/null && grep -H -E '^(status|owner|version|updated):' ux/rulebook/*.md 2>/dev/null || echo "RULEBOOK: none"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/project-context.md` (always: domain, design-system situation, stack, accessibility bar, team), `ux/decisions-log.md` (decisions that became rules), the default chapters in `resources/chapters/`
- **Produces:** `ux/rulebook/<chapter>.md` (one file per chapter) and `ux/rulebook/index.md`
- **Next:** /design-lead, because the rulebook is what Harden checks against (`/harden-review`) and what every agent loads for its job

# Project Rulebook

**The rulebook is the brain.** Every agent loads the chapters that apply to its job, every checker cites them, and every gate checks against them. If it's out of date or full of junk, everything built from it will be too. Your job is to keep it short, specific, owned and current. A rule earns its place only if it changes a design or build decision.

The shipped chapters in `resources/chapters/` are SkillCloud's defaults, and they apply to every project until a project has its own copy. The format of every chapter is fixed (`resources/chapter-template.md`): **Purpose · Rules · Patterns · Decisions · Checks · Instructions for AI tools · Owner**. Rule IDs are `<PREFIX>-Rnn` and check IDs are `<PREFIX>-Cnn`. Never renumber. Retired rules stay as `~~CODE-R14~~ retired D-031`.

| Chapter | Prefix | Loaded by |
|---|---|---|
| evidence | EVD | researcher, synthesiser, strategist |
| ai-experience | AIX | strategist, designer, quality reviewer, engineer |
| states-and-roles | STR | information architect, designer, quality reviewer, engineer |
| accessibility | A11Y | designer, quality reviewer, engineer |
| design-system | DSY | designer, quality reviewer, engineer |
| content | CNT | designer, quality reviewer, engineer |
| code | CODE | engineer (Explore prototypes: designer, the Prototype section only) |
| testing | TEST | engineer, quality reviewer, researcher |
| handoff | SHIP | engineer, designer |

Checkers load whichever chapters the protocol cites.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, **design system** situation, **stack**, accessibility bar, voice and terminology, and the **Team** table (who owns what).
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP, say so, and point to `engagement-guardrails`. Otherwise proceed. Rulebook examples are always synthetic or codenamed (glossary), never client records.
3. Read `ux/decisions-log.md` if present. Decisions are the raw material of project rules.

## Step 1: Pick the mode (infer it)

- **SEED**: no `ux/rulebook/` yet ("set up the rulebook", or a project reaching Harden).
- **ADD**: a project-specific chapter ("write a booking chapter", "we need rules for the scheduling flow").
- **AMEND**: change, add or retire a rule ("add a rule that…", "this rule is wrong").
- **REVIEW**: is it current, is it junk ("is the rulebook out of date", or quarterly).
- **ANSWER**: "what are the rules for X". Quote the rule IDs and their checks. Don't paraphrase law.

## SEED

1. Copy each default chapter that applies to `ux/rulebook/`. All nine apply to a full Frame-to-Ship project. Pure research engagements need only `evidence`. Set `project:`, `status: draft`, `version: 1` and `owner:` from the Team table. If the owner is unknown, leave `owner: <unassigned>` and list it. The gate that needs it will ask.
2. **Adapt, don't just copy.** Make the chapter true for this project:
   - **Domain.** Swap examples to the project's domain and glossary codenames. Add the domain's must-haves: clinical audit trail and interruption recovery in healthcare, transaction confirmation and dispute paths in fintech.
   - **Design system.** In design-system.md, record the situation (DSY-R01), with paths to the library or tokens. With no system, point DSY-R04 at the starter tokens and name who will own the tokens once a direction is chosen.
   - **Stack.** If project-context names a client stack, add a Decision row to code.md ("Client stack: <…>, CODE-R01 replaced, all other rules apply in its idiom") and adjust the folder structure to the client's conventions.
   - **Accessibility bar.** If the bar is stricter than WCAG 2.2 AA (Section 508, EN 301 549, 44px targets), raise the rule and log it.
3. **Cut what doesn't apply.** A rule that can't change a decision on this project is struck as `n/a: <reason>`. It isn't kept as decoration.
4. Write `ux/rulebook/index.md`: chapters, owners, status, version, and which roles load which chapter, plus project instructions in three lines: only final artifacts are context, the naming protocol, and that agents load only the chapters that apply.
5. The rulebook owner signs each chapter through `/design-lead` (SIGN). Until then chapters are `draft`, and agents fall back to the shipped defaults, saying so.

## ADD (a project chapter)

Use the chapter template. Project chapters are usually about a domain flow or object ("Booking", "Medication orders", "Approvals"). Gather the rules from the decisions log, the brief's constraints, the direction's biggest risk, and Harden findings that keep recurring. Every rule needs a **check** with a tool or a named person. A rule nobody can check is a wish, so rewrite it or cut it.

Example (shortened, Deskly):
- **Purpose:** make sure booking is fast and members always know what's been booked for them.
- **BKG-R01** The AI never confirms a booking without the member seeing room, time and duration.
- **BKG-R02** Every AI booking can be undone in one tap.
- **Pattern:** the suggestion sits at the top of the list, labelled with why it was suggested.
- **Decision:** admins approve AI room releases for the first month (D-014).
- **Checks:** undo exists on every booking confirmation, and every suggestion shows its reason.
- **Instructions for AI tools:** when designing any booking screen, include an undo and a visible reason for each suggestion. Flag any screen without them.

## AMEND

1. Write the proposed change as a diff to the chapter: the new rule text, or a strike-through with a reason. Say what decision it changes and what triggered it (a decision ID, a Harden finding, a break).
2. **Rules that don't change a design decision don't get added.** Say so and stop, if that's the case.
3. Bump `version:`, set `status: review`, and route it to the chapter owner through `/design-lead`. Only the owner's sign-off makes it final (team charter Art. 1.9). Never edit a final chapter in place: archive the old version first.
4. Rules that conflict with what the client wants are escalated, not resolved here. Log both positions for the owner.

## REVIEW (staleness and junk)

Report, chapter by chapter:
- **Stale:** decisions logged after the chapter's `updated` date that touch its subject, and design-system or stack changes in project-context since then.
- **Unchecked:** rules whose check has never appeared in a Harden or Ship check report (`grep` the rule ID in `ux/team/checks/` and `ux/harden/`). These are dead weight, or nobody's enforcing them.
- **Junk:** duplicate rules, rules that restate a default without changing it, vague rules ("make it intuitive").
- **Unowned:** chapters without a named owner.

End with a short list of proposed amendments. Never apply them unasked.

## Quality bar

- Every chapter has all seven parts, a named owner, and checks that say *how* (tool command or person).
- Every rule is MUST or MUST NOT, specific enough to fail, and changes a decision.
- Examples are synthetic or codenamed.
- The index says who loads what, so no agent loads the whole rulebook.

## Handoff

End with: chapters produced or changed (paths, status, version), owners still unassigned, rules cut as n/a, and the next step. That is usually `/design-lead` to put the chapters in front of the rulebook owner for sign-off, or `/harden-review` if Harden is waiting on the rulebook.
