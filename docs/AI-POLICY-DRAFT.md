# AI & Project Data Policy — DRAFT for leadership review (not yet policy)

One page. Ratify, adjust, or strike — but decide; the skills already enforce these defaults.

## The rule in one line

A project is a project — internal or client, same treatment. Each project's data rules live in its `ux/project-context.md`, where every SkillCloud skill checks them; the default is **standard**, and restrictions exist only when a contract imposes them.

## The two states

**Standard** — every project, unless a contract says otherwise.
Work normally with AI tools. People data is de-identified on intake as a standing habit — names become codes, identifiers get stripped, with the sweep adapted to the project's industry (healthcare adds the PHI/Safe Harbor set; finance adds account/KYC data). Nobody is asked to classify projects or request permission.

**Restricted** — only when a contract or NDA explicitly bars AI processing of project material.
Recorded in the project's `ux/project-context.md` by whoever knows the contract, with its source ("MSA §7"). SkillCloud skills then refuse to process that project's material and say why. General craft, templates, and fully synthetic work remain available.

## Always, regardless of project

- Never put credentials, secrets, contracts, or live production datasets into any AI tool.
- A stricter contract or NDA supersedes this policy.
- One project per folder and per session — project contexts never mix.
- Slip-ups (sensitive material pasted where it shouldn't go) are reported same-day to the project lead. Fast honesty is policy; quiet cleanup is a violation.

## Ownership

- Restrictions recorded by: the project lead, at project start, revisited on contract change.
- Questions and violations route to: **[owner — TO FILL]**.
- This policy ships inside SkillCloud (`docs/AI-POLICY-DRAFT.md`) and is enforced in-tool by the `engagement-guardrails` skill.

| | |
|---|---|
| Approved by | ______________________ |
| Effective date | ______________________ |
