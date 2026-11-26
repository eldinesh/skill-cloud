---
artifact: rulebook-chapter
id: SHIP
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: ship
applies_to: [engineer, designer, quality-reviewer, checker]
sources: [delivery-system.md §2 Ship, handoff-spec skill, ship-tickets skill]
status: final
owner: SkillCloud maintainers (project copy: the engineer)
version: 1
updated: 2026-11-26
---

# Handoff and tickets

## Purpose
Hand over with nothing left to ask. Engineers and their coding agents get the deliverable, tickets they can build from, and a half-page note. Every ticket traces back to a screen, a job and, through them, the evidence.

## Rules
- **SHIP-R01** MUST write one ticket per user story, using the template in `/ship-tickets`:
  - title (verb + object)
  - user story
  - context links (brief, frame or prototype, deliverable route)
  - acceptance criteria as given/when/then, one line each
  - states covered
  - screenshots per state
  - tokens used
  - out of scope
  - open questions
- **SHIP-R02** MUST trace every ticket to at least one flow step (`FL-nn.Snn`) and one job (`JOB-nn`). A ticket with no job is a feature nobody asked for, so it needs a decision.
- **SHIP-R03** MUST write acceptance criteria that are testable by someone who never saw the design: observable, specific, with no "intuitive", "fast" or "user-friendly". Each criterion maps to an e2e test name where one exists.
- **SHIP-R04** MUST cover every state in the hardening matrix across the ticket set. The tickets' *States covered* fields together equal the matrix.
- **SHIP-R05** Ticket size: 3–5 tickets for one flow is normal. A ticket a developer can't finish in about two days is split by user-visible outcome, not by layer.
- **SHIP-R06** MUST state API and data assumptions: endpoint shape, freshness, error modes. These come from the scenario layer and the feasibility notes, and are marked as assumptions until an engineer confirms them.
- **SHIP-R07** MUST draft tickets locally (`ux/ship/tickets/`) first. Creating them in a tracker (Jira, Linear) is outward-facing and happens only after the person says so, with the exact tickets shown.
- **SHIP-R08** MUST NOT finalise tickets before the design passes Harden. Drafting user stories during Explore and Harden is encouraged.
- **SHIP-R09** The handoff note fits half a page: what's in the deliverable, what's not, the decisions engineers must know (`D-nnn`/`DEC-nn`), the fakes, and who to ask.
- **SHIP-R10** A pull request into the client's codebase is a separate engagement step. It needs codebase access, the client's component library, and a reviewer on their side. It is not part of Ship by default.

## Patterns

### Good acceptance criteria
- Given rooms are free, when a member opens Today, then one suggestion shows above the list with its reason. *(e2e: FL-01.S02 · ready · member)*
- Given no room fits, when a member opens Today, then no suggestion shows and the list shows "No room fits 8 at 3pm" with a 3:30 option. *(e2e: FL-01.S02 · empty · member)*

### Bad acceptance criteria
- "Suggestion works correctly." · "Page loads fast." · "Accessible."

## Decisions
| Decision | Why | Log |
|---|---|---|

## Checks
| Check | Verifies | How |
|---|---|---|
| **SHIP-C01** | R01–R04 tickets complete and traced | checker H6 q2–q3 · `skillcloud-check trace ux/ship/tickets/*.md` |
| **SHIP-C02** | R03 testable | checker H6 q1 (two hardest tickets) |
| **SHIP-C03** | R07 nothing sent unseen | person: whoever approved the tracker push, logged |
| **SHIP-C04** | the engineer could build it | person: engineer's "still need to ask" list, empty or answered |

## Instructions for AI tools
- Write acceptance criteria from the hardening matrix rows, one row per criterion, so states can't be forgotten.
- Link screenshots taken from the running deliverable at the exact state (`?state=`), not mockups.
- Before calling the ticket set done, list the questions an engineer would ask about the two hardest tickets. If the list isn't empty, the tickets aren't done.

## Owner
Project copy: the engineer · reviewed at the Ship gate.
