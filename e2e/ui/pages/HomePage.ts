import type { Page } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('https://practicesoftwaretesting.com/')
    }

    async search_product(name: string) {
        await this.page.getByTestId('search-query').fill(name);
        await this.page.getByTestId('search-submit').click();
    }

    async filter_by_category(category: string) {
        await this.page.getByText(category).click();
    }
}