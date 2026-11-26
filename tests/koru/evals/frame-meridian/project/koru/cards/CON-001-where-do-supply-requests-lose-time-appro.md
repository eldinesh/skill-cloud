---
id: CON-001
type: CON
title: Where do supply requests lose time: approval or the wait after it?
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:05Z
resolution: resolved for supplies toward the counts, with a caveat: the 14-minute median includes auto-approvals under 500 USD and over-500 lines are unmeasured. Equipment approval is carried as a Brief constraint for phase 1, not a Problem (decided by Tariq Bose and Nina, 2026-11-26)
links:
  - cites ASM-001@1: position A, approvals are the bottleneck
  - cites FND-037@1: position B, P03
  - cites FND-022@1: positions B and C, approval share and median by type
  - cites FND-023@1: position B, approved-to-delivered medians
  - cites FND-018@1: position C, 40 equipment requests, no delegate
  - cites FND-042@1: position C, 40 requests stuck behind one manager
created: 2026-11-26T04:35:11Z
updated: 2026-11-26T05:06:05Z
---
# CON-001 · Where do supply requests lose time: approval or the wait after it?

## Positions

- **A. Approval is the main bottleneck; remove or automate it.** Earlier synthesis finding 3 (DAT-007, document, second-hand, rated "medium" by its authors); Dana at kick-off: "the $500 rule is part of why it's slow" (stakeholder).
- **B. For supplies, approval is not the slow step; the slow steps are working out what was meant and the twice-daily round.** P03, who works the queue (FND-037, story). Q3 system counts: 3% of supplies need approval, median 14 minutes, against a median 410 minutes from approval to delivery (FND-022, FND-023, observed).
- **C. For equipment, approval is slow and can stall.** 62% over 500 USD, median 95 minutes, 1,320 minutes to delivery (FND-022, FND-023); 40 equipment requests waited behind one manager on leave with no delegate (ticket #4502, FND-018; Slack, FND-042; the mock's Approvals page shows the same state, but it is a pack illustration and does not corroborate, FND-043).

## Weighing

A question about where time goes in a process is answered by behaviour and counts, not by say-so. B rests on one interview (P03, a story, FND-037) and the Q3 system counts (observed); the two agree. A rests on a second-hand document and a stakeholder's view. Do not count the synthesis as a second vote: it says it rests on four interviews, and the interview set we hold is also four interviews run last month, so it is probably the same data read differently (to confirm with Meridian). The transcripts do not contain the approval claim.

C is not a contradiction of B; it is a different request type. C is also thin: one ticket, one Slack thread and a pack illustration describe the same 40 requests (FND-018, FND-042, FND-043), so it is one event, not three sources.

What is not known: the median approval time for the 3% of supply lines that are over 500 USD (the 14-minute figure includes auto-approvals under 500 USD, so it cannot show those lines are not slow; ASM-001 lists this as still missing), and the share of equipment delay that is approver absence. Both can be requested from Operations Technology.

Resolution (supplies): the counts favour B, with the caveat above. Do not put approval removal in the Brief. Anyone citing "supply approval is not the cause" should carry the caveat.

Resolution (equipment): decided by Tariq Bose and Nina on 2026-11-26. Equipment approval is carried as a constraint in the Brief for phase 1, not as a Problem, because no Insight covers approvers and no approver has been interviewed. The job, HMW and Problem cards that treated it as a Problem were discarded. Dana holds the other view on approvals, so Dana should hear this with the numbers.
