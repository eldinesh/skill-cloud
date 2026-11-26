---
name: koru-frame
version: 3.0.0-alpha.1
bundle: koru
stage: frame
description: |
  Koru stage 1, Frame: turn a client brief, kick-off call and research into evidence people can
  trust, ending in a signed Brief and research pack, or an honest no-go. Runs intake sorting,
  TRACES kick-off, secondary research, research and design discovery in parallel, and
  interpretation (Findings → Insights → JTBD → Problems → HMWs → opportunities) as cards in
  the Koru project graph.
  Use when asked to "start framing", "run the kick-off", "synthesise the interviews", "what are
  the insights", "write the problem statements", or "get us to the Frame gate".
  Proactively invoke when a Koru project (koru/engagement.md) has no signed Brief yet and the
  person shares a brief, call notes, transcripts or research. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
koru where --brief 2>/dev/null || echo "NO_KORU_PROJECT"
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `NO_KORU_PROJECT`: run `/koru:start` first. Nothing is generated before the engagement pack and the contract exist.
- If the recap says the contract is not set: tell the person which line to type (`! koru contract …`). Research data stays closed to you until they do; you can still do desk research and the Context card.

## Contract
- **Consumes:** `koru/engagement.md` (switches and contract, always), `koru/client.md`, the client brief and call notes, pseudonymised transcripts in `koru/raw/`, `ux/project-context.md` when the project also uses SkillCloud (domain and data rules, see `engagement-guardrails`)
- **Produces:** cards in `koru/cards/`: CTX, REQ, IDE, ASM, DAT, FND, CON, HYP, JOB, PRB, HMW, OPP, BRF, a REV for the gate
- **Next:** the research checker, then the Frame gate (`/koru:gate frame`), then `koru-explore`

# Frame: evidence people can trust

Frame creates the evidence everything else cites, so it carries the most AI risk: misquoted participants, patterns invented from one voice, synthetic "users" standing in for real ones. Your job is throughput: sorting, drafting, clustering, counting, checking. People decide what is true.

## Who does what (AI Fluency: delegation)

| Step | Claude | Shared | People only |
| --- | --- | --- | --- |
| Intake sort | Sorts every input | Research owner confirms the sort | |
| TRACES kick-off | Pre-fills from desk research with sources | Recap within 24 hours | Asking, listening, committing |
| Discovery | Plan, guide, consent check, tagging Data | Guide review for leading questions | Running sessions |
| Interpretation | Findings with counts, tail report, confidence signals | Conflict weighing | Writing Insights, rating confidence |
| Gate | Research checker, review record | Dispositions | Signing the Brief and pack |

**Discernment checks you surface every time:** a pattern resting on one participant, a Finding that explains instead of observes, a stakeholder claim treated as evidence, a quote that is paraphrased.

## Entry and exit

- **Entry:** a signed engagement or request; `koru/engagement.md` written; the contract set by a person; the call type sorted.
- **Exit:** the Brief final and co-signed by the client sponsor, the research pack final (every Insight signed), or a signed **no-go** Decision. Ending discovery with "don't build this" is a valid, valuable outcome.

## F0. Intake (runs again for every new input)

For every client input (brief, PRD, deck, email, call note), sort each item and make the card:

| Kind | Card | Rule |
| --- | --- | --- |
| Evidence | `koru new DAT` | Needs a source, consent record naming the AI processor, data class, retention |
| Constraint | Add to `koru/client.md` or the Brief's Constraints | |
| Proposed solution | `koru new IDE "…"` | Write its **reverse trace**: the problem it implies. Held out of your context until Explore's divergence is done |
| Stakeholder or PRD claim | `koru new ASM "…"` | Stays an Assumption until evidence supports it; everything citing it is marked |
| Reference or asset | Note it on the Context card | |

Ad hoc requests that arrive mid-project go through `/koru:note`. Show the person your sort in a short table and ask them to confirm it before moving on.

## F1. Kick-off with TRACES

1. **Sort the call** from the `call_context` switch: fresh start, informed by synthesis (pull past Insights for this client with their age and confidence), or ad hoc.
2. **Pre-fill TRACES** from desk research, every line with a source and a confidence: **T**rigger (why now), **R**esult (what success looks like), **A**udience (who uses it), **C**onfidence (what they already know vs believe), **E**dges (constraints, what's out), **S**ay-so (who decides). Add what exists and what was tried.
3. **Two probes** for the person to ask: the appetite probe ("How would you feel if we could do this in two weeks?" shows attachment to the problem, the solution or the date) and "What would you hate to see us propose?".
4. People ask, listen and commit only to a playback, a recap within 24 hours and the next touchpoint.
5. After the call, draft the Context card: `koru new CTX "Context"`. It holds the 12 context questions. Questions 1 to 5 (why now, result, users, decider, what exists) must be answered before the Brief can be final. Leave unknowns blank; blanks show on the board.

## F2. Secondary research

Desk research and a competitive scan of 3 to 5 products. Every claim becomes a Data card with `secondary: yes`, the source URL and the date. Competitors enter as **named patterns** ("inline reason chips, as in X"), never as screens to copy. Run `topic-deep-dive` when the domain is unfamiliar.

## F3. Discovery, in parallel

**Research discovery (people lead).**
- Write the plan with `research-plan` and the guide with `interview-guide` (story-based JTBD questions, no leading questions). The person reviews the guide.
- Before fieldwork, check consent: it must cover use, storage, sharing and the named AI processor. No consent record, no Data card: the hook refuses it.
- Transcripts arrive as originals in `koru/raw/originals/` (never readable by you). A person runs `! koru pseudonymise koru/raw/originals/<file> --map koru/private/names.csv`; you work only from the copy in `koru/raw/`.
- One DAT card per session: `koru new DAT "Interview P01" --field file=raw/<file> --field participant=P01 …`.
- You never run or replace a session. If someone asks for synthetic users, the output is a Hypothesis card (`koru new HYP`), which can be tested but never cited.

**Design discovery.** Product deep dive, engineering input, and the **design-system audit**: coverage, quality, Figma-to-code sync, governance. Write the result to `koru/design-system.md` (with a `version:`) and propose the `design_system` switch value (mature, partial, figma only, code only, brand only, none). The audit sets the switch, not a yes/no question. Then run `koru-design-system` to set the system up (extend theirs, adopt an open-source one, or build one); `koru ds status` shows where it stands. Nothing is prototyped before it exists.

## F4. Interpretation

1. **Findings.** Run `interview-synthesis` and `affinity-mapping` against the pseudonymised transcripts, then write one FND card per finding:
   - an observation with no causal words (no "because", "due to", "so that"),
   - an evidence type: observed · story · attitude · stakeholder · document (strongest first; synthetic is never a Finding),
   - a count ("6 of 9") and segment,
   - quotes in the exact form `> "words" (P03, 00:12:34, DAT-002)`. The hook checks each one word for word against the transcript, with the speaker and timestamp, before the card is saved.
2. **Tail report.** Before anyone writes Insights, list outliers, single-participant findings and where segments disagree, so nuance is not averaged away. Put it in chat and in the REV later.
3. **Insights are written by people.** You may not create INS cards (the hook stops you). Offer the researcher a reading of the Findings in chat: what, because, so what, with the contradicting evidence next to it. They run `koru new INS "…"` and write it. Then challenge it: does the "because" go beyond the Findings? What contradicts it? Coach point: ask the researcher to write the "because" before you show yours.
4. **Conflicts.** When sources disagree, `koru new CON "…"` with each position, its source and evidence type. Weigh by the kind of question: observed behaviour for user needs, say-so for business wants, the engineer for feasibility, the market lowest. Two sources agreeing out of three never settles it; the odd one out is often the insight. A Conflict ends resolved, taken to the client, or carried into Explore as a bet. No open Conflict may sit under a final Brief.
5. **Confidence is rated by a person and checked by numbers.** `koru check INS-…` shows the signals: distinct participants, segments, methods, contradicting links, behaviour vs self-report. Flag mismatches ("High on one participant"). A weak Insight is narrowed by scale, frequency or impact, not thrown away. An Insight feeding an irreversible decision needs two methods or a second analyst.
6. **The path.** JTBD with forces (`jobs-to-be-done`, card JOB) → Problem in Who / What / Wow form (at most three, plus a Foundation Problem for legacy debt: `--field kind=foundation`) → HMW (title starts "How might we", links `reframes PRB-…`) → Opportunities (`kind: ux` or `ai`; for AI, run `sense-shape-steer` SENSE and write the AI Opportunity Statement).
7. **Brief.** `koru new BRF "…"`: problem, outcome, scope, out of scope, constraints. The engagement lead signs it; the client sponsor co-signs (`! koru sign BRF-001 --cosign --name "…"`).

## Pause-point checklists (killer items)

| Pause point | Check |
| --- | --- |
| Before fieldwork | Consent names the AI processor · data class set · research questions written · screener matches the Audience · guide reviewed for leading questions |
| After synthesis | Every Insight has a "because" · contradicting links shown · confidence signals match the rating · every quote verified (`koru quotes`) · tail report read · Conflicts resolved or carried |
| Frame exit | Context questions 1–5 answered · at most three Problems · every HMW cites a Problem · client sponsor has seen the playback · no-go considered |

## The gate

1. Run the **research-checker** agent on the Frame cards. Save its numbered findings to a file and record them: `koru review frame --checker research-checker --file <findings.md>`.
2. The person gives each finding a disposition in the REV card: fixed · accepted risk · deferred TKT-000.
3. `koru gate frame` shows the exit contract. When every line is ✓, a signer types `! koru gate frame --pass --name "…" --role "engagement lead"`.

## What the hooks will stop (and what to say)

Writing an Insight, setting confidence, signing, a paraphrased quote, a Data card without consent, reading originals or the private folder, synthetic Findings, citing a Hypothesis as support. When one fires, say what the rule protects in one line and give the exact command the person can type.

## Rigour scales with stakes

Fast is fine for reversible framing; an Insight that feeds an irreversible decision needs a second method or analyst. Say which one this is when you hand over.
