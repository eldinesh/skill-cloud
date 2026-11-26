---
id: STA-007
type: STA
title: No match: the AI would rather not guess
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-006
role: nurse
state: failure: nothing matches
resolution: open
links:
  - serves SCR-006: words that match no catalogue item
uid: mwx3vt2taf4d7206
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-007 · No match: the AI would rather not guess

## Design

She wrote "the thingy for the line". The AI says "I could not match that to a catalogue item" and "I would rather not guess", and puts catalogue search in the same place, so the way forward is one step away. The words she wrote are kept so stores can map them later. The same screen is the fallback if the suggestion service is down: no AI label and no pretence, just search and send. Open at `?state=STA-007`. Only about 1,100 of 6,400 items have plain names (FND-005), so this will be common until mapping is done (ASM-010); the sessions should measure how often it is.
