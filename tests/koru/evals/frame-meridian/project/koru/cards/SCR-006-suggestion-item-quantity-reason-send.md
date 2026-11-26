---
id: SCR-006
type: SCR
title: Suggestion: item, quantity, reason, send
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
flow_step: 2
ds_version: 1.4.2
prototype: koru/deliverables/ask-and-suggest/index.html
links:
  - implements DIR-002: one tap sends, person stays in charge
created: 2026-11-26T05:08:01Z
updated: 2026-11-26T05:08:01Z
---
# SCR-006 · Suggestion: item, quantity, reason, send

## Purpose

The AI's suggestion: catalogue item (plain name beside the catalogue name), quantity she can edit, how sure it is, and why (what it matched, her unit's history). One tap sends. The AI asks instead of choosing when words fit several items, steps back when nothing matches, and flags a quantity far above usual without blocking it. Nothing is ordered: it becomes a request stores handles as usual (FND-035). Hard cases: STA-006, STA-007, STA-008, STA-009.

## Elements

| Element | Class | Note |
| --- | --- | --- |
| AISuggestion | new | The only AI pattern; labelled as AI, always with a reason (INS-004, HMW-012). States: proposed, ambiguous, low confidence, unavailable, accepted, undone. |
| Confidence | new | Words, not a percentage: high, check me, not sure. |
| Explanation | new | "Why this", always visible. |
| TextInput (quantity) | use | Editable; "use what I wrote" button when the AI changed it. |
| Radio | use | Candidate list when the words are ambiguous; no default, so send waits for her choice. |
| ItemSearch | new | The fallback when nothing matches or she says "not this item". |
| DuplicateOffer | new | As SCR-003. |
| ArrivalWindow | new | Estimate before sending. |
| Alert | extend | Info variant for the far-above-usual note. |
| Button | use | Primary send; disabled until a choice when ambiguous. |
