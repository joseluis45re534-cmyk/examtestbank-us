import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container-width max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none"
                >
                    <h1 className="text-4xl font-bold font-display mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: January 24, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you make a purchase, sign up for our newsletter, or contact us. This may include your name, email address, billing address, and payment information.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
                            <li>Communicate with you about products, services, offers, and promotions.</li>
                            <li>Improve our website and customer service.</li>
                            <li>Detect and prevent fraud.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                        <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except for providing services like payment processing (Stripe/PayPal) and email delivery.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
                        <p>We use cookies to enhance your experience, understand site usage, and support our shopping cart functionality.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at support@examtestbank-us.com.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
