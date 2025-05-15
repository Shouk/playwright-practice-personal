import { test } from '../test-options'
import { PageManager } from '../page-objects/pageManager'

test('parameterized methods', async({pageManager}) => { // This is using a new custom fixture "pageManager" instead of the regular "page". The "pageManager" fixture is defined in the "test-options.ts" file
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWihCredentialsAndSelectOption("test@test.com", "password123", "Option 1")
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox("John Smith", "test@test.com", true)
})