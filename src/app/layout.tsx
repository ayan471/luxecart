import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { DragDropProvider } from "@/components/dnd-provider";
import { StoreProvider } from "@/components/store-provider";
import NetworkStatus from "@/components/network-status";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LuxeMarket | Premium Shopping Experience",
  description:
    "A sophisticated e-commerce platform offering premium shopping experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              <StoreProvider>
                <CartProvider>
                  <WishlistProvider>
                    <DragDropProvider>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <NetworkStatus />
                        <main className="flex-1">{children}</main>
                        <Footer />
                      </div>
                      <Toaster />
                    </DragDropProvider>
                  </WishlistProvider>
                </CartProvider>
              </StoreProvider>
            </ThemeProvider>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
