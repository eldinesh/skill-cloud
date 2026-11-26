---
id: CON-003
type: CON
title: Who orders: AI alone, AI with a manager's approval, or a person?
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:05Z
resolution: client: Dana decides with Raj and Tom; Explore carries AI-suggests-with-reason
links:
  - cites ASM-006@1: position A, staff will accept AI ordering
  - cites ASM-004@1: position A, prediction can prevent stockouts
  - cites FND-036@1: position B, Raj and the 2022 pilot
  - cites FND-006@1: position B, P01 and P03
  - cites FND-035@1: position C, no PO API, ERP control over 500 USD
  - cites FND-034@1: position C, 02:00 stock extract
  - cites FND-038@1: Dana, Raj, Marcus name different results
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:05Z
---
# CON-003 · Who orders: AI alone, AI with a manager's approval, or a person?

## Positions

- **A. AI orders by itself.** Brief ("predict what units will need and order it automatically"); PRD R3 ("no human approval needed for predicted orders"); Dana at kick-off ("I want AI doing the ordering"); earlier synthesis opportunity "remove manual approvals using AI". Document and stakeholder say-so.
- **B. AI suggests, a person decides.** Raj (spend rose 19% in the 2022 pilot, FND-036, stakeholder, figure unverified); Marcus ("If it suggests, fine. If it decides, they'll work around it"); P01 and P03 when asked (FND-006, attitude, prompted); P03 lived the pilot: "three months returning stock".
- **C. The system cannot place orders.** The ERP has no purchase-order API; orders go in a nightly EDI file; lines over 500 USD need ERP approval; the buildable version is an AI suggestion approved by a materials manager in one click that lands in tonight's file (FND-035, engineer, matches the written engineering note DAT-014).

## Weighing

For feasibility the engineer decides, and C settles that position A is not buildable as written, whatever anyone prefers: nothing reaches the supplier faster than the nightly file, and the ERP control cannot be bypassed from our side. B then matches C. The two observed attitudes (P01, P03) were prompted with "suggest" as the premise; nobody was asked about full automation without that framing.

The open part is not technical. Dana's want is visible AI in operations and no stockouts, and Dana is likely to hear "no AI" (Priya to Tom: "Dana's going to hear "no AI"."). Tom's reply is the opening: "It's still AI. It just doesn't spend money by itself." This needs the client conversation, with the pilot numbers, not a design decision. Also open: ASM-004, whether history can predict at all (phone requests missing).

Proposed for the person to set: **taken to the client** (Dana, with Raj and Tom). Explore carries a Direction where AI suggests with reason and one-click approval.
