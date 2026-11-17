import type { Page } from "@playwright/test";

export class CheckoutPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('/checkout');
    }

    async remove_from_cart() {
        await this.page.locator('.btn.btn-danger').click();
    }
}