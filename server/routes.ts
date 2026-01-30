import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { products, categories, reviews } from "@shared/schema";
import { db } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API Routes
  app.get("/image_proxy", async (req, res) => {
    const imageUrl = req.query.url as string;

    if (!imageUrl) {
      res.status(400).send("Missing url parameter");
      return;
    }

    try {
      const imageResponse = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Referer": "https://studiazone.com/"
        }
      });

      if (!imageResponse.ok) {
        res.status(imageResponse.status).send(`Failed to fetch image: ${imageResponse.statusText}`);
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const contentType = imageResponse.headers.get("content-type");
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }

      const buffer = await imageResponse.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).send(`Error fetching image: ${(error as Error).message}`);
    }
  });

  app.get(api.products.list.path, async (req, res) => {
    try {
      const { category, search, limit, featured } = req.query;
      const products = await storage.getProducts({
        category: category as string,
        search: search as string,
        limit: limit ? Number(limit) : undefined,
        featured: featured === 'true',
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug as string);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get(api.products.search.path, async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.json([]);
      const products = await storage.getProducts({ search: q as string });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });


  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.categories.get.path, async (req, res) => {
    const category = await storage.getCategoryBySlug(req.params.slug as string);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  });

  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews(Number(req.params.id));
    res.json(reviews);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      await storage.createContactMessage(input);
      res.status(201).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error" });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });


  // Stripe Route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd" } = req.body;

      // Retrieve Stripe API key from environment variables
      const apiKey = process.env.STRIPE_SECRET_KEY;

      if (!apiKey) {
        console.warn("No STRIPE_SECRET_KEY found. Mocking payment intent.");
        return res.json({
          clientSecret: "mock_secret_" + Date.now(),
          mock: true
        });
      }

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(apiKey, {
        apiVersion: "2025-12-15.clover",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PayPal Config
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.warn("PayPal keys missing from environment variables.");
  }

  async function getPayPalAccessToken() {
    const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    return (data as any).access_token;
  }

  // PayPal Routes
  app.post("/api/create-paypal-order", async (req, res) => {
    try {
      const { amount } = req.body;
      const accessToken = await getPayPalAccessToken();

      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount.toString(),
              },
            },
          ],
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("PayPal Create Order Error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/capture-paypal-order", async (req, res) => {
    try {
      const { orderID } = req.body;
      const accessToken = await getPayPalAccessToken();

      const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json(); // Capture details
      res.json(data);
    } catch (error: any) {
      console.error("PayPal Capture Error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Seed Data function
  if (process.env.DATABASE_URL) {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  if (!db) return;
  const existingCats = await storage.getCategories();
  if (existingCats.length > 0) return;

  console.log("Seeding database...");

  // 1. Categories
  const catsData = [
    { name: "Nursing", slug: "nursing", description: "Comprehensive nursing test banks and study guides." },
    { name: "Medical", slug: "medical", description: "Test banks for medical students and professionals." },
    { name: "Business", slug: "business", description: "Business, management, and finance exam resources." },
    { name: "Engineering", slug: "engineering", description: "Engineering test banks and solutions." },
    { name: "Pharmacology", slug: "pharmacology", description: "Pharmacology study resources." },
    { name: "Dentistry", slug: "dentistry", description: "Dental board prep and test banks." },
  ];

  const createdCats: any[] = [];
  for (const c of catsData) {
    const [cat] = await db.insert(categories).values(c).returning();
    createdCats.push(cat);
  }

  // 2. Products (Including new products from CSV)
  const productsData = [
    {
      title: "Advanced Assessment 3rd Edition Mary Jo Goolsby Test Bank",
      slug: "advanced-assessment-3rd-edition-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
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
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "24.99",
      originalPrice: "34.99",
      shortDescription: "Your comprehensive academic resource with diverse assessment tools to enhance learning. Ideal for educators and students seeking precision in evaluation and self-assessment.",
      longDescription: "The 'Advanced Practice Nursing of Adults in Acute Care 1st Edition Test Bank' includes all chapters and serves as a valuable resource for your academic journey. It offers comprehensive assessment tools for acute care nursing.",
      author: "Unknown",
      edition: "1st Edition",
      year: 2024,
      imageUrl: "https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "acute care", "test bank"],
      isBestSeller: false,
      rating: "4.9",
      reviewCount: 15
    },
    {
      title: "Advancing Your Career Concepts of Professional Nursing 6th Edition Test Bank",
      slug: "advancing-your-career-concepts-nursing-6th-edition-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "21.99",
      originalPrice: "31.99",
      shortDescription: "Your comprehensive academic resource with diverse assessment tools to enhance learning. Ideal for educators and students seeking precision in evaluation and self-assessment.",
      longDescription: "The 'Advancing Your Career Concepts of Professional Nursing 6th Edition Test Bank' includes all chapters and serves as a valuable resource for your academic journey.",
      author: "Unknown",
      edition: "6th Edition",
      year: 2024,
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "career concepts", "test bank"],
      isBestSeller: true,
      rating: "4.8",
      reviewCount: 24
    },
    {
      title: "Test Bank for Medical-Surgical Nursing",
      slug: "medical-surgical-nursing-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "24.99",
      originalPrice: "34.99",
      shortDescription: "Complete test bank for Medical-Surgical Nursing: Concepts for Interprofessional Collaborative Care, 9th Edition.",
      longDescription: "Master your Medical-Surgical Nursing exams with this comprehensive test bank. Includes over 1000 practice questions covering all chapters. Formatted for easy studying on any device. Instant download in PDF format.",
      author: "Ignatavicius & Workman",
      edition: "9th Edition",
      year: 2024,
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "med-surg", "test bank"],
      isBestSeller: true,
      rating: "4.9",
      reviewCount: 124
    },
    {
      title: "Fundamentals of Nursing Test Bank",
      slug: "fundamentals-of-nursing-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "19.99",
      originalPrice: "29.99",
      shortDescription: "Essential practice questions for Fundamentals of Nursing, 10th Edition.",
      longDescription: "Ace your fundamentals exam! This test bank covers basic nursing concepts, patient care, and clinical judgment. Perfect for 1st-year nursing students.",
      author: "Potter & Perry",
      edition: "10th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "fundamentals"],
      isBestSeller: true,
      rating: "4.8",
      reviewCount: 89
    },
    {
      title: "Pharmacology for Nurses Test Bank",
      slug: "pharmacology-for-nurses-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "22.99",
      originalPrice: "32.99",
      shortDescription: "A Pathophysiologic Approach - 6th Edition Test Bank.",
      longDescription: "Detailed pharmacology questions focusing on mechanism of action, side effects, and nursing implications. A must-have for pharm exams.",
      author: "Adams & Urban",
      edition: "6th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "pharmacology"],
      isBestSeller: false,
      rating: "4.7",
      reviewCount: 45
    },
    {
      title: "Guyton and Hall Textbook of Medical Physiology",
      slug: "medical-physiology-test-bank",
      categoryId: createdCats.find(c => c.slug === "medical").id,
      price: "29.99",
      originalPrice: "45.00",
      shortDescription: "Complete test bank for the 14th Edition of Medical Physiology.",
      longDescription: "Deep dive into physiology with thousands of questions derived from the gold-standard textbook. Perfect for USMLE Step 1 prep.",
      author: "Hall",
      edition: "14th Edition",
      year: 2024,
      imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600",
      tags: ["medical", "physiology", "usmle"],
      isBestSeller: true,
      rating: "5.0",
      reviewCount: 210
    },
    {
      title: "Robbins Basic Pathology Test Bank",
      slug: "robbins-pathology-test-bank",
      categoryId: createdCats.find(c => c.slug === "medical").id,
      price: "27.99",
      originalPrice: "39.99",
      shortDescription: "10th Edition Test Bank for Robbins Basic Pathology.",
      longDescription: "Understand disease mechanisms with this comprehensive question set. High-yield for medical school exams.",
      author: "Kumar",
      edition: "10th Edition",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
      tags: ["medical", "pathology"],
      isBestSeller: false,
      rating: "4.6",
      reviewCount: 34
    },
    {
      title: "Principles of Marketing Test Bank",
      slug: "principles-of-marketing-test-bank",
      categoryId: createdCats.find(c => c.slug === "business").id,
      price: "15.99",
      originalPrice: "25.99",
      shortDescription: "Test Bank for Kotler & Armstrong, 17th Edition.",
      longDescription: "Master marketing concepts from the 4Ps to digital strategy. Includes case study questions.",
      author: "Kotler",
      edition: "17th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600",
      tags: ["business", "marketing"],
      isBestSeller: false,
      rating: "4.5",
      reviewCount: 22
    },
    {
      title: "Financial Accounting Test Bank",
      slug: "financial-accounting-test-bank",
      categoryId: createdCats.find(c => c.slug === "business").id,
      price: "24.99",
      originalPrice: "35.99",
      shortDescription: "Tools for Business Decision Making, 9th Edition.",
      longDescription: "Practice balance sheets, income statements, and cash flow analysis with this rigorous test bank.",
      author: "Kimmel",
      edition: "9th Edition",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1554224155-98406852d009?auto=format&fit=crop&q=80&w=600",
      tags: ["business", "accounting"],
      isBestSeller: true,
      rating: "4.8",
      reviewCount: 67
    },
    {
      title: "Engineering Mechanics: Statics",
      slug: "engineering-mechanics-statics-test-bank",
      categoryId: createdCats.find(c => c.slug === "engineering").id,
      price: "19.99",
      originalPrice: "29.99",
      shortDescription: "14th Edition Test Bank by Hibbeler.",
      longDescription: "Solve complex force vector problems with confidence. Includes full solutions for study.",
      author: "Hibbeler",
      edition: "14th Edition",
      year: 2021,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
      tags: ["engineering", "statics"],
      isBestSeller: false,
      rating: "4.7",
      reviewCount: 15
    },
    {
      title: "Basic and Clinical Pharmacology",
      slug: "basic-clinical-pharmacology-test-bank",
      categoryId: createdCats.find(c => c.slug === "pharmacology").id,
      price: "26.99",
      originalPrice: "36.99",
      shortDescription: "Test Bank for Katzung, 15th Edition.",
      longDescription: "The most authoritative pharmacology text's companion test bank. Essential for pharmacy students.",
      author: "Katzung",
      edition: "15th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=600",
      tags: ["pharmacology", "medical"],
      isBestSeller: true,
      rating: "4.9",
      reviewCount: 98
    },
    {
      title: "Clinical Periodontology",
      slug: "clinical-periodontology-test-bank",
      categoryId: createdCats.find(c => c.slug === "dentistry").id,
      price: "29.99",
      originalPrice: "40.00",
      shortDescription: "Carranza’s Clinical Periodontology, 13th Edition.",
      longDescription: "Deepen your understanding of periodontal disease and treatment. High-resolution diagrams included in questions.",
      author: "Newman",
      edition: "13th Edition",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
      tags: ["dentistry", "periodontology"],
      isBestSeller: false,
      rating: "4.6",
      reviewCount: 12
    },
    {
      title: "Maternal-Child Nursing",
      slug: "maternal-child-nursing-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "21.99",
      originalPrice: "31.99",
      shortDescription: "Test Bank for McKinney, 6th Edition.",
      longDescription: "Covering everything from prenatal care to pediatric nursing. Comprehensive Q&A.",
      author: "McKinney",
      edition: "6th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "maternal", "pediatric"],
      isBestSeller: false,
      rating: "4.8",
      reviewCount: 41
    },
    {
      title: "Psychiatric-Mental Health Nursing",
      slug: "psychiatric-nursing-test-bank",
      categoryId: createdCats.find(c => c.slug === "nursing").id,
      price: "20.99",
      originalPrice: "30.99",
      shortDescription: "Videbeck's Psychiatric-Mental Health Nursing, 8th Edition.",
      longDescription: "Prepare for your psych rotation with these specialized questions on mental health disorders and treatments.",
      author: "Videbeck",
      edition: "8th Edition",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600",
      tags: ["nursing", "psych"],
      isBestSeller: false,
      rating: "4.7",
      reviewCount: 28
    },
    {
      title: "Microbiology for the Healthcare Professional",
      slug: "microbiology-healthcare-test-bank",
      categoryId: createdCats.find(c => c.slug === "medical").id,
      price: "18.99",
      originalPrice: "28.99",
      shortDescription: "Test Bank for VanMeter, 3rd Edition.",
      longDescription: "Understand microbes and infection control. Key for all health professionals.",
      author: "VanMeter",
      edition: "3rd Edition",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600",
      tags: ["medical", "microbiology"],
      isBestSeller: false,
      rating: "4.5",
      reviewCount: 19
    },
    {
      title: "Strategic Management: Concepts",
      slug: "strategic-management-test-bank",
      categoryId: createdCats.find(c => c.slug === "business").id,
      price: "19.99",
      originalPrice: "29.99",
      shortDescription: "Test Bank for Rothaermel, 5th Edition.",
      longDescription: "Learn to analyze competitive advantage and strategy. Great for MBA students.",
      author: "Rothaermel",
      edition: "5th Edition",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      tags: ["business", "strategy"],
      isBestSeller: false,
      rating: "4.6",
      reviewCount: 14
    },
    {
      title: "Calculus: Early Transcendentals",
      slug: "calculus-early-transcendentals-test-bank",
      categoryId: createdCats.find(c => c.slug === "engineering").id,
      price: "22.99",
      originalPrice: "32.99",
      shortDescription: "Test Bank for Stewart, 9th Edition.",
      longDescription: "The standard for calculus. Practice limits, derivatives, and integrals until you master them.",
      author: "Stewart",
      edition: "9th Edition",
      year: 2021,
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
      tags: ["engineering", "math"],
      isBestSeller: true,
      rating: "4.9",
      reviewCount: 156
    }
  ];

  for (const p of productsData) {
    const [product] = await db.insert(products).values(p).returning();

    // Seed reviews for this product
    const reviewCount = Math.floor(Math.random() * 5) + 3; // 3-7 reviews
    for (let i = 0; i < reviewCount; i++) {
      await db.insert(reviews).values({
        productId: product.id,
        authorName: ["Sarah M.", "John D.", "Emily R.", "Michael B.", "Jessica K."][Math.floor(Math.random() * 5)],
        rating: 5,
        content: ["Excellent resource!", "Passed my exam thanks to this!", "Instant download worked perfectly.", "Highly recommended.", "Great value."][Math.floor(Math.random() * 5)],
        isVerified: true
      });
    }
  }

  console.log("Database seeded successfully!");
}
