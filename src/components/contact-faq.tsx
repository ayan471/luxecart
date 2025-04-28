"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be returned in their original condition and packaging. Premium members enjoy an extended 60-day return window and free return shipping.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by destination, typically 7-14 business days.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary based on location. Please note that customers are responsible for any import duties or taxes that may apply.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account on our website or contacting our customer service team.",
  },
  {
    question: "Are there any discounts for bulk orders?",
    answer:
      "Yes, we offer special pricing for bulk orders. Please contact our sales department at sales@luxemarket.com with details about your requirements, and a representative will provide you with a custom quote.",
  },
  {
    question: "How do I become a premium member?",
    answer:
      "Premium membership is available for $99/year or free with purchases totaling $1,000 or more within a calendar year. Benefits include free shipping, extended returns, early access to sales, and priority customer support.",
  },
];

export default function ContactFAQ() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions. If you need further
              assistance, don't hesitate to contact us.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
