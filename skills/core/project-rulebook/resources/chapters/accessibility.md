---
artifact: rulebook-chapter
id: A11Y
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: all
applies_to: [designer, quality-reviewer, engineer, checker]
sources: [WCAG 2.2, accessibility-audit skill, design-brief Step 4 (default bar)]
status: final
owner: SkillCloud maintainers (project copy: the design lead)
version: 1
updated: 2026-11-26
---

# Accessibility

## Purpose
Everything we ship meets the project's accessibility bar, by default **WCAG 2.2 AA**, adding Section 508 or a local equivalent where the industry requires it. It is designed in from Explore and verified with tools and keyboards, not asserted.

## Rules

**Design (Explore and Harden)**
- **A11Y-R01** MUST meet contrast:
  - text, 4.5:1 (large text 3:1)
  - UI components, focus indicators and meaningful graphics, 3:1 against adjacent colours
  Token pairs are verified, not eyeballed.
- **A11Y-R02** MUST NOT convey meaning by colour alone. Status uses colour plus text or an icon with a text alternative.
- **A11Y-R03** MUST make targets at least 24×24 CSS px (WCAG 2.5.8), or spaced so 24px circles don't overlap. Touch-first and gloved or clinical contexts use 44×44.
- **A11Y-R04** MUST give every screen one `h1`, a logical heading order, and landmarks (header, nav, main, footer). The reading order matches the visual order.
- **A11Y-R05** MUST design a visible focus indicator (at least 2px, 3:1 against adjacent colours) and a focus order per screen. Focus is never hidden behind sticky headers (2.4.11).
- **A11Y-R06** MUST give forms visible labels (not placeholder-only), instructions before the field, errors in text tied to the field, and an error summary on submit for long forms. Never clear the person's input on error.
- **A11Y-R07** MUST NOT impose time limits without warning and a way to extend (2.2.1), except where real-time is essential. In that case the design says so.
- **A11Y-R08** MUST respect reduced motion. Nothing flashes more than 3 times a second. Essential motion has a static alternative.
- **A11Y-R09** MUST NOT require dragging without a single-pointer alternative (2.5.7), and authentication must not depend on a cognitive test (3.3.8).
- **A11Y-R10** MUST make content reflow at 320 CSS px with no horizontal scroll for text content (1.4.10), and survive text spacing overrides and 200% zoom.

**Build (Ship)**
- **A11Y-R11** MUST use native HTML elements first (`button`, `a`, `input`, `select`, `dialog`, `details`). Use ARIA only when no native element does the job, and then follow the APG pattern fully: roles, states, keyboard.
- **A11Y-R12** MUST give every interactive element an accessible name that includes its visible label (2.5.3). Icon-only buttons get an `aria-label`.
- **A11Y-R13** MUST announce status changes that happen without focus moving (saved, loading done, AI result ready) through a live region: `polite` by default, `assertive` only for errors that block.
- **A11Y-R14** MUST manage focus on route change (move it to the `h1` or main), on dialog open (into it, and trap it inside) and on close (back to the trigger). Escape closes dialogs and menus.
- **A11Y-R15** MUST make every flow completable with the keyboard alone, in a predictable order, with no keyboard traps.
- **A11Y-R16** MUST give images meaningful `alt`. Decorative images get `alt=""`. Charts get a text or table equivalent.
- **A11Y-R17** MUST set `lang` on the page, a unique `title` per screen, and visible skip-to-main for pages with repeated navigation.

## Patterns

### Status chip
Coloured dot plus a text label ("Overdue"), with the label in the accessible name. Colour is never the only carrier.

### Inline error + summary
The error message sits under the field, linked with `aria-describedby`. On submit with errors, a summary at the top lists each error as a link to its field, and focus moves to the summary.

### AI result announcement
When a suggestion arrives asynchronously, announce "Suggestion ready: Room 4" politely. Don't steal focus.

## Decisions
| Decision | Why | Log |
|---|---|---|
| *(e.g. "Bar raised to 44px targets: tablet use with gloves")* | | |

## Checks
| Check | Verifies | How |
|---|---|---|
| **A11Y-C01** | R01 token contrast | tool: `skillcloud-check contrast <fg> <bg>` per pair in use |
| **A11Y-C02** | R01, R04, R11–R13, R16–R17 automated rules | tool: axe-core per screen *and per state* (`npm run test:e2e`, `a11y.spec.ts`). Zero serious or critical violations. |
| **A11Y-C03** | R05, R14, R15 keyboard | tool: Playwright keyboard path per flow (`keyboard.spec.ts`) + person: one manual pass per flow |
| **A11Y-C04** | R03 target size | /accessibility-audit · axe `target-size` rule |
| **A11Y-C05** | R10 reflow | tool: e2e at 320px viewport, no horizontal scroll on main |
| **A11Y-C06** | screen reader sense check | person: one screen-reader pass of the core flow before Ship sign-off (VoiceOver or NVDA) |

Automated tools catch roughly a third of accessibility issues. Passing axe is necessary, not sufficient. C03 and C06 are people's checks for a reason.

## Instructions for AI tools
- When choosing colours, compute the contrast of each text/background pair you use and write the ratio next to it. Don't pick colours "that look fine".
- When generating markup, reach for the native element first. If you write `role=`, name the APG pattern you're following.
- When a component changes without focus moving, add the live region in the same change. Don't leave it for a later pass.
- When reporting accessibility results, paste the tool output. "Looks accessible" is not a result.

## Owner
Project copy: the design lead · reviewed at every Harden and Ship gate.
