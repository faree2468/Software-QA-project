import {test, expect} from '@playwright/test';
import users from './test-data/users.json' with {type: 'json'};
import { LoginPage } from './ui/pages/LoginPage';

test('@regression user invalid login', async ({page}) => {
    const loginPage = new LoginPage(page);
    let email = "wrongemail@gmail.com";
    let password = "wrongpassword123";
    loginPage.open();
    loginPage.login(email, password);
    await expect(page.getByText("Invalid email or password")).toBeVisible()
})