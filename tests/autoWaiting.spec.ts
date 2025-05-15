import {test, expect} from '@playwright/test'

// A hook that will be executed before each test.
test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
})

test('Auto-wait', async({page}) => {
    const successBtn = page.locator('.bg-success')
    //await successBtn.click()
    //const btnText = await successBtn.textContent()
    //await successBtn.waitFor({state: "attached"})
    //const btnText = await successBtn.allTextContents()
    //expect(btnText).toContain('Data loaded with AJAX get request.')

    await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('Alternative waits', async({page}) => {
    const successBtn = page.locator('.bg-success')

    //Wait for element/selector
    //await page.waitForSelector('.bg-success')
    
    // Wait for particlar response
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // Wait for network calls to be completed ('NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle')

    //There are many waitFor events that can be used which can be explored through page.WaitFor...

    const btnText = await successBtn.allTextContents()
    expect(btnText).toContain('Data loaded with AJAX get request.')
})