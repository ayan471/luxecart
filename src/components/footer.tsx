import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">LuxeMarket</h3>
            <p className="text-muted-foreground mb-4">
              Premium shopping experience with curated products for discerning
              customers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=electronics"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=jewelery"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Jewelry
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=men's%20clothing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=women's%20clothing"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Women's Clothing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Login / Register
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-foreground"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground mb-4">
              123 Market Street
              <br />
              San Francisco, CA 94103
              <br />
              United States
            </address>
            <p className="text-muted-foreground mb-2">
              Email: support@luxemarket.com
            </p>
            <p className="text-muted-foreground mb-4">
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} LuxeMarket. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/shipping" className="hover:text-foreground">
              Shipping Policy
            </Link>
            <Link href="/refund" className="hover:text-foreground">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
