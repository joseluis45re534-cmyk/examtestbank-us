import { loadStripe } from "@stripe/stripe-js";

// Make sure to replace this with your actual Publishable Key from the Stripe Dashboard
// For the demo, if this is missing, the loadStripe call might fail or warn, 
// so we should handle that gracefully in the UI or provide a placeholder test key if pertinent.
// Usually users provide this in .env as VITE_STRIPE_PUBLISHABLE_KEY

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder";

export const stripePromise = loadStripe(STRIPE_KEY);
