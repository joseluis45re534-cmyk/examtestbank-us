import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Simulating schema for form
const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  cardNumber: z.string().min(15, "Invalid card number"),
  expiry: z.string().min(4, "Invalid expiry"),
  cvc: z.string().min(3, "Invalid CVC"),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="container-width py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => setLocation("/products")}>Start Shopping</Button>
      </div>
    );
  }

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    // Construct order payload
    const orderData = {
      email: data.email,
      totalAmount: total().toString(),
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    createOrder(orderData, {
      onSuccess: () => {
        clearCart();
        toast({
          title: "Order confirmed!",
          description: "Check your email for download links.",
        });
        setLocation("/"); // In real app, go to success page
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-width">
        <h1 className="text-3xl font-bold mb-8 font-display">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>We'll send your download link here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="student@university.edu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" /> Payment Details
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-green-600">
                      <Lock className="w-3 h-3" /> Secure SSL Encrypted Transaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="0000 0000 0000 0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry (MM/YY)</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full btn-primary h-14 text-lg" disabled={isPending}>
                  {isPending ? "Processing..." : `Pay $${total().toFixed(2)}`}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Satisfaction Guaranteed. 100% Secure Checkout.
                </p>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img src={item.imageUrl} alt={item.title} className="w-12 h-16 object-cover rounded bg-slate-100" />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">{item.title}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
