# SENSE — Day 1 playbook

*Uncover where AI adds real value and where human judgment must lead. Blends research, data mapping, and behavioral insight; defines what the AI should understand and why it matters.* Output: the **AI Opportunity Statement**.

Worked example threaded below: ambient clinical documentation for physicians ("the scribe"). Swap for the project's domain.

## Pre-sprint prep (~60 min, individual, before Day 1)

**Step 1 — ground yourself in the problem (before thinking about AI at all):**
1. What specific user, task, or workflow is broken or taking too long?
2. Where in that workflow does AI have the most realistic chance of making a difference?

The goal is a point of view, not final answers.

**Step 2 — role-specific prep:**
- *Everyone:* review existing research in the problem space (interviews, analytics, support tickets); note your top 3 user pain points in scope.
- *UX researcher & designer:* identify 1–2 existing user journeys/workflows where felt friction is highest; bring screenshots, flow diagrams, rough sketches.
- *Product manager:* document the business metrics most affected — specifics, numbers, trends, targets. Vague problems are hard to solve with AI.
- *AI engineers / developers:* note what data already exists (structured or not), existing AI integrations, AI capabilities already in the stack.

## The five parts (sticky-note rounds: write individually, then discuss)

### Part 1 — The problem Space (ignore AI completely)
- **Who are the users?** *[Be specific: job role, context, skill level]* — ex: "Physicians (PCPs & specialists) at large health systems"
- **Define the context** *[One clear sentence — what slows them down, frustrates them, or blocks them?]* — ex: "They see 20–25 patients a day and spend 2+ hours after clinic hours completing documentation in the EHR — commonly called 'pajama time'"
- **What's the core problem or friction point?** — ex: "They spend 5 to 8 mins piecing together latest info about the patient across 3 different tools for a 20 min visit — and still don't feel confident they have everything."
- **What's the current solution (if any)?** *[How do they solve this today? Why is it insufficient?]* — ex: "Manual EHR entry between or after visits, or voice dictation that still requires heavy editing. Both extend the workday and contribute to burnout."

### Part 2 — AI Opportunity
- **What specific task(s) could AI help with?** (in light of Part 1's pain points — where could AI bring relief, elevate the experience?) — ex: "Automatically listen to the patient–physician conversation, then generate a structured, EHR-ready clinical note (SOAP format) for the physician to review and sign off — cutting documentation time by over 80%."
- **What AI has / does not have access to?** (grounds the opportunity in current data boundaries; narrows scope)
  - *AI HAS access to* — ex: ambient audio from the exam room (with patient consent); patient demographics & visit reason from the EHR; visit type (new patient, follow-up, acute)
  - *AI DOESN'T HAVE access to* — ex: full longitudinal patient history (unless EHR-integrated); physician's clinical reasoning or differential diagnosis intent; non-verbal cues (exam findings not spoken aloud)

### Part 3 — AI Experience Mode + AI Role
- **What AI mode is best suited for this product/experience?** (co-pilot / agentic / conversational / ambient — answer as *mode + because*; modes can combine) — ex: "Co-pilot — because AI drafts the note; physician stays in control and always reviews + signs before it goes in the EHR. Trust is critical — errors in clinical notes have real patient safety consequences." + "Ambient — the listening phase is ambient, but output still requires active physician approval."
- **What is the role of AI in the product/experience?** (outline, in as much detail as possible, where in the user journey AI assists and where it acts) — answer as a numbered journey, ex: "1. Starts visit → AI activates ambient listening, no interruption. 2. Conducts the encounter → AI transcribes in real time, identifies clinical concepts (symptoms, medications, diagnoses, follow-up plan). 3. Ends visit → AI generates a structured SOAP draft, highlighting low-confidence sections (amber) for physician attention."
- *Mode → model profile:* the mode chosen here is effectively the profile of model evaluated in SHAPE (co-pilot → lighter/faster; agent → strong reasoning + tool calling + multi-step). No need to name a model yet.

### Part 4 — Risks & Guardrailing (think as one team)
- **What could go wrong if AI makes a mistake?** — ex: "AI mishears a medication name or dosage — '10mg' becomes '100mg' — which makes it into the EHR and causes a prescribing error."
- **Validation & oversight needed** — ex: "Surface a confidence score per section (not an overall score — section-level is more actionable). Allow physicians to replay the audio clip for any flagged line to verify the source."
- **When should AI defer to humans?** — ex: "Always for diagnosis, treatment decisions, and medication orders. If audio quality drops below threshold mid-visit, AI should flag the gap in the note rather than guess."

### Part 5 — Success Metric (these evolve in STEER; reflect early)
- **User-facing success** — ex: "Physician completes documentation within 5 minutes of visit end — down from 25+."
- **Trust indicators** — ex: "Physicians accept AI-drafted notes with minor or no edits for 75%+ of encounters within 90 days."
- **AI Performance** — ex: "95%+ accuracy on medication names, dosages, and allergy capture across all encounters."

## Output — AI Opportunity Statement

> **For [USER TYPE] who struggles with [PROBLEM], our AI will [SPECIFIC AI TASK] by [HOW/METHOD]. This will work in [AI MODE] mode, where AI [AI'S SPECIFIC ROLE] and the user [USER'S SPECIFIC ROLE]. Success looks like [OUTCOME].**

Ex: "For outpatient physicians who struggle with spending 2+ hours daily completing clinical documentation after patient visits, our AI will automatically generate a structured, review-ready clinical note by listening to the patient encounter through ambient audio and extracting clinical concepts in real time. This will work in Co-pilot mode, where AI produces a full SOAP note draft with confidence-flagged sections and the physician reviews, edits where needed, and signs off before EHR submission. Success looks like reducing end-of-day documentation time by 80% while maintaining clinical accuracy and full physician accountability."

Artifact: `ux/sprint/opportunity-statement.md` (standard header; `sources:` = the five parts' answers).

## Post-SENSE reflection (20–30 min, individual, before SHAPE)

Answer per use case identified on Day 1:
1. **What does a good-enough AI interaction look like?** Plain language, no technology — the experience as the user would feel it. What do they do? What does AI do in response? What signals it worked?
2. **What data does the AI need, and do we have it?** Go deeper than Day 1 — this is critical. If the data doesn't exist, the prototype needs a workaround: synthetic data, curated sample, or a manual input step.
3. **Should a designer prototype this, or an engineer?** Not hierarchy — right tool for the job. Live model/API/real data → engineer leads. No-code AI tool or design-to-code platform → designer can. Either path is valid; decide before SHAPE begins.
