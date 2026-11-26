---
description: Show the team board, what waits on you, and what's ready to run, then open the live board page
---

Run, from the project root:

```bash
B="${SKILLCLOUD_HOME:-$HOME/.skillcloud}/repo/bin/skillcloud-board"
"$B" summary && "$B" html && (open ux/team/board.html 2>/dev/null || xdg-open ux/team/board.html 2>/dev/null || true)
```

The board pane (beside the chat) is the live view with controls. Mention `/skillcloud-board` opens it if it's closed. If there's no `ux/team/board/` yet, say so in one line and offer `/design-lead` to plan the current stage. Otherwise report in at most six lines: what waits on people (with each question), what's running, and what's ready. Then say the board page is open and reloads itself every few seconds. Don't start any work from this command.
