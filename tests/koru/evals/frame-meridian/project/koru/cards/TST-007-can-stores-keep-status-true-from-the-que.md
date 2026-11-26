---
id: TST-007
type: TST
title: Can stores keep status true from the queue
stage: explore
status: draft
version: 1
owner: research owner
author:
signed_by:
signed_at:
task: T7 Clear the queue: mark 11 requests seen and decide the repeats, in both queues
hard_case: STA-004 scale: 10,000 open requests
segment: SEG-002
threshold:
threshold_saved_at:
passed:
of:
result:
result_at:
links:
  - tests DIR-001: T7, the queue
  - tests DIR-002: T7, the queue with reasons
uid: mwx42w7d6a0afc47
created: 2026-11-26T05:28:02Z
updated: 2026-11-26T05:28:02Z
---
# TST-007 · Can stores keep status true from the queue

## Scenario

Tests risk R6 in koru/test-plan-explore.md. Prototypes: request-tracker `?screen=SCR-004`, then ask-and-suggest `?screen=SCR-008` (order alternated). Not a nurse task: this decides whether either Direction can keep its status true (ASM-009).

**Read aloud:** "It is 14:20 and 11 requests are waiting. Work through them the way you would. Mark what you have looked at and decide what to do about the ones that look like repeats."

**Complete when** all 11 are marked seen without help and each flagged repeat has a decision with her reason (merge or keep both). In DIR-002 she also says what the "why it is here" column told her.

**Then, 3 minutes on `?state=STA-004`:** "How would you work this if the list were this long?" A layout stress test, not a forecast of volume; her answer is input for Harden.

**Measures:** time to clear · taps per request · merges against keep-both and why · whether she asks for a bulk action, in her words · SEQ.

## Observations

<!-- One line per participant: P01 passed / failed, what happened. -->
