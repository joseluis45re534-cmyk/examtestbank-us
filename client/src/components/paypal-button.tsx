import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PayPalButtonProps {
    amount: number;
    onSuccess: (details: any) => void;
}

export function PayPalPayment({ amount, onSuccess }: PayPalButtonProps) {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    const { toast } = useToast();

    if (isPending) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    if (isRejected) {
        console.error("PayPal Script Load Failed. Check Client ID and network.");
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                <p className="font-semibold">Failed to load PayPal</p>
                <p className="text-sm">Please refresh the page or try another payment method.</p>
            </div>
        );
    }

    if (!window.paypal) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="w-full z-0 relative">
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async (data, actions) => {
                    try {
                        const response = await fetch("/api/create-paypal-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ amount }),
                        });
                        const order = await response.json();
                        return order.orderID;
                    } catch (err) {
                        toast({
                            title: "Error creating PayPal order",
                            description: "Please try again.",
                            variant: "destructive"
                        });
                        throw err;
                    }
                }}
                onApprove={async (data, actions) => {
                    try {
                        const response = await fetch("/api/capture-paypal-order", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderID: data.orderID }),
                        });
                        const details = await response.json();
                        onSuccess(details);
                    } catch (err) {
                        toast({
                            title: "Payment Failed",
                            description: "Could not capture payment.",
                            variant: "destructive"
                        });
                    }
                }}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    toast({
                        title: "PayPal Error",
                        description: "Something went wrong with PayPal.",
                        variant: "destructive"
                    });
                }}
            />
        </div>
    );
}
