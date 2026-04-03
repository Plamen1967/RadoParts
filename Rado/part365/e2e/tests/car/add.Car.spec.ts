import { test, expect } from '@playwright/test'
import { ListCarPOM } from '../../data/pom/listCarsPOM'
import { LoginPage } from '../../data/pom/loginPOM'
import { AdPage } from '../../data/pom/adPagePOM';
import { AddCarPOM } from '../../data/pom/addCarPOM';
import { ToastPOM } from '../../data/pom/toastPOM';

test('add car', async({page}) => {

    const adPage: AdPage = new AdPage(page);
    await adPage.open();

    const data = {
        carName_try: 'Car 22',
        carName: 'Car 45',
        company: 'Audi',
        model: '100 (43) (1976 - 1982)',
        modification: '1.6 (85 Hp) (1976 - 1982)',
        vin: '12345678901234567',
        year: 1976,
        description: 'Колата идва с двигател'
    }


    await page.getByRole('button', {name: 'Добавете Кола'}).click();
    await expect(page).toHaveURL('/data/addCar?ad=new');
    const addCarPage = new AddCarPOM(page);
    const toastPOM = new ToastPOM(page);

    await addCarPage.enterCarName(data.carName_try);
    await addCarPage.enterVin("123456789012345");

    await addCarPage.save();
    await toastPOM.checkToast();

    await addCarPage.checkCompanyRequired();
    await addCarPage.checkVinMinLength();

    await addCarPage.enterCompany(data.company);
    await addCarPage.enterVin(data.vin);

    await addCarPage.save();
    await toastPOM.checkToast();

    await addCarPage.enterCarName(data.carName);

    await addCarPage.checkModelRequired()
    await addCarPage.checkNoVinMinLength();

    await addCarPage.enterModel(data.model)

    await addCarPage.save();
    await toastPOM.checkToast();

    await addCarPage.checkModificationRequired()

    await addCarPage.enterModification(data.modification)

    await addCarPage.enterYear(data.year);
    await addCarPage.enterDescription(data.description);

    await addCarPage.save();
    await expect(page.locator("Saving")).toHaveCount(0);
    await toastPOM.checkToastMessage('Колата е успешно добавена');
    // await expect(page.getByText('Колата е успешно добавена')).toBeVisible();
    // await page.getByRole('button', { name: 'Ok' }).click();


    await expect(page).toHaveURL('/data/cars');
    await expect(page.locator(`div[title="${data.carName}"]`)).toBeVisible();
    await expect(page.locator(`div[title="${data.carName}"]`).locator('.highlighted')).toBeVisible();
    await expect(page.locator('app-row', { hasText: data.carName })).toBeVisible();
})


test('find car through /cars', async ({ page }) => {
    const filter = {
        carId: "Car 45"
    }
    await page.goto('/data/cars')
    const loginPage = new LoginPage(page)
    await loginPage.login('rado', 'rado')

    const listCarPOM = new ListCarPOM(page)
    await listCarPOM.selectCarId(filter.carId);
    await listCarPOM.checkItemByCarName(filter.carId)
    await listCarPOM.checkButtons(filter.carId)
})

test('delete car', async({page}) => {
    const filter = {
        carId: "Car 45"
    }
    await page.goto('/data/cars')
    const loginPage = new LoginPage(page)
    await loginPage.login('rado', 'rado')

    const listCarPOM = new ListCarPOM(page)
    await listCarPOM.selectCarId(filter.carId);
    await listCarPOM.checkItemByCarName(filter.carId)
    await listCarPOM.checkButtons(filter.carId)
    await listCarPOM.deleteItem(filter.carId);

})