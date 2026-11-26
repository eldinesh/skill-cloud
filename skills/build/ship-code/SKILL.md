---
name: ship-code
version: 1.0.0
bundle: build
stage: ship
description: |
  Deliver the hardened design as code an engineer or coding agent builds from without
  coming back. Typed, tokenised, state-complete, accessible, tested, with no network and
  synthetic data only, under the rulebook's code and testing chapters. Default React + TS +
  Vite scaffold with a scenario layer, review bar, Playwright + axe and token, secret and
  network checks. The client's stack wins when named. Ends with a build report of real output.
  Use when asked to "build it", "code the prototype", "designs as code", "HTML deliverable",
  or "make it buildable".
  Proactively invoke when the Harden gate is signed and no deliverable/ exists. Feeds /ship-tickets. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
grep -H '^status:' ux/harden/*.md 2>/dev/null || echo "HARDEN: none"
ls deliverable/package.json 2>/dev/null && echo "DELIVERABLE: exists" || echo "DELIVERABLE: none"
node --version 2>/dev/null || echo "NODE: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.
- If `NODE: missing`: the default stack needs Node 20+. Say so, and stop until it's installed. Don't fake a build.

## Contract
- **Consumes:** the hardened prototype `ux/explore/<dir>/prototype.html` and `ux/harden/hardening-matrix.md` (required, final, which is the spec of every state), `ux/harden/feasibility.md` (API assumptions, limits), `ux/structure/ia.md` + flows (object model → types, nodes → routes), `ux/design/tokens.css` or the library's tokens, `ux/design/components/*.md`, `ux/design/copy/*.md`, the rulebook (`code`, `testing`, `accessibility`, `design-system`, `states-and-roles`, `ai-experience`), `ux/project-context.md` (always: the stack)
- **Produces:** `deliverable/` (the code) and `ux/ship/build-report.md`
- **Next:** /ship-tickets, since tickets cite the deliverable's routes and states and attach screenshots from it. Then /design-qa-checklist and the Ship gate (an engineer reviews).

# Ship Code

You are a design engineer. You deliver the design as code, which closes the handover gap. The output is not a production app. It is the **truth of the design in code**: every screen, every state, every role, the real tokens and components, accessible, tested, honest about what it fakes. An engineer, or their coding agent, builds the production feature from it without asking what anything should do.

**The rulebook's code chapter is law** (`ux/rulebook/code.md`, or the shipped default at `~/.skillcloud/repo/skills/core/project-rulebook/resources/chapters/code.md`). So is the testing chapter. Read both before writing a line. This skill is the procedure. The chapters are the rules, and their rule IDs are cited below.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain, data rules, **stack** (client framework, component library, styling, test runner, repo conventions), design-system situation, accessibility bar.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed. **Synthetic data only** (CODE-R20). Never copy records, screenshots or payloads from a client system into fixtures.
3. **Readiness gate.** The Harden gate is signed (decisions log). The hardening matrix has no gap cells, or the remaining ones are listed as Ship notes. Tokens exist. If there's a gap cell that's not a Ship note, stop. That's design work, and it goes back to the designer (CODE-R32).

## Step 1: Choose the stack

- **Default** (CODE-R01): copy `resources/scaffold/` to `deliverable/`. It contains React 18 + TypeScript strict + Vite, CSS Modules on token variables, Vitest, Playwright + axe, ESLint (typescript-eslint strict, jsx-a11y strict, react-hooks, no-literals in JSX), and the token, secret and network check scripts, with the CSP added at build. Replace `src/styles/tokens.css` with the project's tokens.
- **Client stack** (CODE-R02): build in their framework and library. Port the *mechanisms*: the scenario layer, review bar, strings module, the e2e state visit, axe, and the token, secret and network checks. Record the mapping, rule by rule, in the build report. Where a rule can't apply as written, write a decision line. Don't skip it silently.
- `npm ci` must be all it takes (CODE-R04). Dependencies beyond the scaffold need a justification line each (CODE-R03).

**Large builds:** past about three screens, the design lead runs the build through sidequest, which comes with SkillCloud. You get one story per flow, tickets cut from the hardening matrix, parallel workers in their own worktrees, and one landed change. Every rule in the code and testing chapters still applies to each worker's ticket. Put "follow `ux/rulebook/code.md` and `testing.md`" in each ticket's brief, and the build report covers what landed.

## Step 2: Model before markup

1. **Types** from the IA object model → `src/data/types.ts` (CODE-R09).
2. **State unions** per screen, from the hardening matrix rows → discriminated unions with exhaustive switches (CODE-R10).
3. **Fixtures** in four volumes, plus the long and odd values (STR-R09) → `src/data/fixtures.ts`.
4. **Scenario layer**: `?state=`, `?role=`, `?volume=`, `?ai=off` (and `?latency=slow` if the design specifies slow states) → `src/data/scenario.ts`. Every matrix cell must be reachable by URL. This one mechanism serves the review bar, the tests and client demos.
5. **Strings** from the copy doc → `src/strings/` (CNT-R08). No literals in JSX, and lint enforces it.

## Step 3: Build screen by screen

For each flow step, in flow order:
- Route component under `src/routes/<node-slug>/`, with the header comment tracing the step, node and flow file and listing its states (CODE-R06).
- Library components where they exist (CODE-R11). New components follow their `/component-spec`.
- Every state in the matrix, including the AI states and AI-off (CODE-R12, R15), and every role's behaviour (STR-R05, R06).
- Accessibility as you go (CODE-R19): native elements, names, focus on route change, live regions for async results, keyboard-complete.
- Feasibility responses visible as designed ("checked 2 min ago").
- **Run `npm run check` after each screen.** Fix the code, never the check (CODE-R30).

## Step 4: Tests (TEST chapter)

- Regenerate `tests/e2e/matrix.ts` from `ux/harden/hardening-matrix.md`: one cell per screen × state × role, each with the landmark that proves the state (TEST-R03).
- `states.spec.ts` visits every cell by URL, asserts the landmark, runs axe (serious and critical fail), and blocks external requests (TEST-R03, R04, R07).
- One flow spec per flow: happy path plus each error, abandon and resume path in the flow doc (TEST-R01, R02).
- `keyboard.spec.ts`: each flow keyboard-only, with focus landings asserted (TEST-R05). Then the 320px reflow (TEST-R06) and the role grid (TEST-R08).
- Unit tests for pure logic only (TEST-R10).

Then run, and keep the literal output:

```bash
cd deliverable
npm ci
npm run check                     # types · lint · tokens · secrets · network · unit · build (+ sizes)
npx playwright install chromium   # once per machine
npm run test:e2e                  # browser download blocked? PW_CHANNEL=chrome, or PW_EXECUTABLE_PATH=<any Chromium-based browser binary>
cd .. && ~/.skillcloud/repo/bin/skillcloud-check pii deliverable/src
```

## Step 5: Build report

Write `ux/ship/build-report.md` from `resources/build-report-template.md`:
- **What's built**: routes ↔ flow steps ↔ IA nodes, and the state coverage table (matrix cells × built × tested).
- **Check results**: the literal summary line of every command above. "Not run: <reason>" where something couldn't run, never omitted.
- **Fakes**: everything simulated (persistence, APIs, AI responses), and how.
- **API and data assumptions**: from feasibility and the scenario layer, marked unconfirmed until an engineer confirms them.
- **Stack mapping** (client stack only), **dependencies added** with justification, **token requests**, **component candidates**, **performance** (bundle sizes vs CODE-R25), and **known gaps**, each linked to a Ship note or a finding.
- **How to run it** in three commands.

Header: `artifact: build-report`, `stage: ship`, `sources:` the matrix, the hardened prototype, tokens, flows, copy, `status: draft`.

## Quality bar

- Every matrix cell is built and has a passing state test. Every flow is keyboard-complete. Axe is clean of serious and critical issues in every state.
- `npm run check` and `npm run test:e2e` are green, with literal output in the report (CODE-R31).
- No raw values outside tokens, no network, no secrets, no real data (tool-verified).
- No design decisions made in code. Gaps are reported, not invented (CODE-R32).
- A coding agent given the repo and the report could build the production feature without asking what any state should do.

## Handoff

End with: `deliverable/` and `ux/ship/build-report.md` (status), coverage (cells built / tested), check summary lines, fakes and assumptions to confirm, and the next step. That is `/ship-tickets` ("tickets cite routes, states and e2e test names, with screenshots from `?state=` URLs"). Suggest, don't auto-run.
