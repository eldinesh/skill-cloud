---
id: IDE-002
type: IDE
title: AI auto-ordering with no approval for predicted orders (PRD R3)
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:38Z
from: Product owner (PRD R3) and Dana at kick-off ("I want AI doing the ordering")
links:
  - cites DAT-013@1: PRD R3, no human approval for predicted orders
  - cites INS-004@2: two prompted interviewees wanted suggestions with reasons; nobody was asked about ordering alone
  - cites FND-035@1: no PO API; lines over 500 USD need ERP approval
  - cites ASM-004@1: predictions from history can prevent stockouts, unverified
  - cites CON-003@1: who orders, taken to the client
created: 2026-11-26T05:03:13Z
updated: 2026-11-26T05:06:38Z
---
# IDE-002 · AI auto-ordering with no approval for predicted orders (PRD R3)

## Idea

AI predicts what units will need and places orders with suppliers when stock is predicted to run low, with no human approval for predicted orders (PRD R3).

## Reverse trace

