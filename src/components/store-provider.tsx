"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "@/lib/store";

import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

// Create context for optimistic UI updates
type OptimisticUpdateContextType = {
  performOptimisticUpdate: <T>(
    action: () => T,
    rollback: () => void,
    successMessage?: string,
    errorMessage?: string
  ) => Promise<T>;
};

const OptimisticUpdateContext =
  createContext<OptimisticUpdateContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get store methods
  const setUserId = useStore((state) => state.setUserId);
  const setOnline = useStore((state) => state.setOnline);
  const processPendingOperations = useStore(
    (state) => state.processPendingOperations
  );
  const isOnline = useStore((state) => state.isOnline);
  const pendingOperations = useStore((state) => state.pendingOperations);

  // Set up user ID when user changes
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [user, setUserId]);

  // Set up online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toast.success("You're back online!", {
        description: "Syncing your data...",
      });
      processPendingOperations();
    };

    const handleOffline = () => {
      setOnline(false);
      toast.error("You're offline", {
        description:
          "Changes will be saved and synced when you're back online.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setOnline(navigator.onLine);
    setIsInitialized(true);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline, toast, processPendingOperations]);

  // Process pending operations when coming back online
  useEffect(() => {
    if (isInitialized && isOnline && pendingOperations.length > 0) {
      processPendingOperations();
    }
  }, [isInitialized, isOnline, pendingOperations, processPendingOperations]);

  // Optimistic update handler
  const performOptimisticUpdate = async <T,>(
    action: () => T,
    rollback: () => void,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    try {
      // Perform the action immediately (optimistically)
      const result = action();

      // If we're online, we would typically make an API call here
      // and only show success after the API call completes
      if (isOnline && successMessage) {
        toast.success("Success", {
          description: successMessage,
        });
      }

      return result;
    } catch (error) {
      // If the action fails, roll back the optimistic update
      rollback();

      toast.error("Error", {
        description: errorMessage || "An error occurred. Please try again.",
      });

      throw error;
    }
  };

  return (
    <OptimisticUpdateContext.Provider value={{ performOptimisticUpdate }}>
      {children}
    </OptimisticUpdateContext.Provider>
  );
}

export function useOptimisticUpdate() {
  const context = useContext(OptimisticUpdateContext);

  if (!context) {
    throw new Error("useOptimisticUpdate must be used within a StoreProvider");
  }

  return context;
}
