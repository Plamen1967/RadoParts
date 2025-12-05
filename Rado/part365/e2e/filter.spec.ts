import { APIRequestContext, expect } from '@playwright/test'
import { test } from '../tests/fixtures/login.spec'
import { PartPage } from '../tests/home/part/partPage'

let apiContext: APIRequestContext

test.beforeAll(async ({ playwright, token }) => {
    apiContext = await playwright.request.newContext({
        baseURL: 'http://localhost:29235/api',
        extraHTTPHeaders: {
            // We set this header per GitHub guidelines.
            Accept: '*/*',
            // Add authorization token to all requests.
            // Assuming personal access token available in the environment.
            authorization: `Bearer ${token}`,
            'content-type': 'application/json'
        }      
    })
})

// eslint-disable-next-line no-empty-pattern
test.afterAll(async ({}) => {
    // Dispose all responses.
    await apiContext.dispose()
})

test('filter', async ({ page }) => {
    const data = {
        company: 'Audi',
        model: '100 (43) (1976 - 1982)'
    }

    page.on('response', response => console.log('<<', response.status(), response.url()));
    await page.goto('/')
    const part = new PartPage(page)
    await part.selectCompany(data.company)
    await part.selectModel(data.model, true)
    await expect(page.locator('app-selecteditem')).toContainText(data.model);
    await part.Search()
    const result = await page.locator('app-partview').all();
    result.forEach(async element => {
        await expect(element).toContainText(data.model)
        
    });
})

test('Добави обява', async ({page}) => {
    await page.goto('/');
})

test('add part', async () => {

    const newPart = await apiContext.post(`http://localhost:29235/api/part`, {
        data: {
            partId: Date.now(),
            dealerSubCategoryId: 357,
            dealerSubCategoryName: 'Test',
            modificationId: 858,
            year: 1997,
            price: 200,
        },
    })

    console.log(newPart);

    expect(newPart.ok()).toBeTruthy()
})

test('log in', async () => {
    const newIssue = await apiContext.post(`http://localhost:29235/api/users/updatePassword`, {
        data: {
            oldPassword: 'rado',
            password: 'rado',
        },
    })
    expect(newIssue.ok()).toBeTruthy()
})

// fetch('http://localhost:29235/api/part', {
//     headers: {
//         accept: '*/*',
//         authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYmYiOjE3NTc5NTMwMzksImV4cCI6MTc1ODEyNTgzOSwiaWF0IjoxNzU3OTUzMDM5fQ.EB962sQkSlUV7lOtIYaiZ7o2OsY6nqEmdVgvHBt36VE',
//         'content-type': 'application/json',
//     },
//     referrer: 'http://localhost:4200/',
//     body: '{"partForCar":false,"partId":1757953048556,"companyId":10,"modelId":63,"modificationId":858,"year":1976,"vin":"","engineType":0,"engineModel":"","gearboxType":0,"regionId":-1,"categoryId":6,"dealerSubCategoryId":357,"description":"","partNumber":"","price":"200","leftRightPosition":0,"frontBackPosition":0,"dealerSubCategoryName":"Клапани","mainImageId":0,"bus":0,"modifiedTime":1757953104132}',
//     method: 'POST',
//     mode: 'cors',
//     credentials: 'include',
// })
