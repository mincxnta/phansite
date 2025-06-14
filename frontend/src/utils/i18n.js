/**
 * Configuración y inicialización de i18next para la internacionalización.
 * 
 * Detecta el idioma preferido del usuario, carga los recursos de traducción y maneja el almacenamiento
 * en localStorage para persistencia.
 */
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

/**
 * Obtiene el idioma inicial a partir del localStorage o del idioma del navegador.
 * 
 * @returns {string} Código del idioma ('es' o 'en').
 */
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language.split('-')[0]
  return browserLanguage === 'es' ? 'es' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: ['localStorage'],
    },
  });

  i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
  });

  export default i18n;