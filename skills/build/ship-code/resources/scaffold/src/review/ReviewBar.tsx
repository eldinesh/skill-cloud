// The review bar (CODE-R28): state · role · data volume · AI. Hidden with ?review=off.
import { ROLES, STATES, VOLUMES, writeScenario, type Scenario } from '../data/scenario';
import { t } from '../strings/en';
import styles from './ReviewBar.module.css';

export function ReviewBar({ scenario }: { readonly scenario: Scenario }) {
  if (new URLSearchParams(window.location.search).get('review') === 'off') return null;
  return (
    <aside className={styles.bar} aria-label={t.review.title}>
      <strong>{t.review.title}</strong>
      <label className={styles.field}>
        {t.review.state}
        <select value={scenario.state} onChange={(e) => writeScenario({ state: e.target.value as Scenario['state'] })}>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        {t.review.role}
        <select value={scenario.role} onChange={(e) => writeScenario({ role: e.target.value as Scenario['role'] })}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        {t.review.data}
        <select value={scenario.volume} onChange={(e) => writeScenario({ volume: e.target.value as Scenario['volume'] })}>
          {VOLUMES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        {t.review.ai}
        <input type="checkbox" checked={scenario.ai} onChange={(e) => writeScenario({ ai: e.target.checked })} />
      </label>
    </aside>
  );
}
