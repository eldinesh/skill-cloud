---
name: explore
version: 1.0.0
bundle: stages
stage: explore
description: |
  Explore v1: from the final brief and research pack to one chosen direction with user evidence.
  Two tracks join at the prototype so look and feel never drives the solution. The visual track
  runs the foundation audit, routes A–K, the visual direction and the design system. The UX track
  runs direction briefs, options, the hard-path check and two direction cards. Then prototypes,
  a quick user test before the client chooses, feedback intake, and the Harden input pack. It runs
  as five designer moments.
  Use when asked to "explore", "start the directions", "two concepts", or "what design system do we have".
  Proactively invoke when Gate 1 is passed and no ux/explore/ exists. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/team/gates/*frame-gate* 2>/dev/null | tail -1 || echo "GATE1: none"
ls ux/explore 2>/dev/null || echo "EXPLORE: not started"
```

- If `UPGRADE_AVAILABLE` / `JUST_UPGRADED`: as in every skill (`~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`).
- If `PROJECT_CONTEXT: missing`: run the start flow first.

## Contract
- **Consumes (only final cards from Frame):** framed brief; research pack (personas, JTBDs, scan); heuristic evaluation and UX audit (existing product); conflict log and assumptions to test; project card; client references register (the parking lot); Koru pattern library; `ux/project-context.md` (always); the data rules in `engagement-guardrails`
- **Produces:** `ux/explore/`: design-foundation and route card, direction briefs, option sketches, 2 direction cards, prototypes (HTML, plus a Figma page per round), user evidence, feedback log, decision card (the runner-up kept as Harden's fallback), seeded tokens and DS package, brief write-back, Harden input pack, handoff card
- **Next:** Gate 2, Explore → Harden (`/design-lead`), then /harden

# Explore v1

**What Explore hands on:** one chosen direction with user evidence behind it. That's mockups in Figma made through Claude Code, the direction card and the feedback log. The team lead chooses, with the client. A quick test with someone playing the user is the evidence that lets it move on.

**How it runs: two tracks that join at the prototype**, so look and feel never drives the solution.

| Track | Steps | What it decides |
|---|---|---|
| **Visual track** (what we design *with*) | 1 foundation check (real state incl. legacy / broken) → route needs a visual direction? → 3 visual direction: one key screen in 2–3 themes → client picks a look → 4 build / align the DS from the chosen look (tokens → components → DS.md) → DS fit check passes? | the look and the system |
| **UX track** (what we design *from*) | 2 starting-point review + client references register (borrow, don't copy) → 5 UI direction by engagement type (shell, IA, where AI sits) → 6 split problem statements: each designer writes a **direction brief incl. the hard path** (human step) → 7 options from each brief: happy + hard path, realistic data; keep / drop / combine → 8 hard-path check: survives the hardest cases? (no full states) → 9 internal crit + direction challenger → 2 direction cards → team lead agrees 2 distinct directions? | the solution |
| **Join** (only from the DS, tested, reviewed, handed on) | 10 build 2 prototypes (HTML → Figma) from the DS, with ≥1 hard path → 11 quick user test, logged BEFORE the client chooses → 12 stakeholder review → 13 feedback intake → 14 stakeholder decision → 15 Harden input pack → gate | the choice |

Until the visual track has a chosen look, the UX track works in **neutral Koru tokens** (`~/.skillcloud/repo/skills/core/project-rulebook/resources/starter-tokens.css`). Never wireframes.

Full detail and every table: `resources/reference.md`. Templates: `resources/templates.md`. For prototypes and direction cards, use `/explore-directions` (its review bar, two-situations handling and checks). For a 10-minute script, use `/usability-test-plan` in quick mode.

## Rules

1. Audit the foundation before designing anything: no route card, no stage 1.
2. Never fall back to wireframes. Use neutral Koru tokens until a look is chosen.
3. Every prototype is built only from the DS. A hard-coded value is a DS gap, not a shortcut.
4. Change at the lowest layer that fixes it, then re-render everything above.
5. Vague feedback is never acted on until it's clarified.
6. Internal crit goes in the same log as client feedback.
7. Nothing leaves Explore with an Open row. The Harden pack is audited, not assumed.
8. States and edge cases are parked for Harden, never quietly designed here.

**Never delegated:** the route choice (design lead) · each direction's hypothesis (designer) · the look and the final direction (client + team lead) · accepting feedback (designer) · deciding conflicts (team lead) · "enough evidence" (researcher + team lead) · every sign-off.

**Bias guardrail:** existing-product patterns and borrowed design systems shape look and feel only. They don't feed steps 6–7 unless a designer chooses them, on purpose.

## The five designer moments

| # | Moment | Claude proposes | **Designer decides** | Output | Time |
|---|---|---|---|---|---|
| 1 | **Foundation and scope** | A foundation card (what exists and what really works), the problem statements to explore, a plan with a time estimate | **Confirms the foundation and its gaps; which problems to explore and who takes which** | Foundation card, Explore plan | 10 min |
| 2 | **Direction** | Options generated from each designer's direction, on realistic data, with a hard path | **Gives the direction (prompt, sketch or reference); keeps, drops or combines options, with a reason** | Option sketches | 20 min |
| 3 | **Two directions** | 2 direction cards; the challenger checks they really differ and which JTBDs neither serves | **Picks the 2 that are truly different and worth testing** | 2 direction cards | 10 min |
| 4 | **Evidence** | Prototypes, a test script, and feedback-log rows from the user test and client demo | **Runs the test, reads what users actually did, and decides what the evidence says** | User evidence, feedback log | 20 min |
| 5 | **Choice and sign-off** | Decision card, seeded tokens, brief write-back, handoff card | **The team lead chooses with the client. Claude cannot sign** | Chosen direction, final | 5 min |

**Added after the critique:** the runner-up direction is kept on the decision card as Harden's fallback · user tests: at least 1 session at the hackathon, 5 per direction on projects (or a logged provisional pass) · contrast target WCAG 2.2 AA · every AI mistake goes in the AI quality log.

## Steps

**0. Read the handoff.** Split it into design context, design foundation, conflicts, assumptions and client-proposed ideas.

**1. Foundation check** (`explore-foundation-check`, by `sc-checker`, or by the designer through Figma MCP, the repo and the docs). Record the **real state**, including legacy and broken components. Detect the scenario F1–F12 (reference §0). Scenarios combine, so take every route that applies. Fill the **design-foundation / route card** with the route (A–K), the 8 intake answers, and the Claude-readiness result (Ready / Partial / Not ready). The design lead agrees it before stage 1. The route sets how much of each later stage runs (route × stage: Full / Light / Skip, reference §0).

**2. Starting-point review + client references register.** Use the review that matches the starting point (Frame §3). Every client idea and named competitor gets weighed (borrow / adapt / reject, with a reason), never copied.

**3. Visual direction** (routes C, E, F, G, J, K only, reference §1). Always ONE key screen with real content in 2–3 token themes, never a moodboard alone. The client picks the look, and the winner becomes the DS seed. Output: visual direction card (principles, token set v0, key screen, what we're NOT doing).

**4. Build / align the DS** (reference §2). Only what the explored flows need, real, and built only from the DS. Full catalogue, every state and every edge case are Harden's job. **DS fit check:** a fresh-context Claude builds a sample screen from the DS + DS.md only. Any hard-coded value or invented component is a gap. The design lead signs.

**5. UI direction** by engagement type (reference §3). 1–2 UI direction cards (shell, IA, density, where AI sits) on 2–3 key screens, built from the DS.

**6. Direction briefs** (human step). Each designer takes a problem statement and writes a direction brief: the idea, the JTBDs, where AI sits, **the hard path**. No option is generated without a designer's brief.

**7. Options** (reference §4–5). Happy path plus 3 genuinely different ideas per problem statement, built from the DS on realistic data. 2–3 variations within each (layout, AI placement, content density, entry point). The designer keeps, drops or combines, with a reason.

**8. Hard-path check.** Does each option survive the hardest cases (survives / survives with a change / breaks)? No full states: that's Harden.

**9. Internal crit + direction challenger.** Structured crit (JTBD fit, AI opportunity, DS compliance, feasibility, accessibility) is logged in the feedback log as `from: team`. The `explore-direction-challenger` protocol, in a fresh context, checks the two cards really differ (in the idea or where AI sits, not in styling) and lists the JTBDs neither serves. The team lead agrees two distinct directions.

**10. Prototypes.** One flow, 3–5 screens per direction, HTML → Figma (one page per round), a real model where AI matters, at least one hard path. Fidelity matches the question being asked.

**11. Quick user test, logged BEFORE the client chooses.** A 10-minute script per direction. A real user or an organiser plays the user. Findings go in the feedback log.

**12. Stakeholder review.** A live demo, async artifact links, or Figma: whatever the client uses.

**13. Feedback intake** (reference §6). Any source, any level of detail, one log. Capture → normalise → atomise → classify → clarify and resolve → route → decide → confirm back (24h recap). Statuses: Open · Clarifying · Waiting on decision owner · Decided · Done · Rejected (reason) · Parked for Harden (owner) · Change request.

**14. Stakeholder decision.** Approve → step 15. Changes or rejects go to the **earliest layer that fixes them**, then everything above is re-rendered:
- look and feel → 3 visual direction
- tokens / components → 4 DS
- layout / IA → 5 UI direction
- steps / content / AI behaviour → 7–9 flows
- rejects both → diagnose the layer first
- wrong problem / new scope → Frame (a change request)
- states / edge cases → parked for Harden

**15. Harden input pack** (reference §7), audited at Gate 2 (`/design-lead`).

**16. Write back to Frame.** The brief is updated from the feedback log and user evidence, and the senior re-signs.

## Only if it applies

| When | Add |
|---|---|
| No foundation | visual exploration: one screen in 2–3 themes |
| Legacy or broken design system | list what can't be reused |
| Client brought ideas or competitors | weigh them, don't copy them |
| Product has AI | where AI sits in each direction, and how the user stays in control |
| Client rejects both | restart from the problem, not the screens |
| New product | start from competitors and JTBDs |

## Claude handles it, designer checks

Foundation card and component map · option sketches on realistic data · the direction challenger · HTML prototypes pushed to Figma, one page per round · the test script and feedback-log rows · token seed and handoff card.

## Checks while producing the output

`explore-foundation-check` runs the foundation checks, and `explore-direction-challenger` runs the direction checks. Judgement checks can only be passed by a designer, and the sign-off refuses while any blocking check has failed. The full table is in reference §8.

## Output

| Output | What's in it | Signed off by |
|---|---|---|
| Design-foundation card | Foundation type (code, Figma, brand guide, legacy, broken or none), what can be reused, the gaps, tokens or component map | Design lead |
| Designer direction briefs | Each designer's prompt, sketch or reference; the problem statement; the hard path to test | Each designer |
| 2 direction cards | Name, idea, JTBDs served, where AI sits, biggest risk, what we'd test | Team lead |
| Prototypes | One HTML prototype per direction: one flow, 3–5 screens, realistic data, ≥1 hard path. A Figma page for each round | Designers |
| User evidence | Test script and findings for each direction | Researcher |
| Feedback log | Round, from (client, user, team), feedback, what we changed, status | Team lead |
| **Chosen direction and decision card** | Which direction, why, the alternative considered, **and the runner-up kept as Harden's fallback** | Team lead, with the client |
| Seeded tokens | Tokens from the chosen direction, with new components listed as candidates | Design lead |
| Brief write-back | A new brief version through a decision card | Brief owner |
| Handoff card to Harden | What Harden receives, where it lives, what it doesn't include | Team lead |

Harden can start once one direction is final and backed by user evidence, every blocking check (including the designer's judgement checks) has passed, tokens are seeded and a handoff card is ready.

## Handoff

End with: the five moments' status, the route, the two directions and what each tested, the feedback-log counts by status, and the next step: Gate 2 through `/design-lead`.
