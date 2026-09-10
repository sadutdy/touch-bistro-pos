import { useEffect, useState } from 'react';
import { fetchOrder } from '../api.js';
import { useTranslation } from '../i18n/I18nContext.jsx';
import { useCurrency } from '../currency/CurrencyContext.jsx';

const STATUSES = ['available', 'occupied', 'reserved', 'billing', 'cleaning'];

function parseDbTime(value) {
  if (!value) return null;
  const ms = new Date(String(value).replace(' ', 'T') + 'Z').getTime();
  return Number.isFinite(ms) ? ms : null;
}

function formatElapsed(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function TableModal({ table, waiters, onClose, onSave, onStartOrder, onStatusChange }) {
  const { t } = useTranslation();
  const { format } = useCurrency();
  const [waiter, setWaiter] = useState(table.waiter || '');
  const [pending, setPending] = useState(null);
  const [order, setOrder] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setWaiter(table.waiter || '');
  }, [table.id, table.waiter]);

  useEffect(() => {
    let cancelled = false;
    setOrder(null);
    if (table.active_order_id) {
      fetchOrder(table.active_order_id)
        .then((o) => {
          if (!cancelled) setOrder(o);
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [table.active_order_id]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!table) return null;

  const run = async (kind, fn) => {
    setPending(kind);
    try {
      await fn();
    } catch (e) {
      alert(e.message);
    } finally {
      setPending(null);
    }
  };

  const pickStatus = (s) => {
    setMenuOpen(false);
    if (s !== table.status) onStatusChange(table, s);
  };

  const changedAt = parseDbTime(table.updated_at);
  const showItems = order != null && order.type === 'dine-in' && (order.items?.length ?? 0) > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('header.table', { name: table.name })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>
            {t('header.table', { name: table.name })}{' '}
            {table.active_order_id ? <span className="table-badge">{t('table.active')}</span> : null}
          </h2>
          <div
            className="status-wrap"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setMenuOpen(false);
            }}
          >
            <button
              type="button"
              className={`status-badge-btn ${table.status}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={t('table.changeStatus')}
              title={t('table.changeStatus')}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {t(`floor.status.${table.status}`)} <span aria-hidden="true">▾</span>
            </button>
            {menuOpen ? (
              <div className="status-menu" role="menu" aria-label={t('table.changeStatus')}>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="menuitemradio"
                    aria-checked={s === table.status}
                    className={s === table.status ? 'current' : ''}
                    onClick={() => pickStatus(s)}
                  >
                    <span className={`menu-dot ${s}`} aria-hidden="true" />
                    {t(`floor.status.${s}`)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <p className="modal-sub">
          {table.zone} · {t('floor.seats', { capacity: table.capacity })}
        </p>

        <div className="table-info">
          <div className="info-row">
            <span className="info-label">{t('table.status')}</span>
            <span className={`status-badge ${table.status}`}>{t(`floor.status.${table.status}`)}</span>
            {changedAt != null ? (
              <span className="elapsed" title={t('table.statusTime')}>
                {formatElapsed(now - changedAt)}
              </span>
            ) : null}
          </div>
          <div className="info-row">
            <span className="info-label">{t('table.waiter')}</span>
            <b>{table.waiter || t('table.noWaiter')}</b>
          </div>
        </div>

        {showItems ? (
          <div className="order-items">
            <h3 className="order-items-title">
              {t('table.items')} · {order.order_number}
            </h3>
            {order.items.map((i) => (
              <div className="order-line" key={i.id}>
                <div>
                  <b>{i.quantity}× {i.name}</b>
                  {(i.modifiers?.length ?? 0) > 0 ? (
                    <>
                      <br />
                      <small>{i.modifiers.join(', ')}</small>
                    </>
                  ) : null}
                </div>
                <b>{format(i.price * i.quantity)}</b>
              </div>
            ))}
            <div className="order-line order-total">
              <span>{t('cart.total')}</span>
              <b>{format(order.total)}</b>
            </div>
          </div>
        ) : null}

        <label className="field-label" htmlFor="table-waiter">{t('table.waiter')}</label>
        <input
          id="table-waiter"
          className="control w-full"
          list="waiter-suggestions"
          placeholder={t('table.waiterPh')}
          value={waiter}
          onChange={(e) => setWaiter(e.target.value)}
          autoComplete="off"
        />
        <datalist id="waiter-suggestions">
          {waiters.map((w) => (
            <option key={w} value={w} />
          ))}
        </datalist>

        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={pending != null}
            onClick={() => run('save', () => onSave({ waiter: waiter.trim() }))}
          >
            {pending === 'save' ? '…' : t('table.save')}
          </button>
          <button
            type="button"
            className="pay"
            disabled={pending != null}
            onClick={() => run('start', () => onStartOrder({ waiter: waiter.trim() }))}
          >
            {pending === 'start'
              ? '…'
              : table.active_order_id
                ? t('table.open')
                : t('table.start')}
          </button>
        </div>
      </div>
    </div>
  );
}
