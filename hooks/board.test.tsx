import { expect, test } from 'claude-code/testing'

const ticket = (id: string, front: string, body = '') =>
  `---\nid: ${id}\n${front}\n---\n## What\nDo the thing.\n${body}`

const FILES: Record<string, string> = {
  'ux/team/board/J-001.md': ticket('J-001', 'title: Clean intake\nstage: frame\nkind: job\nmode: afk\nrole: synthesiser\nstatus: proposed\nblockedBy: []'),
  'ux/team/board/J-002.md': ticket('J-002', 'title: Synthesis\nstage: frame\nkind: job\nmode: afk\nrole: synthesiser\nstatus: proposed\nblockedBy: [J-001]'),
  'ux/team/board/G-frame-1.md': ticket('G-frame-1', 'title: Research owner signs the pack\nstage: frame\nkind: gate\nmode: hitl\nrole: research-owner\nstatus: ready\nblockedBy: []',
    '## For you\n**Question:** Sign off the research pack?\n'),
}

const PANE = {
  plugin: 'skillcloud',
  component: 'Pane',
  requestId: 'skillcloud-board',
  props: { title: 'SkillCloud board', isFocused: true, bodyColumns: 70, placement: 'dock', scroll: { offset: 0, bodyRows: 60 }, view: {} },
} as const

test('the pane shows the plan and the gate, and its buttons send the person\'s words', async ($, on) => {
  const submitted: string[] = []
  const rel = (path: string) => (path.includes('ux/') ? path.slice(path.indexOf('ux/')) : path)
  on('fs.exists', (_, e) => ({ value: ['ux/project-context.md', 'ux/team/board'].includes(rel(e.path)) }))
  on('fs.read', (_, e) => ({ value: rel(e.path) === 'ux/project-context.md' ? '---\nproject: Meridian\n---' : FILES[rel(e.path)] ?? '' }))
  on('clock.every', () => ({ value: undefined }))
  on('fs.list', () => ({ value: Object.keys(FILES).map(f => ({ name: f.split('/').pop(), kind: 'file', size: 1, mtimeMs: 1, isLink: false })) }))
  on('command.register', () => ({ value: { command: 'skillcloud-board' } }))
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
  await ui.unmount()
})
