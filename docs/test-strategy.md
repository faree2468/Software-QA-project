# Test Strategy: Practice Software Testing

## 1. Overview

For this project I'm testing Practice Software Testing, an open-source demo shop that sells tools. It has customer and admin accounts and several flows that change data (registration, cart, checkout, favorites, product management), so it comfortably supports 15 regression cases. I ran a short trial script through login, cart and checkout and nothing blocked it, so there is no CAPTCHA or bot protection. Only functional testing is done.

## 2. Functional Scope

**In scope:**
- Registration, login and logout, including invalid credentials
- Product search, sorting, filtering and the product details page
- Cart: add, change quantity, remove, check totals
- Checkout and order confirmation
- Profile, order history and favorites
- Admin: add, edit and delete a product
- Contact form

**Out of scope:** performance, security, cross-browser and mobile testing, real payments, and email delivery.

## 3. Test Levels and Tools

The suite is mostly UI end-to-end tests, since that's what a user actually experiences. I use the API only to set up and clean up data, which keeps tests fast and independent of each other. Before automating, I explore the app manually to find stable locators.

- **Framework:** Playwright with Typescript
- **Other:** Git for version control

Each test runs on its own, uses its own data, and relies on explicit waits instead of fixed sleeps.

## 4. Test Data and Environment

For data, I use the seeded customer and admin accounts from the project's README. Tests that need a new user generate a unique email each run. Products come from the seed data, so prices and totals are known in advance. Test data lives in a separate config file, not in the test code.

**Machine:** [OS, Chrome, Playwright 1.64.1]

## 5. Entry and Exit Criteria

**We start when:**
- The app is running and the database is seeded
- A simple smoke test (login) passes
- All 15 cases are written down with steps, data and expected results

**We are done when:**
- All 15 cases have run on a clean environment
- Every failure is explained, either as a bug or a test problem
- There are no open critical bugs in login, cart or checkout
- The suite passes [3] runs in a row without flaky failures

## 6. Risks

| Risk | What I'll do |
|---|---|
| Flaky tests from slow Angular loading | Explicit waits, no fixed sleeps |
| Tests affecting each other's data | Independent data per test, API setup and cleanup |
| App updates break locators | Pin the app version, keep locators in Page Objects |
| The demo app contains deliberate bugs | Check the expected behavior first, then decide if it's a test or product issue |
| Limited time | Cover high-risk flows (login, cart, checkout) first |