import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  
  const discount = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative bg-white rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-accent text-white hover:bg-accent font-bold">
            -{discount}% OFF
          </Badge>
        )}
        {product.isBestSeller && (
          <Badge className="absolute top-3 right-3 bg-yellow-400 text-yellow-950 hover:bg-yellow-400 font-bold">
            BEST SELLER
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <Link href={`/product/${product.slug}`} className="block mb-2 flex-grow">
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
          </div>

          <Button 
            size="sm" 
            onClick={() => addItem(product)}
            className="rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
