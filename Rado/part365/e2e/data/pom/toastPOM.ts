import { Page } from "@playwright/test"

export class ToastPOM {
    private page: Page
    constructor(page: Page) {
        this.page = page
    }
    async checkToastMessage(message: string) {
        const toast = this.page.locator('simple-snack-bar');
        await toast.waitFor({ state: 'visible' , timeout: 500000 });
        await toast.getByText("Ok").click(); 
    }   
    async checkToast() {
        await this.page.locator('simple-snack-bar').getByText("Ok").click(); 
    }   
}