---
id: STA-005
type: STA
title: Signed out mid-request: draft saved
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-003
role: nurse
state: interrupted: shared workstation signs out
resolution: open
links:
  - serves SCR-003: the shared workstation times out
uid: mwx3vszp90d75ba2
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-005 · Signed out mid-request: draft saved

## Design

After 10 minutes idle the shared workstation signs out (a security requirement we do not remove: HMW-008, FND-009). A modal says "You were signed out", that the request is saved as a draft (2 boxes of Gloves, nitrile, medium) and that nothing was sent. Actions: "Sign in again and continue" (restores the form) or "Discard draft". The dialog traps focus and closes on Escape. Open at `?state=STA-005`. The prototype keeps the draft in the browser session; where a real draft lives, and whether it follows the person or the workstation, is an engineering question for Harden. Agency and travel nurses with no login of their own (INS-002) are not covered by this prototype.
