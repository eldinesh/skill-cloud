// FL-01.S01 "Open Today" + FL-01.S02 "Pick a room" · N1.2 Today · ux/structure/flows/book-a-room.md
// States: loading · empty · error · ready (ai: off · thinking · suggested · low-confidence) · roles: member · admin
import { useEffect, useRef } from 'react';
import { Button } from '../../components/Button/Button';
import { todayState, type Scenario } from '../../data/scenario';
import type { AiState, Room } from '../../data/types';
import { roomMeta, stalestMinutes } from '../../lib/format';
import { t, whyText } from '../../strings/en';
import styles from './Today.module.css';

export function Today({ scenario }: { readonly scenario: Scenario }) {
  const state = todayState(scenario);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []); // A11Y-R14: focus to h1 on route entry

  return (
    <section aria-labelledby="h-today" data-step="FL-01.S01">
      <h1 id="h-today" ref={heading} tabIndex={-1} className={styles.title}>{t.today.title}</h1>
      <Body state={state} role={scenario.role} />
    </section>
  );
}

function Body({ state, role }: { readonly state: ReturnType<typeof todayState>; readonly role: Scenario['role'] }) {
  switch (state.kind) {
    case 'loading':
      return (
        <div data-testid="state-loading" aria-busy="true">
          <p className={styles.muted}>{t.today.loading}</p>
          <div className={styles.skeleton} aria-hidden="true" />
          <div className={styles.skeleton} aria-hidden="true" />
        </div>
      );
    case 'empty':
      return (
        <div className={styles.card} data-testid="state-empty">
          <p>{t.today.empty}</p>
          <Button variant="secondary">{t.today.emptyAction}</Button>
        </div>
      );
    case 'error':
      return (
        <>
          <div className={styles.error} role="alert" data-testid="state-error">
            <strong>{t.today.errorTitle}</strong> {t.today.errorBody} <Button variant="secondary">{t.today.retry}</Button>
          </div>
          <RoomList rooms={state.kept} />
        </>
      );
    case 'ready':
      return (
        <div data-testid="state-ready">
          <Ai ai={state.ai} />
          {role === 'admin' && (
            <p className={styles.info} data-testid="admin-releases">
              {t.today.adminReleases} <a href="#releases">{t.today.adminReview}</a>
            </p>
          )}
          <p className={styles.muted}>
            {t.today.count(state.rooms.length)}{t.today.sep}{t.today.checked(stalestMinutes(state.rooms))}
          </p>
          <RoomList rooms={state.rooms} />
        </div>
      );
    default: {
      const never: never = state;
      return never;
    }
  }
}

function Ai({ ai }: { readonly ai: AiState }) {
  switch (ai.kind) {
    case 'off':
      return null;
    case 'thinking':
      return (
        <div className={styles.suggestion} data-testid="ai-thinking">
          <span className={styles.aiLabel}>{t.ai.thinking}</span>
          <p className="sr-only" aria-live="polite">{t.ai.thinking}</p>
        </div>
      );
    case 'suggested':
      return (
        <div className={styles.suggestion} data-testid="ai-suggested">
          <span className={styles.aiLabel}>{t.ai.label}</span>
          <div className={styles.row}>
            <div>
              <div className={styles.name}>{ai.suggestion.room.name}</div>
              <div className={styles.muted} data-testid="ai-why">{t.ai.why} {whyText(ai.suggestion.why)}</div>
            </div>
            <Button aria-label={t.today.bookLabel(ai.suggestion.room.name)}>{t.today.book}</Button>
          </div>
          <p className="sr-only" aria-live="polite">{t.ai.ready(ai.suggestion.room.name)}</p>
        </div>
      );
    case 'low-confidence':
      return (
        <div className={styles.suggestion} data-testid="ai-low-confidence">
          <span className={styles.aiLabel}>{t.ai.label}</span>
          <p>{t.ai.lowConfidence}</p>
          <div className={styles.row}>
            {ai.options.map((o) => (
              <Button key={o.room.id} variant="secondary">{o.room.name}{t.today.sep}{whyText(o.why)}</Button>
            ))}
          </div>
        </div>
      );
    default: {
      const never: never = ai;
      return never;
    }
  }
}

function RoomList({ rooms }: { readonly rooms: readonly Room[] }) {
  return (
    <ul className={styles.list}>
      {rooms.map((r) => (
        <li key={r.id} className={`${styles.card} ${styles.row}`}>
          <div>
            <div className={styles.name}>{r.name}</div>
            <div className={styles.muted}>{roomMeta(r)}</div>
          </div>
          <Button variant="secondary" aria-label={t.today.bookLabel(r.name)}>{t.today.book}</Button>
        </li>
      ))}
    </ul>
  );
}
