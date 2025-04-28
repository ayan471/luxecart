"use client";

import { useState } from "react";
import { useWishlist } from "@/components/wishlist-provider";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Share2,
  Trash2,
  Calendar,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, shareWishlist } =
    useWishlist();
  const { addToCart } = useCart();
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [sortBy, setSortBy] = useState("date-added");
  const [filterText, setFilterText] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Handle sharing wishlist
  const handleShareWishlist = async () => {
    const link = await shareWishlist();
    setShareLink(link);
    setShareDialogOpen(true);
  };

  // Filter and sort wishlist items
  const filteredAndSortedWishlist = [...wishlist]
    .filter(
      (item) =>
        item.title.toLowerCase().includes(filterText.toLowerCase()) ||
        item.category.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "date-added":
        default:
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
    });

  // Redirect to login if not signed in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in?redirect_url=/wishlist");
    return null;
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Empty wishlist state
  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Save items you love to your wishlist.
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} items saved</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleShareWishlist}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Wishlist
          </Button>
          <Button variant="outline" size="sm" onClick={clearWishlist}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Filter items..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 w-full md:w-[250px]"
            />
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-added">Date Added (Newest)</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredAndSortedWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      <Link href={`/products/${item.id}`}>
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                        />
                      </Link>

                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardContent className="flex-grow p-4">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Added{" "}
                        {item.dateAdded
                          ? format(new Date(item.dateAdded), "MMM d, yyyy")
                          : "Recently"}
                      </div>
                      <Link
                        href={`/products/${item.id}`}
                        className="hover:underline"
                      >
                        <h3 className="font-medium line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="text-sm text-muted-foreground mb-2 capitalize">
                        {item.category}
                      </div>
                      <div className="font-bold">${item.price.toFixed(2)}</div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full gap-2"
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.id);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Move to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredAndSortedWishlist.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Card>
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-48 bg-muted/20">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain p-4"
                        />
                      </div>

                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Added{" "}
                              {item.dateAdded
                                ? format(
                                    new Date(item.dateAdded),
                                    "MMM d, yyyy"
                                  )
                                : "Recently"}
                            </div>
                            <Link
                              href={`/products/${item.id}`}
                              className="hover:underline"
                            >
                              <h3 className="font-medium mb-1">{item.title}</h3>
                            </Link>
                            <div className="text-sm text-muted-foreground mb-2 capitalize">
                              {item.category}
                            </div>
                            <div className="font-bold mb-4">
                              ${item.price.toFixed(2)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromWishlist(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => {
                              addToCart(item);
                              removeFromWishlist(item.id);
                            }}
                            className="gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Move to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Wishlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Share this link with friends so they can see your wishlist items.
            </p>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
                Copy
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=Check out my wishlist!&url=${encodeURIComponent(
                      shareLink
                    )}`,
                    "_blank"
                  )
                }
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareLink
                    )}`,
                    "_blank"
                  )
                }
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `mailto:?subject=Check out my wishlist!&body=${encodeURIComponent(
                      shareLink
                    )}`,
                    "_blank"
                  )
                }
              >
                Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
