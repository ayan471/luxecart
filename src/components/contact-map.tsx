"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Find Us</h2>
            <p className="text-muted-foreground">
              Visit our flagship store and headquarters
            </p>
          </div>

          <Card className="border-2 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full h-[400px]">
                {/* Replace with actual map integration if needed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.09854887883!2d-122.43913217768913!3d37.77492951191557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sca!4v1650458585404!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className={`transition-opacity duration-500 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsLoaded(true)}
                ></iframe>

                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Flagship Store</h3>
                <p className="text-muted-foreground">
                  123 Luxury Avenue
                  <br />
                  San Francisco, CA 94103
                  <br />
                  United States
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <path d="M13 13h4" />
                    <path d="M13 17h4" />
                    <path d="M9 13h.01" />
                    <path d="M9 17h.01" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Parking</h3>
                <p className="text-muted-foreground">
                  Complimentary valet parking
                  <br />
                  available for all customers
                  <br />
                  during store hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Store Hours</h3>
                <p className="text-muted-foreground">
                  Monday-Friday: 9am - 6pm
                  <br />
                  Saturday: 10am - 4pm
                  <br />
                  Sunday: Closed
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
