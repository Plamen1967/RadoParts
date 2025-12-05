import { Page } from "@playwright/test";

export class LoginPage {
    page: Page;
    constructor(page_: Page) {
        this.page = page_;
    }

    async login(userName: string, password: string) {
        await this.page.getByPlaceholder('Потребителско име/Е-майл/Телефон').fill(userName);
        await this.page.locator('app-inputpassword').getByPlaceholder('Въведи парола').fill(password);
        await this.page.getByRole('button', {name: 'Login'}).click();
    }
}