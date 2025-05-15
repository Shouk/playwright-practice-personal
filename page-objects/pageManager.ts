import { Page, expect } from "@playwright/test"
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'

export class PageManager{
    private readonly page: Page
    private readonly navPage: NavigationPage
    private readonly formLayoutPage: FormLayoutsPage
    private readonly datePickerPage: DatePickerPage

    constructor(page: Page){
        this.page = page
        this.navPage = new NavigationPage(this.page)
        this.formLayoutPage = new FormLayoutsPage(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
    }

    navigateTo() {
        return this.navPage
    }

    onFormLayoutsPage() {
        return this.formLayoutPage
    }

    onDatePickerPage() {
        return this.datePickerPage
    }
}