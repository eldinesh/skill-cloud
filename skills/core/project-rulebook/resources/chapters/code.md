---
artifact: rulebook-chapter
id: CODE
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: ship
applies_to: [engineer, quality-reviewer, checker, designer]
sources: [delivery-system.md §2 Ship, ship-code scaffold, accessibility.md, design-system.md, states-and-roles.md]
status: final
owner: SkillCloud maintainers (project copy: the engineer)
version: 1
updated: 2026-11-26
---

# Code

## Purpose
The coded deliverable is design delivered as code. An engineer, or their coding agent, builds from it without coming back with questions, because it is typed, tokenised, state-complete, accessible, tested, and honest about what it fakes.

This chapter governs `deliverable/` (Ship). Explore prototypes (`ux/explore/*/prototype.html`) follow the **Prototype** section only.

## Rules

### Stack (default, unless project-context names the client's stack)
- **CODE-R01** Default stack, versions pinned in `package.json` and locked in `package-lock.json`, with the lockfile committed:
  - React + TypeScript (strict) + Vite
  - CSS with custom properties from the tokens file: CSS Modules per component, and no CSS-in-JS runtime
  - Vitest for units
  - Playwright + `@axe-core/playwright` for flows, states, accessibility and keyboard
  - ESLint (typescript-eslint, jsx-a11y, react-hooks)

  The scaffold in `/ship-code` resources is the starting point.
- **CODE-R02** When project-context names a client stack (framework, component library, styling system, test runner), the client's stack wins. Every rule below still applies in its idiom (Vue SFCs, Angular templates, Tailwind mapped to tokens). Record the stack mapping in the build report.
- **CODE-R03** MUST NOT add a dependency without a line in the build report saying what it does, why the platform or existing deps can't, its licence, and its weekly-maintained status. No dependency for something under ~30 lines of code. No packages with install scripts unless the engineer approved them by name.
- **CODE-R04** MUST pin Node in `.nvmrc` and `engines`. MUST NOT need global installs or anything beyond `npm ci` to build.

### Structure
- **CODE-R05** MUST organise by route and component, mirroring the IA:
  ```
  src/
    routes/<node-slug>/        one folder per IA node in scope (N1.2 → routes/bookings-today/)
      <Screen>.tsx             one screen = one route component, named as the flow step
      <Screen>.module.css
    components/<Name>/         shared components, named exactly as the library or spec (DSY-R12)
    data/                      synthetic fixtures + the scenario layer (no network)
    lib/                       pure helpers, typed
    strings/                   all user-facing copy (CNT-R08)
    styles/tokens.css          the only file with raw values (DSY-R05)
    review/ReviewBar.tsx       state / role / data-volume switcher (dev-only)
  tests/e2e/                   one spec per flow + a11y + keyboard
  ```
- **CODE-R06** MUST trace every route component and every test to its IA node and flow step in a header comment: `// FL-01.S03 · N1.2 · ux/structure/flows/book-a-room.md`. Ticket IDs are added when tickets exist.
- **CODE-R07** Files stay small enough to review: components ≲ 200 lines, functions ≲ 40 lines. Past that, split by responsibility, not by line count.

### TypeScript
- **CODE-R08** MUST use `strict: true`, `noUncheckedIndexedAccess: true` and `exactOptionalPropertyTypes: true`. MUST NOT use `any`, `as unknown as`, non-null `!` on data that can be absent, or `@ts-ignore`. `@ts-expect-error` is allowed only with a reason.
- **CODE-R09** MUST model domain objects from the IA object model (`ux/structure/ia.md`) as types in `src/data/types.ts`. The names match the object model. Fields the design treats as optional are optional in the type.
- **CODE-R10** MUST model UI state as a discriminated union per screen (STR-R03), for example `{ kind: 'loading' } | { kind: 'empty' } | { kind: 'error'; message: StringKey; kept: string[] } | { kind: 'ready'; items: Booking[] }`. Never as parallel booleans (`isLoading && isError`). Exhaustive `switch` with a `never` check.

### Components and behaviour
- **CODE-R11** MUST build from the project's library components when one exists (DSY-R02). New components follow their `/component-spec`. One component per spec, same name.
- **CODE-R12** MUST implement every state in the hardening matrix for every screen. A matrix cell with no code is a missing feature, not a polish item.
- **CODE-R13** MUST keep components presentational and push data access into the scenario layer, so states are reachable without a backend.
- **CODE-R14** MUST make every interaction the design specifies work for real: navigation, form validation timing, optimistic update and rollback, undo, confirmation. Where it is faked (no real persistence), it is faked in the scenario layer and listed under *Fakes* in the build report.
- **CODE-R15** MUST implement the AI states (AIX-R09) as explicit states with fixtures, including AI off (AIX-R10). A real model call, if the project uses one in a prototype, goes through a local proxy that holds the key, never through the client.

### Styling
- **CODE-R16** MUST style only with `var(--token)`. No raw hex, rgb, hsl, px spacing, ms durations or z-index numbers outside `tokens.css`. `npm run check:tokens` enforces this.
- **CODE-R17** MUST be responsive at the breakpoints the design names (default 320, 768, 1280). Use layout primitives (grid, flex, `clamp`) and avoid device sniffing. Content reflows at 320 (A11Y-R10).
- **CODE-R18** MUST respect `prefers-reduced-motion` and `prefers-color-scheme` where the token set supports themes (DSY-R09).

### Accessibility (build rules, in full in the accessibility chapter)
- **CODE-R19** MUST meet A11Y-R11 to A11Y-R17: native elements first, accessible names, live regions, focus management on route and dialog, keyboard-complete flows, alt text, `lang` and titles. ESLint jsx-a11y errors fail the build.

### Data, privacy and security
- **CODE-R20** MUST use synthetic data only (STR-R11), from `src/data/fixtures/`, in four volumes (none, one, typical, a lot). Real records, real names and anything copied from a client system are forbidden, even "just to test". `skillcloud-check pii deliverable/src` must pass.
- **CODE-R21** MUST NOT make network calls in the deliverable. No `fetch`, XHR or WebSocket to remote origins, no analytics, telemetry, fonts or CDN assets fetched at runtime. Everything is bundled. API calls are described in the build report's *API assumptions* and simulated in the scenario layer.
- **CODE-R22** MUST NOT contain secrets, keys, tokens or internal URLs. A pre-build scan (`npm run check:secrets`) fails on key-shaped strings.
- **CODE-R23** MUST NOT use `dangerouslySetInnerHTML`, `eval`, `new Function` or inline event-handler strings. User-entered text renders as text.
- **CODE-R24** MUST include a restrictive CSP meta tag in `index.html`: `default-src 'self'`, no `unsafe-eval`, and `connect-src 'self'`.

### Performance budget
- **CODE-R25** Initial JS ≤ 200 KB gzipped for the core flow. No route chunk above 100 KB gzipped. Images sized and lazy below the fold. `npm run build` prints sizes, and the build report records them.
- **CODE-R26** Interactions respond within 100 ms locally. Simulated latency in the scenario layer is explicit (`?latency=slow`) and off by default.

### Prototype (Explore, single file)
- **CODE-R27** An Explore prototype is **one self-contained HTML file** that opens offline: inline CSS and JS, no CDN, no fonts fetched. It uses the project tokens (or starter tokens), real copy and real-shaped synthetic data. It is polished enough to look like the product (no wireframes), and makes no claim to production code quality.
- **CODE-R28** Every prototype carries the **review bar**: a small fixed control, labelled "Review", that switches **state** (the screen's state classes), **role**, and **data volume** (none, one, typical, a lot), and shows the current flow step ID. It is hidden with `?review=off` for client demos. Harden uses the same switches to walk the matrix.
- **CODE-R29** Prototypes use semantic HTML and meet contrast and keyboard basics. Accessibility debt in a prototype is listed in its notes, not hidden.

### Engineering hygiene
- **CODE-R30** MUST pass `npm run check` (typecheck, lint, tokens, secrets, unit, build) and `npm run test:e2e` before the build report is written. MUST NOT weaken a check to make it pass: no disabling a lint rule, skipping a test or loosening `tsconfig` without a logged decision.
- **CODE-R31** MUST write the build report from real command output, pasted and not paraphrased. A check that wasn't run is reported as not run, with the reason.
- **CODE-R32** When the design is wrong or impossible to build as specified, do not "fix" it in code. Report it under *Found outside my lane* (team charter Art. 2) and build what the design says, or stop if it can't be built.

## Patterns

### Scenario layer
`src/data/scenario.ts` reads `?state=`, `?role=`, `?volume=`, `?latency=` and `?ai=off` from the URL (defaults: ready, the primary role, typical, fast, ai on), and exposes typed hooks (`useBookings()`) that return the discriminated-union state for the current scenario. Tests drive states by URL. The review bar writes the same params. One mechanism serves review, test and demo.

### Strings module
`src/strings/en.ts` exports a typed object keyed by flow step (`bookToday.suggestion.why`). Components never contain user-facing literals. Lint forbids JSX text literals outside `strings/`.

### Route header comment
```ts
// FL-01.S02 "Pick a room" · N1.2 bookings/today · ux/structure/flows/book-a-room.md
// States: loading · empty · error · ready · partial · permission-denied · ai-thinking · ai-low-confidence
```

## Decisions
| Decision | Why | Log |
|---|---|---|
| *(e.g. "Client stack: Angular 18 + their Material fork: CODE-R01 replaced, all other rules apply")* | | |

## Checks
| Check | Verifies | How |
|---|---|---|
| **CODE-C01** | R08–R10 types | tool: `npm run check:types` (tsc --noEmit) |
| **CODE-C02** | R19 lint incl. a11y | tool: `npm run check:lint` (zero errors) |
| **CODE-C03** | R16 tokens only | tool: `npm run check:tokens` |
| **CODE-C04** | R22 no secrets | tool: `npm run check:secrets` |
| **CODE-C05** | R21 no network | tool: `npm run check:network` + e2e asserts no external requests |
| **CODE-C06** | R12 every state built | tool: `npm run test:e2e` (`states.spec.ts` visits every matrix cell by URL) |
| **CODE-C07** | R19 a11y per state | tool: `a11y.spec.ts` (axe per screen × state; zero serious/critical) |
| **CODE-C08** | R19 keyboard | tool: `keyboard.spec.ts` (each flow keyboard-only) |
| **CODE-C09** | R20 synthetic | tool: `skillcloud-check pii deliverable/src` |
| **CODE-C10** | R25 budget | tool: `npm run build` sizes vs budget (recorded in build report) |
| **CODE-C11** | R30–R31 honest report | checker H6 re-runs everything; mismatch = blocker |
| **CODE-C12** | R32 no silent design changes | person: design lead reviews the diff against the hardened design |

## Instructions for AI tools
- Start from the scaffold. Read the hardening matrix, the flow and the copy doc before writing a component. Every state you'll need is listed there.
- Write the state union first, then the fixtures for every state and volume, then the component. Tests come with each screen, not at the end.
- When you need a colour, a spacing or a duration, use a token. If none fits, add a `/* token-request */` comment and list it in the build report. Never invent a value.
- Run `npm run check` after each screen, not once at the end. When a check fails, fix the code, not the check.
- If the design has a gap (an unspecified state, an impossible interaction), stop and report it. Do not design in code.
- Paste the literal output of every check into the build report. If something didn't run, say it didn't run.

## Owner
Project copy: the engineer · reviewed at every Ship gate.
