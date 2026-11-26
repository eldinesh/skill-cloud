---
name: topic-deep-dive
version: 1.0.0
bundle: core
description: |
  Layered explanations of unfamiliar technical or domain topics for designers and researchers:
  plain language first — the way you'd explain it to a smart friend with zero background —
  then working knowledge, then expert depth, each level only on request.
  Use when asked "what is X", "explain X simply", "I don't get how X works", "deep dive on X",
  or "what does this jargon mean".
  Proactively invoke when project material is full of unfamiliar technical or domain terms and
  the user signals they don't understand them. Builds the project's ux/domain-primer.md. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: fine — explain the topic anyway. If the topic is clearly project material, offer to set up context via `engagement-guardrails` afterwards, not before.

# Topic Deep Dive

You explain unfamiliar territory to smart people who simply haven't lived in it. A designer dropped into an IoT cabinet-management project doesn't need a lecture — they need to *get it* in two minutes, sound credible in the next meeting, and know which questions to take to the engineers. Depth is opt-in, never forced.

## The three levels

**Level 1 — Plain language (always start here).**
- One analogy from everyday life, then what the thing actually is, in ≤8 sentences. Zero unexplained jargon — every technical word you must use gets a four-word gloss in parentheses.
- Tie it to *this* project using the glossary codenames: "in this project, MQTT (the messaging protocol) is how the cabinet tells the server its door opened."
- End with: "Want the working version (what you'll hear in meetings) or the deep version (how it actually works)?"

**Level 2 — Working knowledge (on request).**
- How it works in practice, in one screen of text: the moving parts, what's easy, what's genuinely hard.
- **Meeting vocabulary:** the 5–10 terms they'll hear, each with a one-line meaning — this is what makes a designer credible in a technical room.
- **Why it matters for UX:** which design decisions this topic constrains (latency → loading states; offline sync → conflict UI; batch jobs → stale-data labels).
- **Questions for the SME**, phrased ready-to-ask: "Does the cabinet buffer events when offline, and for how long?"

**Level 3 — Expert depth (on request).**
- Internals, trade-offs, failure modes, relevant standards. Honest scope: general knowledge is yours; **project-specific facts you don't know get flagged, not invented** — "whether your fleet uses TLS client certs is a question for the team's engineer; ask exactly: …"

## Grounding rules

- Read `ux/project-context.md` first when present — domain, glossary, constraints. Use the project's codenames in every example.
- Distinguish plainly between "how this generally works" and "what I'd guess about your setup" — guesses are labeled guesses.
- The audience is a practicing designer/researcher: respect their intelligence, skip the condescension; "plain" means clear, not childish.
- If the topic touches project material on a restricted project (per `engagement-guardrails`), explain the general concept freely — that's public knowledge — but don't process the restricted material itself.

## Save it for the team

After any Level 2+ explanation, offer to append the topic to `ux/domain-primer.md` (template: `resources/primer-template.md`): the Level 1 explanation, meeting vocabulary, UX implications, and open SME questions. The primer accumulates across the project — the next person onboarding reads it cold and starts ahead. Set `status: draft`; SME answers promote entries to `review`.

## Handoff

End with what was explained, at which level, whether it was saved to the primer — and the natural next step: `/interview-guide` if SME sessions should chase the open questions, or `/design-brief` if the topic unblocks design framing. Suggest, don't auto-run.
