"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { useStore } from "@/lib/store";
import { useOptimisticUpdate } from "./store-provider";
import { toast } from "sonner";

export type WishlistItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  dateAdded: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
  moveToCart: (productId: number) => void;
  wishlistCount: number;
  toggleWishlist: (product: any) => void;
  shareWishlist: () => Promise<string>;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { performOptimisticUpdate } = useOptimisticUpdate();

  // Get wishlist state and methods from Zustand store
  const wishlist = useStore((state) => state.wishlist);
  const addToWishlistStore = useStore((state) => state.addToWishlist);
  const removeFromWishlistStore = useStore((state) => state.removeFromWishlist);
  const clearWishlistStore = useStore((state) => state.clearWishlist);
  const isInWishlistStore = useStore((state) => state.isInWishlist);
  const addToCartStore = useStore((state) => state.addToCart);
  const isOnline = useStore((state) => state.isOnline);

  // Calculate wishlist count
  const wishlistCount = wishlist.length;

  // Set loading state to false after initial render
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Optimistic UI update for adding to wishlist
  const addToWishlist = (product: any) => {
    // Save the current wishlist state for potential rollback
    const previousWishlist = [...wishlist];

    performOptimisticUpdate(
      () => {
        addToWishlistStore(product);
        return true;
      },
      () => {
        // Rollback function
        useStore.setState({ wishlist: previousWishlist });
      },
      `${product.title} has been added to your wishlist.`,
      "Failed to add item to wishlist. Please try again."
    );
  };

  // Optimistic UI update for removing from wishlist
  const removeFromWishlist = (productId: number) => {
    const previousWishlist = [...wishlist];

    performOptimisticUpdate(
      () => {
        removeFromWishlistStore(productId);
        return true;
      },
      () => {
        useStore.setState({ wishlist: previousWishlist });
      },
      "Item removed from wishlist.",
      "Failed to remove item from wishlist. Please try again."
    );
  };

  // Clear wishlist with confirmation
  const clearWishlist = () => {
    const previousWishlist = [...wishlist];

    performOptimisticUpdate(
      () => {
        clearWishlistStore();
        return true;
      },
      () => {
        useStore.setState({ wishlist: previousWishlist });
      },
      "Wishlist cleared successfully.",
      "Failed to clear wishlist. Please try again."
    );
  };

  // Check if item is in wishlist
  const isInWishlist = (productId: number) => {
    return isInWishlistStore(productId);
  };

  // Toggle wishlist item
  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Move item from wishlist to cart
  const moveToCart = (productId: number) => {
    const item = wishlist.find((item) => item.id === productId);

    if (item) {
      const previousWishlist = [...wishlist];
      const previousCart = useStore.getState().cart;

      performOptimisticUpdate(
        () => {
          addToCartStore(item);
          removeFromWishlistStore(productId);
          return true;
        },
        () => {
          useStore.setState({
            wishlist: previousWishlist,
            cart: previousCart,
          });
        },
        "Item moved to cart.",
        "Failed to move item to cart. Please try again."
      );
    }
  };

  // Generate a shareable link for the wishlist
  const shareWishlist = async (): Promise<string> => {
    try {
      // Create a simplified version of the wishlist for sharing
      const shareableData = wishlist.map((item) => ({
        id: item.id,
        title: item.title,
      }));

      // In a real app, you would send this to your backend and get a unique URL
      // For now, we'll just encode it
      const encodedData = encodeURIComponent(JSON.stringify(shareableData));
      const shareableLink = `${window.location.origin}/shared-wishlist?data=${encodedData}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareableLink);

      toast.success("Wishlist link copied!", {
        description: "Share this link with friends to show them your wishlist.",
      });

      return shareableLink;
    } catch (error) {
      console.error("Failed to share wishlist:", error);
      toast.error("Failed to share wishlist", {
        description: "An error occurred while creating a shareable link.",
      });
      return "";
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        moveToCart,
        wishlistCount,
        toggleWishlist,
        shareWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
