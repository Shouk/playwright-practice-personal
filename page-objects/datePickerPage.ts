import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase{

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calenderInputField = this.page.getByPlaceholder('Form Picker')
        await calenderInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        await expect(calenderInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        const calenderInputField = this.page.getByPlaceholder('Range Picker')
        await calenderInputField.click()

        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calenderInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)

        const expectedDate = date.getDate().toString()

        const expectedMonthShort = date.toLocaleString('En-US', {month:'short'}) // By adding the flag/argument {month: 'short} we indicate that we should get the month value but in the short form (only 3 first letters).
        const expectedYear = date.getFullYear()

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthLong = date.toLocaleString('En-US', {month:'long'})
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact:true}).click()

        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        return dateToAssert
    }
}