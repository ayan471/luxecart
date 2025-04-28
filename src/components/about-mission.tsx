"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutMission() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="py-24 md:py-32 bg-primary/5"
    >
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-5xl md:text-6xl font-light leading-tight mb-12">
          <span className="text-primary font-normal">Curating excellence</span>{" "}
          for those who appreciate the finer things in life.
        </p>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We believe that quality products deserve a quality shopping
          experience. Our mission is to connect discerning customers with
          premium products through a seamless, enjoyable, and trustworthy
          platform.
        </p>
      </div>
    </motion.div>
  );
}
