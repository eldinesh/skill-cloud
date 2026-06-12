# Test fixtures

**Fully synthetic.** Every name, organization, identifier, and detail below is invented. The identifiers are planted **on purpose** — they exist so tests can verify that de-identification actually strips them. If any planted string (names, MRN, city, phone, exact date) survives into a produced artifact, the test fails.

Planted identifiers to grep for in outputs (expect zero hits):
`Voss` `Patel` `Okafor` `4471892` `Dayton` `555-0182` `March 14` `Northfield`

Scenario project: "Northfield Health" (fictitious) → codename **BEACON**, data rules **standard** (de-identify on intake), domain: healthcare — inpatient care coordination.
