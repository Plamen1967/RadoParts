import { Page, expect } from "@playwright/test";

export class PopupMessageCheck {
    static async checkMessage(page: Page, message: string) {
        await expect(page.locator('css=div.content')).toHaveText(message);
    }
}