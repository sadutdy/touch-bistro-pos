import { useTranslation } from '../i18n/I18nContext.jsx';

export default function InventoryView({ inventory, onToggle }) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="p-3">{t('inv.title')}</h2>
      {inventory.map((i) => (
        <div className="inventory-row" key={i.id}>
          <b>{i.name}</b>
          <span className={i.low_stock ? 'low' : ''}>
            {i.quantity} {i.unit}{i.low_stock ? ` · ${t('inv.low')}` : ''}
          </span>
          <span>{t('inv.min', { value: i.low_stock_threshold })}</span>
          <button type="button" className="secondary" onClick={() => onToggle(i)}>
            {i.out_of_stock ? t('inv.enable') : t('inv.markOut')}
          </button>
        </div>
      ))}
    </>
  );
}
