# Worked example — insight registry (fully synthetic)

Everything below is fictitious: "Project LANTERN" is an invented codename for an invented client; participants are P-numbers; no real organizations, people, or patient data appear. Use this to calibrate granularity, trend reasoning, and contradiction handling.

---

# Cross-Study Insight Registry — LANTERN

## Studies in corpus

| Study | Method | n | Fieldwork | Synthesis artifact |
|---|---|---|---|---|
| S1 | Generative interviews, nursing + pharmacy | 7 | 2026-02 | ux/synthesis/interview-synthesis.md |
| S2 | Contextual inquiry, two inpatient units | 5 | 2026-04 | ux/synthesis/affinity-map.md |
| S3 | Usability test of intake prototype | 5 | 2026-06 | ux/synthesis/interview-synthesis.md |

## Registry summary

| ID | Claim (short) | Confidence | Trend | Status |
|---|---|---|---|---|
| INS-012 | Order status is lost at role-to-role handoffs | high | ↑ | active |
| INS-013 | Paper lists are the de facto status system | high | ↑ | active |
| INS-014 | Alert volume causes clinicians to disable notifications | moderate | ✗→ split | contradicted |
| INS-015 | Night shift bypasses the system entirely via phone | emerging | → | active |
| INS-016 | Training gaps drive intake errors | emerging | ↓ | weakening |

## Insights

### INS-012 — Order status is lost at every role-to-role handoff because no system view carries it across roles
**Confidence:** high · **Trajectory:** emerging (2026-02) → strengthening (2026-04) → strengthening (2026-06)
**History:** 2026-04: "every handoff" added after S2 observed it in both directions (nurse→pharmacy, pharmacy→nurse).

| Study | Date | Supports | Contradicts | Note |
|---|---|---|---|---|
| S1 | 2026-02 | P01, P03, P05 | — | self-reported in interviews |
| S2 | 2026-04 | P02, P04, P05 | — | observed directly; method triangulation |
| S3 | 2026-06 | P11, P13 | — | reproduced during prototype tasks |

**Implication:** a shared cross-role status surface is the highest-leverage design target in scope.

### INS-014 — Alert volume causes clinicians to disable notifications
**Confidence:** — · **Status:** contradicted as written, split below.

- **For:** S1 — P01, P02 (interviews, 2026-02): both described turning off "everything that beeps".
- **Against:** S2 — P03, P05 (observation, 2026-04): notifications enabled and actively used at shared workstations.
- **Moderator hypothesis:** device context — personal device alerts get disabled; shared-workstation alerts can't be (settings reset per badge tap). Role held constant, so device is the stronger candidate than role.
- **Resolution:** split into INS-017 (personal-device alert disabling, emerging) and INS-018 (shared-workstation alerts persist by policy, emerging). INS-014 retained, marked contradicted, with pointers.

### INS-016 — Training gaps drive intake errors
**Confidence:** emerging · **Trajectory:** emerging (2026-02) → weakening (2026-06)
**Why weakening:** S3 put 5 participants through intake tasks; errors clustered on field-label ambiguity, not knowledge gaps — experienced participants erred identically. Claim survives only if "training" is the moderator, and S3 says it isn't.

## Stale watchlist
- INS-015 — last evidence S1 (2026-02); S2/S3 sampled day shift only. Night-shift inquiry needed before the readout claims coverage.
