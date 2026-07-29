import type { Locale } from '@/i18n/types';
import type { TranslationKey } from './ru';
import { ru } from './ru';
import { en } from './en';

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  ru,
  en,
};

export type { TranslationKey };
export { ru, en };
