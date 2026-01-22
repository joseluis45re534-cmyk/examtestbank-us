import { db } from "./db";
import {
  products,
  categories,
  reviews,
  orders,
  orderItems,
  contactMessages,
  type Product,
  type Category,
  type Review,
  type InsertOrder,
  type InsertContactMessage,
} from "@shared/schema";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(params?: { category?: string; search?: string; limit?: number; featured?: boolean }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // Reviews
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: any): Promise<Review>; // Simplified for seeding

  // Orders
  createOrder(order: InsertOrder & { items: { productId: number; quantity: number }[] }): Promise<any>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(params?: { category?: string; search?: string; limit?: number; featured?: boolean }): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];

    if (params?.category) {
      // Join would be better, but for simplicity assuming we look up category first or handle in route
      // Actually, let's filter by category slug if possible, or just exact ID if we had it.
      // Since params.category is a slug string from the frontend usually:
      const category = await this.getCategoryBySlug(params.category);
      if (category) {
        conditions.push(eq(products.categoryId, category.id));
      }
    }

    if (params?.search) {
      conditions.push(
        or(
          ilike(products.title, `%${params.search}%`),
          ilike(products.shortDescription, `%${params.search}%`)
        )
      );
    }

    if (params?.featured) {
      conditions.push(eq(products.isBestSeller, true));
    }

    if (conditions.length > 0) {
      // @ts-ignore - complex types
      query = query.where(and(...conditions));
    }

    if (params?.limit) {
      // @ts-ignore
      query = query.limit(params.limit);
    }

    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: any): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async createOrder(orderData: InsertOrder & { items: { productId: number; quantity: number }[] }): Promise<any> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({
        email: orderData.email,
        totalAmount: orderData.totalAmount,
      }).returning();

      for (const item of orderData.items) {
        // Get product price (should verify, but trusting input/frontend calc for this demo speed, 
        // ideally fetch product price here)
         const [product] = await tx.select().from(products).where(eq(products.id, item.productId));
         if (product) {
             await tx.insert(orderItems).values({
               orderId: order.id,
               productId: item.productId,
               price: product.price, // Use real price from DB
             });
         }
      }
      return order;
    });
  }

  async createContactMessage(message: InsertContactMessage): Promise<any> {
    return await db.insert(contactMessages).values(message).returning();
  }
}

export const storage = new DatabaseStorage();
