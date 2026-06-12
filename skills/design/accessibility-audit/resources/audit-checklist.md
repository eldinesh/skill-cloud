# WCAG 2.2 AA audit checklist — by principle

Practical pass for design-stage and build-stage audits. Criteria marked **[build]** can only be verified on a working UI — at design stage, convert them into annotations for /handoff-spec instead of skipping. AAA items included only where they're the healthcare working bar.

## Perceivable

### Text alternatives & media
- [ ] 1.1.1 (A) Functional images/icons have text alternatives; decorative ones are marked decorative
- [ ] 1.4.5 (AA) No images of text where real text works (chart annotations excepted with alternatives)
- [ ] 1.2.2/1.2.4 (A/AA) Captions on prerecorded and live video (training content counts)

### Structure & relationships
- [ ] 1.3.1 (A) Headings, lists, tables are semantic — design specifies heading levels, not just sizes
- [ ] 1.3.2 (A) Reading order matches visual order when linearized **[build]**
- [ ] 1.3.3 (A) Instructions never rely on shape/position alone ("click the green button on the right")
- [ ] 1.3.5 (AA) Input purpose identified (autocomplete) for personal-data fields **[build]**

### Color & contrast — the big one
- [ ] 1.4.1 (A) Color never the only channel: statuses, links, errors, chart series get icon/text/pattern too
      — **healthcare:** acuity/abnormal flags in worklists and dashboards are the chronic offender
- [ ] 1.4.3 (AA) Text ≥ 4.5:1; large text (18pt+/14pt+ bold) ≥ 3:1 — measure against the client's real token values, on every state
- [ ] 1.4.11 (AA) Non-text ≥ 3:1: input borders, icons, focus indicators, toggle states, chart elements
- [ ] 1.4.4 (AA) Text resizes to 200% without loss **[build]**
- [ ] 1.4.10 (AA) Reflow at 320px width / 400% zoom, no 2-D scrolling **[build]**
- [ ] 1.4.12 (AA) Survives user text-spacing overrides **[build]**
- [ ] 1.4.13 (AA) Hover/focus content (tooltips, previews) is dismissible, hoverable, persistent
- [ ] **Healthcare — viewing distance:** type floors per device class (wall display, workstation-on-wheels, gloved tablet) from project-context; flag anything below the floor even if WCAG-silent

## Operable

### Keyboard
- [ ] 2.1.1 (A) Everything operable by keyboard — design names the keys for custom widgets **[build to verify]**
- [ ] 2.1.2 (A) No keyboard traps **[build]**
- [ ] 2.4.1 (A) Skip link / landmark structure to bypass repeated chrome
- [ ] 2.4.3 (A) Focus order is logical — design annotates intended order on dense screens
- [ ] 2.4.7 (AA) Focus visible on every interactive element — check the design actually shows a focus style
- [ ] 2.4.11 (AA, 2.2) Focused element never fully hidden by sticky headers, toasts, or panels

### Pointer, touch, gloves
- [ ] 2.5.1 (A) Multipoint/path gestures (drag, pinch) have single-pointer alternatives
- [ ] 2.5.2 (A) Actions complete on up-event; press-and-hold cancelable
- [ ] 2.5.7 (AA, 2.2) Drag operations have non-drag alternatives (reordering worklists, scheduling boards)
- [ ] 2.5.8 (AA, 2.2) Targets ≥ 24×24px or spaced equivalently
      — **healthcare:** on touch/gloved device classes hold the 44×44 working bar; flag 24–43px as findings
- [ ] 2.5.3 (A) Accessible name contains the visible label (voice-control users say what they see)

### Time & motion
- [ ] 2.2.1 (A) Time limits warn, extend, or adjust
      — **healthcare:** auto-logoff must warn before expiry and preserve in-progress work; re-auth restores task state (pairs with 2.2.5 AAA — adopt it as the working bar on clinical engagements)
- [ ] 2.2.2 (A) Auto-updating content (live worklists, vitals tickers) pausable or user-controlled
- [ ] 2.3.1 (A) Nothing flashes > 3×/second (alarm visuals included)

## Understandable

### Readable & predictable
- [ ] 3.1.1/3.1.2 (A/AA) Page and inline language set **[build]**
- [ ] 3.2.1/3.2.2 (A) Focus or input never triggers surprise context changes (auto-submit on last field, focus-stealing alerts)
- [ ] 3.2.3/3.2.4 (AA) Navigation and component naming consistent across screens
- [ ] 3.2.6 (A, 2.2) Help mechanism in a consistent location

### Input assistance
- [ ] 3.3.1 (A) Errors identified in text, at the field, naming the field
- [ ] 3.3.2 (A) Labels visible (placeholder ≠ label); required state marked beyond color/asterisk-alone
- [ ] 3.3.3 (AA) Error text says how to fix it ("Date must be in the future"), not just that it's wrong
- [ ] 3.3.4 (AA) Legal/financial/data-altering submissions are reversible, verified, or confirmed
      — **healthcare:** treat order signing, documentation deletion, allergy overrides as this class
- [ ] 3.3.7 (A, 2.2) No redundant entry within a session (carry context; don't re-ask)
- [ ] 3.3.8 (AA, 2.2) Authentication without cognitive puzzles; supports paste/password managers/badge-tap

## Robust

- [ ] 4.1.2 (A) Custom components have correct name/role/value — design specifies role + label per component (see /component-spec a11y section) **[build to verify]**
- [ ] 4.1.3 (AA) Status messages announced without focus steal: saves, async results, row updates, background refreshes
      — design must say *which* messages are polite vs. assertive; assertive is for act-now-or-harm only (alarm-fatigue rule applies to screen readers too)

## Audit hygiene

- Record measured values (ratio, px) with every contrast/size finding.
- Record "checked clean" criteria — coverage must be claimable.
- Separate **verified** findings from **[build] annotations**; the annotations flow into /handoff-spec and get re-verified by /design-qa-checklist.
- Test data in any screenshots must be synthetic — PHI rules in `engagement-guardrails` apply to audit evidence too.
