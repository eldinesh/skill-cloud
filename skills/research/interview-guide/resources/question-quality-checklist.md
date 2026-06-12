# Question quality checklist

Run every question in the guide through this table before the guide ships. If a question matches a "catch" pattern, use the rewrite move.

## Rewrite table

| Catch | Smell | Rewrite move | Example |
|---|---|---|---|
| Leading | Question contains the desired answer ("Don't you think…", "Wouldn't it be easier if…") | Strip the premise; ask what happened | "Don't you find the alerts overwhelming?" → "Tell me about the alerts you saw yesterday. What did you do with them?" |
| Hypothetical | "Would you…", "What if…", "Imagine…" | Ask for the last real instance | "Would you use a mobile version?" → "Tell me about the last time you needed this away from a workstation." |
| Opinion-fishing | "Do you like…", "How do you feel about…" as a primary question | Ask about behavior; feelings surface in the story | "Do you like the new intake form?" → "Walk me through the last intake you did." |
| Binary | Yes/no answer possible | Open with how/what/walk-me-through | "Was that hard?" → "How did that go?" |
| Double-barreled | Two questions wearing one question mark | Split | "How do you find and verify the order?" → two questions |
| Generalization | "Usually", "typically", "normally" | Anchor to a specific instance | "What do you usually do when…" → "What did you do the last time…" |
| Solution smuggling | Question presumes the product idea | Ask about the underlying job | "How often would you check a dashboard?" → "How do you find out what state things are in now?" |
| Jargon-first | Uses interface labels or team vocabulary the participant hasn't used | Use their words or neutral words | "How do you use the Care Hub?" → "Where do you go to see what's pending?" |

## JTBD probe bank (attach to any story)

- What triggered that? What were you trying to get done, in your words?
- What did you try first? What had you been doing before that?
- What would have happened if you'd done nothing?
- What did "done" look like? How did you know it worked?
- Who else cared that this got done?

## Healthcare etiquette quick card

- Schedule: never shift change (~7a/7p), rounds, or med passes; reconfirm with the charge nurse/manager the day before; bring the 25–30 min cut.
- Consent: the recording/AI-processing sentence must match the engagement AI tier in `ux/project-context.md` (rules in `engagement-guardrails`). Notes-only fallback always on offer.
- PHI redirect up front; if patient details slip out anyway, they don't enter notes — generalize on intake.
- Interruptions are data first (what pulled them away, how they re-entered), protocol second (offer pause/end).
- Demos on test or training environments only. Live screen = look away, don't capture.

## Pilot pass

Before fieldwork, run the guide once on a friendly participant and check: total time honest? any question consistently misunderstood? warm-up producing a probe-able timeline? Adjust, bump `updated:`, keep `status: draft` until the first real session confirms it.
