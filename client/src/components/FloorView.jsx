import { useTranslation } from '../i18n/I18nContext.jsx';

const STATUSES = ['available', 'occupied', 'reserved', 'billing', 'cleaning'];

export default function FloorView({ tables, zoneFilter, onSelectTable, onStatusChange }) {
  const { t } = useTranslation();
  const zones = [...new Set(tables.map((tbl) => tbl.zone))];
  const visible = zones.filter((z) => zoneFilter === 'all' || z === zoneFilter);

  return (
    <>
      {visible.map((zone) => (
        <section className="zone" key={zone}>
          <h2 className="zone-title">{zone}</h2>
          <div className="table-grid">
            {tables
              .filter((tbl) => tbl.zone === zone)
              .map((tbl) => (
                <div
                  key={tbl.id}
                  className={`table-card ${tbl.status}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${tbl.name} · ${t(`floor.status.${tbl.status}`)}`}
                  onClick={() => onSelectTable(tbl)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTable(tbl);
                    }
                  }}
                >
                  <div
                    className="status-boxes"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`status-box box-${s}${s === tbl.status ? ' current' : ''}`}
                        title={t(`floor.status.${s}`)}
                        aria-label={`${tbl.name}: ${t(`floor.status.${s}`)}`}
                        aria-pressed={s === tbl.status}
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(tbl, s);
                        }}
                      />
                    ))}
                  </div>
                  <b>{tbl.name}</b>
                  <span>{t('floor.seats', { capacity: tbl.capacity })} · {t(`floor.status.${tbl.status}`)}</span>
                  {tbl.waiter ? <span>{tbl.waiter}</span> : null}
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
