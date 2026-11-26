---
id: TST-005
type: TST
title: Does a nurse catch an unclear suggestion before sending
stage: explore
status: draft
version: 1
owner: research owner
author:
signed_by:
signed_at:
task: T5 Unclear words: ask for medium gloves for a patient with a latex allergy
hard_case: STA-006 wrong or unclear: the words fit four items
segment: SEG-001
threshold:
threshold_saved_at:
passed:
of:
result:
result_at:
links:
  - tests DIR-002: T5, gloves medium fits four items
uid: mwx42w3qd24c4c6d
created: 2026-11-26T05:28:02Z
updated: 2026-11-26T05:28:02Z
---
# TST-005 · Does a nurse catch an unclear suggestion before sending

## Scenario

Tests risk R4 in koru/test-plan-explore.md. Prototype: ask-and-suggest, default Ask screen; she types her own words. If she writes "nitrile" the case does not trigger: rerun with `?state=STA-006`.

**Read aloud:** "You need medium gloves for a patient with a latex allergy. Ask for them."

**Complete when** she sends nitrile or vinyl, not latex, after noticing that the AI did not choose for her. A latex request sent is a blocker.

**Measures:** item sent · saw the "Not sure" message, yes or no · time · SEQ · asked at task end: "Did the AI make a choice for you?"

## Observations

<!-- One line per participant: P01 passed / failed, what happened. -->
