import {test as base, Page} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    formLayoutsPage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions> ({
    formLayoutsPage: [async({page}, use) =>{ // This is a fixture that can be used in tests and it will go to the baseUrl and navigate to the Form Layouts page.
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        // Everything that is added before the "use" function will be executed before the test and setup of the environment.
        await use('') // The use function is needed to activate the fixture.
        // Everything that is added after the "use" function will be executred after the test is run.
    }, {auto: true}], // By creating the fixture into an array and adding "{auto: true}" then you indicate to playright that this should be initialized as the very first thing.

    pageManager: async({page}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})