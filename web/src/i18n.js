import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import moment from 'moment';
import 'moment/locale/pt-br'

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    //debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if(value instanceof Date) return moment(value).format(format); // "key": "The current date is {{date, MM/DD/YYYY}}"
        return value;
      }
    },

    detection: {
      order: ['querystring', 'navigator', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain']
    }
  });

i18n
  .on('languageChanged', function(lng) {
    moment.locale(lng);
  });

export default i18n;