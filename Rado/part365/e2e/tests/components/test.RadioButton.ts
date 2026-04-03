import { Locator, Page } from "@playwright/test";

export class TestRadioButton {
    private page: Page;
    private choices: Locator;
    private formcontrolname: string;

    constructor(page: Page, formcontrolname: string) {
        this.page = page;
        this.formcontrolname = formcontrolname;
        this.choices = this.page.locator(`input[formcontrolname="${formcontrolname}"]`);
    }

    async checkValue(value: string) {
        await this.page.locator(`input[formcontrolname="${this.formcontrolname}"]`).and(this.page.locator(`#${value}`)).check()   
    }

    async checkByLabel(label: string) {
        await this.page.getByLabel('Лявa').click();
//        // await this.page.getByLabel('Лявa').click();
        await this.page.getByLabel(label).click()   
    }




}