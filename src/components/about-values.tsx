"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Sparkles, Award, Gem, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: <Gem className="h-10 w-10" />,
    title: "Quality",
    description:
      "We meticulously select only the finest products that meet our rigorous standards.",
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Passion",
    description:
      "Our team is driven by a genuine passion for exceptional products and experiences.",
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Trust",
    description:
      "We build lasting relationships through transparency, reliability, and integrity.",
  },
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: "Innovation",
    description:
      "We continuously evolve our platform to enhance your shopping experience.",
  },
  {
    icon: <Award className="h-10 w-10" />,
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of our service and offerings.",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Community",
    description:
      "We foster a community of like-minded individuals who appreciate quality.",
  },
];

export default function AboutValues() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These core principles guide everything we do, from product selection
            to customer service.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {values.map((value, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-primary/10 text-primary mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
