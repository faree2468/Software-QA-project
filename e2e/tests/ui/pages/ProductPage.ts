import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

const API_URL = 'http://localhost:8091';

export async function productId(page: Page, name: string) {
    const res = await page.request.get(
            `${API_URL}/products/search?q=${encodeURIComponent(name)}`
        );

    const product = (await res.json()).data.find((p: any) => p.name === name);
    if (!product) throw new Error(`Product "${name}" not found`);
    return product.id;
}

export class ProductPage {
    constructor(private page: Page) {}

    async open(name: string) {

        const id = await productId(this.page, name);

        await this.page.goto(`/product/${id}`);
        await expect(this.page.getByTestId('product-name')).toBeVisible();
    }

    async add_to_cart() {
        await this.page.getByTestId('add-to-cart').click();
        await expect(this.page.getByTestId('nav-cart')).toBeVisible();
    }
    
    
}