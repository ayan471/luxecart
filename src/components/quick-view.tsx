"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Heart, Minus, Plus, ShoppingCart, Star, ZoomIn } from "lucide-react";

type QuickViewProps = {
  product: {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
  children: React.ReactNode;
};

export default function QuickView({ product, children }: QuickViewProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setOpen(false);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square bg-muted/20 flex items-center justify-center p-8">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              className="object-contain max-h-[300px]"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/80"
              asChild
            >
              <Link href={`/products/${product.id}`}>
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">View full details</span>
              </Link>
            </Button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {product.category}
              </div>
              <h2 className="text-2xl font-bold mb-2">{product.title}</h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating.rate)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.rating.count} reviews)
                </span>
              </div>

              <div className="text-2xl font-bold mb-4">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {product.description}
              </p>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="w-8 text-center text-sm">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
              >
                <ShoppingCart className="h-4 w-4" />
                {isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={isInWishlist(product.id) ? "text-red-500" : ""}
                onClick={toggleWishlist}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </Button>
            </div>

            <div className="pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href={`/products/${product.id}`}>View Full Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
