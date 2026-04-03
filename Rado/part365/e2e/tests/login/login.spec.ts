import { test, expect } from '@playwright/test'
import { LoginPage } from '../../data/pom/loginPOM'

test('check sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1200 })
    await page.goto('http://localhost:4200/')
    await expect(page).toHaveTitle(/.*Part365.*/)
    await page.getByRole('button', { name: 'menu' }).click()
    await expect(page.getByRole('link', { name: 'Запазени' })).toBeVisible()    
    await expect(page.getByRole('link', { name: 'login Вход/Регистрация' })).toBeVisible()    
    await expect(page.getByRole('link', { name: 'Добави обява' }).locator(".menu")).toBeVisible()

    await page.setViewportSize({ width: 901, height: 1200 })
    await page.goto('http://localhost:4200/')
    await expect(page.getByRole('button', { name: 'menu' })).toHaveCount(0)
    await expect(page.locator('app-categories')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Запазени' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Вход/Регистрация' })).toBeVisible()    
    await expect(page.getByRole('link', { name: 'Добави обява' })).toBeVisible()

})

test('check login', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1200 })
    await page.goto('http://localhost:4200/')
    await page.getByRole('button', { name: 'menu' }).click()
    await page.getByRole('link', { name: 'login Вход/Регистрация' }).click()

    const loginPage = new LoginPage(page);
    await loginPage.login('rado', 'rado')
    await page.getByRole('button', { name: 'menu' }).click()
    await expect(page.locator('span', {hasText: "Акаунт: rado"})).toBeVisible()
    await page.locator('a', {hasText: "exit_to_app Изход"}).click()
    await page.locator('button', {hasText: "Потвърди"}).click()
    await page.getByRole('button', { name: 'menu' }).click()
    await expect(page.locator('span', {hasText: "Акаунт: rado"})).toHaveCount(0)
    await page.getByRole("button", { name: "close", exact: true }).click()

    await page.setViewportSize({ width: 901, height: 1200 })
    await page.getByRole('link', { name: 'Вход/Регистрация', exact: true }).click()    
    await loginPage.login('rado', 'rado')
    await expect(page.getByRole('button', {name: "rado", exact: true})).toBeVisible()
    await page.getByRole('button', {name: "rado", exact: true}).click()
    await page.locator('#navbarNavDropdown').getByText('Изход').click()
    await page.locator('button', {hasText: "Потвърди"}).click()
    await expect(page.getByRole('link', { name: 'Вход/Регистрация', exact: true })).toBeVisible()

})


test('check link', async ({ page }) => {
    await page.goto('https://playwright.dev/')

    // Click the get started link.
    await page.getByRole('link', { name: 'Get started' }).click()
})
