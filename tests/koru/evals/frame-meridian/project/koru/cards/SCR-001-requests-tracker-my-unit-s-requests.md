---
id: SCR-001
type: SCR
title: Requests tracker: my unit's requests
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 1
ds_version: 1.4.2
prototype: koru/deliverables/request-tracker/index.html
links:
  - implements DIR-001: the list every requester opens first
created: 2026-11-26T05:07:59Z
updated: 2026-11-26T05:07:59Z
---
# SCR-001 · Requests tracker: my unit's requests

## Purpose

The list a nurse opens first. Every open request from her unit with its status, who at stores has seen it and when, the next step and an arrival window, so she does not have to phone (HMW-001, HMW-002, JOB-001). Open and delivered-today tabs.

## Elements

| Element | Class | Note |
| --- | --- | --- |
| DataTable (request list) | new | One table for requests; today three apps each built their own (FND-041). Stacks to cards under 720 px. |
| StatusBadge | new | Sent, Seen, Approved, On the round, Delivered, No update. Text always, never colour alone. |
| Tabs | extend | Needs arrow-key support, which Meridian's tabs lack. |
| Button (New request) | use | Primary. |
| Avatar | use | Header only. |
