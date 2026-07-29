import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Locale } from '@/i18n/types';
import { LOCALE_STORAGE_KEY } from '@/i18n/types';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: LOCALE_STORAGE_KEY,
    },
  ),
);
