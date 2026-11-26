---
artifact: check-report
project: <project>
created_by: skillcloud/sc-checker v<VERSION>
stage: <stage>
job: <J-nnn>
protocol: <H0–H6>
sources: [<inputs received>, <work under review>]
status: draft
updated: <yyyy-mm-dd>
---

# Check <J-nnn>-C — <protocol name>

**Verdict:** pass | pass-with-notes | fail
**Blockers:** <n> · **Majors:** <n> · **Minors:** <n>

## Tool output (literal)

```
<paste each command and its output; "not run: <reason>" where a tool could not run>
```

## Findings

| ID | Severity | Finding | Evidence (file:line or tool line) | Rule / protocol question | Suggested owner |
|---|---|---|---|---|---|
| F1 | blocker | Quote attributed to P04 not in P04.md | `trace: QUOTE-MISSING ux/synthesis/interview-synthesis.md:41 P04` | Charter 3.3 · H1 | synthesiser |

## Questions I could not answer from the inputs

- <question> — <who could answer>

## What I did not check, and why

- <scope I skipped or tool I couldn't run>
