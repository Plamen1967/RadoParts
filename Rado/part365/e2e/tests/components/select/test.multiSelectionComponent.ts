import { Page, Locator } from '@playwright/test'

export class TestMultiSelectionComponent {
    private buttonGroup: Locator
    private control: Locator
    private customerSelect: Locator;
    private page:Page;
    private testId: string;

    constructor(public readonly _page: Page, _testId: string) {
        this.page = _page;
        this.testId = _testId
        this.customerSelect = this.page.locator('app-customselect').and(this.page.locator(`#${this.testId}`));
        this.buttonGroup = this.customerSelect.locator('app-buttongroup')
        this.control = this.customerSelect.getByTestId('customer-selectid');
    }

    async selectChoise(companyName: string, confirm = false) {
        await this.buttonGroup.getByTestId('select').click()
        await this._page.locator('mat-dialog-container').getByTestId('search').fill(companyName);
        await this._page.getByText(companyName).click();
        if (confirm) {
            await this._page.getByText('Потвърди').first().click()
        }
    }
}
