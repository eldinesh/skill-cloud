---
id: CON-007
type: CON
title: Mobile app and any device against policy and approved platforms
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:06Z
resolution: client: IT policy on phone browsers via Priya; design to workstation and tablet now
links:
  - cites DAT-013@1: brief "on any device"; PRD goal 5 mobile app and R8
  - cites FND-031@1: 34% of UnitDesk sessions from a phone browser
  - cites FND-011@1: staff text the charge nurse from personal phones
  - cites FND-019@1: tablet layout fails
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:06Z
---
# CON-007 · Mobile app and any device against policy and approved platforms

## Positions

- **A. A mobile app, and any device.** Brief ("on any device"), PRD goal 5 and R8, Dana ("We'll sort that"). Document and stakeholder.
- **B. No native app is approved; phones are against policy.** Priya (kick-off: "IT hasn't approved a mobile app yet"), Tom (responsive web on the workstations and unit tablets; phones "policy says no, reality says yes"), Marcus (phones are officially not allowed). Written engineering note and client rules (DAT-014).
- **C. Behaviour: phones are used anyway.** 34% of UnitDesk sessions come from a phone browser (FND-031, observed); P02 texts the charge nurse from a personal phone (FND-011). The tablet screens do not work today (FND-019, one ticket).

## Weighing

The policy position and the behaviour are both true and are not in conflict about facts: the app is not approved, and people use phone browsers anyway. What is in question is whether the phone browser is a supported target. Design to the devices the client will answer for: the 1366 × 768 workstation and the 10-inch iPad on about a third of units. A phone-sized layout would answer 34% of sessions but needs IT to say it is allowed, and the phone use includes PHI-adjacent requests.

Proposed for the person to set: **taken to the client** (IT policy question via Priya): is a phone browser a supported device? Until then, design to workstation and tablet and make sure nothing breaks on a phone.
