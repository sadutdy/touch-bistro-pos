import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_LANG, isSupported, translate } from './translations.js';

const STORAGE_KEY = 'tb-pos-lang';
const RTL_LANGS = new Set(['ar']);

const I18nContext = createContext({ lang: DEFAULT_LANG, setLang: () => {}, t: (k) => k });

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupported(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((code) => {
    if (!isSupported(code)) return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
