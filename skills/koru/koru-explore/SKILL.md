---
name: koru-explore
version: 3.0.0-alpha.1
bundle: koru
stage: explore
description: |
  Koru stage 2, Explore: real divergence judged on hard cases. People seed directions before AI
  shows any, Claude widens the set, the design lead cuts to two Directions that differ in
  behaviour, each is built as a scoped interactive HTML prototype with hard cases, tested
  against thresholds saved in advance, and chosen by a one-Approver Decision with the client's
  commitment.
  Use when asked to "explore directions", "generate concepts", "build the prototypes", "test the
  directions", "pick a direction", or "get us to the Explore gate".
  Proactively invoke when a Koru project has passed the Frame gate and no Direction cards
  exist yet. (skillcloud)
---

## Preamble (run first)

```bash
command -v koru >/dev/null 2>&1 || koru() { node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" "$@"; }
koru where --brief 2>/dev/null || echo "NO_KORU_PROJECT"
koru gate frame >/dev/null 2>&1 && echo "FRAME: ready or passed" || echo "FRAME: not passed"
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `FRAME: not passed`: say so plainly. People may start anywhere, so you can still help, but every Direction will show as resting on assumptions until the chain fills in, and the Explore gate cannot pass before the Frame gate.

## Contract
- **Consumes:** final BRF, PRB, HMW, INS, JOB and CON cards; IDE cards only after E2; `koru/engagement.md` switches (`starting_point`, `product_state`, `design_system`, `ai_in_product`, `deliverables`, `client_maturity`); `koru/design-system.md`; `ux/project-context.md` when present (data rules per `engagement-guardrails`)
- **Produces:** DIR cards (one or two), SCR cards, prototypes in `koru/deliverables/`, a DEC choosing the Direction, a REV for the gate
- **Next:** the direction checker, the Explore gate, then `koru-harden`

# Explore: real divergence, judged on hard cases

Explore's main risk is settling on the first idea, and AI makes that faster. The fix is an ordering rule: people work alone before the group discusses, options are compared side by side, and success criteria are set before anyone sees results. Keep the steps in this order.

## Who does what (AI Fluency: delegation)

| Step | Claude | Shared | People only |
| --- | --- | --- | --- |
| Starting point | Proposes from the switches | | Engagement lead decides (a Decision) |
| Context pack | Assembles it and the manifest | | |
| Seeds | Nothing until every person has seeded | | Each designer's seed |
| Widen | Maps seeds, generates 4–6 more | | Design lead cuts to two |
| Build | Builds scoped HTML prototypes with hard cases | Designer directs and refines by hand | |
| Test and choose | Writes the test plan, logs feedback | | Thresholds, running tests, the Decision |

## Entry and exit

- **Entry:** Brief and research pack final; every HMW cites a Problem.
- **Exit:** the chosen Direction final with test evidence; a Decision with one Approver that chose it; the client's commitment (Playback Zero) recorded on that Decision. Never more than two Directions.

## E0. Starting point

Propose where Explore starts from the `starting_point` and `product_state` switches; the engagement lead decides, logged as a Decision (`koru decide new "Where does Explore start?"`) because it changes everything after it.

| Starting point | Starts from | Heuristics |
| --- | --- | --- |
| Redesign or legacy shell | Heuristic audit of today's product (`heuristic-evaluation`) plus task analysis; problems become cards, not screens to copy | Nielsen's 10; for AI features, Microsoft's 18 human-AI guidelines |
| Feature add | Existing flows and patterns; divergence happens inside them | System-fit check against the product's own patterns |
| New product | Problems and HMWs; competitors only as named patterns | Nielsen's 10; Google PAIR for AI |
| Client concept (`client_maturity: client-led`) | The reverse-traced problem; their concept becomes Direction A | The same, plus the trust audit for AI concepts |

## E1. Design context pack and behaviour first

Assemble the pack from **final** cards only: the two or three HMWs for this round, the task reality (today's flow with users' workarounds), the hard cases from research, constraints and open bets. Write a short **context manifest** in chat listing what you may and may not see at each step. During divergence, exclude look and feel, the client's Idea cards and competitor screens. Picking colours from a design system is fine; picking solutions from one is the bias.

For AI in the product (`ai_in_product` not none): rate each pain point on SHAPE's dimensions and choose one or two patterns per challenge (`sense-shape-steer`, Shape), plus trust builders (caveat, consent, disclosure, footprints). Generate likely failure scenarios with the HAX playbook; each becomes a hard case.

## E2. Human seeds first

Before you show any idea, ask each designer to write a **seed** alone: a rough sketch (paper photo or crazy eights), one sentence for the core idea, the HMW it answers, the bet it makes, and one thing it must not do. A solo designer writes two or three. Coach point: do not offer ideas here, even if asked; offer the seed format and a question instead.

## E3. AI widens; the team cuts

1. Map the seeds on four axes: which HMW, AI mode, flow structure, mental model (for legacy products, **fit or leap**).
2. Generate four to six more seeds for the empty spaces. Now bring in the client's Idea cards, so the set holds two to four real options.
3. For each surviving seed: a hypothesis ("We believe … if … with …") and an assumption map ranking each assumption by importance and evidence.
4. The design lead cuts to two Directions that differ in **behaviour**, not looks. Make each: `koru new DIR "…" --link "serves HMW-001: why" --field seed_author="<the person>"`. Fill core idea, hypothesis, where AI sits, biggest risk, test question, hard cases.
5. Save the threshold **before** any test: `koru threshold DIR-001 --set "7 of 10 complete the task without help"`. The hooks refuse a threshold changed after saving and any result without a saved threshold.

## E4. Build against hard cases

**Lock scope first.** List the 3 to 5 Screens, the data and the interactions in chat; build nothing else. Then load `koru-deliverables` for how to build.

- **UX track.** One polished, interactive, self-contained HTML file per Direction in `koru/deliverables/<direction>/index.html`, built on the project's design system (`koru ds inline <file>` adds it; with no client system yet, `koru-neutral`, so behaviour is judged before paint). The design-system hook refuses raw values and components outside the system. Declare the hard cases as states: `<meta name="koru-states" content="STA-…">`, an element with `data-koru-state` for each, and each one opens from the URL (`?state=STA-004`) so `koru audit` can check it. Include at least three hard cases as switchable states: workaround, scale (1 and 10,000 rows), wrong (bad data or a wrong AI suggestion), permission, interrupted, first time. One SCR card per screen: `koru new SCR "…" --link "implements DIR-001: …" --field flow_step=1 --field ds_version=<from design-system.md>`.
- When two iterations differ only slightly, stop prompting and tell the designer it is time to refine by hand.
- **Visual track,** in parallel: one or two key screens explore look and feel on the client's system, brand or an open-source system; the client approves the theme; the chosen Direction takes it on at the end of E4.
- **Figma** (when `deliverables` includes figma and the contract tier allows it) receives frames as the review wall. Each write asks a person first. Hand edits there come back as Decisions on the Screen.

## E5. Test and choose

1. Write a 10-minute test plan from each test question with `usability-test-plan`. At least one task puts a hard case in front of users. Test users match the Audience.
2. People run the sessions. Log feedback on ease, transparency, usefulness and delight. Type stakeholder feedback as evidence, constraint, new idea or preference; it changes a Direction only through a Decision with a reason.
3. Record results: `koru result DIR-001 "6 of 8 completed without help"`.
4. The choice is a Decision: `koru decide new "Which direction goes forward?" --link "cites DIR-001: …"`. Write the factors **before** the options table; name one Approver; keep the rejected Direction. Mark the winner `chosen: yes` on its DIR card.
5. Client work ends Explore with **Playback Zero**: the client commits to the journey (record it in the Decision's `client_commitment`), and Problems freeze unless a superseding Decision reopens them. A test that contradicts an Insight raises a Decision against that Insight.

## Pause-point checklists (killer items)

| Pause point | Check |
| --- | --- |
| Before building | Every designer seeded before AI · two Directions differ in behaviour · client ideas are in the option set · scope locked · hard cases come from research |
| Before testing | Thresholds saved (`koru threshold`) · one hard case in the test · test users match the Audience |
| Before choosing | Factors written before scoring · one Approver named · rejected Direction kept |

## The gate

Run the **direction-checker** agent on the DIR and SCR cards and the prototypes; record with `koru review explore --checker direction-checker --file <findings.md>`; people give dispositions; `koru gate explore`; ask the design lead "Pass the explore gate?" with options and run `koru gate explore --pass --name "…" --role "design lead"` on yes.

## What the hooks will stop

Editing a saved threshold, writing results by hand, citing a Hypothesis as support, Figma writes the contract forbids, signing anything. Explain the rule in one line and give the exact command.
