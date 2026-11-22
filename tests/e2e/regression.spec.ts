import {test, expect} from '@playwright/test';
import { LoginPage } from './ui/pages/LoginPage.js';
import users from './test-data/users.json' with {type: 'json'};
import { HomePage } from './ui/pages/HomePage.js';
import { ProductPage } from './ui/pages/ProductPage.js';
import { CheckoutPage } from './ui/pages/CheckoutPage.js';


test('@regression user invalid login', async ({page}) => {
    const loginPage = new LoginPage(page);
    let email = "wrongemail@gmail.com";
    let password = "wrongpassword123";
    await loginPage.open();
    await loginPage.login(email, password);
    await expect(page.getByText("Invalid email or password")).toBeVisible()
})

test('@regression logout', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const {name, email, password} = users.existingUser;
    await loginPage.open();
    await loginPage.login(email, password);

    await expect(page.getByTestId('nav-menu')).toContainText(name);

    await homePage.logout();
    
    await expect(page.getByText(name)).not.toBeVisible();
})

test('@regression remove from cart', async ({page}) => {
    const productPage = new ProductPage(page);
    await productPage.open('01M7HNNZWJFSEJNW5PAK7RX56Q');
    await productPage.add_to_cart();

    await page.getByTestId('nav-cart').click();
    await page.locator('.btn.btn-danger').click();

    await expect(page.getByTestId('product-title')).not.toBeVisible();

})

test('@regression add to favorites', async ({page}) => {
    const loginPage = new LoginPage(page);
    const {name, email, password} = users.existingUser;
    await loginPage.open();
    await loginPage.login(email, password);

    await expect(page.getByText(name)).toBeVisible();

    await page.getByRole('link', { name: /Practice Software Testing/i }).click();
    await page.getByTestId('product-01M7HNNZWTG3E0RG9V0D8SAM7A').click();
    await page.getByTestId('add-to-favorites').click();

    await page.getByTestId('nav-menu').click();
    await page.getByTestId('nav-my-favorites').click();
    await expect(page.getByText('FavoritesCombination')).toContainText('Claw Hammer with');

})


test('@regression full checkout', async ({page}) => {
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);
    const {name, email, password, country, zipcode, house_number} = users.existingUser;
    await loginPage.open();
    await loginPage.login(email, password);

    await expect(page.getByText(name)).toBeVisible();

    await page.getByRole('link', { name: /Practice Software Testing/i }).click();
    await page.getByTestId('product-01M7HNNZWJFSEJNW5PAK7RX56Q').click();

    await page.getByTestId('add-to-cart').click();
    await expect(page.getByTestId('nav-cart')).toBeVisible();

    await page.getByTestId('nav-cart').click();

    await checkoutPage.proceed_to_checkout();
    await checkoutPage.proceed_to_checkout_signed_in();
    await checkoutPage.fill_billing_info(country, zipcode, house_number);
    await checkoutPage.pay();
    
    await expect(page.getByTestId('payment-success-message')).toBeVisible();

})