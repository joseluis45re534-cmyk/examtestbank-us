import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import ProductList from "@/pages/ProductList";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductList} />
      <Route path="/category/:category">
        {(params) => <ProductList params={params} />}
      </Route>
      <Route path="/product/:slug">
        {(params) => <ProductDetail params={params} />}
      </Route>
      <Route path="/checkout" component={Checkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen font-body text-slate-900">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <CartDrawer />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
