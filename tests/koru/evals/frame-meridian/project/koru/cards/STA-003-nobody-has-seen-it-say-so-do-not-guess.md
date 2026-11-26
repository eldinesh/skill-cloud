---
id: STA-003
type: STA
title: Nobody has seen it: say so, do not guess
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-002
role: nurse
state: stale or no data: nobody at stores has opened it
resolution: open
links:
  - serves SCR-002: a request nobody at stores has opened
uid: mwx3vswpf66d4407
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-003 · Nobody has seen it: say so, do not guess

## Design

A saline request sent at 10:20 has not been seen by 14:20. The badge reads "No update" (warning), the history says "No one yet. 4 h since it was sent", and an alert says "This status may be out of date. Nobody has marked it seen." The arrival window shows as an estimate, conditional on approval by 15:30. "Ask stores for an update" records the ask in the history without creating a second request. Open at `?state=STA-003`. Why it matters: a status we cannot back is worse than none (FND-034). The two-hour threshold is ASM-008. The prototype does not claim stores has been notified, because we do not know that it can be.
