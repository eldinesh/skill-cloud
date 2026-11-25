---
description: Definition of Ready, tickets, handoff and Jira
---

The person typed: `/koru:ship $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "$HOME/.skillcloud/repo/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Follow `koru-ship`: `koru dor` on every Ticket, fix what fails, the spec checker, the handoff note. Jira writes happen only for signed Tickets that pass Definition of Ready, and each one asks the person to approve. If the contract tier is not full, export the Tickets as Markdown instead.
