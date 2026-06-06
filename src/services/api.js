const BASE_URL = 'http://localhost:3000';

export const getProducts = async () =>{
    const res = await fetch('${BASE_URL}/products');
    return res.json();
};

export const getProductById = async (id) =>{
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
};

export const getCategories = async () =>{
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export const createOrder = async (orderData) =>{
    const res = await fetch(`${BASE_URL}/orders`, {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(orderData),});
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
};
