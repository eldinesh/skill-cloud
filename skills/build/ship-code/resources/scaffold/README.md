# Deliverable scaffold

The starting point for `/ship-code` (default stack, CODE-R01). Copy this folder to `deliverable/`, swap in the project's tokens, types, fixtures, strings and screens, and keep the mechanisms:

| Mechanism | Where | Rule |
|---|---|---|
| Scenario layer: every state reachable by URL | `src/data/scenario.ts` | code chapter → Patterns |
| Review bar: state · role · data · AI (`?review=off` hides) | `src/review/ReviewBar.tsx` | CODE-R28 |
| Strings module: no JSX literals (lint-enforced) | `src/strings/en.ts` | CNT-R08 |
| Tokens only (script-enforced) | `src/styles/tokens.css`, `scripts/check-tokens.mjs` | CODE-R16 |
| No network, no secrets | `scripts/check-network.mjs`, `scripts/check-secrets.mjs`, CSP at build | CODE-R21–R24 |
| State visit + axe + external-request guard | `tests/e2e/states.spec.ts`, `matrix.ts`, `helpers.ts` | TEST-R03/R04/R07 |
| Keyboard path, focus landing | `tests/e2e/keyboard.spec.ts` | TEST-R05 |

```bash
npm ci
npm run dev                         # http://localhost:5173/?state=empty&role=admin
npm run check                       # types · lint · tokens · secrets · network · unit · build
npx playwright install chromium     # once (blocked? PW_CHANNEL=chrome or PW_EXECUTABLE_PATH=<chromium-based browser>)
npm run test:e2e
```

The example content (the fictional "Deskly" booking tool) exists only to show every mechanism working. Replace all of it.
