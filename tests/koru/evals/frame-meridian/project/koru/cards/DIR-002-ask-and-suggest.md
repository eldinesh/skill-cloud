---
id: DIR-002
type: DIR
title: Ask and suggest
stage: explore
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
seed_author: Lena Park
chosen:
threshold:
threshold_saved_at:
result:
result_at:
prototype: koru/deliverables/ask-and-suggest/index.html
links:
  - serves HMW-012: AI suggestion with its reason, accept or undo, logged
  - serves HMW-005: find an item by plain name
  - serves HMW-001: status follows after sending
created: 2026-11-26T05:07:57Z
updated: 2026-11-26T05:07:57Z
---
# DIR-002 · Ask and suggest

## Core idea

The nurse types what she needs in her own words, the AI suggests the catalogue item and quantity with its reason, one tap sends, and status follows as in DIR-001. Seed by Lena Park.

## Hypothesis

We believe nurses will send a correct request faster, and with fewer calls back from materials about which item is meant (FND-005), if they can say what they need in their own words and get an item and quantity with its reason, with one tap to send and a person always deciding. Measured by time to a sent request, calls back about item names, and the duplicate rate (FND-024).

## Where AI sits

At the front of the request only: it turns free text into a suggested catalogue item and quantity, and shows why (what it matched, the unit's history). A person taps Send. It never orders: it proposes a request that stores handles as usual, and every accepted suggestion is logged with who accepted it (FND-035, HMW-012). Co-pilot, not agent. It is a single ask-and-confirm step, not a chat: CON-004 holds chat as an unsupported form of the need, so this Direction tests suggestion, not conversation.

## Biggest risk

The AI is wrong and the nurse taps through (over-trust), or it works only for the 1,100 of 6,400 items that have plain names (ASM-010). The evidence for AI is two prompted interviewees (INS-004, low confidence). The prototype stands in for the model with fixed rules, so these sessions test the interaction and the trust cues, not accuracy.

## Test question

Does a nurse catch a wrong or unclear suggestion before sending it, and can she send a right one in one tap? Includes tasks where the words fit four items, where nothing matches, and where the quantity is far above usual.

## Hard cases

- STA-006 · wrong or unclear: "gloves medium" fits four items, so the AI asks and does not choose
- STA-007 · failure: nothing matches, so it says so and falls back to catalogue search
- STA-008 · wrong: a quantity far above the unit's usual, flagged for stores, and she can still send it
- STA-009 · workaround: the suggested item is already open for her unit, so the offer is to add to it
- STA-010 · interrupted: the workstation signs out mid-sentence, the words are saved

Screens: SCR-005, SCR-006, SCR-007, SCR-008. Prototype: koru/deliverables/ask-and-suggest/index.html. Thresholds are for the design lead to save (`koru threshold DIR-002 --set "…"`); none is set here. Scale (10,000 rows) is shown in DIR-001's stores queue; DIR-002 reuses the same table pattern and a ten-thousand-row state is for Harden if DIR-002 is chosen.
