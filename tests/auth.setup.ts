import { test as setup} from '@playwright/test' // using "as" just means we are renaming
import * as fs from 'fs'
import user from '../.auth/user.json'

const authFile = '.auth/user.json'


setup('authentication', async ({page, request}) => {
    // This setup will go to the page, login and then save the authentication state so this state can be used for multiple tests instead of doing a login multiple times.
    /*await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: "Email"}).fill('eahtest@test.com')
    await page.getByRole('textbox', {name: "Password"}).fill('test1234test')
    await page.getByRole('button').click()

    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    await page.context().storageState({path: authFile})*/

    // The following will use the API to get and store an authentication token.
    // Call login/authorization API to get auth token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {"email": "eahtest@test.com", "password": "test1234test"}
        }
    })

    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    user.origins[0].localStorage[0].value = accessToken

    fs.writeFileSync(authFile, JSON.stringify(user))
    // Create an environment variable that can be used in other tests.
    process.env['ACCESS_TOKEN'] = accessToken
})