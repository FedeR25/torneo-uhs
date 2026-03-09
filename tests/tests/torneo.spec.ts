import { test, expect } from '@playwright/test';

const URL = 'https://torneo-uhs.onrender.com';

test('la app carga correctamente', async ({ page }) => {
  await page.goto(URL);
  await expect(page).toHaveTitle(/Torneo/);
});

test('se ve la tabla de posiciones', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#tabla h2')).toContainText('Tabla de Posiciones');
});

test('se puede cambiar a la pestaña fixture', async ({ page }) => {
  await page.goto(URL);
  await page.click('text=Fixture');
  await expect(page.locator('#fixture h2')).toContainText('Fixture');
});

test('se puede cambiar a la pestaña goleadores', async ({ page }) => {
  await page.goto(URL);
  await page.click('text=Goleadores');
  await expect(page.locator('#goleadores h2')).toContainText('Tabla de Goleadores');
});

test('al hacer clic en un partido se abre el modal', async ({ page }) => {
  await page.goto(URL);
  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await expect(page.locator('#modal')).toBeVisible();
});