# Heuristics reference — Nielsen's 10 + the healthcare set

Use as the walkthrough checklist. For each heuristic: what to check, and the violation signals that show up most in healthcare-enterprise software.

## Nielsen H1–H10

| # | Heuristic | What to check | Common healthcare-enterprise violations |
|---|---|---|---|
| H1 | Visibility of system status | Loading, saving, sync, selected, in-progress states; feedback within ~400ms | Silent background sync of orders; "did my note save?"; stale data with no timestamp |
| H2 | Match between system and real world | Labels in user vocabulary; ordering matches workflow, not schema | Billing codes as labels; admin jargon for clinical users; alphabetical lists where workflow order is expected |
| H3 | User control and freedom | Undo, cancel, back, escape from every flow | Un-cancelable wizards; correcting a charted entry takes an addendum workflow nobody remembers |
| H4 | Consistency and standards | Same action, same place, same name everywhere; platform conventions | Three save behaviors across modules; icon meaning drifts between EHR-embedded and standalone views |
| H5 | Error prevention | Constraints, good defaults, confirm-before-harm | Free-text dose fields with no range check; look-alike patient rows inviting wrong-chart entries |
| H6 | Recognition rather than recall | Options visible; context carried forward | Codes memorized from a laminated cheat sheet; data from screen 1 retyped on screen 3 |
| H7 | Flexibility and efficiency | Shortcuts, bulk actions, sticky defaults for the thousandth-shift user | No keyboard path through high-volume queues; one-at-a-time actions on 40-row worklists |
| H8 | Aesthetic and minimalist design | Every element earns its place; density appropriate to posture | Dashboard widgets nobody asked for crowding the worklist; banner stack pushing content below the fold |
| H9 | Recognize, diagnose, recover from errors | Plain-language errors: what happened + what to do; cheap recovery | "Error 500 — contact administrator"; validation that clears the form |
| H10 | Help and documentation | Contextual, task-shaped help; searchable | 90-page PDF behind a "?" icon; tooltips that restate the label |

## Healthcare heuristics HH1–HH5

### HH1 — Interruption tolerance
Clinical work is interrupt-driven; assume every task will be abandoned mid-step at least once.
- [ ] In-progress work survives navigation away, lock screen, and session timeout
- [ ] Returning user gets a "resume where you left off" cue, not a blank slate
- [ ] Long forms save incrementally; no all-or-nothing submits
- [ ] Re-entry shows what was already done (checked steps, drafted fields)
- **Violation signals:** modal flows that reset on blur; timeout discards a half-written note; no draft state anywhere

### HH2 — Alarm and alert fatigue
Every alert you add competes with hundreds the user already ignores.
- [ ] Alerts are tiered by severity and consequence, visually and behaviorally distinct
- [ ] Non-actionable notifications are batched, digested, or absent
- [ ] Interruptive (modal) alerts reserved for act-now-or-harm; everything else is passive
- [ ] Dismissal behavior is honest: dismissed means handled-or-deferred, and deferred comes back at the right moment
- **Violation signals:** same red banner for "printer offline" and "allergy conflict"; alert text users can recite without reading; click-through as muscle memory

### HH3 — Glove and distance operation
The hand may be gloved; the screen may be an arm's length away on a cart, or across the room on a wall display.
- [ ] Touch targets comfortably above the WCAG 2.5.8 24px floor for gloved use (44px is the working bar)
- [ ] Critical text legible at the device's real viewing distance (cart ≈ 70cm; wall display ≈ meters)
- [ ] No hover-only interactions on touch-class devices; no precision gestures (long-press, drag) without alternatives
- [ ] Contrast holds under clinical lighting (glare, dimmed night wards)
- **Violation signals:** dense tap targets in a row; 12px status text on a wall-mounted census board; tooltip-only explanations

### HH4 — Safety-critical confirmation
Friction must be proportional to harm — both directions fail.
- [ ] Irreversible, high-harm actions (discontinue med, delete documentation, override allergy) get meaningful friction: state what + consequence, require an explicit choice, never default to confirm
- [ ] Confirmation text names the object ("Discontinue heparin drip for this patient?") — no generic "Are you sure?"
- [ ] Routine, reversible actions get zero confirmation (undo instead) — every needless dialog trains click-through that defeats the critical ones
- [ ] High-risk confirmations are visually distinct from routine dialogs, and the safe option is the easy one
- **Violation signals:** "Are you sure?" on every save; destructive default button focused; identical styling for trivial and critical confirms

### HH5 — Shared-workstation re-auth
The device belongs to the unit, not the user.
- [ ] Fast user switching: seconds, not a full logout/login cycle
- [ ] Timeout lock hides PHI from the screen (privacy) without destroying in-progress work (HH1)
- [ ] On re-auth, the user returns to exactly where they were — same patient, same task, same scroll position
- [ ] Identity is glanceable: who is logged in, which patient context is active
- [ ] Badge-tap / SSO honored where client infrastructure has it
- **Violation signals:** timeout dumps to login and discards the session; previous user's patient list visible during switch; users defeat the timeout with mouse-jigglers — that's a design finding, not a user failing

## Severity scale (Nielsen 0–4)

| Score | Meaning | Triage |
|---|---|---|
| 0 | Not a usability problem | No action |
| 1 | Cosmetic | Fix if time permits |
| 2 | Minor — slows users slightly, workaround exists | Low priority |
| 3 | Major — significant difficulty, frequent or hard to work around | High priority |
| 4 | Catastrophe — blocks the task or risks harm/data loss | Fix before release |

Rate on **frequency × impact × persistence** (does it hurt once or every time?). Patient-safety implications floor the score at 3.
