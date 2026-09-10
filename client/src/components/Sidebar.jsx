import { useTranslation } from '../i18n/I18nContext.jsx';

const ICONS = {
  floor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M3.5 12h17M12 3.5v17" />
    </svg>
  ),
  pos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M8.5 7.5h7M8.5 11h7M8.5 14.5h4" />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 7.5 12 3.5l8.5 4L12 11.5z" />
      <path d="M3.5 7.5V16.5L12 20.5l8.5-4V7.5" />
      <path d="M12 11.5V20.5" />
    </svg>
  ),
};

const VIEWS = ['floor', 'pos', 'inventory'];

export default function Sidebar({ view, onNavigate }) {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">TB</div>
        <div className="brand-text">
          <strong>Touch Bistro</strong>
          <small>{t('brand.tag')}</small>
        </div>
      </div>
      <p className="sidebar-label">{t('sidebar.menu')}</p>
      <nav className="sidebar-nav" aria-label={t('sidebar.navLabel')}>
        {VIEWS.map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              type="button"
              className={`nav${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavigate(v)}
            >
              <span className="nav-icon" aria-hidden="true">{ICONS[v]}</span>
              <span className="nav-label">{t(`nav.${v}`)}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot" aria-hidden="true" />
        <div className="status-text">
          <b>{t('sidebar.online')}</b>
          <small>{t('sidebar.live')}</small>
        </div>
      </div>
    </aside>
  );
}
