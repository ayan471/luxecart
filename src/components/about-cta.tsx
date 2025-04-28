"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AboutCTA() {
  return (
    <div className="py-24 md:py-32 bg-primary/10">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the difference of shopping with LuxeMarket. Discover
            curated collections, exclusive offers, and a community that
            appreciates quality as much as you do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
