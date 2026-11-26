# Gate 2 · Explore → Harden
Audit: **explore-harden-readiness-audit** · Called by: team lead (pack assembled, step 15) · Gaps decided by: team lead · Handoff accepted by: Harden lead
Every check marked "Yes" in Explore's checks is ★ here; some "Warning only" checks become ★ because Harden builds on the final pack. 40 questions, 20 blocking.

| # | Question | ★ | Evidence to look at | Fix at | AI verdict + evidence | Human decision | Owner |
|---|---|---|---|---|---|---|---|
| A1 | Exactly one direction chosen, with a decision card (why, alternative, decided by, date)? | ★ | Decision card | 14 | | | |
| A2 | Client decision owner agreed, and it's in the decisions log? | ★ | Decisions log, transcript | 14 | | | |
| A3 | Every direction-card field filled, and filled BEFORE it was shown to the client? | ★ | Direction card vs first review date | 9 | | | |
| A4 | Every screen traces to a problem statement / JTBD / AI opportunity; unserved JTBDs listed with a reason? | ★ | Screen trace, research pack | 7–9 | | | |
| A5 | Clear on screen where AI sits and how the user stays in control (confirm, undo, override)? | ★ | Prototype, direction card | 7–9 | | | |
| A6 | Chosen direction started from a designer's direction brief (no option without one)? | ★ | Direction brief, card "Set by" | 6 | | | |
| A7 | Client ideas, competitors and existing-system patterns weighed, not copied? | | Client references register, challenger report | 2, 9 | | | |
| A8 | Challenger report shows the two directions really differed (idea or where AI sits, not styling)? | ★ | Challenger report, both cards | 9 | | | |
| B1 | "What we'd test" answered by users: at least 1 session at the hackathon; 5 per direction on projects, or a logged "provisional pass"? | ★ | Feedback log (user), test notes | 11 | | | |
| B2 | Did any user fail the core task? If yes, is the fix in the final prototype? | ★ | Test notes, prototype | 7–11 | | | |
| B3 | Did the biggest risk show up in testing? If yes, is there a fix the team believes in? | | Test notes, decision card | 7–9 | | | |
| B4 | Is what's still untested written down for Harden? | | Decision card | 14 | | | |
| B5 | User test findings logged BEFORE the client chose? | ★ | Feedback-log dates vs decision date | 11, 14 | | | |
| C1 | Design-foundation card signed: real state (incl. legacy / broken components), scenario, route, 8 intake answers? | ★ | Design-foundation / route card | 1 | | | |
| C2 | DS fit check passed (fresh Claude built a screen from the DS + DS.md only)? | ★ | Fit-check output | 4 | | | |
| C3 | Final prototype uses zero hardcoded values and zero invented components? | ★ | Prototype source vs tokens file | 4, 10 | | | |
| C4 | Figma variables and code tokens match (names + values)? | | Figma variables, tokens file | 4 | | | |
| C5 | Every component used is mapped; every new one in the candidates log with owner + spec stub (or Proposals page if locked)? | | Component map, candidates log | 4 | | | |
| C6 | Token set meets WCAG 2.2 AA contrast (unless the client agreed another target)? | | Contrast report | 3–4 | | | |
| C7 | Routes J / K: prototype shown working in at least 2 modes? | | Prototype per mode | 4, 10 | | | |
| D1 | Figma "Final" page holds only the chosen direction, named to convention, no WIP frames? | | Figma Final page | 10 | | | |
| D2 | HTML prototype and Figma frames match the latest round? | | Prototype vs Figma | 10 | | | |
| D3 | One flow covered end to end in 3–5 screens? | | Prototype | 10 | | | |
| D4 | Every hand edit in Figma logged as a break and folded back into the source? | | Break log, feedback log | 10 | | | |
| D5 | At least one hard path shown besides the happy path (not full state coverage)? | ★ | Prototype, direction brief | 7–8, 10 | | | |
| D6 | Looks like the real product: no wireframes, no placeholder text, realistic data? | ★ | Prototype | 7, 10 | | | |
| E1 | Zero feedback-log rows Open, Clarifying or Waiting? | ★ | Feedback log | 13 | | | |
| E2 | Every conflict decided by the decision owner, with a log row? | ★ | Feedback + decisions log | 13 | | | |
| E3 | Every vague point clarified, or dropped with a reason? | | Feedback log | 13 | | | |
| E4 | Every resolved Figma / artifact comment has a matching log row? | | Comments vs log | 13 | | | |
| E5 | Every row parked for Harden has an owner? | | Feedback log | 13 | | | |
| E6 | 24h recap sent to the client for the last round? | | Recap message | 13 | | | |
| F1 | Every hard case marked survives / survives with a change; none "breaks"? | ★ | Direction card hard cases | 8 | | | |
| F2 | Scope boundary written: what is NOT included? | | Pack scope boundary | 15 | | | |
| F3 | Out-of-scope requests logged as change requests, not built? | | Feedback log | 13 | | | |
| G1 | Every open question / assumption has an owner and "test in Harden" or "accept"? | | Open questions list | 15 | | | |
| G2 | If learnings change the brief: new brief version drafted, re-signed or scheduled? | ★ | Brief vN+1, decisions log | 16 | | | |
| G3 | Handoff card filled, Harden lead named? | | Handoff card | 15 | | | |
| H1 | Could Harden start without asking us anything? AI lists every question it would need to ask: none, or each answered in the pack | ★ | The whole pack | Where it points | | | |
| H2 | Has a developer looked for obvious feasibility blockers (not the full Harden check)? | | Dev note | 9–10 | | | |

**Outcomes:** Go → pack goes to Harden as -final · Go with conditions → conditions tracked in decisions log = Harden checklist · Back to Explore (any ★ Gap, or a waiver refused) · **Back to Frame** (direction no longer answers the brief, or scope changed → change request to Frame; the gate stops)

| Sign-off | Name | Date | Decision |
|---|---|---|---|
| AI review run by (explore-harden-readiness-audit, version) | | | — |
| Team lead (decides every Gap) | | | Go / Go with conditions / Back to Explore / Back to Frame |
| Harden lead (accepts the handoff) | | | Accept / Reject (reason) |
