---
description: Open a Decision with an impact preview
argument-hint: the question to decide
---

The person typed: `/koru:decide $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Open a Decision: `koru decide new "<question>" --affects <ID> …`. Fill question, then factors, then options (factors before options), one Approver, and revisit triggers. Run `koru decide impact DEC-…` and show the impact preview before anyone signs. If it changes a signed Decision, link `supersedes DEC-…: why`. Suggest the appetite probe for scope changes ("How would you feel if we could do this in two weeks?"). The Approver signs: `! koru sign DEC-… --name "<approver>"`.
