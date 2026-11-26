---
artifact: information-architecture
project: <project>
created_by: skillcloud/information-architecture v<VERSION>
stage: explore
sources: [ux/design/brief.md, ux/synthesis/jobs-to-be-done.md, ux/personas/<slug>.md, ux/strategy/experience-strategy.md]
status: draft
updated: <yyyy-mm-dd>
---

# Information architecture · <project>

## Vocabulary
| Concept | Users say (P-codes) | System / internal word | Label | Status |
|---|---|---|---|---|
| booking | "booking" (P01, P03), "my room" (P05) | reservation | Booking | confirmed |

## Object model
| Object | Key attributes | Relationships | Actions (roles) |
|---|---|---|---|
| Room | name, capacity, features, floor | has many Bookings | view (all), release (admin) |
| Booking | room, time, duration, owner, made-by (person/assistant) | belongs to Room, Member | create (member, assistant after confirm), change (owner), undo (owner, assistant ≤10 min) |

## Sitemap
<!-- each line starts with its node ID; tools parse this -->
- N1 Book (in scope)
  - N1.1 Find a room (in scope)
  - N1.2 Today (in scope)
- N2 My bookings (in scope)
- N3 Admin (existing, out of scope)

## Navigation model
| Type | Contents | Reaches |
|---|---|---|
| Global | Book · My bookings · Help | N1, N2 |
| Local | Today / This week tabs | N1.2 |
| Utility | Account, settings | — |
| Contextual | Room → its bookings | N2 |

**Wayfinding notes:** <per node>
**Host / embedding constraints:** <if any>

## Flows in scope
| Flow | Job(s) | File |
|---|---|---|
| FL-01 Book a room for today | JOB-01, JOB-03 | flows/book-a-room.md |

## Tree-test plan
| Task (from a job) | Correct node | Threshold |
|---|---|---|
| "You need a room for 8 people at 3pm today." | N1.2 | ≥70% direct |

Labels to test: <list>
