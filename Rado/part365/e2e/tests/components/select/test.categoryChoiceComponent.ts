import { Page } from "@playwright/test";
import { TestCustomSelectComponent } from "./test.customSelectComponent";

export class TestCategoryChoiseComponent {
    private page: Page;
    private formcontrolname: string;
    private customSelect: TestCustomSelectComponent

    constructor(page: Page, formcontrolname: string) {
        this.page = page;
        this.formcontrolname = formcontrolname;
        this.customSelect = new TestCustomSelectComponent(this.page, this.formcontrolname);
    }

    async select(value: string, confirm = true) {
        await this.customSelect.select(value, confirm);
    }
}