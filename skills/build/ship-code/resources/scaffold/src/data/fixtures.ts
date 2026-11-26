// Synthetic data only (CODE-R20, STR-R11): fictional names, plausible values, four volumes.
import type { Room } from './types';

const base: readonly Room[] = [
  { id: 'r-juniper', name: 'Juniper', seats: 8, features: ['screen', 'whiteboard'], checkedMinutesAgo: 2, freeUntil: '16:00' },
  { id: 'r-harbour', name: 'Harbour View Collaboration Suite (Floor 3, East Wing)', seats: 14, features: ['screen', 'video'], checkedMinutesAgo: 2, freeUntil: '17:30' },
  { id: 'r-nook2', name: 'Nook 2', seats: 2, features: [], checkedMinutesAgo: 4, freeUntil: '18:00' },
  { id: 'r-atlas', name: 'Atlas', seats: 6, features: ['screen'], checkedMinutesAgo: 1, freeUntil: '15:45' },
];

export type Volume = 'none' | 'one' | 'typical' | 'lots';

export function roomsFor(volume: Volume): readonly Room[] {
  switch (volume) {
    case 'none':
      return [];
    case 'one':
      return base.slice(0, 1);
    case 'typical':
      return base;
    case 'lots':
      return Array.from({ length: 40 }, (_, i) => {
        const r = base[i % base.length] as Room;
        return { ...r, id: `${r.id}-${i + 1}`, name: `${r.name} ${i + 1}` };
      });
    default: {
      const never: never = volume;
      return never;
    }
  }
}
