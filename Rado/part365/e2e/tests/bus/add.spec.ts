import { test, expect } from '@playwright/test';
import { AddCarPOM } from '../../data/pom/addCarPOM';
import { AdPage } from '../../data/pom/adPagePOM';
import { AddPartPOM } from '../../data/pom/addPartPOM';
import { PopupMessageCheck } from '../messages/popupMessage';
import { LoginPage } from '../../data/pom/loginPOM';



test('add bus', async({page}) => {

    const adPage: AdPage = new AdPage(page);
    adPage.open();

    const data = {
        company: 'Ford',
        model: 'Cargo',
        carName: 'Bus 30',
        vin: '12345678901234567',
        powerBHP: 100,
        millage: 120000,
        description: 'Буса е с  двигател',
        enginType: 'Бензин',
        enginModel: 'DR 125',
        gearboxType: 'Ръчна',
        region: 'Бургас',
    }


    await page.getByRole('button', {name: 'Добавете Бус'}).click();
    await expect(page).toHaveURL('/data/addCar?ad=new&bus=1');
    const addCarPage = new AddCarPOM(page, true);

    await addCarPage.enterCarName(data.carName);
    await addCarPage.enterVin("123456789012345");

    await addCarPage.save();
    await page.getByRole('button').and(page.getByText('Ok')).click();

    await addCarPage.checkCompanyRequired();
    await addCarPage.checkVinMinLength();

    await addCarPage.enterCompany(data.company);
    await addCarPage.enterVin(data.vin);

    await addCarPage.save();
    await page.getByRole('button').and(page.getByText('Ok')).click();

    await addCarPage.checkModelRequired()
    await addCarPage.checkNoVinMinLength();

    await addCarPage.enterModel(data.model)
    await addCarPage.enterMillage(data.millage)
    await addCarPage.engineEngineModel(data.enginModel);
    await addCarPage.selectEngineType(data.enginType);
    await addCarPage.selectRegion(data.region);
    await addCarPage.selectGearboxType(data.gearboxType);
    await addCarPage.enterBHP(data.powerBHP);

    await addCarPage.enterDescription(data.description);

    await addCarPage.save();

    await expect(page).toHaveURL('/data/addNew');
})

test('add bus part', async({page}) => {
    const data = {
        company: 'Ford',
        model: 'Cargo',
        partType : 'NoCar',
        category : 'БРАВИ, ДРЪЖКИ, КЛЮЧАЛКИ',
        dealerSubCategory : 'Брава врата',
        price : 100
    }
    const adPage: AdPage = new AdPage(page);
    adPage.open();

    await page.getByRole('button', {name: 'Добавете част за бус'}).click();

    const addPart = new AddPartPOM(page);

    await addPart.checkPartCar(data.partType);
    await addPart.enterCompany(data.company);
    await addPart.enterModel(data.model);
    await addPart.selectCategory(data.category);
    await addPart.selectDealerSubCategory(data.dealerSubCategory);
    await addPart.enterPrice(data.price);

    await addPart.save();
    await PopupMessageCheck.checkMessage(page, 'Частта е добавена');

})

test('add bus part for a bus', async({page}) => {
    const data = {
        price: '100',
        partType : 'Част за бус',
        carName: 'Bus 1',
        category : 'БРАВИ, ДРЪЖКИ, КЛЮЧАЛКИ',
        dealerSubCategory : 'Брава врата',
        partNumber: 'Part 12345',
        leftRightPosition: 'Лявa',
        frontBackPosition: 'Преднa',
        description: 'Частта е от нова кола'
    }

    const adPage: AdPage = new AdPage(page);
    adPage.open();

    await page.getByRole('button', {name: 'Добавете част за бус'}).click();

    const addPart = new AddPartPOM(page);


    await addPart.checkPartCarByLabel(data.partType);
    await addPart.save();

    await addPart.checkCarNameRequired(); 
    await addPart.closePopupMessage()

    await addPart.selectCarName(data.carName);
    await addPart.checkCarNameOk();

    await addPart.save();
    await addPart.closePopupMessage()

    await addPart.checkCategoryRequired();

    await addPart.selectCategory(data.category);

    await addPart.save();
    await addPart.closePopupMessage()

    await addPart.checkDealerSubCategoryRequired();

    await addPart.selectDealerSubCategory(data.dealerSubCategory);

    await addPart.save();
    await addPart.closePopupMessage()

    await addPart.checkPriceRequired();

    await addPart.enterPartNumber(data.partNumber);
    await addPart.enterPrice(data.price);

    await addPart.enterDescription(data.description)

    await addPart.checkLeftRightPosition(data.leftRightPosition);
    await addPart.checkFrontBackPosition(data.frontBackPosition);

//    await page.getByLabel('Лявa').click();
    
    await addPart.save();
    await PopupMessageCheck.checkMessage(page, 'Частта е добавена');

})


test('lisr part for cars', async({page}) => {
    await page.goto('/data/parts');
    const loginPage = new LoginPage(page)
    await loginPage.login('rado', 'rado')
    //await page.goto('/data/parts');
})