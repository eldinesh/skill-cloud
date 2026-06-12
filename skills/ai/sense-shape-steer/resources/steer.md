# STEER — Day 4 playbook

*How will we know the AI is actually working as intended?* STEER defines how the AI experience is evaluated, governed, and improved in use — accuracy thresholds, risk boundaries, usability expectations, trust indicators, learning loops — so behavior stays intentional, explainable, accountable. Not a checklist: structured questions paired with metrics, designed to force clarity before build.

**The continuous improvement loop:** DEFINE METRICS → (LAUNCH →) GATHER FEEDBACK → IDENTIFY GAPS → REFINE SYSTEM → REPEAT.
**Four elements:** Evaluate (define "good", set quant+qual metrics, baselines/targets) · Gather (explicit feedback + implicit signals + system monitoring) · Analyze (patterns, gaps, root causes) · Refine (better model, better UX, better guardrails).

**Why it matters — the myth of "ship and done":** AI behavior emerges in real use; user needs evolve; edge cases appear after launch; context changes (new data, users, regulations). Three critical truths: AI gets better with feedback · early assumptions break down ("this edge case won't happen" — it happens constantly) · in high-stakes domains small improvements compound (the shipped example is healthcare: 5% accuracy gain = thousands of better diagnoses — translate to the project's domain).

**STEER vs traditional evaluation:** measure accuracy/bias/trust/edge cases (not feature usage) · continuously, before users see problems (not post-launch) · feedback from users *and* the system's own metrics · continuous compounding horizon (not one release) · success = AI gets smarter and users trust more · failure consequence = harmful advice and lost trust, not just "feature doesn't work."

## Before the metrics
Review the AI concept from SENSE and SHAPE — STEER assumes the experience is clear. Emphasize outcomes, not implementation; usefulness and trust, not just binary correctness. Use examples to guide thinking; capture measurable criteria; accept that some uncertainty remains and document it intentionally. The questions adapt: a healthcare assistant, a workflow automation, a financial copilot, a generative content tool share the structure — thresholds, risks, and metrics vary by domain.

## The metric worksheets (Key Questions / Why / Tools / candidate metrics / example target)

**1. ACCURACY — how well does AI perform?**
KQ: Overall accuracy (what % of outputs are correct)? By category — does it perform better on some? By demographic — bias across populations? By complexity — does it struggle with edge cases? · Why: inaccurate AI undermines decisions and the people relying on them; look at edge cases, complex inputs, failure *patterns*, not just averages — review real examples, compare to expert judgment, track error patterns, re-test after changes. · Tools: confusion matrices (TP/FP/TN/FN), ROC curves (sensitivity/specificity trade-off), calibration curves (predicted probability vs actual). · Metrics: diagnostic/recommendation/prediction/classification accuracy. · Ex target: "Medication name & dosage accuracy across submitted notes — >95%."

**2. FAIRNESS — does AI work for everyone?**
KQ: Which demographics do we monitor? What counts as "equal" performance (same accuracy? same error rates?)? Where do disparities appear? What's acceptable vs not? · Why: AI that works on average but fails minorities is discrimination at scale; quality must not quietly degrade for specific users. · Tools: stratified analysis by demographic, fairness metric libraries, bias audits. · Metrics: demographic parity, equalized odds, calibration fairness. · Ex target: "No demographic group (language, accent, visit complexity) shows >10% lower documentation quality."

**3. USABILITY — can users actually use it?**
KQ: Do users understand what AI is doing? Trust the output? Feel in control? Does AI fit existing workflows or force new ones? Do advanced users need different interfaces? · Why: perfectly accurate AI is useless if users can't understand or trust it. · Tools: user testing/observation, task success rates, time-on-task, SUS, qualitative feedback. · Metrics: task completion rate, time to decision, error rate (misinterpreting AI output), workflow disruption. · Ex target: "80% of physicians complete note review in under 5 minutes within 60 days of onboarding."

**4. TRUST — do users believe it?**
KQ: Adoption growing or declining? When users reject AI — disagree, don't understand, or don't trust? Do segments trust differently? Trust decay over time? · Why: adoption and effectiveness depend on it; *if users override AI constantly, something is broken even if accuracy looks fine.* · Tools: usage analytics, adoption funnels, NPS, trust surveys, qualitative interviews. · Metrics: adoption rate, reliance rate (accept suggestions), rejection/override rate, satisfaction, confidence statements ("I trust this system", 1–5). · Ex target: "Opt-out rate after first 30 days <10%; if higher, investigate confidence flagging or edit friction."

**Safety & risk and operational health** are tracked through the levels below (and the error/performance feedback loops): define what must never happen (high-risk errors, hallucination rate, confidence misalignment, autonomy limits, escalation behavior) and whether the system performs in real conditions (latency, failure rate, cost per use, degradation under load).

## What specific metrics should you track? (three levels)
- **LEVEL 1 — CORE PERFORMANCE (top priority):** accuracy on primary task · fairness across key demographics · safety incidents (count and severity) · adoption among target users.
- **LEVEL 2 — OPERATIONAL HEALTH (monitor):** latency/response time · false positive/negative rates · user satisfaction (NPS) · trust indicators (adoption, override rate).
- **LEVEL 3 — INSIGHTS (for learning):** where do errors cluster (conditions, demographics, use cases)? when do users distrust (where does adoption drop)? what's the feedback quality (are corrections reliable)?

Don't measure everything. Start with Level 1 solid and fair, add Level 2 for health, use Level 3 for discovery — "where are the hidden problems?" Rare cases, underrepresented populations, unusual edge cases: where biases hide. Look actively.

## Designing the feedback loops (how information gets back into the system)
1. **Explicit (users tell you):** ratings ("how helpful?", 1–5), surveys ("did you trust the recommendation?"), free-form comments, thumbs up/down. Implement: post-interaction ratings, periodic surveys, one-click in-app reporting, optional detail for power users.
2. **Implicit (you observe):** click and rejection patterns, dwell time on explanations, modification rate (how often users edit AI output before using), task completion. Implement: event analytics, A/B tests, behavior cohorts, funnel analysis. Ex: "40% of users modify AI suggestions before using them — why? Output close-but-not-right? Trust? Domain factors not captured?"
3. **Error feedback (when AI gets it wrong):** failed predictions, user corrections, escalations, safety incidents. Implement: systematic logging of AI outputs vs actual outcomes, manual review of reported errors, root-cause analysis (model, data, or UX?), categorization (edge case / systematic bias / misunderstanding). Ex: clinician corrects an AI diagnosis → correction logged → feeds model training → system improves.
4. **Performance feedback (metrics tell you):** accuracy trends, per-segment performance, latency, resource use. Implement: continuous dashboards, automated alerts on degradation, regular evaluation reports, benchmarking against baselines. Ex: accuracy 94%→89% in a week → alert → investigation → root cause: new data distribution → retrain.

Also decide: what counts as feedback, what must NOT be learned automatically, when expert review is required, how often the AI is evaluated/retrained, whether user feedback is clear and reliable enough to learn from. *Without intentional loops, AI stagnates or degrades.*

## Directional thresholds, not decimal points
You won't leave the sprint declaring "accuracy must be 73.3%". You're defining what *good enough* means here: Is 60% acceptable? Probably not. Is 95% required? Maybe, if high-risk. Is <5% high-risk error rate non-negotiable? Possibly. Precision comes later from measurement and real use; the *expectations* must be explicit now — otherwise teams over-engineer or ship without clarity.

**North-star statement:** "We will know this AI experience is working when [the defined quality bar] is achieved, [our risk boundaries] are respected, and real-world users provide [clear signals] for improvement."

## Common STEER mistakes (and fixes)
1. **Measuring everything** (50+ metrics, analysis paralysis) → pick 5–7 key metrics, master those, add as you mature.
2. **Vanity metrics** (activation, page views; ignoring accuracy in favor of adoption) → track what correlates with actual value.
3. **Reacting without understanding** (metric drops → change something) → Data → Diagnosis → Action; never skip diagnosis.
4. **Ignoring qualitative feedback** ("metrics look good" but users say it's hard to use) → combine quantitative + qualitative; both matter.
5. **Feedback loop without closure** (gather → analyze → nothing; users feel unheard) → close the loop: tell users what you learned and changed.
6. **Shipping without STEER** ("we'll add monitoring after launch") → design STEER from day one; monitoring built in before launch.

## Artifact
`ux/sprint/steer-plan.md` — chosen metrics by level with directional thresholds, feedback-loop design, must-never-happen list, evaluation/retraining cadence, north-star statement. Feeds `/usability-test-plan` (pass thresholds) and `/design-qa-checklist`.
