import { expect, type Page } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('/')
    }

    async search_product(name: string) {
        await this.page.getByTestId('search-query').fill(name);
        await this.page.getByTestId('search-submit').click();
    }

    async filter_by_category(category: string) {
        await this.page.getByText(category).click();
        await this.page.waitForResponse((response)=>
            response.url().includes('/products') && response.status() === 200
        );
    }

    async logout() {
        await this.page.getByTestId('nav-menu').click();
        await this.page.getByTestId('nav-sign-out').click();
    }
}