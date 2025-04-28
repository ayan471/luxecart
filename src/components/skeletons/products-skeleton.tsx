"use client";

import { motion } from "framer-motion";
import ProductCardSkeleton from "./product-card-skeleton";

export default function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}
