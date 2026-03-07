import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ptBR from './locales/pt-BR.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';
import el from './locales/el.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      'pt-BR': { translation: ptBR },
      'zh-CN': { translation: zhCN },
      ja: { translation: ja },
      it: { translation: it },
      pl: { translation: pl },
      tr: { translation: tr },
      ko: { translation: ko },
      ru: { translation: ru },
      el: { translation: el },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
