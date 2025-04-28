"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <div className="relative overflow-hidden bg-muted/30">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
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
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
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

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              We'd love to hear from you. Our dedicated team is here to assist
              with any questions or concerns.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-1 w-20 bg-primary"></div>
              <p className="text-lg font-medium">We respond within 24 hours</p>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-primary/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}
