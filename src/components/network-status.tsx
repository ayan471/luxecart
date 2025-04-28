"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NetworkStatus() {
  const isOnline = useStore((state) => state.isOnline);
  const pendingOperations = useStore((state) => state.pendingOperations);
  const [showAlert, setShowAlert] = useState(false);

  // Show alert when network status changes or pending operations change
  useEffect(() => {
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOnline, pendingOperations.length]);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 left-0 right-0 z-50 flex justify-center px-4"
        >
          <Alert
            variant={isOnline ? "default" : "destructive"}
            className="w-full max-w-md shadow-lg"
          >
            {isOnline ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <AlertTitle>
              {isOnline ? "You're online" : "You're offline"}
            </AlertTitle>
            <AlertDescription>
              {isOnline
                ? pendingOperations.length > 0
                  ? `Syncing ${pendingOperations.length} pending changes...`
                  : "All changes are synced."
                : "Your changes will be saved locally and synced when you're back online."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
