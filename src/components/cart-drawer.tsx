"use client";

import { useState, useEffect } from "react";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDrop } from "react-dnd";
import { Badge } from "./ui/badge";
import { useUser } from "@clerk/nextjs";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    addToCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [dropHighlight, setDropHighlight] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // Auto-open cart when an item is dropped
  const [autoOpen, setAutoOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
      setAutoOpen(false);
    }
  }, [autoOpen]);

  // Make the cart a drop target
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "PRODUCT",
    drop: (item: any) => {
      // Handle the dropped product
      const { product } = item;
      if (product) {
        // Add the product to cart
        addToCart(product);
        // Highlight the drop area
        setDropHighlight(true);
        setTimeout(() => setDropHighlight(false), 500);
        // Auto-open the cart drawer
        setAutoOpen(true);
      }
      return { name: "Cart" };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Calculate shipping and tax
  const shipping = cartTotal > 50 ? 0 : 10;
  const tax = cartTotal * 0.07;
  const orderTotal = cartTotal + shipping + tax;

  // Handle checkout button click
  const handleCheckout = () => {
    setIsOpen(false);
    if (user) {
      router.push("/checkout");
    } else {
      const encodedRedirect = encodeURIComponent("/checkout");
      router.push(`/sign-in?redirect_url=${encodedRedirect}`);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div
        ref={drop}
        className={`relative ${
          isOver && canDrop ? "ring-2 ring-primary ring-opacity-50" : ""
        }`}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        {/* Visual indicator for drag and drop */}
        <AnimatePresence>
          {isOver && canDrop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold"
            >
              +1
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="h-8 text-muted-foreground"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4 py-4 border-b"
                  >
                    <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <div className="ml-auto text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  variant="outline"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button onClick={handleCheckout}>Checkout</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
