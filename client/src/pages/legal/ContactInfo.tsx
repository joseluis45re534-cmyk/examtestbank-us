import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default function ContactInfo() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container-width max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold font-display mb-8">Contact Information</h1>
                    <p className="text-lg text-muted-foreground mb-12">
                        We are here to help! If you have any questions about your order, our products, or
                        need technical assistance, please get in touch with us using any of the methods below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="p-6 bg-slate-50 rounded-xl border">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Mail className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-muted-foreground mb-4">Our preferred contact method. We usually respond within 2-4 hours.</p>
                            <a href="mailto:support@examtestbank.us" className="text-primary font-bold text-lg hover:underline transition-all">
                                support@examtestbank.us
                            </a>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-xl border">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <MessageSquare className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Live Support</h3>
                            <p className="text-muted-foreground mb-4">Need help right now? Use the chat widget at the bottom right of your screen.</p>
                            <span className="text-green-600 font-bold">Online: Mon-Fri, 9am - 6pm EST</span>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-xl border">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <MapPin className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Our Office</h3>
                            <p className="text-muted-foreground">
                                42 Annandale St, Edinburgh<br />
                                EH7 4AZ, UK
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-xl border">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Phone className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <p className="text-muted-foreground mb-4">For urgent inquiries only.</p>
                            <a href="tel:+19413449481" className="text-primary font-bold text-lg hover:underline transition-all">
                                +19413449481
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
