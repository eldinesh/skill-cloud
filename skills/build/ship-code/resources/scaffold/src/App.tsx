import { useScenario } from './data/scenario';
import { ReviewBar } from './review/ReviewBar';
import { Today } from './routes/today/Today';
import { t } from './strings/en';

export function App() {
  const scenario = useScenario();
  return (
    <>
      <a className="skip" href="#main">{t.app.skip}</a>
      <header className="app-header">
        <strong>{t.app.name}</strong>
        <nav aria-label={t.app.navLabel}>
          <a href="/" aria-current="page">{t.app.navBook}</a>
          <a href="#mine">{t.app.navMine}</a>
          <a href="#help">{t.app.navHelp}</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <Today scenario={scenario} />
      </main>
      <ReviewBar scenario={scenario} />
    </>
  );
}
