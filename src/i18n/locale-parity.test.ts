import { describe, it, expect } from 'vitest';
import en from './locales/en.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ptBR from './locales/pt-BR.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import itLocale from './locales/it.json';
import pl from './locales/pl.json';
import tr from './locales/tr.json';
import ko from './locales/ko.json';
import ru from './locales/ru.json';

const locales: Record<string, Record<string, string>> = {
  de, es, fr, 'pt-BR': ptBR, 'zh-CN': zhCN, ja, it: itLocale, pl, tr, ko, ru,
};

const enKeys = Object.keys(en).sort();

describe('locale key parity', () => {
  for (const [name, translation] of Object.entries(locales)) {
    it(`${name} has exactly the same keys as en`, () => {
      expect(Object.keys(translation).sort()).toEqual(enKeys);
    });
  }
});
