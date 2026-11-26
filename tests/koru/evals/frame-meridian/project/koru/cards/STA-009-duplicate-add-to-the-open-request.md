---
id: STA-009
type: STA
title: Duplicate: add to the open request
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-006
role: nurse
state: duplicate: the suggested item is already open for her unit
resolution: open
links:
  - serves SCR-006: the AI suggests an item the unit already has open
uid: mwx3vt6a1ffda528
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-009 · Duplicate: add to the open request

## Design

She wrote "nitrile gloves medium" and the AI suggests that item. Her unit already has R-5107 open, so the suggestion shows the same offer as DIR-001: "Add 2 to R-5107" or "Send as a separate request", with the open request's status and who asked. The plain Send button is hidden, so adding is the default path and a separate request is a deliberate choice. Open at `?state=STA-009`. The comparison with STA-001 is the point: the same offer, reached through words instead of search. Whether people accept the offer when it comes after an AI suggestion is a test question.
