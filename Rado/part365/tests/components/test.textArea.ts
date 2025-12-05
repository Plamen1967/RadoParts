import { Locator, Page } from "@playwright/test";

export class TestTextArea {
    private page: Page;
    private textArea: Locator;
    constructor(page: Page, placeHolder: string) {
        this.page = page;
        this.textArea = this.page.getByRole('textbox').and(this.page.getByPlaceholder(placeHolder));
    }

    async enterTextArea(text: string) {
        await this.textArea.fill(text)
    }
}