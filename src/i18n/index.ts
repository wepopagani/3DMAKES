import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import itTranslations from './locales/it.json';
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';

const resources = {
  it: {
    translation: itTranslations,
  },
  en: {
    translation: enTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  de: {
    translation: deTranslations,
  },
};

// Strategia audit SEO v3.0: IT è la lingua primaria del sito (mercato Ticino).
// Il rilevamento da `navigator` veniva interpretato dai crawler (e dai visitatori con
// browser in inglese) come contenuto EN, causando l'incoerenza linguistica segnalata.
// Ora IT è SEMPRE il default: gli utenti possono comunque scegliere un'altra lingua
// dal LanguageSelector, che persiste la scelta in localStorage.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    lng: 'it',
    supportedLngs: ['it', 'en', 'fr', 'de'],
    nonExplicitSupportedLngs: false,
    load: 'languageOnly',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      // Ordine: 1) preferenza utente salvata, 2) parametro ?lang=xx esplicito
      //         Volutamente niente `navigator`: evita che il browser in EN/DE/FR
      //         sovrascriva la lingua primaria IT del sito.
      order: ['querystring', 'localStorage', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    returnObjects: true,
  });

export default i18n; 