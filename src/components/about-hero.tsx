"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutHero() {
  return (
    <div className="relative overflow-hidden bg-muted/30">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Founded in 2018, LuxeMarket was born from a simple idea: premium
              products shouldn't come with premium complexity.
            </p>
            <div className="flex items-center space-x-4">
              <div className="h-1 w-20 bg-primary"></div>
              <p className="text-lg font-medium">
                Redefining online shopping since 2018
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-hero.png"
                alt="LuxeMarket team"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-lg shadow-lg">
              <p className="text-4xl font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground">
                Years of Excellence
              </p>
            </div>
            <div className="absolute -top-6 -right-6 bg-background p-4 rounded-lg shadow-lg">
              <p className="text-4xl font-bold text-primary">100k+</p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
