"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import QuickView from "./quick-view";

type ProductCardProps = {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating?: {
      rate: number;
      count: number;
    };
  };
  enableDrag?: boolean;
};

export default function ProductCard({
  product,
  enableDrag = false,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const dragRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "PRODUCT",
      item: { id: product.id, product },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      // Disable drag if enableDrag is false
      canDrag: enableDrag,
    }),
    [enableDrag, product.id, product]
  );

  // Apply the drag ref only when enableDrag is true
  if (enableDrag) {
    drag(dragRef);
  }

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={enableDrag ? "cursor-grab" : ""}
    >
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-primary/50">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain p-4 transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 ${
              isInWishlist(product.id)
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist(product.id) ? "fill-current" : ""
              }`}
            />
          </Button>

          <div
            className={`absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4 transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <Button
              className="w-full gap-2"
              onClick={() => addToCart(product)}
              disabled={isInCart(product.id)}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart(product.id) ? "Added" : "Add to Cart"}
            </Button>

            <QuickView product={product}>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </QuickView>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 className="font-medium line-clamp-2 min-h-[48px]">
              {product.title}
            </h3>
          </Link>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="font-bold">${product.price.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Free shipping</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
