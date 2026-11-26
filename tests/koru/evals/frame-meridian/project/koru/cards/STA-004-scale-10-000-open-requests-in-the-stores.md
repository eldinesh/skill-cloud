---
id: STA-004
type: STA
title: Scale: 10,000 open requests in the stores queue
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-004
role: stores
state: scale: 10,000 open requests
resolution: open
links:
  - serves SCR-004: queue at ten thousand rows
uid: mwx3vsy94c79c325
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-004 · Scale: 10,000 open requests in the stores queue

## Design

The stores queue holds 10,000 synthetic open requests across 60 units; about a third are marked as repeats of an earlier request from the same unit. The page shows 50 rows with the total, previous/next, and filters for "not seen yet" and unit; each row has its own "Mark R-… seen" and, for a repeat, "Merge into R-…" and "Keep both". Real volume is 60 to 80 overnight requests (FND-013); 10,000 is a stress test of the layout, not a forecast. Open at `?state=STA-004`. Not solved here, for Harden: sort and search over 10,000, bulk mark-seen, whether stores works by exception ("only show what is stale"), and the cost of marking each request by hand (ASM-009).
