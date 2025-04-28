import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/components/cart-provider";
import type { WishlistItem } from "@/components/wishlist-provider";

// Define the store state types
interface StoreState {
  // Cart state
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;

  // Wishlist state
  wishlist: WishlistItem[];
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;

  // User state
  userId: string | null;
  setUserId: (userId: string | null) => void;

  // Network state
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;
  pendingOperations: PendingOperation[];
  addPendingOperation: (operation: PendingOperation) => void;
  removePendingOperation: (id: string) => void;
  processPendingOperations: () => void;
}

// Define pending operation for offline mode
export type PendingOperation = {
  id: string;
  type:
    | "ADD_TO_CART"
    | "REMOVE_FROM_CART"
    | "UPDATE_QUANTITY"
    | "ADD_TO_WISHLIST"
    | "REMOVE_FROM_WISHLIST";
  payload: any;
  timestamp: number;
};

// Create the store with persistence
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  quantity,
                },
              ],
            };
          }
        });

        // If offline, add to pending operations
        if (!get().isOnline) {
          get().addPendingOperation({
            id: `add-to-cart-${product.id}-${Date.now()}`,
            type: "ADD_TO_CART",
            payload: { product, quantity },
            timestamp: Date.now(),
          });
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));

        // If offline, add to pending operations
        if (!get().isOnline) {
          get().addPendingOperation({
            id: `remove-from-cart-${productId}-${Date.now()}`,
            type: "REMOVE_FROM_CART",
            payload: { productId },
            timestamp: Date.now(),
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));

        // If offline, add to pending operations
        if (!get().isOnline) {
          get().addPendingOperation({
            id: `update-quantity-${productId}-${Date.now()}`,
            type: "UPDATE_QUANTITY",
            payload: { productId, quantity },
            timestamp: Date.now(),
          });
        }
      },

      clearCart: () => set({ cart: [] }),

      isInCart: (productId) => {
        return get().cart.some((item) => item.id === productId);
      },

      // Wishlist state
      wishlist: [],
      addToWishlist: (product) => {
        set((state) => {
          const existingItem = state.wishlist.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return { wishlist: state.wishlist };
          } else {
            return {
              wishlist: [
                ...state.wishlist,
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  category: product.category || "",
                  description: product.description || "",
                  dateAdded: new Date().toISOString(),
                },
              ],
            };
          }
        });

        // If offline, add to pending operations
        if (!get().isOnline) {
          get().addPendingOperation({
            id: `add-to-wishlist-${product.id}-${Date.now()}`,
            type: "ADD_TO_WISHLIST",
            payload: { product },
            timestamp: Date.now(),
          });
        }
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        }));

        // If offline, add to pending operations
        if (!get().isOnline) {
          get().addPendingOperation({
            id: `remove-from-wishlist-${productId}-${Date.now()}`,
            type: "REMOVE_FROM_WISHLIST",
            payload: { productId },
            timestamp: Date.now(),
          });
        }
      },

      clearWishlist: () => set({ wishlist: [] }),

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      // User state
      userId: null,
      setUserId: (userId) => set({ userId }),

      // Network state
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      setOnline: (isOnline) => set({ isOnline }),

      pendingOperations: [],
      addPendingOperation: (operation) => {
        set((state) => ({
          pendingOperations: [...state.pendingOperations, operation],
        }));
      },

      removePendingOperation: (id) => {
        set((state) => ({
          pendingOperations: state.pendingOperations.filter(
            (op) => op.id !== id
          ),
        }));
      },

      processPendingOperations: () => {
        const { pendingOperations } = get();

        // Process operations in order
        pendingOperations.forEach((operation) => {
          // Here you would typically make API calls to sync with the server
          console.log(
            `Processing operation: ${operation.type}`,
            operation.payload
          );

          // Remove the operation after processing
          get().removePendingOperation(operation.id);
        });
      },
    }),
    {
      name: "ecommerce-store",
      version: 1,
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        pendingOperations: state.pendingOperations,
      }),
      // Migration function for handling version changes
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return {
            ...persistedState,
            // Add any new fields with default values
          };
        }
        return persistedState as StoreState;
      },
    }
  )
);
