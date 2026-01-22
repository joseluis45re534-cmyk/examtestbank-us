import { Hono } from "hono";
import { storage } from "./storage"; // Uses MemStorage by default now
import { api } from "@shared/routes";
import { z } from "zod";

const app = new Hono();

// API Routes (Ported from routes.ts)

app.get(api.products.list.path, async (c) => {
    try {
        const category = c.req.query('category');
        const search = c.req.query('search');
        const limit = c.req.query('limit');
        const featured = c.req.query('featured');

        const products = await storage.getProducts({
            category,
            search,
            limit: limit ? Number(limit) : undefined,
            featured: featured === 'true',
        });
        return c.json(products);
    } catch (error) {
        return c.json({ message: "Failed to fetch products" }, 500);
    }
});

app.get(api.products.get.path, async (c) => {
    try {
        const slug = c.req.param('slug');
        const product = await storage.getProductBySlug(slug);
        if (!product) return c.json({ message: "Product not found" }, 404);
        return c.json(product);
    } catch (error) {
        return c.json({ message: "Failed to fetch product" }, 500);
    }
});

app.get(api.products.search.path, async (c) => {
    try {
        const q = c.req.query('q');
        if (!q) return c.json([]);
        const products = await storage.getProducts({ search: q });
        return c.json(products);
    } catch (error) {
        return c.json({ message: "Search failed" }, 500);
    }
});

app.get(api.categories.list.path, async (c) => {
    const categories = await storage.getCategories();
    return c.json(categories);
});

app.get(api.categories.get.path, async (c) => {
    const slug = c.req.param('slug');
    const category = await storage.getCategoryBySlug(slug);
    if (!category) return c.json({ message: "Category not found" }, 404);
    return c.json(category);
});

app.get(api.reviews.list.path, async (c) => {
    const id = c.req.param('id');
    const reviews = await storage.getReviews(Number(id));
    return c.json(reviews);
});

app.post(api.orders.create.path, async (c) => {
    try {
        const body = await c.req.json();
        const input = api.orders.create.input.parse(body);
        const order = await storage.createOrder(input);
        return c.json(order, 201);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return c.json({
                message: err.errors[0].message,
                field: err.errors[0].path.join('.'),
            }, 400);
        }
        return c.json({ message: "Failed to create order" }, 500);
    }
});

app.post(api.contact.submit.path, async (c) => {
    try {
        const body = await c.req.json();
        const input = api.contact.submit.input.parse(body);
        await storage.createContactMessage(input);
        return c.json({ success: true }, 201);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return c.json({ message: "Validation error" }, 400);
        }
        return c.json({ message: "Failed to send message" }, 500);
    }
});

export default app;
