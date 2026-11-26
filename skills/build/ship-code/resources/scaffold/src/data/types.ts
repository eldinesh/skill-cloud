// Domain objects from ux/structure/ia.md → Object model (CODE-R09). Names match the object model.

export type Role = 'member' | 'admin';

export interface Room {
  readonly id: string;
  readonly name: string;
  readonly seats: number;
  readonly features: readonly string[];
  /** Minutes since the calendar last synced this room (feasibility: 5-min sync). */
  readonly checkedMinutesAgo: number;
  readonly freeUntil: string;
}

export interface Suggestion {
  readonly room: Room;
  /** The one or two factors that drove it, as string keys (AIX-R05). */
  readonly why: readonly string[];
}

/** UI state for the Today screen (CODE-R10, STR-R03): one discriminated union, no parallel booleans. */
export type TodayState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'empty' }
  | { readonly kind: 'error'; readonly kept: readonly Room[] }
  | { readonly kind: 'ready'; readonly rooms: readonly Room[]; readonly ai: AiState };

export type AiState =
  | { readonly kind: 'off' }
  | { readonly kind: 'thinking' }
  | { readonly kind: 'suggested'; readonly suggestion: Suggestion }
  | { readonly kind: 'low-confidence'; readonly options: readonly Suggestion[] };
