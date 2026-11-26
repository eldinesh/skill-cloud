---
artifact: hardening-matrix
project: <project>
created_by: skillcloud/harden-review v<VERSION>
stage: harden
sources: [ux/explore/<dir>/prototype.html, ux/structure/flows/<flow>.md, ux/harden/feasibility.md]
status: draft
version: 1
updated: <yyyy-mm-dd>
---

# Hardening matrix · <DIR-x> · <FL-nn> · v<n>

**Summary:** <n> cells · designed <n> · gap <n> · n/a <n> · rules pass <n> / fail <n> · scans run <list> / not run <list>
**Recommendation:** <fix in Harden | send back to Explore: why>

## States per screen
| Step / screen | State | What shows (designed) or what's missing (gap) | Copy ref | Way out | Status |
|---|---|---|---|---|---|
| FL-01.S01 Today | empty | "No rooms free for the rest of today" + tomorrow action | copy/today#empty | → tomorrow | designed |
| FL-01.S01 Today | partial | — (some rooms failed to load) | — | — | **gap**: needs a partial banner and which rooms are missing |
| FL-01.S01 Today | offline | n/a: web app requires connection; error state covers it (D-021) | | | n/a |

## Roles × actions
| Object · action | Member | Space admin | Assistant (AI) | Deep-link behaviour |
|---|---|---|---|---|
| Booking · create | allowed | allowed (on behalf) | after confirm (AIX-R02) | — |
| Room · release | hidden | allowed | ✗ | member deep link → "Only space admins can release rooms" |

## Edge data
| Screen | none | one | typical | a lot | long | odd | bulk |
|---|---|---|---|---|---|---|---|

## AI states
| Screen | thinking | result + why | low confidence | can't help | wrong → correct | override | undo | failed / off |
|---|---|---|---|---|---|---|---|---|

## Accessibility per state (basics; full audit separate)
| Screen · state | Keyboard path | Focus lands | Announcement | Contrast pairs |
|---|---|---|---|---|

## System fit
- <pattern consistency notes; deviations → decision IDs>

## Findings
| ID | Severity | Finding | Where | Rule | Call (fix / ship-note / send-back) | Owner |
|---|---|---|---|---|---|---|
