// Generated from ux/harden/hardening-matrix.md (TEST-R03): one row per screen × state × role.
// Regenerate when the matrix changes. Coverage follows the design, not memory.
export interface Cell { step: string; route: string; state: string; role: string; landmark: string; }

export const matrix: Cell[] = [
  { step: 'FL-01.S01', route: '/', state: 'ready', role: 'member', landmark: 'ai-suggested' },
  { step: 'FL-01.S01', route: '/', state: 'ready', role: 'admin', landmark: 'admin-releases' },
  { step: 'FL-01.S01', route: '/', state: 'loading', role: 'member', landmark: 'state-loading' },
  { step: 'FL-01.S01', route: '/', state: 'empty', role: 'member', landmark: 'state-empty' },
  { step: 'FL-01.S01', route: '/', state: 'error', role: 'member', landmark: 'state-error' },
  { step: 'FL-01.S02', route: '/', state: 'ai-thinking', role: 'member', landmark: 'ai-thinking' },
  { step: 'FL-01.S02', route: '/', state: 'ai-low-confidence', role: 'member', landmark: 'ai-low-confidence' },
];
