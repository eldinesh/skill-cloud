---
id: IDE-004
type: IDE
title: Block duplicate requests (PRD R7)
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:38Z
from: Product owner (PRD R7)
links:
  - cites DAT-013@1: PRD R7
  - cites INS-001@2: duplicates follow silence
  - cites FND-024@1: duplicate rate 36% North, 31% Central
  - cites CON-008@1: flag and merge against block
  - cites PRB-002@1: the Problem the duplicates belong to
created: 2026-11-26T05:03:15Z
updated: 2026-11-26T05:06:38Z
---
# IDE-004 · Block duplicate requests (PRD R7)

## Idea

Duplicate requests are blocked (PRD R7).

## Reverse trace

Implies the Problem of duplicates, which is evidenced: 36% at North and 31% at Central (FND-024), and they follow silence after submitting (INS-001, medium). A block would stop a requester who cannot tell the first request was seen from asking again, so the evidence points to making status visible first. The proposed resolution is flag and merge, with the rate as a Steer metric (CON-008). Held as an idea; the Brief carries a flag, not a block.
