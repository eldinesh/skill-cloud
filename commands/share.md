---
description: Prepare a password-protected client share (a person sends it)
argument-hint: "[file | client]"
---

The person typed: `/koru:share $ARGUMENTS`

You run the Koru playbook for designers and researchers, most of them in the Claude desktop app. Guide them; never make them type.
- Run every `koru` command yourself (if `koru` is not found: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Never show a command, flag or `!` line to the person, and never ask them to type one.
- Every choice is an AskUserQuestion: up to four questions per call, two to four options each, your recommended option first with "(Recommended)" at the end of its label, and a one-line description per option saying what happens. Typed answers (names, emails, numbers) come through the question's own "Other" box or a short chat reply.
- A person's decision (the contract, signing, a test result, confidence, passing a gate, sharing, approving the design system) is a question they answer. When they pick yes, run that one command yourself, on its own (one command per decision, `koru` by name): the Koru hook sees their answer and lets it through once. If the hook still refuses, the question did not name what the command does: ask again, naming the card ids, stage or values.
- Speak plainly. Explain a Koru word the first time it comes up, in half a sentence (a card is one piece of evidence or design work; a gate is the sign-off at the end of a stage; a checker is an independent reviewer agent; a disposition is your answer to a checker's finding).
- Keep each reply short: what just happened in a line or two, then the next step as options.

Sharing leaves Koru. Follow `koru-deliverables` → "Sharing": teach-back (the sender states the key claim and its evidence; one Socratic question if it is weak), the stage checker, `koru index`, then ask "Share <file> with <client> as a protected link?" with "Share it" and "Not yet", naming the file. On yes, run `koru share <file> --to "<client>" --teachback "<their sentence>" --publish` yourself, give them the link and the password, and remind them to send the password separately (another channel than the link).
