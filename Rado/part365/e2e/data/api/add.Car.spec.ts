import { expect } from '@playwright/test'
import { LoginPage } from '../../../tests/login/loginPOM'
import { test } from '../../../tests/fixtures/login.spec'

test.describe('Car API testing', () => {
    test('add car', async ({ page, request, api }) => {
        const car = {
            year: 1967,
            regNumber: 'Car 1',
            powerkWh: 100,
            powerBHP: 0,
            engineType: 0,
            millage: 0,
            gearboxType: 0,
            bus: 0,
            modificationName: '1.9 (100 Hp)',
        }
        await page.goto('/')
        await page.getByRole('link', { name: 'Вход/Регистрация' }).click()
        const loginPage = new LoginPage(page)
        await loginPage.login('rado', 'rado')
        await page.getByRole('link').getByText('rado')
        let storage = await page.evaluate(() => JSON.stringify(localStorage))
        while (storage == '{}') storage = await page.evaluate(() => JSON.stringify(localStorage))
        const jwt = JSON.parse(JSON.parse(storage).currentUser)['token']
        const userId = JSON.parse(JSON.parse(storage).currentUser)['userId']
        const modification = await request.get(`http://localhost:29235/api/modification/GetModificationByName?modification=${car.modificationName}`, { headers: { Authorization: `Bearer ${jwt}` } })
        await expect(modification.ok()).toBeTruthy()
        const nextId = await request.get(`http://localhost:29235/api/part/GetNextId`, { headers: { Authorization: `Bearer ${jwt}` } })
        expect(nextId.ok()).toBeTruthy()
        const id = await nextId.json()
        const modificationId = await modification.json()
        const result = await request.post('http://localhost:29235/api/car', {
            data: {
                carId: id,
                modificationId: modificationId.modificationId,
                userId: 5,
                year: car.year,
                regNumber: car.regNumber,
                powerkWh: car.powerkWh,
                powerBHP: car.powerBHP,
                engineType: car.engineType,
                millage: car.millage,
                gearboxType: car.gearboxType,
                bus: car.bus,
            },
            headers: { Authorization: `Bearer ${jwt}` },
        })
        expect(result.status()).toBe(400)
        const message = await result.json()
        expect(message.message).toEqual('Колата не може да бъде записана')
        console.log(message.message)
        expect(result.statusText()).toEqual('Bad Request')
        const correct_cresult = await request.post(`${api}/car`, {
            data: {
                carId: id,
                modificationId: modificationId.modificationId,
                userId: userId,
                year: car.year,
                regNumber: car.regNumber,
                powerkWh: car.powerkWh,
                powerBHP: car.powerBHP,
                engineType: car.engineType,
                millage: car.millage,
                gearboxType: car.gearboxType,
                bus: car.bus,
            },
            headers: { Authorization: `Bearer ${jwt}` },
        })
        const displayPartView = await correct_cresult.json()
        expect(correct_cresult.status()).toBe(200)

    const get_car = await request.get(`${api}/car/${displayPartView.id}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        })

        const car_return = await get_car.json();
        expect(correct_cresult.status()).toBe(200)

        expect(car_return.year).toEqual(car.year)
        expect(car_return.powerkWh).toEqual(car.powerkWh)
    });

    test('delete car', async ({api, request, token}) => {
        const carRegNumber = 'Car 1'
        const result = await request.get(`${api}/car/GetCarPerUser?regNumber=${carRegNumber}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(result.status()).toBe(200);

        const cars = await result.json();
        if (cars && cars.length) {
            const carId = cars[0].carId;        
            const result = await request.post(`${api}/car/delete`, {
                data: {id: carId},
                headers: { Authorization: `Bearer ${token}` },
            });
            expect(result.status()).toBe(200);
        }

        console.log(cars)
    })
})
