---
id: CON-005
type: CON
title: Real-time inventory and a live dashboard against a 02:00 nightly count
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:06Z
resolution: resolved: toward engineering; nightly data stays, client told
links:
  - cites ASM-005@1: position A, dashboard leads to decisions
  - cites FND-034@1: position B, 02:00 extract, scans on half the units
  - cites FND-025@1: status itself is stale for 22% of supply requests
  - cites FND-027@1: stockouts are counted only on scanning units
  - cites FND-038@1: Dana, "no stockouts"
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:06Z
---
# CON-005 · Real-time inventory and a live dashboard against a 02:00 nightly count

## Positions

- **A. Show real-time inventory on every request, and a live view of every request across all four hospitals.** PRD R6 and R10; the brief ("a live view of where requests are stuck"); Dana. Document and stakeholder.
- **B. The best available is last counted at 02:00 plus scans since, on about half the units.** Tom Okafor (FND-034, engineer, matches DAT-014 and the architecture note): "It's roughly yesterday", and a wrong number that a nurse trusts is worse than no number.

## Weighing

Feasibility is the engineer's call and the written note agrees with the call. The data supports the engineer: stockouts are recorded only on units that scan (FND-027), so even the historical picture covers about half the units.

The dashboard has a second data problem that nobody has named: "where requests are stuck" depends on request status, and status today stays "Submitted" unless a materials manager updates it by hand (architecture note; 22% never updated, FND-025). So the dashboard is limited by status data, not by stock data. Asked what decision it would enable, Dana answered "Call someone, I suppose" (ASM-005).

Design consequence: show "last counted 02:00" with age, never a bare number; treat status updates as a data source to be designed (who updates, when), since both the nurses' view and leadership's depend on it.

Proposed for the person to set: **resolved toward engineering**, with the client told. Not a bet: it cannot be built in the time.
