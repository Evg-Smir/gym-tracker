import { dictionaries, type TranslationKey } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/types';

export const translate = (locale: Locale, key: TranslationKey): string => {
  return dictionaries[locale][key] ?? dictionaries.ru[key] ?? key;
};
