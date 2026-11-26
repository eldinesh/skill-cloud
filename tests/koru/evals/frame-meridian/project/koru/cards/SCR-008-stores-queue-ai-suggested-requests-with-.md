---
id: SCR-008
type: SCR
title: Stores queue: AI-suggested requests with reasons
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 4
ds_version: 1.4.2
prototype: koru/deliverables/ask-and-suggest/index.html
links:
  - implements DIR-002: the manager sees what the AI proposed and who accepted
created: 2026-11-26T05:08:01Z
updated: 2026-11-26T05:08:01Z
---
# SCR-008 · Stores queue: AI-suggested requests with reasons

## Purpose

The materials side for DIR-002: the same queue as SCR-004, with a "why it is here" column: what the nurse wrote, whether the AI suggested the item, who accepted it and whether the quantity changed, plus flags for repeats and far-above-usual quantities. The audit trail the constraints require (every accepted AI suggestion is logged with who accepted it).

## Elements

| Element | Class | Note |
| --- | --- | --- |
| DataTable | new | As SCR-004. |
| StatusBadge | new | As SCR-001. |
| Button | use | Mark seen. |
| Toast | new | Confirms what changed. |
