import { z } from "zod";
import { insertOrderSchema, insertContactMessageSchema, products, categories, reviews } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: "GET" as const,
      path: "/api/products",
      input: z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        limit: z.coerce.number().optional(),
        featured: z.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/products/:slug",
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    search: {
      method: "GET" as const,
      path: "/api/products/search",
      input: z.object({ q: z.string() }),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    }
  },
  categories: {
    list: {
      method: "GET" as const,
      path: "/api/categories",
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/categories/:slug",
      responses: {
        200: z.custom<typeof categories.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  reviews: {
    list: {
      method: "GET" as const,
      path: "/api/products/:id/reviews",
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      },
    },
  },
  orders: {
    create: {
      method: "POST" as const,
      path: "/api/orders",
      input: insertOrderSchema.extend({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().default(1),
        })),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          email: z.string(),
          totalAmount: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  contact: {
    submit: {
      method: "POST" as const,
      path: "/api/contact",
      input: insertContactMessageSchema,
      responses: {
        201: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProductResponse = typeof products.$inferSelect;
export type CategoryResponse = typeof categories.$inferSelect;
export type ReviewResponse = typeof reviews.$inferSelect;
