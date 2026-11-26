---
id: STA-001
type: STA
title: Duplicate: an open request for the same item
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-003
role: nurse
state: duplicate: an open request exists for the same unit and item
resolution: open
links:
  - serves SCR-003: the offer to add to the open request
created: 2026-11-26T05:08:04Z
updated: 2026-11-26T05:08:04Z
---
# STA-001 · Duplicate: an open request for the same item

## Design

She picks Gloves, nitrile, medium. Her unit already has R-5107 open (2 boxes, asked at 13:02, seen by stores at 13:05, on the 16:00 round). An info banner says so, with the request's status, and offers two actions: "Add 1 to R-5107" (primary) or "Send as a separate request". Nothing is blocked (CON-008): two nurses may really need two. The plain Send button is hidden while the offer shows, so there is one choice to make, not three. Adding changes the open request's quantity and tells her stores still sees one request. Open at `?state=STA-001`. Same unit and same item is the only rule; the match depends on the catalogue mapping (FND-005).
