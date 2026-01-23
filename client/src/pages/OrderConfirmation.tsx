import { Link } from "wouter";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderConfirmation() {
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
