import { test } from '@playwright/test';
import { PartPage } from '../tests/home/part/partPage';

test('Search part', async ({ page }) => {
  await page.goto('https://localhost:4200/');

  const partPage = new PartPage(page);
  await partPage.selectCompany('');
});