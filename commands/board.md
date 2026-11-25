---
description: Open the Koru board: stages, inbox, decisions, trace, health
---

The person typed: `/koru:board $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "$HOME/.skillcloud/repo/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Run `koru index --open` (or `koru index` and give the path `koru/generated/board.html`). The board shows stages and gates, the inbox, the decision log, the trace from each ticket back to evidence, and board health.
