import { test, expect } from '@playwright/test';

const URL = 'https://torneo-uhs.onrender.com';

test('la app carga correctamente', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await expect(page).toHaveTitle(/Torneo/, { timeout: 30000 });
});

test('se ve la tabla de posiciones', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await expect(page.locator('#tabla h2')).toContainText('Tabla de Posiciones');
});

test('se puede cambiar a la pestaña fixture', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('text=Fixture');
  await expect(page.locator('#fixture h2')).toContainText('Fixture');
});

test('se puede cambiar a la pestaña goleadores', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('text=Goleadores');
  await expect(page.locator('#goleadores h2')).toContainText('Tabla de Goleadores');
});

test('al hacer clic en un partido se abre el modal', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await expect(page.locator('#modal')).toBeVisible();
});

test('cargar un resultado con contraseña correcta', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  page.on('dialog', async dialog => {
    await dialog.accept('UHS2026');
  });
  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await expect(page.locator('#modal')).toBeVisible();
  await page.fill('#input-home', '2');
  await page.fill('#input-away', '1');
  await page.locator('#modal .btn-guardar').click();
  await expect(page.locator('#modal')).toBeHidden();
});

test('contraseña incorrecta mantiene el modal abierto', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  page.on('dialog', async dialog => {
    await dialog.accept('wrongpass');
  });
  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await page.fill('#input-home', '1');
  await page.fill('#input-away', '1');
  await page.locator('#modal .btn-guardar').click();
  await expect(page.locator('#modal')).toBeVisible();
});

test('se ve la pestaña próxima fecha', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('text=Próxima Fecha');
  await expect(page.locator('#proxima h2')).toContainText('Próxima Fecha');
  await expect(page.locator('#proxima-container')).not.toBeEmpty();
});

test('se ve la pestaña jugadores', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.click('text=Jugadores');
  await expect(page.locator('#jugadores h2')).toContainText('Jugadores');
  await expect(page.locator('#lista-jugadores')).not.toBeEmpty();
});