---
artifact: rulebook-chapter
id: TEST
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: ship
applies_to: [engineer, quality-reviewer, researcher, checker]
sources: [code.md, accessibility.md, states-and-roles.md, usability-test-plan skill]
status: final
owner: SkillCloud maintainers (project copy: the engineer)
version: 1
updated: 2026-11-26
---

# Testing and proof

## Purpose
Real tools test the work instead of trusting the AI. Two kinds of proof matter: the **machine** proves the build matches the design (every state, every role, accessible, no regressions), and **people** prove the design works for the people it's for.

## Rules

**Machine proof (the deliverable)**
- **TEST-R01** MUST have one Playwright spec per flow (`tests/e2e/<flow-slug>.spec.ts`) that walks the happy path end to end, plus each error, abandon and resume path in the flow doc.
- **TEST-R02** MUST name each test with its flow step and state: `FL-01.S02 · empty · member`. A failing test names the design artifact that broke.
- **TEST-R03** MUST visit every screen × state cell of the hardening matrix by URL scenario (`states.spec.ts`), and assert a state-specific landmark: the empty message, the error recovery action, the AI reason line. "Page rendered" is not an assertion.
- **TEST-R04** MUST run axe (`@axe-core/playwright`, WCAG 2.2 AA tags) on every screen in every state, and fail on any *serious* or *critical* violation. Moderate violations are listed in the build report.
- **TEST-R05** MUST complete each flow keyboard-only (`keyboard.spec.ts`), asserting focus lands where A11Y-R14 says after route change, dialog open and dialog close.
- **TEST-R06** MUST run at 320 px and assert no horizontal scroll on main content (A11Y-R10).
- **TEST-R07** MUST assert that no request leaves the origin (CODE-R21): a Playwright route handler fails the test on any external request.
- **TEST-R08** MUST cover each role in the role × action grid: allowed actions work, disallowed actions are hidden, disabled-with-reason or refused as designed (STR-R05, STR-R06).
- **TEST-R09** Where AI is in the flow, MUST test the AI states by scenario (thinking, low confidence, wrong → override, undo, failed) and the flow with `?ai=off` (AIX-R10).
- **TEST-R10** MUST unit-test pure logic in `src/lib/` (formatting, sorting, eligibility rules) with Vitest. Don't unit-test what an e2e test already proves.
- **TEST-R11** MUST NOT write tests that pass by construction (asserting what the test just set), snapshot whole pages as the only assertion, or sleep for fixed times (wait for a condition).
- **TEST-R12** MUST NOT skip, `.only`, or quarantine a test without a logged decision. A flaky test is fixed or deleted with a reason. It is never retried until green.

**People proof (the design)**
- **TEST-R13** Choosing a direction (Explore) needs a quick test with a person playing the user, at minimum: a 10-minute script from the direction card, one task per job the direction serves, and what to watch for written down before the session.
- **TEST-R14** A simulated user (an AI playing a persona) MAY be used to rehearse a script. Its output MUST be labelled simulated and MUST NOT be logged as user evidence (team charter Art. 4).
- **TEST-R15** Validation of the hardened design before Ship sign-off, when the gate owner asks for it, follows `/usability-test-plan`, with thresholds set **before** sessions.
- **TEST-R16** Findings from any test go into the feedback log or `/interview-synthesis` with P-codes. Evidence enters the same pipeline as discovery.

## Patterns

### State visit
```ts
for (const cell of matrix) {            // generated from ux/harden/hardening-matrix.md
  test(`${cell.step} · ${cell.state} · ${cell.role}`, async ({ page }) => {
    await page.goto(`/${cell.route}?state=${cell.state}&role=${cell.role}`);
    await expect(page.getByTestId(cell.landmark)).toBeVisible();
    await expectNoAxeViolations(page, ['serious', 'critical']);
  });
}
```

### External request guard
```ts
await page.route('**/*', (route) =>
  new URL(route.request().url()).origin === baseOrigin ? route.continue() : route.abort('blockedbyclient'));
```

## Decisions
| Decision | Why | Log |
|---|---|---|

## Checks
| Check | Verifies | How |
|---|---|---|
| **TEST-C01** | R01–R09 | tool: `npm run test:e2e` → summary line pasted in build report |
| **TEST-C02** | R10 | tool: `npm run test:unit` |
| **TEST-C03** | R11–R12 test honesty | person: engineer at Ship review · checker H6 reads two specs in full |
| **TEST-C04** | R13–R14 evidence real | checker H4 q5 |

## Instructions for AI tools
- Generate the state-visit list from the hardening matrix file, not from memory, so coverage follows the design when the design changes.
- Write the assertion for what makes each state *that* state. If you can't name a landmark, the design is missing something, so report it.
- Never edit a test to match broken behaviour. Fix the code or report the design gap.
- When summarising test results, paste the runner's summary line and list every failure by name.

## Owner
Project copy: the engineer · reviewed at every Ship gate.
