import { defineStore } from 'pinia';

export type Currency = 'ILS' | 'USD' | 'PHP';
export type Locale = 'en' | 'he';

interface SettingsState {
  currency: Currency;
  locale: Locale;
  rates: Record<string, number>; // Base currency is ILS
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    currency: 'ILS',
    locale: 'en',
    // Base currency rates - ILS = 1 (placeholder rates)
    rates: {
      ILS: 1,      // Base currency
      USD: 0.27,    // 1 ILS = 0.27 USD (placeholder rate)
      PHP: 15.2     // 1 ILS = 15.2 PHP (placeholder rate)
    }
  }),

  getters: {
    currentRate: (state) => state.rates[state.currency] || 1
  },

  actions: {
    setCurrency(currency: Currency) {
      this.currency = currency;
      this.persistToStorage();
    },

    setLocale(locale: Locale) {
      this.locale = locale;
      this.persistToStorage();
    },

    loadFromStorage() {
      try {
        const stored = localStorage.getItem('dream-pack-settings');
        if (stored) {
          const settings = JSON.parse(stored);
          if (settings.currency && ['ILS', 'USD', 'PHP'].includes(settings.currency)) {
            this.currency = settings.currency;
          }
          if (settings.locale && ['en', 'he'].includes(settings.locale)) {
            this.locale = settings.locale;
          }
        }
      } catch (error) {
        console.warn('Failed to load settings from storage:', error);
      }
    },

    persistToStorage() {
      try {
        localStorage.setItem('dream-pack-settings', JSON.stringify({
          currency: this.currency,
          locale: this.locale
        }));
      } catch (error) {
        console.warn('Failed to persist settings to storage:', error);
      }
    }
  }
});