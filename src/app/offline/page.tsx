"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WifiOff, RefreshCw, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const isOnline = useStore((state) => state.isOnline);
  const pendingOperations = useStore((state) => state.pendingOperations);
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Check online status
  const checkOnlineStatus = () => {
    setLastChecked(new Date());
  };

  // Redirect if online
  useEffect(() => {
    if (isOnline) {
      window.location.href = "/";
    }
  }, [isOnline]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center mb-8">
        <WifiOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">You're offline</h1>
        <p className="text-muted-foreground mb-6">
          Don't worry! You can still browse your cart and wishlist. Your changes
          will be synced when you're back online.
        </p>
        <Button onClick={checkOnlineStatus} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Check connection
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
            </CardTitle>
            <CardDescription>
              Items in your cart that are available offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted/20 rounded-md flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      ) : (
                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      $
                      {cart
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Wishlist
            </CardTitle>
            <CardDescription>
              Items in your wishlist that are available offline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted/20 rounded-md flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      ) : (
                        <Heart className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-1">{item.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          {pendingOperations.length > 0
            ? `You have ${pendingOperations.length} pending changes that will be synced when you're back online.`
            : "All your changes are saved locally."}
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
