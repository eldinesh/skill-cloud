---
id: SCR-002
type: SCR
title: Request detail: who has seen it, next step, arrival window
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 2
ds_version: 1.4.2
prototype: koru/deliverables/request-tracker/index.html
links:
  - implements DIR-001: the parcel-tracker view
created: 2026-11-26T05:07:59Z
updated: 2026-11-26T05:07:59Z
---
# SCR-002 · Request detail: who has seen it, next step, arrival window

## Purpose

One request, parcel-tracker style: the arrival window with the reason for the round it is on, the next step, and a history of who did what and when. Where nobody has seen it, it says so rather than guessing (FND-034). Hard cases: STA-002, STA-003.

## Elements

| Element | Class | Note |
| --- | --- | --- |
| ArrivalWindow | new | Round, window and the cut-off in one place (HMW-002). Variants: on the round, missed the cut-off, estimate (not approved yet), delivered. The 30-minute window is ASM-007. |
| Timeline | new | Sent, seen by stores, approved, on the round, delivered; each with who and when. |
| StatusBadge | new | As SCR-001. |
| Alert | extend | Warning variant with an alert role for "may be out of date"; Meridian's banner has no role. |
| Button (Ask stores for an update) | use | Secondary. Logs the ask in the history. |
| Toast | new | Confirms the ask. |
