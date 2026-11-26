// SkillCloud's state contract: what the board pane and band keep for the session.

export type Ticket = {
  id: string
  title: string
  stage: string
  kind: string
  mode: string
  role: string
  status: string
  route: string
  verdict: string
  blockedBy: string[]
  question: string
  forYou: string
  what: string
  doneWhen: string
  log: string[]
  moment: string
  file: string
  mtimeMs: number
}

export type GateGap = {
  gate: string
  file: string
  id: string
  question: string
  blocking: boolean
  fixAt: string
  verdict: string
}

export type HistoryEvent = {
  id: string
  short: string
  at: string
  title: string
  kind: string
  ticket: string
  stage: string
  actor: string
  chose: string
  over: string
  detail: string
  files: { s: string; p: string }[]
}

export type BoardView = {
  isProject: boolean
  hasBoard: boolean
  project: string
  tickets: Ticket[]
  gaps: GateGap[]
}

declare module 'claude-code' {
  interface PluginState {
    'koru-studio': {
      board: Shaped<BoardView>
      history: Shaped<HistoryEvent[]>
      picks: Record<string, 'approve' | 'decline'>
      names: Record<string, string>
      notes: Record<string, string>
      opened: string
      sent: Record<string, string>
    }
  }
}
