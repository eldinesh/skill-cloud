---
name: harden-review
version: 1.0.0
bundle: build
stage: harden
description: |
  Make the chosen direction hold up before Ship. Fills the role × action × state matrix
  screen by screen (empty, loading, error, success, partial, permissions, edge data, AI
  states), runs the rulebook check rule by rule, captures the engineer's feasibility limits,
  scans accessibility with real tools, and decides fix-here vs send-back-to-Explore.
  Use when asked to "harden this", "what states are missing", "run the rulebook check",
  "is this feasible", "edge cases", or "is it ready for Ship".
  Proactively invoke when a direction is chosen (decision logged) and no ux/harden/ exists.
  Use after /explore-directions; gates /ship-code. (skillcloud)
---

## Preamble (run first)

```bash
_UPD=$("${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-update-check" 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
[ -f "ux/project-context.md" ] && echo "PROJECT_CONTEXT: present" || echo "PROJECT_CONTEXT: missing"
grep -iE 'direction|chose' ux/decisions-log.md 2>/dev/null | tail -3 || true
ls ux/explore/*/prototype.html ux/harden ux/rulebook 2>/dev/null || true
```

- If `UPGRADE_AVAILABLE <old> <new>`: follow the **Upgrade flow** in `~/.skillcloud/repo/skills/core/skillcloud/SKILL.md`, then return and continue this skill.
- If `JUST_UPGRADED <old> <new>`: say "SkillCloud v<new> (just updated)" and summarize the user-facing changes between the two versions from `~/.skillcloud/repo/CHANGELOG.md` in 3–5 bullets. Then continue.
- If `PROJECT_CONTEXT: missing`: create a minimal `ux/project-context.md` from the template in `engagement-guardrails`. Infer the project name and domain from the material at hand, state the inference in one line so the user can correct it, and continue. Never ask administrative questions (project type, classification, permissions: defaults exist). If something material to the work itself is unclear, ask that one sharp question before producing.

## Contract
- **Consumes:** the chosen direction's `ux/explore/<dir>/prototype.html` + `notes.md` (required), `ux/explore/directions.md` and `ux/explore/feedback-log.md` (the evidence and the direction's risk), `ux/structure/ia.md` + flows (roles and failure paths), the rulebook (`ux/rulebook/*.md`, or the shipped defaults), the design-system record or tokens, `ux/project-context.md` (always)
- **Produces:** `ux/harden/hardening-matrix.md`, `ux/harden/rulebook-check.md`, `ux/harden/scans/*` (quality reviewer), `ux/harden/feasibility.md` (engineer)
- **Next:** the designer fixes the gaps (/explore-directions, harden-fixes mode), you re-walk the matrix, and then the Harden gate (engineer, rulebook owner, design lead) through /design-lead. After sign-off comes /ship-code.

# Harden Review

Harden is where most prototypes break, and this skill breaks them first. Three parts, often done by three people or agents:

| Part | Who | Output |
|---|---|---|
| A. Feasibility | engineer (`sc-engineer`) | `feasibility.md` |
| B. Hardening matrix | quality reviewer (`sc-quality-reviewer`) | `hardening-matrix.md` |
| C. Rulebook check + scans | quality reviewer | `rulebook-check.md`, `scans/` |

Run the part your ticket names. Run them all when working alone. Book feasibility **first**, because limits change designs. You find and report. The designer fixes. People decide what passes: the engineer agrees feasibility, the rulebook owner passes the rulebook checks, and the design lead approves the hardened design.

Rulebook chapters: **states-and-roles**, **accessibility**, **ai-experience**, **design-system**, **content**, plus any project chapter that covers this flow.

## Step 0: Context and data-rules gate

1. Read `ux/project-context.md`: domain (it adds domain musts: audit trails and interruption recovery in clinical work, confirmation and dispute paths in finance), data rules, accessibility bar, design-system situation, stack.
2. Data rules (full rules in `engagement-guardrails`): if project-context explicitly restricts AI processing of this project's material, STOP and say so. Otherwise proceed. Fixture data is synthetic, and anything that looks real is a finding (`skillcloud-check pii`).
3. Confirm the direction was chosen (decisions log) and the prototype is the version the choice was made on. Hardening an unchosen direction is wasted work.

## Part A: Feasibility (engineer)

Walk the flow step by step against the real system: the APIs and data available, freshness and sync intervals, permissions models, performance, the platform and embedding host, and client stack constraints. For each limit, write the **design response it requires**. For example: "calendar syncs every 5 min → suggestion can be stale → show 'checked N min ago' and handle room-taken at confirm". Rate each step **straightforward / needs work / blocked**, and name what would unblock it. "Possible" and "hard" alone are not answers. Template: `resources/feasibility-template.md`.

## Part B: The hardening matrix (quality reviewer)

For **every screen in the flow**, using the prototype's review bar (state × role × data volume):

1. **States** (STR-R01, R02): empty (first-use and filtered-to-nothing), loading, error (recoverable and fatal), success, partial, plus permission-denied, offline, stale or concurrent edit, timeout or expiry, and interrupted-and-resumed where they apply.
2. **Roles × actions** (STR-R05 to R07): for each role that can reach the screen, each action (see, create, change, undo or delete, approve) is allowed, hidden, disabled-with-reason, or ask-for-access. Note what happens if the role reaches it by deep link.
3. **Edge data** (STR-R09, R10): none, one, typical, a lot, long values, odd values, and bulk actions with partial success.
4. **AI states** (AIX-R09), on every screen where AI appears: thinking, result-with-why, low confidence, can't help, wrong, override, undo, failed or AI-off.
5. **Accessibility basics** per state: keyboard path, focus, contrast of what's shown, and the announcement (a full audit can follow via /accessibility-audit).
6. **System fit** (STR-R12): same pattern for the same problem as the rest of the product, and no contradiction of other flows.

Each cell gets one of: **designed** (reachable in the prototype, note what shows), **gap** (missing, and what it needs), or **n/a** (with the reason). No blanks, no TBD. Template: `resources/hardening-matrix-template.md`, one row per screen × state.

## Part C: Rulebook check and scans (quality reviewer)

- For **every rule** in every applicable chapter: **pass / fail / n/a** with evidence (screen, state, element), or the reason for n/a. Quote the rule ID. Failing rules become findings with a severity.
- **Scans, with literal output saved to `ux/harden/scans/`:**
  - `skillcloud-check contrast` for every text/background and UI/background pair in use
  - `skillcloud-check tokens` and `pii` on the prototype
  - axe-core on every screen × state, where a browser is available. Playwright with `@axe-core/playwright` against `file://…/prototype.html?state=…`, or `npx @axe-core/cli`. If neither can run here, write "not run: <reason>" and flag it for the engineer to run in Ship.

## Step 4: Fix here, or send back

Classify every finding:
- **Fix in Harden**: missing state, role behaviour, edge case, rule breach, feasibility response. It goes to the designer (harden-fixes mode).
- **Ship note**: small and non-blocking, for example a copy tweak or token rename. It travels to Ship in the handoff card. It doesn't stall the run.
- **Send back to Explore**: the direction itself won't hold. A core assumption failed in testing, feasibility kills the main interaction, or a rule makes the concept impossible. Say it plainly, with the evidence. Don't drown it in a fix list.

## Step 5: Re-walk and summarise

After the designer's fixes, re-walk only the gap cells and the failed rules, and update the matrix (version bump). Summary at the top of `hardening-matrix.md`: cells designed, gaps, n/a, the rulebook pass/fail count per chapter, scans run and not run, and the recommendation for the gate.

## Quality bar

- Every screen × state × role cell is filled (designed, gap or n/a-with-reason), with no blanks and no TBD.
- Every applicable rule is marked with evidence, every scan has literal output or "not run: why".
- Every feasibility limit has a design response.
- The fix / note / send-back call is explicit for every finding.

## Handoff

End with: produced paths (status), counts (cells, gaps, rules passed/failed, scans run), findings by severity, the recommendation (fix here or send back), and the next step. That is the designer's harden-fixes pass, or, once clean, the Harden gate through `/design-lead` (engineer, rulebook owner and design lead sign). Suggest, don't auto-run.
