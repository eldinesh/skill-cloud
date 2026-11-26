---
id: ASM-004
type: ASM
title: Predictions from request history can prevent stockouts
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:05Z
claimed_by: Brief; PRD R2 and R3
links:
  - cites DAT-013@1: brief and PRD
  - cites DAT-009@1: Tom says history misses phone requests and item names are free text
  - cites FND-027@1: 68% of recorded stockouts are in 12 items, 71% at nights or weekends
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:05Z
---
# ASM-004 · Predictions from request history can prevent stockouts

## Claim

AI trained on three years of UnitDesk history can predict what units will need and so prevent stockouts (brief, PRD R2 and R3).

## How we would test it

Engineering says the history is missing phone requests, which are the urgent ones, and names are free text and need mapping to catalogue numbers first. Test on the 12 items behind 68% of stockouts: ask Tom for a back-test against ERP usage, and count how many of the 75 stockouts had a phone-only request. The concentration (FND-027) suggests a small, testable set.

