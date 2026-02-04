import { useProduct, useProductReviews } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Check, ShoppingCart, ShieldCheck, Download, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";

// Mock related products (in real app, fetch from API)
import { useProducts } from "@/hooks/use-products";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProduct(params.slug);
  const { data: reviews } = useProductReviews(product?.id || 0);
  const { data: relatedProducts } = useProducts({ category: product?.categoryId.toString(), limit: 4 });
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="container-width py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-slate-200 rounded-xl aspect-[3/4]" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-32 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="py-24 text-center">Product not found</div>;

  const handleBuyNow = () => {
    addItem(product);
    setLocation("/checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Hero */}
      <div className="bg-slate-50 border-b">
        <div className="container-width py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Image Column */}
            <div className="md:col-span-5 lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl shadow-lg border relative"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-auto rounded-lg"
                />
                {product.isBestSeller && (
                  <Badge className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-950 font-bold px-4 py-1 text-sm">
                    BEST SELLER
                  </Badge>
                )}
              </motion.div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                <div className="bg-white p-3 rounded-lg border">
                  <Download className="w-5 h-5 mx-auto mb-1 text-primary" />
                  Instant PDF
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-primary" />
                  Verified
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <Check className="w-5 h-5 mx-auto mb-1 text-primary" />
                  Printable
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                    {product.fileFormat || "PDF Download"}
                  </Badge>
                  {product.edition && (
                    <Badge variant="secondary">
                      {product.edition}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {product.rating} ({product.reviewCount} Reviews)
                  </span>
                </div>

                <div className="prose prose-slate max-w-none text-muted-foreground mb-8">
                  <p>{product.shortDescription}</p>
                </div>
              </div>

              <div className="mt-auto bg-white border rounded-2xl p-6 shadow-sm">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through decoration-red-500/50">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none">
                      Save ${(Number(product.originalPrice) - Number(product.price)).toFixed(2)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 btn-primary h-14 text-lg"
                    onClick={handleBuyNow}
                  >
                    Buy Now - Instant Download
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 h-14 text-lg border-2"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                <div className="flex justify-center mt-6">
                  <img
                    src="https://dentaledu.pro/assets/payment-badge-custom.png"
                    alt="Secure Payments"
                    className="h-8 w-auto opacity-90"
                  />
                </div>

                <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Files are emailed immediately after purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container-width py-16">
        <Tabs defaultValue="description" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="prose prose-slate max-w-none px-1">
            <h3 className="text-xl font-bold mb-4">About this Test Bank</h3>
            <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">{product.longDescription}</p>
          </TabsContent>

          <TabsContent value="details">
            <div className="bg-slate-50 p-6 rounded-xl border">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Author</dt>
                  <dd className="text-base font-medium">{product.author || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Edition</dt>
                  <dd className="text-base font-medium">{product.edition || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">ISBN</dt>
                  <dd className="text-base font-medium">{product.isbn || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                  <dd className="text-base font-medium">{product.year || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">File Format</dt>
                  <dd className="text-base font-medium">{product.fileFormat}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Pages</dt>
                  <dd className="text-base font-medium">{product.pages || "N/A"}</dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              {reviews?.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold flex items-center gap-2">
                      {review.authorName}
                      {review.isVerified && (
                        <Badge variant="outline" className="text-xs font-normal text-green-600 border-green-200 bg-green-50">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              ))}
              {(!reviews || reviews.length === 0) && (
                <p className="text-muted-foreground italic">No reviews yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="bg-slate-50 py-16 border-t">
        <div className="container-width">
          <h2 className="text-2xl font-bold mb-8">Customers Also Bought</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
