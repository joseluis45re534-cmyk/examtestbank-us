import { motion } from "framer-motion";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container-width max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none"
                >
                    <h1 className="text-4xl font-bold font-display mb-8">Refund & Return Policy</h1>
                    <p className="text-muted-foreground mb-6">Last Updated: January 24, 2026</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">1. Digital Products Refund Policy</h2>
                        <p>Due to the nature of digital products (instant downloads), we generally **do not offer refunds** once the file has been accessed or downloaded. All sales are final.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">2. Exceptions</h2>
                        <p>We may consider a refund only in the following special circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>**Wrong File Delivered**: If you received a file different from the one you purchased.</li>
                            <li>**Corrupted File**: If the file is damaged and we are unable to provide a working replacement.</li>
                            <li>**Duplicate Purchase**: If you accidentally purchased the exact same item twice within 24 hours.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">3. How to Request a Refund</h2>
                        <p>To request a refund, please contact our support team at **support@examtestbank.us** with your order number and the reason for your request. Refund requests must be made within 7 days of purchase.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">4. Processing Refunds</h2>
                        <p>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (Stripe or PayPal) within 5-10 business days.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                        <p>If you have any issues with your download, please don't hesitate to contact us. We are here to help and ensure you get the resources you need.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
