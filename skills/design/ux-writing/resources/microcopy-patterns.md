# Microcopy patterns — with healthcare registers

All examples synthetic. Patient-facing examples target 6th–8th grade reading level; clinician-facing examples use glossary-sanctioned shorthand only. `[SME-REVIEW]` flags where clinical accuracy must be confirmed — never invent medical terminology.

## Buttons and actions

Pattern: **verb + object**, sentence case, describes what happens — not "Submit", "OK", "Click here".

| Context | Weak | Strong |
|---|---|---|
| Patient portal | "Submit" | "Request appointment" |
| Clinician worklist | "OK" | "Sign order" |
| Destructive | "Delete" (alone, ambiguous scope) | "Delete draft note" |

Buttons that reference a named page keep that page's name intact ("Back to Care Plan").

## Error messages — the two-part test

Pattern: **[what happened]. [what to do next.]** Optionally why, if it changes what the user does. No blame ("invalid", "illegal"), no bare codes, no dead ends.

| Register | Example |
|---|---|
| Patient-facing | "We couldn't book this time. Someone else just took it. Pick another time below." |
| Clinician-facing | "Order not signed — session expired. Sign in again; your draft is saved." |
| High-stakes (state what did NOT happen) | "Payment didn't go through. Your card wasn't charged. Check the card number and try again." |
| Validation (inline, at the field) | "Date of birth must be in the past." |

Healthcare notes:
- Failure of a clinical action must say whether the action took effect ("not signed", "not sent to pharmacy") — ambiguity here is a safety issue.
- Timeout errors must say whether work was preserved (pairs with HH1/2.2.1 findings).
- Patient-facing errors avoid alarm beyond what's warranted; clinical-result language is `[SME-REVIEW]`.

## Empty states — three different empties

Pattern: **why it's empty + the action that fills it.**

| Type | Example (patient-facing) |
|---|---|
| First use | "No messages yet. Your care team's replies will show up here." |
| User-cleared | "All caught up. New results will appear here when they're ready." |
| No results | "No visits match these filters. Clear filters to see all visits." |

Caution with cheerful empties on clinical data: "No results yet" is neutral; "Hooray, nothing here!" on a lab-results page reads very differently to a worried patient. Stress cases are the default audience.

## Confirmations — friction proportional to harm

Pattern: **name the object + the consequence + explicit verbs** (never Yes/No, never bare "Are you sure?").

| Stakes | Example |
|---|---|
| Routine, reversible | No dialog — do it and offer undo: "Note archived. Undo" |
| Destructive, recoverable | "Delete this draft note? You can restore it from Trash for 30 days." → "Delete draft" / "Keep draft" |
| Clinical, irreversible | "Discontinue this medication order? The care team will be notified." → "Discontinue order" / "Cancel" `[SME-REVIEW]` |

The safe action gets the easy position; the destructive verb is named, not "Confirm".

## Status and success

Pattern: past tense, specific, proportional. "Note saved", "Message sent to your care team". No fireworks for routine saves; explicit confirmation for consequential actions ("Order sent to pharmacy"). Status changes are also screen-reader announcements — keep them short and front-loaded (4.1.3).

## Form labels and help

- Labels: visible noun phrases ("Date of birth"), never placeholder-as-label.
- Helper text: why you're asking, before the error happens ("We use this to match your records").
- Required: marked in text, not color or asterisk alone.
- Inputs forgiving: accept formats users type; don't punish hyphens and spaces (Postel's Law).

## Register quick check

| | Patient-facing | Clinician-facing |
|---|---|---|
| Reading level | 6th–8th grade, noted in artifact | n/a — precision over simplicity |
| Sentence length | 8–14 words | as short as accuracy allows |
| Abbreviations | expand on first use, avoid Latin | glossary-sanctioned only |
| Tone | calm, plain, stress-case-safe | neutral, fast, zero whimsy |
| Terms | define necessary medical terms in-line | exact clinical terminology — never paraphrased |

## Banned list

"Submit" · "OK" (as a lone action) · "Click here" · "Invalid input" · "Something went wrong" (alone) · "Are you sure?" (bare) · "Oops" / "Whoops" in clinical or error contexts · invented clinical terms (use `[SME-REVIEW]` placeholder instead) · "8/5/26"-style numeric dates (ambiguous across locales — write "5 Aug 2026").
