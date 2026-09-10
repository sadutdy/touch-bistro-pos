import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LanguageProvider } from './i18n/I18nContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { CurrencyProvider } from './currency/CurrencyContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
