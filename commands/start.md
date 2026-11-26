---
description: Set up this folder as a Koru Studio project (structure, context, rulebook, your material) and propose the first plan
argument-hint: [optional: project name, or what this project is]
---

The person opened a folder and wants to start. They don't set anything up by hand: you do all of it, then show the first plan. Extra words from them: `$ARGUMENTS`

## 1. Set up the folder

```bash
"${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-init" --import
```

If it prints `STOP` (home, Desktop, Downloads or Documents), say in one line that each project needs its own folder, offer to create `~/Projects/<name>` and to move there, and stop until they answer. If the folder is already a Koru Studio project (`EXISTS ux/project-context.md`), skip to step 4: it's a resume, not a start.

## 2. Read the material and fill the keystone

Read what landed in `ux/intake/raw/`: skim each file, and open spreadsheets and decks enough to know what they are. Then fill `ux/project-context.md`. Infer, don't interrogate:

- **Name / codename**: from `$ARGUMENTS`, the brief, or the folder name. Use a codename when the material is a client's.
- **Domain, what it is**: from the brief and calls.
- **Data rules**: `standard`, unless the material says AI processing is barred (an NDA clause, "don't put this in AI"). Only then ask that one question, and stop until it's answered.
- **Design system**: library in code, Figma library only, or none yet, from what's in the material (a UI library folder, tokens, a Figma link).
- **Stack**: the client's stack if the material names it, otherwise `default`.
- **Accessibility bar** (WCAG 2.2 AA unless stated), **constraints**, a **glossary** of codenames for orgs and systems, and **stakeholders** by role only.
- **Team (who signs)**: fill names only if the material or `$ARGUMENTS` gives them. Otherwise leave the placeholders. The design lead asks at the first gate that needs a name.

Never write participant names anywhere. The material is raw until the synthesiser cleans it.

## 3. Say what you set up (at most 6 lines)

- the folder is ready, with `ux/` (and how many files were imported, originals untouched)
- the project, domain, design-system situation and stack you inferred, in one line, for them to correct
- anything that looks sensitive or restricted, if so
- where the board is (`/koru-studio:board`)

## 4. Hand over to the design lead

Follow `/design-lead` from **Step 1** (place the project) and **Step 3** (plan the stage as proposed tickets). Pick the stage the material supports. Raw client material means Frame. A signed brief and research pack mean Explore. A chosen direction means Harden. Play the plan back and wait for their "yes". That yes is the only thing this start asks of them.
