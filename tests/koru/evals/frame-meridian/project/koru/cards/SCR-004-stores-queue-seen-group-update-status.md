---
id: SCR-004
type: SCR
title: Stores queue: seen, group, update status
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 4
ds_version: 1.4.2
prototype: koru/deliverables/request-tracker/index.html
links:
  - implements DIR-001: the person who keeps status true
created: 2026-11-26T05:07:59Z
updated: 2026-11-26T05:07:59Z
---
# SCR-004 · Stores queue: seen, group, update status

## Purpose

The materials side: one list with items together, possible duplicates flagged with their reason, stock with its age (counted 02:00), and a one-step "mark seen" that is what makes the nurse's status true (HMW-004, JOB-003, ASM-009). Merge is a person's decision; "keep both" is always there. Hard case: STA-004 (10,000 rows, 50 a page).

## Elements

| Element | Class | Note |
| --- | --- | --- |
| DataTable | new | Same component as SCR-001; paged at 50, filters above. |
| StatusBadge | new | As SCR-001. |
| Select | use | Native; filters. |
| Button | use | Mark seen, merge (primary), keep both (ghost). |
| Toast | new | Confirms what changed. |
