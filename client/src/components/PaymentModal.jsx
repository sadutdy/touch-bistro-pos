import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/I18nContext.jsx';
import { useCurrency } from '../currency/CurrencyContext.jsx';

const METHOD_VALUES = ['Cash', 'Card', 'Mobile Wallet'];
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
const QUICK = {
  USD: ['10', '20', '50', '100'],
  INR: ['100', '500', '1000', '2000'],
  AED: ['50', '100', '200', '500'],
  SAR: ['50', '100', '200', '500'],
};

export default function PaymentModal({ total, onClose, onConfirm }) {
  const { t } = useTranslation();
  const { currency, format, toUSD } = useCurrency();
  const [method, setMethod] = useState('Cash');
  // Tendered amount is entered in the display currency and converted to USD on confirm.
  const [tendered, setTendered] = useState('');

  const tenderedUsd = tendered ? toUSD(Number(tendered)) : 0;
  const changeUsd = useMemo(() => {
    if (!tendered) return 0;
    return Math.max(0, tenderedUsd - total);
  }, [tendered, tenderedUsd, total]);

  const press = (k) =>
    setTendered((prev) => (k === '⌫' ? prev.slice(0, -1) : prev + k));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={t('pay.title')} onClick={(e) => e.stopPropagation()}>
        <h2>{t('pay.title')}</h2>
        <p className="amount-due">{t('pay.due', { amount: format(total) })}</p>
        <div className="method-grid">
          {METHOD_VALUES.map((m) => (
            <button
              key={m}
              type="button"
              className={m === method ? 'active' : ''}
              onClick={() => setMethod(m)}
            >
              {t(`pay.method.${m}`)}
            </button>
          ))}
        </div>
        <div className="quick-cash">
          {(QUICK[currency] ?? QUICK.USD).map((q) => (
            <button key={q} type="button" onClick={() => setTendered(q)}>{q}</button>
          ))}
        </div>
        <input
          inputMode="decimal"
          className="control w-full text-xl"
          placeholder={`${t('pay.tendered')} (${currency})`}
          value={tendered}
          onChange={(e) => setTendered(e.target.value)}
        />
        <div className="keypad">
          {KEYS.map((k) => (
            <button key={k} type="button" onClick={() => press(k)}>{k}</button>
          ))}
        </div>
        <p className="text-emerald-600 font-bold">{tendered ? t('pay.change', { amount: format(changeUsd) }) : ''}</p>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button
            type="button"
            className="pay"
            onClick={() => onConfirm({ method, tendered: tendered ? tenderedUsd : total })}
          >
            {t('pay.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
