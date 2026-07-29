import { expect, Page } from '@playwright/test';

export function uniqueEmail(prefix = 'user') {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function registerUser(
  page: Page,
  options?: { email?: string; password?: string; firstName?: string; lastName?: string },
) {
  const email = options?.email ?? uniqueEmail();
  const password = options?.password ?? 'Password123!';
  const firstName = options?.firstName ?? 'Tester';
  const lastName = options?.lastName ?? 'Person';

  await page.goto('/register/');
  await page.getByPlaceholder('Имя').fill(firstName);
  await page.getByPlaceholder('Фамилия').fill(lastName);
  await page.getByPlaceholder('Почта').fill(email);
  await page.getByPlaceholder('Пароль', { exact: true }).fill(password);
  await page.getByPlaceholder('Повторите пароль').fill(password);
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

  await expect(page.getByAltText('Календарь')).toBeVisible({ timeout: 30_000 });

  return { email, password, firstName, lastName };
}

export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/auth/');
  await page.getByPlaceholder('Почта').fill(email);
  await page.getByPlaceholder('Пароль').fill(password);
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByAltText('Календарь')).toBeVisible({ timeout: 30_000 });
}

export async function logoutUser(page: Page) {
  await page.getByAltText('Личный кабинет').click();
  await page.getByRole('button', { name: 'Выйти из аккаунта' }).click();
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible({ timeout: 15_000 });
}
