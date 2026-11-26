---
id: BRF-001
type: BRF
title: Meridian Health requests platform: Brief for release 1
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:17Z
cosigned_by: Dana Whitfield (client sponsor) 2026-11-26T05:06:17Z
links:
  - cites INS-001@2: silence after submitting is the root cost
  - cites INS-002@1: night, agency and travel nurses work around the system
  - cites INS-003@1: discharge equipment fails at the hand-off
  - cites INS-004@2: staff want AI that suggests and shows its working
  - cites FND-025@1: 22% of supply requests stayed Submitted until month end
  - cites FND-024@1: duplicate rate 36% North, 31% Central
  - cites FND-022@1: supply approval is 3% of requests, median 14 minutes
  - cites FND-023@1: median 410 minutes from approval to delivery
  - cites FND-026@1: median 18 minutes a shift, phone time not measured
  - cites FND-030@1: 10,970 calls to the stores line, not linked to requests
  - cites FND-031@1: 27% of North night sessions on the shared login
  - cites FND-027@1: 71% of recorded stockouts at nights or weekends
  - cites FND-029@1: 71% of discharge needs lack a member ID
  - cites FND-021@1: supplies are 80% of requests, discharge needs about 3%
  - cites FND-018@1: 40 equipment requests behind one absent approver (one ticket and one thread, one event; context for the equipment constraint)
  - cites CON-006@1: phase 1 scope and sites are the client's call
  - cites CON-003@1: whether AI may ever order is the client's call
  - cites CON-001@1: supply approval is not the slow step on the counts, with a caveat; equipment approval is a constraint
  - cites FND-009@1: sessions ending mid-task is one traveller and one ticket; permanent staff are not evidenced
  - cites FND-007@1: the one participant asked about chat declined it
  - cites FND-034@1: stock known as of 02:00 on about half the units
  - cites FND-035@1: no PO API; lines over 500 USD need ERP approval
  - cites FND-036@1: context only; a stakeholder recollection that 2022 auto-replenishment raised spend 19%, no data in the pack
  - cites FND-038@1: five leaders name five different results
  - cites FND-039@1: Meridian UI is missing seven components this project needs
created: 2026-11-26T04:54:46Z
updated: 2026-11-26T05:06:17Z
---
# BRF-001 · Meridian Health requests platform: Brief for release 1

Drafted from final cards only: the four signed Insights (INS-001 and INS-004 at version 2) and the signed Findings and Data they rest on. The Problem, JTBD and HMW cards are still drafts, so this Brief does not cite them; it restates their substance from the Insights. Context is in CTX-001. For people to review and sign: engagement lead signs, Dana Whitfield (client sponsor) co-signs.

## Problem

Staff at the sites we studied (North, Central) cannot tell whether a request was seen or when it will arrive. The evidence ties that silence to duplicate requests (INS-001, medium confidence, four interviewees). Phoning and keeping private stock are described by interviewees but are not shown to follow from silence. For supplies, approval is probably not the slow step: the median is 14 minutes and 3% of supply requests need it, against 410 minutes from approval to delivery (FND-022, FND-023). That 14 minutes includes auto-approvals under 500 USD, so it does not show that over-500 supply lines are fast (CON-001). 22% of supply requests are never updated before the month-end bulk close (FND-025), and the duplicate rate is 36% at North and 31% at Central (FND-024).

Two groups are worse off than the rest.

- Night, agency and travel nurses have no login of their own, use a shared account that times out, and meet shortages by borrowing and walking, so the hardest shifts leave no record (INS-002, medium confidence). 27% of North night sessions use the shared login and 71% of recorded stockouts fall at nights or weekends (FND-031, FND-027).
- A member's discharge equipment has no single route, no owner and no confirmation back to the nurse (INS-003, medium confidence). It is about 3% of requests and the harm case: 71% of UnitDesk discharge needs have no plan member ID (FND-021, FND-029), and one member probably went home without oxygen, an event that may be told three times (FND-017).

The platform and library under the new screens cannot carry them today: UnitDesk stores free-text item names and status updated by hand, and Meridian UI is missing seven components the project needs (FND-039). This is foundation work, sized before Explore commits to a Direction.

On AI: two interviewees, both asked a question that named suggestion, wanted it to propose an item and say why; the one person asked about chat declined it (INS-004, low confidence, two participants). Nobody asked for AI to order, but nobody was asked about it either. Finance recalls auto-ordering raising spend 19% in 2022; that is a recollection with no data in the pack, so it is context, not evidence (FND-036).

What runs against these readings:

- INS-001: Dana holds that approvals are the cause (ASM-001). The counts and one interview point the other way for supplies, with the over-500 caveat above.
- INS-002: the night share is thinly evidenced. 71% of recorded stockouts at nights or weekends has no base rate and sits on scanning units only (FND-027), and the claim that sessions end mid-task for permanent staff rests on one traveller and one ticket (FND-009).
- INS-003: discharge is 3% of volume (FND-021), and Dana wants the plan side in phase 2 (FND-038).
- INS-004: Dana wants AI to do the ordering (FND-038, CON-003), and one ticket says "Love the idea of AI" (#4511).

## Outcome

Release 1 succeeds when a requester can see without phoning that a request was seen and which delivery round it is on, and when the two worse-off groups above are no longer invisible to the system. Measured against the Q3 baselines, with targets to be agreed with the client before Explore:

- Share of supply requests left at Submitted until month end: 22% (FND-025).
- Duplicate rate for supplies: 36% North, 31% Central (FND-024). Duplicates are flagged and merged, not blocked, so the rate is the Steer metric.
- Calls to the stores line, 10,970 in Q3: these are not linked to requests today, so a link is needed to measure them (FND-030).
- Minutes per shift on requests, including phone time. The baseline is not known: the audit median is 18 minutes with phone time excluded (FND-026). The 40 minutes a shift quoted by leadership is a belief, not a baseline (FND-033).
- Share of North night sessions on the shared login: 27% (FND-031).
- If discharge is in scope: discharge needs without a plan member ID, 71%, and raised after the patient left, 18% (FND-029).

Spend must not rise: Raj Menon's condition. He bases it on his recollection of the 2022 pilot, which the pack does not evidence (FND-036), so the condition stands as his requirement, not as a finding.

## Scope

In, for release 1 (the sites are the client's call, see below):

- Request visibility: seen, which delivery round, and the cut-off, with an owner for keeping status true (INS-001). A wrong status is worse than none (FND-034).
- A flag, not a block, for duplicate requests, shown with its reason, for the materials manager to decide (INS-001, FND-024). Where the flag is an AI suggestion, it shows its reason and keeps a person in charge (INS-004, low confidence, a bet for Explore to test).
- A way for any nurse on shift, including agency and travel staff, to ask under their own name without a directory account (INS-002, medium; one traveller interviewed, the rest is system counts).
- The foundation work: catalogue mapping to plain names, status ownership, the missing components and an AI-suggestion pattern, specified before any build.

Not in scope as items, because no Insight supports them; Explore may test them as bets: a flag for requests far above what a unit normally uses (one prompted wish from P03; INS-001 and INS-004 do not cover it), and showing which nearby unit holds an item (rests on FND-028, a one-off audit, and 02:00 stock counts on half the units; INS-002 does not cover it).

Equipment approval is a constraint on phase 1, not a Problem (decided by Tariq Bose and Nina, 2026-11-26). No Insight covers approvers and no approver has been interviewed. The design must not make equipment approval worse: the over-500 USD control stays, and an approval must not stall behind one absent approver. The only evidence is one event, 40 requests behind one manager on leave, told by a ticket and a Slack thread (FND-018, FND-042). Whether equipment is in release 1 at all goes with CON-006.

Decision needed from the sponsor at co-sign (CON-006, taken to the client): which sites are in release 1, and whether discharge equipment is. The Brief does not fix either. The client brief says four hospitals and the PRD's phase 1 says North and Central (DAT-013); our evidence comes from North and Central only. On discharge equipment: The evidence says volume and harm point to different answers: supplies are about 80% of requests; discharge needs are about 3% and carry the harm (FND-021, FND-029, INS-003). Engineering says one request type done properly fits in eight weeks, and anything added means cutting something else (FND-035 and the engineering call). The options are supplies with status only; supplies plus a thin discharge slice (one way in, member ID attached, confirmation back with a date); or discharge first. Hannah Cole speaks for the plan side and Dana for supplies first (FND-038). This Brief is not final until the sponsor's choices on sites and request types are written in.

Carried into Explore as a bet, not a requirement: conversational help against visible status (CON-004). One Direction tests it.

## Out of scope

- Removing supply approvals: the counts say approval is not the slow step for supplies, with the over-500 caveat (CON-001, FND-022). Raised by Dana; she should hear it with the numbers.
- A live dashboard or real-time inventory on every request: stock is known as of 02:00 on about half the units (FND-034). The client has been told (CON-005).
- AI placing orders, as a build constraint: there is no PO API, and lines over 500 USD need ERP approval; AI can suggest a line for tonight's file that a materials manager approves (FND-035). Whether AI may ever order is Dana's decision with Raj and Tom (CON-003), still open. The research neither supports nor refutes it: nobody was asked about ordering (INS-004).
- A native mobile app (not approved). Design to the shared workstation (1366 × 768) and tablet; phone browser use goes to IT policy via Priya (CON-007).
- Integration with the hospital record system, direct PO creation.
- Anything the sponsor does not put in scope at co-sign: which sites, and the plan side (CON-006).

## Constraints

From engineering and the client (koru/client.md), treated as true over the PRD:

- Stock levels: last counted 02:00 plus scans, on about half the units (FND-034).
- AI cannot place orders; lines over 500 USD need ERP approval (FND-035). Every approval and accepted AI suggestion is logged with who accepted it.
- Shared workstations on wheels (Windows, Chrome, 1366 × 768), iPad on about a third of units; 10-minute idle timeout on shared devices, so the design saves half-finished work rather than removing the timeout.
- PHI: role-based access and audit logging; navigators see a coverage yes or no and the facts they need, not clinical notes.
- Use Meridian UI v1.4.2 components or specify the new ones; every state for every screen; spacing and type as tokens (FND-039, FND-040).
- First release in eight weeks (Dana's date).

Open with the client, not for this Brief to settle: the phase 1 scope above, including sites and whether AI may ever order (CON-003); the baseline for minutes per shift; targets for each measure; who owns request status.
