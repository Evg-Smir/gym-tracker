'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/en';

import { useLocaleStore } from '@/stores/localeStore';

export const LocaleSync = () => {
  const locale = useLocaleStore((state) => state.locale);

  useEffect(() => {
    dayjs.locale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
};
