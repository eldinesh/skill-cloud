---
artifact: rulebook-chapter
id: CNT
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: explore
applies_to: [designer, quality-reviewer, engineer, checker]
sources: [ux-writing skill + microcopy patterns]
status: final
owner: SkillCloud maintainers (project copy: the content owner, or the design lead)
version: 1
updated: 2026-11-26
---

# Content

## Purpose
Words in the product are real from the first exploration. They are written in the users' vocabulary, consistent everywhere, and owned in one place so they don't drift between Figma, code and tickets.

## Rules
- **CNT-R01** MUST use real copy from Explore onward. No lorem ipsum, no "Button", no "Title goes here". Rough is fine. Fake is not.
- **CNT-R02** MUST label things in the users' words, taken from research (cite the P-code or source where a term was chosen over an internal one). Internal and system jargon stays internal.
- **CNT-R03** MUST use one term per concept across the product, from the project glossary. Synonyms for the same thing are defects.
- **CNT-R04** MUST lead buttons and links with a verb that says what happens ("Book room", not "Submit" or "OK"). A destructive action names what it destroys.
- **CNT-R05** MUST write errors as: what happened, what to do, what was kept (STR-R04). Never blame the person. Never show raw codes without a human sentence.
- **CNT-R06** MUST write empty states that say why it's empty and what to do next, with the action.
- **CNT-R07** MUST follow the project's voice and registers (project-context → Voice & terminology). In regulated domains, patient-facing or customer-facing language is reviewed by the role the domain requires (clinical, legal).
- **CNT-R08** MUST keep strings in one source: `ux/design/copy/<scope>.md` during design, and a strings module in code. Strings are never duplicated by hand between screens.
- **CNT-R09** MUST design for expansion (+30–40% length for translation) and for truncation, with the full value reachable.
- **CNT-R10** MUST format dates, times, numbers and units for the locale, and say the time zone wherever more than one is possible.

## Patterns
- **Confirmation:** "Booked Room 4, today 3–4pm. [Undo]"
- **Empty:** "No rooms free at 3pm. Try 3:30, or a smaller room. [See 3:30]"
- **Permission:** "Only space admins can release rooms. [Ask Facilities]"
- More: `/ux-writing` resources → microcopy patterns.

## Decisions
| Decision | Why | Log |
|---|---|---|

## Checks
| Check | Verifies | How |
|---|---|---|
| **CNT-C01** | R01 no placeholder copy | tool: `skillcloud-check tokens` also flags `lorem`, `TODO`, `TBD` in prototypes; deliverable `npm run check` |
| **CNT-C02** | R02–R03 vocabulary | /ux-writing · /harden-review rulebook check |
| **CNT-C03** | R07 domain review | person: the role named in project-context |

## Instructions for AI tools
- When writing a label, check the glossary and the research vocabulary first. If users say "room" and the system says "resource", write "room".
- Write the error, empty and permission strings at the same time as the happy-path strings. They're part of the screen.
- Keep every string you write in the copy doc or strings module. Never inline a duplicate.

## Owner
Project copy: the content owner (or design lead) · reviewed at Harden.
