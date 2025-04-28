"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { Heart, Menu, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import CartDrawer from "./cart-drawer";
import { useWishlist } from "./wishlist-provider";

export default function Header() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Products
                  </Link>
                  <Link
                    href="/categories"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                  <SignedIn>
                    <Link
                      href="/account"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      My Account
                    </Link>
                  </SignedIn>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 ml-4 md:ml-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="font-bold text-xl hidden md:inline-block">
                LuxeMarket
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-10">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/products"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/categories"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/about"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/contact"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block"
                >
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-[200px] lg:w-[300px]"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist" aria-label="Wishlist" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>

            <CartDrawer />

            <div className="flex items-center">
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "h-9 w-9",
                      userButtonTrigger: "h-9 w-9 rounded-full border",
                    },
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="ml-2 hidden md:flex"
                >
                  <Link href="/account">My Account</Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/sign-in" aria-label="Account">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
