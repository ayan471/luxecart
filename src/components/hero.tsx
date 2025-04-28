"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Hero slide data
const heroSlides = [
  {
    title: "Discover Premium Quality",
    subtitle: "Elevate your lifestyle with our curated collection",
    image: "/city-chic-haul.png",
    cta: "Shop Collection",
    link: "/products",
    color: "from-primary/30 to-primary/5",
  },
  {
    title: "New Season Arrivals",
    subtitle: "Refresh your style with the latest trends",
    image: "/urban-chic-collection.png",
    cta: "Explore Now",
    link: "/products?category=clothing",
    color: "from-blue-500/30 to-blue-500/5",
  },
  {
    title: "Exclusive Deals",
    subtitle: "Limited time offers on premium selections",
    image: "/gilded-savings.png",
    cta: "View Offers",
    link: "/products?sort=price-asc",
    color: "from-amber-500/30 to-amber-500/5",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div
      className="relative overflow-hidden rounded-2xl h-[500px] md:h-[600px] mb-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={slide.image || "/placeholder.svg"}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${slide.color} dark:from-background/80 dark:to-background/40`}
        />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
            Featured Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-md">
            {slide.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href={slide.link}>
                {slide.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/80 text-foreground hover:bg-background"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/80 text-foreground hover:bg-background"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
