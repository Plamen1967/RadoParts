import { test as base} from '@playwright/test'
import { expect} from '@playwright/test'

interface Login {
    token: string
    api: string
}

export const test = base.extend<Login>({
    token: async({request, api}, use) => {
            const login = await request.post(`${api}/users/autenticate`, { data:  { userName: 'rado', password: 'rado'}} )
            expect(login.ok()).toBeTruthy();
            const result = await login.json();
            const token = result.token;
            console.log(token)
            use(token);
    },
    // eslint-disable-next-line no-empty-pattern
    api: async ({ }, use) => {
        const api = 'http://localhost:29235/api'
        use(api)
    }
})