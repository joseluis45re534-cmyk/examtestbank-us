import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductList({ params }: { params?: { category?: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("featured");
  const { data: products, isLoading } = useProducts({ 
    category: params?.category,
    search: searchTerm,
  });
  const { data: categories } = useCategories();

  // Basic client-side sort since API is simple
  const sortedProducts = products ? [...products].sort((a, b) => {
    if (sort === "price-asc") return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    return 0; // Default order
  }) : [];

  const categoryName = categories?.find(c => c.slug === params?.category)?.name || "All Resources";

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-width">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">{categoryName}</h1>
            <p className="text-muted-foreground mt-1">
              {products?.length || 0} results found
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem checked={sort === "featured"} onCheckedChange={() => setSort("featured")}>
                  Featured
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sort === "price-asc"} onCheckedChange={() => setSort("price-asc")}>
                  Price: Low to High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sort === "price-desc"} onCheckedChange={() => setSort("price-desc")}>
                  Price: High to Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border">
                <Skeleton className="h-[300px] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed">
            <h3 className="text-lg font-medium text-foreground">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
