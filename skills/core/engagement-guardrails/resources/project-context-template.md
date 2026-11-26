---
artifact: project-context
project: <project name or codename>
created_by: skillcloud/engagement-guardrails v<VERSION>
sources: [inferred from project material — corrections welcome]
status: draft
updated: <yyyy-mm-dd>
---

# Project Context — <project name>

> Every SkillCloud skill reads this file before touching project material. Keep it current; it outranks memory. A project is a project — no internal/external distinction; only what's written here varies.

## Project

- **Name / codename:** <use a codename if the data rules below call for one>
- **Domain / industry:** <e.g. healthcare, fintech, logistics, IoT — drives identifier sweeps and which playbooks apply; inferred from material if not stated>
- **What it is:** <one line>
- **Data rules:** standard *(default — de-identify people data on intake; no other restrictions)*
  <!-- If a contract bars AI processing, replace with: restricted — <what's barred>, source: <contract clause / who confirmed> -->

## Design & brand

- **Design system:** <library in code (repo, package) | Figma library only (file, variables) | none yet>. Where tokens and components live, and who owns them. (Every stage handles all three. With none, Explore starts on the starter tokens.)
- **Stack (for coded deliverables):** <the client's framework, component library, styling, test runner, or "default" (React + TypeScript + Vite)>
- **Accessibility bar:** <e.g. WCAG 2.2 AA; add 508/equivalents if the industry requires>
- **Voice & terminology:** <registers, banned/required terms — or "TBD">

## Constraints

- <environment realities that shape design: device classes, interruptions, compliance regimes, tech stack>

## Glossary (codenames — use these everywhere)

| Real thing (category only) | Codename |
|---|---|
| <the organization, if a codename is warranted> | <codename> |
| <primary system under design> | <codename> |

## Team (named people who sign: a role with no name means its gate can't close)

| Sign-off role | Name | Signs |
|---|---|---|
| Senior | <name> | the framing (brief) |
| Research owner | <name> | research plan (before fieldwork), research pack |
| Team lead | <name> | direction choice |
| Design lead | <name> | hardened design |
| Rulebook owner | <name> | rulebook checks, rulebook changes |
| Engineer | <name> | feasibility (Harden), handoff review (Ship) |

One person can hold several roles. These are agency staff or client approvers. Names here are fine. Research participants are never named anywhere.

## Stakeholders (roles only)

| Role | Involvement |
|---|---|
| <e.g. product owner> | <sponsor, weekly reviews> |

## Project state pointers

- Docs/research repository: <link>
- Figma project: <link>
- Tracker: <Jira / Linear project key, or none>
- Coded deliverable path: deliverable/
- Current focus: <one line, update as it changes>
