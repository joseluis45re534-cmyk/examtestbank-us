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
import OrderConfirmation from "@/pages/OrderConfirmation";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";

// Helper to wrap public pages with Header/Footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    <CartDrawer />
  </>
);

function Router() {
  return (
    <Switch>
      {/* Public Routes - Wrapped in PublicLayout */}
      <Route path="/">
        {() => <PublicLayout><Home /></PublicLayout>}
      </Route>
      <Route path="/products">
        {() => <PublicLayout><ProductList /></PublicLayout>}
      </Route>
      <Route path="/category/:category">
        {(params) => <PublicLayout><ProductList params={params} /></PublicLayout>}
      </Route>
      <Route path="/product/:slug">
        {(params) => <PublicLayout><ProductDetail params={params} /></PublicLayout>}
      </Route>
      <Route path="/checkout">
        {() => <PublicLayout><Checkout /></PublicLayout>}
      </Route>
      <Route path="/order-confirmation">
        {() => <PublicLayout><OrderConfirmation /></PublicLayout>}
      </Route>

      {/* Admin Routes - No PublicLayout (Header/Footer hidden) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen font-body text-slate-900">
          {/* Router handles layouts now */}
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
