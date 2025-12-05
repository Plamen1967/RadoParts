import { Page} from "@playwright/test";

export class TestCustomSelectComponent 
{
    constructor(private readonly page: Page, private readonly formcontrolname: string) {
        
    }

    async select(value: string, confirm = true) {
        await  this.page.locator(`[formcontrolname="${this.formcontrolname}"]`).locator('app-customselect').locator('div.selection').click()
        await this.page.locator('mat-dialog-container').getByTestId('search').fill(value);
        await this.page.getByText(value).click();
        if (confirm) {
            await this.page.getByText('Потвърди').first().click()
        }
    }

}
