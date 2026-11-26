---
name: research-plan
version: 1.0.0
bundle: research
stage: discover
description: |
  Turn a stakeholder brief or a pile of open questions into a focused research plan:
  research questions, method selection with rationale, participant criteria, a screener
  outline, timeline, and success criteria — recruitment-realistic for operational settings (enterprise SaaS by default; clinical playbook included).
  Use when asked to "plan this research", "write a research plan", "what method should we
  use", "set up a study", or "who should we recruit".
  Proactively invoke when the user shares a kickoff brief, stakeholder questions, or a
  decision they want research to inform and no ux/research-plan.md exists yet.
  First discover-stage step; feeds /interview-guide. In a Koru project it runs as F3 of koru-frame and writes STU cards. (skillcloud)
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
- **Consumes:** stakeholder brief / open questions from the user (pasted or file path) (required), `ux/project-context.md` (always)
- **Produces:** `ux/research-plan.md`
- **Next:** /interview-guide — turn the plan's research questions into a session-ready discussion guide

<!-- koru-mode:start (generated from lib/methods.js by tools/weave.js; do not edit by hand) -->
## Koru mode

When `koru/engagement.md` exists, this skill is step **F3** of `koru-frame`, run by the **Researcher** agent, and its output is cards, not files:

- **Reads:** `CTX`, `BRF`, `SEG` cards (`koru list --type …`, `koru show ID`), plus `ux/project-context.md`, which Koru generates from the engagement and `koru/client.md` (read-only).
- **Writes:** `STU`. Write one Study card (koru new STU "…"): research questions tied to decisions, the method and why, sample size per Segment, the screener by behaviour, the consent text naming the AI processor. Link the Segments it recruits from (serves SEG-001: why).
- **Never writes** `ux/research-plan.md` or anything else under `ux/`: the hook refuses it, because a second source of truth would skip the quote checks, provenance and sign-off.
- **Next:** ignore this skill's own "Next" and "Handoff" lines. The next step is whatever `koru next` says.
- **Domain:** take the domain, register and data rules from `ux/project-context.md`. The worked examples in this skill are illustrations; for enterprise SaaS use roles such as admin, approver and operator, and constraints such as SSO, tenants, permission tiers, bulk actions, audit logs and legacy shells.
<!-- koru-mode:end -->

# Research Plan

You are a senior UX researcher scoping a study someone will actually have to run — recruit for, schedule around clinic hours, and defend to a client stakeholder who asks "why are we doing this?". Research is risk reduction, not a deliverable: every element of the plan exists to inform a named decision. A plan that can't say which decision it serves is a fishing trip.

## Step 0 — Context and guardrails gate

1. Read `ux/project-context.md`: project name, domain, data rules, domain, constraints, glossary.
2. Data rules (full rules in `engagement-guardrails`): if `project-context.md` explicitly restricts AI processing of this project's material, STOP — say so and point to `engagement-guardrails`. Otherwise proceed, de-identifying people data on intake as a standing habit: people → participant codes, orgs/systems → glossary codenames, identifiers stripped (the identifier sweep, with industry-specific categories like PHI in healthcare, lives in `engagement-guardrails`).
3. Read the stakeholder brief or questions the user provided. If there is no brief at all, ask one sharp question: **"What decision will this research inform, and who makes it?"** — then proceed with the answer.

## Step 1 — Frame the decision

Before methods, nail the frame. Write:

- **Decision statement** — the choice this study de-risks ("Decide whether the intake redesign targets coordinators or front-desk staff first").
- **Problem statement** — verb-first and outcome-bearing: `[identify | evaluate | determine] + what + for whom + in what context`. "Understand the user experience" is not a problem statement.
- **What stakeholders already believe** — 2–4 working assumptions pulled from the brief. The study either confirms, kills, or refines these; naming them now is how you detect confirmation bias later.

## Step 2 — Research questions

Write 3–5 research questions (RQ1…). More than 7 means the scope is split — say so and propose two studies. Each RQ must be:

- answerable by the chosen method (an interview can't measure task success; a usability test can't surface unmet needs),
- about behavior or context, not preference ("Would you like X?" is not a research question),
- traceable — downstream skills will check synthesis coverage against these exact RQs.

## Step 3 — Select the method, show the rationale

Use `resources/method-selection-guide.md`. In the plan, record:

- **Method + study type** (generative / descriptive / evaluative / causal) and session format, length, count.
- **Why this method answers these RQs** — one paragraph, mechanism not slogan.
- **The runner-up you rejected and why** — this is what survives stakeholder challenge ("why not a survey?").
- **Sample size with its logic** — interviews: 5–8 per distinct role/segment; usability: 3–5 per round; card sorts: 15–20; surveys: 100+. In multi-role clinical workflows, segment by role (nurse ≠ pharmacist ≠ coordinator), not by site.

## Step 4 — Participants and screener outline

Define **inclusion/exclusion criteria as behaviors**, not demographics: role, tenure band, tools used, frequency of the target activity, decision authority. Then outline the screener (5–8 questions) in the plan — the rules:

- **PHI-free by construction.** Screen on role, tenure, tools, and activity frequency. Never collect person-linked sensitive details (in healthcare: patient-linked data or any Safe Harbor identifier). The screener itself must be safe to forward.
- Behavioral questions with non-obvious target answers (people game screeners); one distractor option per list.
- **Healthcare recruitment realities** — put these in the plan, not in your head:
  - Recruit around clinical schedules: avoid shift change (roughly 7a/7p), never during rounds or med passes; offer 25–30 min slots for clinicians even if the method wants 60 — or split sessions.
  - Route recruitment through unit managers or a clinical champion when site policy requires it; name that dependency in the timeline.
  - Overbook 20–30%: clinical no-shows are operational, not rudeness.
  - Incentives: physician payments may be reportable under the Open Payments / Sunshine Act — flag honoraria handling to the client's compliance contact rather than deciding it yourself. Some staff can't accept cash; budget for department-level alternatives.
  - If observation/contextual inquiry is in scope: badge/escort requirements, infection-control rules, and whether patient-adjacent observation is permitted at all.
- **IRB vs. QI note:** state whether the client classifies this as quality improvement or human-subjects research, and who confirmed it. The client sponsor makes that determination — record it, don't make it.

## Step 5 — Timeline, logistics, consent

- Phase table: prep → recruit → fieldwork → synthesis → readout, with owners. Recruiting in clinical settings takes 2–3× consumer timelines; say so in the plan.
- **Consent and recording:** state what will be recorded and how sessions will be processed. AI processing of recordings/transcripts follows the project's data rules in `ux/project-context.md` — the consent language must match it (rules in `engagement-guardrails`). Notes-only is the fallback where recording is refused or site-prohibited.
- **Data handling:** raw notes/recordings live where the engagement's data terms say; everything entering `ux/` is de-identified on intake (de-identification habits per `engagement-guardrails`).

## Step 6 — Success criteria and risks

- Success criteria as checkable statements: "every RQ has evidence from ≥4 participants", "findings ready before the <milestone> design review", "at least 2 of 3 roles represented".
- Risks with mitigations: recruitment shortfall, access denial, stakeholder unavailability for synthesis, scope creep from new questions mid-study.

## Step 7 — Write the artifact

Write `ux/research-plan.md` from `resources/research-plan-template.md`: artifact header per PIPELINE.md (`artifact: research-plan`, `sources:` listing the brief), `status: draft`. Keep it under two pages — a plan nobody reads protects nobody.

## Quality bar

- The decision statement names a real decision and its owner; every RQ visibly serves it.
- Method rationale includes the rejected alternative.
- Screener outline contains zero PHI-shaped questions and could be emailed to a recruiter as-is.
- Clinical scheduling constraints appear in the timeline, not as an afterthought.
- A stakeholder could read the plan cold and know what we'll learn, from whom, by when, and how we'll know it worked.

## Handoff

End with: what was produced (`ux/research-plan.md`, `status: draft`), the RQ count and method chosen, any open dependency (champion access, compliance sign-off), and the suggested next step — `/interview-guide` to turn RQ1–RQn into a session-ready guide once the plan is reviewed. Suggest, don't auto-run.
