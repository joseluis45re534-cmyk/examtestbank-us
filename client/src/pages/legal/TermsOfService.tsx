import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container-width max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none"
                >
                    <h1 className="text-4xl font-bold font-display mb-8">Terms of Service</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: January 24, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Digital Products</h2>
                        <p>Our store specializes in digital products (test banks, study guides). Upon purchase, you receive a license to use these materials for personal study only. Redistribution or resale is strictly prohibited.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Purchases and Payment</h2>
                        <p>All prices are in USD. We reserve the right to change prices at any time. Payments are processed securely via Stripe or PayPal.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
                        <p>The content on this website, including text, graphics, logos, and images, is the property of Exam Test Bank US and is protected by copyright laws.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Disclaimer</h2>
                        <p>Our products are intended for educational purposes only. While we strive for accuracy, we do not guarantee that the materials are free from errors or will guarantee any specific exam result.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
                        <p>In no event shall Exam Test Bank US be liable for any damages arising out of the use or inability to use the materials on our website.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">7. Contact Information</h2>
                        <p>Questions about the Terms of Service should be sent to us at support@examtestbank.us.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
