import enTranslations from './en.json';
import zhTranslations from './zh.json';

export type Language = 'en' | 'zh';

export type TranslationMap = typeof enTranslations;
export type TranslationKey = keyof TranslationMap;

export const locales: Record<Language, TranslationMap> = {
  en: enTranslations,
  zh: zhTranslations
};
