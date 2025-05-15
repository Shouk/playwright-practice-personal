import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayoutsPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async submitUsingTheGridFormWihCredentialsAndSelectOption(email: string, password: string, optionText: string){
        const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGridForm.getByRole('radio', {name:optionText}).check({force:true})
        await usingTheGridForm.getByRole('button').click()
    }

    /**
     * This method fills out the inline form with user details
     * @param name The name of the user (first and lastname)
     * @param email Valid email for the user
     * @param rememberMeChkBox True or false if the details should be remembered.
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMeChkBox: boolean){
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline Form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)

        if(rememberMeChkBox){
            await inlineForm.getByRole('checkbox').check({force:true})
        }

        await inlineForm.getByRole('button').click()
    }


}