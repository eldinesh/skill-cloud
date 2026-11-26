---
id: STA-008
type: STA
title: Quantity far above usual
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-006
role: nurse
state: wrong: quantity far above what the unit normally uses
resolution: open
links:
  - serves SCR-006: asking for 50 where the unit uses 10 a week
uid: mwx3vt4oc405850a
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-008 · Quantity far above usual

## Design

She wrote "50 sharps containers"; her unit uses about 10 a week. The AI suggests the item and 10, says "Check me: one item fits, but the quantity differs from what you wrote", and explains: "You wrote 50, but your unit used about 10 a week. I suggest 10. You can keep 50." A button "Use 50 as I wrote" sets her number. Above three times weekly use, an info note says the quantity is far above usual and that stores will see it flagged and decide; it does not block (HMW-004: "this unit normally uses 12 a week, they've asked for 50", P03). In the stores queue (SCR-008) the same request shows "Far above usual". Open at `?state=STA-008`. The rule (three times weekly use) is ours. Over-requesting from fear of running out (FND-004) may be a symptom of silence, so a nudge here should not shame.
