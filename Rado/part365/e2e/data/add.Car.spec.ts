import { test } from '@playwright/test'
import { LoginPage } from '../../tests/login/loginPOM'
import { ListCarPOM } from '../../tests/data/listCars'

test('add car through /cars', async ({ page }) => {
    const filter = {
        carId: "А 5 2013"
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
        carId: "А 5 2013"
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