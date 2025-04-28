"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const { user } = useUser();
  const [dropHighlight, setDropHighlight] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Make the cart a drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PRODUCT",
    drop: () => {
      // Handle drop logic if needed
      setDropHighlight(true);
      setTimeout(() => setDropHighlight(false), 500);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Calculate free shipping progress
  const freeShippingThreshold = 50;
  const freeShippingProgress = Math.min(
    (subtotal / freeShippingThreshold) * 100,
    100
  );
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div
            ref={(node) => {
              drop(node);
              if (node) cartRef.current = node;
            }}
            className={`rounded-lg border p-4 mb-4 transition-colors ${
              dropHighlight || isOver ? "border-primary bg-primary/5" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Cart Items ({cart.length})
              </h2>
              <Button variant="outline" size="sm" onClick={clearCart}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: draggingItemId === item.id ? 0.5 : 1,
                    y: 0,
                    scale: draggingItemId === item.id ? 0.98 : 1,
                  }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-4 py-4 border-b last:border-0 ${
                    draggingItemId === item.id ? "opacity-50" : ""
                  }`}
                  layout
                >
                  <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="w-8 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <div className="w-24 text-right font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Drag products here to add to cart
            </h3>
            <p className="text-muted-foreground mb-4">
              Browse our products and drag them to your cart for a seamless
              shopping experience.
            </p>

            <Button asChild className="mt-2">
              <Link href="/products" className="flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {subtotal < freeShippingThreshold && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm mb-2">
                  Add{" "}
                  <span className="font-bold">
                    ${amountToFreeShipping.toFixed(2)}
                  </span>{" "}
                  more to get FREE shipping!
                </p>
                <Progress value={freeShippingProgress} className="h-2" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (7%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => {
                if (user) {
                  router.push("/checkout");
                } else {
                  const encodedRedirect = encodeURIComponent("/checkout");
                  router.push(`/sign-in?redirect_url=${encodedRedirect}`);
                }
              }}
            >
              Proceed to Checkout
            </Button>

            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="text-sm text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
