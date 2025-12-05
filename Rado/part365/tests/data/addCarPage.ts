import { Locator, Page, expect } from "@playwright/test";
import { TestMultiSelectionComponent } from "../components/select/test.multiSelectionComponent";
import { TestTextArea } from "../components/test.textArea";
import { TestSelectOption } from "../components/test.selectOption";
import { TestInput } from "../components/test.Input";

export class AddCarPage {
    private page: Page;
    private company: TestMultiSelectionComponent;
    private nameCar: Locator;
    private vin: Locator;
    private powerBHP: TestInput;
    private powerkWh: TestInput;
    private millage: TestInput;
    private engineModel: TestInput;
    private engineType: TestSelectOption;
    private gearboxType: TestSelectOption;
    private regionId: TestSelectOption;
    private backBtn: Locator;
    private saveBtn: Locator;
    private description: TestTextArea;


    constructor(page: Page, bus = false) {
        this.page = page;
        this.company = new TestMultiSelectionComponent(page, "companyId");
        if (bus)
            this.nameCar = this.page.getByRole('textbox').and(this.page.getByPlaceholder("Име на бус"))
        else 
            this.nameCar = this.page.getByRole('textbox').and(this.page.getByPlaceholder("Име на кола"))
        this.vin = this.page.getByRole('textbox').and(this.page.getByPlaceholder("VIN"))
        this.powerBHP = new TestInput(this.page, 'powerBHP');
        this.powerkWh = new TestInput(this.page, 'powerkWh');
        this.millage = new TestInput(this.page, 'millage');
        this.engineModel = new TestInput(this.page, 'engineModel');
        this.description = new TestTextArea(page, 'Допълнителна информация');

        this.engineType = new TestSelectOption(page, "engineType");
        this.gearboxType = new TestSelectOption(page, "gearboxType");
        this.regionId = new TestSelectOption(page, "regionId");

        this.backBtn = this.page.getByRole('button').and(this.page.getByText("Назад"))
        this.saveBtn = this.page.getByRole('button').and(this.page.getByText("Запиши"))
    }

    async enterCarName(carName: string) {
        await this.nameCar.fill(carName);
    }

    async enterVin(vin: string) {
        await this.vin.fill(vin);
    }

    async enterBHP(powerBHP: number) {
        await this.powerBHP.enterInput(powerBHP.toString())
    }
    
    async enterKWH(powerKWH: number) {
        await this.powerkWh.enterInput(powerKWH.toString())
    }

    async enterMillage(millage: number) {
        await this.millage.enterInput(millage.toString())
    }
    
    async engineEngineModel(engineModel: string) {
        await this.engineModel.enterInput(engineModel.toString())
    }
    
    async selectEngineType(select: string) {
        this.engineType.selectOption(select);
    }

    async selectGearboxType(select: string) {
        this.gearboxType.selectOption(select);
    }

    async selectRegion(select: string) {
        this.regionId.selectOption(select);
    }

    async enterCompany(companyName: string) {
        await this.company.selectChoise(companyName);
    }

    async enterModel(modelName: string) {
        const model =  new TestMultiSelectionComponent(this.page, "modelId");
        await model.selectChoise(modelName);
    }

    async enterModification(modificationName: string) {
        const model =  new TestMultiSelectionComponent(this.page, "modificationId");
        await model.selectChoise(modificationName);
    }

    async enterYear(year: number) {
        const yearSelect = new TestSelectOption(this.page, "year");
        await yearSelect.selectOption(year.toString());
    }

    async enterDescription(description: string) {
        await this.description.enterTextArea(description);
    }
    async save() {
        await this.saveBtn.click();
    }
    
    async checkCompanyRequired() {
        await expect(this.page.getByText('Марка е задължителнa информация.')).toBeVisible();
    }

    async checkModelRequired() {
        await expect(this.page.getByText('Модел е задължителнa информация.')).toBeVisible();
    }

    async checkModificationRequired() {
        await expect(this.page.getByText('Модификация е задължителнa информация.')).toBeVisible();
    }

    async checkCarNameRequired() {
        await expect(this.page.getByText('Име на кола е задължителнa информация.')).toBeVisible();
    }

    async checkVinMinLength() {
        await expect(this.page.getByText('VIN е твърде късо (минимално 17).')).toBeVisible();;
    }

    async checkNoVinMinLength() {
        await expect(this.page.getByText('VIN е твърде късо (минимално 17).')).not.toBeVisible();;
    }

    async checkVinMaxLength() {
        await expect(this.page.getByText('VIN е твърде дълго (максимум 17).')).toBeVisible();;
    }
}
