import { IStorage } from "./storage_interface";
import { importedProducts } from "./products_data";
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

export class MemStorage implements IStorage {
    private products: Product[];
    private categories: Category[];
    private reviews: Review[];
    private orders: Order[];
    private orderItems: OrderItem[];
    private contactMessages: ContactMessage[];
    private currentId: { [key: string]: number };

    constructor() {
        this.currentId = { products: 1, categories: 1, reviews: 1, orders: 1, contactMessages: 1 };
        this.categories = [];
        this.products = [];
        this.reviews = [];
        this.orders = [];
        this.orderItems = [];
        this.contactMessages = [];

        this.seedData();
    }

    private seedData() {
        // Categories
        const catsData = [
            { name: "Nursing", slug: "nursing", description: "Comprehensive nursing test banks and study guides." },
            { name: "Medical", slug: "medical", description: "Test banks for medical students and professionals." },
            { name: "Business", slug: "business", description: "Business, management, and finance exam resources." },
            { name: "Engineering", slug: "engineering", description: "Engineering test banks and solutions." },
            { name: "Pharmacology", slug: "pharmacology", description: "Pharmacology study resources." },
            { name: "Dentistry", slug: "dentistry", description: "Dental board prep and test banks." },
        ];

        catsData.forEach(c => {
            const id = this.currentId.categories++;
            this.categories.push({ ...c, id, imageUrl: null });
        });

        // Seed Imported Products
        importedProducts.forEach(p => {
            // Find or create category
            // @ts-ignore
            const catSlug = p.categorySlug || "uncategorized";
            let cat = this.categories.find(c => c.slug === catSlug);
            if (!cat) {
                const newCat = {
                    name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' '),
                    slug: catSlug,
                    description: "Imported Category"
                };
                const catId = this.currentId.categories++;
                this.categories.push({ ...newCat, id: catId, imageUrl: null });
                cat = this.categories.find(c => c.id === catId);
            }

            if (cat) {
                const id = this.currentId.products++;
                // @ts-ignore
                const { categorySlug, ...rest } = p;
                this.products.push({
                    ...rest,
                    id,
                    categoryId: cat.id,
                    isbn: null,
                    fileFormat: "PDF",
                    pages: 100
                } as Product);
            }
        });

        // Products
        const productsData = [
            {
                title: "Advanced Assessment 3rd Edition Mary Jo Goolsby Test Bank",
                slug: "advanced-assessment-3rd-edition-test-bank",
                categorySlug: "nursing",
                price: "19.99",
                originalPrice: "29.99",
                shortDescription: "Your comprehensive academic resource with diverse assessment tools to enhance learning. Ideal for educators and students seeking precision in evaluation and self-assessment.",
                longDescription: "The 'Advanced Assessment 3rd Edition Mary Jo Goolsby Test Bank' includes all chapters and serves as a valuable resource for your academic journey. It offers comprehensive assessment tools to enhance learning.",
                author: "Mary Jo Goolsby",
                edition: "3rd Edition",
                year: 2024,
                imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
                tags: ["nursing", "advanced assessment", "test bank"],
                isBestSeller: true,
                rating: "5.0",
                reviewCount: 42
            },
            {
                title: "Advanced Practice Nursing of Adults in Acute Care Test Bank",
                slug: "advanced-practice-nursing-adults-acute-care-test-bank",
                categorySlug: "nursing",
                price: "24.99",
                originalPrice: "34.99",
                shortDescription: "Your comprehensive academic resource with diverse assessment tools to enhance learning.",
                longDescription: "The 'Advanced Practice Nursing of Adults in Acute Care 1st Edition Test Bank' includes all chapters.",
                author: "Unknown",
                edition: "1st Edition",
                year: 2024,
                // Products
                // Only using imported products now

            }

    async getProducts(params ?: { category?: string; search?: string; limit?: number; featured?: boolean }): Promise < Product[] > {
                let result =[...this.products];

                if(params?.category) {
                    const cat = this.categories.find(c => c.slug === params.category);
                    if (cat) {
                        result = result.filter(p => p.categoryId === cat.id);
                    }
                }

        if(params?.search) {
                    const q = params.search.toLowerCase();
                    result = result.filter(p =>
                        p.title.toLowerCase().includes(q) ||
                        p.shortDescription.toLowerCase().includes(q)
                    );
                }

        if(params?.featured) {
                    result = result.filter(p => p.isBestSeller);
                }

        if(params?.limit) {
                    result = result.slice(0, params.limit);
                }

        return result;
            }

    async getProduct(id: number): Promise < Product | undefined > {
                return this.products.find(p => p.id === id);
            }

    async getProductBySlug(slug: string): Promise < Product | undefined > {
                return this.products.find(p => p.slug === slug);
            }

    async getCategories(): Promise < Category[] > {
                return this.categories;
            }

    async getCategoryBySlug(slug: string): Promise < Category | undefined > {
                return this.categories.find(c => c.slug === slug);
            }

    async getReviews(productId: number): Promise < Review[] > {
                return this.reviews.filter(r => r.productId === productId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            }

    async createReview(review: any): Promise < Review > {
                const newReview = {
                    ...review,
                    id: this.currentId.reviews++,
                    createdAt: new Date(),
                    // Defaults if missing
                    isVerified: true
                };
                this.reviews.push(newReview);
                return newReview;
            }

    async createOrder(orderData: InsertOrder & { items: { productId: number; quantity: number }[] }): Promise < any > {
                const order = {
                    id: this.currentId.orders++,
                    email: orderData.email,
                    totalAmount: orderData.totalAmount,
                    status: "pending",
                    createdAt: new Date()
                };
                this.orders.push(order as Order);

                for(const item of orderData.items) {
                const product = this.products.find(p => p.id === item.productId);
                if(product) {
                    this.orderItems.push({
                        id: 0, // Mock ID for item
                        orderId: order.id,
                        productId: item.productId,
                        price: product.price
                    });
                }
            }
        return order;
    }

    async createContactMessage(message: InsertContactMessage): Promise<any> {
        const msg = { ...message, id: this.currentId.contactMessages++, createdAt: new Date() };
        this.contactMessages.push(msg as ContactMessage);
        return msg;
    }
}
