---
name: engagement-guardrails
version: 1.0.0
bundle: core
description: |
  The rules for client material in AI tools: the three engagement AI tiers (prohibited /
  limited / permitted), healthcare PHI de-identification habits, and cross-client isolation.
  Also creates the project's ux/project-context.md keystone file.
  Use when asked "can I use AI for this client", "what's the AI tier here", "set up project
  context", "is this allowed under the engagement", or "new client project setup".
  Proactively invoke when someone starts processing client material in a project that has
  no ux/project-context.md, or asks whether client data may be processed. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: that's expected here — creating it is this skill's job (see "Setting up a project").

# Engagement Guardrails

We work embedded inside client organizations, often in healthcare. What we may do with client material in AI tools is set **per engagement**, not per person, and it is recorded in one place: the project's `ux/project-context.md`. Every SkillCloud skill reads that file before touching client material. This skill defines the tiers, sets up the file, and answers "is this allowed?"

## The three tiers

**prohibited** — the engagement bars AI processing of client material.
- Do: use SkillCloud for general craft (templates, method guidance, company handbook), on fully synthetic stand-ins, or on your own non-client notes.
- Don't: paste, upload, screenshot, or describe-in-detail any client material into any AI tool. SkillCloud pipeline skills will refuse and point here.

**limited** — AI may process **de-identified** client material only. *This is the default for healthcare engagements unless the contract says otherwise, and the default whenever you're unsure.*
- Do: work with transcripts, notes, and screens **after** de-identification on intake (below). Keep the `ux/` folder de-identified end to end.
- Don't: paste live PHI/PII, real names, MRNs, schedules, or identifiable screenshots — even "just to clean them up". De-identification happens before AI processing, not by it, unless the engagement manager has explicitly approved intake-cleaning in writing.

**permitted** — the client has approved AI tooling in writing.
- Do: work normally. Still de-identify people data by default — it costs nothing and ages well.
- Don't: treat "permitted" as covering credentials, contracts, or patient records. It never does.

**Who sets the tier:** the engagement manager, from the contract/NDA. The tier and its source ("per MSA §7", "per email from <role>, May 2026") are recorded in `project-context.md`. A stricter client NDA always wins. Unsure → treat as **limited** and ask.

## Setting up a project (creates the keystone)

When `ux/project-context.md` is missing, offer to create it. Interview the user briefly — one question at a time, not a form:

1. Client codename (on limited/prohibited engagements the real name stays out of artifacts — pick a codename and use it everywhere)
2. Domain and product in one line
3. **Engagement AI tier + its source** (who confirmed it, where it's written)
4. Brand/design system (name, where tokens live)
5. Known constraints (a11y bar, compliance regime, tech stack realities)
6. Glossary seeds: codenames for sites, systems, and products that will recur
7. Stakeholders by role only

Write the file from `resources/project-context-template.md`, then run `mkdir -p ux` as needed. Tell the user: every SkillCloud skill now reads this first.

## De-identification habits (all tiers)

People data gets de-identified on intake, always:
- People → stable participant codes (`P01`, `P02`, …) with roles-only descriptors.
- Client orgs, sites, systems → glossary codenames.
- Strip or generalize the HIPAA Safe Harbor categories: names; geography below state; dates beyond month/year; phone/fax/email; SSN/MRN/account/license/device IDs; URLs/IPs; biometrics; photos; any unique identifier — including details about patients mentioned *inside* stories.
- Never echo raw identifiers back in chat; never write the code↔person mapping down in `ux/`.
- The working checklist for transcripts lives in `interview-synthesis/resources/deidentification-checklist.md`.

**Screenshots and recordings:** healthcare UIs routinely display live patient data — and *staging environments usually hold real data too*. Blur, crop, or rebuild with synthetic data before any AI processing or artifact embedding. A "quick screenshot to ask about spacing" is how PHI leaks.

## Cross-client isolation (embedded-contractor rule)

- One project folder (and its `ux/`) per engagement. Artifacts, glossaries, and codenames never migrate between clients.
- Switching clients → switch project folders and start a fresh session. Don't carry Client A's context into Client B's chat.
- Don't ask Claude to "remember" client specifics across engagements; durable client knowledge lives in that client's `ux/` folder only.
- Insights from Client A are Client A's property. Generalizable craft lessons are fine; their data, designs, and findings are not.

## If something slips

Pasted PHI or client-identifiable material outside the tier? Stop the session, don't keep working "around" it, and report it the same day to your engagement manager per `company-handbook` → security-and-data. Fast honesty is company policy; quiet cleanup is not.

## Handoff

After setup, suggest the natural entry point: `/research-plan` (research starting), `/design-brief` (design starting from existing research), or `/ux-pipeline` to see the whole map.
