import { Suspense } from "react";
import Hero from "@/components/hero";
import FeaturedProducts from "@/components/featured-products";
import Categories from "@/components/categories";
import Newsletter from "@/components/newsletter";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";
import AboutTestimonials from "@/components/about-testimonials";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <Categories />
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <Suspense fallback={<ProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </section>
      <AboutTestimonials />
      <Newsletter />
    </div>
  );
}
