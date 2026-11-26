# Slack thread: #ops-tech-requests

Exported from Meridian's Slack. Thread about the last UnitDesk release (3.2), between Priya Shah (Product Owner), Tom Okafor (Engineering Lead), Wen Li (Front-end Developer) and Sam Ortiz (Designer, contract, has since left).

---

**Priya Shah** 10:12
3.2 is out 🎉 thanks all. Already getting feedback that the new approvals screen is confusing though. Can we look?

**Wen Li** 10:20
The approvals screen in Figma used a table component with sorting and row selection. That doesn't exist in Meridian UI. I built one from scratch in the sprint, which is why sorting only works on the date column.

**Tom Okafor** 10:22
Also the designs didn't have what happens when there's nothing to approve. Wen made it show "No data" in grey. Users think it's broken.

**Sam Ortiz** 10:31
The empty state was in the Figma file, on the second page, under "edge cases".

**Wen Li** 10:33
That page wasn't linked from the ticket and the ticket said "build approvals screen as per Figma". I built page 1.

**Priya Shah** 10:35
Okay. What else?

**Wen Li** 10:41
- Spacing is all over the place because Figma is 8pt and our code is Tailwind default. I eyeballed it.
- The "Approve" button in the design is green. We don't have a green button. I used primary blue.
- Error message copy wasn't in the design so I wrote "Something went wrong".
- On the workstation screens (1366 wide) the table overflows. Design was 1440.

**Sam Ortiz** 10:46
I assumed we'd have a green success button by now, it was on the roadmap.

**Tom Okafor** 10:48
It's been on the roadmap since 2022 😅

**Priya Shah** 10:52
Also, acceptance criteria were "approver can approve requests". Nobody said what happens when the approver is on leave. We've now got 40 requests stuck behind one manager.

**Tom Okafor** 10:55
That's a permissions question, not a design one, but someone should have asked it.

**Priya Shah** 11:02
For the new platform I don't want this again. Whoever designs it, I want: real components or a clear list of new ones, every state, and acceptance criteria that cover who can do what.

**Wen Li** 11:04
And please, one source of truth. Last time Figma, the ticket and a Loom video all said slightly different things.

**Tom Okafor** 11:05
+1. And if it's AI, tell us exactly what happens when the AI is wrong. Who sees it, who fixes it, how it's logged.
