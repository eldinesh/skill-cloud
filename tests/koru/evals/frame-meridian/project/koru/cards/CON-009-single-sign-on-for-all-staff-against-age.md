---
id: CON-009
type: CON
title: Single sign-on for all staff against agency and travel nurses outside the directory
stage: frame
status: final
version: 1
owner: research owner
author:
signed_by: Tariq Bose (research owner)
signed_at: 2026-11-26T05:06:06Z
resolution: resolved: requester identity without directory accounts; scope Decision follows CON-006
links:
  - cites DAT-013@1: PRD R9 SSO for all staff; open question, do agency nurses need access
  - cites FND-008@1: P02 and tickets 4480 and 4519
  - cites FND-031@1: 27% of North night sessions on the shared login
  - cites DAT-014@1: security will approve time-limited individual accounts if the flow is built
created: 2026-11-26T04:35:20Z
updated: 2026-11-26T05:06:06Z
---
# CON-009 · Single sign-on for all staff against agency and travel nurses outside the directory

## Positions

- **A. Single sign-on for all staff.** PRD R9; the PRD open question "Do agency nurses need access?" is unanswered. Document.
- **B. Agency and travel nurses are not in the staff directory and use a shared unit login.** Tom: about 20% of night shift at North, "a lot of the people raising urgent requests at 3am"; security dislikes the shared login; security will approve time-limited individual accounts if the flow is built (engineer; written note DAT-014).
- **C. What they say and do.** P02 has no login, borrows and asks the charge nurse (FND-008); tickets #4480 and #4519; 27% of North night sessions use the shared login (FND-031, observed). Every approval and accepted AI suggestion must be logged with who accepted it (client.md), which a shared login cannot satisfy.

## Weighing

There is no dispute of fact; the PRD's open question has an evidence answer. Agency nurses need access, they are a large share of the people who raise urgent requests at night, and the audit rule makes a shared login unworkable for accepted AI suggestions and approvals. SSO cannot cover them as stated, so the requirement is a time-limited individual account flow. This is scope that is not in the PRD and competes for the eight weeks (see CON-006). One participant is a travel nurse; the segment is thin in the interviews and strong in the system counts.

Proposed for the person to set: **resolved**, with a scope Decision for phase 1 to follow CON-006.
