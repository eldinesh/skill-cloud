---
id: FND-042
type: FND
title: Release 3.2 reached engineering with absent components, one Figma page linked, missing states and no leave-cover rule
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T04:51:04Z
evidence: stakeholder
count: 4 participants in one thread (Priya, Tom, Wen, Sam); repeated by Tom on the PO call
segment: design handoff, release 3.2
participants:
links:
  - supports DAT-012@1: Slack thread
  - supports DAT-009@1: Tom Okafor repeats it on the call
created: 2026-11-26T04:33:45Z
updated: 2026-11-26T04:51:04Z
---
# FND-042 · Release 3.2 reached engineering with absent components, one Figma page linked, missing states and no leave-cover rule

## Observation

In the release 3.2 thread, Wen Li reports the Figma approvals screen used a table with sorting and row selection that Meridian UI lacks, so it was built from scratch with sorting on the date column only. Tom Okafor reports the designs had no empty state; Sam Ortiz says it was on the second Figma page under "edge cases"; Wen Li says that page was not linked and the ticket said "build approvals screen as per Figma", so page 1 was built. Wen Li also lists an 8pt Figma grid against Tailwind defaults, a green Approve button where no green button exists (primary blue used), no error copy ("Something went wrong" written by the developer) and a table overflow at 1366 against a 1440 design. Priya Shah reports the acceptance criteria said "approver can approve requests" and did not cover an approver on leave, leaving 40 requests stuck behind one manager. Tom repeats on the PO call that designs used components absent from code with no empty or error states. Asks for the next release: real components or a list of new ones, every state, criteria on who can do what, one source of truth, and what happens when AI is wrong, who sees it, who fixes it and how it is logged.

## Quotes

No quotes: Slack lines carry a time but no colon speaker label, so they are cited by thread and time (DAT-012).
