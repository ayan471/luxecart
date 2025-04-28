"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ProductDetailProps = {
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
};

// Generate mock additional images based on the main image
const generateMockImages = (mainImage: string) => {
  return [mainImage, mainImage, mainImage];
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);

  // Generate mock additional images
  const productImages = generateMockImages(product.image);

  const controls = useAnimation();

  const handleAddToCart = () => {
    addToCart(product, quantity);
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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [dx], velocity }) => {
      if (velocity > 0.2) {
        if (dx > 0) {
          prevImage();
        } else {
          nextImage();
        }
      } else {
        controls.start({ x: 0 });
      }
    },
    onDragEnd: () => {
      controls.start({ x: 0 });
    },
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div
          ref={imageContainerRef}
          className="relative aspect-square overflow-hidden rounded-lg border bg-muted/20"
          onMouseMove={handleZoom}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          {...bind()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Image
                src={productImages[activeImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className={`object-contain p-4 transition-transform duration-300 ${
                  isZoomed ? "scale-150" : ""
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-background/80"
            onClick={() => setShowFullscreenGallery(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {productImages.map((image, index) => (
            <Button
              key={index}
              variant={activeImageIndex === index ? "default" : "outline"}
              size="icon"
              className="h-20 w-20 rounded-lg p-0"
              onClick={() => setActiveImageIndex(index)}
            >
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - Image ${index + 1}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating.rate)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.rating.count} reviews)
              </span>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="text-sm text-muted-foreground">
              {product.rating.count > 50 ? "In stock" : "Low stock"}
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

        <p className="text-muted-foreground">{product.description}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-12 text-center">{quantity}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
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

          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span>Free shipping on orders over $50</span>
          </div>
        </div>

        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex-1">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card className="p-4">
              <p>{product.description}</p>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Category</div>
                <div className="text-sm">{product.category}</div>

                <div className="text-sm font-medium">Material</div>
                <div className="text-sm">Premium Quality</div>

                <div className="text-sm font-medium">Rating</div>
                <div className="text-sm">{product.rating.rate} out of 5</div>

                <div className="text-sm font-medium">Stock</div>
                <div className="text-sm">{product.rating.count} units</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <Card className="p-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                <div className="flex justify-center items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating.rate)
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {product.rating.count} reviews
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fullscreen Gallery Modal */}
      <Dialog
        open={showFullscreenGallery}
        onOpenChange={setShowFullscreenGallery}
      >
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={productImages[activeImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-8"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-8">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {productImages.map((_, index) => (
                <Button
                  key={index}
                  variant={activeImageIndex === index ? "default" : "secondary"}
                  size="sm"
                  className="h-2 w-2 rounded-full p-0"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <span className="sr-only">Go to image {index + 1}</span>
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
