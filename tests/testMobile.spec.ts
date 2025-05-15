import {test, expect} from '@playwright/test'


test('Input fields', async({page}, testInfo) => {
    await page.goto('/')
    if (testInfo.project.name == 'mobile') {
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if (testInfo.project.name == 'mobile') {
        await page.locator('.sidebar-toggle').click()
    }
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
    await usingTheGridEmailInput.fill('test@test.com') // Fill can be used to instantly input a text.
    await usingTheGridEmailInput.clear() // clear can be used to clear the text/value of an input field. clear can't be chained off a fill functiom
    await usingTheGridEmailInput.pressSequentially('test@mail.com', {delay: 500}) // "pressSequentially" can be used to emulate a user typing so the characters are added one by one. By adding the additional parameter/argument you can further define the time between key-strokes.

    // Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual('test@mail.com')

    // Locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test@mail.com')
})