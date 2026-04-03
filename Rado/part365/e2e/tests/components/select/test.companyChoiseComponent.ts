import { Page } from "@playwright/test";
import { TestCustomSelectComponent } from "./test.customSelectComponent";

export class TestCompanyComponent {

    private company: TestCustomSelectComponent;
    constructor(public readonly page: Page, private readonly formcontrolname: string) {
        this.company = new TestCustomSelectComponent(page, formcontrolname)
    }

    async select(value: string, confirm = true) {
        this.company.select(value, confirm);
    }

}
