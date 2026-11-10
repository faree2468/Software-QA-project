import type { Page } from "@playwright/test";


export class RegisterPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('https://practicesoftwaretesting.com/auth/register');
    }

    // async register()
}