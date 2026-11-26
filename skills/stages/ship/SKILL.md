---
name: ship
version: 2.0.0
bundle: stages
stage: ship
description: |
  Ship v2: hardened design → an HTML deliverable and tickets engineers and their coding agents
  can build from without coming back with questions. Steps: handoff plan, client stack and Jira
  setup, HTML build (tokens only), designer fidelity review, tickets with design intent (what must
  not change, what can flex), AI handoff reviewer, engineer walkthrough, Jira push on approval,
  owning design changes during the build, measures for Learn. It runs as five designer moments.
  Use when asked to "ship", "hand off", "tickets", "Jira", "build the HTML", or "engineer review".
  Proactively invoke when Gate 3 is passed and no ux/ship/ exists. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
ls ux/team/gates/*harden-gate* 2>/dev/null | tail -1 || echo "GATE3: none"
ls ux/ship deliverable 2>/dev/null | head || echo "SHIP: not started"
```

- If `UPGRADE_AVAILABLE` / `JUST_UPGRADED`: as in every skill. If `PROJECT_CONTEXT: missing`: run the start flow first.

## Contract
- **Consumes (only final cards from Frame, Explore, Harden):** hardened design (connected HTML prototype + Figma page, every state); tokens file and design system; prioritised edge cases and fixes list; role and permission matrix, flow map; decision cards; framed brief and success outcomes; the Koru ticket template; `ux/project-context.md` (always: stack, Jira project) and the data rules in `engagement-guardrails` (synthetic data only in the deliverable and screenshots)
- **Produces:** `ux/ship/`: handoff plan, setup notes (Jira connector tested), HTML deliverable (`deliverable/`), fidelity notes, tickets (3–5 per flow) with intent, data and API assumptions per screen, engineer question list, handoff note, design change log, measures for Learn, pull request plan
- **Next:** Gate 4, Ship → Learn (`/design-lead`), then Learn

# Ship v2

**Principle:** Claude builds the HTML and drafts the tickets. The designer protects the intent, judges fidelity and owns changes during the build. The hardened design becomes an HTML deliverable and tickets engineers and their coding agents can build from without coming back with questions.

## Flow

```
Harden: hardened design (final) → 1 Handoff plan → 2 Setup: stack & Jira → 3 Build HTML deliverable → 4 Fidelity review
→ 5 Tickets with intent → [AI checker: ship-handoff-reviewer] → 6 Engineer walkthrough
→ ◆ Engineer signs off handoff? ── questions: answer or assign (back to 5) · can't be built: back to Harden (decision card)
→ 7 Push to Jira → 8 Own changes during the build (design change: update tickets + change log) → Learn
```

| # | Step | Input | What AI does | **Designer in the loop (judgement)** | Nuance it handles | Independent AI check | Signs off | Output |
|---|---|---|---|---|---|---|---|---|
| 1 | Handoff plan | Hardened design, prioritised edge cases, fixes list, decision cards | Drafts release scope, one ticket per user story, fast-follow list | **Decides what ships now and what follows, agreed with the engineer** | Scope cut late: which states survive? | — | Design lead + engineer | Handoff plan |
| 2 | Setup: stack & Jira | Client codebase, Storybook, Jira project and conventions | Maps tokens to the client's components; sets up the Jira push; creates a dummy ticket | **Decides how closely the HTML must match the client's stack** | Client stack doesn't match our tokens; legacy components can't change | — | Engineer | Setup notes; connector tested |
| 3 | Build HTML deliverable | Tokens file, hardened prototype | Builds the core flow and every state in HTML, tokens only | **Sets the fidelity bar: which interactions and states must be exact** | Client devs use coding agents, so specs need structure | — | Designer | HTML deliverable |
| 4 | Fidelity review | HTML deliverable vs hardened design | Flags visual and state differences | **Judges spacing, motion, states and feel; decides drift vs acceptable** | HTML looks right but behaves wrong: focus, loading, timing | — | Designer | Fidelity notes; fixes applied |
| 5 | Tickets with intent | Ticket template, edge cases, API and data notes | Drafts 3–5 tickets: user story, Given/When/Then, states, screenshots, tokens, data assumptions | **Writes the why: what must not change, what can flex, which edge cases matter** | Vendor team won't ask; tickets per screen hide shared states | **ship-handoff-reviewer** reads as an engineer and lists questions | Designer | Tickets with intent; question list |
| 6 | Engineer walkthrough | Question list, handoff note | Folds the answers into the tickets and the note | **Walks the engineer through, answers live, agrees trade-offs that keep the intent** | "Not possible" often means "not this sprint" | — | Engineer via sign-off | Every question answered or assigned |
| 7 | Push to Jira | Approved tickets | Creates the tickets through the connector | **Approves the push** | Jira conventions differ per client | Claude can't push without approval | Team lead | Jira tickets with links |
| 8 | During the build, and Learn | Developer questions, previews, success measures from the brief | Updates the change log, tickets and decision cards; drafts measures | **Accepts or rejects developer changes and writes them back; picks what to measure** | Changes in code never reach design or research; no analytics in place | — | Design lead | Change log; measures for Learn |

Use `/ship-code` for the deliverable (code chapter = law; scaffold, checks, build report; big builds through sidequest when it's installed) and `/ship-tickets` for the ticket mechanics. The Ship ticket template adds an **Intent** block (why · what must not change · what can flex · edge cases that matter). The design change log is `~/.skillcloud/repo/skills/core/design-lead/resources/cards/change-log.md`.

## The five designer moments

| # | Moment | Claude proposes | **Designer decides** | Output | Time |
|---|---|---|---|---|---|
| 1 | **Setup and plan** | Reads the client's stack, proposes a ticket split and a Ship plan, tests the Jira connector | **Confirms the stack, how tickets are split and what is in this release** | Ship plan, connector test | 5 min |
| 2 | **Deliverable** | An HTML build of the core flow and every state, using tokens only | **Checks it matches the hardened design and what an engineer will actually see** | HTML deliverable (review) | 15 min |
| 3 | **Tickets** | 3–5 tickets with criteria, states, screenshots, tokens and out of scope | **Writes the user intent behind each story; checks edge cases and Harden notes carried over** | Ticket drafts | 15 min |
| 4 | **Engineer review** | A handoff note, and every question an engineer would still ask | **With the engineer: answers or assigns each question; decides what waits for a later release** | Handoff with no open questions | 10 min |
| 5 | **Sign-off** | Pushes tickets to Jira after approval; drafts measures for Learn | **The engineer signs off; the designer approves the push. Claude cannot sign** | Tickets in Jira, handoff final | 5 min |

**Never delegated in Ship:** release scope and what becomes a fast follow · whether the build matches the intent · accepting or rejecting developer changes · handoff sign-off (engineer). Claude can't sign, or push without approval.

**Nuances we plan for:** scope cut late: which states survive? · client devs use coding agents, so specs need a different shape · the client stack doesn't match our tokens · a vendor team won't ask questions · HTML looks right but behaves wrong · "not possible" means "not this sprint" · developers change the design mid-build · no analytics, so outcomes can't be measured.

**Where Koru adds value (the capable-client test):** a capable client can generate tickets and HTML. What they can't get is the judgement: holding the intent (what must not change, what can flex, written down); judging fidelity (a build that looks right but feels wrong); negotiating with engineers so trade-offs keep the design intent; owning changes during the build so design, research and code stay in step; choosing measures that show whether the outcome was met, including where users overrule the AI.

## Only if it applies

| When | Add |
|---|---|
| Client has a component library or Storybook | map to their components |
| No Jira | a paste-ready ticket template |
| Product has AI | tickets cover AI states and fallbacks |
| Pull request pilot | note what a PR would take |
| Multi-region | translation and locale tickets |
| Changes after handoff | change log and ticket updates |

## Claude handles it, designer checks

HTML deliverable built from tokens · ticket drafts in the template · data and API assumptions per screen · the handoff reviewer's question list · the Jira push and ticket links · measures for Learn.

## Checks while producing the output

`ship-handoff-reviewer` reads everything as an engineer would and runs most of these checks. Judgement checks can only be passed by a designer, and the sign-off by the engineer refuses while any blocking check has failed.

| When | Check | What it does | Blocks? |
|---|---|---|---|
| Before starting | Harden is final | No tickets are finalised before the design passes Harden | Yes |
| Deliverable | States covered | Every state from Harden appears in the HTML deliverable | Yes |
| Deliverable | Tokens only | Uses the tokens file, with no hard-coded values | Yes |
| Deliverable | Matches the stack | Uses the client's stack and components where specified | Warning only |
| Tickets | Template complete | Every field in the ticket template is filled | Yes |
| Tickets | Testable criteria | Given/When/Then for every behaviour, each one testable | Yes |
| Tickets | Traceability | Links to the brief, the Figma frame, the HTML deliverable and decision cards | Yes |
| Tickets | Out of scope stated | Each ticket says what it does not cover | Yes |
| Tickets | Right size | 3–5 tickets per flow, one user story each | Warning only |
| Data | Data assumptions | Each screen lists its data sources and assumptions | Yes |
| Edge cases | Edge cases carried over | Prioritised edge cases and Harden notes appear in the tickets | Yes |
| Handoff | Engineer question test | The reviewer lists remaining questions; each must be answered or assigned | Yes |
| Handoff | Handoff note present | The note covers key decisions and who to ask | Yes |
| Jira | Connector tested | A dummy ticket was created through the connector before the run | Yes |
| ★J Judgement | User intent by a designer | Every ticket's user story was written or edited by a designer | Yes |
| ★J Judgement | Questions answered | Every question from the engineer review was answered or assigned by a person | Yes |
| ★J Judgement | Scope decided | What is in and out of this release was decided by a designer with the engineer | Yes |
| After handoff | Change log | Design changes after handoff are recorded with a reason | Warning only |

## 2 & 3. What the designer brings, and what Claude does with it

| # | Designer brings | When | Claude does | Claude shares |
|---|---|---|---|---|
| 1 | Confirms the client's stack, component library and Storybook | Start | Matches the HTML deliverable to how the client builds | Stack-matched deliverable plan |
| 2 | Names the Jira project and board and the ticket conventions | Start | Sets up the push and creates one dummy ticket to test it | Connector test result |
| 3 | Decides how tickets are split and what is in this release | Start | Splits the work and writes the out-of-scope line into each ticket | Ticket plan |
| 4 | Checks the HTML deliverable against the hardened design | After the build | Builds the core flow and every state from tokens; fixes what the designer marks | HTML deliverable |
| 5 | Writes the user intent behind each story, in plain words | While drafting | Drafts tickets around it: criteria, states, screenshots, tokens | Ticket drafts |
| 6 | Checks that edge cases and Harden notes made it into the tickets | After the drafts | Adds what is missing and re-runs the handoff reviewer | Updated tickets |
| 7 | Brings the engineer's API and data notes | While drafting | Lists data sources and assumptions for each screen | Data and API assumptions |
| 8 | Walks the engineer through the handoff and answers or assigns every question | After the reviewer | Folds the answers into the tickets and the handoff note | No open questions |
| 9 | Decides what can wait for a later release | Engineer review | Moves items to later tickets and updates the scope | Release scope |
| 10 | Approves pushing the tickets to Jira | Before the push | Creates the tickets through the connector | Jira links |
| 11 | The engineer signs off the handoff. Claude cannot sign | End | Drafts the measures for Learn and starts the change log | Handoff final, measures for Learn |

## Output to engineers and Learn

| Output | What's in it | Signed off by |
|---|---|---|
| HTML deliverable | A clickable build of the core flow and every state from Harden, using only the tokens file and the client's stack where specified | Engineer |
| Tickets (3–5 per flow) | Title, user story, context links, Given/When/Then criteria, states covered, screenshots, tokens used, out of scope, open questions, **intent** | Engineer reviews; team lead pushes to Jira |
| Handoff note | Half a page: what is in the deliverable, what is not, key decisions, who to ask | Engineer |
| Engineer question list | Every question the reviewer found, each answered or assigned | Engineer |
| Data and API assumptions | For each screen: data sources, assumptions and missing-data behaviour | Engineer |
| Design change log | Every change after handoff, with its reason | Design lead |
| Measures for Learn | What we track after release to see if the outcomes were met, including where users overrule the AI | Team lead |
| Pull request plan | What a pull request into the codebase would take, for a later pilot | Engineer |

Ship is done when an engineer has reviewed the handoff, every blocking check (including the designer's judgement checks) has passed, and every remaining question is answered or assigned.

**Still open (team decisions):** is the Jira connector working for the team? (test the day before) · which engineer reviews our handoff on the day? · do we keep the pull request plan for a later pilot?

## Handoff

End with: the five moments' status, the deliverable's check summary, ticket count and coverage, open questions (answered / assigned), the Jira status, and the next step: Gate 4 through `/design-lead`.
