---
description: Set up a Koru project here: engagement pack, seven switches, contract, health check
argument-hint: "[client name]"
---

The person typed: `/koru:start $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Set up a Koru project in this folder. Nothing is generated until this is done.
1. If `koru/engagement.md` exists, say so and switch to **where**.
2. Run `koru init --client "<client name>"` (ask for the client name if it is not obvious from the folder or conversation).
3. Ask the seven switches in one compact message, each with its options, and suggest a likely answer from what you know:
   call context (fresh start · informed · ad hoc) · starting point (discovery · roadmap · redesign · feature add · client concept) · product state (new · live · legacy shell) · design system (mature · partial · figma only · code only · brand only · none, or "unknown until the audit") · AI in the product (none · co-pilot · agentic · conversational · ambient) · deliverables (any of html · figma · frontend) · client maturity (koru-led · co-led · client-led).
   Also ask, in the same message, the **tech stack** if code is a deliverable (framework, styling, component library, test tools, or "not known yet"; it is asked again at Ship) and the folder code will live in (`frontend_dir`).
   Ask the **appetite** (hours or days of work this engagement has) and the **rigour**: sprint (gates ask only about blocker and major findings, the top two roles in the state matrix, one signer per gate), standard (the default), or regulated (two methods behind any Insight an irreversible decision rests on, client co-signs Permissions). Suggest one from the stakes.
   Write the answers into `koru/engagement.md` (`appetite:`, `rigour:`), and the people they name under `people:` as `Name <email>: role, role` (engagement lead, research owner, design lead, designer, design engineer, engineer, rulebook owner, client sponsor). Signatures are checked against this list and the signer's git identity.
4. The contract is set by a person. Ask them to type, filled in from the client's contract:
   `! koru contract --tier full|internal|restricted --data-class public|confidential|personal|special --processor Anthropic`
   Explain the tiers in one line each: full (AI may write to the client's Figma and Jira, each write approved), internal (AI works inside Koru only), restricted (no client data to AI).
5. Design system: if the client named a system or library, or there is none, start the `koru-design-system` skill's path choice now (or note it for the Frame audit). `koru ds status` shows the state.
6. Fill `koru/client.md` from what you know (deciders, vocabulary, house rules) and create the Context card: `koru new CTX "Context"`.
7. Team set-up: if the folder is a git repository, run `koru git-setup` (union merge for Koru's logs, pre-commit checks for duplicate ids and changed signatures). If it is not, suggest `git init` once in one line. Run `koru context` so every method skill reads the same project context.
8. Health check: `koru doctor`. Then show `koru next` and offer `/koru:run`, which dispatches the first ready steps to their agents.
