import { test, expect } from '@playwright/test';

test('la app carga correctamente', async ({ page }) => {
  await page.goto('https://torneo-uhs.onrender.com/');
  await expect(page).toHaveTitle(/Torneo/);
});

test('se ve la tabla de posiciones', async ({ page }) => {
  await page.goto('https://torneo-uhs.onrender.com/');
  await expect(page.locator('h2')).toContainText('Tabla de Posiciones');
});

test('se puede cambiar a la pestaña fixture', async ({ page }) => {
  await page.goto('https://torneo-uhs.onrender.com/');
  await page.click('text=Fixture');
  await expect(page.locator('h2')).toContainText('Fixture');
});

test('se puede cambiar a la pestaña goleadores', async ({ page }) => {
  await page.goto('https://torneo-uhs.onrender.com/');
  await page.click('text=Goleadores');
  await expect(page.locator('h2')).toContainText('Tabla de Goleadores');
});

test('al hacer clic en un partido se abre el modal', async ({ page }) => {
  await page.goto('https://torneo-uhs.onrender.com/');
  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await expect(page.locator('#modal')).toBeVisible();
});