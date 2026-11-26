---
name: harden
version: 2.0.0
bundle: stages
stage: harden
description: |
  Harden v2: make the chosen direction hold up in a real product. Steps: harden plan, real roles
  and paths, a connected prototype with every state and micro-interaction, the AI harden reviewer,
  edge cases (AI lists, designer cuts), the engineer feasibility gate, a client edge-case workshop,
  edge cases designed as patterns, QA, rulebook and WCAG, craft and trade-off review, client review
  and hygiene. The design lead signs. It runs as five designer moments.
  Use when asked to "harden this", "edge cases", "every state", "is it feasible", or "rulebook check".
  Proactively invoke when Gate 2 is passed and no ux/harden/ exists. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/team/gates/*explore-gate* 2>/dev/null | tail -1 || echo "GATE2: none"
ls ux/harden 2>/dev/null || echo "HARDEN: not started"
```

- If `UPGRADE_AVAILABLE` / `JUST_UPGRADED`: as in every skill. If `PROJECT_CONTEXT: missing`: run the start flow first.

## Contract
- **Consumes (only final cards from Frame and Explore):** chosen direction + direction card (with the runner-up as fallback); user evidence + feedback log; foundation card (DS in code / Figma / brand only / none, legacy or broken) and seeded tokens; brief, JTBDs and roles from the brief; decisions log + known constraints; the Koru edge-case library (patterns and failures from past projects); the rulebook; `ux/project-context.md` (always) and `engagement-guardrails`
- **Produces:** `ux/harden/`: harden plan, role and permission matrix, flow map, connected HTML prototype (review bar: role, state, data volume) + a Figma page for the round, state inventory incl. AI states, prioritised edge-case list (now / later / won't, with reasons), hardening checklist and rulebook report, QA and accessibility report, fix list, tokens file and updated DS, decision cards, handoff card
- **Next:** Gate 3, Harden → Ship (`/design-lead`), then /ship

# Harden v2

**Principle:** AI drafts and checks; designers decide, negotiate and craft. Each step names the designer moment, the nuance it handles, and who signs off. That judgement is what a capable client can't get from the framework alone.

## Flow

```
Explore: signed-off direction → 1 Harden plan → 2 Map real roles & paths ─┬ multiple roles: a flow per role
                                                                         └ single user: every path, non-linear ones linked
→ 3 Prototype, states & micro-interactions → [AI checker: harden reviewer] → 4 Edge cases: AI lists, designer cuts
→ ◆ Engineer: feasible? ── no: limit → decision card, re-scope (back to 4); won't hold → back to Explore (decision card)
→ 5 Client edge-case workshop → 6 Design edge cases as patterns → [AI checker: QA, rulebook & WCAG]
→ 7 Craft & trade-off review → 8 Client review & hygiene → ◆ Design lead signs off? ── no: fix (back to 7) → Ship
```

| # | Step | Input | What AI does | **Designer in the loop (judgement)** | Nuance it handles | Independent AI check | Signs off | Output |
|---|---|---|---|---|---|---|---|---|
| 1 | Harden plan | Signed-off direction + card, user evidence, brief & JTBDs, foundation card, decisions log, known constraints | Drafts a plan: flows, roles, states to cover, time estimate | **Sets scope and depth against time and risk; says what is out and why** | Harden gets 2 days, not 2 weeks | — | Design lead | Harden plan card |
| 2 | Map real roles & paths | Roles from the brief; the client's real account and permission setup | Drafts a role × action matrix (see, change, undo) and a path map incl. non-linear paths | **Validates real roles with the client; decides which paths must be linked so the client sees how it works** | Roles in the brief aren't the real ones: shared accounts, delegates, temporary access | — | Client confirms roles | Role + path map |
| 3 | Prototype, states & micro-interactions | Role matrix, foundation / tokens, worst-case data | Claude Code builds the connected HTML prototype with a review bar; drafts empty, loading, error, success, dropdowns, notifications, AI states | **Curates data that breaks things; makes product calls on AI states (confidently wrong? who is alerted?); crafts micro-interactions** | Real data is worse: nulls, duplicates, legacy formats, 10,000 rows; AI states are product decisions, not screens; multi-region | Harden reviewer: role × action × state × data gaps | Designer | Prototype with state inventory |
| 4 | Edge cases: AI lists, designer cuts | Prototype + Koru edge-case library | Lists every possible edge case per flow (often ~80); tags tech-dependent ones | **Cuts the noise to the cases that matter, grouped into patterns, adds cases from past projects** | AI lists 80; most are noise | — | Engineer: feasibility gate | Refined list; constraints as decision cards |
| ◆ | Engineer: feasible? | Engineer, API and data constraints | Records limits | **Negotiates "not possible" vs "not this sprint"; judges small fix vs back to Explore** | Client engineers say "not possible" when they mean "not this sprint" | — | Engineer | Constraints and trade-offs as decision cards |
| 5 | Client edge-case workshop | Refined list with frequency guesses | Turns the call into the list: confirmed, added, frequency, impact | **Facilitates: draws out cases only the client knows; separates frequency and impact from politics** | A rare case ranks top because an exec hit it once | — | Client + team lead | Prioritised list: now / later / won't, with reasons |
| 6 | Design edge cases as patterns | Prioritised list; DS components | Drafts high-priority cases into the prototype using DS components | **Designs reusable patterns, not one-offs; decides to extend, work around or break a legacy / broken DS (decision card)** | Design system legacy or broken; components missing | Harden reviewer re-runs | Designer | Edge-case designs + new components |
| ◇ | QA, rulebook & WCAG | Rulebook chapters, WCAG 2.2 AA, tokens | Rulebook check (separate context); flags hard-coded colours and off-DS components; WCAG scan; broken links (hygiene) | **Owns which flags are real issues** | Regulated data (health, finance): some checks can't use AI | Rulebook check (separate context) | Rulebook owner | QA + accessibility report; fix list |
| 7 | Craft & trade-off review | QA report, prototype | Applies agreed fixes | **Judges trade-offs: brand vs contrast, density vs clarity; taste and consistency; agrees fixes with the brand team** | Brand colours fail contrast; the brand team has to agree | — | Design lead | Fix list + notes for Ship |
| 8 | Client review & hygiene → sign-off | Hygiene-checked prototype | Drafts the handoff card, decision cards, tokens file and notes for Ship | **Presents and steers feedback to decisions, not colours; the design lead owns the sign-off** | Client changes direction mid-Harden (decision card ripples back); scope cut late: which states survive, which become fast follow-ups | — | Design lead via sign-off. **Claude cannot sign** | Hardened design (final), checklist, tokens & components, decision cards, handoff card |

Use `/harden-review` for the matrix, rulebook check, scans and feasibility mechanics, `/explore-directions` (harden-fixes mode) for adding states to the prototype, and `/component-spec`, `/ux-writing` and `/design-rationale` for what changes.

## The five designer moments (about 45 minutes on a hackathon day)

| # | Moment | Claude proposes | **Designer decides** | Output | Time |
|---|---|---|---|---|---|
| 1 | **Scope** | A harden plan: flows, depth, what to leave out, time estimate | **What we harden and what we don't, given time and risk** | Harden plan | 5 min |
| 2 | **Edge-case cut** | Every edge case it can find (often ~80), tagged, with suggested cuts | **Which ones matter, grouped into patterns from past projects, with a reason for every cut** | Refined edge-case list with reasons | 10 min |
| 3 | **Engineer and client** | Feasibility questions for the engineer; a ranking by frequency and impact | **"Not possible" vs "not this sprint"; facilitates the client ranking so frequency beats politics** | Prioritised list: now / later / won't; decision cards | 15 min |
| 4 | **AI and craft calls** | States on every screen, incl. AI states; QA and accessibility flags | **How the AI behaves when wrong or unsure; brand vs contrast, density vs clarity, consistency** | Hardened prototype; trade-off decision cards | 10 min |
| 5 | **Sign-off** | Rulebook report, fixes list, tokens file, handoff card | **The design lead signs off. Claude cannot sign** | Hardened design, final | 5 min |

**Never delegated in Harden:** which edge cases matter, and in what order · whether the direction holds or goes back to Explore · how AI states behave, and who is alerted · trade-offs with engineering and the brand team · the final sign-off.

**Nuances we plan for:** roles in the brief aren't the real roles · real data is worse (nulls, duplicates, legacy formats, 10,000 rows) · the design system exists but is legacy or broken · "not possible" from engineers often means "not this sprint" · client priority reflects politics, not frequency · brand colours fail contrast · the client changes direction mid-Harden (a decision card ripples back) · regulated data: some steps can't use AI · late scope cut: which states survive?

**Where Koru adds value (the capable-client test):** a capable client could run this checklist alone. What they can't get is the judgement: cutting 80 AI-listed edge cases to the 10 that matter, using patterns from many projects; a workshop that separates frequency and impact from politics and draws out tacit cases; negotiating feasibility trade-offs without losing the design intent; product decisions for AI states (what happens when the AI is confidently wrong); craft (reusable patterns, not one-offs; brand vs accessibility; consistency across the product).

## Only if it applies

| When | Add |
|---|---|
| Legacy system | decide to keep, replace or wrap each legacy component |
| Product has AI | AI states: thinking, low confidence, wrong, override, undo |
| Several roles | validate the real roles with the client; a flow per role |
| Multi-region | languages, date formats, right-to-left |
| Regulated data | which steps can't use AI |
| Brand fails contrast | agree fixes with the brand team |

## Claude handles it, designer checks

Role × action matrix and flow map · connected HTML prototype with a review bar (role, state, data) · states on every screen · 16 automated checks (harden-reviewer + harden-rulebook-check) · hygiene (clean file, every link works) · tokens export and handoff card.

## Checks while producing the output

`harden-reviewer` runs the role, state and edge-case checks. `harden-rulebook-check` runs the rulebook, design-system and accessibility checks. Both run through `sc-checker` in a fresh context. Judgement checks can only be passed by a designer, and the sign-off refuses while any blocking check has failed.

| When | Check | What it does | Blocks? |
|---|---|---|---|
| Roles | Role × action coverage | Every combination of role and action is defined: see, change, undo | Yes |
| Paths | All paths linked | The prototype links every path, including non-linear ones | Yes |
| States | State coverage | Empty, loading, error and success states on every screen | Yes |
| States | AI states | Thinking, low confidence, wrong answer, override and undo exist wherever AI acts | Yes |
| Edge cases | Edge data | Long names, no data and a lot of data are all tested | Yes |
| Edge cases | Feasibility first | An engineer checks feasibility before the edge-case list goes to the client | Yes |
| Edge cases | Constraints logged | Cases we can't control become decision cards, not designs | Warning only |
| Edge cases | Priority covered | Every frequent or task-blocking edge case is designed | Yes |
| Accessibility | WCAG 2.2 AA | Contrast, keyboard use, focus order and labels pass | Yes |
| Rulebook | Rule breaks | Every broken rule is listed with its reason | Yes, unless listed as a fix for Ship |
| Design system | System use | No hard-coded colours, no components from outside the design system | Yes |
| Design system | New components logged | Each new component has a decision card | Warning only |
| System fit | Fits the product | Patterns match the rest of the product and its other flows | Warning only |
| Scope | No redesign | Changes stay within the chosen direction; otherwise it goes back to Explore with a decision card | Yes |
| Hygiene | Prototype works | Every link works and the file is clean before the client sees it | Yes |
| ★J Judgement | Edge-case cuts explained | Every cut or deferred edge case has a reason written by a designer | Yes |
| ★J Judgement | Trade-offs recorded | Brand, feasibility and density trade-offs are decision cards with an owner | Yes |
| ★J Judgement | Craft review done | A designer reviewed patterns, consistency and fit with the rest of the product | Yes |
| Handoff | Fixes listed | Small issues are passed to Ship as notes | — |

## 2 & 3. What the designer brings, and what Claude does with it

| # | Designer brings | When | Claude does | Claude shares |
|---|---|---|---|---|
| 1 | Sets the harden plan: flows in scope, depth, what is out, given time and risk | Start | Drafts the plan card from the direction and brief; estimates time | Harden plan card |
| 2 | Validates the real roles with the client: shared accounts, delegates, temporary access | Start | Builds the role × action matrix and flow map; links the non-linear paths the designer marks | Role and permission matrix, flow map |
| 3 | Decides what happens to legacy components: keep, replace or wrap | Start | Adds them as constraints to the matrix and the prototype | Constraint list as decision cards |
| 4 | Names the rulebook chapters that apply, and who owns them | Start | Loads them for the rulebook check | The rule set the design is checked against |
| 5 | Curates the data that breaks things: nulls, duplicates, legacy formats, volume | Before the prototype | Builds the connected HTML prototype with the review bar on that data | Prototype on realistic data |
| 6 | Makes product calls on AI states (confidently wrong? who is alerted?), crafts micro-interactions, marks wrong or missing states | After states are drafted | Applies them, fixes the states and re-runs the harden reviewer | Prototype with states, and the reviewer report |
| 7 | Cuts the AI-listed edge cases to the ones that matter, groups them into patterns, adds cases from past projects | After Claude lists edge cases | Records a reason for every cut; tags cases that depend on tech | Refined edge-case list with reasons |
| 8 | Takes the list to the engineer: separates "not possible" from "not this sprint"; judges small fix vs back to Explore | After the cut | Drops or reshapes cases that can't be built; records limits as decision cards | Feasible edge-case list, decision cards |
| 9 | Facilitates the client workshop: draws out cases only the client knows; separates frequency and impact from politics | After the engineer | Turns the call into a ranked list: now, later, won't, each with a reason | Prioritised edge-case list |
| 10 | Sets the approach for every high-priority case as a reusable pattern; decides to extend, work around or break the design system | While designing | Designs them into the prototype in priority order and re-runs the reviewer | Edge cases designed in priority order |
| 11 | Decides each rulebook break: fix now, note for Ship, or back to Explore | After the rulebook check | Applies fixes; writes the fixes list or a decision card | Rulebook report and fixes list |
| 12 | Runs the craft and trade-off review: brand vs contrast, density vs clarity, consistency with the product | After QA | Applies the agreed fixes; records trade-offs as decision cards | Fix list, trade-off decision cards |
| 13 | Presents to the client and steers feedback towards decisions, not colours | Client review | Turns feedback into fixes; runs the hygiene check before the next showing | Updated prototype |
| 14 | The design lead signs off the hardened design. Claude cannot sign | End | Exports the tokens file and drafts the handoff card | Tokens file and handoff card |

## Output to Ship

| Output | What's in it | Signed off by |
|---|---|---|
| Harden plan | Flows in scope, depth, owners, time, and what is out | Design lead |
| Role and permission matrix | Who can see, change and undo each thing, for every role | Design lead |
| Flow map | Every path, including non-linear ones | Design lead |
| Connected HTML prototype | All flows linked, with a review bar to switch role, state and data volume. A Figma page for the round | Designers |
| States on every screen | Empty, loading, error and success, plus AI states (thinking, low confidence, wrong answer, override, undo) | Designer |
| Prioritised edge cases | Cut by the designer, checked by an engineer, confirmed and ranked with the client: now, later, won't, with a reason | Team lead and client; engineer for feasibility |
| Hardening checklist and rulebook report | Checklist filled for every screen and role; every broken rule with its reason; a fixes list for Ship | Rulebook owner passes; design lead approves |
| Tokens file and updated design system | Colour, type and spacing tokens in the design-library repo, new components added | Design lead |
| Decision cards | Edge-case cuts with reasons, tech limits, legacy-component calls, brand and feasibility trade-offs | Owner of each decision |
| Handoff card to Ship | What Ship receives, where it lives, what it does not include | Design lead |

Ship can start once the hardened design is final, every blocking check (including the designer's judgement checks) has passed or its fix is listed, and the tokens file is exported.

**Still open (team decisions):** who owns the rulebook, and which chapters exist (the project rulebook has defaults: `/project-rulebook`) · a Koru edge-case library from past projects: who curates it? Until it exists, seed from `states-and-roles` + `ai-experience` chapters.

## Handoff

End with: the five moments' status, the edge-case counts (listed / cut / now / later / won't), feasibility limits as decision cards, rulebook pass/fail, and the next step: Gate 3 through `/design-lead`.
