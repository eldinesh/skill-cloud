---
artifact: rulebook-chapter
id: STR
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: harden
applies_to: [information-architect, designer, quality-reviewer, engineer, checker]
sources: [delivery-system.md §2 Harden, handoff-spec Step 3 state matrix]
status: final
owner: SkillCloud maintainers (project copy: the design lead)
version: 1
updated: 2026-11-26
---

# States, roles and edge data

## Purpose
A design holds up only when every screen has been designed for every state it can be in, every role that can reach it, and the data it will actually meet. Harden is where prototypes break, so this chapter is how we break them first.

## Rules

**States**
- **STR-R01** MUST design these state classes for every screen in the flow:
  - **empty**: first use, and cleared or filtered to nothing
  - **loading**: first load, and refresh
  - **error**: recoverable, and fatal
  - **success**
  - **partial**: some data failed, or is still arriving
- **STR-R02** MUST add, where they apply:
  - **permission-denied** or read-only
  - **offline**, or a connection lost mid-task
  - **stale or concurrent edit**: someone else changed it
  - **timeout or session expiry**, saying what survives
  - **interrupted and resumed**, with where the person lands
- **STR-R03** MUST model each screen's states as an explicit state machine: states, the events that move between them, and guards. Impossible combinations (loading and error at once) are ruled out by design, and every state has a way out. No dead ends.
- **STR-R04** MUST give every error state three things: what happened in the person's terms, what they can do now, and what was kept. A bare error code is not a design.

**Roles and permissions**
- **STR-R05** MUST list every role that can reach each screen, and for each role every action: **see · create · change · undo/delete · approve**. Each cell says allowed, hidden, disabled-with-reason, or ask-for-access.
- **STR-R06** MUST NOT rely on hiding as the only control for something the role must not do. The design states what happens if the role reaches it anyway (a deep link, a shared URL).
- **STR-R07** MUST design how a person learns *why* they can't do something, where knowing helps them get it done ("Only space admins can release rooms. Ask Facilities."). Hide where knowing doesn't help.
- **STR-R08** MUST record who did what, where the domain needs accountability: an audit trail for clinical, financial and admin actions, and every AI action (AIX-R06).

**Edge data**
- **STR-R09** MUST test every screen with:
  - **none**: zero items
  - **one**: a single item, and a group of one
  - **typical**
  - **a lot**: 10× typical, the longest list, a year of history
  - **long**: the longest realistic names and values, wrapping, truncation with full value reachable
  - **odd**: missing optional fields, special characters, very large and very small numbers, mixed units, time zones
- **STR-R10** MUST design bulk actions wherever a person would otherwise repeat a single action more than a few times, with partial success handled ("8 released, 2 couldn't be: in use").
- **STR-R11** MUST use synthetic data shaped like the real thing. Use realistic names from the project glossary's codenames, plausible values, and the real distribution: some empty fields, one huge outlier. Never use lorem ipsum, never "User 1", never real records.

**System fit**
- **STR-R12** MUST check each flow against the product as a whole: the same patterns for the same problems, no contradiction of other flows, and navigation that is consistent. A deliberate deviation is a decision-log entry.

## Patterns

### The hardening matrix (one per flow)
Rows are screens × states. Columns are what shows, the copy reference, actions available per role, the AI state where present, and the edge data tested. Every cell is filled, a dash means "designed and linked", and TBD is not allowed. Template: `/harden-review` resources.

### Role × action grid (one per object)
| Object: Booking | Member | Admin | Assistant (AI) |
|---|---|---|---|
| see | own + team's | all | own context |
| create | ✓ | ✓ on behalf | after confirm (AIX-R02) |
| change | own, until start | all | ✗ |
| undo/delete | own, one tap | all, with reason | own actions, within 10 min |
| approve | — | releases | ✗ |

### Error message anatomy
"Couldn't book Room 4: it was taken a moment ago. Here are two free rooms nearby. Your meeting details are saved." (What happened · what now · what's kept.)

## Decisions
| Decision | Why | Log |
|---|---|---|

## Checks
| Check | Verifies | How |
|---|---|---|
| **STR-C01** | R01–R02 every state class on every screen | /harden-review matrix · checker H5 q1 · engineer: e2e test per state (TEST-R03) |
| **STR-C02** | R03 no dead ends | matrix "way out" column · person: design lead |
| **STR-C03** | R05–R07 role grid complete | /harden-review · checker H5 q1 |
| **STR-C04** | R09 edge data | prototype review bar data-volume switch · engineer: fixture sets per volume |
| **STR-C05** | R11 synthetic data | tool: `skillcloud-check pii <prototype or deliverable>` |
| **STR-C06** | R12 system fit | person: design lead at the Harden gate |

## Instructions for AI tools
- When asked for "the screen", produce the screen *and* its state list. Never hand over only the happy path.
- Fill the hardening matrix cell by cell. When you don't know what a cell should be, write the question and who could answer it. Don't invent a behaviour.
- When generating fixture data, generate four sets (none, one, typical, a lot) and include the longest realistic value for every text field.
- If a state can't be designed because the system can't support it (no partial data from the API), say so in feasibility. Don't drop the state silently.

## Owner
Project copy: the design lead · reviewed at every Harden gate.
