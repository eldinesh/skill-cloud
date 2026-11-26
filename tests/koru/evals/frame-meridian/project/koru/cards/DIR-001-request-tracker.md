---
id: DIR-001
type: DIR
title: Request tracker
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
seed_author: Owen Hale
chosen:
threshold:
threshold_saved_at:
result:
result_at:
prototype: koru/deliverables/request-tracker/index.html
links:
  - serves HMW-001: seen and which round, without phoning
  - serves HMW-002: rounds and cut-offs shown
  - serves HMW-004: duplicates offered as add to the open request
created: 2026-11-26T05:07:52Z
updated: 2026-11-26T05:07:52Z
---
# DIR-001 · Request tracker

## Core idea

Every request shows, like a parcel tracker, who has seen it, what happens next and when it should arrive, and a duplicate is offered as "add to the open request" instead of a second request. Seed by Owen Hale.

## Hypothesis

We believe requesters will stop phoning, resubmitting and stashing if every request shows who has seen it, the next step and an arrival window, with duplicates offered as "add to the open request", measured by the duplicate rate (36% North, 31% Central, FND-024), supply requests left at Submitted until month end (22%, FND-025) and calls to the stores line (FND-030).

## Where AI sits

Nowhere in release 1. The duplicate offer is a plain rule: same unit, same catalogue item, still open. Status comes from stores marking requests seen and approved. This is the Direction that tests whether visible status alone does the work (INS-001), and it is the control for DIR-002.

## Biggest risk

Status is only as true as what stores marks by hand (ASM-009). A status that is wrong or stale is worse than none (FND-034). The arrival window and the "no update" threshold are our own numbers (ASM-007, ASM-008). If stores cannot keep the status true, this Direction shows a confident lie.

## Test question

Without phoning anyone, can a nurse say whether her request was seen, what happens next and when it arrives, and does she add to the open request rather than send a second one? Includes a task where the request missed the cut-off, and one where nobody has seen it.

## Hard cases

- STA-001 · workaround: an open request for the same item exists (duplicate offered as add to it)
- STA-002 · wrong or surprising: approved after the cut-off, so the window moves to the next round and says why
- STA-003 · wrong: nobody has seen it for hours, so the page says so instead of guessing
- STA-004 · scale: 10,000 open requests in the stores queue, paged, with duplicates flagged for a person to merge
- STA-005 · interrupted: the shared workstation signs out mid-request, the draft is saved

Screens: SCR-001, SCR-002, SCR-003, SCR-004. Prototype: koru/deliverables/request-tracker/index.html. Thresholds are for the design lead to save (`koru threshold DIR-001 --set "…"`); none is set here.
