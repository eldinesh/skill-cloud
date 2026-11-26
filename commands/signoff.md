---
description: Record a named person's sign-off, conditions, send-back or overrule at a gate (Claude never signs)
argument-hint: <artifact|all> as <name> [with conditions: …] | send back <artifact> to <role>: … | overrule <finding> as <name> because …
---

The person typed: `$ARGUMENTS`

Follow `/design-lead` → **Step 6: Record a sign-off** exactly, using these words as the person's decision. Rules:

- Act only on what was typed. If it doesn't name a person, ask "Signing as whom?" and stop. Never fill in a name.
- Record it in `ux/decisions-log.md` and the artifact header(s), archive any final being replaced, then run `skillcloud-check signoffs` and paste its result line.
- Mark the gate ticket done and regenerate the board.
- If the signer isn't the person named for that role in `ux/project-context.md`, record it as given and flag it.
