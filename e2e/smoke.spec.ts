import { test, expect } from '@playwright/test';
import { LoginPage } from './ui/pages/LoginPage';
import users from './test-data/users.json' with {type: 'json'};

test('@smoke user logs-in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const {name, email, password} = users.regularUser;
    await loginPage.open();
    await loginPage.login(email, password);
    await expect(page.getByText(name)).toBeVisible();
})

test('@smoke register new user', async ({page}) => {
    const registerPage = null;
})

// Page Object Model, fixtures, stable locators, independent tests