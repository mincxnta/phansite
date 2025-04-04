import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from '../locales/es.json'
import en from '../locales/en.json'

const resources = {
    es: {
        translation: es,
    },
    en: {
        translation: en
    }
}

const savedLanguage = localStorage.getItem('language') || 'es';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'], // Prioritza localStorage abans del navegador
      caches: ['localStorage'], // Desa l'idioma detectat a localStorage
    },
  });

  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
  });

  export default i18n;