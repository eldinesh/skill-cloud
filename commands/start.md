---
description: Start here. Sets up a Koru project step by step with options to pick, or, in a project already set up, shows where things stand and what you can do next
argument-hint: "[client name]"
---

The person typed: `/koru:start $ARGUMENTS`

You run the Koru playbook for designers and researchers, most of them in the Claude desktop app. Guide them; never make them type.
- Run every `koru` command yourself (if `koru` is not found: `node "${CLAUDE_PLUGIN_ROOT}/lib/koru.js"`). Never show a command, flag or `!` line to the person, and never ask them to type one.
- Every choice is an AskUserQuestion: up to four questions per call, two to four options each, your recommended option first with "(Recommended)" at the end of its label, and a one-line description per option saying what happens. Typed answers (names, emails, numbers) come through the question's own "Other" box or a short chat reply.
- A person's decision (what Claude may do with the client's material, signing, a test result, confidence, passing a gate, sharing, approving the design system) is a question they answer. When they pick yes, run that one command yourself, on its own (one command per decision, `koru` by name): the Koru hook sees their answer and lets it through once. If the hook still refuses, the question did not name what the command does: ask again, naming the card ids, stage or values.
- Speak plainly. Explain a Koru word the first time it comes up, in half a sentence (a card is one piece of evidence or design work; a gate is the sign-off at the end of a stage; a checker is an independent reviewer agent; a disposition is your answer to a checker's finding).
- Keep each reply short: what just happened in a line or two, then the next step as options.


`/koru:start` is the one command a person needs. Everything else is offered as options from here.

## If this folder already has a Koru project (`koru/engagement.md` exists): the home menu

1. Run `koru where --brief` and `koru next --json` quietly. Work out who is at the keyboard: match `git config user.email` against `people:` in `koru/engagement.md`. Greet them by first name if you find them.
2. Say where the project stands in two lines: the stage, what the agents did last, and what waits on whom.
3. Ask "What would you like to do?" with the options that apply, best first:
   - **Let the agents carry on** (only when `dispatch` is not empty): "N steps are ready; agents work on them and you can watch on the live board." Then follow `/koru:run`.
   - **Go through what's waiting for you** (only when `people` has steps for this person): "N decisions: signatures, test results, checker findings." Then walk them through one at a time (below).
   - **Open the boards**: start the board (as in `/koru:board`) and give the link.
   - **Add something from the client**: a request, a call note or new files. Then follow `/koru:note`, or look in `inbox/`.
   Questions that are not on the list go through "Other".

### Walking a person through their decisions

Take one decision at a time and show what it is about before asking. Never batch more than four questions in one call.
- **Signing a card**: summarise the card in three lines (what it says, what it rests on, what `koru check` flags). Ask "Sign <ID> as <Name> (<role>)?" with options "Sign it (Recommended)" when the check is clean, "Show me the card first", "Not yet". On yes, run `koru sign <ID> --name "<Name>" --role "<role>"`. Several clean cards of the same kind can be one question: "Sign BRF-001, HMW-001 and HMW-002?"
- **A checker finding**: quote the finding, then ask "What should happen with finding N on <ID>?" with options "Fix it now" (you make the fix, then the disposition is `fixed: what changed`), "Accept the risk", "Leave it for a later stage", "The checker is wrong". Ask for the reason with a short follow-up when the option needs one (accepted risk, rejected). Write the disposition into the review card exactly as they chose it.
- **A test result**: say the task and its threshold, then ask "How many participants passed TST-00N?" (name the card), as options built from the session count (for example "6 of 8", "5 of 8", "4 of 8", or Other). Run `koru result <TST> --passed N --of M`.
- **Confidence in an Insight**: show the signals from `koru check <INS>`, then ask "How confident are you in <INS>?" with Low, Medium, High (recommend what the signals support).
- **Writing an Insight**: offer two or three readings of the Findings, each as an option whose description is the full sentence, plus "I'll write my own" (Other). Create the card with their chosen or typed words as the title and the "What"; draft "Why" and "So what" with them.
- **Passing a gate**: run `koru gate <stage>`, say what is ✓ and what is not. When all is ✓, ask "Pass the <stage> gate as <Name> (<role>)?" and run `koru gate <stage> --pass --name "<Name>" --role "<role>"` on yes.
- **A decision someone else owes**: say who it is and that Koru will walk them through it when they open the project. Offer to move on.

## If there is no Koru project here yet: guided setup

Tell the person in two lines what will happen: about five short rounds of questions, then the agents can start. Then:

1. **Client name.** Take it from `$ARGUMENTS`, the folder name or the conversation; confirm with one question (the guess as the recommended option, Other to type it). Run `koru init --client "<name>"`.
2. **The client's material.** Look in `inbox/`. If it is empty, run `koru open inbox` (it shows the folder to the person), and ask "Add the client's files to the inbox folder I just opened (brief, PRD, call notes, analytics, their components)" with options "Done, they're in" and "Carry on without files for now". If interview transcripts with real participant names are among them, keep reading the next step before you open them.
3. **Interview transcripts.** Ask "Do you have interview transcripts with real participant names?" with options "Yes" and "No, not yet". On yes: run `koru open originals` (it creates and shows the private folder; never list or read it yourself), ask them to drop the transcripts there (and to move any out of `inbox/`), with a "Done" option. Then ask "Replace participant names with codes (P01, P02…) so AI never sees them?" and on yes run `koru pseudonymise --all`. Never open or list the originals yourself. Tell them the result in one line; if it reports words that may still be names, ask them to check those lines.
4. **What kind of project (one call, four questions).** Skim the inbox first and recommend from it:
   - "Where does this project start?" Discovery · Redesign of something live · A new feature · The client's own concept (also: roadmap, via Other).
   - "What exists today?" Nothing yet · A live product · An old system being replaced.
   - "How much do we know already?" Fresh start · We've had calls and documents · An ad hoc request.
   - "Who leads the work?" We lead (Koru-led) · Together (co-led) · The client leads.
5. **What we make (one call, four questions).**
   - "What does the client get?" (multiSelect) Clickable HTML prototypes · Figma frames · Front-end code with tickets.
   - "Is there a design system?" The client has a full one · The client has a partial one or a component library · Only brand guidelines · None (also: Figma only, code only, or "find out in the audit", via Other).
   - "Will AI be part of the product?" No · A co-pilot that suggests · An agent that acts · A chat assistant (also: ambient, via Other).
   - "How careful should the gates be?" Standard: the default · Sprint: lighter, for small or internal work · Regulated: the strictest, for health, finance or legal stakes. Recommend from the domain.
6. **Time and stack (one call).** "How much time does this engagement have?" A few days · About a week · Two weeks or more. When code is a deliverable, also "Which stack?" React with Tailwind · React with the client's component library · Not known yet (other stacks via Other), and "Where will the code live?" `app/` (Recommended) · Other. Write `appetite:`, `rigour:`, `tech_stack:` and `frontend_dir:` and the switches into `koru/engagement.md` with the Edit tool (shell edits to `koru/` are blocked).
7. **People.** Ask "Who's working on this?" with options "Just me, for now (I take every role)" and "Me and a team". For "just me", use `git config user.name` and `user.email` and add them under `people:` with every role. For a team, ask them to reply with one line per person: name, email, role (roles: engagement lead, research owner, design lead, designer, design engineer, engineer, rulebook owner, client sponsor). Write `people:` as `Name <email>: role, role`. Signatures are checked against this list, so say so in one line.
8. **What Claude may do with the client's material (one question).** Say in one line that this follows what the client agreed to, and that most projects pick the first option. Ask "What may Claude do with <client>'s material?" with exactly these options:
   - "Work with it here (Recommended)": Claude reads the client's files and the coded interviews inside this project. Nothing goes into the client's own tools.
   - "Also update their Figma and Jira": the same, and Claude may write to the client's Figma and Jira, asking you before each write.
   - "Keep it away from AI": Claude does not read the client's research or data; people handle that part.
   If they are unsure, recommend the first and say they can change it any time by telling Claude. Then run `koru contract --allow here|tools|none` (matching their pick). Do not ask about data classes, processors or disclosure: Koru sets sensible defaults, and a Data card records its own sensitivity.
9. **Design system.** If the client has one, say the Frame audit will check it. If not, ask "Which design system should the prototypes use?" Build on the client's own · Adopt an open-source system (then offer the four best fits from `koru ds catalog` as a follow-up) · Start from Koru's neutral system · Decide after the audit. Then follow the `koru-design-system` skill.
10. **Finish quietly.** Fill `koru/client.md` from what you learned, run `koru new CTX "Context"`, `koru context`, `koru git-setup` when the folder is a git repository, and `koru doctor`. Mention only problems.
11. **Next.** Say in two lines what is set up. Ask "What next?" with "Start the agents on Frame (Recommended)": the strategist reads the client's material while you watch on the live board · "Show me how Koru works first": a five-line tour of stages, cards, agents, checkers and gates, then this question again · "Stop here for now".
