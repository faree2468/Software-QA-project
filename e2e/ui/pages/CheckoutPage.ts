import { expect, type Page } from "@playwright/test";

export class CheckoutPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('/checkout');
    }

    async remove_from_cart() {
        await this.page.locator('.btn.btn-danger').click();
    }

    async proceed_to_checkout() {
        await this.page.getByTestId('proceed-1').click();
    }

    async proceed_to_checkout_signed_in() {
        await this.page.getByTestId('proceed-2').click();
    }

    async fill_billing_info(country: string, zipcode: string, house_number: string) {
        await this.page.getByTestId('country').selectOption(country);
        await this.page.getByTestId("postal_code").fill(zipcode);
        await this.page.getByTestId("house_number").fill(house_number);

        await expect(this.page.getByTestId('street')).not.toHaveValue('');
        await expect(this.page.getByTestId('city')).not.toHaveValue('');
        await expect(this.page.getByTestId('state')).not.toHaveValue('');

        await this.page.getByTestId('proceed-3').click();
    }

    async pay() {
        await this.page.getByTestId('payment-method').selectOption('cash-on-delivery');
        await this.page.getByTestId('finish').click();
    }
}