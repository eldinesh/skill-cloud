---
id: SCR-003
type: SCR
title: New request with duplicate offer
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 3
ds_version: 1.4.2
prototype: koru/deliverables/request-tracker/index.html
links:
  - implements DIR-001: add to the open request
created: 2026-11-26T05:07:59Z
updated: 2026-11-26T05:07:59Z
---
# SCR-003 · New request with duplicate offer

## Purpose

Raise a request by searching the catalogue in plain names. If her unit already has the item open, offer "add to the open request" (a flag she can decline, never a block: CON-008). Shows which round it will make before she sends, and the button cannot be pressed twice (FND-013). Hard cases: STA-001, STA-005.

## Elements

| Element | Class | Note |
| --- | --- | --- |
| ItemSearch | new | Search over plain names, shows the catalogue name beside it. Plain names exist for about 1,100 of 6,400 items (FND-005). |
| DuplicateOffer | new | The open request with who, when and status; two actions, add or send separately. |
| TextInput (quantity) | use | Shows the unit's usual order as helper text. |
| ArrivalWindow | new | Estimate before sending. |
| Button | use | Primary send; disabled while sending. |
| Toast | new | Sent and added confirmations. |
| Modal | extend | Sign-out dialog uses a native dialog for a focus trap, which Meridian's modal lacks. |
