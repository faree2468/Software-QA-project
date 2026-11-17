import {test, expect} from '@playwright/test';
import { LoginPage } from './ui/pages/LoginPage';
import users from './test-data/users.json' with {type: 'json'};
import { HomePage } from './ui/pages/HomePage';
import { ProductPage } from './ui/pages/ProductPage';
import { CheckoutPage } from './ui/pages/CheckoutPage';

test('@regression user invalid login', async ({page}) => {
    const loginPage = new LoginPage(page);
    let email = "wrongemail@gmail.com";
    let password = "wrongpassword123";
    loginPage.open();
    loginPage.login(email, password);
    await expect(page.getByText("Invalid email or password")).toBeVisible()
})

test('@regression logout', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    const {name, email, password} = users.existingUser;
    loginPage.open();
    loginPage.login(email, password);

    await expect(page.getByText(name)).toBeVisible();

    homePage.logout();
    
    await expect(page.getByText(name)).not.toBeVisible();
})

test('@regression remove from cart', async ({page}) => {
    const productPage = new ProductPage(page);
    productPage.open('01M7HNNZWJFSEJNW5PAK7RX56Q');
    productPage.add_to_cart();

    await page.getByTestId('nav-cart').click();
    await page.locator('.btn.btn-danger').click();

    await expect(page.getByTestId('product-title')).not.toBeVisible();

})


// last test, full checkout