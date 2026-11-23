import { test, expect } from '@playwright/test';
import { LoginPage } from './ui/pages/LoginPage.js';
import users from './test-data/users.json' with {type: 'json'};
import { RegisterPage } from './ui/pages/RegisterPage.js';
import { HomePage } from './ui/pages/HomePage.js';
import { ProductPage } from './ui/pages/ProductPage.js';
import { CheckoutPage } from './ui/pages/CheckoutPage.js';

test('@smoke user login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const {name, email, password} = users.existingUser;
    await loginPage.open();
    await loginPage.login(email, password);
    await expect(page.getByText(name)).toBeVisible();
})

test('@smoke register new user', async ({page}, testInfo) => {
    const registerPage = new RegisterPage(page);
    const {first, last, password, birth_date, country, house_number, zipcode, phone_number} = users.newUser;

    const browserName = testInfo.project.name || 'browser';
    const uniqueEmail = `test_${browserName}_${Date.now()}@example.com`;

    await registerPage.open();
    await registerPage.register(
        first,
        last,
        birth_date,
        country,
        zipcode,
        house_number,
        phone_number,
        uniqueEmail,
        password
    );
    await expect(page.getByRole('heading', {name : 'Login'})).toBeVisible();
})

test('@smoke search for a product', async({page})=>{
    const homePage = new HomePage(page)
    await homePage.open();
    await homePage.search_product('Pliers');
    await expect(page.getByTestId('product-name')).toHaveCount(4);
})

test('@smoke update cart quantity', async({page})=>{
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productPage.open('01M7HNNZWVJ3PCNQRAWW6A80J3');
    await productPage.add_to_cart();
    
    await checkoutPage.open();
    await expect(page.getByTestId('product-title')).toHaveCount(1);
})

test('@smoke filter by category', async({page})=> {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.filter_by_category('Hand Saw');
    await expect(page.getByTestId('product-name').first()).toContainText('Saw');
})