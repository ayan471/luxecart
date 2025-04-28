"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

import { useStore } from "@/lib/store";
import { useOptimisticUpdate } from "./store-provider";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { performOptimisticUpdate } = useOptimisticUpdate();

  // Get cart state and methods from Zustand store
  const cart = useStore((state) => state.cart);
  const addToCartStore = useStore((state) => state.addToCart);
  const removeFromCartStore = useStore((state) => state.removeFromCart);
  const updateQuantityStore = useStore((state) => state.updateQuantity);
  const clearCartStore = useStore((state) => state.clearCart);
  const isInCartStore = useStore((state) => state.isInCart);

  // Calculate cart count and total
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Set loading state to false after initial render
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Optimistic UI update for adding to cart
  const addToCart = (product: any, quantity = 1) => {
    // Save the current cart state for potential rollback
    const previousCart = [...cart];

    performOptimisticUpdate(
      () => {
        addToCartStore(product, quantity);
        return true;
      },
      () => {
        // Rollback function
        useStore.setState({ cart: previousCart });
      },
      `${product.title} has been added to your cart.`,
      "Failed to add item to cart. Please try again."
    );
  };

  // Optimistic UI update for removing from cart
  const removeFromCart = (productId: number) => {
    const previousCart = [...cart];

    performOptimisticUpdate(
      () => {
        removeFromCartStore(productId);
        return true;
      },
      () => {
        useStore.setState({ cart: previousCart });
      },
      "Item removed from cart.",
      "Failed to remove item from cart. Please try again."
    );
  };

  // Optimistic UI update for updating quantity
  const updateQuantity = (productId: number, quantity: number) => {
    const previousCart = [...cart];

    performOptimisticUpdate(
      () => {
        updateQuantityStore(productId, quantity);
        return true;
      },
      () => {
        useStore.setState({ cart: previousCart });
      }
    );
  };

  // Clear cart with confirmation
  const clearCart = () => {
    const previousCart = [...cart];

    performOptimisticUpdate(
      () => {
        clearCartStore();
        return true;
      },
      () => {
        useStore.setState({ cart: previousCart });
      },
      "Cart cleared successfully.",
      "Failed to clear cart. Please try again."
    );
  };

  // Check if item is in cart
  const isInCart = (productId: number) => {
    return isInCartStore(productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        cartCount,
        cartTotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
