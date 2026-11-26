---
id: STA-010
type: STA
title: Signed out mid-sentence: words saved
stage: harden
status: draft
version: 1
owner: design lead
author:
signed_by:
signed_at:
screen: SCR-005
role: nurse
state: interrupted: shared workstation signs out
resolution: open
links:
  - serves SCR-005: the shared workstation times out
uid: mwx3vt861216bc53
created: 2026-11-26T05:22:31Z
updated: 2026-11-26T05:22:31Z
---
# STA-010 · Signed out mid-sentence: words saved

## Design

Mid-sentence ("gloves med"), the shared workstation signs out after 10 minutes idle (HMW-008, FND-009). A modal says "You were signed out", shows what she wrote and says nothing was sent. "Sign in again and continue" returns her to the same text; "Start again" clears it. Open at `?state=STA-010`. Same behaviour as STA-005, but what is saved is free text, which may contain patient details she should not have typed. Whether a saved draft of free text is allowed to sit on a shared workstation is a privacy question for the client's security team, and Harden should not leave it to the prototype.
