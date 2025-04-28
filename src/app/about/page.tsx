import type { Metadata } from "next";
import AboutHero from "@/components/about-hero";
import AboutMission from "@/components/about-mission";
import AboutValues from "@/components/about-values";
import AboutTeam from "@/components/about-team";
import AboutStory from "@/components/about-story";
import AboutTestimonials from "@/components/about-testimonials";
import AboutCTA from "@/components/about-cta";

export const metadata: Metadata = {
  title: "About Us | LuxeMarket",
  description:
    "Learn about our story, mission, and the team behind LuxeMarket's premium shopping experience.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStory />
      <AboutTeam />
      <AboutTestimonials />
      <AboutCTA />
    </div>
  );
}
