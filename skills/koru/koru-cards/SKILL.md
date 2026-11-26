---
name: koru-cards
version: 3.0.0-alpha.1
bundle: koru
stage: any
description: |
  The Koru project graph: every artefact is a card with a fixed shape, typed links and a
  status, kept in koru/cards and managed with the koru command. Card types, required fields,
  link grammar, versions and sign-off, stale and writeback flags, and how change travels both
  ways.
  Use when asked "what card do I need", "how do I link this", "why is this stale", "how do I
  change a signed card", "what does this flag mean", or when creating or editing any card in
  a Koru project.
  Proactively invoke before writing or editing anything in koru/cards. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
koru help 2>/dev/null | tail -n 1
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

## Contract
- **Consumes:** `koru/cards/*.md`, `koru/engagement.md`, `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** cards with complete shapes and typed links
- **Next:** whichever stage skill the card belongs to (`koru-frame`, `koru-explore`, `koru-harden`, `koru-ship`)

# The Koru project graph

## The chain

Data → Finding → Insight → JTBD → Problem → HMW → Opportunity → Direction → Screen → State → Ticket → Metric, with Decisions anywhere. Supporting cards: Context (CTX), Request (REQ), Conflict (CON), Assumption (ASM), Idea (IDE), Hypothesis (HYP), Brief (BRF), Handoff (HND), Review record (REV).

Create every card with `koru new TYPE "title"`. It gets the next id, the fixed shape for its type, and a header the tools can test. Fill the shape; don't invent fields.

## Header

```
id, type, title, stage, status (draft | review | final | superseded), version, owner (role),
author (person), signed_by, signed_at, <type fields>, links, created, updated
```

`signed_by`, `signed_at`, `confidence`, `status: final` and the contract fields in `engagement.md` are set only by people through the `koru` command. The hooks stop you changing them.

## Links

```
links:
  - supports FND-003: two of nine re-check by hand
  - contradicts FND-007: team leads say they never re-check
  - serves HMW-001: trust gap
```

Kinds: supports · contradicts · cites · reframes · serves · implements · tests · measures · affects · supersedes. Every link says why, in one line. Signing pins each link to the version it was signed against (`FND-003@2`).

- A card with no source is labelled an assumption; a card resting on an ASM shows it.
- A Hypothesis (synthetic or speculative) can be tested but never `supports` anything.
- A superseded card cannot be cited.

## Required shapes (what `koru check` tests)

| Card | Must have |
| --- | --- |
| DAT | source, file (pseudonymised transcript in koru/raw), study, participant ID, consent naming the AI processor, data class, retention |
| FND | observation without causal words, evidence type, count, supported by a DAT, quotes verified word for word |
| INS | what, why ("because"), so what; supported by Findings; contradicting links (or a stated absence); confidence, last_validated, review_by (people) |
| JOB | "When …, I want to …, so I can …"; forces; rests on an Insight |
| PRB | who, what, wow; cites an Insight or JTBD; at most three per project plus a Foundation |
| HMW | title starts "How might we"; reframes a Problem |
| DIR | seed author, core idea, hypothesis, biggest risk, test question, threshold saved before results; serves an HMW |
| SCR | flow step, pinned design-system version, every element classified; implements a Direction |
| STA | screen, role, state, resolution (designed, or n/a: reason) |
| TKT | verb-object title, user story, one given/when/then per State cell naming the STA id, links to Screen, JTBD and Metric, no vague words, no TBDs |
| DEC | question, factors before options, options, exactly one Approver, outcome; affects links for what it changes |
| REV | gate, checker, checklist version, every finding with a disposition |

## Status and change

- **draft → review → final.** Move a card to `review` when it is ready for its signer. Only the signer makes it final: `! koru sign ID --name "…" --role "…"`.
- **A signed card is never edited.** `koru revise ID --reason "…"` opens the next version as a draft; the owner re-signs. Cards pinned to the old version then show **stale** until their owners accept (revise), reject or note the change.
- **Decisions are superseded, never edited.** `koru decide new "…" --link "supersedes DEC-002: why"`. Signing it marks the old one superseded.
- **Impact before acceptance.** `koru decide impact DEC-…` lists what a decision would flag, two hops out, and marks anything touching accessibility, safety or the contract.
- **Writeback.** A signed Decision flags the cards it `affects` (one hop). The next hop is flagged when an owner accepts. Clearing a flag without a change needs a reason (`! koru clear-flag ID --decision DEC-… --reason "…"`).
- **Thresholds before results.** `koru threshold DIR-…` then `koru result DIR-… "…"`.
- Every change you make is saved as a version and stamped (who, when, which session, which sources).

## Plain words

Speak to people in their verbs: "save a version", "see what changed", "go back to Tuesday's version" (`koru/history/<ID>/`). Never show stack traces or raw paths when a card id says it better.
