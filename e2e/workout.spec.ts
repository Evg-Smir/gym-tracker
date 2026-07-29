import { expect, test } from '@playwright/test';
import { registerUser } from './helpers/auth';
import { blockServiceWorker, clearAppStorage } from './helpers/storage';

function dayButton(page: import('@playwright/test').Page, day: number) {
  return page
    .locator('.MuiPickersDay-root:not(.MuiPickersDay-dayOutsideMonth)')
    .filter({ hasText: new RegExp(`^${day}$`) });
}

function exerciseInList(page: import('@playwright/test').Page, name: string) {
  return page.locator('[class*="exercisesItemName"]').filter({ hasText: name });
}

test.describe('workout', () => {
  test.beforeEach(async ({ page }) => {
    await blockServiceWorker(page);
    await clearAppStorage(page);
    await registerUser(page);
  });

  test('adds an exercise and a set for today', async ({ page }) => {
    await page.getByAltText('Плюс').click();
    await page.getByText('Грудь', { exact: true }).click();
    await page.getByText('Жим штанги на плоской').click();
    await page.getByRole('button', { name: 'Выбрать' }).click();

    await expect(exerciseInList(page, 'Жим штанги на плоской')).toBeVisible();

    await exerciseInList(page, 'Жим штанги на плоской').click();
    await page.locator('[class*="emptyField"]').click();

    await page.getByRole('button', { name: 'Добавить подход' }).click();
    await page.getByPlaceholder('Вес').fill('80');
    await page.getByPlaceholder('Повторения').fill('5');
    await page.getByRole('button', { name: 'Готово' }).click();

    await expect(page.getByRole('button', { name: 'Готово' })).toBeHidden();
    await expect(page.locator('[class*="exercisesSetFields"]').getByText('80', { exact: true })).toBeVisible();
    await expect(page.locator('[class*="exercisesSetFields"]').getByText('5', { exact: true })).toBeVisible();
  });

  test('keeps exercises when switching days and returning', async ({ page }) => {
    await page.getByAltText('Плюс').click();
    await page.getByText('Грудь', { exact: true }).click();
    await page.getByText('Жим штанги на плоской').click();
    await page.getByRole('button', { name: 'Выбрать' }).click();
    await expect(exerciseInList(page, 'Жим штанги на плоской')).toBeVisible();

    const today = new Date().getDate();
    const otherDay = today >= 28 ? today - 1 : today + 1;

    await page.getByAltText('Calendar').click();
    await expect(dayButton(page, otherDay)).toBeVisible();
    await dayButton(page, otherDay).click();

    await expect(page.getByText('Добавьте упражнение, чтобы записать тренировку')).toBeVisible();
    await expect(page.getByText('Сегодня')).toBeHidden();

    await page.getByAltText('Calendar').click();
    await expect(dayButton(page, today)).toBeVisible();
    await dayButton(page, today).click();

    await expect(page.getByText('Сегодня')).toBeVisible();
    await expect(exerciseInList(page, 'Жим штанги на плоской')).toBeVisible();
  });
});
