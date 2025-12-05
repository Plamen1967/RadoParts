import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://radoparts.com/');
  await page.getByRole('button', { name: 'Гуми', exact: true }).click();
  await page.getByRole('button', { name: 'search Tърси' }).click();
  await page.getByText('Материал:магнезиеви , Център:').click();
  await page.getByRole('button', { name: 'Назад' }).click();
  await page.getByRole('button', { name: '2' }).nth(1).click();
  await page.getByRole('button', { name: '1' }).first().click();
  await page.getByText('Материал:магнезиеви , Център:').click();
  await page.getByRole('button', { name: 'Назад' }).click();
  await page.getByRole('button', { name: '2' }).nth(1).click();
  await page.getByRole('button', { name: '1' }).first().click();
});