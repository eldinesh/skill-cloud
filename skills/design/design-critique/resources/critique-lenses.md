# The five critique lenses — questions and violation signals

Work the lenses in order; earlier lenses gate later ones (broken flow makes polished hierarchy moot). Every signal below maps to a named principle so findings stay grounded.

## 1. Hierarchy — does visual weight match task importance?

| Question | Violation signal | Principle |
|---|---|---|
| Is the primary action the most visually dominant element? | CTA competes with secondary actions or decoration | Visual hierarchy, Von Restorff |
| Does the 5-second read match the intended read? | Cold-read answers wrong or hesitant | Scanning (Krug) |
| Are related items grouped and bounded? | Related controls scattered; ambiguous grouping | Proximity, Common Region |
| Does information density match the user's expertise and dwell time? | Daily-use clinical tool with consumer-grade sparseness, or onboarding screen packed like a cockpit | Product posture |
| Is anything competing for attention that doesn't earn it? | Decoration, banners, badges with no task role | Nielsen H8 |

## 2. Flow — does the path advance the goal?

| Question | Violation signal | Principle |
|---|---|---|
| How many interactions to complete the primary task — and how many advance the goal? | The gap is excise: navigation detours, redundant confirmations, re-entry of known data | Excise audit, Tesler's Law |
| Can the user back out, cancel, and resume at every step? | No exit from flows; abandoning loses work | Nielsen H3 |
| Does the flow survive interruption? | Mid-task state lost on navigation or timeout — in clinical settings interruption is the norm, not the edge | Interruption tolerance (see /heuristic-evaluation HH1) |
| Are multi-step flows showing progress and an end? | No step indicator; unknown remaining effort | Goal-Gradient |
| Any dead ends? | Screens with no next action (errors, empty states, completions) | H9, Peak-End |

## 3. Affordance — does it look like what it does?

| Question | Violation signal | Principle |
|---|---|---|
| Do interactive elements look interactive — and static ones not? | Flat text that's secretly a button; card that looks tappable but isn't | Perceived affordance |
| Would a first-time user know what's tappable, draggable, editable? | Hidden gestures with no visible alternative | WCAG 2.5.1, discoverability |
| Are controls where convention says they'll be? | Non-standard placement without payoff | Jakob's Law, H4 |
| Are disabled states explained? | Greyed control with no reason or path to enable | H1, H10 |
| Are targets big enough for the input context? | Small targets for touch — gloved touch needs more than the 24px floor | Fitts's Law, WCAG 2.5.8 |

## 4. Feedback — does the system answer?

| Question | Violation signal | Principle |
|---|---|---|
| Is every action acknowledged within ~400ms (perceived)? | Click → nothing → double-submit | Doherty Threshold, H1 |
| Is system status always visible? | Saving/saved/failed indistinguishable; silent background sync | H1 |
| Do long operations show progress and yield control? | Blocking spinner past ~10s with no escape | Responsiveness thresholds |
| Are status changes announced, not just painted? | Color-only state change; nothing for screen readers | WCAG 4.1.3, 1.4.1 |
| Is feedback proportional? | Toast fireworks for trivia; silence for consequential changes | Peak-End, H1 |

## 5. Error handling — prevented, identified, recoverable

| Question | Violation signal | Principle |
|---|---|---|
| Are likely errors prevented by constraints and defaults? | Free-text where a constrained picker would do; formats enforced after the fact | H5, Postel's Law |
| Do error messages say what happened + what to do next? | "Something went wrong", error codes, blame language | H9 |
| Is recovery cheap? | Fix one field, lose the form; no undo for destructive actions | H3, H5 |
| Is confirmation friction proportional to harm? | "Are you sure?" on routine actions (breeds click-through — alarm-fatigue pattern) while high-harm actions sail through | HH4 safety-critical confirmation |
| Are error states designed at all? | Only the happy path exists in the file | Missing-states check |

## Severity definitions (for findings)

- **blocker** — prevents task completion or creates a safety/data risk; do not ship or hand off
- **major** — significant friction or confusion for a primary persona on a core task; fix before next review
- **minor** — friction with an obvious workaround; schedule it
- **polish** — craft-level: alignment, rhythm, wording; batch into a polish pass

## Banned phrases — and what to say instead

| Don't write | Write |
|---|---|
| "I'd prefer…" / "I don't like…" | "<element> violates <principle> because <reason>" |
| "Feels off" | "<X> competing focal points; make <element> primary, demote <element>" |
| "Make it pop" | "Primary CTA has the same weight as secondary actions — increase contrast/size per <token scale>" |
| "Users won't get this" | "<persona> lacks <specific knowledge> this label assumes — use glossary term '<term>'" |
| "It's fine" (as praise) | "<pattern> nails <principle> — reuse it in <place>" |
