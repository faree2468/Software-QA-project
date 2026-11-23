import {test, expect} from '@playwright/test';

const URL = 'http://localhost:8091';

test('@api GET /products returns all pages containing products', async({ request }) => {
    const response = await request.get(URL + '/products');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
})

test('@api GET /products/01M7HNNZWM8N5HMX2J0FZ01T03 returns the product for a given id', async({ request }) => {
    const response = await request.get(URL + '/products/01M7HNNZWM8N5HMX2J0FZ01T03');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "id": "01M7HNNZWM8N5HMX2J0FZ01T03",
        "name": "Pliers",
        "description": "Reliable general-purpose pliers crafted from drop-forged carbon steel for long-lasting durability in demanding working conditions. The serrated jaws provide a firm grip on a variety of materials including wire, nails, small fasteners, and irregularly shaped objects. Comfortable rubber-coated handles absorb vibration and reduce hand fatigue during extended use, while the non-slip surface ensures confident handling. The precision pivot joint maintains alignment under load, delivering smooth, controlled jaw action with every squeeze. Heat-treated steel construction resists wear and deformation even under heavy use. A must-have foundational tool for any workshop, equally suited for professional tradespeople and home repair projects.",
        "price": 12.01,
        "is_location_offer": false,
        "is_rental": false,
        "co2_rating": "D",
        "in_stock": true,
        "is_eco_friendly": false,
        "product_image": {
            "id": "01M7HNNZVVZ2KC78PERHMX3BVT",
            "by_name": "Everyday basics",
            "by_url": "https://unsplash.com/@zanardi",
            "source_name": "Unsplash",
            "source_url": "https://unsplash.com/photos/I8eTuMmxIfo",
            "file_name": "pliers02.avif",
            "title": "Pliers"
        },
        "category": {
            "id": "01M7HNNZV6SGC07WTJGVX7Y3GS",
            "name": "Pliers",
            "slug": "pliers",
            "parent_id": "01M7HNNZV1C5GY2TH6VAERW6GG"
        },
        "brand": {
            "id": "01M7HNNZKE31K7FYBZR7WZC0W1",
            "name": "ForgeFlex Tools"
        },
        "specs": [
            {
            "id": "01M7HNP010N5A0GB8WH2E6BGC2",
            "product_id": "01M7HNNZWM8N5HMX2J0FZ01T03",
            "spec_name": "Handle Material",
            "spec_value": "Rubber",
            "spec_unit": null
            },
            {
            "id": "01M7HNP010N5A0GB8WH2E6BGC0",
            "product_id": "01M7HNNZWM8N5HMX2J0FZ01T03",
            "spec_name": "Length",
            "spec_value": "180",
            "spec_unit": "mm"
            },
            {
            "id": "01M7HNP010N5A0GB8WH2E6BGC1",
            "product_id": "01M7HNNZWM8N5HMX2J0FZ01T03",
            "spec_name": "Material",
            "spec_value": "Carbon Steel",
            "spec_unit": null
            },
            {
            "id": "01M7HNP010N5A0GB8WH2E6BGC3",
            "product_id": "01M7HNNZWM8N5HMX2J0FZ01T03",
            "spec_name": "Warranty",
            "spec_value": "1",
            "spec_unit": "years"
            },
            {
            "id": "01M7HNP010N5A0GB8WH2E6BGBZ",
            "product_id": "01M7HNNZWM8N5HMX2J0FZ01T03",
            "spec_name": "Weight",
            "spec_value": "280",
            "spec_unit": "g"
            }
        ]
    })
})

test('@api GET /invoices returns unauthorized for guest user', async({ request }) => {
    const response = await request.get(URL + '/invoices');
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "message" : "Unauthorized"
    });
})

test('@api POST /login with invalid credentials returns unauthorized', async({ request }) => {
    const data = {
        email: "wrongemail@gmail.com",
        password: "wrongpassword123"
    }
    const response = await request.post(URL + '/users/login', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "error" : "Unauthorized"
    }); 

})

// one for valid login as well

// after all tests finish, for successful POST and DELETE, have equivalent DELETE and POST (we keep the data as it is)

// 8 automated api tests, Cover: status codes, response body, negative cases (invalid input, missing authorization, not found), and a create-read-update-delete flow