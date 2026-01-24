import { motion } from "framer-motion";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container-width max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none"
                >
                    <h1 className="text-4xl font-bold font-display mb-8">Shipping & Delivery Policy</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: January 24, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Digital Delivery Only</h2>
                        <p>Exam Test Bank US exclusively sells **digital products** (PDFs and downloadable resources). We do not ship physical items through postal mail.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Instant Access</h2>
                        <p>Upon successful payment completion, you will receive an automatic email containing the download link(s) for your purchased products. This process is usually instantaneous.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. Delivery Issues</h2>
                        <p>If you do not receive your download email within 15 minutes, please follow these steps:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Check your **Spam/Junk** or "Promotions" folders.</li>
                            <li>Ensure the email address used during checkout was correct.</li>
                            <li>Contact our support team if you still cannot access your files.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Costs</h2>
                        <p>There are **no shipping or delivery fees** associated with your purchase. The price you see in the cart is the final price for the digital access.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                        <p>If you experience any difficulties with your download, please reach out to **support@examtestbank-us.com**.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
