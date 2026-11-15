import { expect, type Page } from "@playwright/test";


export class RegisterPage {
    constructor(private page: Page) {}

    async open() {
        await this.page.goto('https://practicesoftwaretesting.com/auth/register');
    }

    async register(first: string, 
        last: string, 
        birth_date: string, 
        country: string, 
        zipcode: string, 
        house_number: string, 
        phone_number: string, 
        email: string, 
        password: string) {

        await this.page.getByTestId("first-name").fill(first);
        await this.page.getByTestId("last-name").fill(last);
        await this.page.getByTestId("dob").fill(birth_date);
        await this.page.getByTestId("country").selectOption(country);
        await this.page.getByTestId("postal_code").fill(zipcode);
        await this.page.getByTestId("house_number").fill(house_number);

        // depending on house number, we get info for street, city and state which we have to wait 
        await expect(this.page.getByTestId('street')).not.toHaveValue('');
        await expect(this.page.getByTestId('city')).not.toHaveValue('');
        await expect(this.page.getByTestId('state')).not.toHaveValue('');

        await this.page.getByTestId("phone").fill(phone_number);
        await this.page.getByTestId("email").fill(email);
        await this.page.getByTestId("password").fill(password);

        await this.page.getByTestId("register-submit").click();
    }
}