---
artifact: rulebook-check
project: <project>
created_by: skillcloud/harden-review v<VERSION>
stage: harden
sources: [ux/explore/<dir>/prototype.html, ux/rulebook/<chapter>.md]
status: draft
updated: <yyyy-mm-dd>
---

# Rulebook check · <DIR-x> · v<n>

| Chapter | Pass | Fail | n/a |
|---|---|---|---|

| Rule | Result | Evidence (screen · state · element) or n/a reason |
|---|---|---|
| AIX-R03 | fail | FL-01.S03 confirm: no undo after assistant books |
| AIX-R05 | pass | FL-01.S01 suggestion card: "Why: fits 8, has a screen…" |

## Scans
| Scan | Command | Result file |
|---|---|---|
| contrast | `skillcloud-check contrast …` | scans/contrast.txt |
| tokens | `skillcloud-check tokens ux/explore/<dir>` | scans/tokens.txt |
| axe | Playwright / axe CLI per screen × state | scans/axe.txt, or "not run: <reason>" |
