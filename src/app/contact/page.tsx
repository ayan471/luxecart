import ContactCTA from "@/components/contact-cta";
import ContactFAQ from "@/components/contact-faq";
import ContactForm from "@/components/contact-form";
import ContactHero from "@/components/contact-hero";
import ContactInfo from "@/components/contact-info";
import ContactMap from "@/components/contact-map";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | LuxeMarket",
  description:
    "Get in touch with our customer support team for any questions or assistance with your orders.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      <ContactMap />
      <ContactFAQ />
      <ContactCTA />
    </div>
  );
}
