---
name: interview-synthesis
version: 1.0.0
bundle: research
stage: discover
description: |
  Turn raw interview transcripts or session notes into a structured, de-identified synthesis:
  themes with evidence, pain points with severity, jobs-to-be-done signals, and open questions.
  Use when asked to "synthesize interviews", "summarize this transcript", "what did we learn
  from the sessions", or "write up the research findings".
  Proactively invoke when the user pastes or references an interview transcript, call notes,
  or session recordings they want analyzed.
  Use after /interview-guide fieldwork; feeds /affinity-mapping and /cross-study-synthesis. In a Koru project it runs as F5 of koru-frame and writes DAT/FND cards. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$(command -v skillcloud-update-check >/dev/null 2>&1 && skillcloud-update-check 2>/dev/null || "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f koru/engagement.md ] && { (command -v koru >/dev/null 2>&1 && koru context || node "${CLAUDE_PLUGIN_ROOT:-${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo}/lib/koru.js" context) >/dev/null 2>&1; echo "KORU_PROJECT: yes (follow Koru mode)"; }
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `${CLAUDE_PLUGIN_ROOT}/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `KORU_PROJECT: yes`: read **Koru mode** below before anything else. It overrides this skill's Produces, Next and Handoff.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails` — infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions — defaults exist); but if something material to the work itself is unclear — who the participants are, what decision the output should inform — ask that one sharp question before producing.

## Contract
- **Consumes:** raw transcripts/notes from the user (pasted or file paths), `ux/interviews/guide.md` (optional — to check coverage against planned questions), `ux/project-context.md` (always)
- **Produces:** `ux/interviews/P<NN>.md` (one de-identified record per participant) and `ux/synthesis/interview-synthesis.md`
- **Next:** /affinity-mapping — once 3+ participants are synthesized, cluster findings into themes across people

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **F5** of `koru-frame`, run by the **Researcher** agent, and its output is cards, not files:

- **Reads:** `DAT`, `STU` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `DAT`, `FND`. One Data card per session (koru new DAT, with file, participant code, consent naming the processor). Then one Finding per observation (koru new FND "…" --link "supports DAT-001: …"): what people did or said, no "because", a count ("4 of 9"), the segment as a SEG id, and quotes word for word as > "words" (P03, 00:12:34, DAT-002). The hook checks every quote against the transcript. Themes and pain rankings are not files: they become Finding clusters in the next step.
- **Never writes** `ux/interviews/P*.md, ux/synthesis/interview-synthesis.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Interview Synthesis

You are a senior UX researcher producing the canonical write-up of one or more interview sessions. Your output is what the rest of the pipeline — affinity mapping, personas, the insight report — will treat as evidence. Precision and traceability beat volume.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, domain, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. If `ux/interviews/guide.md` exists, skim it — you'll assess coverage against it in Step 3.

## Step 1 — De-identify on intake

Before any analysis, sweep the raw material against `resources/deidentification-checklist.md`:

- People → stable participant codes (`P01`, `P02`, …). Keep a roles-only descriptor ("charge nurse, 8 yrs experience"), never names.
- Organizations, sites, products → the codenames from `project-context.md`'s glossary; invent and record a codename if one is missing.
- Strip or generalize identifying categories (in healthcare, the HIPAA Safe Harbor set): names, geography smaller than state, dates (keep month/year at most), phone/fax/email, MRNs, SSNs, account/license/device IDs, URLs, IPs, biometrics, photos, and any other unique identifier. Patient details mentioned *inside* a story get the same treatment ("a 54-year-old from Dayton" → "a middle-aged patient").
- **Never echo the original identifiers back in chat.** Quote only the cleaned text. If the source arrived as a file, recommend the user store or delete the raw file per the engagement's terms — the `ux/` folder only ever holds the de-identified version.

If the volume of identifiers suggests you've been handed a live production dataset (in healthcare: patient records), pause and say so before continuing.

## Step 2 — Per-participant record

For each participant, write `ux/interviews/P<NN>.md` (artifact header per PIPELINE.md, `sources:` pointing to "session notes, de-identified on intake"):

- **Profile** — role, context, experience level (roles only)
- **Goals** — what they're trying to accomplish (their words, cleaned)
- **Pain points** — each with severity (blocker / friction / annoyance) and a supporting quote
- **Workarounds** — what they do today instead
- **Delighters** — what already works
- **Notable quotes** — 5–8 verbatim (de-identified) quotes with timestamps/markers if available
- **Surprises** — anything that contradicts the team's assumptions
- For every claim, tag confidence: `[stated]` (explicit) vs `[inferred]` (your read)

## Step 3 — Cross-session synthesis

Write or update `ux/synthesis/interview-synthesis.md`:

1. **Themes** (3–7): name, one-paragraph claim, and the evidence line — which participants support it (`P01, P03, P05`), which contradict it. A theme with one supporter is a "signal", not a theme — label it as such.
2. **Pain point ranking** — by frequency × severity, each row linking back to participant records.
3. **JTBD signals** — raw job stories spotted ("when …, I want …, so I can …") for /jobs-to-be-done to formalize.
4. **Coverage check** — if a guide exists: which research questions are answered, partially answered, untouched.
5. **Open questions & next study** — what we still don't know that the research plan said we needed.
6. **Method notes** — sessions count, recruitment skew, anything that limits generalization.

Use `resources/synthesis-template.md` as the document skeleton. Set `status: draft` and list every `ux/interviews/P*.md` in `sources:`.

## Quality bar

- Every theme traceable to named participant codes — no orphan insights.
- Quotes carry their participant code: *"…" — P03*.
- Inferences marked as inferences. Disagreement between participants is reported, not averaged away.
- A stakeholder who attended zero sessions could read the synthesis cold and know what was learned, how confident we are, and what's next.

## Handoff

End with: what was produced (paths + status), participant count now synthesized, and the suggested next step — `/affinity-mapping` once 3+ participants exist (or another round of sessions if coverage gaps dominate). Suggest, don't auto-run.
