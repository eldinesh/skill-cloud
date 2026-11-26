---
id: STA-002
type: STA
title: Missed the cut-off: next round, with the reason
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-002
role: nurse
state: wrong or surprising: approved after the cut-off
resolution: open
links:
  - serves SCR-002: the arrival window when approval lands after the cut-off
uid: mwx3vsv81a0666ba
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-002 · Missed the cut-off: next round, with the reason

## Design

At 15:42 a request approved at 15:41 has missed the 16:00 round (cut-off 15:30). The arrival window turns warning-coloured and reads "Missed the 16:00 round. Tomorrow, 10:00 round (10:00 to 10:30)", with the reason: approved 15:41, cut-off was 15:30. The next-step text says the same in words. This is ticket #4522's case (FND-012: approved 16:02, asked why it missed the round). Open at `?state=STA-002`. She can still ask stores for an update; there is no promise of an urgent run, because we do not know stores can offer one. A person at stores deciding to run an extra round is a question for the client, not a prototype button.
