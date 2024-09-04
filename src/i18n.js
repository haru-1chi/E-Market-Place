import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

i18n.use(backend).use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  fallbackLng: "th",
  returnObjects: true,
  backend: {
    loadPath: '/locales/{{lng}}/translation.json',
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
