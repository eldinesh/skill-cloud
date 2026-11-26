---
id: CTX-001
type: CTX
title: Context
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:15Z
links:
created: 2026-11-26T04:22:39Z
updated: 2026-11-26T05:06:15Z
---
# CTX-001 · Context

Completed after Frame interpretation, from the client pack, the kick-off (DAT-008) and the signed Findings and Insights. Stakeholder claims stay marked as beliefs, not evidence. Still to confirm with the client at the playback: the items under "Open with the client" at the end.

## Why now

The board has asked for an AI story in operations this year. UnitDesk (2017, supply requests only) is now used for equipment, transport and discharge needs it was not built for. Stockout of IV start kits at North on a Saturday night; a member went home without an oxygen concentrator. Source: the client brief and PRD (DAT-013) and the kick-off transcript (DAT-008).

## Result wanted

Five leaders name five different results (FND-038): Dana, no more stockouts, nurses back at the bedside, first release in 8 weeks at North and Central. Raj, stockouts down without spend rising. Marcus, nurses' time given back (his figure: about 40 minutes a shift). Hannah, nothing about a member falls between hospital and plan. Priya, help deciding what release 1 should be. Engineering view: one request type (supplies) done properly in 8 weeks. The Brief has to pick; it does so by naming measures, not by averaging (see CON-003, CON-006).

## Users



## Decider

Dana Whitfield (COO, client sponsor), who co-signs the Brief. Phase 1 scope is hers to set with Hannah, Priya and Tom in the room (CON-006). Finance gate: Raj Menon ($500 approval). Nursing: Marcus Lee. Product: Priya Shah. Engineering: Tom Okafor.

## What exists

UnitDesk (PHP and SQL Server, internal API, three years of history, free-text item names). ERP (nightly extract 02:00, nightly EDI file, no PO API). Item catalogue (about 6,400 items). Staff directory and SSO. Plan member system (read-only, PHI). Unit scanners on about half of units. Meridian UI v1.4.2 (Tailwind CSS 3; gaps: data table, status badge, timeline, toast, autocomplete, green button, any AI pattern). Mock of UnitDesk (DAT-011), architecture (DAT-014).

## What was tried

2022 vendor pilot of auto-replenishment: spend up 19% on two categories in three months (Raj, claim). Earlier discovery round by Meridian's Operations Improvement team, October (DAT-007), a secondary source with its own weaknesses. UnitDesk 3.2 release.

## Client's ideas

AI chatbot (PRD R11), AI auto-ordering with no approval for predicted orders (R3), real-time inventory on every request (R6), duplicate blocking (R7), mobile app, voice (R14), predictive discharge equipment (R15), consumer-app look, removing manager approvals. All held as ideas until the problems they imply are evidenced. Each has an Idea card (IDE-001 to IDE-009) that traces it to the Problem or Insight it bears on, or says it has none.

## Constraints

See koru/client.md. Headline: no real-time inventory; AI cannot place orders; 1366 × 768 shared workstations and iPad; no native app; 10-minute idle timeout; audit on approvals and accepted suggestions; PHI rules for plan data; use Meridian UI or specify new components.

## Out of scope

PRD says "TBC". Engineering rules out: hospital record system integration, native mobile app (not approved), real-time inventory, direct PO creation. The Brief adds, from the resolved Conflicts: removing supply approvals (CON-001), a live dashboard on 02:00 data (CON-005), blocking duplicates outright (CON-008). Open: the plan side and which sites in phase 1 (CON-006). Equipment is not a phase 1 Problem; equipment approval is carried as a Brief constraint.

## Known conflicts

Nine Conflicts (cards CON-001 to CON-009). No Conflict card is signed. One resolution has been set by people: equipment approval is a Brief constraint, not a Problem (Tariq Bose and Nina, 2026-11-26, CON-001). Every other resolution below is a proposal drafted by Claude for a person to set, or is taken to the client. In short:

- Approval as the bottleneck (CON-001): for supplies, proposed toward the counts, with a caveat: the 14-minute median includes auto-approvals under 500 USD, and over-500 lines are unmeasured. Equipment approval is a Brief constraint for phase 1, not a Problem (set by Tariq Bose and Nina).
- The 40 minutes a shift (CON-002): carried, not resolved; the Brief names the measure (minutes per shift including phone time), not the number. Resolved when a baseline is measured.
- Who orders (CON-003): taken to the client (Dana with Raj and Tom); Explore carries AI-suggests-with-reason.
- Chat assistant (CON-004): carried into Explore as a bet.
- Real-time inventory and a live dashboard (CON-005): proposed toward engineering; nightly data stays, client told.
- Phase 1 scope, including the plan side (CON-006): taken to the client at Brief co-sign.
- Mobile app and any device (CON-007): taken to the client via Priya (IT policy); design to workstation and tablet now.
- Duplicates (CON-008): proposed, flag and merge; duplicate rate becomes a Steer metric.
- Single sign-on for all staff against agency and travel nurses outside the directory (CON-009): proposed, requester identity without directory accounts; the scope Decision follows CON-006.
- The Brief says 4 hospitals, the PRD's phase 1 is two (North and Central): which sites is the client's call and goes with CON-006.

## Unverified beliefs

Tested against the research, and what is left:

- Nurses lose about 40 minutes a shift (Director of Nursing estimate): the time audit gives a median of 18 and a 90th percentile of 52, with phone time not measured (FND-026). Not confirmed, not refuted; INS-001 says the cost is silence and phoning.
- Approvals are the main bottleneck: not supported for supplies (3% need approval, median 14 minutes, against 410 minutes from approval to delivery). Equipment is different (CON-001).
- Staff want a chatbot: the one person asked declined it (FND-007, INS-004, low confidence).
- Predictions can prevent stockouts: still unverified; training history misses phone requests (ASM-004).
- Units hoard stock: two interviewees describe it, and the duplicates that follow silence are measured (INS-001); that stashing is caused by silence is not shown (FND-004).
- A dashboard will lead to decisions: unverified; Dana, asked what would follow, said "call someone, I suppose" (ASM-005). No leader was interviewed as a user, and no user job is recorded for it.
- Staff will accept AI ordering once used to it: not supported and not refuted. Two prompted interviewees wanted suggestions with reasons (INS-004, low confidence); nobody asked about ordering without a person. Finance recalls the 2022 pilot raising spend 19% (FND-036), a stakeholder recollection with no data in the pack, so it is context here, not a test of ASM-006.

## Open with the client

- Phase 1 scope: supplies only, supplies plus a thin discharge slice, or discharge first (CON-006). Dana decides with Hannah, Priya and Tom.
- Whether AI may ever order (CON-003): Dana with Raj and Tom.
- Phone browsers (CON-007): IT policy, via Priya.
- Two measures to be agreed before Explore: minutes per shift including phone time (CON-002), and whether to link calls to the stores line to requests (FND-030).
- Not heard: approvers (equipment approval is a Brief constraint until one is interviewed) and leadership as users.

## Failure in six months

Staff work around it like they did with UnitDesk; AI suggestions are wrong with no visible owner; stock shown that nurses trust and that is wrong; spend rises; agency nurses on night shift still locked out; discharge needs still fall between hospital and plan.
