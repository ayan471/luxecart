"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <div className="py-16 md:py-24 bg-primary/10">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need Immediate Assistance?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our customer service team is available via live chat during business
            hours for urgent inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8">
              Start Live Chat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <Link href="/faq">Browse FAQ</Link>
            </Button>
          </div>

          <div className="mt-12 p-6 bg-background rounded-lg border-2 max-w-md mx-auto">
            <h3 className="font-bold text-lg mb-2">Customer Support Hours</h3>
            <p className="text-muted-foreground mb-4">
              Our team is available to assist you during the following hours:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-right font-medium">Monday - Friday:</div>
              <div>9:00 AM - 8:00 PM EST</div>
              <div className="text-right font-medium">Saturday:</div>
              <div>10:00 AM - 6:00 PM EST</div>
              <div className="text-right font-medium">Sunday:</div>
              <div>Closed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
