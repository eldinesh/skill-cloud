---
id: ASM-009
type: ASM
title: Stores will mark a request seen as part of their work, so the status stays true
stage: frame
status: draft
version: 1
owner: engagement lead
author:
signed_by:
signed_at:
claimed_by: Both Directions depend on it
links:
  - cites FND-034@1: a wrong status is worse than none
uid: mwx3w0r67140429a
created: 2026-11-26T05:22:41Z
updated: 2026-11-26T05:22:41Z
---
# ASM-009 · Stores will mark a request seen as part of their work, so the status stays true

## Claim

"Seen by" is only true if someone at stores marks it. Both Directions show who has seen a request and when, so both depend on stores doing this step by hand (status is updated by hand today, and nobody owns it). A wrong status is worse than none (FND-034; the Brief names status ownership as open).

## How we would test it

Run the stores queue screen with the materials manager on a real overnight batch (60 to 80 requests) and time the marking. Ask who owns status on a night with one person. If marking costs more than a few seconds a request, the Directions need a bulk or automatic "seen" and the Brief's ownership question goes to the client first.
