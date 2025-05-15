import {test, expect, request } from '@playwright/test'
import tags from '../test-data/tags.json' 

test.beforeEach(async ({page}) => {
    // In order to intercept or MOCK API it needs to be configured in the framework of your tests before the browser is initiated/interacted with.
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
})

test('Navigate to home page and confirm title', async ({page}) => {
    // You can have routing/intercepting/mocking of API's within a test after you have gone to the site, but then after the routing/mocking/intercepting is done then the page would probably need to be refreshed before any assertions are done.
    await page.route('https://conduit-api.bondaracademy.com/api/articles*', async route => {
        const response = await route.fetch() // .fetch() is used to get the intercepted response which can then be modified.
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is my MOCK title (EAH)"
        responseBody.articles[0].description = "This is my MOCK description (EAH)"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })
    

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')

    await expect(page.locator('app-article-list h1').first()).toContainText('This is my MOCK title (EAH)')
    await expect(page.locator('app-article-list p').first()).toContainText('This is my MOCK description (EAH)')
})

test('Making API request to delete article', async ({page, request}) => {
    // Call create new article API
    const articleRespone = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
        data: {
            "article": {
                "tagList": [],
                "title": "This is a test title (EAH)",
                "description": "This is a test description (EAH)",
                "body": "This is a test body (EAH)"
            }
        }
    })

    expect(articleRespone.status()).toEqual(201)

    await page.getByText('Global Feed').click()
    await page.getByText('This is a test title (EAH)').click()
    await page.getByRole('button', {name: "Delete Article"}).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title (EAH)')
})

test('Intercept browser API response', async ({page, request}) => {
    // Creating, populating and publishing a new article in the browser.
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like to use playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()

    // Getting the article response (intercept) and getting the slugId.
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/') 
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug

    // Confirming the article exists in the browser and moving back to Global Feed.
    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')
    
    // Calling delete article API to delete the newly deleted article.
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)

    expect(deleteArticleResponse.status()).toEqual(204)
})