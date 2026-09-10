import { useTranslation } from '../i18n/I18nContext.jsx';
import { useCurrency } from '../currency/CurrencyContext.jsx';

export default function Cart({ order, onRemoveItem, onNewOrder, onPay }) {
  const { t } = useTranslation();
  const { format } = useCurrency();

  return (
    <aside className="cart">
      <div className="cart-head">
        <div>
          <h2>{t('cart.title')}</h2>
          <p>{order ? `${order.order_number} · ${order.type}` : t('cart.noTable')}</p>
        </div>
        <button type="button" aria-label={t('cart.newOrder')} title={t('cart.newOrder')} onClick={onNewOrder}>＋</button>
      </div>
      <div className="cart-items">
        {order?.items?.length ? (
          order.items.map((i) => (
            <div className="line" key={i.id}>
              <div>
                <b>{i.quantity}× {i.name}</b>
                <br />
                <small>{(i.modifiers || []).join(', ')}</small>
              </div>
              <div>
                <b>{format(i.price * i.quantity)}</b>{' '}
                <button type="button" className="remove" onClick={() => onRemoveItem(i.id)}>×</button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">{t('cart.empty')}</p>
        )}
      </div>
      <div className="totals">
        <div><span>{t('cart.subtotal')}</span><b>{format(order?.subtotal)}</b></div>
        <div><span>{t('cart.tax')}</span><b>{format(order?.tax)}</b></div>
        <div><span>{t('cart.service')}</span><b>{format(order?.service_charge ?? order?.service)}</b></div>
        <div className="total"><span>{t('cart.total')}</span><b>{format(order?.total)}</b></div>
      </div>
      <button type="button" className="pay" disabled={!order?.items?.length} onClick={onPay}>
        {t('cart.pay')}
      </button>
    </aside>
  );
}
