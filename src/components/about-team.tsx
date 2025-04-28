"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Alexandra Chen",
    role: "Founder & CEO",
    bio: "With over 15 years in luxury retail, Alexandra founded LuxeMarket to bridge the gap between premium products and digital convenience.",
    image: "/team-member-1.png",
  },
  {
    name: "Marcus Williams",
    role: "Chief Product Officer",
    bio: "Marcus oversees our product curation process, ensuring that every item meets our exacting standards for quality and craftsmanship.",
    image: "/team-member-2.png",
  },
  {
    name: "Sophia Rodriguez",
    role: "Head of Customer Experience",
    bio: "Sophia leads our customer service team, dedicated to providing a shopping experience as premium as our products.",
    image: "/team-member-3.png",
  },
  {
    name: "David Kim",
    role: "Creative Director",
    bio: "David brings our brand to life through compelling visuals and storytelling that captures the essence of luxury.",
    image: "/team-member-4.png",
  },
];

export default function AboutTeam() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The passionate individuals behind LuxeMarket who work tirelessly to
            bring you an exceptional shopping experience.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
