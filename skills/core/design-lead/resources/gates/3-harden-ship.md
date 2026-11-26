# Gate 3 · Harden → Ship
Audit: **harden-ship-readiness-audit** · Called by: design lead (hardened design, checklist and decision cards assembled) · Gaps decided by: design lead · Handoff accepted by: Ship lead

| # | Question | ★ | Evidence to look at | Fix at | AI verdict + evidence | Human decision | Owner |
|---|---|---|---|---|---|---|---|
| A1 | Did a designer set the harden plan (what is in, what is out, and why)? | ★ | Harden plan card | Moment 1 | | | |
| A2 | Are late scope cuts recorded, with fast follows listed? | | Decisions log | Moment 1 | | | |
| B1 | Were the real roles validated with the client (shared accounts, delegates, temporary access)? | ★ | Role matrix, decisions log | Moment 3 | | | |
| B2 | Does every screen have empty, loading, error and success states (harden-reviewer pass)? | ★ | Reviewer report, prototype | Moment 4 | | | |
| B3 | If the product has AI: is behaviour when the AI is wrong or unsure decided and agreed? | ★ | AI-state decision card | Moment 4 | | | |
| C1 | Does every cut or deferred edge case have a reason written by a designer? | ★ | Edge-case list | Moment 2 | | | |
| C2 | Did an engineer check feasibility before the list went to the client? | ★ | Decisions log | Moment 3 | | | |
| C3 | Is the list ranked now / later / won't with the client, each with a reason? | ★ | Prioritised list | Moment 3 | | | |
| C4 | Is every "now" case designed into the prototype? | | Prototype, reviewer report | Moment 3 | | | |
| D1 | Did the rulebook check (fresh chat) mark every rule pass, waiver or fail; do waivers have an owner and expiry? | ★ | Rulebook report | Moment 4 | | | |
| D2 | Zero hard-coded values and zero components from outside the design system? | ★ | Prototype source vs tokens | Moment 4 | | | |
| D3 | Does it meet WCAG 2.2 AA (contrast, keyboard, focus, labels)? | | Accessibility report | Moment 4 | | | |
| D4 | Has a designer done the craft and trade-off review? | ★ | Decision cards | Moment 4 | | | |
| D5 | Hygiene: clean file, every prototype link works? | | Prototype | Moment 4 | | | |
| E1 | Are trade-offs recorded as decision cards with an owner? | ★ | Decision cards | Moment 4 | | | |
| E2 | Tokens file exported; new components added to the design system? | | Design-library repo | Moment 5 | | | |
| E3 | Is the AI quality log updated with every AI mistake caught in Harden? | | AI quality log | All | | | |
| E4 | Handoff card filled and Ship lead named? | | Handoff card | Moment 5 | | | |
| F1 | Could Ship start without asking us anything? (AI lists every question it would still have) | ★ | The whole pack | Where it points | | | |

**Outcomes:** Go → hardened design renamed -final into project knowledge · Go with conditions → conditions in decisions log and handoff card · Back to Harden (a ★ Gap we can fix here) · **Back to Explore** (the direction won't hold: core idea fails a hard case or feasibility → try the runner-up direction first; decision card to Explore)

| Sign-off | Name | Date | Decision |
|---|---|---|---|
| AI review run by (harden-ship-readiness-audit, version) | | | — |
| Engineer (feasibility) | | | Agreed / not agreed |
| Rulebook owner | | | Passed / passed with waivers |
| Design lead (decides every Gap, signs the design) | | | Go / Go with conditions / Back to Harden / Back to Explore |
| Ship lead (accepts the handoff) | | | Accept / Reject (reason) |
