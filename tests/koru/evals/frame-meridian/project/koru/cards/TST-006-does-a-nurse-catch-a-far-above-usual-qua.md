---
id: TST-006
type: TST
title: Does a nurse catch a far-above-usual quantity and a no-match
stage: explore
status: draft
version: 1
owner: research owner
author:
signed_by:
signed_at:
task: T6 Too many, and nothing matches: ask for 50 sharps containers, then for a part she cannot name
hard_case: STA-008 quantity far above usual; STA-007 no match
segment: SEG-001
threshold:
threshold_saved_at:
passed:
of:
result:
result_at:
links:
  - tests DIR-002: T6, the AI says it cannot help
uid: mwx42w5j9c7e85ea
created: 2026-11-26T05:28:02Z
updated: 2026-11-26T05:28:02Z
---
# TST-006 · Does a nurse catch a far-above-usual quantity and a no-match

## Scenario

Tests risks R4 and R5 in koru/test-plan-explore.md. Prototype: ask-and-suggest, `?state=STA-008` then `?state=STA-007`.

**Scenario A, read aloud:** "Your unit has run low on sharps containers and you want 50 so you do not run out again." Complete when she notices that the AI suggested 10 and why, and makes a conscious choice (keep 50 or accept 10); record her reason.

**Scenario B, read aloud:** "You need the thingy for the line, the one you clip on the drip stand, and you do not know what it is called." Complete when she finds an item by search, or says she would ask someone, and does not send a wrong item.

**Measures:** the choice and her reason (A) · the recovery path used (B) · assists · errors · SEQ. Over-requesting from fear of running out may come from silence (FND-004), so record the reason in her words before judging the quantity.

## Observations

<!-- One line per participant: P01 passed / failed, what happened. -->
