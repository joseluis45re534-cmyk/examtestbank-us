import { Link } from "wouter";
import { GraduationCap, ShieldCheck, Mail, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-auto">
      <div className="container-width py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-display">
                EXAM<span className="text-primary">TESTBANK</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping students ace their exams with premium study materials since 2023. Instant downloads, verified content.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
              <Lock className="h-5 w-5" />
              <span className="text-xs">SSL Secure Payment</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/nursing" className="hover:text-primary">Nursing</Link></li>
              <li><Link href="/category/medical" className="hover:text-primary">Medical</Link></li>
              <li><Link href="/category/business" className="hover:text-primary">Business</Link></li>
              <li><Link href="/products" className="hover:text-primary">All Test Banks</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund & Return Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/contact-info" className="hover:text-primary transition-colors">Contact Information</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@examtestbank.us</span>
              </div>
              <p>Available 24/7 for your study needs.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ExamTestBank. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
