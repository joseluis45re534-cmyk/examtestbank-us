import { Link, useSearch } from "wouter";
import { CheckCircle, Home, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";

export default function OrderConfirmation() {
    const searchString = window.location.search;
    const searchParams = new URLSearchParams(searchString);
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const { clearCart } = useCart();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus('success'); // Fallback if regular navigation
            return;
        }

        const verifyOrder = async () => {
            try {
                const res = await fetch('/api/verify-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId })
                });

                if (res.ok) {
                    clearCart();
                    setStatus('success');
                } else {
                    const data = await res.json();
                    console.error("Verification failed", data);
                    setErrorMsg(data.message || "Unknown server error");
                    setStatus('error');
                }
            } catch (e: any) {
                console.error(e);
                setErrorMsg(e.message || "Network request failed");
                setStatus('error');
            }
        };

        verifyOrder();
    }, [sessionId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Finalizing your order...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md p-8">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
                    <p className="text-muted-foreground mb-4">We couldn't verify your payment. If you were charged, please contact support.</p>

                    {errorMsg && (
                        <div className="bg-slate-100 p-3 rounded text-xs text-left mb-4 font-mono overflow-auto max-h-32">
                            ERROR: {errorMsg}
                        </div>
                    )}

                    <Button asChild><Link href="/contact">Contact Support</Link></Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-24 flex items-center justify-center">
            <div className="container-width max-w-lg">
                <Card className="text-center border-green-200 shadow-lg">
                    <CardContent className="pt-12 pb-12 px-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Order Confirmed!</h1>
                        <p className="text-muted-foreground mb-8 text-lg">
                            Thank you for your purchase. We have sent a confirmation email with your download links.
                        </p>

                        <div className="space-y-3">
                            <Button asChild className="w-full h-12 text-lg">
                                <Link href="/products">
                                    Continue Shopping <ShoppingBag className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full h-12 text-lg">
                                <Link href="/">
                                    Return Home <Home className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
