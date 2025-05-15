import {test, expect} from '@playwright/test'

// A hook that will be executed before each test.
test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

// Single test
/*test('Test case1', () => {

})*/

// Test suite
/*test.describe('Test suite1', () => {
    //Single test in test suite
    test('Test case1 in Test suite1', () => {

    })
})*/

// The {page} is a fixture for a browser page.
test('Locator syntax rules', async ({page}) => {
    //GENERAL NOTE: Playwright will not do anything until you actually make an action like click. 
    // Also if it finds multiple elements Playwright will give you an error and make suggestions on how to make it more unique so it only finds one element.
    // Find all elements by tag name
    //await page.locator('input').click() // This is expected to fail as there are several input elements.

    //Find all elements by id - use "#" before the id attribute value
    await page.locator('#inputEmail1').click()

    //Find all elements by class value - "." before the class attribute value
    page.locator('.shape-rectangle')

    //Find all element by attribute (and value) - place the attribute and value string in square brackets "[]"
    page.locator('[placeholder="Email"]')

    //Find all elements by full/entire class value - instead of using the "." approach use the same approach as for finding by attributes.
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //Find elements by combining multiple selectors - EXAMPLE:
    //It is important not to add space between selectors. Here it is finding all elements that has the input tag and with an attribute "placeholder" that has the value "Email"
    page.locator('input[placeholder="Email"]') 

    // Elements can be found by XPath as well: - (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // Find element by partial text match
    page.locator(':text("Using")')

    // Find element by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) => {
    // .getByRole is used to find elements based on their base role and then their name/text
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    // .getByLabel finds an element based on an associated label.
    await page.getByLabel('Email').first().click()

    // .getByPlaceholder finds elements based on the placeholder attribute value.
    await page.getByPlaceholder('Jane Doe').click()

    // .getByText finds elements with a specific text value.
    await page.getByText('Using the Grid').click()

    // .getByTestId finds elements based on the test id attribute value. (NOTE: the test id attribute for playwright is: "data-testid")
    //await page.getByTestId('SignInButton').click()

    // .getbyTitle finds elements based on their title attribute value.
    await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async({page}) => {
    /*
    * Here we are first finding the element "nb-card". By adding a space we indicate we are looking for a child element.
    * Then we are trying to find an "nb-radio" element and then we specify that it is the element with the text "Option 1".
    */
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    // The above can also be done by chaining the locators as follows:
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').locator('nb-radio').getByText('Option 1').click()

    // Similar to above here we are just findint a child element that is a button based on the role.
    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    // Least preferred approach but one that is possible is using index:
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('Locating based on parent elements', async({page}) => {
    // Example 1 - Finding the specific parent element "nb-card" based on a text that should be in the element or one it's child element.
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()

    // Example 2 - Finding the specific parent element "nb-card" based on the id of the parent or one of it's children.
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Password"}).click()

    // Example 3 - Similar to the above but using the built in Playwright function "filter".
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    // It is possible to chain the filter function to further filter the results as you go deeper.
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    // The following approach is not recommended but if you want to find the parent elemnt and then drill down again you can use the ".locator(..)" to go up one level:
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing the locators', async({page}) => {
    // Example without reusing locators.
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).fill('test1@test.com')
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Password"}).fill('test1234')
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('button').click()

    // Example with reusing locators.
    const usingTheGrid = page.locator('nb-card').filter({hasText: "Using the Grid"})
    await usingTheGrid.getByRole('textbox', {name: "Email"}).fill('test2@test.com')
    await usingTheGrid.getByRole('textbox', {name: "Password"}).fill('test1234')
    await usingTheGrid.getByRole('button').click()

    // It is also possible to do the following where 2 constants are created and one of the is using the other:
    const blockForm = page.locator('nb-card').filter({hasText: "Block form"})
    const blockFormEmail = blockForm.getByRole('textbox', {name: "Email"})
    await blockFormEmail.fill('test3@test.com')

    await expect(blockFormEmail).toHaveValue('test3@test.com')
})

test('Extracting values', async({page}) => {
    // Get a single test value:
    const basicForm = await page.locator('nb-card').filter({hasText: "Basic form"})
    const basicFormBtnText = await basicForm.locator('button').textContent()
    expect(basicFormBtnText).toEqual('Submit') // Should pass
    //expect(basicFormBtnText).toEqual('Submit2') // Should fail

    // Get all text values:
    const allRdoBtnLabels = await page.locator('nb-radio').allTextContents()
    expect(allRdoBtnLabels).toContain('Option 1') // Should pass
    //expect(allRdoBtnLabels).toContain('TestTest') // Should fail

    // Get input value (where it is a property and not a text/value)
    const basicFormEmailField = basicForm.getByRole('textbox', {name: "Email"})
    await basicFormEmailField.fill('test@test.com')
    const emailValue = await basicFormEmailField.inputValue()
    expect(emailValue).toEqual('test@test.com')


    // Getting the value of an attribut of an element:
    const placeholderValue = await basicFormEmailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({page}) => {
    const basicFormBtn = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    //General assertions will happen right away and will not wait for data to be available as it expects it to be available right away. (no await is needed before the expect function)
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormBtn.textContent()
    expect(text).toEqual('Submit')

    //Locator assertion will require an "await" as it needs to ensure a locator or object is available. Locator assertions will have more options to use for the assertion.
    await expect(basicFormBtn).toHaveText('Submit')

    //Soft assertion can be used in cases where you are okay with something to fail because you want to get some other things tested no matter what. So the test won't break for the failure.
    await expect.soft(basicFormBtn).toHaveText('Submit1')
    await basicFormBtn.click()
})


