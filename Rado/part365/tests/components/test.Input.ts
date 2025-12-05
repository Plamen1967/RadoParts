import { Locator, Page } from "@playwright/test";

export class TestInput{
    private page: Page
    private formcontrolname: string
    private input: Locator;

    constructor(page: Page, formcontrolname: string) {
        this.page = page;
        this.formcontrolname = formcontrolname;
        this.input = this.page.locator(`app-input[formcontrolname='${this.formcontrolname}']`).getByRole("textbox");
    }

    async enterInput(input: string | number) {
        await this.input.fill(input.toString())
    }
}