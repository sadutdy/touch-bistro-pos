import { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/I18nContext.jsx';

export default function ModifierModal({ item, onClose, onAdd }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setSelected([]);
    setNotes('');
  }, [item?.id]);

  if (!item) return null;

  const toggle = (mod) =>
    setSelected((prev) => (prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={t('modifier.title')} onClick={(e) => e.stopPropagation()}>
        <h2>{t('modifier.title')}</h2>
        <div>
          {(item.modifiers || []).map((m) => (
            <label className="check" key={m}>
              <input type="checkbox" checked={selected.includes(m)} onChange={() => toggle(m)} /> {m}
            </label>
          ))}
        </div>
        <input
          className="control w-full mt-3"
          placeholder={t('modifier.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button type="button" className="pay" onClick={() => onAdd(selected, notes)}>{t('modifier.add')}</button>
        </div>
      </div>
    </div>
  );
}
