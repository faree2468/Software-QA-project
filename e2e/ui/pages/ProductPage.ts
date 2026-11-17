import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class ProductPage {
    constructor(private page: Page) {}

    async open(product_id: string) {
        await this.page.goto(`/product/${product_id}`);
        await expect(this.page.getByTestId('product-name')).toBeVisible();
    }

    async add_to_cart() {
        await this.page.getByTestId('add-to-cart').click();
        await expect(this.page.getByTestId('nav-cart')).toBeVisible();
    }
    
    
}