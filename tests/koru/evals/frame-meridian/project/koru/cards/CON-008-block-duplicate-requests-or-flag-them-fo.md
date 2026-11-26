---
id: CON-008
type: CON
title: Block duplicate requests, or flag them for a person to merge?
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:06Z
resolution: resolved: flag and merge; duplicate rate becomes a Steer metric
links:
  - cites DAT-013@1: PRD R7 blocks duplicates
  - cites FND-013@1: two mechanisms, re-asking after silence and double click
  - cites FND-024@1: 36% North and 31% Central duplicate rate, may undercount
  - cites FND-001@1: status silence
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:06Z
---
# CON-008 · Block duplicate requests, or flag them for a person to merge?

## Positions

- **A. Block duplicates.** PRD R7 ("Duplicate requests are blocked"). Document.
- **B. Flag them and let a person merge.** Tom: "If we block automatically we'll block real requests", since the same item for different patients is not a duplicate; two nurses on one unit asking in the same hour are probably one. Engineer, on a feasibility and risk question.
- **Observed rate:** 36% North and 31% Central of supply requests are duplicates by the system's own matching, which uses free-text names and may undercount (FND-024).

## Weighing

The engineer has the better of it on a question of risk. The rate is large enough that the nurse-facing cause matters as much as the rule: P03's duplicates come from units hearing nothing (FND-013, FND-001) and #4490's from a click that gave no feedback. Fixing status and click feedback may remove a share of duplicates without any blocking; flagging at the point of request ("a request for this item from your unit is open since 07:40") costs less than a wrong block. Free-text item names must be mapped to catalogue items for any flag to work (FND-005).

Three of the four interviewees preferred a flag, so the majority settles it: flag and merge.
