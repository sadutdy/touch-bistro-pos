import { useTranslation } from '../i18n/I18nContext.jsx';
import { useCurrency } from '../currency/CurrencyContext.jsx';

const ORDER_TYPES = ['dine-in', 'takeaway', 'delivery'];

export default function PosView({ menu, category, onCategory, orderType, onOrderType, onSelectItem }) {
  const { t } = useTranslation();
  const { format } = useCurrency();
  const categories = ['All', ...new Set(menu.map((m) => m.category))];
  const items = menu.filter((m) => category === 'All' || m.category === category);

  return (
    <>
      <div className="order-types">
        {ORDER_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={type === orderType ? 'active' : ''}
            onClick={() => onOrderType(type)}
          >
            {t(`orderType.${type}`)}
          </button>
        ))}
      </div>
      <div className="categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? 'active' : ''}
            onClick={() => onCategory(c)}
          >
            {c === 'All' ? t('common.all') : c}
          </button>
        ))}
      </div>
      <div className="menu-grid">
        {items.map((m) => {
          const disabled = !m.available || m.out_of_stock;
          return (
            <button
              key={m.id}
              type="button"
              className={`menu-card${disabled ? ' disabled' : ''}`}
              disabled={disabled}
              onClick={() => onSelectItem(m)}
            >
              <div className="emoji">{m.image || '🍽️'}</div>
              <strong>{m.name}</strong>
              <span>{m.description || ''}</span>
              <b>{format(m.price)}</b>
            </button>
          );
        })}
      </div>
    </>
  );
}
