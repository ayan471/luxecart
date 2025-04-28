"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "LuxeMarket was founded with a vision to create a premium online shopping destination.",
    image: "/path-to-your-image-1.jpg",
  },
  {
    year: "2019",
    title: "Expanding Horizons",
    description:
      "We expanded our product range and partnered with exclusive brands worldwide.",
    image: "/path-to-your-image-2.jpg",
  },
  {
    year: "2020",
    title: "Digital Innovation",
    description:
      "Launched our mobile app and implemented advanced personalization features.",
    image: "/path-to-your-image-3.jpg",
  },
  {
    year: "2021",
    title: "Global Reach",
    description:
      "Expanded to international markets and introduced worldwide shipping.",
    image: "/path-to-your-image-4.jpg",
  },
  {
    year: "2022",
    title: "Sustainability Focus",
    description:
      "Introduced eco-friendly packaging and sustainable product collections.",
    image: "/path-to-your-image-5.jpg",
  },
  {
    year: "2023",
    title: "Community Building",
    description: "Launched our loyalty program and exclusive member events.",
    image: "/path-to-your-image-6.jpg",
  },
];

export default function AboutStory() {
  return (
    <div className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From humble beginnings to becoming a leading premium marketplace,
            our journey has been defined by growth, innovation, and unwavering
            commitment to excellence.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 rounded-full"></div>

          <div className="space-y-24">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8`}
                >
                  <div className="md:w-1/2 text-center md:text-left">
                    <div
                      className={`inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-medium mb-4 ${
                        index % 2 === 0 ? "md:text-left" : "md:text-right"
                      }`}
                    >
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>

                  <div className="md:w-1/2 relative">
                    <div className="h-[250px] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={
                          milestone.image || `/about-milestone-${index + 1}.png`
                        }
                        alt={milestone.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background"></div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
