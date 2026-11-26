---
id: SCR-005
type: SCR
title: Ask: say what you need
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 1
ds_version: 1.4.2
prototype: koru/deliverables/ask-and-suggest/index.html
links:
  - implements DIR-002: the nurse types in their own words
created: 2026-11-26T05:08:01Z
updated: 2026-11-26T05:08:01Z
---
# SCR-005 · Ask: say what you need

## Purpose

One box: the nurse writes what she needs in her own words, with a quantity if she has one. She can skip to catalogue search. An empty ask gets an error she can hear and see. Hard case: STA-010 (signed out mid-sentence, words saved).

## Elements

| Element | Class | Note |
| --- | --- | --- |
| TextArea | new | Meridian has a single-line input only. States: default, focus, filled, error, disabled. |
| Button | use | Primary Suggest; ghost "search the catalogue instead". |
| Modal | extend | Sign-out dialog, as SCR-003. |
