import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    toggleCart();
    setLocation("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:w-[450px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Your Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any study materials yet.</p>
            <Button onClick={toggleCart} className="w-full max-w-xs">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <Link href={`/product/${item.slug}`} className="line-clamp-2 hover:underline mr-4">
                          {item.title}
                        </Link>
                        <p className="ml-4">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{item.edition || "Latest Edition"}</p>
                      <div className="flex flex-1 items-end justify-between text-sm mt-4">
                        <div className="flex items-center border rounded-md">
                          <button 
                            className="p-1 hover:bg-slate-100 disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-slate-100"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="font-medium text-destructive hover:text-destructive/80 flex items-center gap-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="p-6 border-t bg-slate-50 flex-col sm:flex-col sm:space-x-0 gap-4">
              <div className="flex items-center justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>${total().toFixed(2)}</p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Shipping & taxes calculated at checkout. Instant download available after payment.
              </p>
              <Button onClick={handleCheckout} className="w-full btn-primary h-12 text-lg">
                Checkout Now
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
