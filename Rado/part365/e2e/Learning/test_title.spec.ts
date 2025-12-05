import { expect, test, devices} from '@playwright/test'

test.use(devices['iPhone 11']);

test('should be titled', async({page, context}) => {
    await context.route('**.jpg', route => route.abort());
    await page.goto('https://example.com/');

    await expect(page).toHaveTitle(/.*Example*/);
})
