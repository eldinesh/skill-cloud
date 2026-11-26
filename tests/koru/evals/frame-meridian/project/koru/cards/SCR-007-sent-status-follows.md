---
id: SCR-007
type: SCR
title: Sent: status follows
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 3
ds_version: 1.4.2
prototype: koru/deliverables/ask-and-suggest/index.html
links:
  - implements DIR-002: status as in DIR-001
created: 2026-11-26T05:08:01Z
updated: 2026-11-26T05:08:01Z
---
# SCR-007 · Sent: status follows

## Purpose

After sending: the request with the same arrival window, next step and history as DIR-001's detail page, plus a log line saying who accepted what (accepted AI suggestion, quantity changed or not). Ten seconds to undo. Below, the unit's open requests.

## Elements

| Element | Class | Note |
| --- | --- | --- |
| UndoBar | new | Ten seconds, announces itself, one button. |
| ArrivalWindow | new | As SCR-002. |
| Timeline | new | As SCR-002. |
| StatusBadge | new | As SCR-001. |
| DataTable | new | Compact list of the unit's open requests. |
| Button | use | Primary "Ask for something else". |
