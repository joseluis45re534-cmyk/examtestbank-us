import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
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

// Legal Pages
import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import TermsOfService from "@/pages/legal/TermsOfService";
import RefundPolicy from "@/pages/legal/RefundPolicy";
import ShippingPolicy from "@/pages/legal/ShippingPolicy";
import ContactInfo from "@/pages/legal/ContactInfo";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminSettings from "@/pages/admin/Settings";

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

      {/* Legal Routes */}
      <Route path="/privacy-policy">
        {() => <PublicLayout><PrivacyPolicy /></PublicLayout>}
      </Route>
      <Route path="/terms-of-service">
        {() => <PublicLayout><TermsOfService /></PublicLayout>}
      </Route>
      <Route path="/refund-policy">
        {() => <PublicLayout><RefundPolicy /></PublicLayout>}
      </Route>
      <Route path="/shipping-policy">
        {() => <PublicLayout><ShippingPolicy /></PublicLayout>}
      </Route>
      <Route path="/contact-info">
        {() => <PublicLayout><ContactInfo /></PublicLayout>}
      </Route>

      {/* Admin Routes - No PublicLayout (Header/Footer hidden) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/settings" component={AdminSettings} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

const initialPayPalOptions = {
  clientId: "AWODaf8d8Tlv2CgeV0ZSSQBB8RiZh0iE74ihSq2U4M66FOUbsiGnOkHjHYxHVEOD_OnBKbL8VJ1p56oc",
  currency: "USD",
  components: "buttons",
};

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <PayPalScriptProvider options={initialPayPalOptions}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen font-body text-slate-900">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </PayPalScriptProvider>
    </QueryClientProvider>
  );
}

export default App;
