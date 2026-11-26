---
id: ASM-010
type: ASM
title: The AI can map a nurse's own words to a catalogue item using the unit's own history
stage: frame
status: draft
version: 1
owner: engagement lead
author:
signed_by:
signed_at:
claimed_by: DIR-002 depends on it
links:
  - cites FND-005@1: plain names exist for about 1,100 of 6,400 items
  - cites INS-004@2: two prompted interviewees wanted a suggestion with its reason
uid: mwx3w0sl90948980
created: 2026-11-26T05:22:41Z
updated: 2026-11-26T05:22:41Z
---
# ASM-010 · The AI can map a nurse's own words to a catalogue item using the unit's own history

## Claim

Direction 2 assumes the AI can turn "gloves medium" into the right catalogue item and a sensible quantity from the nurse's words and her unit's history. The prototype uses fixed rules to stand in for the model, so nothing about accuracy has been shown. Only about 1,100 of 6,400 items have plain names (FND-005), request history misses phone requests (HMW-004), and the evidence for AI suggestions is two prompted interviewees (INS-004, low confidence).

## How we would test it

Take 100 real free-text requests from UnitDesk (de-identified, per the data rules) and the catalogue mapping engineering can give us. Have two materials staff label the right item for each. Measure how often a model's top suggestion matches, and how often it is wrong without saying so. Do this before any session claims the idea works; sessions with the prototype test the interaction, not the accuracy.
