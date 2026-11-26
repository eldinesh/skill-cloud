---
artifact: rulebook-chapter
id: AIX
project: SkillCloud default
created_by: skillcloud/project-rulebook v0.11.0
stage: all
applies_to: [strategist, designer, quality-reviewer, engineer, checker]
sources: [sense-shape-steer resources (SHAPE trust & transparency checklist), delivery-system.md §2 Harden]
status: final
owner: SkillCloud maintainers (project copy: the design lead)
version: 1
updated: 2026-11-26
---

# AI experience

## Purpose
Wherever AI acts in the product, on screen or as an agent, the person stays informed, in control and able to undo. The AI's states are designed as carefully as the happy path.

## Rules

**Placement and control**
- **AIX-R01** MUST state where AI sits for every flow: **screen** (suggests, the person acts), **agent** (acts on the person's behalf), **both**, or **neither**. Give a reason traced to a job or insight.
- **AIX-R02** An agent MUST NOT take an action with consequences (booking, sending, ordering, deleting, releasing, paying) without the person seeing *what*, *for whom* and *when* first, unless the person has turned on standing permission for that action class. Standing permissions are visible and revocable in one place.
- **AIX-R03** MUST make every AI-initiated action undoable in one step from where its result appears, for as long as undo is meaningful. Where undo is impossible (a sent message), confirmation before the action is mandatory.
- **AIX-R04** MUST let the person ignore, dismiss or override any suggestion without penalty, extra steps or nagging. The non-AI path is always available and never hidden.

**Transparency**
- **AIX-R05** MUST show *why* for every suggestion: the one or two factors that drove it, in the user's terms ("Fits 8 · has a screen · free until 4pm").
- **AIX-R06** MUST label AI-generated content and AI-taken actions as such where the person meets them. In lists and logs, "booked by assistant" is distinguishable from "booked by you".
- **AIX-R07** MUST show data freshness where staleness changes the decision ("rooms checked 2 min ago").
- **AIX-R08** MUST NOT express more certainty than the system has. Low confidence is shown as alternatives or a question, never as one confident answer.

**AI states (each one designed, on every screen where AI appears)**
- **AIX-R09** MUST design all of these:
  - **thinking**: progress, with a way to cancel if it is slow
  - **result**: what it did and why
  - **low confidence**: options or a clarifying question
  - **no answer or can't help**: an honest message and the manual path
  - **wrong**: how the person corrects it
  - **override**: the person chooses otherwise
  - **undo**: reversing an AI action
  - **failed**: AI unavailable, with the product still usable
- **AIX-R10** MUST degrade gracefully. If the AI is unavailable, the core task still works manually.
- **AIX-R11** A correction or override MUST be captured as a signal (Learn), with a visible acknowledgement where it helps the person ("Got it, won't suggest Room 4 for calls"). It MUST NOT trap the person in a feedback form.

**Safety and limits**
- **AIX-R12** In regulated domains (clinical, financial, legal), AI MUST NOT be the final decision-maker on anything the domain assigns to a licensed or accountable person. The design shows who decides.
- **AIX-R13** MUST NOT use dark patterns to drive AI adoption: pre-ticked agent permissions, confirm-shaming, hiding the manual path.
- **AIX-R14** Prototypes that use a real model MUST use synthetic data only and say on screen that responses are generated. Prompts and keys never ship in client-side code.

## Patterns

### Suggestion at the top, with reason
The normal list stays. One suggestion is pinned above it with a "why" line and a one-tap accept. Ignoring it costs nothing.
*Deskly: "Suggested: Room 4 · fits 8, has a screen, free until 4pm" [Book] · then the full room list.*

### Confirm-then-act (agent)
The agent prepares the action and shows a confirmation card (what, who, when, cost). It acts on "Confirm", then shows the result with **Undo** for N minutes.

### Low confidence → choose
Instead of one answer, show the 2–3 best options with what differs between them, plus "none of these".

### Override captured
After the person picks something other than the suggestion, offer a one-line optional reason chip ("too small", "wrong floor"). Never offer a form.

## Decisions
| Decision | Why | Log |
|---|---|---|
| *(e.g. "Admins approve AI room releases for the first month")* | | |

## Checks
| Check | Verifies | How |
|---|---|---|
| **AIX-C01** | R01 placement stated per flow | checker H2 q5, H4 q2 |
| **AIX-C02** | R02–R04 control and undo on every AI action | harden matrix AI columns · person: design lead |
| **AIX-C03** | R05–R08 why, labels, freshness, honest confidence | /harden-review rulebook check |
| **AIX-C04** | R09 all eight AI states on every AI screen | harden matrix · checker H5 q1 |
| **AIX-C05** | R10 manual path works with AI off | engineer: e2e test with AI disabled (testing chapter TEST-R09) |
| **AIX-C06** | R14 no keys or prompts client-side | tool: deliverable `npm run check` (secrets scan) |

## Instructions for AI tools
- When designing any screen where AI suggests or acts, add the why line, the label, the undo and the eight AI states before calling the screen done. Flag any screen without them.
- When a direction card says "agent", design the confirmation card first, then the result with undo. If you can't design a safe undo, say so. That's a feasibility or concept risk, not a detail.
- Write low-confidence states as choices, not hedged sentences.
- Never write copy that implies the AI is a person, or that it is certain when it isn't.

## Owner
Project copy: the design lead · reviewed at every Harden gate.
