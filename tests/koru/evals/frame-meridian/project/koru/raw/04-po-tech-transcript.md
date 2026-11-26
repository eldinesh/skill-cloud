# Transcript: Product owner and engineering lead

**Date:** Tuesday, 15:30 to 16:10
**Attendees:** Priya Shah (Product Owner), Tom Okafor (Engineering Lead, Operations Technology)

*Auto-transcribed. Lightly cleaned.*

---

**Priya:** Okay, I've got the PRD open. Can you walk me through what scares you?

**Tom:** Pretty much section 6. Start with R6, real-time inventory on every request. We don't have real-time inventory. The ERP updates stock levels in a nightly batch at 2am. During the day, what you see is last night's count minus whatever's been scanned out on the units that actually scan, which is about half of them.

**Priya:** So it's roughly right?

**Tom:** It's roughly yesterday. On a busy Saturday it can be well off. If we show a number and a nurse trusts it, and it's wrong, that's worse than no number.

**Priya:** Okay. R3, AI auto-ordering.

**Tom:** Two problems. One, the ERP has no API for creating purchase orders. Orders go to suppliers through an EDI file the ERP generates once a night. So "AI places an order" really means "AI adds a line to tonight's file". Nothing arrives faster. Two, Raj will kill it. Finance has a control that every PO line over $500 gets approved in the ERP. We can't bypass that from our side even if we wanted to.

**Priya:** Dana really wants the AI ordering.

**Tom:** I know. We could do AI suggesting a reorder that a materials manager approves in one click. That we can build. But it still lands in the nightly file.

**Priya:** What about predictions? We have history.

**Tom:** We have three years of UnitDesk requests. But a lot of requests never go through UnitDesk, they're phone calls, so the history is missing the urgent stuff. Predictions would be trained on the calm requests. Also, item names in UnitDesk are free text. "Gloves M", "med gloves", "nitrile gloves medium blue" are the same thing. We'd need to map them to catalogue numbers first.

**Priya:** Duplicates, R7?

**Tom:** Blocking duplicates sounds easy until you ask what a duplicate is. Two nurses on the same unit asking for the same item in the same hour, probably a duplicate. Same item, different patients, not a duplicate. If we block automatically we'll block real requests. I'd rather flag and let someone merge.

**Priya:** SSO, R9?

**Tom:** Employees, yes, through the staff directory. Agency and travel nurses aren't in the directory. They get a shared unit login for UnitDesk today, which security hates. They're about 20% of night shift at North, by the way.

**Priya:** That's a lot.

**Tom:** It's a lot of the people raising urgent requests at 3am.

**Priya:** The plan side. R13.

**Tom:** The plan's systems are separate. There's a read-only API into member eligibility and benefits, but it's PHI, so anything we show needs the right role, audit logging, and Hannah's team can't see hospital clinical notes. We can do it, but it's not a phase 1 thing unless we cut something.

**Priya:** Hannah's going to be upset.

**Tom:** Then we should cut something else.

**Priya:** And design. They want it to look like a consumer app, using Meridian UI.

**Tom:** Meridian UI is... partial. We've got buttons, form fields, modals, a card. It's Tailwind under the hood. We never built a data table, status badges or a timeline, and every team that needed one built their own. The Figma library and the code have drifted. Spacing in Figma is on an 8 point grid, code uses Tailwind defaults, so things are off by a few pixels everywhere. And there's nothing for AI: no pattern for "this was suggested", confidence, or undo.

**Priya:** So we'd need to build those.

**Tom:** Someone does. And last release, design handed us screens using components that didn't exist in code, with no empty or error states. My team guessed. That's in the Slack thread from 3.2 if you want the gory details.

**Priya:** Mobile?

**Tom:** IT hasn't approved a native app. Responsive web on the workstations and unit tablets, yes. Phones, policy says no, reality says yes.

**Priya:** Okay. Eight weeks. What's realistic?

**Tom:** Honestly? One request type done properly. Supplies, with suggestions, duplicate flags, approval in one click, and clear status. Not real-time inventory, not auto-ordering, not the plan. And we need the design team to give us every state, and to use components we actually have, or tell us what we're building.

**Priya:** Dana's going to hear "no AI".

**Tom:** It's still AI. It just doesn't spend money by itself.

*[End of transcript]*
