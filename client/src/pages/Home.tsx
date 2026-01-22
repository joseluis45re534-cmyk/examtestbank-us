import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, Download, Shield, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useProducts({ featured: true, limit: 4 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Hero Image: Student studying (Unsplash)
  // <!-- https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2940 -->
  const heroImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2940";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={heroImage} alt="Students studying" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50 z-0" />
        
        <div className="container-width relative z-10 py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium border border-primary/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Content for 2024 Exams</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight">
              Ace Your Exams with <span className="text-primary">Confidence</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl">
              Get instant access to premium test banks, solution manuals, and study guides. 
              Join 50,000+ students achieving top grades today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="btn-primary text-lg px-8 h-14 w-full sm:w-auto">
                  Browse Test Banks <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/category/nursing">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14 w-full sm:w-auto">
                  Nursing Resources
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>100% Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container-width">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find the exact study materials you need for your major.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse" />
              ))
            ) : (
              categories?.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10" />
                    <img 
                      src={category.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800"} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2 font-display">{category.name}</h3>
                      <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {category.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container-width">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <Link href="/products">
              <Button variant="link" className="text-primary font-semibold">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {productsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] bg-slate-100 rounded-xl animate-pulse" />
              ))
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-t border-b">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Delivery</h3>
              <p className="text-muted-foreground">Files are automatically delivered to your email immediately after purchase.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Community Trusted</h3>
              <p className="text-muted-foreground">Join over 50,000 nursing and medical students who trust our materials.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Satisfaction Guaranteed</h3>
              <p className="text-muted-foreground">We verify all content for accuracy. Secure payment processing via Stripe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews/Social Proof */}
      <section className="py-16 md:py-24 bg-slate-900 text-white text-center">
        <div className="container-width max-w-4xl">
          <div className="flex justify-center mb-6 space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
            "I was struggling with my Med-Surg class until I found this test bank. The practice questions were exactly what I needed to understand the material. Passed with an A!"
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg">
              JS
            </div>
            <div className="text-left">
              <div className="font-bold">Jessica S.</div>
              <div className="text-slate-400 text-sm">Nursing Student, NYU</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
