---
id: ASM-008
type: ASM
title: Two hours without a first look is the point to say a request has had no update
stage: frame
status: draft
version: 1
owner: engagement lead
author:
signed_by:
signed_at:
claimed_by: Prototype choice (DIR-001, DIR-002); no evidence for the number
links:
  - cites FND-025@1: 22% never updated before month end
uid: mwx3w0pp58b19e6f
created: 2026-11-26T05:22:41Z
updated: 2026-11-26T05:22:41Z
---
# ASM-008 · Two hours without a first look is the point to say a request has had no update

## Claim

After two hours with nobody at stores opening a request, both prototypes label it "No update" and say the status may be out of date. Two hours is a prototype value with no evidence behind it. It matters because 22% of supply requests stay at Submitted until month end (FND-025), so some unseen requests are fine and some are lost.

## How we would test it

Pull Q3 time-to-first-look from UnitDesk for supply requests, by shift. Pick the threshold from that distribution with the materials manager, per shift, since nights have one person on stores.
