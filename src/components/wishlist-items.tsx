"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "./wishlist-provider";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function WishlistItems() {
  const { wishlist, removeFromWishlist, toggleWishlist, shareWishlist } =
    useWishlist();
  const { addToCart, isInCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground mb-4">
          Save items you love to your wishlist.
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {wishlist.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-muted/20">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-contain p-4"
                  />
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 text-red-500"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Added{" "}
                  {item.dateAdded
                    ? format(new Date(item.dateAdded), "MMM d, yyyy")
                    : "Recently"}
                </div>
                <Link href={`/products/${item.id}`} className="hover:underline">
                  <h3 className="font-medium line-clamp-1">{item.title}</h3>
                </Link>
                <div className="text-sm text-muted-foreground mb-2 capitalize">
                  {item.category || "Uncategorized"}
                </div>
                <div className="mt-1 mb-4 font-bold">
                  ${item.price.toFixed(2)}
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => addToCart(item)}
                  disabled={isInCart(item.id)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isInCart(item.id) ? "Added to Cart" : "Add to Cart"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
