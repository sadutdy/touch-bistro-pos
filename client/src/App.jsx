import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  addOrderItem,
  createOrder,
  fetchInventory,
  fetchMenu,
  fetchOrder,
  fetchTables,
  patchInventory,
  patchTable,
  payOrder,
  removeOrderItem,
} from './api.js';
import { LANGUAGES } from './i18n/translations.js';
import { useTranslation } from './i18n/I18nContext.jsx';
import { useTheme } from './theme/ThemeContext.jsx';
import { CURRENCIES } from './currency/rates.js';
import { useCurrency } from './currency/CurrencyContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import FloorView from './components/FloorView.jsx';
import PosView from './components/PosView.jsx';
import InventoryView from './components/InventoryView.jsx';
import Cart from './components/Cart.jsx';
import ModifierModal from './components/ModifierModal.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import TableModal from './components/TableModal.jsx';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5z" />
    </svg>
  );
}

export default function App() {
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, rates, live } = useCurrency();
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [view, setView] = useState('floor');
  const [category, setCategory] = useState('All');
  const [orderType, setOrderType] = useState('dine-in');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [pendingMenu, setPendingMenu] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const activeOrderIdRef = useRef(null);
  activeOrderIdRef.current = activeOrder?.id ?? null;
  const orderTypeRef = useRef(orderType);
  orderTypeRef.current = orderType;

  const load = useCallback(async () => {
    try {
      const [tbl, m, inv] = await Promise.all([fetchTables(), fetchMenu(), fetchInventory()]);
      setTables(tbl);
      setMenu(m);
      setInventory(inv);
    } catch (e) {
      alert(e.message);
    }
  }, []);

  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    loadRef.current();
    const socket = io();
    socket.on('table:updated', () => loadRef.current());
    socket.on('inventory:updated', () => loadRef.current());
    socket.on('order:updated', (o) => {
      if (activeOrderIdRef.current && activeOrderIdRef.current === o.id) setActiveOrder(o);
    });
    socket.on('order:paid', () => loadRef.current());
    return () => socket.disconnect();
  }, []);

  const handleSaveTable = async ({ waiter }) => {
    const updated = await patchTable(selectedTable.id, { waiter: waiter || null });
    const fresh = await fetchTables();
    setTables(fresh);
    setSelectedTable(fresh.find((tbl) => tbl.id === updated.id) ?? updated);
  };

  const handleStatusChange = async (tbl, status) => {
    if (tbl.status === status) return;
    try {
      await patchTable(tbl.id, { status });
      const fresh = await fetchTables();
      setTables(fresh);
      setSelectedTable((prev) =>
        prev && prev.id === tbl.id ? fresh.find((x) => x.id === tbl.id) ?? prev : prev,
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const handleStartOrder = async ({ waiter }) => {
    const tbl = selectedTable;
    let order;
    if (tbl.active_order_id) {
      order = await fetchOrder(tbl.active_order_id);
    } else {
      order = await createOrder({
        table_id: tbl.id,
        type: orderTypeRef.current,
        waiter: waiter || tbl.waiter || undefined,
      });
    }
    setActiveTable({ ...tbl, waiter: waiter || tbl.waiter || null });
    setActiveOrder(order);
    setSelectedTable(null);
    setView('pos');
    await loadRef.current();
  };

  const newOrder = async () => {
    try {
      const order = await createOrder({ type: 'takeaway' });
      setActiveTable(null);
      setActiveOrder(order);
      setOrderType('takeaway');
      setView('pos');
    } catch (e) {
      alert(e.message);
    }
  };

  const selectItem = (item) => {
    if (!activeOrder) {
      alert(t('app.noOrder'));
      return;
    }
    setPendingMenu(item);
  };

  const addCustomized = async (modifiers, notes) => {
    try {
      const order = await addOrderItem(activeOrder.id, {
        menu_item_id: pendingMenu.id,
        modifiers,
        notes,
      });
      setActiveOrder(order);
      setPendingMenu(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const order = await removeOrderItem(activeOrder.id, itemId);
      setActiveOrder(order);
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleStock = async (item) => {
    try {
      await patchInventory(item.id, { out_of_stock: item.out_of_stock ? 0 : 1 });
      await loadRef.current();
    } catch (e) {
      alert(e.message);
    }
  };

  const confirmPayment = async ({ method, tendered }) => {
    try {
      await payOrder(activeOrder.id, [{ method, amount: tendered, tendered }]);
      setShowPayment(false);
      window.open(`/api/billing/${activeOrder.id}/receipt`, '_blank');
      setActiveOrder(null);
      setActiveTable(null);
      await loadRef.current();
      setView('floor');
    } catch (e) {
      alert(e.message);
    }
  };

  const title =
    view === 'floor'
      ? t('header.floorTitle')
      : activeTable
        ? t('header.table', { name: activeTable.name })
        : t('header.posTitle');
  const subtitle =
    view === 'floor'
      ? t('header.floorSub')
      : activeTable
        ? t('header.tableSub', { zone: activeTable.zone, seats: t('header.seats', { capacity: activeTable.capacity }) })
        : t('header.takeawaySub');
  const zones = [...new Set(tables.map((tbl) => tbl.zone))];
  const waiters = [...new Set(tables.map((tbl) => tbl.waiter).filter(Boolean))];
  const themeLabel = theme === 'light' ? t('theme.toDark') : t('theme.toLight');
  const rateText = ['INR', 'AED', 'SAR']
    .map((c) => `${c} ${rates[c] != null ? rates[c].toFixed(2) : '—'}`)
    .join(' · ');
  const rateTitle = t(live ? 'currency.live' : 'currency.offline', { rates: rateText });

  return (
    <main className="pos-shell">
      <Sidebar view={view} onNavigate={setView} />
      <section className="workspace">
        <header>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="header-actions">
            <select
              className="control"
              aria-label={t('header.zoneFilter')}
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="all">{t('header.allZones')}</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <select
              className="control lang-select"
              aria-label={t('lang.label')}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </select>
            <select
              className="control lang-select"
              aria-label={t('currency.label')}
              title={rateTitle}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} {c.symbol}</option>
              ))}
            </select>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              <span className="icon-btn-icon" aria-hidden="true">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </span>
            </button>
          </div>
        </header>
        {view === 'floor' && (
          <div id="floorView">
            <FloorView tables={tables} zoneFilter={zoneFilter} onSelectTable={setSelectedTable} onStatusChange={handleStatusChange} />
          </div>
        )}
        {view === 'pos' && (
          <div id="posView">
            <PosView
              menu={menu}
              category={category}
              onCategory={setCategory}
              orderType={orderType}
              onOrderType={setOrderType}
              onSelectItem={selectItem}
            />
          </div>
        )}
        {view === 'inventory' && (
          <div id="inventoryView">
            <InventoryView inventory={inventory} onToggle={toggleStock} />
          </div>
        )}
      </section>
      <Cart
        order={activeOrder}
        onRemoveItem={handleRemoveItem}
        onNewOrder={newOrder}
        onPay={() => setShowPayment(true)}
      />
      {selectedTable && (
        <TableModal
          table={selectedTable}
          waiters={waiters}
          onClose={() => setSelectedTable(null)}
          onSave={handleSaveTable}
          onStartOrder={handleStartOrder}
          onStatusChange={handleStatusChange}
        />
      )}
      {pendingMenu && (
        <ModifierModal item={pendingMenu} onClose={() => setPendingMenu(null)} onAdd={addCustomized} />
      )}
      {showPayment && activeOrder && (
        <PaymentModal
          total={activeOrder.total}
          onClose={() => setShowPayment(false)}
          onConfirm={confirmPayment}
        />
      )}
    </main>
  );
}
