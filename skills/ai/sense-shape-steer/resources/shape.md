# SHAPE — Days 2–3 playbook

*SENSE understood the problem; SHAPE turns insights into AI experiences.* Day 2 defines AI behavior; Day 3 translates behavior into design. SHAPE is the bridge between AI capability (what's technically possible), user value (what's actually needed), and tangible UX (what's usable and trustworthy). Think of it as translation work — experience architecture, not just UI design.

## Day 2 — define the behavior

### 1. Ground in the core problem
Map three things from SENSE: user types impacted, key pain points, current workarounds. *Workarounds matter most — they show where users already compensate for system gaps and where AI must be careful, supportive, or optional.*

### 2. Prioritize pain points for AI solutioning
Pick problems/moments that are **repetitive, data-heavy, or prone to delay**. Treat each chosen pain point as its own design problem.

### 3. Per-pain-point structured questions (five dimensions)
For each prioritized pain point assess: **user clarity** · **AI context completeness** · **urgency** · **disruption risk** · **risk radius**. This avoids using AI where it doesn't belong and over-automating what should stay under user control. Map results to the appropriate AI pattern and behavior.

### 4. The AI Pattern Selector

**The seven interaction patterns** (reusable solutions to common AI UX problems — the building blocks of AI interfaces):

| Pattern | What | Solves | Best for | Example |
|---|---|---|---|---|
| Suggestive Prompts | Starter questions/examples to guide users | Blank-canvas paralysis, unclear capabilities | Conversational, Co-pilot | ChatGPT's "Help me plan…" |
| Rationale Surfaces | Reveal reasoning, sources, logic | Black-box decisions, trust gaps | All modes where trust is critical | Perplexity's cited sources |
| Inline Smart Fields | Contextual AI suggestions inside the existing workflow | Interrupting flow to get AI help | Co-pilot, Ambient | Gmail Smart Compose |
| Refinement Controls | Edit, regenerate, adjust AI output | Imperfect first attempts; iteration | All modes, esp. Co-pilot | "Regenerate with different style" |
| Memory & Context Recall | Maintain preferences/state across sessions | Repetitive inputs, context loss | Conversational, Ambient | "Continuing from yesterday…" |
| Confidence Indicators | Show how certain AI is | Users don't know when to trust | Agentic, Co-pilot (high-stakes) | "High confidence (92%), 1,200 similar cases" |
| Agent Preview / Oversight | Show planned actions before execution | Fear of autonomous action | Agentic (essential) | "About to archive 15 emails. Review?" |

**Worksheet (4 steps):**
1. **Identify your UX challenges** — from the AI Opportunity canvas, the 3 biggest UX challenges users will face. Ex: "Trust in AI accuracy. Physicians won't use a tool they can't trust… users need to quickly identify which parts of the draft are reliable vs. uncertain."
2. **Map patterns to challenges** — Challenge → Pattern → *Because*. Ex: trust in accuracy → Confidence Indicators → "physicians see exactly what to scrutinize — section-level amber highlights direct attention precisely where needed."
3. **Select your primary patterns (pick 1–2)** — per pattern: *Pattern Name* (which challenge does it solve? why is it the best solution?) / *How we'll implement it* (be specific — where in the flow? what will it look like?) / *What does success look like?* Ex: amber highlight on any section below 85% confidence; flagged section shows the AI text, a confidence badge, and the source transcript snippet on tap; success = physicians correct flagged sections at 80%+, post-submission amendment <5%, physicians report feeling "in control".
4. **Pattern combination check** — Do the chosen patterns work together? (ex: indicators draw attention → rationale explains the flag → refinement controls let the user act; risk: over-flagging undermines the system). **If patterns conflict, how will you resolve it?** (ex: Confidence Indicators vs. review friction → minimum flagging threshold, monitor flags-per-note, recalibrate above 3–4. *More flags ≠ more trust.*) **Are you missing any critical patterns?** (classic: "We're doing Agentic mode but forgot Agent Preview.")

**✅ PATTERN SELECTION CHECKPOINT — ready to storyboard when:** 1–2 primary patterns identified · each solves a specific UX challenge · you can explain WHY each is necessary · you know WHERE in the flow each appears · conflicts checked · trust-building patterns considered (confidence, rationale, preview).

Record choices in the **Key Decision Summary** as you go — per decision: *What we decided / Why / Alternative considered / Risk & trade-off*. Ex: "Always require explicit physician sign-off before anything enters the EHR — no exceptions / clinical notes affect patient safety and liability; accuracy rates don't justify removing human accountability / alternative: auto-submit if unedited for 10 min / risk: mandatory sign-off adds a step — if review UI is slow, physicians rubber-stamp; review UX must be fast."

## Day 3 — translate behavior into design

### 5. AI Touchpoint Mapping (swimlanes)
Map the interaction between system, AI, and humans. Lanes: **Human** (user actions in sequence) above the line; **AI** below, one row per AI mode in play; arrows where user actions trigger AI actions and AI hands back. Capture: user actions through the journey · AI actions per mode · complex decision points · error & recovery scenarios. *Keep the data context source ready.* Classify each moment: **high risk** → less AI autonomy, high human control · **medium risk** → AI suggests, human approves · **low risk** → can be fully automated. Also hunt: data gaps, and how the system gathers user feedback.

### 6. AI Prototyping
Design or engineering picks it up (per the post-SENSE reflection): quickly mimic AI **reasoning, tone, confidence, and workflow** without engineering effort; validate with stakeholders/users; iterate. Answer three things: Where are the low-confidence areas in the AI workflow? When/where is user intervention required? Where are the data gaps and how do we address them?

### 7. Storyboard the journey
A visual narrative of the complete experience — 6–10 frames. Per frame: **Visual** (sketch/wireframe/description) · **Title** (name the moment) · **Annotations** (what's happening and WHY it's designed this way). Grid rows per frame: *Story Frame · User Action ("what does the user do?") · User Goal ("what are they trying to accomplish?") · Context ("where is the user? what do they already know?") · Design Decisions ("why this moment? what makes AI clear? which pattern(s) used?")*.
The six essential moments to cover: **Entry Point** (trigger, context, goal) → **AI Listening** (input, available context, visible vs invisible) → **AI Reasoning** (behind the scenes, processing time, what's shown) → **AI Responding** (output format, patterns employed) → **User Control** (refine/override, adjustable parameters) → **Resolution** (outcome, goal achieved, what's next). Low-fi is fine — clarity over beauty. Annotate where each pattern appears, AI's role per step, trust-building moments, potential failure points.

**🟧 TRUST & TRANSPARENCY CHECKLIST** (audit the storyboard against the four principles):
- *Predictable:* user knows what AI will do at each step · behavior consistent with expectations · capability scope clear · visual cues distinguish AI actions from user actions
- *Controllable:* user can override/reject AI at key decision points · clear undo/back paths · user commands final outcomes · AI doesn't act without user awareness (unless Ambient mode)
- *Explainable:* reasoning/sources shown where appropriate · confidence indicated for uncertain outputs · user can see what data/context AI used · decision logic transparent
- *Conversational (if applicable):* refine output through dialogue · context maintained across interactions · natural follow-ups · iteration encouraged, not just accept/reject

**✅ STORYBOARD COMPLETION CHECKPOINT — ready to prototype/wireframe when:** 6+ frames covering the journey · every frame annotated with reasoning · AI patterns explicitly marked · user control points visible · trust mechanisms present · at least one failure state addressed · every major decision explainable · someone outside the team could understand the flow.

### 8. Pre-wireframe gate, then wireframes
Confirm all eight: **user goals · AI capability · inputs needed · output format · interaction flow · state and memory · user control · trust and limits.** Then low/mid-fi wireframes for early validation — test ideas quickly, high-level solutions first, validate with stakeholders or users before detail.

### 9. Validate (test protocol)
1. **Create** — clickable prototype, detailed walkthrough, or paper prototype with simulated interactions; show how AI state and decision boundaries are conveyed. 2. **Exchange** — swap with another team; give context (mode? problem? patterns?) but don't over-explain. 3. **Test** — they drive, you observe; resist justifying; follow-ups after. 4. **Gather feedback** on four axes: **Ease** (intuitive? logical flow?) · **Transparency** (do I understand what AI is doing? is confidence clear?) · **Usefulness** (solves the stated problem? better than alternatives?) · **Delight** (moments of surprise? smart or just functional?). 5. **Refine** — synthesize, top 3 improvements, implement at least 1, document what you learned.

## Artifacts
`ux/sprint/pattern-decisions.md` (worksheet results + key decision summary) · `ux/sprint/storyboard.md` (frames with annotations) · `ux/sprint/touchpoint-map.md` (lanes, risk tiers, data gaps). Standard headers, `sources:` back to the opportunity statement.
