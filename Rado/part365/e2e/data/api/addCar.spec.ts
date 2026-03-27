import { expect, test} from "@playwright/test"

test('add car', async ({request }) => {
    const carData = {
            year: 1967,
            regNumber: 'Car 1',
            powerkWh: 100,
            powerBHP: 0,
            engineType: 0,
            millage: 0,
            gearboxType: 0,
            bus: 0,
            company: 'BMW',
            model: '1 (E81) (2007 - 2011)',
            modificationName: '116d (116 Hp) (2007 - 2011)',
        }

    const api = 'http://localhost:29235/api';
    
    const company = await request.get(`${api}/company/GetCompanyByName?name=${carData.company}`)        
    expect(company.ok()).toBeTruthy()
    const companyId = await company.json()

    const model = await request.get(`${api}/model/GetModelByName?name=${carData.model}&companyId=${companyId.companyId}`)
    expect(model.ok()).toBeTruthy()
    const modelId = await model.json()

    const modification = await request.get(`${api}/modification/GetModificationByNameAndModelId?name=${carData.modificationName}&modelId=${modelId.modelId}`)
    expect(modification.ok()).toBeTruthy()
    const modificationId = await modification.json()

    const car = {
        user: 2,
        year: carData.year,
        bus: companyId.bus,
        regNumber: carData.regNumber,
        powerkWh: carData.powerkWh,
        modificationId: modificationId.modificationId,
        powerBHP: carData.powerBHP,
        engineType: carData.engineType,
        millage: carData.millage,
        gearboxType: carData.gearboxType
    }
    
    const newCar = await request.post('http://localhost:29235/api/car', {
        data: {car}
    })
    expect(newCar.ok()).toBeTruthy()
    const result = await newCar.json()
    expect(result).toEqual('Колата не може да бъде записана' );
})  