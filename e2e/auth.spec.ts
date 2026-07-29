import { expect, test } from '@playwright/test';
import { loginUser, logoutUser, registerUser, uniqueEmail } from './helpers/auth';
import { blockServiceWorker, clearAppStorage } from './helpers/storage';

test.describe('auth', () => {
  test.beforeEach(async ({ page }) => {
    await blockServiceWorker(page);
    await clearAppStorage(page);
  });

  test('registers a new user and lands on home', async ({ page }) => {
    await registerUser(page);
    await expect(page.getByText('Сегодня')).toBeVisible();
    await expect(page.getByAltText('Плюс')).toBeVisible();
  });

  test('logs in an existing user and can log out', async ({ page }) => {
    const email = uniqueEmail('login');
    const password = 'Password123!';

    await registerUser(page, { email, password });
    await logoutUser(page);

    await clearAppStorage(page);
    await loginUser(page, email, password);
    await expect(page.getByText('Сегодня')).toBeVisible();

    await logoutUser(page);
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();
  });
});
