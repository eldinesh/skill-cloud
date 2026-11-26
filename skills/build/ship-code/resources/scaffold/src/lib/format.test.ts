import { describe, expect, it } from 'vitest';
import { roomMeta, stalestMinutes } from './format';
import { roomsFor } from '../data/fixtures';
import { readScenario, todayState } from '../data/scenario';

describe('roomMeta', () => {
  it('omits the feature segment for a room with none', () => {
    const nook = roomsFor('typical').find((r) => r.id === 'r-nook2');
    expect(nook && roomMeta(nook)).toBe('2 seats · free until 18:00');
  });
});

describe('stalestMinutes', () => {
  it('returns the oldest sync among rooms, 0 for none', () => {
    expect(stalestMinutes(roomsFor('typical'))).toBe(4);
    expect(stalestMinutes([])).toBe(0);
  });
});

describe('todayState', () => {
  it('turns a ready scenario with no data into the empty state', () => {
    expect(todayState(readScenario('?state=ready&volume=none')).kind).toBe('empty');
  });
  it('drops the AI entirely with ai=off (AIX-R10)', () => {
    const s = todayState(readScenario('?ai=off'));
    expect(s.kind === 'ready' && s.ai.kind).toBe('off');
  });
  it('falls back to defaults on unknown params', () => {
    expect(readScenario('?state=bogus&role=root')).toMatchObject({ state: 'ready', role: 'member' });
  });
});
