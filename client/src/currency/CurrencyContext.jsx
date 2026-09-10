import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BASE_CURRENCY, CURRENCIES, REFRESH_MS, loadRates } from './rates.js';

const STORAGE_KEY = 'tb-pos-currency';

const CurrencyContext = createContext({
  currency: BASE_CURRENCY,
  setCurrency: () => {},
  rates: { USD: 1 },
  live: false,
  updatedAt: null,
  convert: (usd) => usd,
  toUSD: (amount) => amount,
  format: (usd) => String(usd),
});

function isSupported(code) {
  return CURRENCIES.some((c) => c.code === code);
}

function initialCurrency() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupported(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return BASE_CURRENCY;
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(initialCurrency);
  const [rates, setRates] = useState({ USD: 1 });
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const timerRef = useRef(null);

  const setCurrency = useCallback((code) => {
    if (!isSupported(code)) return;
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const res = await loadRates();
      if (cancelled) return;
      setRates(res.rates);
      setLive(res.live);
      setUpdatedAt(res.fetchedAt);
    };
    refresh();
    timerRef.current = setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, []);

  const meta = useMemo(
    () => CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0],
    [currency],
  );

  const convert = useCallback(
    (usd) => Number(usd || 0) * (rates[currency] ?? 1),
    [rates, currency],
  );

  const toUSD = useCallback(
    (amount) => Number(amount || 0) / (rates[currency] ?? 1),
    [rates, currency],
  );

  const format = useCallback(
    (usd) => {
      try {
        return new Intl.NumberFormat(meta.locale, { style: 'currency', currency: meta.code }).format(
          convert(usd),
        );
      } catch {
        return `${meta.symbol}${convert(usd).toFixed(2)}`;
      }
    },
    [convert, meta],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates, live, updatedAt, convert, toUSD, format }),
    [currency, setCurrency, rates, live, updatedAt, convert, toUSD, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
