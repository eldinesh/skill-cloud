// SkillCloud board: a pane beside the chat and a band above the prompt, drawn from the
// project's ticket files (ux/team/board/*.md). The pane never writes a ticket or signs
// anything: every control sends the person's own words to the session, and /design-lead
// records them. Claude never signs.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { BoardView, Ticket } from '../types'

const PANE = 'skillcloud-board'
const TITLE = 'SkillCloud board'
const DIR = 'ux/team/board'

const board = atom({ plugin: 'skillcloud', key: 'board' } as const,
  { isProject: false, hasBoard: false, project: '', tickets: [] } as BoardView, { shape: 'board-1' })
const picks = atom({ plugin: 'skillcloud', key: 'picks' } as const, {} as Record<string, 'approve' | 'decline'>)
const names = atom({ plugin: 'skillcloud', key: 'names' } as const, {} as Record<string, string>)
const notes = atom({ plugin: 'skillcloud', key: 'notes' } as const, {} as Record<string, string>)
const opened = atom({ plugin: 'skillcloud', key: 'opened' } as const, '')
const sent = atom({ plugin: 'skillcloud', key: 'sent' } as const, {} as Record<string, string>)

// ---------------------------------------------------------------- reading the board

const list = (raw: string): string[] =>
  raw.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean)

const clean = (raw: string | undefined): string => {
  const v = (raw ?? '').replace(/\s+#.*$/, '').trim()
  return v === '""' || v === '[]' ? '' : v.replace(/^"|"$/g, '')
}

export const parseTicket = (text: string, file: string, mtimeMs: number): Ticket => {
  const lines = text.split('\n')
  const fm: Record<string, string> = {}
  let i = 0
  if (lines[0] === '---') {
    for (i = 1; i < lines.length && lines[i] !== '---'; i++) {
      const m = /^([A-Za-z_]+):\s*(.*)$/.exec(lines[i] ?? '')
      if (m && m[1] !== undefined) fm[m[1]] = m[2] ?? ''
    }
    i++
  }
  const sections: Record<string, string[]> = {}
  let current = ''
  for (; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const h = /^##\s+(.+?)\s*$/.exec(line)
    if (h && h[1] !== undefined) { current = h[1].toLowerCase(); sections[current] = []; continue }
    if (current) (sections[current] ??= []).push(line)
  }
  const body = (name: string) => (sections[name] ?? []).join('\n').replace(/<!--[\s\S]*?-->/g, '').trim()
  const forYou = body('for you')
  const q = /\*\*Question:\*\*\s*(.+)/.exec(forYou)
  return {
    id: clean(fm.id) || file.replace(/\.md$/, ''),
    title: clean(fm.title),
    stage: clean(fm.stage),
    kind: clean(fm.kind) || 'job',
    mode: clean(fm.mode) || 'afk',
    role: clean(fm.role),
    status: clean(fm.status) || 'proposed',
    route: clean(fm.route),
    verdict: clean(fm.verdict),
    blockedBy: list(clean(fm.blockedBy)),
    question: q?.[1]?.trim() ?? '',
    forYou,
    what: body('what'),
    doneWhen: body('done when'),
    log: body('log').split('\n').filter(l => l.trim().startsWith('-')).slice(-4),
    file,
    mtimeMs,
  }
}

type Cached = { mtimeMs: number; ticket: Ticket }
const cache = new Map<string, Cached>()
let lastSignature = ''

const refresh = async ($: EngineInterface): Promise<void> => {
  const isProject = await $.fs.exists('ux/project-context.md').catch(() => false)
  const hasBoard = isProject && (await $.fs.exists(DIR).catch(() => false))
  let project = ''
  if (isProject) {
    const ctx: string = await $.fs.read('ux/project-context.md').catch(() => '')
    project = /^project:\s*(.+)$/m.exec(ctx)?.[1]?.trim() ?? ''
  }
  const tickets: Ticket[] = []
  if (hasBoard) {
    const entries: { name: string; kind: string; mtimeMs: number }[] = await $.fs.list(DIR).catch(() => [])
    for (const entry of entries) {
      if (entry.kind !== 'file' || !entry.name.endsWith('.md')) continue
      const hit = cache.get(entry.name)
      if (hit && hit.mtimeMs === entry.mtimeMs) { tickets.push(hit.ticket); continue }
      const text: string = await $.fs.read(`${DIR}/${entry.name}`).catch(() => '')
      const ticket = parseTicket(text, entry.name, entry.mtimeMs)
      cache.set(entry.name, { mtimeMs: entry.mtimeMs, ticket })
      tickets.push(ticket)
    }
  }
  tickets.sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id, undefined, { numeric: true }))
  const signature = `${isProject}|${hasBoard}|${project}|` + tickets.map(t => `${t.file}:${t.mtimeMs}`).join(',')
  if (signature === lastSignature) return
  lastSignature = signature
  await update($, board, () => ({ isProject, hasBoard, project, tickets }))
}

const STAGES = ['frame', 'explore', 'harden', 'ship', 'learn']
const order = (t: Ticket) => (STAGES.indexOf(t.stage) + 1) * 10 + (t.kind === 'gate' ? 5 : 0)

// ---------------------------------------------------------------- what's where

export const sort = (tickets: Ticket[]) => {
  const byId = new Map(tickets.map(t => [t.id, t]))
  const statusOf = (id: string) => byId.get(id)?.status ?? 'missing'
  const isUnblocked = (t: Ticket) => t.blockedBy.every(b => statusOf(b) === 'done')
  const droppedBlockers = (t: Ticket) =>
    t.status === 'done' || t.status === 'dropped' ? [] : t.blockedBy.filter(b => statusOf(b) === 'dropped')
  const waiting = tickets.filter(t =>
    droppedBlockers(t).length > 0 || t.status === 'needs-you' ||
    (t.mode === 'hitl' && t.status === 'ready' && isUnblocked(t)))
  const inWaiting = new Set(waiting.map(t => t.id))
  return {
    waiting,
    droppedBlockers,
    isUnblocked,
    proposed: tickets.filter(t => t.status === 'proposed'),
    doing: tickets.filter(t => t.status === 'doing'),
    review: tickets.filter(t => t.status === 'review'),
    ready: tickets.filter(t => t.status === 'ready' && !inWaiting.has(t.id)),
    done: tickets.filter(t => t.status === 'done'),
    dropped: tickets.filter(t => t.status === 'dropped'),
  }
}

// ---------------------------------------------------------------- the person's words, sent

const send = async ($: EngineInterface, key: string, text: string) => {
  await update($, sent, s => ({ ...s, [key]: text }))
  await $.prompt.submit({ text, asUser: true })
}

export const signOffText = (gate: Ticket, name: string, note: string, kind: 'sign' | 'conditions' | 'back') => {
  if (kind === 'back') return `send back ${gate.id} (${gate.title}): ${note}`
  const base = `sign off ${gate.id} (${gate.title}) as ${name}`
  return kind === 'conditions' ? `${base} with conditions: ${note}` : base
}

export const planText = (proposed: Ticket[], choice: Record<string, 'approve' | 'decline'>) => {
  const declined = proposed.filter(t => choice[t.id] === 'decline').map(t => t.id)
  if (declined.length === 0) return `Yes, run the plan (${proposed.map(t => t.id).join(', ')}).`
  const approved = proposed.filter(t => choice[t.id] !== 'decline').map(t => t.id)
  return `Partial yes: run ${approved.join(', ') || 'nothing'}; decline ${declined.join(', ')}. Show me what declining strands before anything runs.`
}

// ---------------------------------------------------------------- register

export const register: Register = on => {
  let timer: { cancel: () => void } | undefined

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'skillcloud-board', description: 'Open the SkillCloud team board beside the chat' })
    await refresh($)
    timer?.cancel()
    try { timer = $.clock.every(3000, () => { void refresh($) }) } catch { timer = undefined }
    const view = await read($, board)
    if (view.hasBoard) void $.ui.open({ id: PANE, title: view.project ? `${TITLE} · ${view.project}` : TITLE })
    return next(e)
  })

  on('command.run', { command: 'skillcloud-board' }, async $ => {
    await refresh($)
    const view = await read($, board)
    await $.ui.open({ id: PANE, title: view.project ? `${TITLE} · ${view.project}` : TITLE })
    if (!view.isProject) return { text: 'This folder is not a SkillCloud project yet. Run /skillcloud:start to set it up.' }
    const s = sort(view.tickets)
    return { text: `Board open: ${s.waiting.length} wait on you, ${s.doing.length} running, ${s.ready.length} ready, ${s.proposed.length} proposed.` }
  })

  on('turn.complete', async ($, e, next) => {
    void refresh($)
    return next(e)
  })

  // ---- the band above the prompt
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const view = await read($, board)
    if (!view.hasBoard || view.tickets.length === 0 || e.props.hasSurvey) return next(e)
    const s = sort(view.tickets)
    const { Box, Button, Text } = $.ui.resolve(e)
    const parts = [
      s.waiting.length ? `${s.waiting.length} wait on you` : '',
      s.proposed.length ? `${s.proposed.length} proposed` : '',
      s.doing.length ? `${s.doing.length} running` : '',
      s.review.length ? `${s.review.length} being checked` : '',
      s.ready.length ? `${s.ready.length} ready` : '',
    ].filter(Boolean)
    return (
      <Box gap={1}>
        <Text color={s.waiting.length ? 'warning' : 'subtle'}>SkillCloud · {parts.length ? parts.join(' · ') : 'all done'}</Text>
        <Button key="open-board" label="Board" plain onPress={() => { void $.ui.open({ id: PANE, title: TITLE }) }} />
      </Box>
    )
  })

  // ---- the pane
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Input } = $.ui.resolve(e)
    const view = await read($, board)
    const choice = await read($, picks)
    const typedNames = await read($, names)
    const typedNotes = await read($, notes)
    const open = await read($, opened)
    const wasSent = await read($, sent)
    const width = e.props.bodyColumns ?? 60

    if (!view.isProject) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text>This folder isn't a SkillCloud project yet.</Text>
          <Button key="start" label="Set it up" variant="primary"
            onPress={() => { void $.prompt.submit({ text: '/skillcloud:start', asUser: true }) }} />
        </Box>
      )
    }
    if (!view.hasBoard || view.tickets.length === 0) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text>No tickets yet. The design lead files the plan here.</Text>
          <Button key="plan" label="Plan the next stage" variant="primary"
            onPress={() => { void $.prompt.submit({ text: "Where are we? Plan the next stage.", asUser: true }) }} />
        </Box>
      )
    }

    const s = sort(view.tickets)
    const toggle = (id: string) => update($, opened, cur => (cur === id ? '' : id))

    const heading = (label: string, count: number, color?: 'warning' | 'subtle') => (
      <Text bold color={color}>{label} <Text dimColor>{String(count)}</Text></Text>
    )

    const detail = (t: Ticket) => open !== t.id ? null : (
      <Box flexDirection="column" paddingLeft={2} marginBottom={1}>
        {t.what ? <Text wrap="wrap">{t.what}</Text> : null}
        {t.doneWhen ? <Text dimColor wrap="wrap">Done when: {t.doneWhen.replace(/\n-\s*/g, ' · ').replace(/^-\s*/, '')}</Text> : null}
        {t.blockedBy.length ? <Text dimColor>After: {t.blockedBy.join(', ')}</Text> : null}
        {t.log.map(l => <Text dimColor wrap="truncate-end">{l}</Text>)}
        <Text dimColor>{`${DIR}/${t.file}`}</Text>
      </Box>
    )

    const row = (t: Ticket, extra?: string) => (
      <Box flexDirection="column">
        <Button key={`row-${t.id}`} plain onPress={() => { void toggle(t.id) }}>
          {open === t.id ? '▾ ' : '▸ '}{t.id} <Text dimColor>{t.role}</Text> {t.title}
          {extra ? <Text dimColor> {extra}</Text> : ''}
        </Button>
        {detail(t)}
      </Box>
    )

    const keepName = (id: string, value: string) => { void update($, names, m => ({ ...m, [id]: value })) }
    const keepNote = (id: string, value: string) => { void update($, notes, m => ({ ...m, [id]: value })) }
    const field = (map: 'names' | 'notes', id: string, label: string, placeholder: string) => {
      const keep = map === 'names' ? keepName : keepNote
      return (
        <Input key={`${map}-${id}`} label={label} placeholder={placeholder}
          value={(map === 'names' ? typedNames : typedNotes)[id] ?? ''}
          submitLabel="keep"
          onInput={value => keep(id, value)}
          onSubmit={value => keep(id, value)} />
      )
    }

    const waitingCard = (t: Ticket) => {
      const strand = s.droppedBlockers(t)
      const done = wasSent[t.id]
      const name = (typedNames[t.id] ?? '').trim()
      const note = (typedNotes[t.id] ?? '').trim()
      return (
        <Box key={`wait-${t.id}`} flexDirection="column" borderStyle="round" borderColor="warning" paddingX={1} marginBottom={1}>
          {row(t)}
          {t.question ? <Text wrap="wrap">{t.question}</Text> : null}
          {done ? <Text color="success" wrap="wrap">Sent: {done}</Text> : null}
          {!done && strand.length > 0 ? (
            <Box flexDirection="column">
              <Text color="warning" wrap="wrap">Can't start: it needs {strand.join(', ')}, which was dropped.</Text>
              <Box gap={1} flexWrap="wrap">
                <Button key={`drop-${t.id}`} label="Drop it too" onPress={() => { void send($, t.id, `Drop ${t.id} too: it needs ${strand.join(', ')}, which was dropped.`) }} />
                <Button key={`supply-${t.id}`} label="I'll supply the input" onPress={() => { void send($, t.id, `For ${t.id}: I'll supply what ${strand.join(', ')} would have produced. Tell me where to put it.`) }} />
                <Button key={`restore-${t.id}`} label={`Keep ${strand.join(', ')}`} onPress={() => { void send($, t.id, `Restore ${strand.join(', ')}; run it so ${t.id} can start.`) }} />
              </Box>
            </Box>
          ) : null}
          {!done && strand.length === 0 && t.kind === 'gate' ? (
            <Box flexDirection="column">
              {field('names', t.id, 'Your name', 'who signs (the named person)')}
              {field('notes', t.id, 'Note', 'conditions, or what to change')}
              <Box gap={1} flexWrap="wrap">
                <Button key={`sign-${t.id}`} label="Sign off" variant="primary"
                  onPress={() => { if (name) void send($, t.id, signOffText(t, name, note, 'sign')); else void $.ui.toast('Type your name first: a sign-off is a named person\'s.') }} />
                <Button key={`cond-${t.id}`} label="Sign with conditions"
                  onPress={() => { if (name && note) void send($, t.id, signOffText(t, name, note, 'conditions')); else void $.ui.toast('Type your name and the conditions first.') }} />
                <Button key={`back-${t.id}`} label="Send back"
                  onPress={() => { if (note) void send($, t.id, signOffText(t, name, note, 'back')); else void $.ui.toast('Say what to change in the note first.') }} />
              </Box>
            </Box>
          ) : null}
          {!done && strand.length === 0 && t.kind !== 'gate' ? (
            <Box flexDirection="column">
              {field('notes', t.id, 'Answer', t.kind === 'human' ? 'what happened, where the notes are' : 'your answer')}
              <Box gap={1} flexWrap="wrap">
                {t.kind === 'human'
                  ? <Button key={`did-${t.id}`} label="Mark done" variant="primary"
                      onPress={() => { void send($, t.id, `${t.id} (${t.title}) is done.${note ? ' ' + note : ''}`) }} />
                  : <Button key={`answer-${t.id}`} label="Send answer" variant="primary"
                      onPress={() => { if (note) void send($, t.id, `About ${t.id} (${t.title}), from the board: ${note}`); else void $.ui.toast('Type your answer first.') }} />}
              </Box>
            </Box>
          ) : null}
        </Box>
      )
    }

    const proposedBlock = s.proposed.length === 0 ? null : (
      <Box flexDirection="column" marginBottom={1}>
        {heading('Proposed plan', s.proposed.length)}
        <Text dimColor wrap="wrap">Nothing runs until you say yes. Decline a ticket to drop it: anything that needs it is shown before it runs.</Text>
        {s.proposed.map(t => {
          const isDeclined = choice[t.id] === 'decline'
          return (
            <Box key={`prop-${t.id}`} flexDirection="column">
              <Box gap={1}>
                <Button key={`pick-${t.id}`} plain
                  onPress={() => { const next: 'approve' | 'decline' = isDeclined ? 'approve' : 'decline'; void update($, picks, p => ({ ...p, [t.id]: next })) }}>
                  {isDeclined ? <Text color="error">✕ decline</Text> : <Text color="success">✓ run</Text>}
                </Button>
                <Button key={`prow-${t.id}`} plain onPress={() => { void toggle(t.id) }}>
                  <Text strikethrough={isDeclined}>{t.id}</Text> <Text dimColor>{t.role || t.kind}</Text> {t.title}
                </Button>
              </Box>
              {detail(t)}
            </Box>
          )
        })}
        {wasSent.plan ? <Text color="success" wrap="wrap">Sent: {wasSent.plan}</Text> : (
          <Box gap={1} flexWrap="wrap" marginTop={1}>
            <Button key="plan-yes" variant="primary"
              label={s.proposed.some(t => choice[t.id] === 'decline') ? 'Run the approved tickets' : 'Yes, run the plan'}
              onPress={() => { void send($, 'plan', planText(s.proposed, choice)) }} />
            {field('notes', 'plan', 'Change', 'or say what to change in the plan')}
            <Button key="plan-change" label="Send change"
              onPress={() => { const n = (typedNotes.plan ?? '').trim(); if (n) void send($, 'plan', `Change the plan: ${n}`); else void $.ui.toast('Type the change first.') }} />
          </Box>
        )}
      </Box>
    )

    const section = (label: string, items: Ticket[], extra?: (t: Ticket) => string) => items.length === 0 ? null : (
      <Box flexDirection="column" marginBottom={1}>
        {heading(label, items.length, 'subtle')}
        {items.map(t => row(t, extra?.(t)))}
      </Box>
    )

    return (
      <Box flexDirection="column" width={width}>
        <Box flexDirection="column" marginBottom={1}>
          {heading('Waits on you', s.waiting.length, 'warning')}
          {s.waiting.length === 0 ? <Text dimColor>Nothing waits on you.</Text> : s.waiting.map(waitingCard)}
        </Box>
        {proposedBlock}
        {section('Running', s.doing, t => t.route)}
        {section('Being checked', s.review)}
        {section('Ready', s.ready, t => (s.isUnblocked(t) ? 'can start' : `after ${t.blockedBy.join(', ')}`))}
        {section('Done', s.done, t => t.verdict)}
        {section('Dropped', s.dropped)}
        <Text dimColor wrap="wrap">Buttons send your words to the session, and the design lead records them. Claude never signs.</Text>
      </Box>
    )
  })
}
