import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    
})

test('navigate to Forms page', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
})

test('Navigating through the menu', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parameterized methods', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWihCredentialsAndSelectOption("test@test.com", "password123", "Option 1")

    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox("John Smith", "test@test.com", true)

    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(5, 10)
})

test.only('Testing with Argus CI', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
})