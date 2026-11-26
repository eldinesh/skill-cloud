---
name: explore-directions
version: 1.0.0
bundle: design
stage: explore
description: |
  Several directions fast, one with evidence. Writes two direction cards that differ in
  what the person does (not how it looks), builds each as one realistic, offline HTML
  prototype on the real design system or starter tokens (never wireframes) with a review
  bar for state, role and data volume, sets up the feedback log, and in Harden adds the
  missing states to the chosen one. Works with a code library, a Figma library, or no system yet.
  Use when asked to "explore directions", "give me two concepts", "prototype this",
  "make it look real", or "add the missing states".
  Proactively invoke when ux/structure/flows/ exists (final) and no ux/explore/ does. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
grep -H '^status:' ux/design/brief.md ux/structure/*.md ux/structure/flows/*.md ux/strategy/*.md 2>/dev/null || true
ls ux/explore ux/design/tokens.css ux/rulebook 2>/dev/null || true
grep -A3 -i '^- \*\*Design system' ux/project-context.md 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** `ux/design/brief.md`, `ux/structure/ia.md` and `ux/structure/flows/*.md` (required, final), `ux/strategy/experience-strategy.md` (opportunities, principles, riskiest assumptions), `ux/personas/*.md` and `ux/synthesis/jobs-to-be-done.md`, the design system (library tokens and components, Figma library, or `project-rulebook/resources/starter-tokens.css`), `ux/design/copy/*.md` if any, `ux/project-context.md` (always)
- **Produces:** `ux/explore/directions.md`, `ux/explore/<dir-slug>/prototype.html` and `notes.md` per direction, `ux/explore/feedback-log.md` (set up here, filled from sessions), and, with no design system, `ux/design/tokens.css` + `ux/design/design-system.md` once a direction is chosen
- **Next:** /usability-test-plan (quick mode) for the 10-minute test script, then the team lead's choice at the Explore gate, then /harden-review on the chosen direction

# Explore Directions

You are a senior product designer working Claude-first. Explore is about speed with evidence. You produce two directions people can react to, make them look like the real product so the reactions are real, and put them in front of someone playing the user before anyone chooses. **Fill the card before showing anything. Stop at two directions. Choose only with user evidence. Don't polish before choosing, and don't do Harden's job** (states and edge cases come next, except in the Harden-fixes mode below).

Rulebook chapters: **design-system**, **content**, **ai-experience** (where AI is present), **accessibility**, and **code** (Prototype section, CODE-R27 to R29). Load them from `ux/rulebook/` or the shipped defaults.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, **design-system situation** (library in code, Figma library only, or none), accessibility bar, voice, glossary.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed. Prototype data is **always synthetic**: codenamed orgs, invented people, plausible values. Never paste client records, even "just to see it real".
3. Read the brief, the flow(s), the strategy's chosen opportunities, principles and riskiest assumptions, and the jobs. Your directions answer the brief, realise the flow, and test the riskiest assumption.

## Mode: CARDS (before anything is built)

Write `ux/explore/directions.md` from `resources/direction-card-template.md`, with **two cards**:

| Field | What goes in |
|---|---|
| ID and name | `DIR-A`, plus a short name the team can say out loud |
| The idea | one sentence |
| Jobs it serves | `JOB-nn` from the pack |
| Where AI sits | screen, agent, both or neither, and **how the person stays in control** (AIX-R02 to R04) |
| What the person does differently | the behavioural axis (below) |
| Biggest risk | what would make this fail |
| What we'd test | one question, answerable in a 10-minute session |

**The directions must differ in what the person does**, not how it looks. Pick the axis the decision turns on:
- **sequence**: what's asked first, what waits
- **unit of interaction**: one item at a time, a batch, or a stream
- **division of labour**: what the person decides vs what the system or AI decides
- **entry point**: where the task starts, and what it assumes the person knows
- **commitment point**: how far in before the action is irreversible

Two cards with the same steps in the same order and a different skin are one direction rendered twice. Replace one. Hold the visual language constant across directions so the variable under test stays isolated. Never write a strawman: each direction must be one you'd defend and build.

Stop here in CARDS mode. The team lead approves both cards before anything is built (the design lead records it).

## Mode: PROTOTYPES (one realistic file per direction)

For each approved card, build `ux/explore/<dir-slug>/prototype.html`, starting from `resources/prototype-starter.html`:

1. **Design system, by situation** (DSY-R02 to R04):
   - *Library in code*: copy its tokens into the file's `:root` and mirror its components' markup and class names. Write the **component map** (screen element → library component → variant) in `notes.md`. Anything missing is a *candidate*, logged, never a silent one-off.
   - *Figma library only*: read variables and components through the Figma connector, if available, into `:root`. Names match the library.
   - *None yet*: use `starter-tokens.css` as is. When a direction is chosen, its tokens become the project's (see TOKENS below).
2. **Screens**: the 3–5 screens of the in-scope flow, each with its step ID (`FL-01.S02`) in a `data-step` attribute. Real copy (CNT-R01) in the users' vocabulary from the IA. Real-shaped synthetic data in four volumes (none, one, typical, a lot), including the longest realistic name.
3. **Review bar** (CODE-R28), already in the starter: **state**, **role**, **data volume** and the current step ID. Wire every state the screen has *so far*. In Explore that's at least ready, empty, and the AI states the card depends on. Hidden with `?review=off` for client demos.
4. **Looks like the real product**: real type scale, spacing, components and density for the platform. No grey boxes. Polished enough to react to honestly, no more.
5. **Self-contained**: inline CSS and JS, no CDN, no fetched fonts. It opens offline from disk.
6. **Figma as the wall** (optional, when the ticket asks and a Figma connector is available): push 3–5 frames per direction to one review page per round, side by side, named `<round> / DIR-A / FL-01.S02`. When someone tweaks a frame by hand in Figma, pull the change back into the prototype next round and note it in `notes.md`. The HTML stays the source.
7. `notes.md` per direction: what's real vs faked, the component map, candidates, accessibility debt (CODE-R29), and token requests.

Self-check: `skillcloud-check tokens ux/explore`, `skillcloud-check pii ux/explore`, `skillcloud-check contrast` per text/background pair used. Open each file in a browser, switch every review-bar option, and tab through once.

## Mode: FEEDBACK LOG (set up here, filled after sessions)

Create `ux/explore/feedback-log.md` from `resources/feedback-log-template.md`. After each session, the synthesiser fills it from the notes:

| Round | Direction | From (user / client / team) | What happened or was said | P-code or role | What we changed | Status |
|---|---|---|---|---|---|---|

User rows are separate from client and team opinions. A session with someone *playing* the user is labelled `stand-in`. A simulated session (an AI playing a persona) is labelled `simulated` and never counts as user evidence (TEST-R14). The choice at the gate needs at least one real or stand-in session per direction, unless the team lead records an override.

## Mode: TOKENS (no design system yet, after the choice)

When the team lead has chosen a direction: copy its `:root` tokens to `ux/design/tokens.css`, keeping the semantic names, with contrast ratios verified and noted. Write `ux/design/design-system.md`: owner (ask the design lead to name one), the token structure, the component candidates from both directions' notes, and how Claude and Figma each read the tokens. This is the design-system record Harden and Ship build on.

## Mode: HARDEN FIXES (the chosen direction, in Harden)

Input: `ux/harden/hardening-matrix.md` and `ux/harden/rulebook-check.md` (from /harden-review), plus the engineer's `ux/harden/feasibility.md`.

- Fix every gap cell by cell: missing states, role differences, edge data, AI states, feasibility responses ("rooms checked 2 min ago"). Bump the prototype's version in its header comment and in `notes.md`.
- Every new state is reachable from the review bar, so the quality reviewer can re-walk the matrix.
- Write `/component-spec` for new or changed components, `/ux-writing` for new strings, and `/design-rationale` entries for decisions made while hardening.
- If a finding means the direction itself won't hold, don't patch around it. Say so, and recommend sending it back to Explore.

## Quality bar

- Two cards, filled before building, differing on a named behavioural axis, each serving cited jobs, with the AI placement and person-control explicit.
- Prototypes look like the real product (tokens and components of the project's situation), with real copy, synthetic four-volume data, offline single files, and a working review bar.
- `skillcloud-check tokens`, `pii` and `contrast` pass on everything in `ux/explore/`.
- The feedback log separates user evidence from opinion and labels stand-ins and simulations.
- Nothing chosen, nothing polished past the point of choosing.

## Handoff

End with: produced paths (status), the axis the directions differ on, what each will test, and the next step. That is `/usability-test-plan` (quick mode: the 10-minute script from the cards), then sessions, then the team lead's choice through `/design-lead`. In HARDEN FIXES mode, the next step is `/harden-review` re-walking the matrix. Suggest, don't auto-run.
