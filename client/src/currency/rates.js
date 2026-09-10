export const CURRENCIES = [
  { code: 'USD', locale: 'en-US', symbol: '$' },
  { code: 'INR', locale: 'en-IN', symbol: '₹' },
  { code: 'AED', locale: 'en-AE', symbol: 'د.إ' },
  { code: 'SAR', locale: 'en-SA', symbol: 'ر.س' },
];

export const BASE_CURRENCY = 'USD';
const WANTED = ['INR', 'AED', 'SAR'];
const CACHE_KEY = 'tb-pos-rates';
const REFRESH_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

// AED/SAR are pegged to USD; INR is an approximate fallback used only when
// the live feed and cache are both unavailable.
const STATIC_FALLBACK = { USD: 1, INR: 86.0, AED: 3.6725, SAR: 3.75 };

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.base !== BASE_CURRENCY || !parsed.rates) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ base: BASE_CURRENCY, rates, fetchedAt: Date.now() }));
  } catch {
    /* storage unavailable */
  }
}

async function fetchLiveRates() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', { signal: ctrl.signal });
    if (!r.ok) throw new Error(`rates HTTP ${r.status}`);
    const body = await r.json();
    if (body.result !== 'success' || !body.rates) throw new Error('rates request failed');
    const rates = { USD: 1 };
    for (const code of WANTED) {
      const v = Number(body.rates[code]);
      if (!Number.isFinite(v) || v <= 0) throw new Error(`bad rate for ${code}`);
      rates[code] = v;
    }
    return rates;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadRates() {
  try {
    const rates = await fetchLiveRates();
    writeCache(rates);
    return { rates, live: true, fetchedAt: Date.now() };
  } catch {
    const cached = readCache();
    if (cached) return { rates: cached.rates, live: false, fetchedAt: cached.fetchedAt };
    return { rates: STATIC_FALLBACK, live: false, fetchedAt: null };
  }
}

export { REFRESH_MS };
