import { useCallback } from 'react';

import type { TranslationKey } from '@/i18n/dictionaries';
import { translate } from '@/i18n/translate';
import { useLocaleStore } from '@/stores/localeStore';

export const useT = () => {
  const locale = useLocaleStore((state) => state.locale);

  return useCallback((key: TranslationKey) => translate(locale, key), [locale]);
};

export const useLocale = () => useLocaleStore((state) => state.locale);
