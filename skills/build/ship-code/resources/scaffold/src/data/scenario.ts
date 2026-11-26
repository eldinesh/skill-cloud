// The scenario layer: one mechanism for review, tests and demos (code chapter → Patterns).
// URL params: ?state= ?role= ?volume= ?ai=off · No network (CODE-R21).
import { useEffect, useState } from 'react';
import { roomsFor, type Volume } from './fixtures';
import type { Role, TodayState } from './types';

export const STATES = ['ready', 'loading', 'empty', 'error', 'ai-thinking', 'ai-low-confidence'] as const;
export type ScenarioState = (typeof STATES)[number];
export const ROLES: readonly Role[] = ['member', 'admin'];
export const VOLUMES: readonly Volume[] = ['typical', 'none', 'one', 'lots'];

export interface Scenario {
  readonly state: ScenarioState;
  readonly role: Role;
  readonly volume: Volume;
  readonly ai: boolean;
}

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value ?? '') ? (value as T) : fallback;
}

export function readScenario(search: string): Scenario {
  const p = new URLSearchParams(search);
  return {
    state: pick(p.get('state'), STATES, 'ready'),
    role: pick(p.get('role'), ROLES, 'member'),
    volume: pick(p.get('volume'), VOLUMES, 'typical'),
    ai: p.get('ai') !== 'off',
  };
}

export function writeScenario(next: Partial<Scenario>): void {
  const p = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(next)) p.set(k, k === 'ai' ? (v ? 'on' : 'off') : String(v));
  window.history.replaceState(null, '', `?${p.toString()}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useScenario(): Scenario {
  const [s, setS] = useState(() => readScenario(window.location.search));
  useEffect(() => {
    const on = () => setS(readScenario(window.location.search));
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  return s;
}

/** Today's state for a scenario: pure, so unit tests and the screen share it. */
export function todayState(s: Scenario): TodayState {
  const rooms = roomsFor(s.volume);
  switch (s.state) {
    case 'loading':
      return { kind: 'loading' };
    case 'error':
      return { kind: 'error', kept: rooms.slice(0, 2) };
    case 'empty':
      return { kind: 'empty' };
    case 'ready':
    case 'ai-thinking':
    case 'ai-low-confidence': {
      if (rooms.length === 0) return { kind: 'empty' };
      const [first, second] = rooms;
      if (!s.ai || !first) return { kind: 'ready', rooms, ai: { kind: 'off' } };
      if (s.state === 'ai-thinking') return { kind: 'ready', rooms, ai: { kind: 'thinking' } };
      if (s.state === 'ai-low-confidence' && second) {
        return {
          kind: 'ready',
          rooms,
          ai: { kind: 'low-confidence', options: [{ room: first, why: ['why.screen'] }, { room: second, why: ['why.closer'] }] },
        };
      }
      return { kind: 'ready', rooms, ai: { kind: 'suggested', suggestion: { room: first, why: ['why.fits', 'why.screen'] } } };
    }
    default: {
      const never: never = s.state;
      return never;
    }
  }
}
