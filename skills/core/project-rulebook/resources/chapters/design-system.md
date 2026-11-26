---
artifact: rulebook-chapter
id: DSY
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: all
applies_to: [designer, quality-reviewer, engineer, checker]
sources: [delivery-system.md §3, component-spec skill, figma-hygiene skill]
status: final
owner: SkillCloud maintainers (project copy: the design-system owner, or the design lead)
version: 1
updated: 2026-11-26
---

# Design system and tokens

## Purpose
Everything we explore and ship looks like the real product, because it is built from the real product's tokens and components. When there is no system yet, we start from neutral tokens and grow the system out of the chosen direction, instead of inventing a new one per screen.

## Rules

**Which situation are we in**
- **DSY-R01** MUST record the design-system situation in `ux/project-context.md`: **library in code** (repo and package), **Figma library only** (file and variables), or **none yet**, with where it lives and who owns it.
- **DSY-R02** Library in code: MUST use its components and tokens. A component that doesn't exist in the library is a **candidate**, logged with a decision before it's built.
- **DSY-R03** Figma library only: MUST read variables and components through the Figma connector (or an export) into the project's tokens file. Names match the library's.
- **DSY-R04** None yet: MUST start from `starter-tokens.css` (neutral, accessible, product-like). When a direction is chosen, its tokens become `ux/design/tokens.css` and `ux/design/design-system.md`, with a named owner. New components are logged as library candidates.

**Tokens**
- **DSY-R05** MUST use tokens for colour, type, spacing, radius, elevation, motion and z-index. No raw hex, rgb, px spacing or ms durations in components. The only place raw values live is the tokens file.
- **DSY-R06** MUST name tokens by purpose (semantic), not appearance: `--color-text-danger`, not `--red-600`. Semantic tokens map to primitives in one place.
- **DSY-R07** MUST verify every text/background and component/background semantic pair against A11Y-R01, with the ratio recorded next to the pair in the tokens file.
- **DSY-R08** MUST NOT add a token to fix one screen. A missing token goes on the token-request list with its use case. The design-system owner decides.
- **DSY-R09** MUST support the themes the product needs (light, dark or high contrast) by remapping semantic tokens, never by per-component overrides.

**Components**
- **DSY-R10** MUST reuse before creating. Search the library for the job the component does, not its look. A variant of an existing component beats a new one.
- **DSY-R11** MUST specify a new or changed component with `/component-spec`: anatomy, variants, every state (STR-R01), keyboard, accessible name, tokens used, do and don't.
- **DSY-R12** MUST keep names identical across Figma, code and specs. One name per thing.
- **DSY-R13** MUST record every deviation from the library (a one-off spacing, a modified component) as a decision with a reason and an owner. Undocumented deviation is design debt by definition.

## Patterns

### Component map (Explore, library in code)
| Screen element | Library component | Variant | Notes |
|---|---|---|---|
| Room list row | `ListItem` | `interactive` | trailing slot for capacity badge |
| Suggestion banner | — (candidate) | — | logged as D-0nn; closest is `Callout` |

### Tokens file layout
Primitives first, then semantic, then component-level aliases only where a component needs a stable hook. Contrast ratios go in comments on semantic pairs.

## Decisions
| Decision | Why | Log |
|---|---|---|

## Checks
| Check | Verifies | How |
|---|---|---|
| **DSY-C01** | R05 no raw values | tool: `npm run check:tokens` in the deliverable; for prototypes, `skillcloud-check tokens <file>` |
| **DSY-C02** | R07 pairs verified | tool: `skillcloud-check contrast` per pair |
| **DSY-C03** | R02/R10 reuse; candidates logged | /harden-review rulebook check · person: design-system owner |
| **DSY-C04** | R12 names match | /handoff-spec, /figma-hygiene |
| **DSY-C05** | R13 deviations logged | checker H5 q5 |

## Instructions for AI tools
- Before styling anything, find out which situation the project is in (project-context). With a library, read its tokens and component list first. Don't approximate them.
- Write styles only with `var(--token)`. If you need a value that isn't a token, stop, put it on the token-request list, and use the nearest token with a `/* token-request: … */` comment.
- When a screen needs something the library lacks, say "candidate component" in your output. Never silently build a one-off.
- Explorations must look like the real product: the real type scale, real spacing and real components. No grey boxes.

## Owner
Project copy: the design-system owner (or design lead if none) · reviewed at Harden.
