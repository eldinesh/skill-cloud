// All user-facing copy (CNT-R08). Keyed by screen; components never inline literals.
export const t = {
  app: { name: 'Deskly', skip: 'Skip to main content', navLabel: 'Main', navBook: 'Book', navMine: 'My bookings', navHelp: 'Help' },
  today: {
    title: 'Rooms free today',
    loading: 'Checking which rooms are free…',
    empty: 'No rooms are free for the rest of today.',
    emptyAction: 'See tomorrow morning',
    errorTitle: "Couldn't load today's rooms.",
    errorBody: 'Your connection dropped. Rooms you saw a minute ago are below.',
    retry: 'Try again',
    count: (n: number) => `${n} ${n === 1 ? 'room' : 'rooms'} free`,
    checked: (min: number) => `checked ${min} min ago`,
    seats: (n: number) => `${n} seats`,
    freeUntil: (time: string) => `free until ${time}`,
    sep: ' · ',
    book: 'Book',
    bookLabel: (name: string) => `Book ${name}`,
    adminReleases: '3 rooms booked but not checked into.',
    adminReview: 'Review releases',
  },
  ai: {
    label: 'Suggested by assistant',
    thinking: 'Assistant is finding the best fit…',
    lowConfidence: 'Two rooms could work. Which matters more?',
    ready: (name: string) => `Suggestion ready: ${name}`,
    why: 'Why:',
  },
  why: { fits: 'fits your group', screen: 'has a screen', closer: 'closer to you' } as Record<string, string>,
  features: { screen: 'Screen', whiteboard: 'Whiteboard', video: 'Video' } as Record<string, string>,
  review: { title: 'Review', state: 'State', role: 'Role', data: 'Data', ai: 'AI' },
} as const;

export function whyText(keys: readonly string[]): string {
  return keys.map((k) => t.why[k.replace('why.', '')] ?? k).join(', ');
}
