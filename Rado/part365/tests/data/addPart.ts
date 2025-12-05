import { Locator, Page, expect } from "@playwright/test";
import { TestRadioButton } from "../components/test.RadioButton";
import { TestCustomSelectComponent } from "../components/select/test.customSelectComponent";
import { TestCategoryChoiseComponent } from "../components/select/test.categoryChoiceComponent";
import { TestInput } from "../components/test.Input";
import { TestMultiSelectionComponent } from "../components/select/test.multiSelectionComponent";
import { TestSelectOption } from "../components/test.selectOption";
import { TestTextArea } from "../components/test.textArea";

export class AddPart {
    private page: Page;
    private bus!: boolean;
    private partCar: TestRadioButton
    private category: TestCategoryChoiseComponent;
    private price: TestInput;
    private backBtn: Locator;
    private saveBtn: Locator;
    private company?: TestMultiSelectionComponent;
    private partNumber: TestInput;
    private leftRightPosition: TestRadioButton;
    private frontBackPosition: TestRadioButton;
    private description: TestTextArea;

    constructor(page: Page, bus = false) {
        this.page = page;
        this.bus = bus;
        this.partCar = new TestRadioButton(page, 'partForCar');
        this.category = new TestCategoryChoiseComponent(page, 'categoryId');
        this.price = new TestInput(page, 'price');
        this.backBtn = this.page.getByRole('button').and(this.page.getByText("Назад"))
        this.saveBtn = this.page.getByRole('button').and(this.page.getByText("Запиши"))
        this.company = new TestMultiSelectionComponent(page, "companyId");
        this.partNumber = new TestInput(this.page, "partNumber");
        this.leftRightPosition = new TestRadioButton(this.page, "leftRightPosition");
        this.frontBackPosition = new TestRadioButton(this.page, "frontBackPosition");;
        this.description = new TestTextArea(page, 'Детайли за частта');

    }

    async checkPartCar(value: string) {
        await this.partCar.checkValue(value);
    }

    async checkPartCarByLabel(label: string) {
        await this.partCar.checkByLabel(label);
    }

    async selectCarName(carName: string) {
        const car = new TestSelectOption(this.page, "carId");
        await car.selectOption(carName);
    }
    async selectCategory(value: string) {
        await this.category.select(value, false);
    }

    async selectDealerSubCategory(value: string) {
        const dealerSubCategory = new TestCustomSelectComponent(this.page, "dealerSubCategoryId");
        await dealerSubCategory.select(value, false);
    }

    async checkLeftRightPosition(label: string) {
        await this.leftRightPosition.checkByLabel(label)
    }
    
    async checkFrontBackPosition(label: string) {
        await this.frontBackPosition.checkByLabel(label)
    }
    

    async enterPrice(price: string | number) {
        await this.price.enterInput(price.toString())
    }

    async save() {
        await this.saveBtn.click();
    }

    async enterCompany(companyName: string) {
        await this.company?.selectChoise(companyName);
    }

    async enterModel(modelName: string) {
        const model =  new TestMultiSelectionComponent(this.page, "modelId");
        await model.selectChoise(modelName);
    }

    async enterDescription(description: string) {
        await this.description.enterTextArea(description);
    }
    async enterModification(modificationName: string) {
        const model =  new TestMultiSelectionComponent(this.page, "modificationId");
        await model.selectChoise(modificationName);
    }

    async enterPartNumber(partNumber: string) {
        await this.partNumber.enterInput(partNumber);
    }

    async checkCarNameRequired() {
        await expect(this.page.getByText('Избери бус е задължителнa информация.')).toBeVisible();
    }

    async checkCarNameOk() {
        await expect(this.page.getByText('Избери бус е задължителнa информация.')).not.toBeVisible();
    }

    async checkCategoryRequired() {
        await expect(this.page.getByText('Избери категория е задължителнa информация.')).toBeVisible();
    }

    async checkDealerSubCategoryRequired() {
        await expect(this.page.getByText('Избери Подкатегория Дилър е задължителнa информация.')).toBeVisible();
    }

    async checkDealerSubCategoryTextRequired() {
        await expect(this.page.getByText('Определение на частта е задължителнa информация.')).toBeVisible();
    }

    async checkPriceRequired() {
        await expect(this.page.getByText('Цена трябва да е избран.')).toBeVisible();
    }

    async closePopupMessage() {
        await this.page.getByText('Потвърди').click();
    }


}