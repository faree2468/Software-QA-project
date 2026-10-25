# Regression Suite: Practice Software Testing

## Selection Approach

I picked these 15 cases by asking: if a new release broke this, would a user or the business notice immediately? The suite therefore focuses on the money path (browse, cart, checkout), access control (login, admin) and the features that change data. I mixed positive and negative cases and kept each one independent so any failure points to a single cause.

**Priority:** High = a break blocks core use of the shop. Medium = a break hurts but the shop still works.

## Test Cases

| ID | Test case | Priority | Why it's in the regression suite |
|---|---|---|---|
| TC01 | Register a new customer with valid data, then log in with it | High | Registration is the entry point for every customer. If it breaks, no new users can buy anything. |
| TC02 | Log in with valid credentials and check the user's name is shown | High | Nearly every other flow depends on login, so it works as a smoke test for the whole suite. |
| TC03 | Log in with a wrong password and check an error is shown and no session starts | High | Confirms invalid credentials are rejected. A regression here would let the wrong people in or leave users confused. |
| TC04 | Log out and check account pages are no longer accessible | High | Verifies the session really ends. It is a common spot for access control regressions. |
| TC05 | Search for a product by name and check the results match | High | Search is the main way users find products, and it touches both frontend and API. |
| TC06 | Sort products by price (low to high) and check the order is correct | Medium | Sorting logic breaks easily when the product query changes, and the result is simple to verify. |
| TC07 | Filter products by category and check only that category is shown | Medium | Filtering shares the product listing code with search, so changes there can break it quietly. |
| TC08 | Open a product details page and check name, price and description match the list | Medium | Catches data mismatches between the listing and the detail page. |
| TC09 | Add a product to the cart, change its quantity, and check the total updates | High | Cart totals are calculated logic, and a mistake here means wrong prices charged to customers. |
| TC10 | Remove a product from the cart and check the cart and total update | Medium | Completes the cart lifecycle and makes sure state is cleaned up correctly. |
| TC11 | Complete a full checkout as a logged-in customer and check the order confirmation | High | This is the business-critical flow. It runs through login, cart, address, payment and order creation in one test. |
| TC12 | Try to proceed through checkout with required fields left empty and check validation | Medium | Ensures bad input is stopped before an order is created. |
| TC13 | Add a product to favorites and check it appears in the favorites list | Medium | A state-changing feature tied to the user account, which is easy to break when account code changes. |
| TC14 | Log in as admin, create a product, and check it appears in the shop | High | Covers the admin role and verifies that data created in the back office reaches customers. |
| TC15 | Submit the contact form with valid data and check the confirmation, then with an invalid email and check the error | Medium | Covers a separate feature with both a positive and a negative path, so a break there doesn't hide behind the shop flows. |

## Coverage Summary

| Area | Cases |
|---|---|
| Authentication | TC01, TC02, TC03, TC04 |
| Catalogue | TC05, TC06, TC07, TC08 |
| Cart | TC09, TC10 |
| Checkout | TC11, TC12 |
| Account | TC13 |
| Admin | TC14 |
| Contact | TC15 |