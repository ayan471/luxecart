"use client";

import type React from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useEffect, useState } from "react";

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      };

      // Initial check
      checkIsMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkIsMobile);

      // Cleanup
      return () => window.removeEventListener("resize", checkIsMobile);
    }
  }, []);

  // Use TouchBackend for mobile devices and HTML5Backend for desktop
  const backend = isMobile ? TouchBackend : HTML5Backend;

  return <DndProvider backend={backend}>{children}</DndProvider>;
}
