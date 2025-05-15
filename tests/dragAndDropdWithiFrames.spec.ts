import {test, expect} from '@playwright/test'

test('drag and drop with iFrames', async({page}) => {
    await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')

    // Example #1
    const iFrame = page.frameLocator('[rel-title="Photo Manager"] iframe') // When working with iFrames you need to create a frame locator for the iFrame.

    await iFrame.locator('li', {hasText: "High Tatras 2"}).dragTo(iFrame.locator('#trash')) // Since the content we want to interact with is within the iFrame we will used the iFrame locator instead of the page.

    // Example #2 - More precise approach
    await iFrame.locator('li', {hasText: "High Tatras 4"}).hover() // hovering over the object we want to drag.
    await page.mouse.down()
    await iFrame.locator('#trash').hover()
    await page.mouse.up()

    await expect(iFrame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})