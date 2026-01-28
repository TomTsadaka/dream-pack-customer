import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import he from './locales/he.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    he
  }
});

export default i18n;