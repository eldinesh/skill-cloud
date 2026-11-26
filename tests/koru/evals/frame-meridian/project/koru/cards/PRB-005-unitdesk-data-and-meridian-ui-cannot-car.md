---
id: PRB-005
type: PRB
title: UnitDesk data and Meridian UI cannot carry the new screens
stage: frame
status: final
version: 1
owner: engagement lead
author:
signed_by: Nina Alvarez (engagement lead)
signed_at: 2026-11-26T05:06:16Z
kind: foundation
links:
  - cites FND-039@1: library gaps
  - cites FND-005@1: item names
  - cites FND-025@1: stale status
  - cites FND-034@1: 02:00 stock
  - cites INS-004@2: an AI suggestion with its reason needs a pattern the library does not have
  - cites JOB-001@1: status data the job depends on
  - cites JOB-003@1: item names the job depends on
created: 2026-11-26T04:38:30Z
updated: 2026-11-26T05:06:16Z
---
# PRB-005 · UnitDesk data and Meridian UI cannot carry the new screens

## Who

The design and engineering teams that will build the platform, and later teams who inherit it.

## What

Legacy debt the new screens depend on: item names in free text (plain-language names for about 1,100 of 6,400 items); request status updated by hand; stock known as of 02:00 on half the units; Meridian UI missing seven components (and any pattern for an AI suggestion with its reason, INS-004), spacing and type tokens and a success colour, with small-text contrast and modal and tab gaps; a 10-minute idle timeout on shared devices; no identity for agency staff. Evidence: FND-005, FND-025, FND-034, FND-039, FND-040, FND-041, FND-042; koru/design-system.md.

## Wow

The foundation work is named, sized and sequenced before Explore commits to a Direction, so release 1 does not discover a missing table, or a missing catalogue mapping, at build time as release 3.2 did.

Measures: components specified against components needed; share of catalogue items with plain names; who owns status updates.
