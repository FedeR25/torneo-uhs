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

test('cargar un resultado con contraseña correcta', async ({ page }) => {
  await page.goto(URL);
  
  // Interceptar el prompt de contraseña
  page.on('dialog', async dialog => {
    await dialog.accept('UHS2026');
  });

  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await expect(page.locator('#modal')).toBeVisible();

  await page.fill('#input-home', '2');
  await page.fill('#input-away', '1');
  await page.click('.btn-guardar');

  // Verificar que el modal se cerró y la página recargó
  await expect(page.locator('#modal')).toBeHidden();
});

test('contraseña incorrecta muestra error', async ({ page }) => {
  await page.goto(URL);

  // Interceptar el prompt con contraseña incorrecta
  page.on('dialog', async dialog => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('contraseña_incorrecta');
    } else {
      await dialog.accept();
    }
  });

  await page.click('text=Fixture');
  await page.locator('.partido-card').first().click();
  await page.fill('#input-home', '1');
  await page.fill('#input-away', '1');
  await page.click('.btn-guardar');

  // Verificar que aparece el alert de error
  await expect(page.locator('#modal')).toBeVisible();
});