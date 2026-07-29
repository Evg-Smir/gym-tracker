'use client';

import { useEffect } from 'react';

import { withBasePath } from '@/lib/basePath';

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register(withBasePath('/sw.js')).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  }, []);

  return null;
};
