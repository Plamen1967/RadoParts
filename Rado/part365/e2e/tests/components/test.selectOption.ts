import { Locator, Page } from "@playwright/test";

export class TestSelectOption {
    private page: Page;
    private selectOption_: Locator;
    private formcontrolName: string;
    constructor(page: Page, formcontrolName: string) {
        this.page = page;
        this.formcontrolName = formcontrolName;
        this.selectOption_ = this.page.locator(`app-select[formcontrolname="${formcontrolName}"]`);
    }

    async selectOption(option: string) {
        await  this.page.locator(`app-select[formcontrolname="${this.formcontrolName}"]`).locator('select').selectOption({label: option});
    }
}