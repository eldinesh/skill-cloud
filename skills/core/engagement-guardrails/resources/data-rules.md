# Data rules — quick reference

| | standard *(default, every project)* | restricted *(only when a contract says so)* |
|---|---|---|
| Project material in AI tools | Yes — de-identify people data on intake | No — skills refuse and say why |
| Transcripts / notes / screenshots | Yes, after the identifier sweep | No |
| Craft skills on synthetic material | Yes | Yes |
| company-handbook / internal questions | Yes | Yes |
| Credentials, secrets, contracts, live production datasets | Never | Never |

- No restriction recorded in `ux/project-context.md` → none applies. Nobody gets interrogated.
- A restriction is recorded by whoever knows the contract, with its source ("MSA §7").
- The domain in project-context decides which identifier categories the sweep includes (healthcare → PHI / Safe Harbor; finance → account/KYC data; otherwise the universal set).
- A stricter contract or NDA always wins over this default.
