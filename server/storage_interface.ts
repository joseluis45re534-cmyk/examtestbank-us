import {
    type Product,
    type Category,
    type Review,
    type InsertOrder,
    type InsertContactMessage,
    type Order,
    type OrderItem,
    type ContactMessage
} from "@shared/schema";

export interface IStorage {
    // Products
    getProducts(params?: { category?: string; search?: string; limit?: number; featured?: boolean }): Promise<Product[]>;
    getProduct(id: number): Promise<Product | undefined>;
    getProductBySlug(slug: string): Promise<Product | undefined>;
    createProduct(product: any): Promise<Product>;
    deleteProduct(id: number): Promise<void>;

    // Categories
    getCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | undefined>;

    // Reviews
    getReviews(productId: number): Promise<Review[]>;
    createReview(review: any): Promise<Review>;

    // Orders
    getOrders(): Promise<Order[]>;
    createOrder(order: InsertOrder & { items: { productId: number; quantity: number }[] }): Promise<any>;

    // Contact
    createContactMessage(message: InsertContactMessage): Promise<any>;
}
