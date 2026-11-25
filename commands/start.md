---
description: Set up a Koru project here: engagement pack, seven switches, contract, health check
argument-hint: "[client name]"
---

The person typed: `/koru:start $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "$HOME/.skillcloud/repo/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Set up a Koru project in this folder. Nothing is generated until this is done.
1. If `koru/engagement.md` exists, say so and switch to **where**.
2. Run `koru init --client "<client name>"` (ask for the client name if it is not obvious from the folder or conversation).
3. Ask the seven switches in one compact message, each with its options, and suggest a likely answer from what you know:
   call context (fresh start · informed · ad hoc) · starting point (discovery · roadmap · redesign · feature add · client concept) · product state (new · live · legacy shell) · design system (mature · partial · figma only · code only · brand only · none, or "unknown until the audit") · AI in the product (none · co-pilot · agentic · conversational · ambient) · deliverables (any of html · figma · frontend) · client maturity (koru-led · co-led · client-led).
   Write the answers into `koru/engagement.md`, and the roles they name (engagement lead, research owner, design lead, designer, design engineer, engineer, rulebook owner, client sponsor) under `roles:`.
4. The contract is set by a person. Ask them to type, filled in from the client's contract:
   `! koru contract --tier full|internal|restricted --data-class public|confidential|personal|special --processor Anthropic`
   Explain the tiers in one line each: full (AI may write to the client's Figma and Jira, each write approved), internal (AI works inside Koru only), restricted (no client data to AI).
5. Fill `koru/client.md` from what you know (deciders, vocabulary, house rules) and create the Context card: `koru new CTX "Context"`.
6. Health check: `koru doctor`. Then show `koru where` and suggest the first Frame step (`koru-frame`).
