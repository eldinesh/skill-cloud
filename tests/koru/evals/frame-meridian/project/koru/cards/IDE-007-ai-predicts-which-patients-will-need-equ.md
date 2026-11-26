---
id: IDE-007
type: IDE
title: AI predicts which patients will need equipment at discharge (PRD R15)
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:38Z
from: Product owner (PRD R15)
links:
  - cites DAT-013@1: PRD R15
  - cites INS-003@1: discharge equipment fails at the hand-off, a different problem from prediction
  - cites PRB-004@1: a member's discharge need falls between hospital and plan
  - cites ASM-004@1: prediction from history is unverified
created: 2026-11-26T05:03:17Z
updated: 2026-11-26T05:06:38Z
---
# IDE-007 · AI predicts which patients will need equipment at discharge (PRD R15)

## Idea

AI predicts which patients will need equipment at discharge (PRD R15), so it can be arranged early.

## Reverse trace

Implies the Problem that discharge equipment is arranged late or not at all (PRB-004, INS-003, medium). The evidence is about the hand-off, not about knowing early: no single route, no member ID on 71% of needs, and no confirmation back (FND-014, FND-015, FND-029). 18% of needs are raised after discharge, which prediction might address, but nothing here tests that, and prediction from history is unverified (ASM-004). Held as an idea.
