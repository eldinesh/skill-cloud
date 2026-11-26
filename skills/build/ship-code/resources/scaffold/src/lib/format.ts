import { t } from '../strings/en';
import type { Room } from '../data/types';

/** "8 seats · Screen, Whiteboard · free until 16:00" */
export function roomMeta(room: Room): string {
  const features = room.features.map((f) => t.features[f] ?? f).join(', ');
  return [t.today.seats(room.seats), features, t.today.freeUntil(room.freeUntil)].filter(Boolean).join(' · ');
}

/** Freshness shown with the list (AIX-R07): the stalest room drives the line. */
export function stalestMinutes(rooms: readonly Room[]): number {
  return rooms.reduce((max, r) => Math.max(max, r.checkedMinutesAgo), 0);
}
