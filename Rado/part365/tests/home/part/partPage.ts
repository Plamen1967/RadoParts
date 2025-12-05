import { Page, Locator } from "@playwright/test";
import { TestMultiSelectionComponent } from "../../components/select/test.multiSelectionComponent";

export class PartPage {
    private company?: TestMultiSelectionComponent;
    private model?: Locator;
    private _page: Page;
    private search: Locator;
    
    constructor(private page: Page) {

        this.company = new TestMultiSelectionComponent(page, "companyId"); 
        this.search = page.locator('button', { hasText: ' Tърси' });
        this._page = page;
    }

    async selectCompany(companyName: string) {
        await this.company?.selectChoise(companyName);
    }

    async selectModel(modelName: string, confirm = false) {
        const model = new TestMultiSelectionComponent(this._page, "modelId");
        await model.selectChoise(modelName, confirm);
    }

    async Search() {
        await this._page.locator('app-searchbutton').click();
    }
}