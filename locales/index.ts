import { navigation as navEn } from './en/navigation';
import { home as homeEn } from './en/home';
import { tools as toolsEn } from './en/tools';
import { time as timeEn } from './en/time';

import { navigation as navZh } from './zh/navigation';
import { home as homeZh } from './zh/home';
import { tools as toolsZh } from './zh/tools';
import { time as timeZh } from './zh/time';

export type Language = 'en' | 'zh';

const enRaw = {
  nav: navEn,
  home: homeEn,
  tool: {
    ...toolsEn,
    ...timeEn
  }
};

const zhRaw = {
  nav: navZh,
  home: homeZh,
  tool: {
    ...toolsZh,
    ...timeZh
  }
};

function flatten<T extends Record<string, any>>(obj: T, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, flatten(value, newKey));
      } else {
        result[newKey] = String(value);
      }
    }
  }
  return result;
}

const enFlat = flatten(enRaw);
const zhFlat = flatten(zhRaw);

export type TranslationMap = typeof enFlat;
export type TranslationKey = keyof TranslationMap;

export const locales: Record<Language, TranslationMap> = {
  en: enFlat as TranslationMap,
  zh: zhFlat as TranslationMap
};
