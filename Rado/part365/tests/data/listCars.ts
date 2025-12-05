import { Page, expect } from "@playwright/test";
import { TestSelectOption } from "../components/test.selectOption";
import { TestCustomSelectComponent } from "../components/select/test.customSelectComponent";

export class ListCarPOM {

    private carIdSelect: TestSelectOption;
    private yearSelect: TestSelectOption;
    private companyMusltiSelect: TestCustomSelectComponent;

    constructor(private page: Page) {
        this.carIdSelect = new TestSelectOption(this.page, "carId");
        this.companyMusltiSelect = new TestCustomSelectComponent(page, "companyId")
        this.yearSelect = new TestSelectOption(page, "year")
    }

    async selectCarId(carId: string) {
         await this.carIdSelect.selectOption(carId);
    }

   async selectModel(model: string) {
        const modelSelect = new TestCustomSelectComponent(this.page, "modelId");
        await modelSelect.select(model);
    }

    async selectModification(model: string) {
        const modificationSelect = new TestCustomSelectComponent(this.page, "modificationId");
        await modificationSelect.select(model);
    }

    async checkItemByCarName(carName: string) {
        const item = this.page.locator(`[title="${carName}"]`);
        await expect(item).toHaveCount(1);
    }

    async checkButtons(carName: string) {
        await expect(this.page.locator(`[title="${carName}"]`).getByText("Добави")).toHaveCount(1);
        await expect(this.page.locator(`[title="${carName}"]`).getByText("Изтрий")).toHaveCount(1);
        await expect(this.page.locator(`[title="${carName}"]`).getByText("Добави Част")).toHaveCount(1);
        const countParts = await this.page.locator(`[title="${carName}"]`).getByText("Брой части").count();
        if ( countParts > 0) {
            await expect(this.page.locator(`[title="${carName}"]`).getByText("Покажи части")).toHaveCount(1);
            await this.page.locator(`[title="${carName}"]`).getByText("Покажи части").click();
            const count = await this.page.locator(`[title="${carName}"]`).locator('app-dealerview').count();
            await expect(count).toBeGreaterThan(0);
            await expect(this.page.locator(`[title="${carName}"]`).getByText("Скрий части")).toHaveCount(1);
            await this.page.locator(`[title="${carName}"]`).getByText("Скрий части").click();
            await expect(this.page.locator(`[title="${carName}"]`).getByText("Покажи части")).toHaveCount(1);
        }
    }

    async deleteItem(carName: string) {
        await this.page.locator(`[title="${carName}"]`).getByText("Изтрий").click();
        await this.page.locator('Потвърди').click();
    }
}