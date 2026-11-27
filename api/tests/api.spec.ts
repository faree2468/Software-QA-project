import {test, expect, type APIRequestContext} from '@playwright/test';

async function productId(request: APIRequestContext, name: string) {
    const res = await request.get(`/products/search?q=${encodeURIComponent(name)}`);
    const product = (await res.json()).data.find((p: any) => p.name === name);
    if (!product) throw new Error(`Product "${name}" not found`);
    return product.id;
}

async function categoryId(request: APIRequestContext) {
    const res = await request.get(`/categories`);
    const ctg = (await res.json()).data[0]
    if (!ctg) throw new Error(`Category not found`);
    return ctg.id;
}

async function brandId(request: APIRequestContext) {
    const res = await request.get(`/brands`);
    const brand = (await res.json()).data[0];
    if (!brand) throw new Error(`Brand not found`);
    return brand.id;
}

async function imageId(request: APIRequestContext) {
    const res = await request.get(`/images`);
    const image = (await res.json()).data[0];
    if (!image) throw new Error(`Brand not found`);
    return image.id;
}

test('@api GET /products returns all pages containing products', async({ request }) => {
    const response = await request.get('/products');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
})

test('@api GET /products/{id} returns the product for a given id', async({ request }) => {
    const id = await productId(request, 'Pliers');
    const response = await request.get(`/products/${id}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toMatchObject({
        "id": "01M7HNNZWM8N5HMX2J0FZ01T03",
        "name": "Pliers",
        "price": 12.01,
        "is_location_offer": false,
        "is_rental": false,
        "co2_rating": "D",
        "in_stock": true,
        "is_eco_friendly": false,
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

test.fail('@api PATCH /products/{id} does not update and returns error message (FALSE)', async({ request }) => {
    const id = await productId(request, "Actual Thor Hammer");
    const data = {
        "name" : "Thor Hammer"
    }
    const response = await request.patch(`/products/${id}`, {data: data});
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
    const ctgId = await categoryId(request);
    const bId = await brandId(request);
    const imgId = await imageId(request);
    const data = {
        "name": "Bosch drill",
        "price" : 9.99,
        "category_id" : ctgId,
        "brand_id" : bId,
        "is_location_offer" : true,
        "is_rental" : false,
        "product_image_id" : imgId
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

test.fail('@api PUT /products/{id} does not update and returns error message', async({ request }) => {
    const id = await productId(request, "Chisels");
    const data = {
        "name" : "Overwritten"
    }
    const response = await request.put(`/products/${id}`, {data: data});
    expect(response.status()).toBe(401);
    expect(response.headers()['content-type']).toContain('application/json');
})

