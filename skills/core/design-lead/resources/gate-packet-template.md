# Gate packet (shown to the sign-off owner, then saved to ux/team/gates/<stage>-<n>.md)

```
GATE · <STAGE> · <project> · <date>
Signs: <role> — <name from project-context>   [<role> — <name>]

Produced                          status   version  checker            tools
ux/design/brief.md                draft    1        pass-with-notes    trace ok · pii ok
ux/personas/charge-nurse.md       draft    1        pass               trace ok

Open findings (need a decision): F2 major — JOB-06 rests on P02 only (H1 q1)
Overrides used: none
Built on unsigned input: none
Caught this stage: tools 2 · checker 5 · people 1 (checker missed 1)
What the next stage needs: <one line, from the handoff card>
Recommendation: sign off with condition "JOB-06 marked low" — or send back F2 to synthesiser

Reply with one of:
  sign off <artifact|all> as <name>
  sign off <artifact|all> as <name> with conditions: <…>
  send back <artifact> to <role>: <direction>
  overrule <finding> as <name> because <reason>
```
