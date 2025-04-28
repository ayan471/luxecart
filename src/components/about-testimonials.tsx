"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Fashion Designer",
    image: "/testimonial-1.png",
    quote:
      "LuxeMarket has completely transformed how I shop for premium products. The curation is impeccable, and the customer service is beyond compare.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Executive Chef",
    image: "/testimonial-2.png",
    quote:
      "As someone who demands quality in every aspect of life, I've found LuxeMarket to be the only online retailer that consistently meets my standards.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Interior Designer",
    image: "/testimonial-3.png",
    quote:
      "The attention to detail in both product selection and presentation sets LuxeMarket apart. It's my go-to for finding unique, high-quality pieces.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Tech Entrepreneur",
    image: "/testimonial-4.png",
    quote:
      "LuxeMarket combines luxury with convenience in a way no other platform does. Their tech products selection is particularly impressive.",
    rating: 4,
  },
];

export default function AboutTestimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  return (
    <div className="py-24 md:py-32 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our customers have to
            say about their LuxeMarket experience.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-2 border-primary/10">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3">
                      <div className="relative h-[150px] w-[150px] rounded-full overflow-hidden mx-auto">
                        <Image
                          src={
                            testimonials[current].image || "/placeholder.svg"
                          }
                          alt={testimonials[current].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                      <Quote className="h-10 w-10 text-primary/30 mb-4 mx-auto md:mx-0" />
                      <p className="text-xl italic mb-6">
                        {testimonials[current].quote}
                      </p>
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonials[current].rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <h3 className="text-lg font-bold">
                        {testimonials[current].name}
                      </h3>
                      <p className="text-muted-foreground">
                        {testimonials[current].role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  setAutoplay(false);
                  setTimeout(() => setAutoplay(true), 10000);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === current ? "w-8 bg-primary" : "w-2 bg-primary/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 h-10 w-10 rounded-full bg-background/80 text-foreground hover:bg-background hidden md:flex"
            onClick={prev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 h-10 w-10 rounded-full bg-background/80 text-foreground hover:bg-background hidden md:flex"
            onClick={next}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
