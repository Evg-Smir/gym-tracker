import { Page } from '@playwright/test';

export async function clearAppStorage(page: Page) {
  await page.goto('/auth/');
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('PWAStorage');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  });
}

export async function blockServiceWorker(page: Page) {
  await page.route('**/sw.js', (route) => route.abort());
}
