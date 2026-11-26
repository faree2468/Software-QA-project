import {test, expect} from '@playwright/test';

test('@api GET /products returns all pages containing products', async({ request }) => {
    const response = await request.get('/products');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
})

test('@api GET /products/01M7HNNZWM8N5HMX2J0FZ01T03 returns the product for a given id', async({ request }) => {
    const response = await request.get('/products/01M7HNNZWM8N5HMX2J0FZ01T03');
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
    const response = await request.get('/invoices');
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "message" : "Unauthorized"
    });
})

test('@api POST /users/login with invalid credentials returns unauthorized', async({ request }) => {
    const data = {
        email: "wrongemail@gmail.com",
        password: "wrongpassword123"
    }
    const response = await request.post('/users/login', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "error" : "Unauthorized"
    }); 

})

test('@api POST /users/login with valid credentials returns access token (bearer)', async({ request }) => {
    const data = {
        "email" : "customer@practicesoftwaretesting.com",
        "password" : "welcome01"
    }
    const response = await request.post('/users/login', {data: data})
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toHaveProperty("access_token");

})

test('@api DELETE /carts/9999 returns 404 for non existent cart ', async({ request }) => {
    const response = await request.delete('/carts/9999');
    expect(response.status()).toBe(404);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toEqual({
        "message" : "Cart doesnt exists"
    });
})

test('@api POST /carts creates a new cart and returns its id', async({ request }) => {
    const response = await request.post('/carts');
    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toHaveProperty("id");
})

test('@api GET /users/me with a valid token returns the logged-in user', async ({ request }) => {
    const login = await request.post('/users/login', {
        data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' }
    });
    const { access_token } = await login.json();

    const response = await request.get('/users/me', {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toMatchObject({
        email: 'customer@practicesoftwaretesting.com'
    });
});

test('@api GET /products/search?q=pliers returns only matching products', async ({ request }) => {
    const response = await request.get('/products/search?q=pliers');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
        expect(product.name.toLowerCase()).toContain('pliers');
    }
});

test.fail('@api PATCH /products/01M7HNNZWYXRNJZG1BB567BYT8 does not update and returns error message (FALSE)', async({ request }) => {
    const data = {
        "name" : "Actual Thor Hammer"
    }
    const response = await request.patch('/products/01M7HNNZWYXRNJZG1BB567BYT8', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
})

test.fail('@api POST /brands does not create and returns error message (FALSE)', async({ request }) => {
    const data = {
        "name": "Bosch",
        "slug" : "Bosch"
    }
    const response = await request.post('/brands', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
})

test.fail('@api POST /products does not create and returns error message (FALSE)', async({ request }) => {
    const data = {
        "name": "Bosch drill",
        "price" : 9.99,
        "category_id" : "01M7HNNZV1C5GY2TH6VAERW6GG",
        "brand_id" : "01m8749mt93920esrd2t3v9erj",
        "is_location_offer" : true,
        "is_rental" : false,
        "product_image_id" : "01M7HNNZVVZ2KC78PERHMX3BVT"
    }
    const response = await request.post('/products', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
})

test.fail('@api POST /users/register does not create and returns error message (FALSE)', async({ request }) => {
    const data = {
        "first_name": "User", 
        "last_name": "User", 
        "email": "not-an-email",
        "password": "Str0ng!Pass2026"
    }
    const response = await request.post('/users/register', {data: data});
    expect(response.status()).toBe(422);
    expect(response.headers()['content-type']).toContain('application/json');
})

test.fail('@api PUT /products/01M7HNNZXBMR5221PWAPYZQ9JB does not update and returns error message', async({ request }) => {
    const data = {
        "name" : "Overwritten"
    }
    const response = await request.put('/products/01M7HNNZXBMR5221PWAPYZQ9JB', {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
})