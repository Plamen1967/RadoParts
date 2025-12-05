import { Page, expect } from '@playwright/test'
import { LoginPage } from '../login/loginPOM'

export class AdPage {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async open() {
        const loginPage = new LoginPage(this.page)
        await this.page.goto('/')
        await this.page.getByRole('button', { name: 'Добави Обява' }).click()
        await loginPage.login('rado', 'rado')
        await this.page.getByRole('button', { name: 'Добави Обява' }).click()

        await expect(this.page).toHaveURL('/data/addNew')

        await expect(this.page.getByRole('button', { name: 'Добавете Кола' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Добавете Бус' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Добавете Част за кола' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Добавете Част за бус' })).toBeVisible()
        await expect(this.page.getByRole('button', { name: 'Добавете Джанта/Гума' })).toBeVisible()
    }
}
