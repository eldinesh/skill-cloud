---
artifact: usability-test-plan
project: <client codename>
created_by: skillcloud/usability-test-plan v<VERSION>
sources: [ux/design/brief.md, ux/personas/<slug>.md, ux/synthesis/cross-study.md]
status: draft
updated: <yyyy-mm-dd>
---

# Usability Test Plan — <client codename> <design/prototype name>

**Decision this test feeds:** <decision + owner>
**Subject:** <prototype version/link or environment>; all content synthetic; <training/test environment name if in-system>
**Format:** moderated, <remote / on-site>, <25–30 | 45 | 60> min, <n> participants per persona, round <n>

## Risks under test

| # | Risk / hypothesis | Source | Tested by |
|---|---|---|---|
| R1 | <if true, what premise fails> | brief open question / INS-0xx | T1, T3 |
| R2 | | /design-critique finding | T2 |
| — | <explicitly out of scope this round> | | none — out of scope |

## Tasks

### T1 — <short name> (tests R1)
- **Scenario (read aloud):** "<participant-world framing; goal, not steps; no interface labels>"
- **Starting state:** <screen/state>
- **Completion:** <observable definition, decided now>
- **Metrics:** completion · assists (count + trigger quotes) · errors · time band <target> · SEQ
- **Pass threshold:** ≥<n>/<N> unassisted; median SEQ ≥<x>
- **Data:** <synthetic dataset/account name>

### T2 — <short name> (tests R2)
…

## Participants
- Persona: ux/personas/<slug>.md — recruit on behaviors (role, frequency, tool fluency); screener PHI-free
- <n> per persona; overbook 20–30%; scheduling clear of shift change/rounds/med passes; reconfirm day before

## Logistics (clinical)
- Sessions: <length> min; trim tasks to fit, don't rush
- Tech: runs in site-approved browser, no installs; piloted on <site machine / champion laptop> on <date>; VDI latency noted separately from findings
- Interruption protocol: pause without commentary; resume from task start if state lost; annotate, don't fail
- On-site: room via <unit contact>; badge/escort lead time <n> days; infection-control rules acknowledged

## Session script
1. **Intro:** testing the design, not you; you can't fail; we want what's confusing.
2. **Consent (verbatim):** "<recording scope>. <Tier-matched processing sentence per ux/project-context.md and engagement-guardrails>. Voluntary; stop anytime; no job consequences. Okay to proceed?" — notes-only fallback offered.
3. **Think-aloud calibration:** 30-second practice task.
4. **Tasks T1–T<n>:** moderation rules — questions answered with questions; assist only after two failed approaches or on request; neutral acknowledgment after success and failure; probes at task end only.
5. **Debrief:** SUS / UMUX-Lite; "what would you change first?"; thanks; honorarium per compliance guidance.

## Capture and analysis
- Roles: moderator <name>, notetaker <name>, observers <names> — moderator never notes alone if avoidable
- Capture sheet: per task — completion, assists, errors, time, quotes (de-identified live)
- Same-day debrief; notes de-identified on intake (P-numbers continue project sequence) → /interview-synthesis
- Severity scale: blocker / major / minor / cosmetic — defined in advance

## Pilot checklist (day before)
- [ ] Timing fits the slot with margin
- [ ] Prototype works in the approved browser on a representative machine
- [ ] Task wording leaks no interface labels
- [ ] Synthetic data renders correctly everywhere
- [ ] Capture sheet usable at speed
