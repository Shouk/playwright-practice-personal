import {test, expect} from '@playwright/test'

// A hook that will be executed before each test.
test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    })

    test('Input fields', async({page}) => {
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

    test('Radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force:true}) // "check" is a function is used to check a radio button. However if the element is hidden then this function will not work unless {force:true} is used as a parameter/argument.
        await usingTheGridForm.getByRole('radio', {name:'Option 2'}).check({force:true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name:'Option 2'}).isChecked() // "isChecked" will return a boolean value if the radio button is checked or not.
        expect(radioStatus).toBeTruthy() //one approach to check the state of a radio button. To confirm if it is true.
        await expect(usingTheGridForm.getByRole('radio', {name:'Option 2'})).toBeChecked() // another approach to check the state of a radio button (to confirm it is checked)

        expect(await usingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked()).toBeFalsy() // checks if the check is false.
    })

    test('Radio buttons - visual testing', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByRole('radio', {name:'Option 2'}).check({force:true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked() // "isChecked" will return a boolean value if the radio button is checked or not.

        // Visual testing assertion
        await expect(usingTheGridForm).toHaveScreenshot() // On the first run this will generate a screenshot to be used for comparison. On subsequent runs it will compare the outcome with the baseline
        // You can add a property to the ".toHaveScreenshot()" "{maxDiffPixels: ###}" to set the maximum allowed pixel difference before an error/failure is made. This setting can also be added in the global settings.

    })
})

test.describe('Toastr page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    }) 

    test('Checkboxes', async({page}) => {
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force:true}) // Since the checkbox is already checked nothing will happen for this one as it will check if the checkbox is checked. If it isn't then it will ensure that it is checked.
        await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force:true}) // Similar to the above but will confirm if the checkbox is unchecked and if not then it will ensure that it becomes unchecked.
        await page.getByRole('checkbox', {name: "Show toast with icon"}).click({force:true}) // For a checkbox it will click no matter the state of the checkbox.
        
        // Loop through all checkboxes and mark them all as checked
        const allBoxes = page.getByRole('checkbox')
        for(const box of await allBoxes.all()){ //".all" will generate an array of the list which can be used in a for loop.
            await box.check({force:true})
            expect(await box.isChecked()).toBeTruthy()
        }

        // Loop through all checkboxes and mark them all as unchecked
        for(const box of await allBoxes.all()){ //".all" will generate an array of the list of objects which can be used in a for-loop.
            await box.uncheck({force:true})
            expect(await box.isChecked()).toBeFalsy()
        }
    })
})

test('Lists and dropdowns', async({page}) => {
    const dropdownBtn = page.locator('ngx-header nb-select')
    await dropdownBtn.click()

    // page.getByRole('list') -- Can be used when the list has a <ul> tag
    // page.getByRole('listitem') -- Can be used when the list item has a <li> tag.

    // const optionList = page.getByRole('list').locator('nb-option') // One approach to get the full list of list items.
    const optionList = page.locator('nb-option-list nb-option') //Same as the above line but a bit more compact.
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) // Confirms if the list contains all of the mentioned texts.


    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    const header = page.locator('nb-layout-header')

    for(const color in colors){
        await optionList.filter({hasText:color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate") {
            await dropdownBtn.click()
        }
    }
})

test.describe('Tooltip page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()
    }) 

    test('Tooltips', async({page}) => {
        const toolTipPlacementsCard = page.locator('nb-card', {hasText:"Tooltip"})
        await toolTipPlacementsCard.getByRole('button', {name:"TOP"}).hover() // ".hover" can be used to emulate the hover function.

        // page.getByRole('tooltip') - If a tooltip has the role/type "tooltip" created then this can be used.
        const tooltip = await page.locator('nb-tooltip').textContent()
        expect(tooltip).toEqual('This is a tooltip')
    })
})

test.describe('Smart table page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()
    }) 

    test('Browser Dialog boxes', async({page}) => {

        // In order to get the browser dialog event we need to create a listener: (The listener needs to be created before the event that triggers the dialog)
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })

        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()

        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    })

    test('modify data for users', async({page}) => {
        // Example #1 - Get row by any unique text in the row
        const targetRow = page.getByRole('row', {name:"twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()
        await expect(targetRow.locator('td').nth(6)).toHaveText('35')

        // Example #2 - Get row by value in specific column
        // Cliking on page identicator #2:
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowByID = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowByID.locator('.nb-edit').click()

        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()
        await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')
    })

    test('filter in data table', async({page}) => {
        // Example #3 - test Filter of the table
        const ages = ["20", "30", "40", "200"]

        for (let age of ages){
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            // Adding hard-coded wait in order to allow the table animation to complete the filtering.
            await page.waitForTimeout(500)

            const ageRows = page.locator('tbody tr')
            for(let row of await ageRows.all()){
                const cellValue = await row.locator('td').last().textContent()
                if(age == "200") {
                    expect(await page.getByRole('table').textContent()).toContain('No data found')
                }
                else{
                    expect(cellValue).toEqual(age)
                }
                
            }
        }
    })
})

test.describe('Datepicker page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()
    }) 

    test('Date picker base example', async({page}) => {
        const calenderInputField = page.getByPlaceholder('Form Picker')
        await calenderInputField.click()

        await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact:true}).click() //.getByText searches by partial match by default. To get exact match add the flag {exact:true} like in this example.
        await expect(calenderInputField).toHaveValue('May 1, 2025')
    })

    test('Datepicker advanced', async({page}) => {
        const calenderInputField = page.getByPlaceholder('Form Picker')
        await calenderInputField.click()

        let date = new Date()
        date.setDate(date.getDate() + 200)

        const expectedDate = date.getDate().toString()

        const expectedMonthShort = date.toLocaleString('En-US', {month:'short'}) // By adding the flag/argument {month: 'short} we indicate that we should get the month value but in the short form (only 3 first letters).
        const expectedYear = date.getFullYear()

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthLong = date.toLocaleString('En-US', {month:'long'})
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact:true}).click()

        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        await expect(calenderInputField).toHaveValue(dateToAssert)
    })
})

test('Sliders', async({page}) => {
    // Example #1 - Update slider attributes
    const tempGage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGage.evaluate(node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGage.click() // An action would be needed to ensure an update is actually done for the fill part.

    // Example #2 - Simulate mouse movement.
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() // This method will ensure the indicated content will be fully in view in the browser.

    const boundingBox = await tempBox.boundingBox()
    const x = boundingBox.x + boundingBox.width / 2
    const y = boundingBox.y + boundingBox.height /2

    await page.mouse.move(x, y) // This moves the mouse to this x, y location
    await page.mouse.down() // This makes a down right click on the mouse (and holding)
    await page.mouse.move(x+100,y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up() // this releases the down action so takes the finger off the mouse button.

    await expect(tempBox).toContainText('30')
})

