---
name: engagement-guardrails
version: 1.1.0
bundle: core
description: |
  The data rules for project material in AI tools — the same for every project, no
  client/internal distinction. De-identification habits by industry (healthcare set shipped),
  restriction handling when a contract bars AI processing, and cross-project isolation.
  Also creates the project's ux/project-context.md keystone file.
  Use when asked "can I use AI on this material", "what are the data rules here",
  "set up project context", or "new project setup".
  Proactively invoke when someone starts processing project material in a project that has
  no ux/project-context.md. (skillcloud)
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

**A project is a project.** Internal product, client engagement, side initiative — same treatment, same pipeline, same habits. There is no internal/external classification, and nothing ever asks the user to make one. The only thing that varies is recorded in one place: the project's `ux/project-context.md` — its **domain** (which adapts examples and identifier sweeps) and its **data rules** (which are "standard" unless a contract says otherwise).

## The data rules

**standard** — the default for every project, no questions asked.
- Work normally. De-identify people data on intake as a standing habit: it costs nothing and ages well.
- Never paste credentials, secrets, contracts, or live production datasets into any AI tool. That's universal, not a project setting.

**restricted** — only when a contract or NDA explicitly bars AI processing of the project's material.
- Recorded in `project-context.md` by whoever knows the contract (project lead), with the source ("MSA §7"). Skills then refuse to process project material and say why.
- General craft, templates, the handbook, and fully synthetic stand-ins remain fine.

That's the whole model. No tiers to choose, nothing to interrogate. If no restriction is recorded, none applies.

## Setting up a project (creates the keystone)

When `ux/project-context.md` is missing, **create it and keep moving** — don't run a questionnaire:

1. Infer the project name and domain from the material at hand (a discovery transcript about warehouse cabinets → "Stock Area Administration, IoT/logistics"). State the inference in one line so the user can correct it.
2. Write the file from `resources/project-context-template.md` with defaults: `data rules: standard`, glossary seeded from whatever systems/orgs the material mentions.
3. Tell the user where it lives and that every SkillCloud skill reads it first — they (or the project lead) edit it when reality differs: a stricter contract, a brand library, sanctioned terminology.

Only ask a question when the material itself signals a restriction might exist (an NDA pasted into the transcript, "don't put this in AI" in the notes) — then ask that one question, not a form.

## Industry adaptation

The domain in `project-context.md` drives what "sensitive" means and which playbooks apply. Healthcare ships as the worked example throughout SkillCloud — adapt, don't assume:

| Domain | Extra identifier categories to strip | Shipped playbooks that apply |
|---|---|---|
| healthcare | PHI: MRNs, patient details inside stories, the HIPAA Safe Harbor set (full list in `interview-synthesis/resources/deidentification-checklist.md`) | clinical recruiting, consent, interruption heuristics, registers |
| finance / fintech | account and card numbers, transaction details, KYC data, balances tied to people | adapt the healthcare playbooks: same interruption/trust patterns, different identifiers |
| general / B2B SaaS | the universal sweep below — names, contacts, IDs | base playbooks as written |

Domain not in the table or unknown → infer from the material, state the inference, and apply the universal sweep plus common sense about what's sensitive in that industry.

## De-identification habits (every project)

People data is de-identified on intake, always:
- People → stable participant codes (`P01`, `P02`, …) with roles-only descriptors.
- Orgs, sites, systems → glossary codenames from `project-context.md` (invent and record one if missing).
- Strip or generalize: names, contact details, exact dates beyond month/year, geography below region, account/ID numbers, URLs/IPs tied to people, plus the domain's extra categories above.
- Never echo raw identifiers back in chat; never write the code↔person mapping into `ux/`.
- The working checklist for transcripts: `interview-synthesis/resources/deidentification-checklist.md`.

**Screenshots and recordings:** live systems — including staging environments — often display real user data (in healthcare, PHI). Blur, crop, or rebuild with synthetic data before AI processing or artifact embedding.

## Cross-project isolation

- One project folder (and its `ux/`) per project. Artifacts, glossaries, and codenames never migrate between projects.
- Switching projects → switch folders and start a fresh session. Don't carry Project A's context into Project B's chat.
- Durable project knowledge lives in that project's `ux/` folder, not in chat memory across projects.
- Insights belong to their project. Generalizable craft lessons travel; data, designs, and findings don't.

## If something slips

Pasted restricted or sensitive material where it shouldn't go? Stop the session, don't keep working "around" it, and report it the same day per `company-handbook` → security-and-data. Fast honesty is company policy; quiet cleanup is not.

## Handoff

After setup, suggest the natural entry point: `/research-plan` (research starting), `/design-brief` (design starting from existing research), `/topic-deep-dive` (unfamiliar domain — get a plain-language grounding first), or `/design-lead` to see the whole map.
