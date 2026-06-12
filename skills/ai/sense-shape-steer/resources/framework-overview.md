# The Sense-Shape-Steer Framework — overview

A framework for the full AI design lifecycle: **Idea/Business → SENSE → SHAPE → STEER → Value.**

- **SENSE** — *See where human needs, data, and AI potential intersect.* Find the sweet spot between UX opportunities and AI opportunities. Identify where AI adds genuine value — and where human judgment must lead.
- **SHAPE** — *Define how AI behaves and how users stay in control.* Three interlocking moves: define the UX and AI, map the ecosystem of decisions, validate the experience — feeding Dev & AI Engineering, which turns intent into implementation.
- **STEER** — *Keep AI aligned as it learns.* AI Monitoring ⇄ AI Optimization, continuously, after launch.
- **CONCLUDE** — commit: a prioritized, feasible, owned, build-ready blueprint.

**This isn't linear** — teams loop through these phases. Understanding each one tells you where you are and what questions to ask.

## Why a new framework

Traditional UX: User → Interface → Action — predictable inputs, predictable outputs.
AI UX: User → AI → Dynamic Response → Action — context-aware, adaptive, uncertain. AI doesn't just ship features; it produces *behavior*, and behavior needs standards.

## The AI Design Sprint (the framework, time-boxed)

Turns an AI opportunity into a clear, build-ready product direction. Surfaces: What problem should my AI solve? What should it not touch? When does AI act and when does the human stay in control? What does *good* look like for accuracy, trust, usability?

| | Day(s) | Focus | Output |
|---|---|---|---|
| Pre-sprint | ~60 min, individual | Grounding + role-specific prep | A point of view to bring into the room |
| SENSE | Day 1 (90–120 min) | Problem space → AI opportunity → mode & role → risks → success | AI Opportunity Statement |
| SHAPE | Days 2–3 (90–120 min each) | Behavior: patterns, storyboard, touchpoints, prototype, wireframes | Validated storyboard + prototype + key decisions |
| STEER | Day 4 (90–120 min) | Metrics, thresholds, feedback loops | STEER plan ("good enough" defined) |
| CONCLUDE | Day 5 (1.5 h, collaborative) | Prioritize, feasibility, ownership, risks | Build-ready blueprint |

Format is flexible: lean it to 3 days or expand to 7 depending on the complexity of the AI opportunity and resources. (Defaults marked as defaults — tune per team.) **When Claude runs the framework with you (run mode), the calendar disappears: phases become gates you pass through in sequence, in one sitting or several.**

**Participants.** Core team, present throughout: UX researcher, UX designer, product manager, AI/ML engineer. As needed: business, backend engineering, SMEs, compliance/security.

## The four AI experience modes (chosen in SENSE)

- **Co-pilot** — AI assists, human decides.
- **Agentic** — AI acts autonomously within bounds.
- **Conversational** — AI engages through dialogue.
- **Ambient** — AI works quietly in the background.

Modes can combine (e.g., ambient listening + co-pilot output). The mode choice has direct model implications: a co-pilot that defers to a human can run a lighter, faster model; an agent needs strong reasoning, reliable tool calling, multi-step ability. Choosing the mode is effectively choosing the *profile* of model the team evaluates in SHAPE.

## The four principles of good AI UX (applied in SHAPE, checked everywhere)

The UX paradox of AI: the promise is that AI makes everything easier; the reality is it often makes things more confusing. Four interdependent principles fix that — great AI UX requires all four:

1. **Predictable** — users can build mental models. Clear capability boundaries, consistent behavior, explicit limitations, progressive disclosure. *Unpredictability is cognitive load: every "will this work?" loses the user.*
2. **Controllable** — users stay in command of outcomes. Show → Approve → Apply (not Apply → Discover); graduated automation (suggest → apply with review → fully automate); inline editing; persistent manual override; behavior settings. *Control = confidence.*
3. **Explainable** — AI reveals reasoning and sources. Progressive disclosure of reasoning, data sources shown, confidence indicators, counterfactuals, feedback mechanisms. *"Because the AI said so" isn't good enough.*
4. **Conversational** — iterative refinement with memory (which doesn't always mean chat). Follow-ups, session context, suggested next steps, mid-stream correction, flexible phrasing.

## Where the artifacts live

Run inside a SkillCloud project: everything lands in `ux/sprint/` (opportunity-statement, pattern-decisions, storyboard, touchpoint-map, steer-plan, blueprint), each artifact carrying the standard header and `sources:` trail. The blueprint feeds `/design-brief`; the STEER plan feeds `/usability-test-plan` and `/design-qa-checklist`.
