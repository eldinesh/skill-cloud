---
description: Prepare a password-protected client share (a person sends it)
argument-hint: "[file | client]"
---

The person typed: `/koru:share $ARGUMENTS`

You run the Koru playbook. The `koru` command is on the shell path (if not: `node "$HOME/.skillcloud/repo/lib/koru.js"`). Speak plainly, in designer language. When a step needs a person (signing, passing a gate, the contract, sharing), give them the exact line to type, starting with `!`.

Sharing leaves Koru. Follow `koru-deliverables` → "Sharing": teach-back (the sender states the key claim and its evidence; one Socratic question if it is weak), the stage checker, `koru index`, then give the person the line:
`! koru share <file or client> --to "<client>" --teachback "<their sentence>" --publish`
Remind them to send the password separately.
