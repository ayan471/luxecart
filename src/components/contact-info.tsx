"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Address",
      details: [
        "123 Luxury Avenue",
        "San Francisco, CA 94103",
        "United States",
      ],
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: ["support@luxemarket.com", "info@luxemarket.com"],
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Hours",
      details: [
        "Monday-Friday: 9am - 6pm",
        "Saturday: 10am - 4pm",
        "Sunday: Closed",
      ],
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      name: "Facebook",
      url: "https://facebook.com",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      name: "Instagram",
      url: "https://instagram.com",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: "Twitter",
      url: "https://twitter.com",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: "LinkedIn",
      url: "https://linkedin.com",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-2 h-full">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

          <div className="space-y-8 mb-8">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Customer Support Priority</h3>
            <p className="text-sm text-muted-foreground">
              Premium members receive priority support with responses within 4
              hours during business hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
