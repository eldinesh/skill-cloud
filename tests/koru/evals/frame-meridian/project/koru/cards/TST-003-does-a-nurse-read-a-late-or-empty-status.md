---
id: TST-003
type: TST
title: Does a nurse read a late or empty status correctly
stage: explore
status: draft
version: 1
owner: research owner
author:
signed_by:
signed_at:
task: T3 It has not arrived: read a request that missed the cut-off, and one nobody at stores has seen
hard_case: STA-002 missed the cut-off; STA-003 nobody has seen it
segment: SEG-001
threshold:
threshold_saved_at:
passed:
of:
result:
result_at:
links:
  - tests DIR-001: T3, missed cut-off and unseen request
uid: mwx42vzt7c163f09
created: 2026-11-26T05:28:01Z
updated: 2026-11-26T05:28:01Z
---
# TST-003 · Does a nurse read a late or empty status correctly

## Scenario

Tests risk R3 in koru/test-plan-explore.md. Prototype: request-tracker, `?state=STA-002` then `?state=STA-003`.

**Scenario A, read aloud:** "It is 15:42. Your dressing request was approved a minute ago. Your patient needs it at 16:15. What do you expect, and what would you do?" Complete when she says it will not come on the 16:00 round and names tomorrow's 10:00 round.

**Scenario B, read aloud:** "Your saline request was sent at 10:20 and it is now 14:20. What is its status, and do you trust it?" Complete when she says nobody at stores has seen it, that the screen cannot be relied on, and picks an action other than waiting or resubmitting.

**Measures:** completion A and B · the action she picks (ask stores, phone, borrow, resubmit; count the workarounds) · trust in B, 1 to 7 · SEQ. Believing an unseen request is on its way is a blocker.

## Observations

<!-- One line per participant: P01 passed / failed, what happened. -->
