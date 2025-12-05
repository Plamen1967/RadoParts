import { test, expect } from '@playwright/test';

test('Check Web Page Title', async({page}) => {
    await page.goto('http://localhost:4200/');
    await expect(page).toHaveTitle(/Part365/)
    await expect(page.locator('app-categories')).toHaveCount(1);
    await page.locator('app-company-choise').click()
    await page.locator('.display-style').filter({hasText: 'Audi'}).first().click()
    await expect(page.locator('app-company-choise  .selection')).toHaveText('Audi')
    await page.getByRole("button", {name: "Последни търсения"}).click()
    await expect(page.locator('app-filter .description')).toHaveCount(0);
    await page.getByRole('button').filter({hasText: 'Откажи'}).click()
    await expect(page.locator('app-filter')).toHaveCount(0);
    await page.locator("button[type=submit]").click();
    await expect(page.locator('app-result')).toBeTruthy();
    
})