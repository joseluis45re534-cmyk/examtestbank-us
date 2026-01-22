import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/products
export function useProducts(params?: { category?: string; search?: string; limit?: number; featured?: boolean }) {
  return useQuery({
    queryKey: [api.products.list.path, params],
    queryFn: async () => {
      // Manually construct query string since buildUrl is for path params
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append("category", params.category);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.featured) queryParams.append("featured", "true");
      
      const url = `${api.products.list.path}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/products/:slug
export function useProduct(slug: string) {
  return useQuery({
    queryKey: [api.products.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      return api.products.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// GET /api/products/:id/reviews
export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, productId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { id: productId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!productId,
  });
}

// GET /api/categories
export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}
