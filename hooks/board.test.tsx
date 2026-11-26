import { expect, test } from 'claude-code/testing'

const ticket = (id: string, front: string, body = '') =>
  `---\nid: ${id}\n${front}\n---\n## What\nDo the thing.\n${body}`

const FILES: Record<string, string> = {
  'ux/team/board/J-001.md': ticket('J-001', 'title: Clean intake\nstage: frame\nkind: job\nmode: afk\nrole: synthesiser\nstatus: proposed\nblockedBy: []'),
  'ux/team/board/J-002.md': ticket('J-002', 'title: Synthesis\nstage: frame\nkind: job\nmode: afk\nrole: synthesiser\nstatus: proposed\nblockedBy: [J-001]'),
  'ux/team/board/G-frame-1.md': ticket('G-frame-1', 'title: Research owner signs the pack\nstage: frame\nkind: gate\nmode: hitl\nrole: research-owner\nstatus: ready\nblockedBy: []',
    '## For you\n**Question:** Sign off the research pack?\n'),
}

const GATE = `# Gate 1 · Frame → Explore
| # | Question | ★ | Evidence to look at | Fix at | AI verdict + evidence | Human decision | Owner |
|---|---|---|---|---|---|---|---|
| A1 | Was the problem sentence written by a person? | ★ | Brief | 9, 14 | Pass: ux/design/brief.md:12 | | |
| A3 | Does each success outcome say what it's measured against? | | Brief | 9 | Gap: outcome 2 has no baseline | | |
`

const PANE = {
  plugin: 'koru-studio',
  component: 'Pane',
  requestId: 'studio-board',
  props: { title: 'Koru Studio board', isFocused: true, bodyColumns: 70, placement: 'dock', scroll: { offset: 0, bodyRows: 60 }, view: {} },
} as const

test('the pane shows the plan and the gate, and its buttons send the person\'s words', async ($, on) => {
  const submitted: string[] = []
  const rel = (path: string) => (path.includes('ux/') ? path.slice(path.indexOf('ux/')) : path)
  on('fs.exists', (_, e) => ({ value: ['ux/project-context.md', 'ux/team/board', 'ux/team/gates'].includes(rel(e.path)) }))
  on('fs.read', (_, e) => ({ value: rel(e.path) === 'ux/project-context.md' ? '---\nproject: Meridian\n---' : rel(e.path).startsWith('ux/team/gates/') ? GATE : FILES[rel(e.path)] ?? '' }))
  on('clock.every', () => ({ value: undefined }))
  on('fs.list', (_, e) => rel(e.path) === 'ux/team/gates' ? ({ value: [{ name: 'meridian-frame-gate-v1-draft.md', kind: 'file', size: 1, mtimeMs: 1, isLink: false }] }) : ({ value: Object.keys(FILES).map(f => ({ name: f.split('/').pop() ?? f, kind: 'file', size: 1, mtimeMs: 1, isLink: false })) }))
  on('command.register', () => ({ value: { command: 'studio-board' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('prompt.submit', (_, e) => { submitted.push(e.text); return { text: e.text } })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/p', surface: 'desktop', isInteractive: true })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /Sign off the research pack/ }))?.text).toContain('Sign off the research pack')
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'pick-J-002' })
  await ui.press({ key: 'plan-yes' })
  expect(submitted.at(-1)).toBe('Partial yes: run J-001; decline J-002. Show me what declining strands before anything runs.')

  await ui.input({ key: 'names-G-frame-1', text: 'Ben Ito', kind: 'change' })
  await ui.press({ key: 'sign-G-frame-1' })
  expect(submitted.at(-1)).toBe('sign off G-frame-1 (Research owner signs the pack) as Ben Ito')

  // gate gaps: only the open Gap shows (A1 passed), and Fix sends the person's words
  expect((await ui.find({ type: 'Text', text: /measured against/ }))?.text).toContain('measured against')
  await ui.press({ key: 'fix-meridian-frame-gate-v1-draft.md:A3' })
  expect(submitted.at(-1)).toBe('Fix A3 on Gate 1 · Frame → Explore: back to 9.')
  await ui.unmount()
})
