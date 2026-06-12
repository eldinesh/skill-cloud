---
artifact: component-spec
project: <client codename>
created_by: skillcloud/component-spec v<VERSION>
sources: ["<Figma component link>", "<client design system reference>"]
status: draft
updated: <yyyy-mm-dd>
---

# Component Spec — <name, in the client's naming convention>

| | |
|---|---|
| **Purpose** | <one sentence: the user need it serves> |
| **System placement** | reuse of `<client component>` / extension of `<client component>` / net-new |
| **Client approver** | <design system owner — required for extension/net-new> |
| **Composes** | <client primitives/tokens it's built from> |
| **Figma** | <link to component frame> |

**Use when:** <…>
**Don't use when:** <…> — use `<sibling component>` instead. Confusable with `<…>`; the difference is <…>.

## Anatomy

```
┌──────────────────────────────┐
│ 1 label    2 value   3 badge │
│ 4 helper text                │
└──────────────────────────────┘
```

| # | Part | Required | Maps to (client system) | When absent |
|---|---|---|---|---|
| 1 | <part> | yes/no | <atom/token> | <spacing collapses / placeholder holds> |

## Variants

| Variant | Use when | Don't use when |
|---|---|---|
| default | | |
| <variant> | | |

<!-- >5 variants → split the component. -->

## States (per variant — all eight, no TBDs)

| State | Appearance (tokens) | Trigger | Announced |
|---|---|---|---|
| default | | page load | — |
| hover | | pointer enter | — |
| focus | <client focus token> | keyboard focus | — |
| active | | press | — |
| disabled | | <condition> + why shown disabled | state in accessible name |
| loading | <skeleton/spinner per client pattern> | <fetch> | "<…> loading" (polite) |
| empty | <designed, not blank — message + action> | zero data | — |
| error | | <validation/server> | error text (assertive only if act-now) |

## Behavior

- **Pointer:** <click/tap outcome; drag alternative if any drag — WCAG 2.5.7>
- **Keyboard:** Tab <…> · Enter <…> · Space <…> · Esc <…> · Arrows <…>
- **Motion:** <duration/easing tokens; `prefers-reduced-motion` fallback>
- **Edges:** overflow <…> · truncation <…> · min/max content <…> · 200% zoom <…>
- **Interruption (clinical):** in-progress state on blur/timeout: <preserved how>

## Content rules

| Slot | Min/Max | Truncation | Case | Register | Notes |
|---|---|---|---|---|---|
| label | | | | clinician / patient-facing | terminology slots `[SME-REVIEW]` — see /ux-writing |

## Accessibility

| Requirement | Spec | WCAG |
|---|---|---|
| Role | <native element first; ARIA only if needed> | 4.1.2 |
| Name | <labelled by / described by> | 4.1.2 |
| Keyboard | <testable restatement of Behavior> | 2.1.1 |
| Focus order & style | <position in parent order; client focus token> | 2.4.3 / 2.4.7 |
| Announcements | <state changes → polite/assertive> | 4.1.3 |
| Contrast | <token pairs + measured ratios> | 1.4.3 / 1.4.11 |
| Target size | <px; 44px working bar on touch/gloved classes> | 2.5.8 |

## Responsive & device classes

| Context | Behavior |
|---|---|
| desktop | |
| workstation-on-wheels / cart | <distance/glove adjustments> |
| tablet (gloved) | |
| <breakpoint> | <reflow/stack/hide> |

## Tokens

```
background:   <client token>
text:         <client token>
border:       <client token>
spacing:      <client token>
radius:       <client token>
type:         <client token>
```

**Token gaps (requests to client system team — never silent raw values):**

| Needed | Proposed value | Rationale | Status |
|---|---|---|---|
| <e.g. status-surface-critical> | <…> | <…> | requested |

## Open questions

- <…>

## Changelog

| Date | Change | By |
|---|---|---|
| <yyyy-mm-dd> | Initial spec | |
